'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, HelpCircle, Info, Sparkles } from 'lucide-react';
import { saveChild, deleteChild } from '@/lib/children/actions';
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
const INPUT_CLASS =
  'w-full px-3.5 py-2.5 rounded-xl border border-[var(--ember-border-subtle)] bg-white text-[var(--ember-text-high)] text-base placeholder:text-[var(--ember-text-low)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:border-transparent transition-all input';

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

  const submitLabel = initial?.id ? 'Save changes' : 'Add a child';
  const isEdit = !!initial?.id;

  const runSubmit = () => {
    setError(null);
    if (!dateOfBirth.trim()) {
      setShowValidationError(true);
      return;
    }
    if (!consentGiven) {
      setError('Please tick the box to confirm we can store this profile');
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
        if (data.user?.id && result?.childId) {
          trackEvent(
            result?.action === 'updated' ? EVENTS.CHILD_PROFILE_UPDATED : EVENTS.CHILD_PROFILE_CREATED,
            {
              user_id: data.user.id,
              child_id: result.childId,
              age_band_id: result.age_band_id ?? null,
            }
          );
        }
      } catch {
        // Fail closed
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
      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:py-6 pb-28 lg:pb-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)_minmax(0,1fr)] lg:items-start lg:gap-x-10 xl:gap-x-14">
          {/* Left rail — marketing copy off the form column */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:pt-2">
            <h2 className="text-2xl font-semibold leading-tight text-[var(--ember-text-high)]">
              Start their journey
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ember-text-low)]">
              We&apos;ll curate toys and activities to support their development at every stage — starting with their
              age.
            </p>
          </aside>

          {/* Centre — hero + compact form */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <Link
                href={backHref}
                className="-ml-1 rounded-full p-2 transition-colors hover:bg-[var(--ember-surface-soft)]"
                aria-label="Back"
              >
                <ArrowLeft className="h-5 w-5 text-[var(--ember-text-high)]" strokeWidth={2} />
              </Link>
              <button
                type="button"
                onClick={() => setShowPrivacySheet(true)}
                className="-mr-1 rounded-full p-2 transition-colors hover:bg-[var(--ember-surface-soft)]"
                aria-label="Privacy information"
              >
                <HelpCircle className="h-5 w-5 text-[var(--ember-text-low)]" strokeWidth={2} />
              </button>
            </div>

            <div className="mb-4 overflow-hidden rounded-2xl shadow-md">
              <img src={HERO_IMAGE} alt="" className="h-28 w-full object-cover sm:h-32" />
            </div>

            <p className="mb-4 text-center text-sm text-[var(--ember-text-low)] lg:hidden">
              Toys and activities for their stage — tell us their age to begin.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {error ? (
                <div className="rounded-xl bg-red-100 p-3 text-sm text-red-700" role="alert">
                  {error}
                </div>
              ) : null}

              <div className="rounded-2xl border border-[var(--ember-border-subtle)] bg-white p-4 shadow-sm sm:p-5">
                <p className="mb-3 text-sm font-medium text-[var(--ember-text-high)]">About them</p>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="childName" className="mb-1.5 block text-sm text-[var(--ember-text-high)]">
                      What do you call them?{' '}
                      <span className="text-[var(--ember-text-low)]">(optional)</span>
                    </label>
                    <input
                      id="childName"
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Lily, Button, Little One…"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm text-[var(--ember-text-high)]">
                        Date of birth
                      </label>
                      <div className="relative">
                        <input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className={`${INPUT_CLASS} pr-10`}
                          required
                        />
                        <Calendar
                          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ember-text-low)]"
                          strokeWidth={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPrivacySheet(true)}
                        className="mt-1 flex items-center gap-1 text-xs text-[var(--ember-text-low)] underline hover:text-[var(--ember-accent-base)]"
                      >
                        <Info className="h-3 w-3" strokeWidth={2} />
                        Why we ask
                      </button>
                    </div>

                    <div>
                      <label htmlFor="gender" className="mb-1.5 block text-sm text-[var(--ember-text-high)]">
                        Gender <span className="text-[var(--ember-text-low)]">(optional)</span>
                      </label>
                      <select
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={INPUT_CLASS}
                      >
                        <option value="">—</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[var(--ember-accent-base)]/20 bg-[var(--ember-accent-base)]/5 p-3">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[var(--ember-border-subtle)] text-[var(--ember-accent-base)] focus:ring-[var(--ember-accent-base)]"
                    />
                    <span className="text-sm leading-snug text-[var(--ember-text-high)]">
                      I understand this is stored to personalise recommendations
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ember-accent-base)] py-3 text-base font-semibold text-white transition-all hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                    <span>{submitLabel}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-[var(--ember-text-low)] lg:text-left">
              <p className="mb-2">You can edit or delete this profile anytime.</p>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 lg:justify-start">
                <button
                  type="button"
                  onClick={() => setShowPrivacySheet(true)}
                  className="underline hover:text-[var(--ember-accent-base)]"
                >
                  Privacy
                </button>
                <span aria-hidden>·</span>
                <Link href="/account" className="underline hover:text-[var(--ember-accent-base)]">
                  Account
                </Link>
                {isEdit ? (
                  <>
                    <span aria-hidden>·</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting || isPending}
                      className="text-red-600 underline hover:text-red-700 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting…' : 'Delete profile'}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right rail — balance + edit hint */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:pt-2">
            {isEdit ? (
              <p className="text-sm leading-relaxed text-[var(--ember-text-low)]">
                Changes update what you see on Discover and in your saves.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-[var(--ember-text-low)]">
                No name required — age is enough to get started. You can add more detail later.
              </p>
            )}
          </aside>
        </div>
      </main>

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
