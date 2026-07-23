'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type Props = {
  open: boolean;
  onClose: () => void;
  source?: string;
};

type Status = 'idle' | 'loading' | 'ok' | 'already' | 'error';

export function WaitlistJoinModal({ open, onClose, source = 'pricing' }: Props) {
  const titleId = useId();
  const [email, setEmail] = useState('');
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus('idle');
    setError(null);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      const fromAuth = user?.email?.trim() ?? null;
      setSignedInEmail(fromAuth);
      if (fromAuth) setEmail(fromAuth);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/waitlist/ember-plus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = (await res.json()) as { ok?: boolean; already?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus('error');
        setError(data.error || 'Could not join the waitlist. Please try again.');
        return;
      }
      setStatus(data.already ? 'already' : 'ok');
    } catch {
      setStatus('error');
      setError('Could not join the waitlist. Please try again.');
    }
  }

  const done = status === 'ok' || status === 'already';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#253044]/45"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#E7E2DC] bg-[#FBFAF7] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-[#66717D] hover:bg-[#F3F0EA] hover:text-[#253044]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 id={titleId} className="pr-8 text-xl font-semibold tracking-[-0.01em] text-[#253044]">
          Join the Ember Plus waitlist
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#66717D]">
          We’ll email you when Ember Plus is ready. No payment now — Free stays yours to browse.
        </p>

        {done ? (
          <div className="mt-6 rounded-xl border border-[#B7DCC8] bg-[#E7F3EC] px-4 py-3 text-sm text-[#1F4D35]">
            {status === 'already'
              ? 'You’re already on the list — thanks for your interest.'
              : 'You’re on the list. We’ll be in touch when Ember Plus is ready.'}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="ember-plus-waitlist-email" className="mb-1.5 block text-sm font-medium text-[#253044]">
                Email
              </label>
              <input
                id="ember-plus-waitlist-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!!signedInEmail}
                className="w-full rounded-xl border border-[#E7E2DC] bg-white px-3.5 py-2.5 text-[0.9375rem] text-[#253044] outline-none ring-[#FF5C34] focus:ring-2 read-only:bg-[#F3F0EA]"
                placeholder="you@example.com"
              />
              {signedInEmail ? (
                <p className="mt-1.5 text-xs text-[#66717D]">Using the email on your Ember account.</p>
              ) : null}
            </div>
            {error ? <p className="text-sm text-[#C44722]">{error}</p> : null}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-xl bg-[#FF5C34] px-6 py-3 text-[0.9375rem] font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
            >
              {status === 'loading' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}

        {done ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-xl border-2 border-[#E7E2DC] px-6 py-3 text-[0.9375rem] font-semibold text-[#253044]"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
