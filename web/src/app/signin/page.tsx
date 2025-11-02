'use client';

import { useState } from 'react';
import { createClient } from '../../utils/supabase/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  const supabase = createClient();

  const origin = window.location.origin; // e.g. https://ember-mocha-eight.vercel.app (preview)
  const redirectTo = `${origin}/auth/callback?next=/app`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });

  if (error) setError(error.message);
  else setSent(true);
}

  if (sent) {
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p>We sent a magic link to <strong>{email}</strong>. Open it to sign in.</p>
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
    </div>
  );
}
