-- Add optional p_child_id to upsert_user_list_item so saves from /discover can store against the selected child.
-- When p_child_id is set, match/insert with that child_id; when null, keep existing behavior (child_id IS NULL).
-- Safe to run after 202602250000_family_user_list_items.

CREATE OR REPLACE FUNCTION public.upsert_user_list_item(
  p_kind TEXT,
  p_product_id UUID DEFAULT NULL,
  p_category_type_id UUID DEFAULT NULL,
  p_ux_wrapper_id UUID DEFAULT NULL,
  p_want BOOLEAN DEFAULT true,
  p_have BOOLEAN DEFAULT false,
  p_gift BOOLEAN DEFAULT false,
  p_child_id UUID DEFAULT NULL
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
