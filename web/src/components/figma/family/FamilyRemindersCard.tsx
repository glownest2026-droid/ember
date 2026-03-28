'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
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

const REFETCH_MAX_MS = 12_000;

function sleepMs(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Larger, higher-contrast switch for topic rows only. Email column ignores push state; push-only uses muted style when disabled. */
function RemindersTopicSwitch({
  checked,
  onCheckedChange,
  disabled,
  variant = 'default',
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  variant?: 'default' | 'pushInactive';
  'aria-label'?: string;
}) {
  const offBg = variant === 'pushInactive' ? '#E5E7EB' : '#E7E8EA';
  const offBorder = variant === 'pushInactive' ? '#D1D5DB' : '#CBD5E1';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle reminder topic'}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className="inline-flex h-8 w-[3.25rem] shrink-0 items-center rounded-full border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2 pointer-events-auto"
      style={{
        borderColor: offBorder,
        backgroundColor: checked ? '#B8432B' : offBg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: checked ? 'inset 0 0 0 1px rgba(0,0,0,0.06)' : undefined,
        opacity: disabled ? 0.45 : 1,
        filter: disabled ? 'grayscale(0.25)' : undefined,
      }}
    >
      <span
        className="block size-[1.375rem] rounded-full bg-white shadow-sm transition-transform pointer-events-none"
        style={{
          transform: checked ? 'translateX(calc(100% - 3px))' : 'translateX(3px)',
        }}
      />
    </button>
  );
}

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

function pushMatrixHelper(
  state: OneSignalMasterPushState,
  browserPushOn: boolean,
  oneSignalConfigured: boolean
): string | null {
  if (browserPushOn || !oneSignalConfigured) return null;
  if (state === 'blocked') return 'Push notifications are blocked in this browser. Change the site setting to allow reminders.';
  if (state === 'unsupported') return 'This browser cannot receive push notifications.';
  if (state === 'permission_default')
    return 'Use Turn on push above, then allow notifications if the browser asks.';
  if (state === 'recoverable_error') return 'Push could not be updated. Try Turn on push again.';
  return null;
}

function withDerivedEmailMaster(p: NotificationPrefsRow): NotificationPrefsRow {
  return {
    ...p,
    email_master_enabled: p.email_topic_monthly_enabled || p.email_topic_moveit_enabled,
  };
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
  const [previewDomainHint, setPreviewDomainHint] = useState(false);

  const oneSignalConfigured = Boolean(getOneSignalAppId());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
    setPreviewDomainHint(env === 'preview' || /\.vercel\.app$/i.test(window.location.hostname));
  }, []);

  const refreshPush = useCallback(async () => {
    if (!oneSignalConfigured) {
      setPushState('unsupported');
      setBrowserPushOn(false);
      return;
    }
    try {
      const initOk = await Promise.race([
        initializeOneSignal().then(() => true as const),
        sleepMs(REFETCH_MAX_MS).then(() => false as const),
      ]);
      if (!initOk) {
        console.log('ember:family_reminders:onesignal_init_deadline');
        setPushState('recoverable_error');
        setBrowserPushOn(false);
        return;
      }
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
          const next = withDerivedEmailMaster({
            email_master_enabled: false,
            email_topic_monthly_enabled: false,
            email_topic_moveit_enabled: true,
            push_topic_monthly_enabled: false,
            push_topic_moveit_enabled: true,
          });
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
          const next = withDerivedEmailMaster({
            ...row,
            email_topic_moveit_enabled: true,
            push_topic_moveit_enabled: true,
          });
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
      const merged = withDerivedEmailMaster(next);
      setSaveBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: userId, ...merged },
          { onConflict: 'user_id' }
        );
        if (!error) {
          setPrefs(merged);
          await Promise.race([refetch(), sleepMs(REFETCH_MAX_MS)]);
        }
      } finally {
        setSaveBusy(false);
      }
    },
    [userId, refetch]
  );

  /** Updates prefs without saveBusy (push turn-off must not block email toggles). */
  const persistPrefsQuiet = useCallback(
    async (next: NotificationPrefsRow) => {
      if (!userId) return;
      const merged = withDerivedEmailMaster(next);
      const supabase = createClient();
      const { error } = await supabase.from('user_notification_prefs').upsert(
        { user_id: userId, ...merged },
        { onConflict: 'user_id' }
      );
      if (!error) {
        setPrefs(merged);
        await Promise.race([refetch(), sleepMs(REFETCH_MAX_MS)]);
      }
    },
    [userId, refetch]
  );

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

  const monthlyEmail = prefs.email_topic_monthly_enabled;
  const moveitEmail = prefs.email_topic_moveit_enabled;
  const monthlyPush = prefs.push_topic_monthly_enabled;
  const moveitPush = prefs.push_topic_moveit_enabled;

  /** Push column only: never tie to saveBusy (email saves must not lock the matrix). */
  const pushTopicDisabled =
    pushBusy ||
    !browserPushOn ||
    pushState === 'blocked' ||
    pushState === 'unsupported' ||
    pushState === 'recoverable_error';

  const matrixNote = pushMatrixHelper(pushState, browserPushOn, oneSignalConfigured);

  const canTurnOnPush =
    oneSignalConfigured &&
    !browserPushOn &&
    pushState !== 'blocked' &&
    pushState !== 'unsupported';

  const canTurnOffPush = oneSignalConfigured && browserPushOn;

  const handleTurnOnPush = async () => {
    if (!canTurnOnPush || pushBusy) return;
    setPushBusy(true);
    try {
      await applyOneSignalBrowserPushMaster(true);
    } finally {
      setPushBusy(false);
      await refreshPush();
    }
  };

  const handleTurnOffPush = async () => {
    if (!canTurnOffPush || pushBusy) return;
    setPushBusy(true);
    try {
      await applyOneSignalBrowserPushMaster(false);
      await persistPrefsQuiet({
        ...prefs,
        push_topic_monthly_enabled: false,
        push_topic_moveit_enabled: false,
      });
    } finally {
      setPushBusy(false);
      await refreshPush();
    }
  };

  const handleEmailTopicMonthly = async (checked: boolean) => {
    await persistPrefs({
      ...prefs,
      email_topic_monthly_enabled: checked,
    });
  };

  const handleEmailTopicMoveit = async (checked: boolean) => {
    await persistPrefs({
      ...prefs,
      email_topic_moveit_enabled: checked,
    });
  };

  const handlePushTopicMonthly = async (checked: boolean) => {
    if (pushTopicDisabled) return;
    await persistPrefs({ ...prefs, push_topic_monthly_enabled: checked });
  };

  const handlePushTopicMoveit = async (checked: boolean) => {
    if (pushTopicDisabled) return;
    await persistPrefs({ ...prefs, push_topic_moveit_enabled: checked });
  };

  const displayMonthlyPush = browserPushOn && monthlyPush;
  const displayMoveitPush = browserPushOn && moveitPush;

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

        {/* Section A: Push setup */}
        <div
          className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 sm:p-5 mb-6"
          aria-labelledby="push-reminders-heading"
        >
          <h4 id="push-reminders-heading" className="text-sm font-semibold text-[#1A1E23] m-0 mb-3">
            Push reminders on this browser
          </h4>
          <p className="text-sm font-medium text-[#1A1E23] mb-3" aria-live="polite">
            Status:{' '}
            <span className="font-semibold text-[#0f1419]">{pushStatusDetail(pushState)}</span>
            {!oneSignalConfigured && (
              <span className="font-normal text-[#374151]"> — Push is not configured in this environment.</span>
            )}
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {canTurnOnPush && (
              <button
                type="button"
                onClick={() => void handleTurnOnPush()}
                disabled={pushBusy}
                className="min-h-[44px] px-5 rounded-xl text-sm font-semibold bg-[#FF6347] text-white hover:bg-[#e55a3f] disabled:opacity-60 transition-colors shadow-sm"
              >
                {pushBusy ? 'Working…' : 'Turn on push'}
              </button>
            )}
            {canTurnOffPush && (
              <button
                type="button"
                onClick={() => void handleTurnOffPush()}
                disabled={pushBusy}
                className="min-h-[44px] px-5 rounded-xl text-sm font-semibold border-2 border-[#D1D5DB] bg-white text-[#1A1E23] hover:bg-[#F3F4F6] disabled:opacity-60 transition-colors"
              >
                {pushBusy ? 'Working…' : 'Turn off push'}
              </button>
            )}
            {!oneSignalConfigured && (
              <span className="text-sm text-[#374151]">Push setup is unavailable here.</span>
            )}
            {oneSignalConfigured && pushState === 'blocked' && (
              <span className="text-sm text-[#374151] max-w-md">
                Unblock notifications for this site in your browser settings to use push.
              </span>
            )}
            {oneSignalConfigured && pushState === 'unsupported' && (
              <span className="text-sm text-[#374151]">Try a supported desktop browser for push.</span>
            )}
          </div>
          {previewDomainHint && oneSignalConfigured && (
            <p className="text-xs text-[#374151] mt-3 leading-relaxed border-t border-[#E5E7EB] pt-3">
              <strong className="font-semibold text-[#1A1E23]">Preview limitation:</strong> many preview hostnames are
              not allowlisted in OneSignal, so push may not finish even though the UI is working.{' '}
              <strong className="font-semibold text-[#1A1E23]">Not a loading bug:</strong> the Turn on/off button always
              exits Working… within a few seconds; status then reflects the real SDK result (including Recoverable
              error). Use production or an allowed domain to confirm delivery.
            </p>
          )}
        </div>

        {/* Section B: Topics */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#1A1E23] m-0">Reminder topics</p>

          <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-[1fr_5.5rem_5.5rem] sm:grid-cols-[1fr_6rem_6rem] gap-x-2 gap-y-0 items-center bg-[#F3F4F6] px-3 py-2.5 text-sm font-semibold text-[#111827] border-b border-[#E5E7EB]">
              <span>Topic</span>
              <span className="text-center">Email</span>
              <span className="text-center">Push</span>
            </div>

            <div className="grid grid-cols-[1fr_5.5rem_5.5rem] sm:grid-cols-[1fr_6rem_6rem] gap-x-2 items-center px-3 py-4 border-b border-[#E5E7EB] bg-white">
              <span className="text-sm font-medium text-[#1A1E23] pr-2">Monthly stage updates</span>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={monthlyEmail}
                  onCheckedChange={(v) => void handleEmailTopicMonthly(v)}
                  disabled={saveBusy}
                  aria-label="Monthly stage updates by email"
                />
              </div>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={displayMonthlyPush}
                  onCheckedChange={(v) => void handlePushTopicMonthly(v)}
                  disabled={pushTopicDisabled}
                  variant={pushTopicDisabled ? 'pushInactive' : 'default'}
                  aria-label="Monthly stage updates by push"
                />
              </div>
            </div>

            <div className="grid grid-cols-[1fr_5.5rem_5.5rem] sm:grid-cols-[1fr_6rem_6rem] gap-x-2 items-center px-3 py-4 bg-white">
              <span className="text-sm font-medium text-[#1A1E23] pr-2">Move-it-on prompts</span>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={moveitEmail}
                  onCheckedChange={(v) => void handleEmailTopicMoveit(v)}
                  disabled={saveBusy}
                  aria-label="Move-it-on prompts by email"
                />
              </div>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={displayMoveitPush}
                  onCheckedChange={(v) => void handlePushTopicMoveit(v)}
                  disabled={pushTopicDisabled}
                  variant={pushTopicDisabled ? 'pushInactive' : 'default'}
                  aria-label="Move-it-on prompts by push"
                />
              </div>
            </div>
          </div>

          {matrixNote && (
            <p className="text-sm text-[#374151] leading-relaxed" role="note">
              {matrixNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
