'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Sparkles } from 'lucide-react';
import { saveChild, deleteChild } from '@/lib/children/actions';
import { ChildDetailsCard } from './ChildDetailsCard';
import { PersonalisationCard } from './PersonalisationCard';
import { CoParentCard } from './CoParentCard';
import { PrivacySheet } from './PrivacySheet';
import { ValidationErrorSheet } from './ValidationErrorSheet';
import { OlderChildSheet } from './OlderChildSheet';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';

type ChildData = {
  id?: string;
  child_name?: string | null;
  birthdate?: string | null;
  gender?: string | null;
};

const HERO_IMAGE = '/home/hero.webp';

function SubmitButton({
  isPending,
  label,
  className = '',
}: {
  isPending: boolean;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`w-full py-3.5 md:py-3 bg-[var(--ember-accent-base)] text-white rounded-xl font-semibold text-base hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {isPending ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Saving…</span>
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" strokeWidth={2} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

export function AddChildForm({ initial, backHref = '/family' }: { initial?: ChildData; backHref?: string }) {
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showOlderChildWarning, setShowOlderChildWarning] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const [childName, setChildName] = useState(initial?.child_name ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(initial?.birthdate ?? '');
  const [gender, setGender] = useState(initial?.gender ?? '');
  const [consentGiven, setConsentGiven] = useState(!!initial?.id);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('monthly');
  const [coParentEmail, setCoParentEmail] = useState('');

  const submitLabel = initial?.id ? 'Save changes' : 'Add a child';

  const runSubmit = () => {
    setError(null);
    if (!dateOfBirth.trim()) {
      setShowValidationError(true);
      return;
    }
    if (!consentGiven) {
      setError('Please confirm consent to store the profile');
      return;
    }
    const dob = new Date(dateOfBirth);
    const ageInYears = dob > new Date() ? 0 : (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (ageInYears > 5) {
      setShowOlderChildWarning(true);
      return;
    }
    const formData = new FormData();
    formData.set('child_name', childName.trim() || '');
    formData.set('birthdate', dateOfBirth);
    formData.set('gender', gender);
    startTransition(async () => {
      const result = await saveChild(formData, initial?.id);
      if (result?.error) {
        setError(result.error);
        return;
      }

      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user?.id) {
          const eventName =
            result?.action === 'updated' ? EVENTS.CHILD_PROFILE_UPDATED : EVENTS.CHILD_PROFILE_CREATED;
          if (result?.childId) {
            trackEvent(eventName, {
              user_id: data.user.id,
              child_id: result.childId,
              age_band_id: result.age_band_id ?? null,
            });
          }
        }
      } catch {
        // Fail closed: don't block UX.
      }

      router.push('/discover');
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSubmit();
  };

  const handleContinueWithOlderChild = () => {
    setShowOlderChildWarning(false);
    const formData = new FormData();
    formData.set('child_name', childName.trim() || '');
    formData.set('birthdate', dateOfBirth);
    formData.set('gender', gender);
    startTransition(async () => {
      const result = await saveChild(formData, initial?.id);
      if (result?.error) {
        setError(result.error);
        return;
      }

      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user?.id) {
          const eventName =
            result?.action === 'updated' ? EVENTS.CHILD_PROFILE_UPDATED : EVENTS.CHILD_PROFILE_CREATED;
          if (result?.childId) {
            trackEvent(eventName, {
              user_id: data.user.id,
              child_id: result.childId,
              age_band_id: result.age_band_id ?? null,
            });
          }
        }
      } catch {
        // Fail closed
      }

      router.push('/discover');
    });
  };

  const handleDelete = () => {
    if (!initial?.id) return;
    if (!confirm('Are you sure you want to delete this profile? This cannot be undone.')) return;
    setDeleting(true);
    setError(null);
    startTransition(async () => {
      const result = await deleteChild(initial.id!);
      if (result?.error) {
        setError(result.error);
        setDeleting(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--ember-accent-base)]/5 to-white">
      <header className="bg-white/90 backdrop-blur-sm border-b border-[var(--ember-border-subtle)] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link
            href={backHref}
            className="p-2 -ml-2 hover:bg-[var(--ember-surface-soft)] rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--ember-text-high)]" strokeWidth={2} />
          </Link>
          <h1 className="text-lg md:text-xl font-medium text-[var(--ember-text-high)]">
            {initial?.id ? 'Edit child' : 'Add a child'}
          </h1>
          <button
            type="button"
            onClick={() => setShowPrivacySheet(true)}
            className="p-2 -mr-2 hover:bg-[var(--ember-surface-soft)] rounded-full transition-colors"
            aria-label="Privacy information"
          >
            <HelpCircle className="w-5 h-5 text-[var(--ember-text-low)]" strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 md:py-6 pb-36 md:pb-8">
        {/* Mobile: hero + intro stacked */}
        <div className="md:hidden mb-6">
          <div className="mb-5 rounded-2xl overflow-hidden shadow-md">
            <img src={HERO_IMAGE} alt="" className="w-full h-36 object-cover" />
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
              <h2 className="text-2xl font-semibold text-[var(--ember-text-high)]">Start their journey</h2>
              <Sparkles className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
            </div>
            <p className="text-[var(--ember-text-low)] text-base leading-relaxed">
              We&apos;ll curate toys and activities for their stage
            </p>
          </div>
        </div>

        <div className="md:grid md:grid-cols-[minmax(220px,280px)_1fr] md:gap-8 lg:gap-10 md:items-start">
          {/* Desktop: compact intro rail */}
          <aside className="hidden md:block md:sticky md:top-[4.5rem]">
            <div className="rounded-2xl overflow-hidden shadow-md mb-4">
              <img src={HERO_IMAGE} alt="" className="w-full h-36 object-cover" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--ember-text-high)] mb-2">Start their journey</h2>
            <p className="text-sm text-[var(--ember-text-low)] leading-relaxed">
              We&apos;ll curate toys and activities to support their development at every stage.
            </p>
          </aside>

          <div className="min-w-0">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-3">
              {error && (
                <div className="rounded-xl bg-red-100 p-3 text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}

              <ChildDetailsCard
                compact
                childName={childName}
                setChildName={setChildName}
                dateOfBirth={dateOfBirth}
                setDateOfBirth={setDateOfBirth}
                gender={gender}
                setGender={setGender}
                onPrivacyClick={() => setShowPrivacySheet(true)}
              />

              <label className="flex items-start gap-3 p-4 md:p-3.5 bg-[var(--ember-accent-base)]/5 rounded-2xl border border-[var(--ember-accent-base)]/20 cursor-pointer hover:border-[var(--ember-accent-base)]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 w-5 h-5 shrink-0 rounded border-[var(--ember-border-subtle)] text-[var(--ember-accent-base)] focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm text-[var(--ember-text-high)] flex-1">
                  I understand this is stored to personalise recommendations
                </span>
              </label>

              <div className="md:grid md:grid-cols-2 md:gap-3">
                <PersonalisationCard compact remindersEnabled={remindersEnabled} setRemindersEnabled={setRemindersEnabled} reminderFrequency={reminderFrequency} setReminderFrequency={setReminderFrequency} />
                <CoParentCard compact coParentEmail={coParentEmail} setCoParentEmail={setCoParentEmail} />
              </div>

              <SubmitButton isPending={isPending} label={submitLabel} className="hidden md:flex mt-1" />
            </form>

            <div className="mt-6 md:mt-4 text-center md:text-left">
              <p className="text-sm text-[var(--ember-text-low)] mb-2 md:mb-1.5">
                You can edit or delete this profile anytime
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowPrivacySheet(true)}
                  className="text-[var(--ember-text-low)] hover:text-[var(--ember-accent-base)] transition-colors underline"
                >
                  Privacy
                </button>
                <span className="text-[var(--ember-border-subtle)]">·</span>
                <Link href="/account" className="text-[var(--ember-text-low)] hover:text-[var(--ember-accent-base)] transition-colors underline">
                  Account
                </Link>
                {initial?.id && (
                  <>
                    <span className="text-[var(--ember-border-subtle)]">·</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting || isPending}
                      className="text-red-600 hover:text-red-700 transition-colors underline disabled:opacity-50"
                    >
                      {deleting ? 'Deleting…' : 'Delete profile'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile: fixed CTA — desktop submit lives inside the form above */}
      <div
        className="md:hidden fixed bottom-20 left-0 right-0 z-40 bg-white border-t border-[var(--ember-border-subtle)] shadow-lg px-4 sm:px-6 py-4"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-5xl mx-auto w-full space-y-3">
          {error && (
            <p className="text-red-600 text-sm text-center" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={runSubmit}
            disabled={isPending}
            className="w-full py-4 bg-[var(--ember-accent-base)] text-white rounded-xl font-semibold text-base hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                <span>{submitLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <PrivacySheet open={showPrivacySheet} onOpenChange={setShowPrivacySheet} />
      <ValidationErrorSheet open={showValidationError} onOpenChange={setShowValidationError} />
      <OlderChildSheet
        open={showOlderChildWarning}
        onOpenChange={setShowOlderChildWarning}
        onContinue={handleContinueWithOlderChild}
      />
    </div>
  );
}
