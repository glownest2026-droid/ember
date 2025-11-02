// web/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Create a Supabase client bound to request/response cookies (edge-safe)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options, expires: new Date(0) });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Always refresh session cookies as users navigate
  await supabase.auth.getUser();

  // Allow the callback to proceed without gating
  if (pathname.startsWith('/auth/callback')) return response;

  // Gate the private app
  if (pathname.startsWith('/app')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      const url = new URL('/signin', request.url);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// Only run middleware on /app/* and /auth/callback (skip static assets)
export const config = {
  matcher: ['/app/:path*', '/auth/callback'],
};
