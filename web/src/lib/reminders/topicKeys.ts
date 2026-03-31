/** Keys for `user_reminder_topic_prefs.topic_key` — same handling for every topic. */
export const REMINDER_TOPIC_KEYS = {
  MONTHLY_STAGE_UPDATES: 'monthly_stage_updates',
  MOVE_IT_ON_PROMPTS: 'move_it_on_prompts',
} as const;

export type ReminderTopicKey = (typeof REMINDER_TOPIC_KEYS)[keyof typeof REMINDER_TOPIC_KEYS];
