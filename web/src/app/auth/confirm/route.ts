// web/src/app/auth/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  // Default to /reset-password for recovery type, otherwise /app
  let next = url.searchParams.get('next') ?? (type === 'recovery' ? '/reset-password' : '/app');
  const origin = url.origin;

  // Validate next is a safe internal path (must start with /)
  if (!next.startsWith('/')) {
    next = '/app';
  }

  if (!tokenHash || !type) {
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'Missing token or type parameter');
    return NextResponse.redirect(errorUrl);
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash: tokenHash,
    });

    if (error) {
      const errorUrl = new URL('/auth/error', origin);
      errorUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(errorUrl);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    const errorUrl = new URL('/auth/error', origin);
    errorUrl.searchParams.set('error', 'Verification failed');
    return NextResponse.redirect(errorUrl);
  }
}

