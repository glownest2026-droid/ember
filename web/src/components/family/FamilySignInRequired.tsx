'use client';

import Link from 'next/link';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

/** Shown when user is not signed in. Single CTA using existing auth pattern (link to signin with returnTo). */
export function FamilySignInRequired() {
  return (
    <div className="max-w-lg">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ ...baseStyle, color: 'var(--ember-text-high)' }}
      >
        Manage My Family
      </h1>
      <p
        className="text-sm mb-4"
        style={{ color: 'var(--ember-text-low)', ...baseStyle }}
      >
        Sign in to manage your family and see your saved ideas in one place.
      </p>
      <Link
        href="/signin?next=/family"
        className="inline-block min-h-[44px] px-4 py-2 rounded-lg font-medium text-sm text-white"
        style={{
          backgroundColor: 'var(--ember-accent-base)',
          ...baseStyle,
        }}
      >
        Sign in
      </Link>
      <p className="text-sm mt-4" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
        Or{' '}
        <Link href="/discover?returnTo=/family" className="underline">
          browse Discover
        </Link>{' '}
        and come back after signing in.
      </p>
    </div>
  );
}
