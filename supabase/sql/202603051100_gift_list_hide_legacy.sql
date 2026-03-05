-- Gift list: only show items assigned to a visible (non-suppressed) child (match My List rule).
-- Excludes unassigned and suppressed-child items so /gift page does not show legacy content.

CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ,
  child_id UUID
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
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id
    AND uli.gift = true
    AND uli.child_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.children c
      WHERE c.id = uli.child_id
        AND c.user_id = v_user_id
        AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
    )
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Read-only gift list for /gift/[slug]. Only items assigned to a visible (non-suppressed) child; no legacy/unassigned.';
