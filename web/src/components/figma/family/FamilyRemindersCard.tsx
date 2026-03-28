'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import type { PostgrestError } from '@supabase/supabase-js';
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

const LOG_PREFIX = '[FamilyReminders]';

function isMissingNewColumnsError(error: PostgrestError | null): boolean {
  if (!error) return false;
  const msg = (error.message ?? '').toLowerCase();
  const code = String(error.code ?? '');
  return (
    code === '42703' ||
    /column .* does not exist|could not find the .* column/i.test(error.message ?? '') ||
    (msg.includes('schema cache') && msg.includes('column'))
  );
}

function formatSaveError(error: PostgrestError): string {
  const hint =
    error.code === '42501' || error.message?.toLowerCase().includes('permission')
      ? ' Signed-in session may be missing or RLS blocked the write.'
      : '';
  return `${error.message ?? 'Save failed'}${error.code ? ` (code ${error.code})` : ''}.${hint}`;
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Larger, higher-contrast switch for topic rows only. */
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

type SchemaMode = 'full' | 'legacy';

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
  const [schemaMode, setSchemaMode] = useState<SchemaMode | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

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
        console.warn(`${LOG_PREFIX} onesignal_init_deadline`);
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
    setLoadError(null);
    const supabase = createClient();

    const fullSelect =
      'email_master_enabled, email_topic_monthly_enabled, email_topic_moveit_enabled, push_topic_monthly_enabled, push_topic_moveit_enabled';

    const { data: fullData, error: fullError } = await supabase
      .from('user_notification_prefs')
      .select(fullSelect)
      .eq('user_id', userId)
      .maybeSingle();

    if (fullError && isMissingNewColumnsError(fullError)) {
      console.warn(`${LOG_PREFIX} full column select failed (likely migration not applied), falling back to legacy`, fullError);
      const { data: leg, error: legError } = await supabase
        .from('user_notification_prefs')
        .select('development_reminders_enabled')
        .eq('user_id', userId)
        .maybeSingle();

      if (legError) {
        const msg = formatSaveError(legError);
        console.error(`${LOG_PREFIX} legacy load failed`, legError);
        setLoadError(msg);
        setPrefs(emptyPrefs());
        setSchemaMode('legacy');
        setLoading(false);
        return;
      }

      setSchemaMode('legacy');
      const monthly = Boolean(leg?.development_reminders_enabled);
      setPrefs(
        withDerivedEmailMaster({
          ...emptyPrefs(),
          email_topic_monthly_enabled: monthly,
        })
      );
      setLoading(false);
      return;
    }

    if (fullError) {
      console.error(`${LOG_PREFIX} load failed`, fullError);
      setLoadError(formatSaveError(fullError));
      setPrefs(emptyPrefs());
      setSchemaMode(null);
      setLoading(false);
      return;
    }

    setSchemaMode('full');

    if (!fullData) {
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
          if (upErr) {
            console.error(`${LOG_PREFIX} initial upsert from localStorage failed`, upErr);
            setSaveError(formatSaveError(upErr));
          } else {
            localStorage.removeItem(lsMoveItKey(userId));
            setPrefs(next);
          }
        }
      } catch (e) {
        console.error(`${LOG_PREFIX} localStorage migrate error`, e);
      }
    } else {
      setPrefs(fullData as NotificationPrefsRow);
      const row = fullData as NotificationPrefsRow;
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
          if (upErr) console.error(`${LOG_PREFIX} migrate move-it upsert failed`, upErr);
          else {
            localStorage.removeItem(lsMoveItKey(userId));
            setPrefs(next);
          }
        }
      } catch (e) {
        console.error(`${LOG_PREFIX} move-it migrate error`, e);
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
      if (!userId || !prefs) return;
      setSaveError(null);
      setSaveNotice(null);

      if (schemaMode === 'legacy') {
        const prev = prefs;
        setPrefs(withDerivedEmailMaster(next));
        setSaveBusy(true);
        try {
          const supabase = createClient();
          const { error } = await supabase.from('user_notification_prefs').upsert(
            {
              user_id: userId,
              development_reminders_enabled: next.email_topic_monthly_enabled,
            },
            { onConflict: 'user_id' }
          );
          if (error) {
            console.error(`${LOG_PREFIX} legacy upsert failed`, error);
            setPrefs(prev);
            setSaveError(formatSaveError(error));
            return;
          }
          console.info(`${LOG_PREFIX} legacy upsert ok`, {
            development_reminders_enabled: next.email_topic_monthly_enabled,
          });
          setSaveNotice('Saved.');
          window.setTimeout(() => setSaveNotice(null), 3500);
          await Promise.race([refetch(), sleepMs(REFETCH_MAX_MS)]);
        } finally {
          setSaveBusy(false);
        }
        return;
      }

      const merged = withDerivedEmailMaster(next);
      const previous = prefs;
      setPrefs(merged);
      setSaveBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: userId, ...merged },
          { onConflict: 'user_id' }
        );
        if (error) {
          console.error(`${LOG_PREFIX} upsert failed`, error);
          setPrefs(previous);
          setSaveError(formatSaveError(error));
          return;
        }
        console.info(`${LOG_PREFIX} upsert ok`, merged);
        setSaveNotice('Saved.');
        window.setTimeout(() => setSaveNotice(null), 3500);
        await Promise.race([refetch(), sleepMs(REFETCH_MAX_MS)]);
      } finally {
        setSaveBusy(false);
      }
    },
    [userId, refetch, prefs, schemaMode]
  );

  const persistPrefsQuiet = useCallback(
    async (next: NotificationPrefsRow) => {
      if (!userId) return;
      const merged = withDerivedEmailMaster(next);
      const supabase = createClient();
      if (schemaMode === 'legacy') {
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: userId, development_reminders_enabled: merged.email_topic_monthly_enabled },
          { onConflict: 'user_id' }
        );
        if (error) console.error(`${LOG_PREFIX} persistPrefsQuiet legacy failed`, error);
        else setPrefs(merged);
        return;
      }
      const { error } = await supabase.from('user_notification_prefs').upsert(
        { user_id: userId, ...merged },
        { onConflict: 'user_id' }
      );
      if (error) console.error(`${LOG_PREFIX} persistPrefsQuiet failed`, error);
      else {
        setPrefs(merged);
        await Promise.race([refetch(), sleepMs(REFETCH_MAX_MS)]);
      }
    },
    [userId, refetch, schemaMode]
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

  /** Monthly email works in legacy mode (maps to development_reminders_enabled). */
  const emailMonthlyDisabled = saveBusy;
  /** Move-it-on email needs new columns — disabled until migration applied. */
  const emailMoveitDisabled = saveBusy || schemaMode === 'legacy';

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
    if (schemaMode === 'legacy') {
      setSaveError(
        'Move-it-on email needs the latest database migration. In Supabase → SQL: run `202603281200_family_reminder_household_prefs.sql`, then reload.'
      );
      console.warn(`${LOG_PREFIX} move-it email blocked in legacy schema mode`);
      return;
    }
    await persistPrefs({
      ...prefs,
      email_topic_moveit_enabled: checked,
    });
  };

  const handlePushTopicMonthly = async (checked: boolean) => {
    if (pushTopicDisabled) return;
    if (schemaMode === 'legacy') {
      setSaveError('Push topic preferences need the database migration applied (new columns). Email for monthly updates still works.');
      return;
    }
    await persistPrefs({ ...prefs, push_topic_monthly_enabled: checked });
  };

  const handlePushTopicMoveit = async (checked: boolean) => {
    if (pushTopicDisabled) return;
    if (schemaMode === 'legacy') {
      setSaveError('Push topic preferences need the database migration applied.');
      return;
    }
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
        <p className="text-sm text-[#374151] mb-4 leading-snug">
          Choose which useful reminders you want, and how you&apos;d like to receive them.
        </p>

        {loadError && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
            role="alert"
          >
            <strong className="font-semibold">Could not load reminder settings.</strong> {loadError}
          </div>
        )}

        {schemaMode === 'legacy' && !loadError && (
          <div
            className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
            role="status"
          >
            <strong className="font-semibold">Database: older schema.</strong> Monthly email uses the original
            &quot;development reminders&quot; flag. Apply migration{' '}
            <code className="text-xs bg-amber-100 px-1 rounded">202603281200_family_reminder_household_prefs.sql</code>{' '}
            in Supabase (SQL Editor) for full reminder topics and push prefs.{' '}
            <strong>Monthly stage updates → Email</strong> works below; Move-it-on email needs the migration.
          </div>
        )}

        {saveError && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
            role="alert"
          >
            <strong className="font-semibold">Save did not complete.</strong> {saveError}
          </div>
        )}

        {saveNotice && !saveError && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900" role="status">
            {saveNotice}
          </div>
        )}

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
                  disabled={emailMonthlyDisabled}
                  aria-label="Monthly stage updates by email"
                />
              </div>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={displayMonthlyPush}
                  onCheckedChange={(v) => void handlePushTopicMonthly(v)}
                  disabled={pushTopicDisabled || schemaMode === 'legacy'}
                  variant={pushTopicDisabled || schemaMode === 'legacy' ? 'pushInactive' : 'default'}
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
                  disabled={emailMoveitDisabled}
                  aria-label="Move-it-on prompts by email"
                />
              </div>
              <div className="flex justify-center">
                <RemindersTopicSwitch
                  checked={displayMoveitPush}
                  onCheckedChange={(v) => void handlePushTopicMoveit(v)}
                  disabled={pushTopicDisabled || schemaMode === 'legacy'}
                  variant={pushTopicDisabled || schemaMode === 'legacy' ? 'pushInactive' : 'default'}
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
