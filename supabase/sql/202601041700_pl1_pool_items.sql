-- PL-1: Product Type Pool
-- Date: 2026-01-04
-- Purpose: Add pl_pool_items table for product type pool management

-- Create pl_pool_items table
CREATE TABLE IF NOT EXISTS public.pl_pool_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE CASCADE,
  moment_id TEXT NOT NULL REFERENCES public.pl_moments(id) ON DELETE CASCADE,
  category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL,
  note TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pl_pool_items_age_band_moment_idx ON public.pl_pool_items(age_band_id, moment_id);
CREATE INDEX IF NOT EXISTS pl_pool_items_category_type_idx ON public.pl_pool_items(category_type_id);

-- Updated_at trigger
CREATE TRIGGER trg_pl_pool_items_updated_at BEFORE UPDATE ON public.pl_pool_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.pl_pool_items ENABLE ROW LEVEL SECURITY;

-- Admin-only CRUD policies
CREATE POLICY "pl_pool_items_admin_all" ON public.pl_pool_items
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

