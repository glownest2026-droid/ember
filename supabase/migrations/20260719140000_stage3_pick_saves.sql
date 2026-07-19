-- Stage 3 Pip's Picks can be saved to "My ideas" (Products tab).
--
-- Founder bug bash 2026-07-19 follow-up, item 1: the save icon on Stage 3 cards
-- must save the *product pick itself* (not its Stage 2 category) and show it in
-- the Products tab of /my-ideas, like Discover product saves do.
--
-- Stage 3 picks live in pl_stage3_picks (not the legacy products table), so
-- user_list_items gets a fourth kind: 'stage3_pick' with its own FK.
--
-- Also consolidates upsert_user_list_item into a single function: the live DB
-- carried two overloads (7-arg and 8-arg), which makes PostgREST calls that
-- omit p_child_id ambiguous. Both are dropped and recreated as one 9-arg
-- function with defaults.
--
-- Idempotent. Safe to re-run.

BEGIN;

ALTER TABLE public.user_list_items
  ADD COLUMN IF NOT EXISTS stage3_pick_id UUID REFERENCES public.pl_stage3_picks(id) ON DELETE CASCADE;

ALTER TABLE public.user_list_items DROP CONSTRAINT IF EXISTS user_list_items_kind_check;
ALTER TABLE public.user_list_items ADD CONSTRAINT user_list_items_kind_check
  CHECK (kind IN ('idea', 'category', 'product', 'stage3_pick'));

ALTER TABLE public.user_list_items DROP CONSTRAINT IF EXISTS user_list_items_kind_ref_check;
ALTER TABLE public.user_list_items ADD CONSTRAINT user_list_items_kind_ref_check CHECK (
  (kind = 'idea'        AND ux_wrapper_id IS NOT NULL AND category_type_id IS NULL AND product_id IS NULL AND stage3_pick_id IS NULL) OR
  (kind = 'category'    AND category_type_id IS NOT NULL AND ux_wrapper_id IS NULL AND product_id IS NULL AND stage3_pick_id IS NULL) OR
  (kind = 'product'     AND product_id IS NOT NULL AND ux_wrapper_id IS NULL AND category_type_id IS NULL AND stage3_pick_id IS NULL) OR
  (kind = 'stage3_pick' AND stage3_pick_id IS NOT NULL AND ux_wrapper_id IS NULL AND category_type_id IS NULL AND product_id IS NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_stage3_pick
  ON public.user_list_items (user_id, child_id, stage3_pick_id)
  WHERE stage3_pick_id IS NOT NULL;

-- Single canonical upsert function (drops the ambiguous overload pair).
DROP FUNCTION IF EXISTS public.upsert_user_list_item(text, uuid, uuid, uuid, boolean, boolean, boolean);
DROP FUNCTION IF EXISTS public.upsert_user_list_item(text, uuid, uuid, uuid, boolean, boolean, boolean, uuid);
DROP FUNCTION IF EXISTS public.upsert_user_list_item(text, uuid, uuid, uuid, boolean, boolean, boolean, uuid, uuid);

CREATE FUNCTION public.upsert_user_list_item(
  p_kind TEXT,
  p_product_id UUID DEFAULT NULL,
  p_category_type_id UUID DEFAULT NULL,
  p_ux_wrapper_id UUID DEFAULT NULL,
  p_want BOOLEAN DEFAULT true,
  p_have BOOLEAN DEFAULT false,
  p_gift BOOLEAN DEFAULT false,
  p_child_id UUID DEFAULT NULL,
  p_stage3_pick_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  rid UUID;
  v_want BOOLEAN := p_want;
  v_gift BOOLEAN := p_gift;
  v_child_id UUID := p_child_id;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_gift = true THEN
    v_want := true;
  END IF;
  -- Ensure child belongs to user when p_child_id is set
  IF v_child_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.children c WHERE c.id = v_child_id AND c.user_id = uid) THEN
    v_child_id := NULL;
  END IF;

  IF p_kind = 'product' AND p_product_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND product_id = p_product_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
      VALUES (uid, v_child_id, 'product', p_product_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'stage3_pick' AND p_stage3_pick_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND stage3_pick_id = p_stage3_pick_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, stage3_pick_id, want, have, gift)
      VALUES (uid, v_child_id, 'stage3_pick', p_stage3_pick_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'category' AND p_category_type_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND category_type_id = p_category_type_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
      VALUES (uid, v_child_id, 'category', p_category_type_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'idea' AND p_ux_wrapper_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND (child_id IS NOT DISTINCT FROM v_child_id) AND ux_wrapper_id = p_ux_wrapper_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, ux_wrapper_id, want, have, gift)
      VALUES (uid, v_child_id, 'idea', p_ux_wrapper_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid kind or missing ref';
  END IF;
  RETURN rid;
END;
$$;

-- Saved Stage 3 picks count as "toys"/products in subnav stats.
CREATE OR REPLACE FUNCTION public.get_my_subnav_stats(p_child_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  gifts_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'gifts_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  IF p_child_id IS NOT NULL THEN
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind IN ('product', 'stage3_pick') AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id
      AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.child_id = p_child_id AND uli.gift = true;
  ELSE
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind IN ('product', 'stage3_pick') AND (want = true OR have = true);

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items
    WHERE user_id = uid AND gift = true;
  END IF;

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- Public gift list: resolve names/images for saved Stage 3 picks too.
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
      (SELECT s.product_name FROM public.pl_stage3_picks s WHERE s.id = uli.stage3_pick_id),
      (SELECT ct.name FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id),
      (SELECT uw.ux_label FROM public.pl_ux_wrappers uw WHERE uw.id = uli.ux_wrapper_id),
      '—'
    )::TEXT AS display_name,
    COALESCE(
      (SELECT p.image_url FROM public.products p WHERE p.id = uli.product_id),
      (SELECT s.image_url FROM public.pl_stage3_picks s WHERE s.id = uli.stage3_pick_id),
      (SELECT v.image_url FROM public.v_gateway_category_type_images v WHERE v.category_type_id = uli.category_type_id LIMIT 1),
      (SELECT ct.image_url FROM public.pl_category_types ct WHERE ct.id = uli.category_type_id)
    )::TEXT AS image_url,
    uli.created_at,
    uli.child_id
  FROM public.user_list_items uli
  WHERE uli.user_id = v_user_id AND uli.gift = true
  ORDER BY uli.created_at DESC;
END;
$$;

COMMIT;
