// Auth confirm: verify OTP/token and SET cookies on the response (route handler only).
import { NextRequest, NextResponse } from 'next/server';
import { bindSupabaseToResponse } from '../../../utils/supabase/route-handler';
import { normalizeAuthOrigin, safeNextPath } from '../../../lib/auth-callback-url';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const canonicalOrigin = normalizeAuthOrigin(url.origin);

  if (canonicalOrigin !== url.origin) {
    const canonicalConfirm = new URL(url.pathname + url.search, canonicalOrigin);
    return NextResponse.redirect(canonicalConfirm);
  }

  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next =
    type === 'recovery'
      ? '/reset-password'
      : safeNextPath(url.searchParams.get('next'));

  if (!tokenHash || !type) {
    const errorUrl = new URL('/auth/error', canonicalOrigin);
    errorUrl.searchParams.set('error', 'Missing token or type parameter');
    return NextResponse.redirect(errorUrl);
  }

  const redirectUrl = `${canonicalOrigin}${next}`;
  const response = NextResponse.redirect(redirectUrl);

  try {
    const supabase = bindSupabaseToResponse(request, response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.auth.verifyOtp({ type: type as any, token_hash: tokenHash });

    if (error) {
      const errorUrl = new URL('/auth/error', canonicalOrigin);
      errorUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(errorUrl);
    }

    // PostHog FOUNDATION: successful OTP verification. Skip recovery flows
    // (which redirect to `/reset-password`) to avoid false sign-in completion.
    if (type !== 'recovery') {
      response.cookies.set('ember_ph_signin_completed', '1', {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  } catch {
    const errorUrl = new URL('/auth/error', canonicalOrigin);
    errorUrl.searchParams.set('error', 'Verification failed');
    return NextResponse.redirect(errorUrl);
  }
}
