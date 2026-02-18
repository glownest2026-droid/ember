'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { AUTH_ENABLE_GOOGLE, AUTH_ENABLE_APPLE } from '@/lib/auth-flags';
import type { User } from '@supabase/supabase-js';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [identities, setIdentities] = useState<{ provider: string }[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    supabase.auth.getUserIdentities().then(({ data }) => {
      const list = data?.identities?.map((i) => ({ provider: i.provider ?? 'email' })) ?? [];
      setIdentities(list);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.auth.getUserIdentities().then(({ data }) => {
          const list = data?.identities?.map((i) => ({ provider: i.provider ?? 'email' })) ?? [];
          setIdentities(list);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordLoading(false);
    if (error) {
      setPasswordError(error.message || 'Failed to set password.');
      return;
    }
    setPasswordSuccess(true);
    setPassword('');
    setConfirmPassword('');
  };

  const handleLinkProvider = (provider: 'google' | 'apple') => {
    setLinkError(null);
    setLinkLoading(provider);
    const supabase = createClient();
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent('/account')}`
        : '';
    supabase.auth
      .linkIdentity({ provider, options: { redirectTo } })
      .then(({ error }) => {
        setLinkLoading(null);
        if (error) {
          setLinkError(
            error.message ||
              'Linking failed. Check that the provider is enabled in Supabase and redirect URLs are set. See docs/FEB_2026_AUTH_SETUP.md.'
          );
        } else {
          supabase.auth.getUserIdentities().then(({ data }) => {
            const list = data?.identities?.map((i) => ({ provider: i.provider ?? 'email' })) ?? [];
            setIdentities(list);
          });
        }
      })
      .catch(() => {
        setLinkLoading(null);
        setLinkError('Something went wrong. See docs/FEB_2026_AUTH_SETUP.md for provider setup.');
      });
  };

  if (!user) {
    return (
      <div className="container-wrap min-h-screen py-8">
        <h1 className="text-2xl font-semibold mb-4" style={{ ...baseStyle, color: 'var(--ember-text-high)' }}>
          Account
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
          Sign in to view your account.
        </p>
        <Link
          href="/signin?next=/account"
          className="inline-block min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm"
          style={{
            backgroundColor: 'var(--ember-accent-base)',
            color: 'white',
            ...baseStyle,
          }}
        >
          Sign in
        </Link>
      </div>
    );
  }

  const hasGoogle = identities.some((i) => i.provider === 'google');
  const hasApple = identities.some((i) => i.provider === 'apple');

  return (
    <div className="container-wrap min-h-screen py-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6" style={{ ...baseStyle, color: 'var(--ember-text-high)' }}>
        Account
      </h1>

      <section className="mb-8">
        <h2 className="text-sm font-medium mb-2" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
          Signed in as
        </h2>
        <p className="text-base" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
          {user.email}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
          Set a password (optional)
        </h2>
        <p className="text-sm mb-3" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
          You can then sign in with email + password or continue using your email code.
        </p>
        {passwordSuccess && (
          <p className="text-sm mb-3" style={{ color: 'var(--ember-accent-base)', ...baseStyle }}>
            Password set. You can now sign in with password or email code.
          </p>
        )}
        <form onSubmit={handleSetPassword} className="space-y-3">
          <label className="block">
            <span className="block text-sm font-medium mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              New password
            </span>
            <input
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border px-3 text-sm"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
                ...baseStyle,
              }}
              placeholder="••••••••"
              disabled={passwordLoading}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              Confirm password
            </span>
            <input
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full min-h-[44px] rounded-lg border px-3 text-sm"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-surface-primary)',
                color: 'var(--ember-text-high)',
                ...baseStyle,
              }}
              placeholder="••••••••"
              disabled={passwordLoading}
            />
          </label>
          {passwordError && (
            <p className="text-sm" style={{ color: '#dc2626', ...baseStyle }}>
              {passwordError}
            </p>
          )}
          <button
            type="submit"
            disabled={passwordLoading || !password || !confirmPassword}
            className="min-h-[44px] px-4 rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--ember-accent-base)',
              color: 'white',
              border: 'none',
              ...baseStyle,
            }}
          >
            {passwordLoading ? 'Setting…' : 'Set password'}
          </button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
          Linked sign-in methods
        </h2>
        {identities.length > 0 && (
          <p className="text-sm mb-3" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            Current: {identities.map((i) => i.provider).join(', ')}
          </p>
        )}
        {(AUTH_ENABLE_GOOGLE || AUTH_ENABLE_APPLE) && (
          <div className="flex flex-col gap-2">
            {AUTH_ENABLE_GOOGLE && (
              <button
                type="button"
                onClick={() => handleLinkProvider('google')}
                disabled={!!linkLoading || hasGoogle}
                className="min-h-[44px] px-4 rounded-lg border font-medium text-sm w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                  ...baseStyle,
                }}
              >
                {linkLoading === 'google' ? 'Linking…' : hasGoogle ? 'Google linked' : 'Link Google'}
              </button>
            )}
            {AUTH_ENABLE_APPLE && (
              <button
                type="button"
                onClick={() => handleLinkProvider('apple')}
                disabled={!!linkLoading || hasApple}
                className="min-h-[44px] px-4 rounded-lg border font-medium text-sm w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                  ...baseStyle,
                }}
              >
                {linkLoading === 'apple' ? 'Linking…' : hasApple ? 'Apple linked' : 'Link Apple'}
              </button>
            )}
          </div>
        )}
        {!AUTH_ENABLE_GOOGLE && !AUTH_ENABLE_APPLE && (
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            Link Google or Apple from Supabase dashboard when enabled (see docs).
          </p>
        )}
        {linkError && (
          <p className="text-sm mt-2" style={{ color: '#dc2626', ...baseStyle }}>
            {linkError}
          </p>
        )}
      </section>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--ember-border-subtle)' }}>
        <Link
          href="/signout"
          className="text-sm opacity-70 hover:opacity-100"
          style={{ color: 'var(--ember-text-low)', ...baseStyle }}
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}
