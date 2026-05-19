import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import {
  analyseListingImageWithGemini,
  DEFAULT_GEMINI_MODEL,
  type GeminiListingAnalysisOutput,
  type GeminiTokenUsage,
  GeminiParseError,
  GeminiProviderError,
} from "@/lib/marketplace/ai-listing-analysis";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const RAW_LISTING_BUCKET = "marketplace-raw-listing-photos";
const ALLOWED_DRAFT_STATUSES = new Set(["draft", "confirmed"]);
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DEFAULT_DAILY_LIMIT = 5;

type ConfidenceBucket = "high" | "medium" | "low";

type ApiErrorPayload = {
  error: string;
  error_code: string;
  debug_id: string;
  retryable: boolean;
  provider_status?: number | null;
  provider_code?: string | null;
};

type CanonicalCandidateCard = {
  id: string | null;
  label: string;
  subtitle: string | null;
  reason: string;
  confidence_bucket: ConfidenceBucket;
  confidence_label: "Looks likely" | "Possible match" | "Not sure yet";
  source: "canonical_match" | "ai_suggestion";
};

function confidenceLabel(bucket: ConfidenceBucket): CanonicalCandidateCard["confidence_label"] {
  if (bucket === "high") return "Looks likely";
  if (bucket === "medium") return "Possible match";
  return "Not sure yet";
}

function confidenceFromNumber(value: number): ConfidenceBucket {
  if (value >= 0.8) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
}

function pickLowerConfidenceBucket(a: ConfidenceBucket, b: ConfidenceBucket): ConfidenceBucket {
  const rank: Record<ConfidenceBucket, number> = { low: 1, medium: 2, high: 3 };
  return rank[a] <= rank[b] ? a : b;
}

function inferMimeType(path: string, blobType: string): string {
  if (blobType && blobType.length > 0) return blobType;
  const lower = path.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

async function resolveDailyLimit(supabase: ReturnType<typeof createClient>, user: { id: string; email?: string | null }): Promise<number> {
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

async function buildCanonicalCandidates(
  supabase: ReturnType<typeof createClient>,
  analysis: GeminiListingAnalysisOutput
): Promise<CanonicalCandidateCard[]> {
  const cards: CanonicalCandidateCard[] = [];
  const seenCanonicalIds = new Set<string>();
  const seenLabels = new Set<string>();

  const aiCandidates = analysis.product_type_candidates.slice(0, 4);
  for (const aiCandidate of aiCandidates) {
    const normalizedLabel = aiCandidate.label.trim().toLowerCase();
    if (!normalizedLabel || seenLabels.has(normalizedLabel)) continue;
    seenLabels.add(normalizedLabel);

    const searchTerms = Array.from(
      new Set(
        [aiCandidate.label, aiCandidate.slug_hint.replace(/_/g, " ").trim()]
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0)
      )
    );

    let bestCanonical:
      | {
          id: string;
          label: string;
          subtitle: string | null;
          confidence_bucket: ConfidenceBucket;
        }
      | null = null;

    for (const searchTerm of searchTerms) {
      const { data } = await supabase.rpc("inventory_match_product_types", {
        query_text: searchTerm,
        p_limit: 1,
      });
      const topRow = Array.isArray(data) ? data[0] : null;
      if (!topRow?.id) continue;

      bestCanonical = {
        id: topRow.id as string,
        label: String(topRow.label ?? searchTerm),
        subtitle: topRow.subtitle ? String(topRow.subtitle) : null,
        confidence_bucket: (topRow.confidence_bucket as ConfidenceBucket) ?? "low",
      };
      break;
    }

    if (bestCanonical && !seenCanonicalIds.has(bestCanonical.id)) {
      seenCanonicalIds.add(bestCanonical.id);
      const aiBucket = confidenceFromNumber(aiCandidate.confidence);
      const mergedBucket = pickLowerConfidenceBucket(bestCanonical.confidence_bucket, aiBucket);
      cards.push({
        id: bestCanonical.id,
        label: bestCanonical.label,
        subtitle: bestCanonical.subtitle,
        reason: aiCandidate.why || "Matched against Ember canonical product types.",
        confidence_bucket: mergedBucket,
        confidence_label: confidenceLabel(mergedBucket),
        source: "canonical_match",
      });
      continue;
    }

    cards.push({
      id: null,
      label: aiCandidate.label,
      subtitle: analysis.broad_category || null,
      reason: aiCandidate.why || "Possible match from photo analysis.",
      confidence_bucket: confidenceFromNumber(aiCandidate.confidence),
      confidence_label: confidenceLabel(confidenceFromNumber(aiCandidate.confidence)),
      source: "ai_suggestion",
    });
  }

  if (cards.length === 0 && analysis.detected_item_label.trim()) {
    cards.push({
      id: null,
      label: analysis.detected_item_label.trim(),
      subtitle: analysis.broad_category || null,
      reason: "We are not yet confident about the exact catalog match.",
      confidence_bucket: analysis.confidence_bucket,
      confidence_label: confidenceLabel(analysis.confidence_bucket),
      source: "ai_suggestion",
    });
  }

  return cards.slice(0, 4);
}

async function logAnalysisEvent(
  supabase: ReturnType<typeof createClient>,
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

function extractProviderStatus(rawMessage: string): { status: number | null; code: string | null } {
  const statusMatch = rawMessage.match(/\b([45]\d{2})\b/);
  const status = statusMatch ? Number(statusMatch[1]) : null;
  const upper = rawMessage.toUpperCase();
  const codeMatch = upper.match(
    /\b(RESOURCE_EXHAUSTED|UNAVAILABLE|PERMISSION_DENIED|UNAUTHENTICATED|INVALID_ARGUMENT|DEADLINE_EXCEEDED)\b/
  );
  return {
    status: Number.isFinite(status ?? NaN) ? status : null,
    code: codeMatch ? codeMatch[1] : null,
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
    if (!imagePath.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        buildErrorPayload("Draft photo path is invalid for this user.", "draft_path_forbidden", debugId, false),
        { status: 403 }
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
    const modelUsed = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? "8000");
    console.info(
      `[analyse-image:${debugId}] model_effective=${modelUsed} daily_limit=${dailyLimit} timeout_ms=${timeoutMs}`
    );

    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from(RAW_LISTING_BUCKET)
      .download(imagePath);
    if (downloadError || !imageBlob) {
      return NextResponse.json(
        buildErrorPayload("Unable to read the draft photo.", "storage_download_failed", debugId, true),
        { status: 500 }
      );
    }

    const mimeType = inferMimeType(imagePath, imageBlob.type);
    if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        buildErrorPayload("Unsupported image format.", "image_type_unsupported", debugId, false),
        { status: 400 }
      );
    }

    const imageBytes = Buffer.from(await imageBlob.arrayBuffer());
    if (!imageBytes.length) {
      return NextResponse.json(
        buildErrorPayload("Draft photo is empty.", "image_empty", debugId, false),
        { status: 400 }
      );
    }
    if (imageBytes.length > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        buildErrorPayload("Draft photo exceeds the 10MB limit.", "image_too_large", debugId, false),
        { status: 400 }
      );
    }

    let tokenUsage: GeminiTokenUsage | null = null;
    try {
      const aiResult = await analyseListingImageWithGemini({
        apiKey: geminiApiKey,
        model: modelUsed,
        imageBase64: imageBytes.toString("base64"),
        mimeType,
        timeoutMs,
      });

      tokenUsage = aiResult.tokenUsage;
      const canonicalCandidates = await buildCanonicalCandidates(supabase, aiResult.analysis);
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

      await logAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath,
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
      const { status: providerStatus, code: providerCode } = extractProviderStatus(
        error instanceof Error ? error.message : ""
      );
      await logAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath,
        modelUsed,
        tokenUsage,
        success: false,
        errorMessage: error instanceof Error ? error.message.slice(0, 500) : "Unknown analysis error",
        candidateCount: 0,
        debugId,
        providerStatus,
        providerCode,
      });

      if (error instanceof GeminiParseError) {
        return NextResponse.json(
          buildErrorPayload(
            "We couldn’t read a reliable suggestion from this photo. Please try again.",
            "gemini_parse_failed",
            debugId,
            true
          ),
          { status: 502 }
        );
      }
      if (error instanceof GeminiProviderError) {
        const lower = (error.message || "").toLowerCase();
        const { status: providerStatusInError, code: providerCodeInError } = extractProviderStatus(
          error.message || ""
        );
        if (lower.includes("api key") || lower.includes("permission denied") || lower.includes("unauthorized")) {
          return NextResponse.json(
            buildErrorPayload(
              "Gemini credentials are invalid or not authorized for this project.",
              "gemini_auth_failed",
              debugId,
              false,
              providerStatusInError,
              providerCodeInError
            ),
            { status: 500 }
          );
        }
        if (lower.includes("model") && (lower.includes("not found") || lower.includes("unsupported"))) {
          return NextResponse.json(
            buildErrorPayload(
              "Configured Gemini model is unavailable for this project.",
              "gemini_model_unavailable",
              debugId,
              false,
              providerStatusInError,
              providerCodeInError
            ),
            { status: 500 }
          );
        }
        if (lower.includes("quota") || lower.includes("rate")) {
          return NextResponse.json(
            buildErrorPayload(
              "Gemini is rate-limiting this test project. Please wait and try again.",
              "gemini_quota_limited",
              debugId,
              true,
              providerStatusInError,
              providerCodeInError
            ),
            { status: 429 }
          );
        }
        if (providerStatusInError === 503 || lower.includes("service unavailable") || lower.includes("unavailable")) {
          return NextResponse.json(
            buildErrorPayload(
              "Gemini is temporarily unavailable. Please try again in a minute.",
              "gemini_temporarily_unavailable",
              debugId,
              true,
              providerStatusInError,
              providerCodeInError
            ),
            { status: 503 }
          );
        }
        if (lower.includes("aborted") || lower.includes("timeout")) {
          return NextResponse.json(
            buildErrorPayload(
              "Gemini request timed out. Please retry.",
              "gemini_timeout",
              debugId,
              true,
              providerStatusInError,
              providerCodeInError
            ),
            { status: 504 }
          );
        }
        return NextResponse.json(
          buildErrorPayload(
            "Gemini is temporarily unavailable. Please try again in a minute.",
            "gemini_temporarily_unavailable",
            debugId,
            true,
            providerStatusInError,
            providerCodeInError
          ),
          { status: 503 }
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
