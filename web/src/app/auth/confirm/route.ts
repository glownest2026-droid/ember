// Auth confirm: verify OTP/token and SET cookies on the response (route handler only).
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/route-handler';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  let next = url.searchParams.get('next') ?? (type === 'recovery' ? '/reset-password' : '/discover');
  const origin = url.origin;

  if (!next.startsWith('/')) {
    next = '/discover';
  }

  if (!tokenHash || !type) {
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'Missing token or type parameter');
    return NextResponse.redirect(errorUrl);
  }

  const redirectUrl = `${origin}${next}`;
  const response = NextResponse.redirect(redirectUrl);

  try {
    const supabase = createClient(request, response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.auth.verifyOtp({ type: type as any, token_hash: tokenHash });

    if (error) {
      const errorUrl = new URL('/auth/error', origin);
      errorUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(errorUrl);
    }

    return response;
  } catch {
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'Verification failed');
    return NextResponse.redirect(errorUrl);
  }
}
