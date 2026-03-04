-- When a child is removed (is_suppressed = true), hide their saves in UI but keep data in DB.
-- 1) RLS: user_list_items SELECT excludes rows whose child_id references a suppressed child.
-- 2) get_my_subnav_stats: exclude suppressed children's items from counts (all and per-child).

-- ============================================================================
-- PART 1: user_list_items SELECT policy — hide items for suppressed children
-- ============================================================================

DROP POLICY IF EXISTS "user_list_items_select_own" ON public.user_list_items;
CREATE POLICY "user_list_items_select_own" ON public.user_list_items
  FOR SELECT USING (
    user_id = auth.uid()
    AND (
      child_id IS NULL
      OR EXISTS (
        SELECT 1 FROM public.children c
        WHERE c.id = user_list_items.child_id
          AND c.user_id = auth.uid()
          AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
      )
    )
  );

COMMENT ON POLICY "user_list_items_select_own" ON public.user_list_items IS 'Own rows only; exclude items for suppressed (removed) children so My List and counts hide them; data kept in DB.';

-- ============================================================================
-- PART 2: get_my_subnav_stats — exclude suppressed children from counts
-- ============================================================================

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
    -- Per child: only items for this child, and only if child is not suppressed
    IF NOT EXISTS (SELECT 1 FROM public.children c WHERE c.id = p_child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL)) THEN
      toys_count := 0;
      ideas_count := 0;
      gifts_count := 0;
    ELSE
      SELECT count(*)::INT INTO toys_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id
        AND uli.kind = 'product' AND (uli.want = true OR uli.have = true);

      SELECT count(*)::INT INTO ideas_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id
        AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true);

      SELECT count(*)::INT INTO gifts_count
      FROM public.user_list_items uli
      WHERE uli.user_id = uid AND uli.child_id = p_child_id AND uli.gift = true;
    END IF;
  ELSE
    -- All children: aggregate only items for visible (non-suppressed) children or unassigned
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind = 'product' AND (uli.want = true OR uli.have = true)
      AND (
        uli.child_id IS NULL
        OR EXISTS (
          SELECT 1 FROM public.children c
          WHERE c.id = uli.child_id AND c.user_id = uid
            AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
        )
      );

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true)
      AND (
        uli.child_id IS NULL
        OR EXISTS (
          SELECT 1 FROM public.children c
          WHERE c.id = uli.child_id AND c.user_id = uid
            AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
        )
      );

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.gift = true
      AND (
        uli.child_id IS NULL
        OR EXISTS (
          SELECT 1 FROM public.children c
          WHERE c.id = uli.child_id AND c.user_id = uid
            AND (c.is_suppressed = false OR c.is_suppressed IS NULL)
        )
      );
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

COMMENT ON FUNCTION public.get_my_subnav_stats(UUID) IS 'Counts for subnav; excludes items for suppressed (removed) children so stats and My List match.';
