'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setHasSession(true);
      } else {
        setError('Session expired. Please request a new reset link.');
      }
      setLoading(false);
    }

    checkSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError('Failed to update password. Please try again.');
    } else {
      router.push('/app');
    }
  }

  if (loading) {
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="container-wrap">
        <h1 className="text-2xl font-semibold mb-4">Reset link invalid</h1>
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <p className="text-sm mb-3">
          Reset link invalid or expired. Request a new one.
        </p>
        <p className="text-sm mt-3">
          <a href="/forgot-password" className="underline">Request a new reset link</a>
        </p>
      </div>
    );
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Set new password</h1>
      <form onSubmit={handleSubmit} className="card p-4 space-y-3 max-w-md">
        <label className="block">
          <span className="block text-sm font-medium mb-1">New password</span>
          <input
            type="password"
            required
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1">Confirm password</span>
          <input
            type="password"
            required
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary" type="submit">Update password</button>
      </form>
    </div>
  );
}

