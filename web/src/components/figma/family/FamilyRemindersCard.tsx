'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SubnavSwitch } from '@/components/subnav/SubnavSwitch';
import {
  applyOneSignalBrowserPushMaster,
  getOneSignalAppId,
  getOneSignalMasterPushState,
  getOneSignalPushDiagnostics,
  initializeOneSignal,
  isBrowserPushMasterOn,
  type OneSignalMasterPushState,
} from '@/lib/onesignal/client';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

export type NotificationPrefsRow = {
  email_master_enabled: boolean;
  email_topic_monthly_enabled: boolean;
  email_topic_moveit_enabled: boolean;
  push_topic_monthly_enabled: boolean;
  push_topic_moveit_enabled: boolean;
};

const emptyPrefs = (): NotificationPrefsRow => ({
  email_master_enabled: false,
  email_topic_monthly_enabled: false,
  email_topic_moveit_enabled: false,
  push_topic_monthly_enabled: false,
  push_topic_moveit_enabled: false,
});

function lsMoveItKey(userId: string) {
  return `ember.moveItOnPrompts.${userId}`;
}

function pushStatusDetail(state: OneSignalMasterPushState): string {
  switch (state) {
    case 'enabled':
      return 'On';
    case 'disabled':
      return 'Off';
    case 'blocked':
      return 'Blocked in browser settings';
    case 'permission_default':
      return 'Needs permission';
    case 'unsupported':
      return 'Unsupported browser';
    case 'recoverable_error':
      return 'Recoverable error';
    default:
      return 'Off';
  }
}

function pushTopicHelper(
  state: OneSignalMasterPushState,
  browserPushOn: boolean
): string | null {
  if (browserPushOn) return null;
  if (state === 'blocked') return 'Notifications are blocked in this browser\'s settings.';
  if (state === 'unsupported') return 'This browser does not support push notifications.';
  if (state === 'permission_default')
    return 'Allow notifications when prompted, or turn on push reminders above.';
  if (state === 'recoverable_error') return 'Push could not be updated. Try again in a moment.';
  return null;
}

export function FamilyRemindersCard({ serverUserId }: { serverUserId: string }) {
  const { user, refetch } = useSubnavStats();
  const userId = user?.id ?? serverUserId;
  const [prefs, setPrefs] = useState<NotificationPrefsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveBusy, setSaveBusy] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushState, setPushState] = useState<OneSignalMasterPushState>('disabled');
  const [browserPushOn, setBrowserPushOn] = useState(false);

  const oneSignalConfigured = Boolean(getOneSignalAppId());

  const refreshPush = useCallback(async () => {
    if (!oneSignalConfigured) {
      setPushState('unsupported');
      setBrowserPushOn(false);
      return;
    }
    try {
      await initializeOneSignal();
      const d = await getOneSignalPushDiagnostics();
      const master = await getOneSignalMasterPushState();
      setPushState(master);
      setBrowserPushOn(isBrowserPushMasterOn(d));
    } catch {
      setPushState('recoverable_error');
      setBrowserPushOn(false);
    }
  }, [oneSignalConfigured]);

  const loadPrefs = useCallback(async () => {
    if (!userId) {
      setPrefs(null);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_notification_prefs')
      .select(
        'email_master_enabled, email_topic_monthly_enabled, email_topic_moveit_enabled, push_topic_monthly_enabled, push_topic_moveit_enabled'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      setPrefs(emptyPrefs());
      setLoading(false);
      return;
    }

    if (!data) {
      setPrefs(emptyPrefs());
      try {
        const raw = localStorage.getItem(lsMoveItKey(userId));
        if (raw === '1') {
          const next: NotificationPrefsRow = {
            email_master_enabled: true,
            email_topic_monthly_enabled: false,
            email_topic_moveit_enabled: true,
            push_topic_monthly_enabled: false,
            push_topic_moveit_enabled: true,
          };
          const { error: upErr } = await supabase.from('user_notification_prefs').upsert(
            { user_id: userId, ...next },
            { onConflict: 'user_id' }
          );
          if (!upErr) {
            localStorage.removeItem(lsMoveItKey(userId));
            setPrefs(next);
          }
        }
      } catch {
        /* ignore */
      }
    } else {
      setPrefs(data as NotificationPrefsRow);
      const row = data as NotificationPrefsRow;
      try {
        const raw = localStorage.getItem(lsMoveItKey(userId));
        if (raw === '1' && !row.email_topic_moveit_enabled && !row.push_topic_moveit_enabled) {
          const next: NotificationPrefsRow = {
            email_master_enabled: true,
            email_topic_monthly_enabled: row.email_topic_monthly_enabled,
            email_topic_moveit_enabled: true,
            push_topic_monthly_enabled: row.push_topic_monthly_enabled,
            push_topic_moveit_enabled: true,
          };
          const { error: upErr } = await supabase.from('user_notification_prefs').upsert(
            { user_id: userId, ...next },
            { onConflict: 'user_id' }
          );
          if (!upErr) {
            localStorage.removeItem(lsMoveItKey(userId));
            setPrefs(next);
          }
        }
      } catch {
        /* ignore */
      }
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void loadPrefs();
  }, [loadPrefs]);

  useEffect(() => {
    void refreshPush();
  }, [refreshPush]);

  useEffect(() => {
    const sync = () => void refreshPush();
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [refreshPush]);

  const persistPrefs = useCallback(
    async (next: NotificationPrefsRow) => {
      if (!userId) return;
      setSaveBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: userId, ...next },
          { onConflict: 'user_id' }
        );
        if (!error) {
          setPrefs(next);
          await refetch();
        }
      } finally {
        setSaveBusy(false);
      }
    },
    [userId, refetch]
  );

  if (!userId) return null;

  if (loading || !prefs) {
    return (
      <div className="mt-5 max-w-3xl scroll-mt-[calc(var(--header-height)+12px)]" id="reminders">
        <div
          className="rounded-2xl border p-4 sm:p-5 bg-white text-sm text-[#5C646D]"
          style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          Loading reminders…
        </div>
      </div>
    );
  }

  const emailMaster = prefs.email_master_enabled;
  const monthlyEmail = prefs.email_topic_monthly_enabled;
  const moveitEmail = prefs.email_topic_moveit_enabled;
  const monthlyPush = prefs.push_topic_monthly_enabled;
  const moveitPush = prefs.push_topic_moveit_enabled;

  const pushMasterDisabled =
    !oneSignalConfigured ||
    pushState === 'unsupported' ||
    pushState === 'blocked' ||
    pushBusy;

  const pushTopicDisabled =
    saveBusy ||
    pushBusy ||
    !browserPushOn ||
    pushState === 'blocked' ||
    pushState === 'unsupported' ||
    pushState === 'recoverable_error';

  const topicPushHelper = pushTopicHelper(pushState, browserPushOn);

  const handleEmailMaster = async (checked: boolean) => {
    if (!checked) {
      await persistPrefs({
        email_master_enabled: false,
        email_topic_monthly_enabled: false,
        email_topic_moveit_enabled: false,
        push_topic_monthly_enabled: prefs.push_topic_monthly_enabled,
        push_topic_moveit_enabled: prefs.push_topic_moveit_enabled,
      });
      return;
    }
    await persistPrefs({
      ...prefs,
      email_master_enabled: true,
    });
  };

  const handleEmailTopicMonthly = async (checked: boolean) => {
    const nextMonthly = checked;
    const nextMaster = nextMonthly || moveitEmail;
    await persistPrefs({
      ...prefs,
      email_topic_monthly_enabled: nextMonthly,
      email_master_enabled: nextMaster,
    });
  };

  const handleEmailTopicMoveit = async (checked: boolean) => {
    const nextMove = checked;
    const nextMaster = monthlyEmail || nextMove;
    await persistPrefs({
      ...prefs,
      email_topic_moveit_enabled: nextMove,
      email_master_enabled: nextMaster,
    });
  };

  const handlePushMaster = async (checked: boolean) => {
    if (!oneSignalConfigured) return;
    setPushBusy(true);
    try {
      if (!checked) {
        await applyOneSignalBrowserPushMaster(false);
        await persistPrefs({
          ...prefs,
          push_topic_monthly_enabled: false,
          push_topic_moveit_enabled: false,
        });
        await refreshPush();
        return;
      }
      await applyOneSignalBrowserPushMaster(true);
      await refreshPush();
    } finally {
      setPushBusy(false);
    }
  };

  const handlePushTopicMonthly = async (checked: boolean) => {
    if (!browserPushOn || pushTopicDisabled) return;
    await persistPrefs({ ...prefs, push_topic_monthly_enabled: checked });
  };

  const handlePushTopicMoveit = async (checked: boolean) => {
    if (!browserPushOn || pushTopicDisabled) return;
    await persistPrefs({ ...prefs, push_topic_moveit_enabled: checked });
  };

  const displayMonthlyEmail = emailMaster && monthlyEmail;
  const displayMoveitEmail = emailMaster && moveitEmail;
  const displayMonthlyPush = browserPushOn && monthlyPush;
  const displayMoveitPush = browserPushOn && moveitPush;

  return (
    <div className="mt-5 max-w-3xl scroll-mt-[calc(var(--header-height)+12px)]" id="reminders">
      <div
        className="rounded-2xl border p-4 sm:p-5 bg-white"
        style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF6347]/10">
            <Bell className="w-4 h-4 text-[#FF6347]" />
          </span>
          <h3 className="text-sm font-medium text-[#1A1E23] m-0">Reminders</h3>
        </div>
        <p className="text-xs text-[#5C646D] mb-3">
          Choose which useful reminders you want, and how you&apos;d like to receive them.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#1A1E23]">Email reminders</span>
              <SubnavSwitch
                checked={emailMaster}
                onCheckedChange={(v) => void handleEmailMaster(v)}
                disabled={saveBusy}
                aria-label="Email reminders master"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#1A1E23]">Push reminders on this browser</span>
              <SubnavSwitch
                checked={browserPushOn}
                onCheckedChange={(v) => void handlePushMaster(v)}
                disabled={pushMasterDisabled}
                aria-label="Push reminders on this browser master"
              />
            </div>
            {oneSignalConfigured && (
              <p className="text-xs text-[#5C646D] mt-1.5">{pushStatusDetail(pushState)}</p>
            )}
            {!oneSignalConfigured && (
              <p className="text-xs text-[#5C646D] mt-1.5">Push is not available in this environment.</p>
            )}
          </div>

          <div className="border-t border-[#E5E7EB] pt-3 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#1A1E23]">Monthly stage updates</span>
              <div className="flex items-center gap-4 sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C646D] w-9 shrink-0">Email</span>
                  <SubnavSwitch
                    checked={displayMonthlyEmail}
                    onCheckedChange={(v) => void handleEmailTopicMonthly(v)}
                    disabled={saveBusy || !emailMaster}
                    aria-label="Monthly stage updates email"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C646D] w-9 shrink-0">Push</span>
                  <SubnavSwitch
                    checked={displayMonthlyPush}
                    onCheckedChange={(v) => void handlePushTopicMonthly(v)}
                    disabled={pushTopicDisabled}
                    aria-label="Monthly stage updates push"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-[#1A1E23]">Move-it-on prompts</span>
              <div className="flex items-center gap-4 sm:justify-end">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C646D] w-9 shrink-0">Email</span>
                  <SubnavSwitch
                    checked={displayMoveitEmail}
                    onCheckedChange={(v) => void handleEmailTopicMoveit(v)}
                    disabled={saveBusy || !emailMaster}
                    aria-label="Move-it-on prompts email"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5C646D] w-9 shrink-0">Push</span>
                  <SubnavSwitch
                    checked={displayMoveitPush}
                    onCheckedChange={(v) => void handlePushTopicMoveit(v)}
                    disabled={pushTopicDisabled}
                    aria-label="Move-it-on prompts push"
                  />
                </div>
              </div>
            </div>
            {topicPushHelper && <p className="text-xs text-[#5C646D]">{topicPushHelper}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
