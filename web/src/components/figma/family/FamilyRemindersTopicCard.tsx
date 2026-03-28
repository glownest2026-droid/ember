'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SubnavSwitch } from '@/components/subnav/SubnavSwitch';
import { REMINDER_TOPIC_KEYS, type ReminderTopicKey } from '@/lib/reminders/topicKeys';

type TopicRow = {
  topic_key: ReminderTopicKey;
  email_enabled: boolean;
  push_enabled: boolean;
};

const TOPIC_LABELS: Record<ReminderTopicKey, string> = {
  [REMINDER_TOPIC_KEYS.MONTHLY_STAGE_UPDATES]: 'Monthly stage updates',
  [REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS]: 'Move-it-on prompts',
};

function emptyRows(): Record<ReminderTopicKey, TopicRow> {
  return {
    [REMINDER_TOPIC_KEYS.MONTHLY_STAGE_UPDATES]: {
      topic_key: REMINDER_TOPIC_KEYS.MONTHLY_STAGE_UPDATES,
      email_enabled: false,
      push_enabled: false,
    },
    [REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS]: {
      topic_key: REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS,
      email_enabled: false,
      push_enabled: false,
    },
  };
}

/**
 * /family#reminders — reminder topic preferences (PR2A: email save only; push section placeholder; push column off until PR2B).
 */
export function FamilyRemindersTopicCard({ serverUserId }: { serverUserId: string }) {
  const [rows, setRows] = useState<Record<ReminderTopicKey, TopicRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  const userId = serverUserId;

  const load = useCallback(async () => {
    if (!userId) {
      setRows(null);
      setLoading(false);
      return;
    }
    setLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_reminder_topic_prefs')
      .select('topic_key, email_enabled, push_enabled')
      .eq('user_id', userId)
      .in('topic_key', [
        REMINDER_TOPIC_KEYS.MONTHLY_STAGE_UPDATES,
        REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS,
      ]);

    if (error) {
      console.error('[FamilyReminders] load failed', error);
      setLoadError(error.message ?? 'Could not load reminder settings.');
      setRows(emptyRows());
      setLoading(false);
      return;
    }

    const next = emptyRows();
    for (const r of data ?? []) {
      const key = r.topic_key as ReminderTopicKey;
      if (key in next) {
        next[key] = {
          topic_key: key,
          email_enabled: Boolean(r.email_enabled),
          push_enabled: Boolean(r.push_enabled),
        };
      }
    }
    setRows(next);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const persistTopic = useCallback(
    async (topicKey: ReminderTopicKey, patch: Partial<Pick<TopicRow, 'email_enabled' | 'push_enabled'>>) => {
      if (!userId || !rows) return;
      setSaveError(null);
      setSaveOk(false);
      const prev = rows[topicKey];
      const nextRow: TopicRow = {
        ...prev,
        ...patch,
      };
      setRows((r) => (r ? { ...r, [topicKey]: nextRow } : r));
      setSaveBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_reminder_topic_prefs').upsert(
          {
            user_id: userId,
            topic_key: topicKey,
            email_enabled: nextRow.email_enabled,
            push_enabled: nextRow.push_enabled,
          },
          { onConflict: 'user_id,topic_key' }
        );
        if (error) {
          console.error('[FamilyReminders] save failed', error);
          setRows((r) => (r ? { ...r, [topicKey]: prev } : r));
          setSaveError(error.message ?? 'Could not save.');
          return;
        }
        console.info('[FamilyReminders] saved', { topicKey, ...nextRow });
        setSaveOk(true);
        window.setTimeout(() => setSaveOk(false), 2500);
      } finally {
        setSaveBusy(false);
      }
    },
    [userId, rows]
  );

  if (!userId) return null;

  if (loading || !rows) {
    return (
      <div className="mt-5 max-w-3xl scroll-mt-[calc(var(--header-height)+12px)]" id="reminders">
        <div
          className="rounded-2xl border p-4 sm:p-5 bg-white text-sm text-[#374151]"
          style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          Loading reminders…
        </div>
      </div>
    );
  }

  const pushColumnDisabled = true;
  const pushHelper =
    'Push choices stay off until browser push is turned on in a later update. Your saved push preferences are stored for then.';

  return (
    <div className="mt-5 max-w-3xl scroll-mt-[calc(var(--header-height)+12px)]" id="reminders">
      <div
        className="rounded-2xl border p-5 sm:p-6 bg-white"
        style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#FF6347]/10">
            <Bell className="w-5 h-5 text-[#FF6347]" />
          </span>
          <h3 className="text-base font-semibold text-[#1A1E23] m-0">Reminders</h3>
        </div>
        <p className="text-sm text-[#374151] mb-6 leading-snug">
          Choose which useful reminders you want, and how you&apos;d like to receive them.
        </p>

        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
            <strong className="font-semibold">Could not load saved preferences.</strong> {loadError} If this is the
            first time your team added reminder preferences, ask them to run the latest database update for this app.
          </div>
        )}

        {saveError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
            <strong className="font-semibold">Save did not complete.</strong> {saveError}
          </div>
        )}

        {saveOk && !saveError && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">
            Saved.
          </div>
        )}

        {/* A — Push setup (PR2B will wire OneSignal); read-only placeholder */}
        <div
          className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:p-5 mb-6"
          aria-labelledby="push-reminders-heading"
        >
          <h4 id="push-reminders-heading" className="text-sm font-semibold text-[#1A1E23] m-0 mb-2">
            Push reminders on this browser
          </h4>
          <p className="text-sm font-medium text-[#1A1E23] mb-3">
            Status: <span className="font-semibold">Not set up yet</span>
          </p>
          <p className="text-sm text-[#374151] mb-3">
            Turning browser push on or off will be available in the next release. Email preferences below work now.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="min-h-[44px] px-5 rounded-xl text-sm font-semibold bg-[#FF6347]/50 text-white cursor-not-allowed"
            >
              Turn on push
            </button>
            <button
              type="button"
              disabled
              className="min-h-[44px] px-5 rounded-xl text-sm font-semibold border-2 border-[#D1D5DB] bg-white text-[#9CA3AF] cursor-not-allowed"
            >
              Turn off push
            </button>
          </div>
        </div>

        {/* B — Topics */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#1A1E23] m-0">Reminder topics</p>

          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-[1fr_5.5rem_5.5rem] sm:grid-cols-[1fr_6rem_6rem] gap-x-2 items-center bg-[#F3F4F6] px-3 py-2.5 text-sm font-semibold text-[#111827] border-b border-[#E5E7EB]">
              <span>Topic</span>
              <span className="text-center">Email</span>
              <span className="text-center">Push</span>
            </div>

            {([REMINDER_TOPIC_KEYS.MONTHLY_STAGE_UPDATES, REMINDER_TOPIC_KEYS.MOVE_IT_ON_PROMPTS] as const).map((key) => (
              <div
                key={key}
                className="grid grid-cols-[1fr_5.5rem_5.5rem] sm:grid-cols-[1fr_6rem_6rem] gap-x-2 items-center px-3 py-4 border-b border-[#E5E7EB] bg-white last:border-b-0"
              >
                <span className="text-sm font-medium text-[#1A1E23] pr-2">{TOPIC_LABELS[key]}</span>
                <div className="flex justify-center">
                  <SubnavSwitch
                    checked={rows[key].email_enabled}
                    onCheckedChange={(checked) => void persistTopic(key, { email_enabled: checked })}
                    disabled={saveBusy}
                    aria-label={`${TOPIC_LABELS[key]} email`}
                  />
                </div>
                <div className="flex justify-center">
                  <SubnavSwitch
                    checked={rows[key].push_enabled}
                    onCheckedChange={(checked) => void persistTopic(key, { push_enabled: checked })}
                    disabled={saveBusy || pushColumnDisabled}
                    aria-label={`${TOPIC_LABELS[key]} push`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[#374151] leading-relaxed" role="note">
            {pushHelper}
          </p>
        </div>
      </div>
    </div>
  );
}
