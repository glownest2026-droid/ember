-- Manus-ready: Scoring and Evidence
-- Date: 2026-01-06
-- Purpose: Add Manus scoring columns to products and pl_category_types, create general-purpose evidence table
-- Note: Idempotent migration using IF NOT EXISTS where applicable

-- ============================================================================
-- PART 1: ALTER products TABLE - Add Manus scoring columns
-- ============================================================================

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS amazon_rating numeric(2,1),
  ADD COLUMN IF NOT EXISTS amazon_review_count integer,
  ADD COLUMN IF NOT EXISTS confidence_score smallint,
  ADD COLUMN IF NOT EXISTS quality_score smallint,
  ADD COLUMN IF NOT EXISTS primary_url text,
  ADD COLUMN IF NOT EXISTS source_name text,
  ADD COLUMN IF NOT EXISTS source_run_id text,
  ADD COLUMN IF NOT EXISTS manus_payload jsonb;

-- Add constraints for score ranges (0-10 for smallint fields, 0-5 for amazon_rating)
DO $$
BEGIN
  -- Add check constraint for quality_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_quality_score_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_quality_score_check 
      CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 10));
  END IF;

  -- Add check constraint for confidence_score if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_confidence_score_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_confidence_score_check 
      CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10));
  END IF;

  -- Add check constraint for amazon_rating if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'products_amazon_rating_check'
  ) THEN
    ALTER TABLE public.products 
      ADD CONSTRAINT products_amazon_rating_check 
      CHECK (amazon_rating IS NULL OR (amazon_rating >= 0 AND amazon_rating <= 5));
  END IF;
END $$;

-- Indexes for filtering and sorting
CREATE INDEX IF NOT EXISTS products_quality_score_idx ON public.products(quality_score) WHERE quality_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_amazon_rating_idx ON public.products(amazon_rating) WHERE amazon_rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_confidence_score_idx ON public.products(confidence_score) WHERE confidence_score IS NOT NULL;

-- ============================================================================
-- PART 2: ALTER pl_category_types TABLE - Add optional columns
-- ============================================================================

ALTER TABLE public.pl_category_types 
  ADD COLUMN IF NOT EXISTS min_month integer,
  ADD COLUMN IF NOT EXISTS max_month integer,
  ADD COLUMN IF NOT EXISTS evidence_urls text[],
  ADD COLUMN IF NOT EXISTS confidence_score smallint;

-- Add constraint for category_type confidence_score if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'pl_category_types_confidence_score_check'
  ) THEN
    ALTER TABLE public.pl_category_types 
      ADD CONSTRAINT pl_category_types_confidence_score_check 
      CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 10));
  END IF;
END $$;

-- ============================================================================
-- PART 3: CREATE pl_evidence TABLE (general-purpose evidence for entities)
-- ============================================================================
-- Note: An existing pl_evidence table exists for pl_reco_cards (card_id).
-- This new structure is for general entity evidence (category_types/products).
-- We'll check if the old structure exists and handle migration safely.

DO $$
BEGIN
  -- Check if pl_evidence exists with old structure (card_id column)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'pl_evidence'
    AND column_name = 'card_id'
  ) THEN
    -- Old structure exists - check if new structure columns don't exist yet
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'pl_evidence'
      AND column_name = 'entity_type'
    ) THEN
      -- Rename old table to preserve data
      ALTER TABLE public.pl_evidence RENAME TO pl_card_evidence;
      
      -- Recreate policies on renamed table (if they exist)
      DROP POLICY IF EXISTS "pl_evidence_admin_all" ON public.pl_card_evidence;
      DROP POLICY IF EXISTS "pl_evidence_public_read_published" ON public.pl_card_evidence;
      
      -- Recreate policies with new name
      CREATE POLICY "pl_card_evidence_admin_all" ON public.pl_card_evidence
        FOR ALL
        USING (public.is_admin())
        WITH CHECK (public.is_admin());
      
      CREATE POLICY "pl_card_evidence_public_read_published" ON public.pl_card_evidence
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.pl_reco_cards
            INNER JOIN public.pl_age_moment_sets ON pl_reco_cards.set_id = pl_age_moment_sets.id
            WHERE pl_reco_cards.id = pl_card_evidence.card_id
            AND pl_age_moment_sets.status = 'published'
          )
        );
      
      -- Recreate index with new name
      DROP INDEX IF EXISTS public.pl_evidence_card_id_idx;
      CREATE INDEX IF NOT EXISTS pl_card_evidence_card_id_idx ON public.pl_card_evidence(card_id);
    END IF;
  END IF;
END $$;

-- Now create the new pl_evidence table with entity_type/entity_id structure
CREATE TABLE IF NOT EXISTS public.pl_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('category_type', 'product')),
  entity_id uuid NOT NULL,
  source_type text NOT NULL,
  url text NOT NULL,
  notes text,
  weight smallint,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for entity lookups
CREATE INDEX IF NOT EXISTS pl_evidence_entity_idx ON public.pl_evidence(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS pl_evidence_source_type_idx ON public.pl_evidence(source_type);

-- ============================================================================
-- PART 4: RLS POLICIES FOR pl_evidence
-- ============================================================================

ALTER TABLE public.pl_evidence ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read (for admin UIs and future tooling)
DROP POLICY IF EXISTS "pl_evidence_authenticated_read" ON public.pl_evidence;
CREATE POLICY "pl_evidence_authenticated_read" ON public.pl_evidence
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Writes: only via service role (no open write policies needed)
-- Admin writes go through service role server routes, so we keep it simple here

-- ============================================================================
-- NOTES
-- ============================================================================
-- - products table: Added Manus scoring columns (amazon_rating, confidence_score, quality_score, etc.)
-- - pl_category_types: Added optional age range and evidence columns
-- - pl_evidence: New general-purpose evidence table for category_types/products
--   - If old pl_evidence (card_id) existed, it's been renamed to pl_card_evidence
--   - New pl_evidence supports entity_type/entity_id pattern
-- - RLS: pl_evidence allows authenticated read only; writes via service role
-- - All changes are additive and idempotent

