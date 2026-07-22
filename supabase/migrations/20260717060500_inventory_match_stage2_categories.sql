-- Stage 2 free-text match for At home add (Discover catalogue, not marketplace product_types).

CREATE OR REPLACE FUNCTION public.inventory_match_stage2_categories(
  query_text TEXT,
  p_age_band_id TEXT DEFAULT NULL,
  p_limit INT DEFAULT 6
)
RETURNS TABLE (
  category_type_id UUID,
  slug TEXT,
  label TEXT,
  age_band_id TEXT,
  image_url TEXT,
  confidence_bucket TEXT,
  score NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  WITH q AS (
    SELECT public.normalize_inventory_alias(TRIM(COALESCE(query_text, ''))) AS normalized_query
  ),
  candidates AS (
    SELECT
      ct.id AS category_type_id,
      ct.slug,
      COALESCE(abdnct.display_label, ct.name, ct.label) AS label,
      abdnct.age_band_id,
      COALESCE(
        (
          SELECT img.image_url
          FROM public.pl_category_type_images img
          WHERE img.category_type_id = ct.id
            AND img.is_active = true
            AND img.age_band_id IS NOT DISTINCT FROM abdnct.age_band_id
          ORDER BY img.sort NULLS LAST, img.created_at
          LIMIT 1
        ),
        (
          SELECT img.image_url
          FROM public.pl_category_type_images img
          WHERE img.category_type_id = ct.id
            AND img.is_active = true
            AND img.age_band_id IS NULL
          ORDER BY img.sort NULLS LAST, img.created_at
          LIMIT 1
        ),
        ct.image_url
      ) AS image_url,
      public.normalize_inventory_alias(
        COALESCE(abdnct.display_label, ct.name, ct.label, '')
      ) AS normalized_label,
      public.normalize_inventory_alias(COALESCE(ct.slug, '')) AS normalized_slug,
      public.normalize_inventory_alias(COALESCE(ct.label, '')) AS normalized_canonical_label,
      COALESCE(abdnct.rationale, '') AS rationale
    FROM public.pl_category_types ct
    INNER JOIN public.pl_age_band_development_need_category_types abdnct
      ON abdnct.category_type_id = ct.id
     AND abdnct.is_active = true
  ),
  ranked AS (
    SELECT
      c.category_type_id,
      c.slug,
      c.label,
      c.age_band_id,
      c.image_url,
      (
        CASE
          WHEN c.normalized_label = q.normalized_query THEN 100
          WHEN c.normalized_canonical_label = q.normalized_query THEN 92
          WHEN c.normalized_slug = q.normalized_query THEN 88
          WHEN c.normalized_slug = 'cat_' || replace(q.normalized_query, ' ', '_') THEN 85
          WHEN c.normalized_label LIKE '%' || q.normalized_query || '%' THEN 70
          WHEN c.normalized_canonical_label LIKE '%' || q.normalized_query || '%' THEN 65
          ELSE 0
        END
      )
      + (
        18 * GREATEST(
          ts_rank_cd(
            to_tsvector('simple', COALESCE(c.label, '')),
            plainto_tsquery('simple', q.normalized_query)
          ),
          ts_rank_cd(
            to_tsvector('simple', COALESCE(c.slug, '')),
            plainto_tsquery('simple', q.normalized_query)
          ),
          ts_rank_cd(
            to_tsvector('simple', left(c.rationale, 400)),
            plainto_tsquery('simple', q.normalized_query)
          )
        )
      )
      + (
        12 * GREATEST(
          similarity(c.normalized_label, q.normalized_query),
          similarity(c.normalized_canonical_label, q.normalized_query),
          similarity(replace(c.normalized_slug, 'cat_', ''), q.normalized_query)
        )
      )
      + (
        CASE
          WHEN p_age_band_id IS NOT NULL AND c.age_band_id = p_age_band_id THEN 25
          ELSE 0
        END
      ) AS score
    FROM candidates c
    CROSS JOIN q
    WHERE q.normalized_query <> ''
      AND (
        c.normalized_label = q.normalized_query
        OR c.normalized_canonical_label = q.normalized_query
        OR c.normalized_slug = q.normalized_query
        OR c.normalized_slug = 'cat_' || replace(q.normalized_query, ' ', '_')
        OR c.normalized_label LIKE '%' || q.normalized_query || '%'
        OR c.normalized_canonical_label LIKE '%' || q.normalized_query || '%'
        OR to_tsvector('simple', COALESCE(c.label, '')) @@ plainto_tsquery('simple', q.normalized_query)
        OR to_tsvector('simple', COALESCE(c.slug, '')) @@ plainto_tsquery('simple', q.normalized_query)
        OR to_tsvector('simple', left(c.rationale, 400)) @@ plainto_tsquery('simple', q.normalized_query)
        OR similarity(c.normalized_label, q.normalized_query) > 0.18
        OR similarity(c.normalized_canonical_label, q.normalized_query) > 0.18
        OR similarity(replace(c.normalized_slug, 'cat_', ''), q.normalized_query) > 0.2
      )
  ),
  deduped AS (
    SELECT DISTINCT ON (r.category_type_id)
      r.category_type_id,
      r.slug,
      r.label,
      r.age_band_id,
      r.image_url,
      r.score
    FROM ranked r
    ORDER BY
      r.category_type_id,
      CASE WHEN p_age_band_id IS NOT NULL AND r.age_band_id = p_age_band_id THEN 0 ELSE 1 END,
      r.score DESC
  )
  SELECT
    d.category_type_id,
    d.slug,
    d.label,
    d.age_band_id,
    d.image_url,
    CASE
      WHEN d.score >= 95 THEN 'high'
      WHEN d.score >= 45 THEN 'medium'
      ELSE 'low'
    END AS confidence_bucket,
    ROUND(d.score::numeric, 4) AS score
  FROM deduped d
  ORDER BY d.score DESC, d.label ASC
  LIMIT GREATEST(1, LEAST(COALESCE(NULLIF(p_limit, 0), 6), 20));
$$;

REVOKE ALL ON FUNCTION public.inventory_match_stage2_categories(TEXT, TEXT, INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.inventory_match_stage2_categories(TEXT, TEXT, INT) TO authenticated;

COMMENT ON FUNCTION public.inventory_match_stage2_categories(TEXT, TEXT, INT) IS
  'At home add: free-text → Discover Stage 2 category suggestions with optional age-band boost.';
