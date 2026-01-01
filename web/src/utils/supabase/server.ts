// Server client using cookies from App Router (Next 16: cookies() is async)
// READ-ONLY: This client does NOT mutate cookies (middleware handles that)
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // All three handlers are async because cookies() returns a Promise in Next 16
        get: async (name: string) => {
          const store = await cookies();
          return store.get(name)?.value;
        },
        // READ-ONLY: No-op setters to prevent cookie mutation in server components
        // Middleware is responsible for cookie refresh/cleanup
        set: async (_name: string, _value: string, _options: CookieOptions) => {
          // No-op: cookies can only be modified in middleware or route handlers
        },
        remove: async (_name: string, _options: CookieOptions) => {
          // No-op: cookies can only be modified in middleware or route handlers
        },
      },
    }
  );
}
