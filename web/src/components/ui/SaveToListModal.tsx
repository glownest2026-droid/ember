'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { buildAuthCallbackUrl } from '@/lib/auth-callback-url';
import { AUTH_ENABLE_GOOGLE, AUTH_ENABLE_APPLE, AUTH_ENABLE_EMAIL_OTP } from '@/lib/auth-flags';
import { GoogleMark } from '@/components/icons/GoogleMark';
import { discoverManrope } from '@/lib/discover/manrope';

const RETURN_URL_KEY = 'ember_auth_return_url';
const PENDING_INTENT_KEY = 'ember_auth_pending_intent';
const RESEND_COOLDOWN_SEC = 25;
const SEND_ERROR_COOLDOWN_SEC = 60;

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
  /** Optional pre-computed label for saved confirmation (e.g. "Saved to your son's ideas"). If not set, modal fetches first child's gender when signed in and computes label. */
  savedToLabel?: string;
  /** Link for "View my toy ideas" CTA when signed in. Defaults to /my-ideas; use e.g. /my-ideas?tab=ideas or /my-ideas?tab=products&child=xxx for deeplink. */
  viewMyListHref?: string;
  /** Match discover page typography and palette when opened from /discover. */
  appearance?: 'default' | 'discover';
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

/** UK English; apostrophe: "Poppy's ideas". Son/daughter only when confidently mapped. */
export function savedToCopy({ name, gender }: { name?: string | null; gender?: string | null }): string {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (trimmedName.length > 0) return `Saved to ${trimmedName}'s ideas`;
  const g = typeof gender === 'string' ? gender.trim().toLowerCase() : '';
  if (['male', 'm', 'boy', 'son'].includes(g)) return "Saved to your son's ideas";
  if (['female', 'f', 'girl', 'daughter'].includes(g)) return "Saved to your daughter's ideas";
  return "Saved to your child's ideas";
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
 * - Signed in: personalised "Saved to …'s ideas" + View my toy ideas (→ /family) + Close.
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
  savedToLabel: savedToLabelProp,
  viewMyListHref = '/my-ideas',
  appearance = 'default',
}: SaveToListModalProps) {
  const isDiscover = appearance === 'discover';
  const textHigh = isDiscover ? '#253044' : 'var(--ember-text-high)';
  const textLow = isDiscover ? '#66717D' : 'var(--ember-text-low)';
  const surface = isDiscover ? '#FFFFFF' : 'var(--ember-surface-primary)';
  const border = isDiscover ? '#E7E2DC' : 'var(--ember-border-subtle)';
  const accent = isDiscover ? '#FF5C34' : 'var(--ember-accent-base)';
  const titleFont = isDiscover ? discoverManrope.style.fontFamily : 'var(--font-serif)';
  const bodyFont = isDiscover ? discoverManrope.style.fontFamily : 'var(--font-sans)';
  const [step, setStep] = useState<AuthStep>('choose');
  const [email, setEmail] = useState('');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [sendErrorCooldown, setSendErrorCooldown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [savedToLabelFetched, setSavedToLabelFetched] = useState<string>("Saved to your child's ideas");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const firstCodeRef = useRef<HTMLInputElement>(null);
  const successCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emailValid = isValidEmail(email);
  const codeString = codeDigits.join('').trim();
  const codeValid = codeString.length >= 6;

  const resetToChoose = useCallback(() => {
    setStep('choose');
    setEmail('');
    setCodeDigits(Array(6).fill(''));
    setError(null);
    setErrorHint(null);
    setSendErrorCooldown(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      setSavedToLabelFetched("Saved to your child's ideas");
      resetToChoose();
      dialog.showModal();
      requestAnimationFrame(() => {
        if (!signedIn && step === 'choose') {
          (document.querySelector('[data-auth-modal-focus]') as HTMLElement)?.focus();
        }
      });
    } else {
      dialog.close();
      if (successCloseTimeoutRef.current) {
        clearTimeout(successCloseTimeoutRef.current);
        successCloseTimeoutRef.current = null;
      }
    }
  }, [open, signedIn, resetToChoose]);

  // When modal is open and signed in, fetch first child's gender to personalise "Saved to …'s ideas" (no name; privacy).
  useEffect(() => {
    if (!open || !signedIn || savedToLabelProp != null) return;
    const supabase = createClient();
    void supabase
      .from('children')
      .select('gender')
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        const first = Array.isArray(data) && data[0] ? (data[0] as { gender?: string | null }) : null;
        setSavedToLabelFetched(savedToCopy({ gender: first?.gender ?? null }));
      });
  }, [open, signedIn, savedToLabelProp]);

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

  useEffect(() => {
    if (sendErrorCooldown <= 0) return;
    const t = setTimeout(() => setSendErrorCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sendErrorCooldown]);

  // After OTP verify success: show "You're signed in" for ~1s then close and notify parent
  useEffect(() => {
    if (!open || step !== 'success' || signedIn) return;
    successCloseTimeoutRef.current = setTimeout(() => {
      successCloseTimeoutRef.current = null;
      handleClose();
      onAuthSuccess?.();
    }, 1000);
    return () => {
      if (successCloseTimeoutRef.current) {
        clearTimeout(successCloseTimeoutRef.current);
        successCloseTimeoutRef.current = null;
      }
    };
  }, [open, step, signedIn]);

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

  const getCallbackUrl = (next: string) => buildAuthCallbackUrl(next);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || loading || sendErrorCooldown > 0) return;
    setError(null);
    setErrorHint(null);
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
    if (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[auth][otp] send failed', {
          message: err.message,
          status: (err as { status?: number }).status,
        });
      }
      setError("We couldn't send a code right now. Please try again in a minute.");
      const errStatus = (err as { status?: number }).status;
      const isEmailDeliveryError =
        err.message.includes('Error sending magic link email') ||
        err.message.includes('magic link') ||
        (typeof errStatus === 'number' && errStatus >= 500);
      if (isEmailDeliveryError) {
        setErrorHint('If this keeps happening, we may need to fix email delivery settings in Supabase.');
      }
      setSendErrorCooldown(SEND_ERROR_COOLDOWN_SEC);
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
    setError(null);
    setErrorHint(null);
    setStep('success');
    // Success UI shows briefly; useEffect will close modal and call onAuthSuccess after 1s
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(null);
    setErrorHint(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[auth][otp] resend failed', {
          message: err.message,
          status: (err as { status?: number }).status,
        });
      }
      setError("We couldn't send a code right now. Please try again in a minute.");
      const errStatusResend = (err as { status?: number }).status;
      const isEmailDeliveryErrorResend =
        err.message.includes('Error sending magic link email') ||
        err.message.includes('magic link') ||
        (typeof errStatusResend === 'number' && errStatusResend >= 500);
      if (isEmailDeliveryErrorResend) {
        setErrorHint('If this keeps happening, we may need to fix email delivery settings in Supabase.');
      }
      setResendCooldown(RESEND_COOLDOWN_SEC);
      return;
    }
    setResendCooldown(RESEND_COOLDOWN_SEC);
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

  const baseStyle = { fontFamily: bodyFont } as const;

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
      className={`fixed inset-0 w-full max-w-lg mx-auto max-h-[90vh] my-auto p-0 rounded-xl border shadow-lg backdrop:bg-black/40 ${isDiscover ? discoverManrope.className : ''}`}
      style={{
        borderColor: border,
        backgroundColor: surface,
      }}
      aria-labelledby="save-modal-title"
      aria-describedby="save-modal-desc"
    >
      <div className="p-6">
        {signedIn ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-2" style={{ fontFamily: titleFont, color: textHigh }}>
              {savedToLabelProp ?? savedToLabelFetched}
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: textLow }}>
              You can find this in your recommendations.
            </p>
            <div className="flex flex-col gap-2">
              <Link href={viewMyListHref} onClick={handleClose} className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center w-full" style={{ borderColor: border, backgroundColor: accent, color: 'white', ...baseStyle }}>
                View my toy ideas
              </Link>
              <button type="button" onClick={handleClose} className="min-h-[40px] rounded-lg font-medium text-sm w-full opacity-70 hover:opacity-100" style={{ border: 'none', backgroundColor: 'transparent', color: textLow, ...baseStyle }}>
                Close
              </button>
            </div>
          </>
        ) : step === 'choose' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: titleFont, color: textHigh }}>
              Save to your list
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: textLow }}>
              Sign in to save ideas and build your list.
            </p>
            <div className="flex flex-col gap-3">
              {AUTH_ENABLE_APPLE && (
                <button type="button" onClick={() => handleOAuth('apple')} data-auth-modal-focus className="min-h-[44px] rounded-lg border font-medium text-sm w-full flex items-center justify-center gap-2" style={{ borderColor: border, backgroundColor: surface, color: textHigh, ...baseStyle }}>
                  Continue with Apple
                </button>
              )}
              {AUTH_ENABLE_GOOGLE && (
                <button type="button" onClick={() => handleOAuth('google')} className="min-h-[44px] rounded-lg border font-medium text-sm w-full flex items-center justify-center gap-2" style={{ borderColor: border, backgroundColor: surface, color: textHigh, ...baseStyle }}>
                  <GoogleMark />
                  Continue with Google
                </button>
              )}
              {AUTH_ENABLE_EMAIL_OTP && (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setErrorHint(null);
                    setSendErrorCooldown(0);
                    setStep('email');
                  }}
                  className="min-h-[44px] rounded-lg border font-medium text-sm w-full"
                  style={{ borderColor: border, backgroundColor: surface, color: textHigh, ...baseStyle }}
                >
                  Continue with Email
                </button>
              )}
            </div>
            <div className="mt-4 pt-3 border-t" style={{ borderColor: border }}>
              <Link href={signinUrl} onClick={handleClose} className="text-sm opacity-70 hover:opacity-100 underline" style={{ color: textLow, ...baseStyle }}>
                I already have an account
              </Link>
            </div>
            <button type="button" onClick={handleClose} className="mt-2 block text-sm opacity-70 hover:opacity-100 w-full text-left" style={{ color: textLow, ...baseStyle }}>
              Not now
            </button>
          </>
        ) : step === 'email' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: titleFont, color: textHigh }}>
              Save to your list
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: textLow }}>
              Sign in to save ideas and build your list.
            </p>
            <form onSubmit={handleSendCode} className="flex flex-col gap-3">
              <label htmlFor="save-modal-email" className="block text-sm font-medium" style={{ color: textHigh, ...baseStyle }}>
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
                style={{ borderColor: error ? '#dc2626' : border, backgroundColor: surface, color: textHigh, ...baseStyle }}
                disabled={loading}
              />
              {error && (
                <div className="space-y-1">
                  <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>{error}</p>
                  {errorHint && (
                    <p className="text-sm" style={{ color: textLow, ...baseStyle }}>{errorHint}</p>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={!emailValid || loading || sendErrorCooldown > 0}
                className="min-h-[44px] rounded-lg font-medium text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ border: 'none', backgroundColor: accent, color: 'white', ...baseStyle }}
              >
                {loading ? 'Sending…' : sendErrorCooldown > 0 ? `Try again in ${sendErrorCooldown}s` : 'Send code'}
              </button>
            </form>
            <button type="button" onClick={() => setStep('choose')} className="mt-3 text-sm opacity-70 hover:opacity-100" style={{ color: textLow, ...baseStyle }}>
              Back
            </button>
          </>
        ) : step === 'success' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-2" style={{ fontFamily: titleFont, color: textHigh }}>
              You&apos;re signed in
            </h2>
            <p id="save-modal-desc" className="text-sm" style={{ ...baseStyle, color: textLow }}>
              Nice — you can save ideas now.
            </p>
          </>
        ) : step === 'code' ? (
          <>
            <h2 id="save-modal-title" className="text-lg font-semibold mb-1" style={{ fontFamily: titleFont, color: textHigh }}>
              Enter your code
            </h2>
            <p id="save-modal-desc" className="text-sm mb-4" style={{ ...baseStyle, color: textLow }}>
              Check your email for a 6-digit code. We sent it to {email}.
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
                    style={{ borderColor: border, backgroundColor: surface, color: textHigh, ...baseStyle }}
                    disabled={loading}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              {error && <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>{error}</p>}
              <button type="submit" disabled={!codeValid || loading} className="min-h-[44px] rounded-lg font-medium text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed" style={{ border: 'none', backgroundColor: accent, color: 'white', ...baseStyle }}>
                {loading ? 'Verifying…' : 'Verify code'}
              </button>
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <button type="button" onClick={() => { setStep('email'); setError(null); setCodeDigits(Array(6).fill('')); }} className="opacity-70 hover:opacity-100 underline" style={{ color: textLow, ...baseStyle }}>
                  Change email
                </button>
                <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="opacity-70 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed" style={{ color: textLow, ...baseStyle }}>
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
