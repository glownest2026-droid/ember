import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeminiTokenUsage } from "./ai-listing-analysis";
import type { GeminiModelAttemptMeta } from "./ai-listing-gemini-fallback";
import { geminiAttemptMetaForVisionFeatures } from "./ai-listing-gemini-fallback";

export async function logListingDetailsGenerationEvent(
  supabase: SupabaseClient,
  args: {
    userId: string;
    draftId: string;
    modelUsed: string;
    tokenUsage: GeminiTokenUsage | null;
    success: boolean;
    errorMessage: string | null;
    debugId: string;
    providerStatus: number | null;
    providerCode: string | null;
    geminiAttempt?: GeminiModelAttemptMeta | null;
  }
) {
  await supabase.from("ai_listing_analysis_events").insert({
    user_id: args.userId,
    draft_id: args.draftId,
    model_used: args.modelUsed,
    input_image_path: null,
    token_usage: args.tokenUsage,
    vision_features_used: {
      mode: "listing_details_generation",
      event_source: "user_generate_details",
      counts_toward_image_daily_limit: false,
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
