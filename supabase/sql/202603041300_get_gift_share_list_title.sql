-- Returns display name for the gift list owner (for "Gift list for [Name]'s family").
-- Uses first_name from auth.users.raw_user_meta_data; fallback 'Their'. Anon can call.

CREATE OR REPLACE FUNCTION public.get_gift_share_list_title(p_slug TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(NULLIF(trim(u.raw_user_meta_data->>'first_name'), ''), 'Their')
  FROM public.gift_shares g
  JOIN auth.users u ON u.id = g.user_id
  WHERE g.slug = p_slug
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_gift_share_list_title(TEXT) IS 'Display name for /gift/[slug] title. First name or Their.';

GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO authenticated;
