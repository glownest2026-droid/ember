'use client';

import { useState } from 'react';
import { createClient } from '../../utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const supabase = createClient();
    const origin = window.location.origin;
    const redirectTo = `${origin}/auth/confirm`;

    await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    
    // Always show sent=true to avoid enumeration
    setSent(true);
  }

  if (sent) {
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
        <p className="text-sm mt-3">
          If an account exists, you&apos;ll receive an email with instructions to reset your password.
        </p>
        <p className="text-sm mt-3">
          <a href="/signin/password" className="underline">Back to sign in</a>
        </p>
      </div>
    );
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Reset password</h1>
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
        <button className="btn btn-primary" type="submit">Send reset link</button>
      </form>
      <p className="text-sm mt-3">
        <a href="/signin/password" className="underline">Back to sign in</a>
      </p>
    </div>
  );
}

