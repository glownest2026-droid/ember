-- Migration: add stacked reminders settings columns to user_notification_prefs.
-- Date: 2026-03-30
-- Purpose: support /family#reminders master/channel/topic preferences in one row per user.
-- Idempotent: safe to re-run.

ALTER TABLE public.user_notification_prefs
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS channel_email_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS channel_push_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS topic_monthly_stage_updates_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS topic_move_it_on_prompts_enabled BOOLEAN NOT NULL DEFAULT false;

-- Keep legacy reminders field and new master field aligned for existing rows.
UPDATE public.user_notification_prefs
SET reminders_enabled = true
WHERE development_reminders_enabled = true
  AND reminders_enabled = false;

-- Backfill channel/topic values from legacy per-topic table for users who
-- do not already have any values in the new model.
WITH topic_rollup AS (
  SELECT
    user_id,
    BOOL_OR(email_enabled) AS channel_email_enabled,
    BOOL_OR(push_enabled) AS channel_push_enabled,
    BOOL_OR(topic_key = 'monthly_stage_updates' AND (email_enabled OR push_enabled))
      AS topic_monthly_stage_updates_enabled,
    BOOL_OR(topic_key = 'move_it_on_prompts' AND (email_enabled OR push_enabled))
      AS topic_move_it_on_prompts_enabled
  FROM public.user_reminder_topic_prefs
  GROUP BY user_id
)
INSERT INTO public.user_notification_prefs (
  user_id,
  development_reminders_enabled,
  reminders_enabled,
  channel_email_enabled,
  channel_push_enabled,
  topic_monthly_stage_updates_enabled,
  topic_move_it_on_prompts_enabled
)
SELECT
  tr.user_id,
  true,
  true,
  tr.channel_email_enabled,
  tr.channel_push_enabled,
  tr.topic_monthly_stage_updates_enabled,
  tr.topic_move_it_on_prompts_enabled
FROM topic_rollup tr
WHERE NOT EXISTS (
  SELECT 1
  FROM public.user_notification_prefs unp
  WHERE unp.user_id = tr.user_id
);

WITH topic_rollup AS (
  SELECT
    user_id,
    BOOL_OR(email_enabled) AS channel_email_enabled,
    BOOL_OR(push_enabled) AS channel_push_enabled,
    BOOL_OR(topic_key = 'monthly_stage_updates' AND (email_enabled OR push_enabled))
      AS topic_monthly_stage_updates_enabled,
    BOOL_OR(topic_key = 'move_it_on_prompts' AND (email_enabled OR push_enabled))
      AS topic_move_it_on_prompts_enabled
  FROM public.user_reminder_topic_prefs
  GROUP BY user_id
)
UPDATE public.user_notification_prefs unp
SET
  channel_email_enabled = tr.channel_email_enabled,
  channel_push_enabled = tr.channel_push_enabled,
  topic_monthly_stage_updates_enabled = tr.topic_monthly_stage_updates_enabled,
  topic_move_it_on_prompts_enabled = tr.topic_move_it_on_prompts_enabled,
  reminders_enabled = true,
  development_reminders_enabled = true
FROM topic_rollup tr
WHERE unp.user_id = tr.user_id
  AND unp.channel_email_enabled = false
  AND unp.channel_push_enabled = false
  AND unp.topic_monthly_stage_updates_enabled = false
  AND unp.topic_move_it_on_prompts_enabled = false;
