-- Gift share slugs for public /gift/[slug] URLs.
-- One row per user; slug is stable and URL-safe (8–12 chars). Anon cannot read this table.
-- Public gift list data is exposed only via get_public_gift_list(slug) SECURITY DEFINER.

-- Table: one slug per user
CREATE TABLE IF NOT EXISTS public.gift_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(slug)
);

CREATE INDEX IF NOT EXISTS gift_shares_slug_idx ON public.gift_shares(slug);
CREATE INDEX IF NOT EXISTS gift_shares_user_id_idx ON public.gift_shares(user_id);

COMMENT ON TABLE public.gift_shares IS 'Stable share slug per user for public /gift/[slug] read-only gift list.';
COMMENT ON COLUMN public.gift_shares.slug IS 'URL-safe 8–12 char string; used in /gift/[slug].';

ALTER TABLE public.gift_shares ENABLE ROW LEVEL SECURITY;

-- Owner can read/insert/update/delete own row only. Anon has no access.
DROP POLICY IF EXISTS "gift_shares_select_own" ON public.gift_shares;
CREATE POLICY "gift_shares_select_own" ON public.gift_shares
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_insert_own" ON public.gift_shares;
CREATE POLICY "gift_shares_insert_own" ON public.gift_shares
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_update_own" ON public.gift_shares;
CREATE POLICY "gift_shares_update_own" ON public.gift_shares
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "gift_shares_delete_own" ON public.gift_shares;
CREATE POLICY "gift_shares_delete_own" ON public.gift_shares
  FOR DELETE USING (user_id = auth.uid());

-- Resolve slug to user_id (for server-only use). Returns NULL if slug not found.
-- Used by get_public_gift_list; not exposed to client.
CREATE OR REPLACE FUNCTION public.resolve_gift_slug_user_id(p_slug TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT user_id FROM public.gift_shares WHERE slug = p_slug LIMIT 1;
$$;

-- Public (anon) callable: returns gift list rows for a slug. No user_id or private data.
-- Runs with definer rights so it can read user_list_items for the resolved user.
CREATE OR REPLACE FUNCTION public.get_public_gift_list(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  kind TEXT,
  display_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ
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
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMENT ON FUNCTION public.get_public_gift_list(TEXT) IS 'Returns read-only gift list for /gift/[slug]. Callable by anon; exposes only gift-flagged items.';

-- Allow anon to call get_public_gift_list only (no table read). resolve_gift_slug_user_id stays internal.
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_gift_list(TEXT) TO authenticated;
