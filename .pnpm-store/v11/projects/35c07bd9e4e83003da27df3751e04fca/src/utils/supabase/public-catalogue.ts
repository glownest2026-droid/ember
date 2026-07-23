import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cookieless Supabase client for public gateway catalogue reads.
 * Safe inside unstable_cache (no cookies() / dynamic IO).
 * RLS still applies via the anon key.
 */
export function createPublicCatalogueClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
