// Auth callback: exchange code for session and SET cookies on the response (route handler only).
import { NextRequest, NextResponse } from 'next/server';
import { bindSupabaseToResponse } from '../../../utils/supabase/route-handler';
import {
  getProductionAuthOrigin,
  safeNextPath,
  shouldRedirectAuthToWww,
} from '../../../lib/auth-callback-url';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  // One-hop apex → www only. Do NOT redirect www → apex (Vercel apex→www causes infinite loop).
  if (shouldRedirectAuthToWww(url.origin)) {
    const wwwCallback = new URL(url.pathname + url.search, getProductionAuthOrigin(url.origin));
    return NextResponse.redirect(wwwCallback);
  }

  const authOrigin = getProductionAuthOrigin(url.origin);
  const code = url.searchParams.get('code');
  const next = safeNextPath(url.searchParams.get('next'));

  const redirectUrl = `${authOrigin}${next}`;
  const response = NextResponse.redirect(redirectUrl);

  if (code) {
    const supabase = bindSupabaseToResponse(request, response);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const signInUrl = new URL('/signin', authOrigin);
      signInUrl.searchParams.set('error', error.message);
      signInUrl.searchParams.set('next', next);
      return NextResponse.redirect(signInUrl);
    }

    if (!next.startsWith('/reset-password')) {
      response.cookies.set('ember_ph_signin_completed', '1', {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      });
    }
  }

  return response;
}
