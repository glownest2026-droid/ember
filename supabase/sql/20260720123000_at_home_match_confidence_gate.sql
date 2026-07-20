-- At home match quality: prefer no match over a wrong match.
-- Replaces loose trigram-only hits (e.g. sword→swaddle, toy umbrella→umbrella stroller).

CREATE OR REPLACE FUNCTION public.inventory_at_home_significant_tokens(normalized_query TEXT)
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(
    array_agg(DISTINCT tok ORDER BY tok),
    ARRAY[]::TEXT[]
  )
  FROM (
    SELECT tok
    FROM unnest(regexp_split_to_array(COALESCE(normalized_query, ''), '\s+')) AS tok
    WHERE length(tok) >= 3
      AND tok NOT IN (
        'toy', 'toys', 'and', 'the', 'for', 'with', 'kid', 'kids', 'child', 'children',
        'baby', 'new', 'set', 'play', 'home', 'item'
      )
  ) t;
$$;

CREATE OR REPLACE FUNCTION public.inventory_at_home_query_has_toy(normalized_query TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT COALESCE(normalized_query, '') LIKE '%toy%';
$$;

CREATE OR REPLACE FUNCTION public.inventory_at_home_is_toy_class(
  p_slug TEXT,
  p_label TEXT,
  p_alias TEXT,
  p_family_slug TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    p_family_slug IS NOT NULL
    OR COALESCE(p_slug, '') LIKE 'toy_%'
    OR COALESCE(p_label, '') LIKE '%toy%'
    OR COALESCE(p_alias, '') LIKE '%toy%'
    OR COALESCE(p_label, '') LIKE '%pretend%'
    OR COALESCE(p_alias, '') LIKE '%pretend%'
    OR COALESCE(p_label, '') LIKE '%plush%'
    OR COALESCE(p_alias, '') LIKE '%plush%'
    OR COALESCE(p_label, '') LIKE '%soft%'
    OR COALESCE(p_alias, '') LIKE '%soft%'
    OR COALESCE(p_label, '') LIKE '%puppet%'
    OR COALESCE(p_alias, '') LIKE '%puppet%'
    OR COALESCE(p_label, '') LIKE '%doll%'
    OR COALESCE(p_alias, '') LIKE '%doll%';
$$;

CREATE OR REPLACE FUNCTION public.inventory_at_home_tokens_covered(
  tokens TEXT[],
  haystack TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    COALESCE(array_length(tokens, 1), 0) = 0
    OR NOT EXISTS (
      SELECT 1
      FROM unnest(tokens) AS tok
      WHERE COALESCE(haystack, '') NOT LIKE '%' || tok || '%'
    );
$$;

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
  WITH q AS (
    SELECT
      public.normalize_inventory_alias(TRIM(COALESCE(query_text, ''))) AS normalized_query,
      public.inventory_at_home_significant_tokens(
        public.normalize_inventory_alias(TRIM(COALESCE(query_text, '')))
      ) AS tokens,
      public.inventory_at_home_query_has_toy(
        public.normalize_inventory_alias(TRIM(COALESCE(query_text, '')))
      ) AS query_has_toy
  ),
  corpus AS (
    SELECT
      pt.id,
      pt.slug,
      pt.label,
      pt.subtitle,
      pt.family_slug,
      pt.normalized_label,
      NULL::TEXT AS alias_text,
      pt.normalized_label AS haystack
    FROM public.product_types pt
    WHERE pt.is_active = true
    UNION ALL
    SELECT
      pt.id,
      pt.slug,
      pt.label,
      pt.subtitle,
      pt.family_slug,
      pt.normalized_label,
      pa.alias AS alias_text,
      pa.normalized_alias AS haystack
    FROM public.product_types pt
    JOIN public.product_type_aliases pa ON pa.product_type_id = pt.id
    WHERE pt.is_active = true
  ),
  scored AS (
    SELECT
      c.id,
      c.slug,
      c.label,
      c.subtitle,
      c.family_slug,
      c.alias_text,
      (
        CASE
          WHEN c.normalized_label = q.normalized_query THEN 100
          WHEN c.haystack = q.normalized_query THEN 95
          WHEN q.normalized_query <> ''
            AND position(q.normalized_query IN c.haystack) > 0 THEN 82
          WHEN q.normalized_query <> ''
            AND position(c.haystack IN q.normalized_query) > 0
            AND length(c.haystack) >= 4 THEN 78
          WHEN public.inventory_at_home_tokens_covered(q.tokens, c.haystack) THEN 68
          ELSE 0
        END
      ) AS base_score,
      q.query_has_toy,
      q.normalized_query
    FROM corpus c
    CROSS JOIN q
    WHERE q.normalized_query <> ''
      AND (
        c.normalized_label = q.normalized_query
        OR c.haystack = q.normalized_query
        OR (q.normalized_query <> '' AND position(q.normalized_query IN c.haystack) > 0)
        OR (
          q.normalized_query <> ''
          AND length(c.haystack) >= 4
          AND position(c.haystack IN q.normalized_query) > 0
        )
        OR public.inventory_at_home_tokens_covered(q.tokens, c.haystack)
      )
  ),
  gated AS (
    SELECT
      s.id,
      s.slug,
      s.label,
      s.subtitle,
      s.family_slug,
      MAX(s.base_score) AS score
    FROM scored s
  WHERE s.base_score > 0
    AND (
      NOT s.query_has_toy
      OR public.inventory_at_home_is_toy_class(
        s.slug,
        s.label,
        s.alias_text,
        s.family_slug
      )
    )
  GROUP BY s.id, s.slug, s.label, s.subtitle, s.family_slug
  ),
  ranked AS (
    SELECT
      g.id AS product_type_id,
      g.slug,
      g.label,
      g.subtitle,
      g.family_slug,
      COALESCE(f.label, g.label) AS family_label,
      f.hint AS family_hint,
      g.label AS specific_label,
      g.score,
      CASE
        WHEN g.score >= 95 THEN 'high'
        WHEN g.score >= 68 THEN 'medium'
        ELSE 'low'
      END AS confidence_bucket,
      ROW_NUMBER() OVER (
        PARTITION BY COALESCE(g.family_slug, g.slug)
        ORDER BY g.score DESC, g.label ASC
      ) AS family_rank
    FROM gated g
    LEFT JOIN public.item_type_families f
      ON f.slug = g.family_slug
     AND f.is_active = true
    WHERE g.score >= 68
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
    ROUND(r.score::numeric, 4) AS score
  FROM ranked r
  WHERE r.family_rank = 1
  ORDER BY r.score DESC, r.family_label ASC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 1), 5));
$$;

COMMENT ON FUNCTION public.inventory_match_at_home(TEXT, INT) IS
  'Strict At home match: exact/alias/substring/token overlap only; toy queries require toy-class types; no trigram-only guesses.';

GRANT EXECUTE ON FUNCTION public.inventory_at_home_significant_tokens(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.inventory_at_home_query_has_toy(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.inventory_at_home_is_toy_class(TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.inventory_at_home_tokens_covered(TEXT[], TEXT) TO authenticated;
