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

type ChildData = {
  id?: string;
  birthdate?: string | null;
  gender?: string | null;
};

const HERO_IMAGE = '/home/hero.png';

export function AddChildForm({ initial, backHref = '/family' }: { initial?: ChildData; backHref?: string }) {
  const [showPrivacySheet, setShowPrivacySheet] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [showOlderChildWarning, setShowOlderChildWarning] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState(initial?.birthdate ?? '');
  const [gender, setGender] = useState(initial?.gender ?? '');
  const [consentGiven, setConsentGiven] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('monthly');
  const [coParentEmail, setCoParentEmail] = useState('');

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
    if (dob > new Date()) {
      setError('Date of birth cannot be in the future');
      return;
    }
    const ageInYears = (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (ageInYears > 5) {
      setShowOlderChildWarning(true);
      return;
    }
    const formData = new FormData();
    formData.set('birthdate', dateOfBirth);
    formData.set('gender', gender);
    startTransition(async () => {
      const result = await saveChild(formData, initial?.id);
      if (result?.error) setError(result.error);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSubmit();
  };

  const handleContinueWithOlderChild = () => {
    setShowOlderChildWarning(false);
    const formData = new FormData();
    formData.set('birthdate', dateOfBirth);
    formData.set('gender', gender);
    startTransition(async () => {
      await saveChild(formData, initial?.id);
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
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={backHref}
            className="p-2 -ml-2 hover:bg-[var(--ember-surface-soft)] rounded-full transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--ember-text-high)]" strokeWidth={2} />
          </Link>
          <h1 className="text-xl font-medium text-[var(--ember-text-high)]">
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

      <main className="max-w-2xl mx-auto px-6 py-8 pb-32">
        <div className="mb-8 rounded-3xl overflow-hidden shadow-lg">
          <img
            src={HERO_IMAGE}
            alt="Happy child playing with toys"
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
            <h2 className="text-3xl font-semibold text-[var(--ember-text-high)]">Start their journey</h2>
            <Sparkles className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
          </div>
          <p className="text-[var(--ember-text-low)] text-lg leading-relaxed max-w-xl mx-auto">
            We&apos;ll curate the perfect toys and activities to support their development at every stage
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-100 p-3 text-red-700 text-sm">{error}</div>
          )}
          <ChildDetailsCard
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            gender={gender}
            setGender={setGender}
            onPrivacyClick={() => setShowPrivacySheet(true)}
          />
          <div>
            <label className="flex items-start gap-3 p-5 bg-[var(--ember-accent-base)]/5 rounded-2xl border border-[var(--ember-accent-base)]/20 cursor-pointer hover:border-[var(--ember-accent-base)]/40 transition-colors">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-[var(--ember-border-subtle)] text-[var(--ember-accent-base)] focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-[var(--ember-text-high)] flex-1">
                I understand this is stored to personalise recommendations
              </span>
            </label>
          </div>
          <PersonalisationCard
            remindersEnabled={remindersEnabled}
            setRemindersEnabled={setRemindersEnabled}
            reminderFrequency={reminderFrequency}
            setReminderFrequency={setReminderFrequency}
          />
          <CoParentCard coParentEmail={coParentEmail} setCoParentEmail={setCoParentEmail} />
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--ember-text-low)] mb-3">
            You can edit or delete this profile anytime
          </p>
          <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
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
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--ember-border-subtle)] px-6 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
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
                <span>Start discovering toys</span>
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
