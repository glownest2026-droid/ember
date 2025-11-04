// web/src/app/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  // Use 303 so the browser follows with GET (not POST) to "/"
  return NextResponse.redirect(new URL('/', request.url), 303);
}
