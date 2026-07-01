'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Heart,
  HelpCircle,
  Info,
  Shield,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { saveChild, deleteChild } from '@/lib/children/actions';
import { PrivacySheet } from './PrivacySheet';
import { ValidationErrorSheet } from './ValidationErrorSheet';
import { OlderChildSheet } from './OlderChildSheet';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';
import {
  EMBER_FIGMA_APP_CONTAINER,
  EMBER_FIGMA_BORDER,
  EMBER_FIGMA_MUTED,
  EMBER_FIGMA_PAGE_BG,
  EMBER_FIGMA_TEXT,
} from '@/lib/discover/figmaTokens';

type ChildData = {
  id?: string;
  child_name?: string | null;
  birthdate?: string | null;
  gender?: string | null;
};

const HERO_IMAGE = '/home/hero.webp';
const ACCENT = '#FF5C34';
const INPUT_CLASS = `w-full px-3.5 py-2.5 rounded-xl border ${EMBER_FIGMA_BORDER} bg-white ${EMBER_FIGMA_TEXT} text-base placeholder:text-[#66717D]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5C34] focus:border-transparent transition-all input`;

function OrangeIconTile({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${ACCENT}14` }}
      >
        <Icon className="h-5 w-5" style={{ color: ACCENT }} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h3 className={`text-sm font-semibold ${EMBER_FIGMA_TEXT}`}>{title}</h3>
        <p className={`mt-0.5 text-sm leading-relaxed ${EMBER_FIGMA_MUTED}`}>{children}</p>
      </div>
    </div>
  );
}

function MarketingPanel({ isEdit }: { isEdit: boolean }) {
  return (
    <div className="space-y-6">
      <div className={`overflow-hidden rounded-[20px] border ${EMBER_FIGMA_BORDER} shadow-sm`}>
        <img src={HERO_IMAGE} alt="" className="h-40 w-full object-cover lg:h-48" />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 shrink-0" style={{ color: ACCENT }} strokeWidth={2} />
          <h2 className={`text-2xl font-bold leading-tight ${EMBER_FIGMA_TEXT}`}>
            {isEdit ? 'Update their profile' : 'Start their journey'}
          </h2>
          <Sparkles className="h-5 w-5 shrink-0" style={{ color: ACCENT }} strokeWidth={2} />
        </div>
        <p className={`text-[15px] leading-relaxed ${EMBER_FIGMA_MUTED}`}>
          We&apos;ll curate toys and activities to support their development at every stage.
        </p>
      </div>

      <div className={`rounded-[20px] border ${EMBER_FIGMA_BORDER} bg-white p-5 shadow-sm space-y-4`}>
        <div>
          <h3 className={`text-base font-semibold ${EMBER_FIGMA_TEXT}`}>Proactive parental purchasing</h3>
          <p className={`mt-1.5 text-sm leading-relaxed ${EMBER_FIGMA_MUTED}`}>
            Ember spots what&apos;s changing at their stage — so you know when to buy, borrow, or bring something back
            out, without the usual last-minute scramble.
          </p>
        </div>
        <OrangeIconTile icon={ShoppingBag} title="Right toy, right time">
          Play ideas and shortlists matched to what they&apos;re practising now — not a catalogue dump.
        </OrangeIconTile>
        <OrangeIconTile icon={Shield} title="You stay in control">
          Edit or delete this profile anytime. We never sell your data.
        </OrangeIconTile>
      </div>
    </div>
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

      router.push(
        isEdit && initial?.id
          ? `/family?saved=1&child=${encodeURIComponent(initial.id)}`
          : '/discover'
      );
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
      router.push(
        isEdit && initial?.id
          ? `/family?saved=1&child=${encodeURIComponent(initial.id)}`
          : '/discover'
      );
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
    <div className={`min-h-screen font-sans ${EMBER_FIGMA_PAGE_BG}`}>
      <main className={`${EMBER_FIGMA_APP_CONTAINER} max-w-6xl py-5 pb-28 lg:py-8 lg:pb-10`}>
        <div className="mb-5 flex items-center justify-between">
          <Link
            href={backHref}
            className={`-ml-1 rounded-full p-2 transition-colors hover:bg-white/80 ${EMBER_FIGMA_TEXT}`}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={() => setShowPrivacySheet(true)}
            className={`-mr-1 rounded-full p-2 transition-colors hover:bg-white/80 ${EMBER_FIGMA_MUTED}`}
            aria-label="Privacy information"
          >
            <HelpCircle className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Mobile: marketing snippet above form */}
        <div className={`mb-5 lg:hidden ${EMBER_FIGMA_MUTED} text-center text-sm`}>
          <Sparkles className="mx-auto mb-2 h-5 w-5" style={{ color: ACCENT }} strokeWidth={2} />
          Tell us their age — we&apos;ll tailor Discover to their stage.
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
          {/* Left — form */}
          <div className="min-w-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </div>
              ) : null}

              <div className={`rounded-[20px] border ${EMBER_FIGMA_BORDER} bg-white p-5 shadow-sm`}>
                <div className="mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 shrink-0" style={{ color: ACCENT }} strokeWidth={2} fill="currentColor" />
                  <h2 className={`text-lg font-semibold ${EMBER_FIGMA_TEXT}`}>Tell us about them</h2>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label htmlFor="childName" className={`mb-1.5 block text-sm font-medium ${EMBER_FIGMA_TEXT}`}>
                      What do you call them?{' '}
                      <span className={`font-normal ${EMBER_FIGMA_MUTED}`}>(optional)</span>
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

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="dateOfBirth" className={`mb-1.5 block text-sm font-medium ${EMBER_FIGMA_TEXT}`}>
                        When were they born?
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
                          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 ${EMBER_FIGMA_MUTED}`}
                          strokeWidth={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPrivacySheet(true)}
                        className={`mt-1.5 flex items-center gap-1 text-xs ${EMBER_FIGMA_MUTED} underline hover:text-[#FF5C34]`}
                      >
                        <Info className="h-3 w-3" strokeWidth={2} />
                        Why we ask this
                      </button>
                    </div>

                    <div>
                      <label htmlFor="gender" className={`mb-1.5 block text-sm font-medium ${EMBER_FIGMA_TEXT}`}>
                        Gender <span className={`font-normal ${EMBER_FIGMA_MUTED}`}>(optional)</span>
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

                  <label
                    className="flex cursor-pointer items-start gap-2.5 rounded-xl border p-3.5"
                    style={{ borderColor: `${ACCENT}33`, backgroundColor: `${ACCENT}0A` }}
                  >
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[#E7E2DC] text-[#FF5C34] focus:ring-[#FF5C34]"
                    />
                    <span className={`text-sm leading-snug ${EMBER_FIGMA_TEXT}`}>
                      I understand this is stored to personalise recommendations
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-white transition-all hover:bg-[#E54A2E] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
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

            <div className={`mt-5 text-sm ${EMBER_FIGMA_MUTED}`}>
              <p className="mb-2">You can edit or delete this profile anytime.</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <button
                  type="button"
                  onClick={() => setShowPrivacySheet(true)}
                  className="underline hover:text-[#FF5C34]"
                >
                  Privacy
                </button>
                <span aria-hidden>·</span>
                <Link href="/account" className="underline hover:text-[#FF5C34]">
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

          {/* Right — hero + explainer */}
          <aside className="mt-10 lg:mt-0 lg:sticky lg:top-24">
            <MarketingPanel isEdit={isEdit} />
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
