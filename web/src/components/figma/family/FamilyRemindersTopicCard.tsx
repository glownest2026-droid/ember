'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SubnavSwitch } from '@/components/subnav/SubnavSwitch';
import {
  disableOneSignalPushSubscription,
  ensureOneSignalPushSubscription,
  getOneSignalAppId,
  getOneSignalMasterPushState,
  type OneSignalMasterPushState,
} from '@/lib/onesignal/client';

type ReminderPrefs = {
  reminders_enabled: boolean;
  channel_email_enabled: boolean;
  channel_push_enabled: boolean;
  topic_monthly_stage_updates_enabled: boolean;
  topic_move_it_on_prompts_enabled: boolean;
};

const DEFAULT_PREFS: ReminderPrefs = {
  reminders_enabled: false,
  channel_email_enabled: false,
  channel_push_enabled: false,
  topic_monthly_stage_updates_enabled: false,
  topic_move_it_on_prompts_enabled: false,
};

const PUSH_BLOCKED_HELPER = 'Push is blocked in your browser settings.';

/**
 * /family#reminders — simple reminders preferences, mobile-first stacked layout.
 */
export function FamilyRemindersTopicCard({ serverUserId }: { serverUserId: string }) {
  const [prefs, setPrefs] = useState<ReminderPrefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [pushMasterState, setPushMasterState] = useState<OneSignalMasterPushState | null>(null);
  const [pushActionBusy, setPushActionBusy] = useState(false);

  const userId = serverUserId;
  const oneSignalConfigured = Boolean(getOneSignalAppId());
  const refreshPushState = useCallback(async (): Promise<OneSignalMasterPushState | null> => {
    if (!oneSignalConfigured) {
      setPushMasterState(null);
      return null;
    }
    try {
      const s = await getOneSignalMasterPushState();
      setPushMasterState(s);
      return s;
    } catch {
      setPushMasterState('recoverable_error');
      return 'recoverable_error';
    }
  }, [oneSignalConfigured]);

  useEffect(() => {
    void refreshPushState();
  }, [refreshPushState]);

  const load = useCallback(async () => {
    if (!userId) {
      setPrefs(null);
      setLoading(false);
      return;
    }
    setLoadError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_notification_prefs')
      .select(
        'development_reminders_enabled, reminders_enabled, channel_email_enabled, channel_push_enabled, topic_monthly_stage_updates_enabled, topic_move_it_on_prompts_enabled'
      )
      .eq('user_id', userId)
      .maybeSingle();

    const isNoRow = error?.code === 'PGRST116';
    if (error && !isNoRow) {
      console.error('[FamilyReminders] load failed', error);
      setLoadError('Could not load reminder settings.');
      setPrefs({ ...DEFAULT_PREFS });
      setLoading(false);
      return;
    }

    const next: ReminderPrefs = {
      reminders_enabled: Boolean(data?.reminders_enabled ?? data?.development_reminders_enabled ?? false),
      channel_email_enabled: Boolean(data?.channel_email_enabled ?? false),
      channel_push_enabled: Boolean(data?.channel_push_enabled ?? false),
      topic_monthly_stage_updates_enabled: Boolean(data?.topic_monthly_stage_updates_enabled ?? false),
      topic_move_it_on_prompts_enabled: Boolean(data?.topic_move_it_on_prompts_enabled ?? false),
    };

    const shouldBackfillFromLegacyTopics =
      !data ||
      (!next.channel_email_enabled &&
        !next.channel_push_enabled &&
        !next.topic_monthly_stage_updates_enabled &&
        !next.topic_move_it_on_prompts_enabled);

    if (shouldBackfillFromLegacyTopics) {
      const { data: topicRows } = await supabase
        .from('user_reminder_topic_prefs')
        .select('topic_key, email_enabled, push_enabled')
        .eq('user_id', userId)
        .in('topic_key', ['monthly_stage_updates', 'move_it_on_prompts']);

      const monthly = topicRows?.find((r) => r.topic_key === 'monthly_stage_updates');
      const moveItOn = topicRows?.find((r) => r.topic_key === 'move_it_on_prompts');

      next.channel_email_enabled = next.channel_email_enabled || Boolean(topicRows?.some((r) => r.email_enabled));
      next.channel_push_enabled = next.channel_push_enabled || Boolean(topicRows?.some((r) => r.push_enabled));
      next.topic_monthly_stage_updates_enabled =
        next.topic_monthly_stage_updates_enabled || Boolean(monthly?.email_enabled || monthly?.push_enabled);
      next.topic_move_it_on_prompts_enabled =
        next.topic_move_it_on_prompts_enabled || Boolean(moveItOn?.email_enabled || moveItOn?.push_enabled);

      if (
        !next.reminders_enabled &&
        (next.channel_email_enabled ||
          next.channel_push_enabled ||
          next.topic_monthly_stage_updates_enabled ||
          next.topic_move_it_on_prompts_enabled)
      ) {
        next.reminders_enabled = true;
      }
    }

    setPrefs(next);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void load();
  }, [load]);

  const persistPrefs = useCallback(
    async (patch: Partial<ReminderPrefs>) => {
      if (!userId || !prefs) return;
      setSaveError(null);
      setSaveOk(false);
      const prev = prefs;
      const next: ReminderPrefs = {
        ...prev,
        ...patch,
      };
      setPrefs(next);
      setSaveBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          {
            user_id: userId,
            development_reminders_enabled: next.reminders_enabled,
            reminders_enabled: next.reminders_enabled,
            channel_email_enabled: next.channel_email_enabled,
            channel_push_enabled: next.channel_push_enabled,
            topic_monthly_stage_updates_enabled: next.topic_monthly_stage_updates_enabled,
            topic_move_it_on_prompts_enabled: next.topic_move_it_on_prompts_enabled,
          },
          { onConflict: 'user_id' }
        );
        if (error) {
          console.error('[FamilyReminders] save failed', error);
          setPrefs(prev);
          setSaveError(error.message ?? 'Could not save.');
          return;
        }
        console.info('[FamilyReminders] saved', next);
        setSaveOk(true);
        window.setTimeout(() => setSaveOk(false), 2800);
      } finally {
        setSaveBusy(false);
      }
    },
    [userId, prefs]
  );

  const handlePushToggle = useCallback(async (checked: boolean) => {
    if (!oneSignalConfigured) return;
    if (!prefs) return;
    setPushActionBusy(true);
    let latestPushState: OneSignalMasterPushState | null = pushMasterState;
    try {
      if (checked) {
        try {
          await Promise.race([
            ensureOneSignalPushSubscription(),
            new Promise<null>((_, reject) => {
              window.setTimeout(() => reject(new Error('push_enable_timeout')), 14_000);
            }),
          ]);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`[FamilyReminders] push turn on finished: ${msg.slice(0, 80)}`);
        }
      } else {
        try {
          await disableOneSignalPushSubscription();
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          console.log(`[FamilyReminders] push turn off error: ${msg.slice(0, 80)}`);
        }
      }
      latestPushState = await refreshPushState();
      if (checked && latestPushState === 'enabled') {
        await persistPrefs({ channel_push_enabled: true });
      } else {
        await persistPrefs({ channel_push_enabled: false });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`[FamilyReminders] push toggle finished: ${msg.slice(0, 80)}`);
    } finally {
      setPushActionBusy(false);
    }
  }, [oneSignalConfigured, prefs, persistPrefs, pushMasterState, refreshPushState]);

  if (!userId) return null;

  if (loading || !prefs) {
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

  const lowerSectionsDisabled = !prefs.reminders_enabled;
  const topicsDisabled = lowerSectionsDisabled || saveBusy;
  const channelsDisabled = lowerSectionsDisabled || saveBusy || pushActionBusy;
  const pushToggleChecked = prefs.channel_push_enabled && pushMasterState === 'enabled';
  const pushToggleDisabled =
    channelsDisabled || !oneSignalConfigured || pushMasterState === 'unsupported';
  const channelsOffForDelivery = !prefs.channel_email_enabled && !pushToggleChecked;
  const showBlockedPushHelper = oneSignalConfigured && pushMasterState === 'blocked';

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
        <p className="text-sm text-[#374151] mb-5 leading-snug">
          Choose whether Ember sends reminders, where they arrive, and which reminders matter to you.
        </p>

        {loadError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
            <strong className="font-semibold">Could not load reminder settings.</strong> {loadError}
          </div>
        )}

        {saveError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-900" role="alert">
            <strong className="font-semibold">Save did not complete.</strong> {saveError}
          </div>
        )}

        {saveOk && !saveError && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-900" role="status">
            Saved your reminder settings.
          </div>
        )}

        <div
          className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:p-5 mb-6"
          aria-labelledby="master-reminders-heading"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 id="master-reminders-heading" className="text-sm font-semibold text-[#111827] m-0">
                Allow reminders from Ember
              </h4>
              <p className="text-sm text-[#374151] mt-1 mb-0">Turn this on to manage reminder channels and topics.</p>
            </div>
            <SubnavSwitch
              size="comfortable"
              checked={prefs.reminders_enabled}
              onCheckedChange={(checked) => void persistPrefs({ reminders_enabled: checked })}
              disabled={saveBusy || pushActionBusy}
              aria-label="Allow reminders from Ember"
            />
          </div>
        </div>

        <section className="mb-6" aria-labelledby="channel-settings-heading">
          <h4 id="channel-settings-heading" className="text-sm font-semibold text-[#111827] m-0 mb-3">
            Where you receive these reminders
          </h4>
          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#111827]">Push</span>
              <SubnavSwitch
                size="comfortable"
                checked={pushToggleChecked}
                onCheckedChange={(checked) => void handlePushToggle(checked)}
                disabled={pushToggleDisabled}
                aria-label="Push reminders"
              />
            </div>
            {showBlockedPushHelper && (
              <p className="px-4 py-2 text-sm text-[#374151] border-b border-[#E5E7EB]">{PUSH_BLOCKED_HELPER}</p>
            )}
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-medium text-[#111827]">Email</span>
              <SubnavSwitch
                size="comfortable"
                checked={prefs.channel_email_enabled}
                onCheckedChange={(checked) => void persistPrefs({ channel_email_enabled: checked })}
                disabled={channelsDisabled}
                aria-label="Email reminders"
              />
            </div>
          </div>
          {channelsOffForDelivery && (
            <p className="mt-2 text-sm text-[#374151]">Turn on Push or Email to receive reminders.</p>
          )}
        </section>

        <section aria-labelledby="topic-settings-heading">
          <h4 id="topic-settings-heading" className="text-sm font-semibold text-[#111827] m-0 mb-3">
            What reminders you want
          </h4>
          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#111827]">Monthly stage updates</span>
              <SubnavSwitch
                size="comfortable"
                checked={prefs.topic_monthly_stage_updates_enabled}
                onCheckedChange={(checked) => void persistPrefs({ topic_monthly_stage_updates_enabled: checked })}
                disabled={topicsDisabled}
                aria-label="Monthly stage updates reminders"
              />
            </div>
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-sm font-medium text-[#111827]">Move-it-on prompts</span>
              <SubnavSwitch
                size="comfortable"
                checked={prefs.topic_move_it_on_prompts_enabled}
                onCheckedChange={(checked) => void persistPrefs({ topic_move_it_on_prompts_enabled: checked })}
                disabled={topicsDisabled}
                aria-label="Move-it-on prompts reminders"
              />
            </div>
          </div>
          {!prefs.reminders_enabled && (
            <p className="mt-2 text-sm text-[#374151]">Turn on reminders above to edit these choices.</p>
          )}
          {channelsOffForDelivery && (
            <p className="mt-2 text-sm text-[#374151]">
              Topic choices stay saved, but no reminders are sent until at least one channel is on.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
