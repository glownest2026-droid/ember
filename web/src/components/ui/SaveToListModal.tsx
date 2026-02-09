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
 * - Signed out: Sign in + Join free links, Email field + magic link, Not now button
 * - Signed in: "Saved" confirmation + View my list link
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
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setEmail('');
      setSent(false);
      setError(null);
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const next = getNextFromSigninUrl(signinUrl);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });
    if (err && (err.message.includes('fetch') || err.message.includes('network'))) {
      setError('Something went wrong sending the email. Please try again.');
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
        <h2
          id="save-modal-title"
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
        >
          {signedIn ? 'Saved to your list' : 'Save to your list'}
        </h2>
        <p
          id="save-modal-desc"
          className="text-sm mb-4"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          {signedIn
            ? 'You can find this in your recommendations.'
            : 'Sign in to save ideas and build your list.'}
        </p>
        <div className="flex flex-col gap-2">
          {signedIn ? (
            <Link
              href="/app/recs"
              onClick={handleClose}
              className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-accent-base)',
                color: 'white',
              }}
            >
              View my list
            </Link>
          ) : sent ? (
            <>
              <p className="text-sm" style={{ color: 'var(--ember-text-low)', fontFamily: 'var(--font-sans)' }}>
                If you&apos;re invited, you&apos;ll receive an email with a sign-in link shortly.
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--ember-text-low)', fontFamily: 'var(--font-sans)' }}>
                <a href="/verify" className="underline" onClick={handleClose}>Use a 6-digit code instead</a>
              </p>
            </>
          ) : (
            <>
              <Link
                href={signinUrl}
                onClick={handleClose}
                className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-accent-base)',
                  color: 'white',
                }}
              >
                Sign in
              </Link>
              <Link
                href={signinUrl}
                onClick={handleClose}
                className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                }}
              >
                Join free
              </Link>
              <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-2 mt-1">
                <label className="block text-sm font-medium" style={{ color: 'var(--ember-text-high)', fontFamily: 'var(--font-sans)' }}>
                  Email address:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-[40px] rounded-lg border px-3 text-sm"
                  style={{
                    borderColor: 'var(--ember-border-subtle)',
                    backgroundColor: 'var(--ember-surface-primary)',
                    color: 'var(--ember-text-high)',
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                {error && <p className="text-red-600 text-xs">{error}</p>}
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg border font-medium text-sm"
                  style={{
                    borderColor: 'var(--ember-border-subtle)',
                    backgroundColor: 'var(--ember-accent-base)',
                    color: 'white',
                  }}
                >
                  Send magic link
                </button>
              </form>
            </>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[40px] rounded-lg border font-medium text-sm"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-low)',
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </dialog>
  );
}
