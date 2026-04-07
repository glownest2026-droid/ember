-- PR2A: Account-level reminder topic preferences (one row per user per topic).
-- Does not modify or read legacy reminder flags.

CREATE TABLE IF NOT EXISTS public.user_reminder_topic_prefs (
  user_id UUID NOT NULL,
  topic_key TEXT NOT NULL,
  email_enabled BOOLEAN NOT NULL DEFAULT false,
  push_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, topic_key),
  CONSTRAINT user_reminder_topic_prefs_topic_key_check CHECK (
    topic_key IN ('monthly_stage_updates', 'move_it_on_prompts')
  )
);

CREATE INDEX IF NOT EXISTS user_reminder_topic_prefs_user_id_idx
  ON public.user_reminder_topic_prefs(user_id);

ALTER TABLE public.user_reminder_topic_prefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_reminder_topic_prefs_select_own" ON public.user_reminder_topic_prefs;
CREATE POLICY "user_reminder_topic_prefs_select_own" ON public.user_reminder_topic_prefs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "user_reminder_topic_prefs_insert_own" ON public.user_reminder_topic_prefs;
CREATE POLICY "user_reminder_topic_prefs_insert_own" ON public.user_reminder_topic_prefs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "user_reminder_topic_prefs_update_own" ON public.user_reminder_topic_prefs;
CREATE POLICY "user_reminder_topic_prefs_update_own" ON public.user_reminder_topic_prefs
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

COMMENT ON TABLE public.user_reminder_topic_prefs IS 'Household reminder choices per topic; separate from browser push subscription state.';

DROP TRIGGER IF EXISTS user_reminder_topic_prefs_updated_at ON public.user_reminder_topic_prefs;
CREATE TRIGGER user_reminder_topic_prefs_updated_at
  BEFORE UPDATE ON public.user_reminder_topic_prefs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
