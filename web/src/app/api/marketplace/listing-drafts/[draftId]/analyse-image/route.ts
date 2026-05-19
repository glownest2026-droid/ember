import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
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
  parsePositiveInt,
} from "@/lib/marketplace/ai-listing-gemini-config";
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

async function resolveDailyLimit(
  supabase: ReturnType<typeof createClient>,
  user: { id: string; email?: string | null }
): Promise<number> {
  const configuredLimit = parsePositiveInt(process.env.AI_LISTING_DAILY_LIMIT, DEFAULT_DAILY_LIMIT);
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
  const response = NextResponse.next();
  const supabase = createClient(request, response);
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
      return NextResponse.json(
        buildErrorPayload("Please sign in to analyse this draft photo.", "unauthorized", debugId, false),
        { status: 401 }
      );
    }

    const { draftId } = await params;
    if (!draftId) {
      return NextResponse.json(
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
      return NextResponse.json(
        buildErrorPayload(draftError.message, "draft_lookup_failed", debugId, true),
        { status: 500 }
      );
    }
    if (!draft) {
      return NextResponse.json(
        buildErrorPayload("Draft not found.", "draft_not_found", debugId, false),
        { status: 404 }
      );
    }
    if (!ALLOWED_DRAFT_STATUSES.has(String(draft.status ?? ""))) {
      return NextResponse.json(
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
      return NextResponse.json(
        buildErrorPayload(
          "Please upload a photo before requesting suggestions.",
          "draft_missing_image",
          debugId,
          false
        ),
        { status: 400 }
      );
    }

    const dailyLimit = await resolveDailyLimit(supabase, { id: user.id, email: user.email });
    const cutoffIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("ai_listing_analysis_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", cutoffIso);

    if (countError) {
      return NextResponse.json(
        buildErrorPayload(countError.message, "rate_count_failed", debugId, true),
        { status: 500 }
      );
    }
    if ((count ?? 0) >= dailyLimit) {
      return NextResponse.json(
        buildErrorPayload(
          "You’ve reached today’s Ember test limit for image checks.",
          "ember_daily_limit_reached",
          debugId,
          true
        ),
        { status: 429 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    if (!geminiApiKey) {
      return NextResponse.json(
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
      return NextResponse.json(
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
          ai_detected_label: aiResult.analysis.detected_item_label,
          ai_confidence: topConfidence,
          ai_raw_response_json: {
            provider: "gemini",
            model: aiResult.modelUsed,
            analysed_at: new Date().toISOString(),
            analysis: aiResult.analysis,
            canonical_candidates: canonicalCandidates,
            raw_json_text: aiResult.rawText,
          },
        })
        .eq("id", draftId)
        .eq("user_id", user.id);

      if (draftUpdateError) {
        return NextResponse.json(
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
      });

      return NextResponse.json(
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
            used_last_24h: (count ?? 0) + 1,
            limit: dailyLimit,
          },
          debug_id: debugId,
          elapsed_ms: Date.now() - startedAt,
        },
        { status: 200, headers: response.headers }
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

      await logListingAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath,
        modelUsed,
        tokenUsage,
        success: false,
        errorMessage: providerMessage.slice(0, 500),
        candidateCount: 0,
        debugId,
        providerStatus: providerDetails.providerStatus,
        providerCode: providerDetails.providerCode,
      });

      if (error instanceof GeminiParseError) {
        return NextResponse.json(
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
        return NextResponse.json(
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

      return NextResponse.json(
        buildErrorPayload("Image suggestion failed. Please try again.", "analysis_failed", debugId, true),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`[analyse-image:${debugId}] unexpected_route_error`, error);
    return NextResponse.json(
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
