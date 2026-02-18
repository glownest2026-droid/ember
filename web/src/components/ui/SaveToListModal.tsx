'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { AUTH_ENABLE_GOOGLE, AUTH_ENABLE_APPLE, AUTH_ENABLE_EMAIL_OTP } from '@/lib/auth-flags';

const RETURN_URL_KEY = 'ember_auth_return_url';
const PENDING_INTENT_KEY = 'ember_auth_pending_intent';
const RESEND_COOLDOWN_SEC = 25;

export interface PendingIntent {
  type: 'auth_only';
  source: string;
}

interface SaveToListModalProps {
  open: boolean;
  onClose: () => void;
  signedIn: boolean;
  signinUrl: string;
  onCloseFocusRef?: React.RefObject<HTMLElement | null>;
  /** Called when user signs in (e.g. OTP success in-modal); parent can refresh auth state */
  onAuthSuccess?: () => void;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function getNextFromSigninUrl(signinUrl: string): string {
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://dummy';
    const url = new URL(signinUrl.startsWith('/') ? base + signinUrl : signinUrl);
    return url.searchParams.get('next') || '/app';
  } catch {
    return '/app';
  }
}

/** Store return URL and pending intent for OAuth return-to */
export function storeOAuthReturn(returnUrl: string, intent: PendingIntent) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(RETURN_URL_KEY, returnUrl);
    sessionStorage.setItem(PENDING_INTENT_KEY, JSON.stringify(intent));
  } catch {}
}

/** Read and clear stored return URL (call after OAuth callback) */
export function consumeOAuthReturn(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const url = sessionStorage.getItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    sessionStorage.removeItem(PENDING_INTENT_KEY);
    return url;
  } catch {
    return null;
  }
}

type AuthStep = 'choose' | 'email' | 'code' | 'success';

/**
 * Auth modal for "Save to your list" and generic sign-in.
 * - Signed in: "Saved" + View my list + Close.
 * - Signed out: Apple (flag), Google (flag), Email OTP (6-digit), Not now.
 * OAuth uses return URL in sessionStorage + next param for callback.
 */
export function SaveToListModal({
  open,
  onClose,
  signedIn,
  signinUrl,
  onCloseFocusRef,
  onAuthSuccess,
}: SaveToListModalProps) {
  const [step, setStep] = useState<AuthStep>('choose');
  const [email, setEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const firstCodeRef = useRef<HTMLInputElement>(null);

  const emailValid = isValidEmail(email);
  const codeString = codeDigits.join('').trim();
  const codeValid = codeString.length >= 6;

  const resetToChoose = useCallback(() => {
    setStep('choose');
    setEmail('');
    setCodeDigits(Array(6).fill(''));
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      resetToChoose();
      dialog.showModal();
      requestAnimationFrame(() => {
        if (!signedIn && step === 'choose') {
          (document.querySelector('[data-auth-modal-focus]') as HTMLElement)?.focus();
        }
      });
    } else {
      dialog.close();
    }
  }, [open, signedIn, resetToChoose]);

  useEffect(() => {
    if (!open) return;
    if (signedIn) setStep('success');
    else if (step === 'choose') resetToChoose();
  }, [open, signedIn]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleClose = () => {
    onClose();
    onCloseFocusRef?.current?.focus?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  const getReturnUrl = () => {
    if (typeof window === 'undefined') return '/discover';
    return window.location.pathname + window.location.search + window.location.hash || '/discover';
  };

  const getCallbackUrl = (next: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || loading) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const redirectTo = getCallbackUrl(getNextFromSigninUrl(signinUrl));
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (err && (err.message.includes('fetch') || err.message.includes('network'))) {
      setError('Something went wrong. Please try again.');
      return;
    }
    setStep('code');
    setResendCooldown(RESEND_COOLDOWN_SEC);
    firstCodeRef.current?.focus();
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeValid || loading) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: codeString.slice(0, 6),
      type: 'email',
    });
    setLoading(false);
    if (err) {
      setError(err.message || 'Invalid code. Try again.');
      return;
    }
    setStep('success');
    onAuthSuccess?.();
    handleClose();
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (!err) setResendCooldown(RESEND_COOLDOWN_SEC);
  };

  const handleOAuth = (provider: 'google' | 'apple') => {
    const returnUrl = getReturnUrl();
    storeOAuthReturn(returnUrl, { type: 'auth_only', source: 'save_modal' });
    const callbackUrl = getCallbackUrl(returnUrl);
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl },
    });
  };

  const setCodeDigit = (index: number, value: string) => {
    const next = [...codeDigits];
    const v = value.replace(/\D/g, '').slice(-1);
    next[index] = v;
    setCodeDigits(next);
    if (v && index < 5) {
      const el = document.querySelector<HTMLInputElement>(`[data-code-input="${index + 1}"]`);
      el?.focus();
    }
  };

  const handleCodeInputPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...codeDigits];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] ?? '';
    setCodeDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    document.querySelector<HTMLInputElement>(`[data-code-input="${focusIndex}"]`)?.focus();
  };

  const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

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
        {signedIn ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
              Saved to your list
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: 'var(--ember-text-low)' }}>
              You can find this in your recommendations.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/app/recs" onClick={handleClose} className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center w-full" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-accent-base)', color: 'white', ...baseStyle }}>
                View my list
              </Link>
              <button type="button" onClick={handleClose} className="min-h-[40px] rounded-lg font-medium text-sm w-full opacity-70 hover:opacity-100" style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--ember-text-low)', ...baseStyle }}>
                Close
              </button>
            </div>
          </>
        ) : step === 'choose' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
              Save to your list
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: 'var(--ember-text-low)' }}>
              Sign in to save ideas and build your list.
            </p>
            <div className="flex flex-col gap-3">
              {AUTH_ENABLE_APPLE && (
                <button type="button" onClick={() => handleOAuth('apple')} data-auth-modal-focus className="min-h-[44px] rounded-lg border font-medium text-sm w-full flex items-center justify-center gap-2" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', ...baseStyle }}>
                  Continue with Apple
                </button>
              )}
              {AUTH_ENABLE_GOOGLE && (
                <button type="button" onClick={() => handleOAuth('google')} className="min-h-[44px] rounded-lg border font-medium text-sm w-full flex items-center justify-center gap-2" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', ...baseStyle }}>
                  Continue with Google
                </button>
              )}
              {AUTH_ENABLE_EMAIL_OTP && (
                <button type="button" onClick={() => setStep('email')} className="min-h-[44px] rounded-lg border font-medium text-sm w-full" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', ...baseStyle }}>
                  Continue with Email
                </button>
              )}
            </div>
            <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <Link href={signinUrl} onClick={handleClose} className="text-sm opacity-70 hover:opacity-100 underline" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                I already have an account
              </Link>
            </div>
            <button type="button" onClick={handleClose} className="mt-2 block text-sm opacity-70 hover:opacity-100 w-full text-left" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
              Not now
            </button>
          </>
        ) : step === 'email' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
              Save to your list
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: 'var(--ember-text-low)' }}>
              Sign in to save ideas and build your list.
            </p>
            <form onSubmit={handleSendCode} className="flex flex-col gap-3">
              <label htmlFor="save-modal-email" className="block text-sm font-medium" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
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
                style={{ borderColor: error ? '#dc2626' : 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', ...baseStyle }}
                disabled={loading}
              />
              {error && <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>{error}</p>}
              <button type="submit" disabled={!emailValid || loading} className="min-h-[44px] rounded-lg font-medium text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: 'none', backgroundColor: 'var(--ember-accent-base)', color: 'white', ...baseStyle }}>
                {loading ? 'Sending…' : 'Send code'}
              </button>
            </form>
            <button type="button" onClick={() => setStep('choose')} className="mt-3 text-sm opacity-70 hover:opacity-100" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
              Back
            </button>
          </>
        ) : step === 'code' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
              Enter your code
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: 'var(--ember-text-low)' }}>
              We sent a 6-digit code to {email}.
            </p>
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
              <div className="flex gap-2 justify-center" onPaste={handleCodeInputPaste}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={i === 0 ? firstCodeRef : undefined}
                    data-code-input={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={codeDigits[i]}
                    onChange={(e) => setCodeDigit(i, e.target.value)}
                    className="w-10 h-12 rounded-lg border text-center text-lg"
                    style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', ...baseStyle }}
                    disabled={loading}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              {error && <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>{error}</p>}
              <button type="submit" disabled={!codeValid || loading} className="min-h-[44px] rounded-lg font-medium text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: 'none', backgroundColor: 'var(--ember-accent-base)', color: 'white', ...baseStyle }}>
                {loading ? 'Verifying…' : 'Verify code'}
              </button>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <button type="button" onClick={() => { setStep('email'); setError(null); setCodeDigits(Array(6).fill('')); }} className="opacity-70 hover:opacity-100 underline" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                  Change email
                </button>
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="opacity-70 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </form>
          </>
        ) : (
          null
        )}
      </div>
    </dialog>
  );
}
