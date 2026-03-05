-- Marketplace: fuzzy item-type suggestion RPC using pg_trgm (D, E).
-- search_path includes extensions so similarity() resolves when pg_trgm is in extensions schema.

CREATE OR REPLACE FUNCTION public.suggest_marketplace_item_types(
  query_text TEXT,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  item_type_id UUID,
  canonical_name TEXT,
  slug TEXT,
  similarity_score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT
    m.id AS item_type_id,
    m.canonical_name,
    m.slug,
    ROUND((similarity(m.search_text, TRIM(query_text)))::numeric, 4) AS similarity_score
  FROM public.marketplace_item_types m
  WHERE m.is_active = true
    AND similarity(m.search_text, TRIM(query_text)) > 0.1
  ORDER BY similarity(m.search_text, TRIM(query_text)) DESC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 5), 20));
$$;

COMMENT ON FUNCTION public.suggest_marketplace_item_types(TEXT, INT) IS
  'Fuzzy suggestion for marketplace item types via pg_trgm; returns top N by similarity.';

-- Grant to authenticated (and anon if you want unauthenticated suggestions; least-privilege = authenticated only)
GRANT EXECUTE ON FUNCTION public.suggest_marketplace_item_types(TEXT, INT) TO authenticated;

-- =============================================================================
-- Smoke tests (run in Supabase SQL Editor after migrations)
-- =============================================================================
-- 1) suggest_marketplace_item_types('chair', 5)
--    Expect: high chair, bath chair, booster seat, car seat etc with similarity_score.
-- 2) suggest_marketplace_item_types('hi chair', 5)
--    Expect: high chair as strong candidate.
-- 3) suggest_marketplace_item_types('bath', 5)
--    Expect: bath chair / bath seat as candidate.
