import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeminiTokenUsage } from "./ai-listing-analysis";
import type { GeminiModelAttemptMeta } from "./ai-listing-gemini-fallback";
import { geminiAttemptMetaForVisionFeatures } from "./ai-listing-gemini-fallback";

export type ListingAnalysisEventSource = "user_analyse_image" | "diagnostic_ai_analysis";

export async function logListingAnalysisEvent(
  supabase: SupabaseClient,
  args: {
    userId: string;
    draftId: string;
    imagePath: string;
    modelUsed: string;
    tokenUsage: GeminiTokenUsage | null;
    success: boolean;
    errorMessage: string | null;
    candidateCount: number;
    debugId: string;
    providerStatus: number | null;
    providerCode: string | null;
    geminiAttempt?: GeminiModelAttemptMeta | null;
    eventSource?: ListingAnalysisEventSource;
    countsTowardImageDailyLimit?: boolean;
  }
) {
  const eventSource = args.eventSource ?? "user_analyse_image";
  const countsTowardImageDailyLimit =
    args.countsTowardImageDailyLimit ?? eventSource === "user_analyse_image";

  await supabase.from("ai_listing_analysis_events").insert({
    user_id: args.userId,
    draft_id: args.draftId,
    model_used: args.modelUsed,
    input_image_path: args.imagePath,
    token_usage: args.tokenUsage,
    vision_features_used: {
      mode: "single-image-classification",
      event_source: eventSource,
      counts_toward_image_daily_limit: countsTowardImageDailyLimit,
      candidate_count: args.candidateCount,
      debug_id: args.debugId,
      provider_status: args.providerStatus,
      provider_code: args.providerCode,
      ...(args.geminiAttempt ? geminiAttemptMetaForVisionFeatures(args.geminiAttempt) : {}),
    },
    cost_estimate: null,
    success: args.success,
    error_message: args.errorMessage,
  });
}
