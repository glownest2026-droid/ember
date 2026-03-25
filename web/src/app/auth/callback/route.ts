// Auth callback: exchange code for session and SET cookies on the response (route handler only).
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/route-handler';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/discover';
  const origin = url.origin;

  // Build redirect response first so we can set cookies on it
  const redirectUrl = `${origin}${next}`;
  const response = NextResponse.redirect(redirectUrl);

  if (code) {
    const supabase = createClient(request, response);
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
