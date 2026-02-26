-- Migration: user_list_items for /family "My list" (Want / Have / Gift)
-- Date: 2026-02-25
-- Purpose: Single canonical table for user list items; RLS auth-only; Gift implies Want.
-- Idempotent: Safe re-run (IF NOT EXISTS, DROP IF EXISTS for policies/triggers).

-- ============================================================================
-- PART 1: user_list_items table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NULL REFERENCES public.children(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('idea', 'category', 'product')),
  ux_wrapper_id UUID NULL REFERENCES public.pl_ux_wrappers(id) ON DELETE CASCADE,
  category_type_id UUID NULL REFERENCES public.pl_category_types(id) ON DELETE CASCADE,
  product_id UUID NULL REFERENCES public.products(id) ON DELETE CASCADE,
  want BOOLEAN NOT NULL DEFAULT false,
  have BOOLEAN NOT NULL DEFAULT false,
  gift BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Exactly one of (ux_wrapper_id, category_type_id, product_id) non-null, matching kind
  CONSTRAINT user_list_items_kind_ref_check CHECK (
    (kind = 'idea'    AND ux_wrapper_id IS NOT NULL AND category_type_id IS NULL AND product_id IS NULL) OR
    (kind = 'category' AND category_type_id IS NOT NULL AND ux_wrapper_id IS NULL AND product_id IS NULL) OR
    (kind = 'product'  AND product_id IS NOT NULL AND ux_wrapper_id IS NULL AND category_type_id IS NULL)
  ),
  -- Gift implies Want
  CONSTRAINT user_list_items_gift_implies_want CHECK (gift = false OR want = true)
);

-- Partial unique indexes (one row per user+child+ref per kind)
CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_ux_wrapper
  ON public.user_list_items (user_id, child_id, ux_wrapper_id)
  WHERE ux_wrapper_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_category
  ON public.user_list_items (user_id, child_id, category_type_id)
  WHERE category_type_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS user_list_items_uniq_product
  ON public.user_list_items (user_id, child_id, product_id)
  WHERE product_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_list_items_user_id_idx ON public.user_list_items (user_id);
CREATE INDEX IF NOT EXISTS user_list_items_user_id_kind_idx ON public.user_list_items (user_id, kind);
CREATE INDEX IF NOT EXISTS user_list_items_user_id_gift_true_idx ON public.user_list_items (user_id) WHERE gift = true;

ALTER TABLE public.user_list_items ENABLE ROW LEVEL SECURITY;

-- RLS: auth only; child_id must be owned by user if set
DROP POLICY IF EXISTS "user_list_items_select_own" ON public.user_list_items;
CREATE POLICY "user_list_items_select_own" ON public.user_list_items
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_list_items_insert_own" ON public.user_list_items;
CREATE POLICY "user_list_items_insert_own" ON public.user_list_items
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND (child_id IS NULL OR EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "user_list_items_update_own" ON public.user_list_items;
CREATE POLICY "user_list_items_update_own" ON public.user_list_items
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (
    user_id = auth.uid()
    AND (child_id IS NULL OR EXISTS (SELECT 1 FROM public.children c WHERE c.id = child_id AND c.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "user_list_items_delete_own" ON public.user_list_items;
CREATE POLICY "user_list_items_delete_own" ON public.user_list_items
  FOR DELETE USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS user_list_items_updated_at ON public.user_list_items;
CREATE TRIGGER user_list_items_updated_at
  BEFORE UPDATE ON public.user_list_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- PART 2: Backfill from existing user_saved_products and user_saved_ideas
-- ============================================================================

INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
SELECT p.user_id, NULL, 'product', p.product_id, true, false, false
FROM public.user_saved_products p
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_list_items uli
  WHERE uli.user_id = p.user_id AND uli.child_id IS NULL AND uli.product_id = p.product_id
);

DO $$
BEGIN
  INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
  SELECT u.user_id, NULL, 'category', u.idea_id, true, false, false
  FROM public.user_saved_ideas u
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_list_items uli
    WHERE uli.user_id = u.user_id AND uli.child_id IS NULL AND uli.category_type_id = u.idea_id
  );
EXCEPTION
  WHEN unique_violation THEN NULL;
END $$;

-- ============================================================================
-- PART 3: Update get_my_subnav_stats to count from user_list_items
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_my_subnav_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  toys_count INT;
  ideas_count INT;
  reminders_on BOOLEAN;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN json_build_object(
      'toys_saved_count', 0,
      'ideas_saved_count', 0,
      'development_reminders_enabled', false
    );
  END IF;

  SELECT count(*)::INT INTO toys_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

  SELECT COALESCE(development_reminders_enabled, false) INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

-- ============================================================================
-- PART 4: upsert_user_list_item (client upsert; Gift on => want=true)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.upsert_user_list_item(
  p_kind TEXT,
  p_product_id UUID DEFAULT NULL,
  p_category_type_id UUID DEFAULT NULL,
  p_ux_wrapper_id UUID DEFAULT NULL,
  p_want BOOLEAN DEFAULT true,
  p_have BOOLEAN DEFAULT false,
  p_gift BOOLEAN DEFAULT false
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
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF p_gift = true THEN
    v_want := true;
  END IF;

  IF p_kind = 'product' AND p_product_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND product_id = p_product_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, product_id, want, have, gift)
      VALUES (uid, NULL, 'product', p_product_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'category' AND p_category_type_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND category_type_id = p_category_type_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, category_type_id, want, have, gift)
      VALUES (uid, NULL, 'category', p_category_type_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSIF p_kind = 'idea' AND p_ux_wrapper_id IS NOT NULL THEN
    SELECT id INTO rid FROM public.user_list_items
    WHERE user_id = uid AND child_id IS NULL AND ux_wrapper_id = p_ux_wrapper_id;
    IF rid IS NOT NULL THEN
      UPDATE public.user_list_items SET want = v_want, have = p_have, gift = v_gift WHERE id = rid;
    ELSE
      INSERT INTO public.user_list_items (user_id, child_id, kind, ux_wrapper_id, want, have, gift)
      VALUES (uid, NULL, 'idea', p_ux_wrapper_id, v_want, p_have, v_gift)
      RETURNING id INTO rid;
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid kind or missing ref';
  END IF;
  RETURN rid;
END;
$$;
</think>
Fixing the migration: removing the duplicate category INSERT and making the backfill idempotent.
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace