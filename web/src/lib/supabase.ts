// web/src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Create the browser Supabase client lazily.
 * We only call this inside client components / event handlers,
 * so build/SSR never tries to construct it without env vars.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // During build/SSR or misconfigured envs, return null.
    return null;
  }
  return createClient(url, key);
}
