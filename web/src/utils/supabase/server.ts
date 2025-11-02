// Server client using cookies from App Router (Next 16: cookies() is async)
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
        set: async (name: string, value: string, options: CookieOptions) => {
          const store = await cookies();
          store.set({ name, value, ...options });
        },
        remove: async (name: string, options: CookieOptions) => {
          const store = await cookies();
          store.set({ name, value: '', ...options, expires: new Date(0) });
        },
      },
    }
  );
}
