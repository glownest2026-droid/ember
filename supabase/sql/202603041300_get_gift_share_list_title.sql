-- Returns display name for the gift list owner (for "Gift list for [Name]'s family").
-- Uses full_name, name, then first_name from auth.users.raw_user_meta_data (Dashboard Display name = full_name); fallback 'Their'. Anon can call.

CREATE OR REPLACE FUNCTION public.get_gift_share_list_title(p_slug TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    NULLIF(trim(u.raw_user_meta_data->>'display_name'), ''),
    NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(u.raw_user_meta_data->>'name'), ''),
    NULLIF(trim(
      concat(
        trim(COALESCE(u.raw_user_meta_data->>'first_name', '')),
        CASE WHEN NULLIF(trim(u.raw_user_meta_data->>'last_name'), '') IS NOT NULL THEN ' ' || trim(u.raw_user_meta_data->>'last_name') ELSE '' END
      )
    ), ''),
    NULLIF(trim(u.raw_user_meta_data->>'first_name'), ''),
    'Their'
  )
  FROM public.gift_shares g
  JOIN auth.users u ON u.id = g.user_id
  WHERE g.slug = p_slug
  LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_gift_share_list_title(TEXT) IS 'Display name for /gift/[slug] title. First name or Their.';

GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_gift_share_list_title(TEXT) TO authenticated;

-- Returns child ids and display labels for the gift list owner (dropdown: "Alex - Aged 6+"). Uses child_name/display_name + age_band; fallback "Child N". Anon can call.
DROP FUNCTION IF EXISTS public.get_public_gift_children(TEXT);
CREATE FUNCTION public.get_public_gift_children(p_slug TEXT)
RETURNS TABLE (child_id UUID, label TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    c.id AS child_id,
    CASE
      WHEN NULLIF(trim(COALESCE(c.child_name, c.display_name, '')), '') IS NOT NULL THEN
        trim(COALESCE(c.child_name, c.display_name)) || CASE WHEN NULLIF(trim(COALESCE(c.age_band, '')), '') IS NOT NULL THEN ' - Aged ' || trim(c.age_band) ELSE '' END
      ELSE 'Child ' || (row_number() OVER (ORDER BY c.created_at ASC NULLS LAST, c.id ASC))::text
    END AS label
  FROM public.gift_shares g
  JOIN public.children c ON c.user_id = g.user_id AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
  WHERE g.slug = p_slug
  ORDER BY c.created_at ASC NULLS LAST, c.id ASC;
$$;

COMMENT ON FUNCTION public.get_public_gift_children(TEXT) IS 'Child ids + labels for /gift/[slug] dropdown (e.g. Alex - Aged 6+).';

GRANT EXECUTE ON FUNCTION public.get_public_gift_children(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_children(TEXT) TO authenticated;
