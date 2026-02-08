-- Migration: pl_category_type_images + v_gateway_category_type_images
-- Date: 2026-02-08
-- Purpose: Category imagery mapping so founder can swap URLs without code. Public reads via gateway view only.

-- ============================================================================
-- PART 1: CREATE pl_category_type_images TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.pl_category_type_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS pl_category_type_images_category_type_id_idx
  ON public.pl_category_type_images(category_type_id);

CREATE INDEX IF NOT EXISTS pl_category_type_images_active_sort_idx
  ON public.pl_category_type_images(category_type_id, is_active, sort)
  WHERE is_active = true;

-- RLS: canonical table protected; no direct public read
ALTER TABLE public.pl_category_type_images ENABLE ROW LEVEL SECURITY;

-- Admin/service role only (writes via API); anon/authenticated read via gateway view
DROP POLICY IF EXISTS "pl_category_type_images_admin_all" ON public.pl_category_type_images;
CREATE POLICY "pl_category_type_images_admin_all" ON public.pl_category_type_images
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================================================
-- PART 2: CREATE v_gateway_category_type_images VIEW
-- ============================================================================

DROP VIEW IF EXISTS public.v_gateway_category_type_images;

-- security_invoker = false so view runs with owner privileges (bypasses RLS on canonical table)
CREATE VIEW public.v_gateway_category_type_images
  WITH (security_invoker = false)
AS
SELECT
  category_type_id,
  image_url,
  alt
FROM public.pl_category_type_images
WHERE is_active = true
ORDER BY category_type_id, sort, created_at;

-- Grant SELECT to anon and authenticated (public read path)
GRANT SELECT ON public.v_gateway_category_type_images TO anon, authenticated;
