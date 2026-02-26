-- Add gifts_saved_count to get_my_subnav_stats (user_list_items where gift = true).
-- Safe to run after 202602250000_family_user_list_items.

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

  SELECT count(*)::INT INTO toys_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind = 'product' AND (want = true OR have = true);

  SELECT count(*)::INT INTO ideas_count
  FROM public.user_list_items
  WHERE user_id = uid AND kind IN ('idea', 'category') AND (want = true OR have = true);

  SELECT count(*)::INT INTO gifts_count
  FROM public.user_list_items
  WHERE user_id = uid AND gift = true;

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
