-- PL Taxonomy: Category Types + Products Link
-- Date: 2026-01-05
-- Purpose: Create pl_category_types table and link products to category types

-- Create pl_category_types table
CREATE TABLE IF NOT EXISTS public.pl_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS pl_category_types_slug_idx ON public.pl_category_types(slug);

-- Updated_at trigger
DROP TRIGGER IF EXISTS trg_pl_category_types_updated_at ON public.pl_category_types;
CREATE TRIGGER trg_pl_category_types_updated_at BEFORE UPDATE ON public.pl_category_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS (safe to re-run, no error if already enabled)
ALTER TABLE public.pl_category_types ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read (for dropdowns in admin UI)
DROP POLICY IF EXISTS "pl_category_types_authenticated_read" ON public.pl_category_types;
CREATE POLICY "pl_category_types_authenticated_read" ON public.pl_category_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin writes go via service-role server routes, so we keep write policies strict
-- (No direct write policy for users - all writes via API routes with service role)

-- Add category_type_id to products table
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL;

-- Index for category_type_id lookups
CREATE INDEX IF NOT EXISTS products_category_type_idx ON public.products(category_type_id);

