// web/src/app/verify/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';

export default function VerifyPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email', // 6-digit code from the email
    });
    if (error) {
      setError(error.message);
      return;
    }

    // PostHog FOUNDATION: sign-in completed after successful OTP verification.
    try {
      const { data } = await supabase.auth.getUser();
      if (data.user?.id) {
        trackEvent(EVENTS.SIGN_IN_COMPLETED, {
          user_id: data.user.id,
          auth_method: 'otp',
          result: 'success',
        });
      }
    } catch {
      // Fail closed: never block login UX.
    }

    router.push('/app');
  }

  return (
    <div className="container-wrap">
      <h1 className="text-2xl font-semibold mb-4">Enter your code</h1>
      <form onSubmit={handleVerify} className="card p-4 space-y-3 max-w-md">
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
          <span className="block text-sm font-medium mb-1">6-digit code</span>
          <input
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary" type="submit">Verify & sign in</button>
      </form>
    </div>
  );
}
