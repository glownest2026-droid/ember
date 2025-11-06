import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
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

  // Always refresh session cookies
  await supabase.auth.getUser();

  // Allow callback to proceed
  if (pathname.startsWith('/auth/callback')) return response;

  // Gate /admin/*
  if (pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/signin', request.url));
  }

  // (Your existing gate for /app/* can be added here if you like)
  return response;
}

export const config = { matcher: ['/admin/:path*', '/auth/callback'] };
