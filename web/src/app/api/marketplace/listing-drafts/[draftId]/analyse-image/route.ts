import { NextRequest } from "next/server";
import {
  analyseListingImageWithGemini,
  type GeminiTokenUsage,
  GeminiParseError,
  GeminiProviderError,
} from "@/lib/marketplace/ai-listing-analysis";
import { logListingAnalysisEvent } from "@/lib/marketplace/ai-listing-analysis-events";
import {
  buildCanonicalCandidates,
  type CanonicalCandidateCard,
} from "@/lib/marketplace/ai-listing-canonical-candidates";
import { downloadOwnedDraftImage } from "@/lib/marketplace/ai-listing-draft-image";
import {
  classifyGeminiProviderError,
  extractProviderDetails,
  getAiListingEnvironment,
} from "@/lib/marketplace/ai-listing-gemini-config";
import {
  countImageAnalysisEventsLast24h,
  imageAnalysisLimitReachedMessage,
  resolveImageAnalysisDailyLimit,
} from "@/lib/marketplace/ai-listing-rate-limit";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_DRAFT_STATUSES = new Set(["draft", "confirmed"]);
const DEFAULT_DAILY_LIMIT = 5;

type ApiErrorPayload = {
  error: string;
  error_code: string;
  debug_id: string;
  retryable: boolean;
  provider_status?: number | null;
  provider_code?: string | null;
};

function buildErrorPayload(
  message: string,
  code: string,
  debugId: string,
  retryable: boolean,
  providerStatus?: number | null,
  providerCode?: string | null
): ApiErrorPayload {
  return {
    error: message,
    error_code: code,
    debug_id: debugId,
    retryable,
    provider_status: providerStatus ?? null,
    provider_code: providerCode ?? null,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const debugId = crypto.randomUUID();
  const startedAt = Date.now();
  const environment = getAiListingEnvironment();
  const modelUsed = environment.effectiveModel;
  const timeoutMs = environment.timeoutMs;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return json(
        buildErrorPayload("Please sign in to analyse this draft photo.", "unauthorized", debugId, false),
        { status: 401 }
      );
    }

    const { draftId } = await params;
    if (!draftId) {
      return json(
        buildErrorPayload("Draft id is required.", "invalid_draft_id", debugId, false),
        { status: 400 }
      );
    }

    const { data: draft, error: draftError } = await supabase
      .from("marketplace_listing_drafts")
      .select("id, user_id, status, image_storage_path")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (draftError) {
      return json(
        buildErrorPayload(draftError.message, "draft_lookup_failed", debugId, true),
        { status: 500 }
      );
    }
    if (!draft) {
      return json(
        buildErrorPayload("Draft not found.", "draft_not_found", debugId, false),
        { status: 404 }
      );
    }
    if (!ALLOWED_DRAFT_STATUSES.has(String(draft.status ?? ""))) {
      return json(
        buildErrorPayload(
          "This draft cannot be analysed in its current status.",
          "draft_status_blocked",
          debugId,
          false
        ),
        { status: 400 }
      );
    }

    const imagePath = String(draft.image_storage_path ?? "").trim();
    if (!imagePath) {
      return json(
        buildErrorPayload(
          "Please upload a photo before requesting suggestions.",
          "draft_missing_image",
          debugId,
          false
        ),
        { status: 400 }
      );
    }

    const dailyLimit = await resolveImageAnalysisDailyLimit(supabase, {
      id: user.id,
      email: user.email,
    });
    const {
      count: usedLast24h,
      error: countError,
    } = await countImageAnalysisEventsLast24h(supabase, user.id);

    if (countError) {
      return json(
        buildErrorPayload(countError, "rate_count_failed", debugId, true),
        { status: 500 }
      );
    }
    if (usedLast24h >= dailyLimit) {
      return json(
        buildErrorPayload(
          imageAnalysisLimitReachedMessage(),
          "ember_daily_limit_reached",
          debugId,
          true
        ),
        { status: 429 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    if (!geminiApiKey) {
      return json(
        buildErrorPayload(
          "Image checking is not configured for this preview.",
          "gemini_not_configured",
          debugId,
          false
        ),
        { status: 500 }
      );
    }

    console.info(
      `[analyse-image:${debugId}] model_effective=${modelUsed} daily_limit=${dailyLimit} timeout_ms=${timeoutMs} draft_id=${draftId}`
    );

    const downloadResult = await downloadOwnedDraftImage({
      supabase,
      userId: user.id,
      imagePath,
    });
    if (!downloadResult.ok) {
      return json(
        buildErrorPayload(downloadResult.message, downloadResult.code, debugId, true),
        { status: downloadResult.code === "draft_path_forbidden" ? 403 : 500 }
      );
    }

    const image = downloadResult.image;
    console.info(`[analyse-image:${debugId}] storage_bytes=${image.bytes} mime=${image.mimeType}`);

    let tokenUsage: GeminiTokenUsage | null = null;
    try {
      const aiResult = await analyseListingImageWithGemini({
        apiKey: geminiApiKey,
        model: modelUsed,
        imageBase64: image.base64,
        mimeType: image.mimeType,
        timeoutMs,
      });

      tokenUsage = aiResult.tokenUsage;
      const canonicalCandidates: CanonicalCandidateCard[] = await buildCanonicalCandidates(
        supabase,
        aiResult.analysis
      );
      const topConfidence = aiResult.analysis.product_type_candidates[0]?.confidence ?? 0;

      const { error: draftUpdateError } = await supabase
        .from("marketplace_listing_drafts")
        .update({
          product_type_id: null,
          status: "draft",
          title_draft: null,
          description_draft: null,
          condition_confirmed_by_user: null,
          listing_draft_details_json: null,
          listing_details_generated_at: null,
          ai_detected_label: aiResult.analysis.detected_item_label,
          ai_confidence: topConfidence,
          ai_raw_response_json: {
            provider: "gemini",
            model: aiResult.modelUsed,
            analysed_at: new Date().toISOString(),
            analysis: aiResult.analysis,
            canonical_candidates: canonicalCandidates,
            user_facing_item_label: aiResult.analysis.user_facing_item_label,
            canonical_review_summary: canonicalCandidates[0]
              ? {
                  suggested_ai_label: canonicalCandidates[0].suggested_ai_label,
                  user_facing_item_label: canonicalCandidates[0].user_facing_item_label,
                  nearest_canonical_match: canonicalCandidates[0].internal_nearest_canonical,
                  match_confidence: canonicalCandidates[0].confidence_bucket,
                  canonical_review_note: canonicalCandidates[0].canonical_review_note,
                  catalog_match_weak: canonicalCandidates[0].catalog_match_weak,
                }
              : null,
            raw_json_text: aiResult.rawText,
          },
        })
        .eq("id", draftId)
        .eq("user_id", user.id);

      if (draftUpdateError) {
        return json(
          buildErrorPayload(draftUpdateError.message, "draft_update_failed", debugId, true),
          { status: 500 }
        );
      }

      await logListingAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath: image.path,
        modelUsed: aiResult.modelUsed,
        tokenUsage,
        success: true,
        errorMessage: null,
        candidateCount: canonicalCandidates.length,
        debugId,
        providerStatus: null,
        providerCode: null,
        geminiAttempt: aiResult.geminiAttempt,
        eventSource: "user_analyse_image",
        countsTowardImageDailyLimit: true,
      });

      return json(
        {
          draft_id: draftId,
          detected_item_label: aiResult.analysis.detected_item_label,
          confidence_bucket: aiResult.analysis.confidence_bucket,
          candidate_cards: canonicalCandidates,
          missing_parts_questions: aiResult.analysis.missing_parts_questions,
          safety_warnings: aiResult.analysis.safety_warnings,
          low_confidence_message:
            aiResult.analysis.confidence_bucket === "low"
              ? "We’re not sure from this photo. Try another angle or choose a category manually."
              : null,
          rate_limit: {
            used_last_24h: usedLast24h + 1,
            limit: dailyLimit,
          },
          debug_id: debugId,
          elapsed_ms: Date.now() - startedAt,
        },
        { status: 200 }
      );
    } catch (error) {
      const providerMessage = error instanceof Error ? error.message : "Unknown analysis error";
      const providerDetails =
        error instanceof GeminiProviderError
          ? {
              providerStatus: error.providerStatus,
              providerCode: error.providerCode,
            }
          : extractProviderDetails(error);

      console.error(
        `[analyse-image:${debugId}] failure_stage=${
          error instanceof GeminiParseError ? "json_parse" : "gemini_request"
        } provider_status=${providerDetails.providerStatus} provider_code=${providerDetails.providerCode}`
      );

      const geminiAttempt =
        error instanceof GeminiProviderError ? error.geminiAttempt : null;
      await logListingAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath,
        modelUsed: geminiAttempt?.modelUsed ?? modelUsed,
        tokenUsage,
        success: false,
        errorMessage: providerMessage.slice(0, 500),
        candidateCount: 0,
        debugId,
        providerStatus: providerDetails.providerStatus,
        providerCode: providerDetails.providerCode,
        geminiAttempt,
        eventSource: "user_analyse_image",
        countsTowardImageDailyLimit: true,
      });

      if (error instanceof GeminiParseError) {
        return json(
          buildErrorPayload(
            "Ember received a response but could not read it cleanly.",
            "gemini_parse_failed",
            debugId,
            true
          ),
          { status: 502 }
        );
      }

      if (error instanceof GeminiProviderError) {
        const classified = classifyGeminiProviderError(
          {
            providerStatus: providerDetails.providerStatus,
            providerCode: providerDetails.providerCode,
            providerMessageSafe: extractProviderDetails(error).providerMessageSafe,
          },
          providerMessage
        );
        return json(
          buildErrorPayload(
            classified.message,
            classified.errorCode,
            debugId,
            classified.retryable,
            classified.providerStatus,
            classified.providerCode
          ),
          { status: classified.httpStatus }
        );
      }

      return json(
        buildErrorPayload("Image suggestion failed. Please try again.", "analysis_failed", debugId, true),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`[analyse-image:${debugId}] unexpected_route_error`, error);
    return json(
      buildErrorPayload(
        "Image suggestion request failed before completion. Please try again.",
        "route_unexpected_failure",
        debugId,
        true
      ),
      { status: 500 }
    );
  }
}
