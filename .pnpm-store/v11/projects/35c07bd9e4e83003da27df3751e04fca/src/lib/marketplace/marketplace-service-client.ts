import "server-only";

import { createClient as createServiceClient } from "@supabase/supabase-js";

/** Server-only Supabase client for buyer-safe published listing reads (never expose to the browser). */
export function createMarketplaceServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE?.trim();
  if (!url || !key) return null;
  return createServiceClient(url, key, { auth: { persistSession: false } });
}
