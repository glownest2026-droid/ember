'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface SaveToListModalProps {
  open: boolean;
  onClose: () => void;
  signedIn: boolean;
  signinUrl: string;
  /** Called on close to restore focus */
  onCloseFocusRef?: React.RefObject<HTMLElement | null>;
}

/** Simple email validation (basic regex) */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Parse next param from signinUrl (e.g. /signin?next=/discover/26) for redirect after auth */
function getNextFromSigninUrl(signinUrl: string): string {
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dummy';
    const url = new URL(signinUrl.startsWith('/') ? base + signinUrl : signinUrl);
    return url.searchParams.get('next') || '/app';
  } catch {
    return '/app';
  }
}

/**
 * Accessible modal for "Save to my list" / "Save idea" CTA.
 * - Signed out: Single path — email + magic link. Secondary: "I already have an account", "Not now"
 * - Signed in: "Saved" + View my list + Close
 * Uses native <dialog> for focus trap and ESC.
 */
export function SaveToListModal({
  open,
  onClose,
  signedIn,
  signinUrl,
  onCloseFocusRef,
}: SaveToListModalProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const emailValid = isValidEmail(email);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setEmail('');
      setSent(false);
      setLoading(false);
      setError(null);
      dialog.showModal();
      // Focus email input when signed out and form visible
      requestAnimationFrame(() => {
        if (!signedIn && !sent) {
          emailInputRef.current?.focus();
        }
      });
    } else {
      dialog.close();
    }
  }, [open, signedIn, sent]);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || loading) return;
    setError(null);
    setLoading(true);
    const next = getNextFromSigninUrl(signinUrl);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (err && (err.message.includes('fetch') || err.message.includes('network'))) {
      setError('Something went wrong sending the email. Please try again.');
      return;
    }
    setSent(true);
  };

  const handleClose = () => {
    onClose();
    onCloseFocusRef?.current?.focus?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  if (!open) return null;

  const baseStyle = {
    fontFamily: 'var(--font-sans)',
  } as const;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 w-full max-w-lg mx-auto max-h-[90vh] my-auto p-0 rounded-xl border shadow-lg backdrop:bg-black/40"
      style={{
        borderColor: 'var(--ember-border-subtle)',
        backgroundColor: 'var(--ember-surface-primary)',
      }}
      aria-labelledby="save-modal-title"
      aria-describedby="save-modal-desc"
    >
      <div className="p-6">
        {/* SIGNED IN: Saved confirmation */}
        {signedIn ? (
          <>
            <h2
              id="save-modal-title"
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              Saved to your list
            </h2>
            <p
              id="save-modal-desc"
              className="text-sm mb-4"
              style={{ ...baseStyle, color: 'var(--ember-text-low)' }}
            >
              You can find this in your recommendations.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/app/recs"
                onClick={handleClose}
                className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center w-full"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-accent-base)',
                  color: 'white',
                  ...baseStyle,
                }}
              >
                View my list
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[40px] rounded-lg font-medium text-sm w-full opacity-70 hover:opacity-100 transition-opacity"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--ember-text-low)',
                  ...baseStyle,
                }}
              >
                Close
              </button>
            </div>
          </>
        ) : sent ? (
          /* SENT: Check your email confirmation */
          <>
            <h2
              id="save-modal-title"
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              Check your email
            </h2>
            <p
              id="save-modal-desc"
              className="text-sm mb-4"
              style={{ ...baseStyle, color: 'var(--ember-text-low)' }}
            >
              We&apos;ve sent you a sign-in link. Open it on this device to finish saving.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="min-h-[40px] rounded-lg border font-medium text-sm w-full"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
                ...baseStyle,
              }}
            >
              Close
            </button>
          </>
        ) : (
          /* SIGNED OUT: Single path — email + magic link */
          <>
            <h2
              id="save-modal-title"
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              Save this idea
            </h2>
            <p
              id="save-modal-desc"
              className="text-sm mb-4"
              style={{ ...baseStyle, color: 'var(--ember-text-low)' }}
            >
              Create a free account to save ideas and track what you already have.
            </p>
            <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="save-modal-email"
                className="block text-sm font-medium"
                style={{ color: 'var(--ember-text-high)', ...baseStyle }}
              >
                Email address
              </label>
              <input
                ref={emailInputRef}
                id="save-modal-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[44px] rounded-lg border px-3 text-sm"
                style={{
                  borderColor: error ? '#dc2626' : 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                  ...baseStyle,
                }}
                disabled={loading}
              />
              {error && (
                <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={!emailValid || loading}
                className="min-h-[44px] rounded-lg font-medium text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  border: 'none',
                  backgroundColor: 'var(--ember-accent-base)',
                  color: 'white',
                  ...baseStyle,
                }}
              >
                {loading ? 'Sending…' : 'Send magic link'}
              </button>
            </form>
            <div className="mt-4 pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <Link
                href={signinUrl}
                onClick={handleClose}
                className="text-sm text-center opacity-70 hover:opacity-100 transition-opacity underline"
                style={{ color: 'var(--ember-text-low)', ...baseStyle }}
              >
                I already have an account
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
                style={{ color: 'var(--ember-text-low)', ...baseStyle }}
              >
                Not now
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
