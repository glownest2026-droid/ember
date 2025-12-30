'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'An authentication error occurred';

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Authentication Error</h1>
      <p className="text-sm mb-4 text-red-600">{error}</p>
      <p className="text-sm mb-4">
        The authentication link may be invalid or expired. Please try again.
      </p>
      <div className="space-y-2">
        <p className="text-sm">
          <Link href="/signin" className="underline">Back to sign in</Link>
        </p>
        <p className="text-sm">
          <Link href="/forgot-password" className="underline">Request password reset</Link>
        </p>
      </div>
    </div>
  );
}

