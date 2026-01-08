-- PL Taxonomy: Category Types + Products Link
-- Date: 2026-01-05
-- Purpose: Add name column to pl_category_types (if missing) and link products to category types

-- Note: pl_category_types table already exists from PL-0 migration with 'label' column
-- Add 'name' column if it doesn't exist (for consistency with requirements)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'pl_category_types'
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.pl_category_types ADD COLUMN name TEXT;
    -- Populate name from label for existing rows
    UPDATE public.pl_category_types SET name = label WHERE name IS NULL;
    -- Make name required
    ALTER TABLE public.pl_category_types ALTER COLUMN name SET NOT NULL;
    -- Add unique constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'pl_category_types_name_unique'
    ) THEN
      ALTER TABLE public.pl_category_types ADD CONSTRAINT pl_category_types_name_unique UNIQUE (name);
    END IF;
  END IF;
END $$;

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

