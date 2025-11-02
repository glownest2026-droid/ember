import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './src/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const { supabase, response } = await updateSession(request);

  if (url.pathname.startsWith('/app')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/signin', request.url));
  }
  return response;
}

export const config = {
  matcher: ['/app/:path*'],
};
