-- PR1: At home item-type families + consolidated match (replaces Stage 2 as add UI target).
-- Plan: web/docs/INVENTORY_MATCHING_PLAN.md

-- =============================================================================
-- A. Family layer (parent-facing consolidated groups)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.item_type_families (
  slug TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  hint TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS item_type_families_updated_at ON public.item_type_families;
CREATE TRIGGER item_type_families_updated_at
  BEFORE UPDATE ON public.item_type_families
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.item_type_families IS
  'Parent-facing consolidated item groups spanning age bands (e.g. soft_toys).';

ALTER TABLE public.item_type_families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "item_type_families_select_authenticated" ON public.item_type_families;
CREATE POLICY "item_type_families_select_authenticated"
  ON public.item_type_families
  FOR SELECT TO authenticated
  USING (is_active = true);

-- =============================================================================
-- B. Link product_types to families
-- =============================================================================
ALTER TABLE public.product_types
  ADD COLUMN IF NOT EXISTS family_slug TEXT NULL REFERENCES public.item_type_families (slug);

CREATE INDEX IF NOT EXISTS product_types_family_slug_idx
  ON public.product_types (family_slug)
  WHERE family_slug IS NOT NULL;

-- =============================================================================
-- C. Seed families
-- =============================================================================
INSERT INTO public.item_type_families (slug, label, hint)
VALUES
  ('soft_toys', 'Soft toys', 'Often comfort first, then care play later.'),
  ('musical_toys', 'Musical toys', 'For noise, rhythm and copying you.'),
  ('pretend_household', 'Pretend household', 'When they want to copy jobs around the house.'),
  ('pretend_phones', 'Pretend phones', 'For chatter, copying and pocket play.'),
  ('toy_vehicles', 'Toy vehicles', 'Cars, trucks and things that go.')
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  hint = EXCLUDED.hint,
  is_active = true;

-- =============================================================================
-- D. Seed item types (PR1 founder examples + gaps)
-- =============================================================================
INSERT INTO public.product_types (slug, label, subtitle, family_slug, is_active)
VALUES
  ('character_soft_toy', 'Character soft toy', 'Teddies, characters and comforters with a name.', 'soft_toys', true),
  ('soft_toy', 'Soft toy', 'Washable cuddly toys and comforters.', 'soft_toys', true),
  ('toy_broom', 'Toy broom', 'Play brooms and sweeping props for copying you.', 'pretend_household', true),
  ('pretend_phone', 'Pretend phone', 'Toy phones and chat props.', 'pretend_phones', true),
  ('toy_guitar', 'Toy guitar', 'Toy guitars and string instruments for toddlers.', 'musical_toys', true),
  ('toy_vehicle', 'Toy vehicle', 'Toy cars, trucks and vehicles.', 'toy_vehicles', true)
ON CONFLICT (slug) DO UPDATE SET
  label = EXCLUDED.label,
  subtitle = EXCLUDED.subtitle,
  family_slug = EXCLUDED.family_slug,
  is_active = true;

-- =============================================================================
-- E. Seed aliases (parent language -> item type)
-- Reassign aliases if they were mapped to a different product type.
-- =============================================================================
DELETE FROM public.product_type_aliases pa
WHERE pa.normalized_alias IN (
  SELECT public.normalize_inventory_alias(v.alias)
  FROM (VALUES
    ('paddington bear'),
    ('paddington'),
    ('freddie the firefly'),
    ('freddie firefly'),
    ('comforter toy'),
    ('character teddy'),
    ('teddy bear'),
    ('teddy'),
    ('cuddly toy'),
    ('plush toy'),
    ('kitchen broom'),
    ('toy broom'),
    ('kids broom'),
    ('childs broom'),
    ('childrens broom'),
    ('peppa pig phone'),
    ('toy phone'),
    ('kids phone'),
    ('play phone'),
    ('pretend phone'),
    ('guitar'),
    ('toy guitar'),
    ('kids guitar'),
    ('childs guitar'),
    ('ice cream truck'),
    ('toy truck'),
    ('toy car'),
    ('toy lorry'),
    ('ride on car')
  ) AS v(alias)
);

INSERT INTO public.product_type_aliases (product_type_id, alias)
SELECT pt.id, a.alias
FROM (VALUES
  ('character_soft_toy', 'paddington bear'),
  ('character_soft_toy', 'paddington'),
  ('character_soft_toy', 'freddie the firefly'),
  ('character_soft_toy', 'freddie firefly'),
  ('character_soft_toy', 'comforter toy'),
  ('character_soft_toy', 'character teddy'),
  ('soft_toy', 'teddy bear'),
  ('soft_toy', 'teddy'),
  ('soft_toy', 'cuddly toy'),
  ('soft_toy', 'plush toy'),
  ('toy_broom', 'kitchen broom'),
  ('toy_broom', 'toy broom'),
  ('toy_broom', 'kids broom'),
  ('toy_broom', 'childs broom'),
  ('toy_broom', 'childrens broom'),
  ('pretend_phone', 'peppa pig phone'),
  ('pretend_phone', 'toy phone'),
  ('pretend_phone', 'kids phone'),
  ('pretend_phone', 'play phone'),
  ('pretend_phone', 'pretend phone'),
  ('toy_guitar', 'guitar'),
  ('toy_guitar', 'toy guitar'),
  ('toy_guitar', 'kids guitar'),
  ('toy_guitar', 'childs guitar'),
  ('toy_vehicle', 'ice cream truck'),
  ('toy_vehicle', 'toy truck'),
  ('toy_vehicle', 'toy car'),
  ('toy_vehicle', 'toy lorry'),
  ('toy_vehicle', 'ride on car')
) AS a(type_slug, alias)
JOIN public.product_types pt ON pt.slug = a.type_slug
WHERE public.normalize_inventory_alias(a.alias) <> ''
ON CONFLICT (product_type_id, normalized_alias) DO NOTHING;

-- =============================================================================
-- F. Consolidated At home match RPC (one family-aware result by default)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.inventory_match_at_home(
  query_text TEXT,
  p_limit INT DEFAULT 1
)
RETURNS TABLE (
  product_type_id UUID,
  slug TEXT,
  label TEXT,
  subtitle TEXT,
  family_slug TEXT,
  family_label TEXT,
  family_hint TEXT,
  specific_label TEXT,
  confidence_bucket TEXT,
  score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  WITH ranked AS (
    SELECT
      m.id AS product_type_id,
      m.slug,
      m.label,
      m.subtitle,
      pt.family_slug,
      COALESCE(f.label, m.label) AS family_label,
      f.hint AS family_hint,
      m.label AS specific_label,
      m.confidence_bucket,
      m.score,
      ROW_NUMBER() OVER (
        PARTITION BY COALESCE(pt.family_slug, m.slug)
        ORDER BY m.score DESC, m.label ASC
      ) AS family_rank
    FROM public.inventory_match_product_types(query_text, GREATEST(COALESCE(NULLIF(p_limit, 0), 1) * 5, 10)) m
    JOIN public.product_types pt ON pt.id = m.id
    LEFT JOIN public.item_type_families f
      ON f.slug = pt.family_slug
     AND f.is_active = true
  )
  SELECT
    r.product_type_id,
    r.slug,
    r.family_label AS label,
    COALESCE(r.family_hint, r.subtitle) AS subtitle,
    r.family_slug,
    r.family_label,
    r.family_hint,
    r.specific_label,
    r.confidence_bucket,
    r.score
  FROM ranked r
  WHERE r.family_rank = 1
  ORDER BY r.score DESC, r.family_label ASC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 1), 5));
$$;

COMMENT ON FUNCTION public.inventory_match_at_home(TEXT, INT) IS
  'At home add: match parent text to item types, dedupe by family, return consolidated best match(es).';

GRANT EXECUTE ON FUNCTION public.inventory_match_at_home(TEXT, INT) TO authenticated;
