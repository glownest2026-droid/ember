'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';

export default function PasswordSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/app';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Incorrect email or password.');
    } else {
      router.push(next);
    }
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Sign in with password</h1>
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
        <label className="block">
          <span className="block text-sm font-medium mb-1">Password</span>
          <input
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary" type="submit">Sign in</button>
      </form>
      <p className="text-sm mt-3">
        <a href="/forgot-password" className="underline">Forgot password?</a>
      </p>
      <p className="text-sm mt-3">
        <a href="/signin" className="underline">Back to magic link sign-in</a>
      </p>
    </div>
  );
}

