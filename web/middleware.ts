// web/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

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

  // refresh session cookies on every request
  await supabase.auth.getUser();

  // do not gate the callback
  if (pathname.startsWith('/auth/callback')) return response;

  // only gate /app/*
  if (pathname.startsWith('/app')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return response;
}

export const config = { matcher: ['/app/:path*', '/auth/callback'] };
