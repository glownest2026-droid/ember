-- Marketplace: enable pg_trgm and create canonical item types for fuzzy suggestions.
-- Pre-launch backend (A.1, A.2). Idempotent.

-- Extension (must be in extensions schema; search_path in functions will include it)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Canonical item types: slug, name, synonyms, category_hint, search_text for trigram matching
CREATE TABLE IF NOT EXISTS public.marketplace_item_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  canonical_name TEXT NOT NULL,
  synonyms TEXT[] NOT NULL DEFAULT '{}',
  category_hint TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated search_text: canonical_name + all synonyms, space-separated, for similarity()
ALTER TABLE public.marketplace_item_types
  DROP COLUMN IF EXISTS search_text;
ALTER TABLE public.marketplace_item_types
  ADD COLUMN search_text TEXT GENERATED ALWAYS AS (
    TRIM(
      canonical_name || ' ' ||
      COALESCE(array_to_string(synonyms, ' '), '')
    )
  ) STORED;

CREATE UNIQUE INDEX IF NOT EXISTS marketplace_item_types_slug_idx
  ON public.marketplace_item_types(slug);
CREATE INDEX IF NOT EXISTS marketplace_item_types_search_text_gin
  ON public.marketplace_item_types USING gin (search_text gin_trgm_ops);

COMMENT ON TABLE public.marketplace_item_types IS 'Canonical marketplace item types for fuzzy suggestion (pg_trgm).';
COMMENT ON COLUMN public.marketplace_item_types.search_text IS 'Generated: canonical_name + synonyms for trigram similarity.';

-- updated_at trigger
DROP TRIGGER IF EXISTS marketplace_item_types_updated_at ON public.marketplace_item_types;
CREATE TRIGGER marketplace_item_types_updated_at
  BEFORE UPDATE ON public.marketplace_item_types
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed initial rows (idempotent: insert only if slug missing)
INSERT INTO public.marketplace_item_types (slug, canonical_name, synonyms, category_hint)
VALUES
  ('bath-chair', 'bath chair', ARRAY['bath seat', 'baby bath seat', 'baby bath chair'], 'bathing'),
  ('high-chair', 'high chair', ARRAY['feeding chair', 'highchair', 'baby high chair'], 'feeding'),
  ('booster-seat', 'booster seat', ARRAY['booster', 'chair booster', 'table booster'], 'feeding'),
  ('car-seat', 'car seat', ARRAY['car seat', 'baby car seat', 'infant car seat', 'carrier'], 'travel'),
  ('stroller', 'stroller', ARRAY['pushchair', 'buggy', 'pram', 'baby stroller'], 'travel'),
  ('travel-cot', 'travel cot', ARRAY['travel cot', 'portable cot', 'playpen'], 'sleep'),
  ('baby-bouncer', 'baby bouncer', ARRAY['bouncer', 'baby bouncer seat', 'bouncing seat'], 'play'),
  ('playmat', 'playmat', ARRAY['play mat', 'play gym', 'activity mat', 'gym'], 'play'),
  ('shape-sorter', 'shape sorter', ARRAY['shape sorter', 'shape sorting toy'], 'toys'),
  ('stacking-rings', 'stacking rings', ARRAY['stacking rings', 'ring stacker', 'rainbow stacker'], 'toys')
ON CONFLICT (slug) DO NOTHING;
