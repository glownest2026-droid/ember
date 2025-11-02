// web/src/app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/app';
  const origin = url.origin;

  if (code) {
    const supabase = createClient();
    // Exchange the code for a session (sets cookies)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // If it fails, go to /signin with an error message
      url.pathname = '/signin';
      url.searchParams.set('error', error.message);
      return NextResponse.redirect(url);
    }
  }

  // Success or no code: continue to target (default /app)
  return NextResponse.redirect(`${origin}${next}`);
}
