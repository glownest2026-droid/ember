-- PL-0: Product Library Ground Truth & Guardrails
-- Date: 2026-01-04
-- Purpose: Add pl_* tables for product library and harden products table RLS

-- ============================================================================
-- PART 1: HARDEN products TABLE RLS (admin-only writes)
-- ============================================================================

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on products (safe dynamic drop)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.products';
    END LOOP;
END $$;

-- Recreate SELECT: public read (anon + authenticated)
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT
  USING (true);

-- INSERT: admin-only via user_roles check
CREATE POLICY "products_admin_insert" ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- UPDATE: admin-only via user_roles check
CREATE POLICY "products_admin_update" ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- DELETE: admin-only via user_roles check
CREATE POLICY "products_admin_delete" ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================================================
-- PART 2: CREATE ENUM TYPES
-- ============================================================================

-- pl_set_status_enum: draft | published | archived
DO $$ BEGIN
    CREATE TYPE pl_set_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- pl_lane_enum: obvious | nearby | surprise
DO $$ BEGIN
    CREATE TYPE pl_lane_enum AS ENUM ('obvious', 'nearby', 'surprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PART 3: CREATE pl_* TABLES
-- ============================================================================

-- pl_age_bands: vocabulary table for age ranges
CREATE TABLE IF NOT EXISTS public.pl_age_bands (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  min_months INTEGER NOT NULL,
  max_months INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_moments: vocabulary table for play moments
CREATE TABLE IF NOT EXISTS public.pl_moments (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_dev_tags: vocabulary table for development tags
CREATE TABLE IF NOT EXISTS public.pl_dev_tags (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_category_types: product category taxonomy
CREATE TABLE IF NOT EXISTS public.pl_category_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_reference_url TEXT,
  safety_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_age_moment_sets: sets combining age band + moment
CREATE TABLE IF NOT EXISTS public.pl_age_moment_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE RESTRICT,
  moment_id TEXT NOT NULL REFERENCES public.pl_moments(id) ON DELETE RESTRICT,
  status pl_set_status_enum NOT NULL DEFAULT 'draft',
  headline TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_reco_cards: recommendation cards within a set
CREATE TABLE IF NOT EXISTS public.pl_reco_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES public.pl_age_moment_sets(id) ON DELETE CASCADE,
  lane pl_lane_enum NOT NULL,
  rank INTEGER NOT NULL,
  category_type_id UUID REFERENCES public.pl_category_types(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  because TEXT NOT NULL,
  why_tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- pl_evidence: evidence/sources for recommendation cards
CREATE TABLE IF NOT EXISTS public.pl_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.pl_reco_cards(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  url TEXT,
  quote_snippet TEXT,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confidence INTEGER NOT NULL CHECK (confidence >= 1 AND confidence <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- PART 4: INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS pl_age_moment_sets_age_band_id_idx ON public.pl_age_moment_sets(age_band_id);
CREATE INDEX IF NOT EXISTS pl_age_moment_sets_moment_id_idx ON public.pl_age_moment_sets(moment_id);
CREATE INDEX IF NOT EXISTS pl_age_moment_sets_status_idx ON public.pl_age_moment_sets(status);
CREATE INDEX IF NOT EXISTS pl_reco_cards_set_id_idx ON public.pl_reco_cards(set_id);
CREATE INDEX IF NOT EXISTS pl_reco_cards_lane_idx ON public.pl_reco_cards(lane);
CREATE INDEX IF NOT EXISTS pl_evidence_card_id_idx ON public.pl_evidence(card_id);

-- ============================================================================
-- PART 5: UPDATED_AT TRIGGERS
-- ============================================================================

-- Apply updated_at trigger to all pl_* tables
CREATE TRIGGER trg_pl_age_bands_updated_at BEFORE UPDATE ON public.pl_age_bands
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_moments_updated_at BEFORE UPDATE ON public.pl_moments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_dev_tags_updated_at BEFORE UPDATE ON public.pl_dev_tags
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_category_types_updated_at BEFORE UPDATE ON public.pl_category_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_age_moment_sets_updated_at BEFORE UPDATE ON public.pl_age_moment_sets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_reco_cards_updated_at BEFORE UPDATE ON public.pl_reco_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_pl_evidence_updated_at BEFORE UPDATE ON public.pl_evidence
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 6: ENABLE RLS ON ALL pl_* TABLES
-- ============================================================================

ALTER TABLE public.pl_age_bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_dev_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_category_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_age_moment_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_reco_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pl_evidence ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 7: RLS POLICIES FOR pl_* TABLES
-- ============================================================================

-- Admin CRUD on all pl_* tables (vocabulary tables: age_bands, moments, dev_tags, category_types)
-- Helper function to check admin role (reusable)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- pl_age_bands: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_age_bands_admin_all" ON public.pl_age_bands
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_moments: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_moments_admin_all" ON public.pl_moments
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_dev_tags: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_dev_tags_admin_all" ON public.pl_dev_tags
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_category_types: admin-only CRUD (vocabulary table, no public read in PL-0)
CREATE POLICY "pl_category_types_admin_all" ON public.pl_category_types
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- pl_age_moment_sets: admin CRUD + public SELECT for published sets
CREATE POLICY "pl_age_moment_sets_admin_all" ON public.pl_age_moment_sets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_age_moment_sets_public_read_published" ON public.pl_age_moment_sets
  FOR SELECT
  USING (status = 'published');

-- pl_reco_cards: admin CRUD + public SELECT for cards in published sets
CREATE POLICY "pl_reco_cards_admin_all" ON public.pl_reco_cards
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_reco_cards_public_read_published" ON public.pl_reco_cards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_age_moment_sets
      WHERE id = pl_reco_cards.set_id
      AND status = 'published'
    )
  );

-- pl_evidence: admin CRUD + public SELECT for evidence on cards in published sets
CREATE POLICY "pl_evidence_admin_all" ON public.pl_evidence
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "pl_evidence_public_read_published" ON public.pl_evidence
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pl_reco_cards
      INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
      WHERE pl_reco_cards.id = pl_evidence.card_id
      AND pl_age_moment_sets.status = 'published'
    )
  );

-- ============================================================================
-- NOTES
-- ============================================================================
-- - products table: SELECT remains public, INSERT/UPDATE/DELETE are admin-only
-- - All pl_* tables: Admin has full CRUD access
-- - Public SELECT allowed ONLY for published sets and their related cards/evidence
-- - Vocabulary tables (age_bands, moments, dev_tags, category_types) are admin-only in PL-0
-- - Helper function is_admin() uses SECURITY DEFINER to check user_roles table

