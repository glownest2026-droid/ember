/**
 * Supabase server client for Route Handlers (GET/POST) where we may refresh session
 * cookies on the response. Do NOT use in Server Components — use server.ts there.
 *
 * Next.js 16 does not allow NextResponse.next() inside route handlers.
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export function createClient(request: NextRequest) {
  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) => cookiesToSet.push(cookie));
        },
      },
    }
  );

  function json<T>(body: T, init?: ResponseInit): NextResponse {
    const response = NextResponse.json(body, init);
    for (const { name, value, options } of cookiesToSet) {
      response.cookies.set(name, value, options);
    }
    return response;
  }

  return { supabase, json };
}

/** For redirect-style route handlers that mutate a prepared NextResponse (e.g. auth callback). */
export function bindSupabaseToResponse(request: NextRequest, response: NextResponse) {
  return createServerClient(
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
          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );
}
