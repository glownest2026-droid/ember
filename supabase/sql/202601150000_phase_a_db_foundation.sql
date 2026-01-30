-- Phase A: DB Foundation (Gateway Spine + Curated Public Views)
-- Date: 2026-01-15
-- Purpose: Create Phase A gateway spine tables, curated public views, triggers, RLS, and populate from seed tables
-- Scope: MVP age bands 23-25m and 25-27m
-- Idempotent: Safe to re-run (uses IF NOT EXISTS, ON CONFLICT, etc.)

-- ============================================================================
-- PART 0: PREFLIGHT CHECKS
-- ============================================================================

-- Check that is_admin() function exists (required for RLS policies)
DO $$
BEGIN
  IF to_regprocedure('public.is_admin()') IS NULL THEN
    RAISE EXCEPTION 'Required function public.is_admin() does not exist. Please run the migration that creates this function first (typically in pl0_product_library.sql or similar).';
  END IF;
END $$;

-- Check that products.is_archived column exists (required for products view)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'is_archived'
  ) THEN
    RAISE EXCEPTION 'Required column products.is_archived does not exist. Please add this column to the products table before running this migration.';
  END IF;
END $$;

-- ============================================================================
-- PART 1: HELPER FUNCTIONS
-- ============================================================================

-- Ensure set_updated_at() function exists (shared trigger function)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Slugify helper for UX wrapper slugs
CREATE OR REPLACE FUNCTION public.slugify_ux_label(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Prevent updates to pl_age_bands.id (immutability)
CREATE OR REPLACE FUNCTION public.prevent_age_band_id_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'pl_age_bands.id is immutable and cannot be updated';
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================================
-- PART 2: CREATE PHASE A GATEWAY SPINE TABLES
-- ============================================================================

-- pl_ux_wrappers: Parent-friendly UX labels
CREATE TABLE IF NOT EXISTS public.pl_ux_wrappers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_label TEXT NOT NULL,
  ux_slug TEXT NOT NULL,
  ux_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_ux_wrapper_needs: Maps UX wrapper to development need (1:1 via UNIQUE)
CREATE TABLE IF NOT EXISTS public.pl_ux_wrapper_needs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ux_wrapper_id UUID NOT NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_ux_wrapper_needs_ux_wrapper_id_unique UNIQUE (ux_wrapper_id)
);

-- pl_age_band_ux_wrappers: Age-band-specific ranking of UX wrapper cards
CREATE TABLE IF NOT EXISTS public.pl_age_band_ux_wrappers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  ux_wrapper_id UUID NOT NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_ux_wrappers_age_band_wrapper_unique UNIQUE (age_band_id, ux_wrapper_id)
);

-- pl_age_band_development_need_meta: Age-band-specific stage metadata for development needs
CREATE TABLE IF NOT EXISTS public.pl_age_band_development_need_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  stage_anchor_month INTEGER,
  stage_phase TEXT,
  stage_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_development_need_meta_unique UNIQUE (age_band_id, development_need_id)
);

-- pl_age_band_development_need_category_types: Age-band-specific mapping from needs to category types
CREATE TABLE IF NOT EXISTS public.pl_age_band_development_need_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  development_need_id UUID NOT NULL REFERENCES public.pl_development_needs(id) ON DELETE CASCADE,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  rationale TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_development_need_category_types_unique UNIQUE (age_band_id, development_need_id, category_type_id)
);

-- pl_age_band_category_type_products: Age-band-specific mapping from category types to products
CREATE TABLE IF NOT EXISTS public.pl_age_band_category_type_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  rationale TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pl_age_band_category_type_products_unique UNIQUE (age_band_id, category_type_id, product_id)
);

-- ============================================================================
-- PART 2B: ADD RATIONALE COLUMNS IF MISSING (idempotent)
-- ============================================================================

-- Add rationale column to pl_age_band_development_need_category_types if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_age_band_development_need_category_types' 
      AND column_name = 'rationale'
  ) THEN
    ALTER TABLE public.pl_age_band_development_need_category_types ADD COLUMN rationale TEXT;
  END IF;
END $$;

-- Add rationale column to pl_age_band_category_type_products if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_age_band_category_type_products' 
      AND column_name = 'rationale'
  ) THEN
    ALTER TABLE public.pl_age_band_category_type_products ADD COLUMN rationale TEXT;
  END IF;
END $$;

-- Add is_active column to pl_ux_wrappers if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND table_name = 'pl_ux_wrappers' 
      AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.pl_ux_wrappers ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- PART 3: CREATE INDEXES
-- ============================================================================

-- pl_ux_wrappers indexes
CREATE UNIQUE INDEX IF NOT EXISTS pl_ux_wrappers_ux_slug_idx ON public.pl_ux_wrappers(ux_slug);

-- pl_ux_wrapper_needs indexes
CREATE UNIQUE INDEX IF NOT EXISTS pl_ux_wrapper_needs_ux_wrapper_id_idx ON public.pl_ux_wrapper_needs(ux_wrapper_id);
CREATE INDEX IF NOT EXISTS pl_ux_wrapper_needs_development_need_id_idx ON public.pl_ux_wrapper_needs(development_need_id);

-- pl_age_band_ux_wrappers indexes
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_age_band_id_idx ON public.pl_age_band_ux_wrappers(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_ux_wrapper_id_idx ON public.pl_age_band_ux_wrappers(ux_wrapper_id);
CREATE INDEX IF NOT EXISTS pl_age_band_ux_wrappers_age_band_rank_idx ON public.pl_age_band_ux_wrappers(age_band_id, rank);

-- pl_age_band_development_need_meta indexes
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_meta_age_band_id_idx ON public.pl_age_band_development_need_meta(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_meta_development_need_id_idx ON public.pl_age_band_development_need_meta(development_need_id);

-- pl_age_band_development_need_category_types indexes
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_age_band_id_idx ON public.pl_age_band_development_need_category_types(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_development_need_id_idx ON public.pl_age_band_development_need_category_types(development_need_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_category_type_id_idx ON public.pl_age_band_development_need_category_types(category_type_id);
CREATE INDEX IF NOT EXISTS pl_age_band_development_need_category_types_age_band_need_rank_idx ON public.pl_age_band_development_need_category_types(age_band_id, development_need_id, rank);

-- pl_age_band_category_type_products indexes
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_age_band_id_idx ON public.pl_age_band_category_type_products(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_category_type_id_idx ON public.pl_age_band_category_type_products(category_type_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_product_id_idx ON public.pl_age_band_category_type_products(product_id);
CREATE INDEX IF NOT EXISTS pl_age_band_category_type_products_age_band_category_rank_idx ON public.pl_age_band_category_type_products(age_band_id, category_type_id, rank);

-- ============================================================================
-- PART 4: CREATE TRIGGERS (updated_at)
-- ============================================================================

-- Drop existing triggers if they exist (idempotent)
DROP TRIGGER IF EXISTS trg_pl_ux_wrappers_updated_at ON public.pl_ux_wrappers;
DROP TRIGGER IF EXISTS trg_pl_ux_wrapper_needs_updated_at ON public.pl_ux_wrapper_needs;
DROP TRIGGER IF EXISTS trg_pl_age_band_ux_wrappers_updated_at ON public.pl_age_band_ux_wrappers;
DROP TRIGGER IF EXISTS trg_pl_age_band_development_need_meta_updated_at ON public.pl_age_band_development_need_meta;
DROP TRIGGER IF EXISTS trg_pl_age_band_development_need_category_types_updated_at ON public.pl_age_band_development_need_category_types;
DROP TRIGGER IF EXISTS trg_pl_age_band_category_type_products_updated_at ON public.pl_age_band_category_type_products;

-- Create triggers
CREATE TRIGGER trg_pl_ux_wrappers_updated_at
  BEFORE UPDATE ON public.pl_ux_wrappers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_ux_wrapper_needs_updated_at
  BEFORE UPDATE ON public.pl_ux_wrapper_needs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_ux_wrappers_updated_at
  BEFORE UPDATE ON public.pl_age_band_ux_wrappers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_development_need_meta_updated_at
  BEFORE UPDATE ON public.pl_age_band_development_need_meta
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_development_need_category_types_updated_at
  BEFORE UPDATE ON public.pl_age_band_development_need_category_types
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_band_category_type_products_updated_at
  BEFORE UPDATE ON public.pl_age_band_category_type_products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 5: IMMUTABILITY TRIGGER FOR pl_age_bands.id
-- ============================================================================

DROP TRIGGER IF EXISTS trg_pl_age_bands_prevent_id_update ON public.pl_age_bands;
CREATE TRIGGER trg_pl_age_bands_prevent_id_update
  BEFORE UPDATE ON public.pl_age_bands
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_age_band_id_update();

-- ============================================================================
-- PART 6: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE public.pl_ux_wrappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_ux_wrapper_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_ux_wrappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_development_need_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_development_need_category_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_band_category_type_products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DO $$
DECLARE
  tables TEXT[] := ARRAY[
    'pl_ux_wrappers',
    'pl_ux_wrapper_needs',
    'pl_age_band_ux_wrappers',
    'pl_age_band_development_need_meta',
    'pl_age_band_development_need_category_types',
    'pl_age_band_category_type_products'
  ];
  tbl TEXT;
  pol RECORD;
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    FOR pol IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl)
    LOOP
      EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.' || quote_ident(tbl);
    END LOOP;
  END LOOP;
END $$;

-- Admin CRUD policies (using is_admin() function)
-- Note: Assumes is_admin() function exists (from previous migrations)

-- pl_ux_wrappers policies
CREATE POLICY "pl_ux_wrappers_admin_all" ON public.pl_ux_wrappers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_ux_wrapper_needs policies
CREATE POLICY "pl_ux_wrapper_needs_admin_all" ON public.pl_ux_wrapper_needs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_ux_wrappers policies
CREATE POLICY "pl_age_band_ux_wrappers_admin_all" ON public.pl_age_band_ux_wrappers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_development_need_meta policies
CREATE POLICY "pl_age_band_development_need_meta_admin_all" ON public.pl_age_band_development_need_meta
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_development_need_category_types policies
CREATE POLICY "pl_age_band_development_need_category_types_admin_all" ON public.pl_age_band_development_need_category_types
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_band_category_type_products policies
CREATE POLICY "pl_age_band_category_type_products_admin_all" ON public.pl_age_band_category_type_products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PART 7: CREATE CURATED PUBLIC VIEWS
-- ============================================================================

-- Drop existing views if they exist (idempotent)
DROP VIEW IF EXISTS public.v_gateway_age_bands_public;
DROP VIEW IF EXISTS public.v_gateway_wrappers_public;
DROP VIEW IF EXISTS public.v_gateway_development_needs_public;
DROP VIEW IF EXISTS public.v_gateway_category_types_public;
DROP VIEW IF EXISTS public.v_gateway_products_public;
DROP VIEW IF EXISTS public.v_gateway_wrapper_detail_public;

-- v_gateway_age_bands_public: Only age bands with at least one active wrapper ranking
CREATE VIEW public.v_gateway_age_bands_public AS
SELECT DISTINCT
  ab.id,
  ab.label,
  ab.min_months,
  ab.max_months
FROM public.pl_age_bands ab
INNER JOIN public.pl_age_band_ux_wrappers abuw ON ab.id = abuw.age_band_id
WHERE ab.is_active = true
  AND abuw.is_active = true;

-- v_gateway_wrappers_public: UX wrappers with rank per age band
CREATE VIEW public.v_gateway_wrappers_public AS
SELECT 
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  abuw.age_band_id,
  abuw.rank
FROM public.pl_ux_wrappers uw
JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

-- v_gateway_wrapper_detail_public: Wrapper + linked need + age-band need meta (stage fields)
CREATE VIEW public.v_gateway_wrapper_detail_public AS
SELECT 
  abuw.age_band_id,
  abuw.rank,
  uw.id AS ux_wrapper_id,
  uw.ux_label,
  uw.ux_slug,
  uw.ux_description,
  dn.id AS development_need_id,
  dn.name AS development_need_name,
  dn.slug AS development_need_slug,
  dn.plain_english_description,
  dn.why_it_matters,
  meta.stage_anchor_month,
  meta.stage_phase,
  meta.stage_reason
FROM public.pl_ux_wrappers uw
INNER JOIN public.pl_age_band_ux_wrappers abuw ON uw.id = abuw.ux_wrapper_id
INNER JOIN public.pl_ux_wrapper_needs uwn ON uw.id = uwn.ux_wrapper_id
INNER JOIN public.pl_development_needs dn ON uwn.development_need_id = dn.id
LEFT JOIN public.pl_age_band_development_need_meta meta 
  ON dn.id = meta.development_need_id 
  AND abuw.age_band_id = meta.age_band_id
  AND meta.is_active = true
WHERE uw.is_active = true
  AND abuw.is_active = true
ORDER BY abuw.age_band_id, abuw.rank;

-- v_gateway_development_needs_public: Only needs reachable from active gateway wrappers
CREATE VIEW public.v_gateway_development_needs_public AS
SELECT DISTINCT
  dn.id,
  dn.name,
  dn.slug,
  dn.plain_english_description,
  dn.why_it_matters
FROM public.pl_development_needs dn
INNER JOIN public.pl_ux_wrapper_needs uwn ON dn.id = uwn.development_need_id
INNER JOIN public.pl_age_band_ux_wrappers abuw ON uwn.ux_wrapper_id = abuw.ux_wrapper_id
WHERE abuw.is_active = true;

-- v_gateway_category_types_public: Age-band scoped, only reachable via active mappings
CREATE VIEW public.v_gateway_category_types_public AS
SELECT 
  abdnct.age_band_id,
  abdnct.development_need_id,
  abdnct.rank,
  abdnct.rationale,
  ct.id,
  ct.slug,
  ct.label,
  ct.name,
  ct.description,
  ct.image_url,
  ct.safety_notes
FROM public.pl_category_types ct
INNER JOIN public.pl_age_band_development_need_category_types abdnct ON ct.id = abdnct.category_type_id
WHERE abdnct.is_active = true
ORDER BY abdnct.age_band_id, abdnct.development_need_id, abdnct.rank;

-- v_gateway_products_public: Age-band scoped, only reachable via active mappings
CREATE VIEW public.v_gateway_products_public AS
SELECT 
  abctp.age_band_id,
  abctp.category_type_id,
  abctp.rank,
  abctp.rationale,
  p.id,
  p.name,
  p.brand,
  p.image_url,
  p.canonical_url,
  p.amazon_uk_url,
  p.affiliate_url,
  p.affiliate_deeplink
FROM public.products p
INNER JOIN public.pl_age_band_category_type_products abctp ON p.id = abctp.product_id
WHERE abctp.is_active = true
  AND p.is_archived = false
ORDER BY abctp.age_band_id, abctp.category_type_id, abctp.rank;

-- ============================================================================
-- PART 8: GRANT SELECT ON VIEWS TO ANON/AUTHENTICATED
-- ============================================================================

-- Grant SELECT on all curated views to anon and authenticated roles
GRANT SELECT ON public.v_gateway_age_bands_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_wrappers_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_wrapper_detail_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_development_needs_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_category_types_public TO anon, authenticated;
GRANT SELECT ON public.v_gateway_products_public TO anon, authenticated;

-- ============================================================================
-- PART 9: ENSURE AGE BANDS 23-25m AND 25-27m EXIST
-- ============================================================================

-- Insert age bands if they don't exist (idempotent)
INSERT INTO public.pl_age_bands (id, label, min_months, max_months, is_active)
VALUES 
  ('23-25m', '23-25 months', 23, 25, true),
  ('25-27m', '25-27 months', 25, 27, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PART 10: POPULATE DATA FROM SEED TABLES (IDEMPOTENT)
-- ============================================================================

-- Note: This section assumes seed tables exist and have data.
-- The population logic is idempotent (uses ON CONFLICT or checks before insert).
--
-- IMPORTANT: All PL/pgSQL variables must be prefixed with v_ to avoid ambiguity
-- with column names in INSERT statements (e.g., v_product_id, v_category_id, v_need_id).

-- 10.1: Populate pl_development_needs from pl_seed_development_needs (if not already populated)
-- This is idempotent - only inserts if name doesn't exist, updates only NULL/empty descriptions
DO $$
DECLARE
  seed_rec RECORD;
  v_need_id UUID;
  need_slug TEXT;
BEGIN
  -- Only proceed if pl_seed_development_needs table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_development_needs'
  ) THEN
    FOR seed_rec IN (
      SELECT DISTINCT ON (need_name)
        need_name,
        plain_english_description,
        why_it_matters
      FROM public.pl_seed_development_needs
      WHERE need_name IS NOT NULL
      ORDER BY need_name, imported_at DESC NULLS LAST
    )
    LOOP
      -- Generate slug from need_name (use existing function if available, otherwise simple slugify)
      BEGIN
        need_slug := public.slugify_need_name(seed_rec.need_name);
      EXCEPTION WHEN OTHERS THEN
        need_slug := public.slugify_ux_label(seed_rec.need_name);
      END;
      
      -- Check if need already exists (by name or slug)
      SELECT id INTO v_need_id
      FROM public.pl_development_needs
      WHERE name = seed_rec.need_name
         OR slug = need_slug
      LIMIT 1;
      
      IF v_need_id IS NULL THEN
        -- Insert new development need (only canonical columns)
        INSERT INTO public.pl_development_needs (
          name,
          slug,
          plain_english_description,
          why_it_matters
        )
        VALUES (
          seed_rec.need_name,
          need_slug,
          COALESCE(seed_rec.plain_english_description, ''),
          COALESCE(seed_rec.why_it_matters, '')
        )
        RETURNING id INTO v_need_id;
      ELSE
        -- Update existing need only if descriptions are NULL/empty
        UPDATE public.pl_development_needs
        SET 
          plain_english_description = COALESCE(
            NULLIF(plain_english_description, ''),
            seed_rec.plain_english_description,
            ''
          ),
          why_it_matters = COALESCE(
            NULLIF(why_it_matters, ''),
            seed_rec.why_it_matters,
            ''
          ),
          slug = COALESCE(slug, need_slug)
        WHERE id = v_need_id;
      END IF;
    END LOOP;
  END IF;
END $$;

-- 10.2: Populate pl_ux_wrappers from pl_need_ux_labels (if exists) for 25-27m
-- This creates UX wrappers from existing pl_need_ux_labels mappings
DO $$
DECLARE
  ux_rec RECORD;
  v_wrapper_id UUID;
  wrapper_slug TEXT;
BEGIN
  -- Only proceed if pl_need_ux_labels table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_need_ux_labels'
  ) THEN
    FOR ux_rec IN (
      SELECT DISTINCT ON (ul.ux_label)
        ul.ux_label,
        ul.ux_slug,
        ul.ux_description,
        ul.development_need_id
      FROM public.pl_need_ux_labels ul
      WHERE ul.is_active = true AND ul.is_primary = true
      ORDER BY ul.ux_label, ul.created_at DESC
    )
    LOOP
      -- Generate slug if not provided
      wrapper_slug := COALESCE(ux_rec.ux_slug, public.slugify_ux_label(ux_rec.ux_label));
      
      -- Insert UX wrapper (idempotent - match by ux_slug)
      INSERT INTO public.pl_ux_wrappers (ux_label, ux_slug, ux_description)
      VALUES (ux_rec.ux_label, wrapper_slug, ux_rec.ux_description)
      ON CONFLICT (ux_slug) DO UPDATE SET
        ux_label = EXCLUDED.ux_label,
        ux_description = COALESCE(pl_ux_wrappers.ux_description, EXCLUDED.ux_description)
      RETURNING id INTO v_wrapper_id;
      
      -- Get v_wrapper_id if it already existed
      IF v_wrapper_id IS NULL THEN
        SELECT id INTO v_wrapper_id FROM public.pl_ux_wrappers WHERE ux_slug = wrapper_slug;
      END IF;
      
      -- Link wrapper to development need (1:1, idempotent)
      INSERT INTO public.pl_ux_wrapper_needs (ux_wrapper_id, development_need_id)
      VALUES (v_wrapper_id, ux_rec.development_need_id)
      ON CONFLICT (ux_wrapper_id) DO NOTHING;
      
      -- Link wrapper to age band 25-27m (idempotent)
      -- Use a simple rank based on creation order (can be adjusted later)
      INSERT INTO public.pl_age_band_ux_wrappers (age_band_id, ux_wrapper_id, rank, is_active)
      SELECT 
        '25-27m',
        v_wrapper_id,
        COALESCE((SELECT MAX(rank) FROM public.pl_age_band_ux_wrappers WHERE age_band_id = '25-27m'), 0) + 1,
        true
      ON CONFLICT (age_band_id, ux_wrapper_id) DO NOTHING;
    END LOOP;
  END IF;
END $$;

-- 10.3: Populate pl_age_band_development_need_meta from seed tables for 23-25m and 25-27m
-- Filter seed needs by age band overlap (seed.min_month <= band.max_months AND seed.max_month >= band.min_months)
DO $$
DECLARE
  seed_rec RECORD;
  v_need_id UUID;
  v_age_band_id TEXT;
  band_min_months INTEGER;
  band_max_months INTEGER;
BEGIN
  -- Only proceed if pl_seed_development_needs table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_development_needs'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      -- Get age band min/max months for overlap check
      SELECT min_months, max_months INTO band_min_months, band_max_months
      FROM public.pl_age_bands
      WHERE id = v_age_band_id
      LIMIT 1;
      
      -- Only proceed if age band found
      IF band_min_months IS NOT NULL AND band_max_months IS NOT NULL THEN
        FOR seed_rec IN (
          SELECT DISTINCT ON (need_name)
            need_name,
            min_month,
            max_month,
            stage_anchor_month,
            stage_phase,
            stage_reason
          FROM public.pl_seed_development_needs
          WHERE need_name IS NOT NULL
            -- Filter by age band overlap
            AND min_month <= band_max_months
            AND max_month >= band_min_months
          ORDER BY need_name, imported_at DESC NULLS LAST
        )
        LOOP
          -- Find development need by name
          SELECT id INTO v_need_id 
          FROM public.pl_development_needs 
          WHERE name = seed_rec.need_name
          LIMIT 1;
          
          -- Insert meta if need found
          IF v_need_id IS NOT NULL THEN
            INSERT INTO public.pl_age_band_development_need_meta (
              age_band_id,
              development_need_id,
              stage_anchor_month,
              stage_phase,
              stage_reason,
              is_active
            )
            VALUES (
              v_age_band_id,
              v_need_id,
              seed_rec.stage_anchor_month,
              seed_rec.stage_phase,
              seed_rec.stage_reason,
              true
            )
            ON CONFLICT (age_band_id, development_need_id) DO UPDATE SET
              -- Only overwrite if existing is NULL/empty
              stage_anchor_month = COALESCE(
                pl_age_band_development_need_meta.stage_anchor_month,
                EXCLUDED.stage_anchor_month
              ),
              stage_phase = COALESCE(
                NULLIF(pl_age_band_development_need_meta.stage_phase, ''),
                EXCLUDED.stage_phase
              ),
              stage_reason = COALESCE(
                NULLIF(pl_age_band_development_need_meta.stage_reason, ''),
                EXCLUDED.stage_reason
              );
          END IF;
        END LOOP;
      END IF;
    END LOOP;
  END IF;
END $$;

-- 10.4: Populate pl_age_band_development_need_category_types from seed tables
-- This maps category types to development needs based on mapped_developmental_needs (comma-separated)
DO $$
DECLARE
  seed_rec RECORD;
  v_category_id UUID;
  v_need_name TEXT;
  v_need_id UUID;
  v_age_band_id TEXT;
  rank_counter INTEGER;
BEGIN
  -- Only proceed if pl_seed_category_types table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_category_types'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      FOR seed_rec IN (
        SELECT DISTINCT ON (slug)
          slug,
          name,
          mapped_developmental_needs,
          stage_reason
        FROM public.pl_seed_category_types
        WHERE slug IS NOT NULL
        ORDER BY slug, imported_at DESC NULLS LAST
      )
      LOOP
        -- Find category type by slug
        SELECT id INTO v_category_id 
        FROM public.pl_category_types 
        WHERE slug = seed_rec.slug
        LIMIT 1;
        
        -- If category found and has mapped needs
        IF v_category_id IS NOT NULL AND seed_rec.mapped_developmental_needs IS NOT NULL THEN
          rank_counter := 1;
          
          -- Parse comma-separated need names
          FOR v_need_name IN (
            SELECT trim(unnest(string_to_array(seed_rec.mapped_developmental_needs, ',')))
          )
          LOOP
            -- Find development need by name
            SELECT id INTO v_need_id 
            FROM public.pl_development_needs 
            WHERE name = trim(v_need_name)
            LIMIT 1;
            
            -- Insert mapping if need found
            IF v_need_id IS NOT NULL THEN
              INSERT INTO public.pl_age_band_development_need_category_types (
                age_band_id,
                development_need_id,
                category_type_id,
                rank,
                rationale,
                is_active
              )
              VALUES (
                v_age_band_id,
                v_need_id,
                v_category_id,
                rank_counter,
                seed_rec.stage_reason,
                true
              )
              ON CONFLICT (age_band_id, development_need_id, category_type_id) DO NOTHING;
              
              rank_counter := rank_counter + 1;
            END IF;
          END LOOP;
        END IF;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- 10.5: Populate pl_age_band_category_type_products from seed tables
-- This maps products to category types for each age band
DO $$
DECLARE
  seed_rec RECORD;
  v_category_id UUID;
  v_product_id UUID;
  v_age_band_id TEXT;
  rank_counter INTEGER;
  v_rationale TEXT;
BEGIN
  -- Only proceed if pl_seed_products table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'pl_seed_products'
  ) THEN
    FOR v_age_band_id IN SELECT unnest(ARRAY['23-25m', '25-27m'])
    LOOP
      FOR seed_rec IN (
        SELECT DISTINCT ON (name, brand)
          name,
          brand,
          category_type_slug,
          age_band_id AS seed_age_band_id,
          stage_reason,
          age_suitability_note
        FROM public.pl_seed_products
        WHERE name IS NOT NULL 
          AND category_type_slug IS NOT NULL
          AND age_band_id = v_age_band_id
        ORDER BY name, brand, imported_at DESC NULLS LAST
      )
      LOOP
        -- Find category type by slug
        SELECT id INTO v_category_id 
        FROM public.pl_category_types 
        WHERE slug = seed_rec.category_type_slug
        LIMIT 1;
        
        -- Find product by name and brand (best-effort match)
        SELECT id INTO v_product_id 
        FROM public.products 
        WHERE name = seed_rec.name
          AND (brand = seed_rec.brand OR (brand IS NULL AND seed_rec.brand IS NULL))
        LIMIT 1;
        
        -- If both found, create mapping
        IF v_category_id IS NOT NULL AND v_product_id IS NOT NULL THEN
          -- Get next rank for this age band + category
          SELECT COALESCE(MAX(rank), 0) + 1 INTO rank_counter
          FROM public.pl_age_band_category_type_products
          WHERE age_band_id = v_age_band_id AND category_type_id = v_category_id;
          
          -- Build rationale: stage_reason || ' | ' || age_suitability_note (safe concat)
          v_rationale := NULL;
          IF seed_rec.stage_reason IS NOT NULL AND seed_rec.stage_reason != '' THEN
            v_rationale := seed_rec.stage_reason;
          END IF;
          IF seed_rec.age_suitability_note IS NOT NULL AND seed_rec.age_suitability_note != '' THEN
            IF v_rationale IS NOT NULL THEN
              v_rationale := v_rationale || ' | ' || seed_rec.age_suitability_note;
            ELSE
              v_rationale := seed_rec.age_suitability_note;
            END IF;
          END IF;
          
          INSERT INTO public.pl_age_band_category_type_products (
            age_band_id,
            category_type_id,
            product_id,
            rank,
            rationale,
            is_active
          )
          VALUES (
            v_age_band_id,
            v_category_id,
            v_product_id,
            rank_counter,
            v_rationale,
            true
          )
          ON CONFLICT (age_band_id, category_type_id, product_id) DO NOTHING;
        END IF;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- ============================================================================
-- PART 11: PROOF BUNDLE (verification output)
-- ============================================================================

DO $$
DECLARE
  age_band_count INTEGER;
  ux_wrapper_count INTEGER;
  wrapper_need_count INTEGER;
  age_band_wrapper_count INTEGER;
  meta_count INTEGER;
  meta_count_23_25 INTEGER;
  meta_count_25_27 INTEGER;
  need_category_count INTEGER;
  category_product_count INTEGER;
  development_needs_count INTEGER;
  view_age_band_count INTEGER;
  view_wrapper_count INTEGER;
  view_wrapper_count_25_27 INTEGER;
  view_need_count INTEGER;
  view_category_count INTEGER;
  view_product_count INTEGER;
  view_wrapper_detail_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'PHASE A DB FOUNDATION - PROOF BUNDLE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
  
  -- Age bands
  SELECT COUNT(*) INTO age_band_count FROM public.pl_age_bands WHERE id IN ('23-25m', '25-27m');
  RAISE NOTICE '=== AGE BANDS ===';
  RAISE NOTICE 'Age bands (23-25m, 25-27m): % (expected: 2)', age_band_count;
  
  -- Development needs (seed import verification)
  SELECT COUNT(*) INTO development_needs_count FROM public.pl_development_needs;
  RAISE NOTICE '';
  RAISE NOTICE '=== SEED IMPORT: DEVELOPMENT NEEDS ===';
  RAISE NOTICE 'Total pl_development_needs rows: % (seed import succeeded if > 0)', development_needs_count;
  
  -- UX wrappers
  SELECT COUNT(*) INTO ux_wrapper_count FROM public.pl_ux_wrappers;
  RAISE NOTICE '';
  RAISE NOTICE '=== UX WRAPPERS ===';
  RAISE NOTICE 'Total UX wrappers: %', ux_wrapper_count;
  
  -- Wrapper-need mappings
  SELECT COUNT(*) INTO wrapper_need_count FROM public.pl_ux_wrapper_needs;
  RAISE NOTICE '';
  RAISE NOTICE '=== WRAPPER-NEED MAPPINGS ===';
  RAISE NOTICE 'Total wrapper-need mappings: %', wrapper_need_count;
  
  -- Age band wrapper rankings
  SELECT COUNT(*) INTO age_band_wrapper_count 
  FROM public.pl_age_band_ux_wrappers 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== AGE BAND WRAPPER RANKINGS ===';
  RAISE NOTICE 'Age band wrapper rankings (23-25m, 25-27m): %', age_band_wrapper_count;
  
  -- Wrappers for 25-27m (seed import verification)
  SELECT COUNT(*) INTO view_wrapper_count_25_27
  FROM public.v_gateway_wrappers_public
  WHERE age_band_id = '25-27m';
  RAISE NOTICE 'Wrappers for 25-27m: % (seed import succeeded if > 0)', view_wrapper_count_25_27;
  
  -- Development need meta (seed import verification)
  SELECT COUNT(*) INTO meta_count 
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id IN ('23-25m', '25-27m');
  SELECT COUNT(*) INTO meta_count_23_25
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id = '23-25m';
  SELECT COUNT(*) INTO meta_count_25_27
  FROM public.pl_age_band_development_need_meta 
  WHERE age_band_id = '25-27m';
  RAISE NOTICE '';
  RAISE NOTICE '=== SEED IMPORT: DEVELOPMENT NEED META ===';
  RAISE NOTICE 'Development need meta records (23-25m, 25-27m): %', meta_count;
  RAISE NOTICE '  - 23-25m: %', meta_count_23_25;
  RAISE NOTICE '  - 25-27m: %', meta_count_25_27;
  
  -- Need-category mappings
  SELECT COUNT(*) INTO need_category_count 
  FROM public.pl_age_band_development_need_category_types 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== NEED-CATEGORY MAPPINGS ===';
  RAISE NOTICE 'Need-category mappings (23-25m, 25-27m): %', need_category_count;
  
  -- Category-product mappings
  SELECT COUNT(*) INTO category_product_count 
  FROM public.pl_age_band_category_type_products 
  WHERE age_band_id IN ('23-25m', '25-27m');
  RAISE NOTICE '';
  RAISE NOTICE '=== CATEGORY-PRODUCT MAPPINGS ===';
  RAISE NOTICE 'Category-product mappings (23-25m, 25-27m): %', category_product_count;
  
  -- Sample data from views
  RAISE NOTICE '';
  RAISE NOTICE '=== VIEW SAMPLE DATA ===';
  
  SELECT COUNT(*) INTO view_age_band_count FROM public.v_gateway_age_bands_public;
  RAISE NOTICE 'v_gateway_age_bands_public rows: %', view_age_band_count;
  
  SELECT COUNT(*) INTO view_wrapper_count FROM public.v_gateway_wrappers_public;
  RAISE NOTICE 'v_gateway_wrappers_public rows: %', view_wrapper_count;
  
  SELECT COUNT(*) INTO view_need_count FROM public.v_gateway_development_needs_public;
  RAISE NOTICE 'v_gateway_development_needs_public rows: %', view_need_count;
  
  SELECT COUNT(*) INTO view_category_count FROM public.v_gateway_category_types_public;
  RAISE NOTICE 'v_gateway_category_types_public rows: %', view_category_count;
  
  SELECT COUNT(*) INTO view_product_count FROM public.v_gateway_products_public;
  RAISE NOTICE 'v_gateway_products_public rows: %', view_product_count;
  
  SELECT COUNT(*) INTO view_wrapper_detail_count FROM public.v_gateway_wrapper_detail_public;
  RAISE NOTICE 'v_gateway_wrapper_detail_public rows: %', view_wrapper_detail_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE 'PROOF BUNDLE COMPLETE';
  RAISE NOTICE '============================================================================';
  RAISE NOTICE '';
END $$;
