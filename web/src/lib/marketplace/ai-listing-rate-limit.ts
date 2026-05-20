import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminEmail } from "@/lib/admin";
import { isPreviewOrDevelopment, parsePositiveInt } from "./ai-listing-gemini-config";

const DEFAULT_IMAGE_ANALYSIS_DAILY_LIMIT = 5;
const ROLLING_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ImageAnalysisUsageSnapshot = {
  imageAnalysisLimit: number;
  imageAnalysisUsedLast24h: number;
  imageAnalysisRemaining: number;
  limitWindowStart: string;
};

export async function resolveImageAnalysisDailyLimit(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null }
): Promise<number> {
  const configuredLimit = parsePositiveInt(
    process.env.AI_LISTING_DAILY_LIMIT,
    DEFAULT_IMAGE_ANALYSIS_DAILY_LIMIT
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

export function getImageAnalysisLimitWindowStart(): string {
  return new Date(Date.now() - ROLLING_WINDOW_MS).toISOString();
}

/** Counts only user image-analysis attempts (excludes diagnostics, PR4 details generation). */
export async function countImageAnalysisEventsLast24h(
  supabase: SupabaseClient,
  userId: string
): Promise<{ count: number; limitWindowStart: string; error: string | null }> {
  const limitWindowStart = getImageAnalysisLimitWindowStart();
  const { count, error } = await supabase
    .from("ai_listing_analysis_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", limitWindowStart)
    .not("vision_features_used->>mode", "eq", "listing_details_generation")
    .not("vision_features_used->>event_source", "eq", "diagnostic_ai_analysis");

  if (error) {
    return { count: 0, limitWindowStart, error: error.message };
  }
  return { count: count ?? 0, limitWindowStart, error: null };
}

export async function getImageAnalysisUsageSnapshot(
  supabase: SupabaseClient,
  user: { id: string; email?: string | null }
): Promise<ImageAnalysisUsageSnapshot & { countError: string | null }> {
  const imageAnalysisLimit = await resolveImageAnalysisDailyLimit(supabase, user);
  const { count, limitWindowStart, error } = await countImageAnalysisEventsLast24h(supabase, user.id);
  const imageAnalysisUsedLast24h = count;
  const imageAnalysisRemaining = Math.max(0, imageAnalysisLimit - imageAnalysisUsedLast24h);
  return {
    imageAnalysisLimit,
    imageAnalysisUsedLast24h,
    imageAnalysisRemaining,
    limitWindowStart,
    countError: error,
  };
}

export function imageAnalysisLimitReachedMessage(): string {
  const base = "You’ve reached today’s Ember test limit for image checks.";
  if (isPreviewOrDevelopment()) {
    return `${base} Ask Cursor/founder to raise AI_LISTING_DAILY_LIMIT in Vercel Preview, or wait for the 24-hour window to reset.`;
  }
  return `${base} Please wait for the 24-hour window to reset.`;
}
