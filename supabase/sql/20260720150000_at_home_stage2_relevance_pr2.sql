-- PR2: Hidden item-type → Stage 2 relevance map + garage_items age-fit pinning.
-- Plan: web/docs/INVENTORY_MATCHING_PLAN.md

-- =============================================================================
-- A. Hidden relevance map (parent never sees this directly)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.item_type_stage2_relevance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID NOT NULL REFERENCES public.product_types(id) ON DELETE CASCADE,
  category_type_id UUID NOT NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  age_band_id TEXT NOT NULL REFERENCES public.pl_age_bands(id) ON DELETE CASCADE,
  relevance_strength TEXT NOT NULL DEFAULT 'close'
    CHECK (relevance_strength IN ('exact', 'close', 'estimated')),
  min_fit_months INTEGER NULL,
  max_fit_months INTEGER NULL,
  mapping_rationale TEXT NULL,
  source TEXT NOT NULL DEFAULT 'seed',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT item_type_stage2_relevance_unique
    UNIQUE (product_type_id, category_type_id, age_band_id)
);

CREATE INDEX IF NOT EXISTS item_type_stage2_relevance_product_type_idx
  ON public.item_type_stage2_relevance (product_type_id)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS item_type_stage2_relevance_category_idx
  ON public.item_type_stage2_relevance (category_type_id, age_band_id)
  WHERE is_active = true;

DROP TRIGGER IF EXISTS item_type_stage2_relevance_updated_at ON public.item_type_stage2_relevance;
CREATE TRIGGER item_type_stage2_relevance_updated_at
  BEFORE UPDATE ON public.item_type_stage2_relevance
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.item_type_stage2_relevance IS
  'Hidden map from inventory product_types to Discover Stage 2 cards across age bands (PR2).';

ALTER TABLE public.item_type_stage2_relevance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "item_type_stage2_relevance_select_authenticated"
  ON public.item_type_stage2_relevance;
CREATE POLICY "item_type_stage2_relevance_select_authenticated"
  ON public.item_type_stage2_relevance
  FOR SELECT TO authenticated
  USING (is_active = true);

-- =============================================================================
-- B. Instance age-fit on owned items
-- =============================================================================
ALTER TABLE public.product_types
  ADD COLUMN IF NOT EXISTS age_fit_variant TEXT NULL,
  ADD COLUMN IF NOT EXISTS default_age_fit_min_months INTEGER NULL,
  ADD COLUMN IF NOT EXISTS default_age_fit_max_months INTEGER NULL;

ALTER TABLE public.garage_items
  ADD COLUMN IF NOT EXISTS age_fit_variant TEXT NULL,
  ADD COLUMN IF NOT EXISTS age_fit_min_months INTEGER NULL,
  ADD COLUMN IF NOT EXISTS age_fit_max_months INTEGER NULL,
  ADD COLUMN IF NOT EXISTS age_fit_source TEXT NULL
    CHECK (
      age_fit_source IS NULL
      OR age_fit_source IN ('parent_choice', 'query_parse', 'child_month', 'default', 'none')
    );

COMMENT ON COLUMN public.garage_items.age_fit_variant IS
  'Instance pin for ambiguous families (e.g. peg_chunky vs jigsaw_24_plus). Gates Stage 2 relevance.';

-- =============================================================================
-- C. Child age helper
-- =============================================================================
CREATE OR REPLACE FUNCTION public.child_age_months(p_child_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN c.birthdate IS NULL THEN NULL
    ELSE GREATEST(
      0,
      (
        EXTRACT(YEAR FROM age(CURRENT_DATE, c.birthdate::date)) * 12
        + EXTRACT(MONTH FROM age(CURRENT_DATE, c.birthdate::date))
      )::INTEGER
    )
  END
  FROM public.children c
  WHERE c.id = p_child_id;
$$;

REVOKE ALL ON FUNCTION public.child_age_months(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.child_age_months(UUID) TO authenticated;

-- =============================================================================
-- D. Resolve best Stage 2 category for an owned item (hidden; used on save)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.resolve_at_home_stage2_category(
  p_product_type_id UUID,
  p_child_id UUID DEFAULT NULL,
  p_age_fit_min_months INTEGER DEFAULT NULL,
  p_age_fit_max_months INTEGER DEFAULT NULL
)
RETURNS TABLE (
  category_type_id UUID,
  age_band_id TEXT,
  relevance_strength TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ctx AS (
    SELECT
      public.child_age_months(p_child_id) AS child_months,
      ab.id AS child_age_band_id,
      ab.min_months AS band_min,
      ab.max_months AS band_max
    FROM public.children c
    LEFT JOIN public.pl_age_bands ab
      ON ab.id = c.age_band
    WHERE c.id = p_child_id
    UNION ALL
    SELECT NULL::INTEGER, NULL::TEXT, NULL::INTEGER, NULL::INTEGER
    WHERE p_child_id IS NULL
    LIMIT 1
  ),
  eligible AS (
    SELECT
      r.category_type_id,
      r.age_band_id,
      r.relevance_strength,
      ab.min_months AS rel_band_min,
      ab.max_months AS rel_band_max,
      COALESCE(r.min_fit_months, ab.min_months) AS effective_min,
      COALESCE(r.max_fit_months, ab.max_months) AS effective_max,
      CASE r.relevance_strength
        WHEN 'exact' THEN 3
        WHEN 'close' THEN 2
        ELSE 1
      END AS strength_rank
    FROM public.item_type_stage2_relevance r
    JOIN public.pl_age_bands ab ON ab.id = r.age_band_id
    CROSS JOIN ctx
    WHERE r.product_type_id = p_product_type_id
      AND r.is_active = true
      AND (
        p_age_fit_min_months IS NULL
        OR p_age_fit_max_months IS NULL
        OR ctx.child_months IS NULL
        OR (
          ctx.child_months >= p_age_fit_min_months
          AND ctx.child_months <= p_age_fit_max_months
        )
      )
      AND (
        ctx.child_months IS NULL
        OR (
          ctx.child_months >= COALESCE(r.min_fit_months, ab.min_months)
          AND ctx.child_months <= COALESCE(r.max_fit_months, ab.max_months)
        )
      )
      AND (
        ctx.child_age_band_id IS NULL
        OR r.age_band_id = ctx.child_age_band_id
        OR (
          ctx.child_months IS NOT NULL
          AND ctx.child_months >= ab.min_months
          AND ctx.child_months <= ab.max_months
        )
      )
  )
  SELECT
    e.category_type_id,
    e.age_band_id,
    e.relevance_strength
  FROM eligible e
  ORDER BY
    e.strength_rank DESC,
    ABS(
      COALESCE(
        (SELECT child_months FROM ctx LIMIT 1),
        (e.rel_band_min + e.rel_band_max) / 2
      ) - (e.rel_band_min + e.rel_band_max) / 2
    ) ASC,
    e.age_band_id ASC
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.resolve_at_home_stage2_category(UUID, UUID, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_at_home_stage2_category(UUID, UUID, INTEGER, INTEGER) TO authenticated;
