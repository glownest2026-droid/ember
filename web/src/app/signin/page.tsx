'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/app';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();

    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });

    // Always show sent=true to avoid enumeration, even on error
    // Only show generic error for unexpected failures (network/config)
    if (error) {
      // Don't show raw Supabase errors to avoid enumeration
      // Only show generic message for truly unexpected errors
      const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
      if (isNetworkError) {
        setError('Something went wrong sending the email. Please try again.');
      }
      // For "user not found" or other auth errors, still show sent=true with generic message
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm mt-3">
          If you&apos;re invited, you&apos;ll receive an email with a sign-in link shortly.
        </p>
        <p className="text-sm mt-3">
          Email link not working?{' '}
          <a href="/verify" className="underline">Use a 6-digit code instead</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={handleSubmit} className="card p-4 space-y-3 max-w-md">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Email</span>
          <input
            type="email"
            required
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary" type="submit">Send magic link</button>
      </form>
      <p className="text-sm mt-3">
        Email link not working?{' '}
        <a href="/verify" className="underline">Use a 6-digit code instead</a>.
      </p>
      <p className="text-sm mt-3">
        <a href={`/signin/password${next !== '/app' ? `?next=${encodeURIComponent(next)}` : ''}`} className="underline">
          Admin password sign-in
        </a>
      </p>
    </div>
  );
}
