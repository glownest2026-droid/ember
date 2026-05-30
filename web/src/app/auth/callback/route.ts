// Auth callback: exchange code for session and SET cookies on the response (route handler only).
import { NextRequest, NextResponse } from 'next/server';
import { bindSupabaseToResponse } from '../../../utils/supabase/route-handler';
import { safeNextPath } from '../../../lib/auth-callback-url';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  // Guard against post-auth loops (e.g. next=/signin): default to /discover.
  const next = safeNextPath(url.searchParams.get('next'));
  const origin = url.origin;

  // Build redirect response first so we can set cookies on it
  const redirectUrl = `${origin}${next}`;
  const response = NextResponse.redirect(redirectUrl);

  if (code) {
    const supabase = bindSupabaseToResponse(request, response);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const signInUrl = new URL('/signin', origin);
      signInUrl.searchParams.set('error', error.message);
      signInUrl.searchParams.set('next', next);
      return NextResponse.redirect(signInUrl);
    }

    // PostHog FOUNDATION: on successful session establishment, emit `sign_in_completed`.
    // We skip recovery flows (which redirect to `/reset-password`).
    if (!next.startsWith('/reset-password')) {
      response.cookies.set('ember_ph_signin_completed', '1', {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        secure: false,
      });
    }
  }

  return response;
}
