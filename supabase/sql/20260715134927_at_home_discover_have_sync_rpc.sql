-- Mirror: At home bridge (part 2) — RPC + backfill.
-- Requires enum value discover_have from 20260715134457.

CREATE OR REPLACE FUNCTION public.sync_at_home_from_discover_have(
  p_category_type_id UUID,
  p_child_id UUID,
  p_have BOOLEAN
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_item_id UUID;
  v_product_type_id UUID;
  v_label TEXT;
  v_slug TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_category_type_id IS NULL OR p_child_id IS NULL THEN
    RAISE EXCEPTION 'category_type_id and child_id are required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.children c
    WHERE c.id = p_child_id AND c.user_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Child not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.pl_category_types ct
    WHERE ct.id = p_category_type_id
  ) THEN
    RAISE EXCEPTION 'Category not found';
  END IF;

  SELECT ct.label, ct.slug
  INTO v_label, v_slug
  FROM public.pl_category_types ct
  WHERE ct.id = p_category_type_id;

  SELECT gi.id
  INTO v_item_id
  FROM public.garage_items gi
  WHERE gi.user_id = v_uid
    AND gi.category_type_id = p_category_type_id
    AND gi.child_id IS NOT DISTINCT FROM p_child_id
    AND gi.status IN ('owned', 'ready_to_move_on', 'listed')
  ORDER BY gi.added_at DESC
  LIMIT 1;

  IF NOT COALESCE(p_have, false) THEN
    IF v_item_id IS NOT NULL THEN
      UPDATE public.garage_items
      SET status = 'archived'
      WHERE id = v_item_id AND user_id = v_uid;
    END IF;
    RETURN v_item_id;
  END IF;

  IF v_item_id IS NOT NULL THEN
    UPDATE public.garage_items
    SET
      status = 'owned',
      child_scope_type = 'single_child',
      child_id = p_child_id,
      source = 'discover_have'
    WHERE id = v_item_id AND user_id = v_uid;
    RETURN v_item_id;
  END IF;

  SELECT pt.id
  INTO v_product_type_id
  FROM public.product_types pt
  WHERE pt.is_active = true
    AND (
      pt.slug = v_slug
      OR pt.slug = regexp_replace(v_slug, '^cat_', '')
      OR pt.normalized_label = public.normalize_inventory_alias(v_label)
    )
  ORDER BY
    CASE
      WHEN pt.slug = v_slug THEN 0
      WHEN pt.slug = regexp_replace(v_slug, '^cat_', '') THEN 1
      ELSE 2
    END
  LIMIT 1;

  SELECT gi.id
  INTO v_item_id
  FROM public.garage_items gi
  WHERE gi.user_id = v_uid
    AND gi.category_type_id = p_category_type_id
    AND gi.child_id IS NOT DISTINCT FROM p_child_id
    AND gi.status = 'archived'
  ORDER BY gi.updated_at DESC
  LIMIT 1;

  IF v_item_id IS NOT NULL THEN
    UPDATE public.garage_items
    SET
      status = 'owned',
      child_scope_type = 'single_child',
      child_id = p_child_id,
      product_type_id = COALESCE(garage_items.product_type_id, v_product_type_id),
      source = 'discover_have',
      raw_query = COALESCE(garage_items.raw_query, v_label)
    WHERE id = v_item_id AND user_id = v_uid;
    RETURN v_item_id;
  END IF;

  INSERT INTO public.garage_items (
    user_id,
    product_type_id,
    category_type_id,
    child_scope_type,
    child_id,
    raw_query,
    source,
    status
  )
  VALUES (
    v_uid,
    v_product_type_id,
    p_category_type_id,
    'single_child',
    p_child_id,
    v_label,
    'discover_have',
    'owned'
  )
  RETURNING id INTO v_item_id;

  RETURN v_item_id;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_at_home_from_discover_have(UUID, UUID, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sync_at_home_from_discover_have(UUID, UUID, BOOLEAN) TO authenticated;

INSERT INTO public.garage_items (
  user_id,
  product_type_id,
  category_type_id,
  child_scope_type,
  child_id,
  raw_query,
  source,
  status
)
SELECT
  uli.user_id,
  pt.id,
  uli.category_type_id,
  'single_child',
  uli.child_id,
  ct.label,
  'discover_have',
  'owned'
FROM public.user_list_items uli
JOIN public.pl_category_types ct ON ct.id = uli.category_type_id
LEFT JOIN LATERAL (
  SELECT p.id
  FROM public.product_types p
  WHERE p.is_active = true
    AND (
      p.slug = ct.slug
      OR p.slug = regexp_replace(ct.slug, '^cat_', '')
      OR p.normalized_label = public.normalize_inventory_alias(ct.label)
    )
  ORDER BY
    CASE
      WHEN p.slug = ct.slug THEN 0
      WHEN p.slug = regexp_replace(ct.slug, '^cat_', '') THEN 1
      ELSE 2
    END
  LIMIT 1
) pt ON true
WHERE uli.kind = 'category'
  AND uli.have = true
  AND uli.category_type_id IS NOT NULL
  AND uli.child_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM public.garage_items gi
    WHERE gi.user_id = uli.user_id
      AND gi.category_type_id = uli.category_type_id
      AND gi.child_id IS NOT DISTINCT FROM uli.child_id
      AND gi.status IN ('owned', 'ready_to_move_on', 'listed')
  );
