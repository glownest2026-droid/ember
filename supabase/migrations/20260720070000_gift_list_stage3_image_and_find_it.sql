-- Gift list: Stage 3 blank images inherit parent Stage 2 art (age-band scoped);
-- expose shop_query so /gift/[slug] can offer relatives a Google Shopping "Find it >" link.

BEGIN;

DROP FUNCTION IF EXISTS public.get_public_gift_list(TEXT);

CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  child_id UUID,
  shop_query TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := public.resolve_gift_slug_user_id(p_slug);
  IF v_user_id IS NULL THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    uli.id,
    uli.kind,
    COALESCE(
      (SELECT p.name FROM public.products p WHERE p.id = uli.product_id),
      (SELECT s.product_name FROM public.pl_stage3_picks s WHERE s.id = uli.stage3_pick_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      NULLIF(TRIM((SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id)), ''),
      NULLIF(TRIM((SELECT s.image_url FROM public.pl_stage3_picks s WHERE s.id = uli.stage3_pick_id)), ''),
      -- Stage 3 with no product photo → parent Stage 2 image for that pick's age band
      (
        SELECT v.image_url
        FROM public.pl_stage3_picks s
        JOIN public.v_gateway_category_type_images v
          ON v.category_type_id = s.category_type_id
         AND v.age_band_id IS NOT DISTINCT FROM s.age_band_id
        WHERE s.id = uli.stage3_pick_id
        LIMIT 1
      ),
      (
        SELECT v.image_url
        FROM public.pl_stage3_picks s
        JOIN public.v_gateway_category_type_images v
          ON v.category_type_id = s.category_type_id
         AND v.age_band_id IS NULL
        WHERE s.id = uli.stage3_pick_id
        LIMIT 1
      ),
      (
        SELECT v.image_url
        FROM public.pl_stage3_picks s
        JOIN public.v_gateway_category_type_images v
          ON v.category_type_id = s.category_type_id
        WHERE s.id = uli.stage3_pick_id
        LIMIT 1
      ),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id,
    NULLIF(
      TRIM(
        COALESCE(
          (
            SELECT CONCAT_WS(
              ' ',
              NULLIF(TRIM(s.brand), ''),
              NULLIF(TRIM(s.product_name), '')
            )
            FROM public.pl_stage3_picks s
            WHERE s.id = uli.stage3_pick_id
          ),
          (SELECT NULLIF(TRIM(p.name), '') FROM public.products p WHERE p.id = uli.product_id),
          (SELECT NULLIF(TRIM(ct.name), '') FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
          (SELECT NULLIF(TRIM(uw.ux_label), '') FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id)
        )
      ),
      ''
    )::TEXT AS shop_query
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS
  'Read-only gift list for /gift/[slug]. Stage 3 blank images inherit Stage 2 category art; shop_query drives Google Shopping Find it links.';

GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO authenticated;

COMMIT;
