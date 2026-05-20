import { NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { logListingDetailsGenerationEvent } from "@/lib/marketplace/ai-listing-details-events";
import {
  classifyDetailsProviderError,
  GeminiDetailsConfigError,
  GeminiDetailsParseError,
  GeminiDetailsProviderError,
  generateListingDetailsWithGemini,
} from "@/lib/marketplace/ai-listing-details-generation";
import { buildListingDetailsGenerationPrompt } from "@/lib/marketplace/ai-listing-details-prompt";
import type { Pr3AiRawResponse } from "@/lib/marketplace/ai-listing-details-types";
import {
  getAiListingEnvironment,
  parsePositiveInt,
} from "@/lib/marketplace/ai-listing-gemini-config";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const DEFAULT_DETAILS_DAILY_LIMIT = 10;

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

async function resolveDetailsDailyLimit(
  supabase: ReturnType<typeof createClient>["supabase"],
  user: { id: string; email?: string | null }
): Promise<number> {
  const configuredLimit = parsePositiveInt(
    process.env.AI_LISTING_DETAILS_DAILY_LIMIT,
    DEFAULT_DETAILS_DAILY_LIMIT
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

function hasConfirmedItemType(draft: {
  product_type_id: string | null;
  status: string;
}): boolean {
  return Boolean(draft.product_type_id) && draft.status === "confirmed";
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const debugId = crypto.randomUUID();
  const environment = getAiListingEnvironment();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return json(
        buildErrorPayload("Please sign in to draft listing details.", "unauthorized", debugId, false),
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
      .select(
        "id, user_id, status, product_type_id, ai_detected_label, ai_raw_response_json, image_storage_path"
      )
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

    if (!hasConfirmedItemType(draft)) {
      return json(
        buildErrorPayload(
          "Confirm the item type before drafting listing details.",
          "item_not_confirmed",
          debugId,
          false
        ),
        { status: 400 }
      );
    }

    const dailyLimit = await resolveDetailsDailyLimit(supabase, user);
    const cutoffIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("ai_listing_analysis_events")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", cutoffIso)
      .contains("vision_features_used", { mode: "listing_details_generation" });

    if (countError) {
      return json(
        buildErrorPayload(countError.message, "rate_count_failed", debugId, true),
        { status: 500 }
      );
    }
    if ((count ?? 0) >= dailyLimit) {
      return json(
        buildErrorPayload(
          "You’ve reached today’s Ember test limit for listing drafts.",
          "ember_listing_details_daily_limit_reached",
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

    const { data: productType } = await supabase
      .from("product_types")
      .select("id, label, subtitle")
      .eq("id", draft.product_type_id)
      .maybeSingle();

    const pr3Raw = (draft.ai_raw_response_json ?? null) as Pr3AiRawResponse | null;
    const confirmedItemLabel =
      productType?.label?.trim() ||
      pr3Raw?.analysis?.detected_item_label?.trim() ||
      draft.ai_detected_label?.trim() ||
      "Confirmed item";
    const categoryLabel =
      productType?.subtitle?.trim() ||
      pr3Raw?.analysis?.broad_category?.trim() ||
      "General";

    const prompt = buildListingDetailsGenerationPrompt({
      confirmedItemLabel,
      categoryLabel,
      productTypeSubtitle: productType?.subtitle ?? null,
      pr3Analysis: pr3Raw,
    });

    console.info(
      `[generate-details:${debugId}] model_effective=${environment.effectiveModel} draft_id=${draftId}`
    );

    try {
      const generated = await generateListingDetailsWithGemini({
        apiKey: geminiApiKey,
        model: environment.effectiveModel,
        timeoutMs: environment.timeoutMs,
        prompt,
      });

      const generatedAt = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("marketplace_listing_drafts")
        .update({
          title_draft: generated.details.suggested_title,
          description_draft: generated.details.suggested_description,
          condition_suggestion: generated.details.condition_suggestion,
          listing_draft_details_json: generated.details,
          listing_details_generated_at: generatedAt,
        })
        .eq("id", draftId)
        .eq("user_id", user.id);

      if (updateError) {
        return json(
          buildErrorPayload(updateError.message, "draft_update_failed", debugId, true),
          { status: 500 }
        );
      }

      await logListingDetailsGenerationEvent(supabase, {
        userId: user.id,
        draftId,
        modelUsed: generated.modelUsed,
        tokenUsage: generated.tokenUsage,
        success: true,
        errorMessage: null,
        debugId,
        providerStatus: null,
        providerCode: null,
      });

      return json(
        {
          draft_id: draftId,
          details: generated.details,
          title_draft: generated.details.suggested_title,
          description_draft: generated.details.suggested_description,
          condition_suggestion: generated.details.condition_suggestion,
          listing_details_generated_at: generatedAt,
          restricted_or_blocked: generated.details.restricted_or_blocked,
          rate_limit: {
            used_last_24h: (count ?? 0) + 1,
            limit: dailyLimit,
          },
          debug_id: debugId,
        },
        { status: 200 }
      );
    } catch (error) {
      const providerMessage = error instanceof Error ? error.message : "Generation failed.";
      const providerStatus =
        error instanceof GeminiDetailsProviderError ? error.providerStatus : null;
      const providerCode = error instanceof GeminiDetailsProviderError ? error.providerCode : null;

      await logListingDetailsGenerationEvent(supabase, {
        userId: user.id,
        draftId,
        modelUsed: environment.effectiveModel,
        tokenUsage: null,
        success: false,
        errorMessage: providerMessage.slice(0, 500),
        debugId,
        providerStatus,
        providerCode,
      });

      if (error instanceof GeminiDetailsParseError) {
        return json(
          buildErrorPayload(
            "Ember drafted something, but couldn’t read it cleanly. Please try again.",
            "gemini_details_parse_failed",
            debugId,
            true
          ),
          { status: 502 }
        );
      }

      if (error instanceof GeminiDetailsProviderError || error instanceof GeminiDetailsConfigError) {
        const classified = classifyDetailsProviderError(error);
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
        buildErrorPayload("Listing draft generation failed. Please try again.", "generation_failed", debugId, true),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`[generate-details:${debugId}] unexpected_route_error`, error);
    return json(
      buildErrorPayload(
        "Listing draft generation failed before completion. Please try again.",
        "route_unexpected_failure",
        debugId,
        true
      ),
      { status: 500 }
    );
  }
}
