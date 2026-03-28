-- Household-level reminder preferences (email master + per-topic email/push; marketplace launch separated).
-- Idempotent: safe to re-run.

ALTER TABLE public.user_notification_prefs
  ADD COLUMN IF NOT EXISTS email_master_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_topic_monthly_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_topic_moveit_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS push_topic_monthly_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS push_topic_moveit_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketplace_launch_email BOOLEAN NOT NULL DEFAULT false;

-- Backfill from legacy column: old UI used a single toggle for monthly email consent.
UPDATE public.user_notification_prefs
SET
  email_topic_monthly_enabled = COALESCE(development_reminders_enabled, false),
  email_master_enabled = COALESCE(development_reminders_enabled, false);

UPDATE public.user_notification_prefs
SET development_reminders_enabled =
  COALESCE(email_master_enabled, false) AND COALESCE(email_topic_monthly_enabled, false);

CREATE OR REPLACE FUNCTION public.user_notification_prefs_sync_legacy_dev_reminders()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.development_reminders_enabled :=
    COALESCE(NEW.email_master_enabled, false) AND COALESCE(NEW.email_topic_monthly_enabled, false);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_notification_prefs_sync_legacy ON public.user_notification_prefs;
CREATE TRIGGER user_notification_prefs_sync_legacy
  BEFORE INSERT OR UPDATE OF email_master_enabled, email_topic_monthly_enabled
  ON public.user_notification_prefs
  FOR EACH ROW
  EXECUTE FUNCTION public.user_notification_prefs_sync_legacy_dev_reminders();

COMMENT ON COLUMN public.user_notification_prefs.email_master_enabled IS 'Household: master switch for email channel.';
COMMENT ON COLUMN public.user_notification_prefs.email_topic_monthly_enabled IS 'Household: monthly stage updates via email.';
COMMENT ON COLUMN public.user_notification_prefs.email_topic_moveit_enabled IS 'Household: move-it-on prompts via email.';
COMMENT ON COLUMN public.user_notification_prefs.push_topic_monthly_enabled IS 'Household: monthly stage updates via push when browser is subscribed.';
COMMENT ON COLUMN public.user_notification_prefs.push_topic_moveit_enabled IS 'Household: move-it-on prompts via push when browser is subscribed.';
COMMENT ON COLUMN public.user_notification_prefs.marketplace_launch_email IS 'Opt-in for marketplace launch emails (separate from stage reminders).';

-- RPC: monthly reminder line item for subnav = email master AND monthly topic.
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
    SELECT count(*)::INT INTO toys_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind = 'product' AND (uli.want = true OR uli.have = true)
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));

    SELECT count(*)::INT INTO ideas_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.kind IN ('idea', 'category') AND (uli.want = true OR uli.have = true)
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));

    SELECT count(*)::INT INTO gifts_count
    FROM public.user_list_items uli
    WHERE uli.user_id = uid AND uli.gift = true
      AND uli.child_id IS NOT NULL
      AND EXISTS (SELECT 1 FROM public.children c WHERE c.id = uli.child_id AND c.user_id = uid AND (c.is_suppressed = false OR c.is_suppressed IS NULL));
  END IF;

  SELECT
    COALESCE(email_master_enabled, false) AND COALESCE(email_topic_monthly_enabled, false)
  INTO reminders_on
  FROM public.user_notification_prefs
  WHERE user_id = uid;

  IF NOT FOUND THEN
    reminders_on := false;
  END IF;

  RETURN json_build_object(
    'toys_saved_count', COALESCE(toys_count, 0),
    'ideas_saved_count', COALESCE(ideas_count, 0),
    'gifts_saved_count', COALESCE(gifts_count, 0),
    'development_reminders_enabled', COALESCE(reminders_on, false)
  );
END;
$$;

COMMENT ON FUNCTION public.get_my_subnav_stats(UUID) IS 'Counts for subnav; only items assigned to a visible child; unassigned never counted so legacy saves do not reappear when adding a new child.';
