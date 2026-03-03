-- Per-child stats: count only items explicitly saved to that child (child_id = p_child_id).
-- When a child has no saves, stats show 0. "All children" (p_child_id null) still aggregates all.
-- Safe to run after 202603031000_subnav_stats_per_child.

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
    -- Per child: only items saved to this child (child_id = p_child_id). No unassigned.
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
  ELSE
    -- All children: aggregate everything
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items
    WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

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
