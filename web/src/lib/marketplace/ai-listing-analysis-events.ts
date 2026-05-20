import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeminiTokenUsage } from "./ai-listing-analysis";

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
  }
) {
  await supabase.from("ai_listing_analysis_events").insert({
    user_id: args.userId,
    draft_id: args.draftId,
    model_used: args.modelUsed,
    input_image_path: args.imagePath,
    token_usage: args.tokenUsage,
    vision_features_used: {
      mode: "single-image-classification",
      candidate_count: args.candidateCount,
      debug_id: args.debugId,
      provider_status: args.providerStatus,
      provider_code: args.providerCode,
    },
    cost_estimate: null,
    success: args.success,
    error_message: args.errorMessage,
  });
}
