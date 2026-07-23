import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";
import { parsePositiveInt } from "@/lib/marketplace/ai-listing-gemini-config";

const DEFAULT_AT_HOME_TEXT_DAILY_LIMIT = 30;
const ROLLING_WINDOW_MS = 24 * 60 * 60 * 1000;

export function getAtHomeTextClassifyLimitWindowStart(): string {
  return new Date(Date.now() - ROLLING_WINDOW_MS).toISOString();
}

export async function resolveAtHomeTextClassifyDailyLimit(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null }
): Promise<number> {
  const configuredLimit = parsePositiveInt(
    process.env.AT_HOME_AI_DAILY_LIMIT,
    DEFAULT_AT_HOME_TEXT_DAILY_LIMIT
  );
  let isAdminUser = isAdminEmail(user.email);

  if (!isAdminUser) {
    const { data: adminRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    isAdminUser = Boolean(adminRole?.role === "admin");
  }

  if (!isAdminUser) return configuredLimit;
  return Math.max(configuredLimit, configuredLimit * 5);
}

export async function countAtHomeTextClassifyEventsLast24h(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const limitWindowStart = getAtHomeTextClassifyLimitWindowStart();
  const { count, error } = await supabase
    .from("ai_listing_analysis_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", limitWindowStart)
    .eq("vision_features_used->>mode", "at_home_text_classify");

  if (error) return 0;
  return count ?? 0;
}

export function atHomeTextClassifyLimitReachedMessage(): string {
  return "You’ve reached today’s limit for Ember name checks. You can still add the item anyway.";
}
