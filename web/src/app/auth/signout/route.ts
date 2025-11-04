// web/src/app/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  // Redirect back to site root in the same origin (preview/prod safe)
  return NextResponse.redirect(new URL('/', request.url));
}
