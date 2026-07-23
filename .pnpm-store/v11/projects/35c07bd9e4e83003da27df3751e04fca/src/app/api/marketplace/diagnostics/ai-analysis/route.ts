import { NextRequest } from "next/server";
import { resolveIsAdminUser } from "@/lib/marketplace/ai-listing-admin";
import { getDiagnosticsAccessDeniedReason } from "@/lib/marketplace/ai-listing-diagnostics-access";
import {
  generateGeminiListingImageContent,
  parseGeminiListingAnalysisOutput,
  GeminiParseError,
  GeminiProviderError,
} from "@/lib/marketplace/ai-listing-analysis";
import { logListingAnalysisEvent } from "@/lib/marketplace/ai-listing-analysis-events";
import { resolveDraftLookupDiagnostic } from "@/lib/marketplace/ai-listing-draft-diagnostic";
import { buildCanonicalCandidates } from "@/lib/marketplace/ai-listing-canonical-candidates";
import { downloadOwnedDraftImage } from "@/lib/marketplace/ai-listing-draft-image";
import {
  classifyGeminiProviderError,
  extractProviderDetails,
  getAiListingEnvironment,
} from "@/lib/marketplace/ai-listing-gemini-config";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_DRAFT_STATUSES = new Set(["draft", "confirmed"]);

type DiagnosticStep = {
  name: string;
  ok: boolean | null;
  detail: string | Record<string, unknown>;
};

function step(name: string, ok: boolean | null, detail: string | Record<string, unknown>): DiagnosticStep {
  return { name, ok, detail };
}

function notReached(name: string): DiagnosticStep {
  return step(name, null, "not reached");
}

export async function GET(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const debugId = crypto.randomUUID();
  const environment = getAiListingEnvironment();
  const steps: DiagnosticStep[] = [];
  let failureStage: string | null = null;
  let safeSummary = "Diagnostic run completed.";
  const noProvider = request.nextUrl.searchParams.get("mode") === "no-provider";
  const draftId = request.nextUrl.searchParams.get("draftId")?.trim() ?? "";

  const markFailure = (stage: string, summary: string) => {
    if (!failureStage) failureStage = stage;
    safeSummary = summary;
  };

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      steps.push(step("auth", false, "not signed in"));
      markFailure("auth", "Authentication required.");
      return json(
        { ok: false, debugId, environment, draftLookup: null, steps, failureStage, safeSummary },
        { status: 401 }
      );
    }
    steps.push(step("auth", true, "signed_in"));

    const accessDenied = getDiagnosticsAccessDeniedReason({
      isAuthenticated: true,
      isAdmin: await resolveIsAdminUser(supabase, user),
    });
    if (accessDenied === "disabled") {
      markFailure("auth", "Diagnostics are not enabled in this environment.");
      return json({ error: "Not found" }, { status: 404 });
    }
    if (accessDenied === "forbidden") {
      steps.push(step("draft_lookup", false, "admin access required"));
      markFailure("draft_lookup", "Admin access required for diagnostics.");
      return json(
        { ok: false, debugId, environment, draftLookup: null, steps, failureStage, safeSummary },
        { status: 403 }
      );
    }

    if (!draftId) {
      steps.push(step("draft_lookup", false, "draftId query parameter is required"));
      markFailure("draft_lookup", "Draft id is required.");
      return json(
        { ok: false, debugId, environment, draftLookup: null, steps, failureStage, safeSummary },
        { status: 400 }
      );
    }

    const draftLookup = await resolveDraftLookupDiagnostic({
      supabase,
      draftId,
      currentUserId: user.id,
      allowServiceRoleProbe: true,
    });

    const { data: draft, error: draftError } = await supabase
      .from("marketplace_listing_drafts")
      .select("id, user_id, status, image_storage_path")
      .eq("id", draftId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (draftError) {
      steps.push(step("draft_lookup", false, draftError.message));
      markFailure("draft_lookup", "Draft lookup failed.");
      return json(
        { ok: false, debugId, environment, draftLookup, steps, failureStage, safeSummary },
        { status: 500 }
      );
    }
    if (!draft) {
      const reason = draftLookup.notFoundReason ?? "row_missing";
      steps.push(
        step("draft_lookup", false, {
          message: "draft not found for signed-in owner",
          notFoundReason: reason,
        })
      );
      markFailure(
        "draft_lookup",
        reason === "owner_mismatch"
          ? "Draft exists but belongs to a different user than the signed-in session."
          : reason === "rls_hidden"
            ? "Draft row exists for this user but owner-scoped lookup failed (check RLS/session)."
            : reason === "invalid_uuid"
              ? "Draft id is not a valid UUID."
              : "Draft not found in marketplace_listing_drafts."
      );
      return json(
        { ok: false, debugId, environment, draftLookup, steps, failureStage, safeSummary },
        { status: 404 }
      );
    }
    if (!ALLOWED_DRAFT_STATUSES.has(String(draft.status ?? ""))) {
      steps.push(step("draft_lookup", false, `draft status blocked: ${String(draft.status ?? "unknown")}`));
      markFailure("draft_lookup", "Draft status blocks analysis.");
      return json(
        { ok: false, debugId, environment, steps, failureStage, safeSummary },
        { status: 400 }
      );
    }
    steps.push(
      step("draft_lookup", true, {
        message: "draft found for signed-in owner",
        draftLookup,
      })
    );

    const imagePath = String(draft.image_storage_path ?? "").trim();
    const downloadResult = await downloadOwnedDraftImage({
      supabase,
      userId: draft.user_id,
      imagePath,
    });

    if (!downloadResult.ok) {
      steps.push(
        step("storage_download", false, {
          bucket: "marketplace-raw-listing-photos",
          pathPresent: Boolean(imagePath),
          code: downloadResult.code,
        })
      );
      markFailure("storage_download", "Storage download failed before Gemini was called.");
      steps.push(
        notReached("image_payload_prepare"),
        notReached("gemini_request"),
        notReached("gemini_response_received"),
        notReached("json_parse"),
        notReached("canonical_match"),
        notReached("draft_update"),
        step("ai_event_log", null, "not reached")
      );
      return json(
        { ok: false, debugId, environment, steps, failureStage, safeSummary },
        { status: 500 }
      );
    }

    const image = downloadResult.image;
    console.info(
      `[ai-analysis-diagnostic:${debugId}] draft_id=${draftId} storage_bytes=${image.bytes} mime=${image.mimeType}`
    );
    steps.push(
      step("storage_download", true, {
        bucket: image.bucket,
        pathPresent: true,
        bytes: image.bytes,
        mimeType: image.mimeType,
      })
    );

    steps.push(
      step("image_payload_prepare", true, {
        bytes: image.bytes,
        mimeType: image.mimeType,
        base64Length: image.base64Length,
      })
    );

    if (noProvider) {
      safeSummary = "Pre-provider checks passed. Gemini was not called.";
      steps.push(
        notReached("gemini_request"),
        notReached("gemini_response_received"),
        notReached("json_parse"),
        notReached("canonical_match"),
        notReached("draft_update"),
        step("ai_event_log", null, "skipped in no-provider mode")
      );
      return json(
        { ok: true, debugId, environment, steps, failureStage: null, safeSummary },
        { status: 200 }
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    if (!geminiApiKey) {
      steps.push(step("gemini_request", false, { code: "gemini_not_configured" }));
      markFailure("gemini_request", "Gemini is not configured for this preview.");
      steps.push(
        notReached("gemini_response_received"),
        notReached("json_parse"),
        notReached("canonical_match"),
        notReached("draft_update"),
        step("ai_event_log", null, "not reached")
      );
      return json(
        { ok: false, debugId, environment, steps, failureStage, safeSummary },
        { status: 500 }
      );
    }

    const modelUsed = environment.effectiveModel;
    console.info(`[ai-analysis-diagnostic:${debugId}] model_effective=${modelUsed}`);

    try {
      const generated = await generateGeminiListingImageContent({
        apiKey: geminiApiKey,
        model: modelUsed,
        imageBase64: image.base64,
        mimeType: image.mimeType,
        timeoutMs: environment.timeoutMs,
      });

      steps.push(
        step("gemini_request", true, {
          modelUsed,
          providerStatus: 200,
          providerCode: null,
          providerMessageSafe: "request accepted",
        })
      );
      steps.push(
        step("gemini_response_received", true, {
          textLength: generated.rawText.length,
          tokenUsage: generated.tokenUsage,
        })
      );

      let analysis;
      try {
        analysis = parseGeminiListingAnalysisOutput(generated.rawText);
        steps.push(step("json_parse", true, { detected_item_label: analysis.detected_item_label }));
      } catch (parseError) {
        const message = parseError instanceof Error ? parseError.message : "parse failed";
        steps.push(step("json_parse", false, { message }));
        markFailure("json_parse", "Gemini response could not be parsed.");
        steps.push(notReached("canonical_match"), notReached("draft_update"));
        await logListingAnalysisEvent(supabase, {
          userId: user.id,
          draftId,
          imagePath: image.path,
          modelUsed,
          tokenUsage: generated.tokenUsage,
          success: false,
          errorMessage: message.slice(0, 500),
          candidateCount: 0,
          debugId,
          providerStatus: null,
          providerCode: null,
          eventSource: "diagnostic_ai_analysis",
          countsTowardImageDailyLimit: false,
        });
        steps.push(step("ai_event_log", true, "failure event logged"));
        return json(
          { ok: false, debugId, environment, steps, failureStage, safeSummary },
          { status: 502 }
        );
      }

      const canonicalCandidates = await buildCanonicalCandidates(supabase, analysis);
      steps.push(step("canonical_match", true, { candidateCount: canonicalCandidates.length }));

      const topConfidence = analysis.product_type_candidates[0]?.confidence ?? 0;
      const { error: draftUpdateError } = await supabase
        .from("marketplace_listing_drafts")
        .update({
          ai_detected_label: analysis.detected_item_label,
          ai_confidence: topConfidence,
          ai_raw_response_json: {
            provider: "gemini",
            model: modelUsed,
            analysed_at: new Date().toISOString(),
            analysis,
            canonical_candidates: canonicalCandidates,
            raw_json_text: generated.rawText,
          },
        })
        .eq("id", draftId)
        .eq("user_id", draft.user_id);

      if (draftUpdateError) {
        steps.push(step("draft_update", false, { message: draftUpdateError.message }));
        markFailure("draft_update", "Draft update failed after successful Gemini analysis.");
      } else {
        steps.push(step("draft_update", true, "draft ai fields updated"));
      }

      await logListingAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath: image.path,
        modelUsed,
        tokenUsage: generated.tokenUsage,
        success: !draftUpdateError,
        errorMessage: draftUpdateError?.message ?? null,
        candidateCount: canonicalCandidates.length,
        debugId,
        providerStatus: null,
        providerCode: null,
        eventSource: "diagnostic_ai_analysis",
        countsTowardImageDailyLimit: false,
      });
      steps.push(step("ai_event_log", true, draftUpdateError ? "failure event logged" : "success event logged"));

      safeSummary = draftUpdateError
        ? "Gemini analysis succeeded but draft update failed."
        : "Full analysis pipeline succeeded.";

      return json(
        {
          ok: !draftUpdateError,
          debugId,
          environment,
          steps,
          failureStage,
          safeSummary,
        },
        { status: draftUpdateError ? 500 : 200 }
      );
    } catch (error) {
      const providerMessage = error instanceof Error ? error.message : "Gemini request failed.";
      const details =
        error instanceof GeminiProviderError
          ? {
              providerStatus: error.providerStatus,
              providerCode: error.providerCode,
              providerMessageSafe: extractProviderDetails(error).providerMessageSafe,
            }
          : {
              ...extractProviderDetails(error),
            };
      const classified = classifyGeminiProviderError(
        {
          providerStatus: details.providerStatus,
          providerCode: details.providerCode,
          providerMessageSafe: details.providerMessageSafe,
        },
        providerMessage
      );

      console.error(
        `[ai-analysis-diagnostic:${debugId}] failure_stage=gemini_request provider_status=${details.providerStatus} provider_code=${details.providerCode}`
      );

      steps.push(
        step("gemini_request", false, {
          modelUsed,
          providerStatus: details.providerStatus,
          providerCode: details.providerCode,
          providerMessageSafe: details.providerMessageSafe,
        })
      );
      markFailure("gemini_request", `Gemini provider call failed with ${details.providerStatus ?? "n/a"}/${details.providerCode ?? "n/a"}.`);

      steps.push(
        notReached("gemini_response_received"),
        notReached("json_parse"),
        notReached("canonical_match"),
        notReached("draft_update")
      );

      await logListingAnalysisEvent(supabase, {
        userId: user.id,
        draftId,
        imagePath: image.path,
        modelUsed,
        tokenUsage: null,
        success: false,
        errorMessage: providerMessage.slice(0, 500),
        candidateCount: 0,
        debugId,
        providerStatus: details.providerStatus,
        providerCode: details.providerCode,
        eventSource: "diagnostic_ai_analysis",
        countsTowardImageDailyLimit: false,
      });
      steps.push(step("ai_event_log", true, "failure event logged"));

      return json(
        {
          ok: false,
          debugId,
          environment,
          steps,
          failureStage,
          safeSummary,
          errorCode: classified.errorCode,
        },
        { status: classified.httpStatus }
      );
    }
  } catch (error) {
    console.error(`[ai-analysis-diagnostic:${debugId}] unexpected_route_error`, error);
    return json(
      {
        ok: false,
        debugId,
        environment,
        steps,
        failureStage: failureStage ?? "route_unexpected_failure",
        safeSummary: "Diagnostic route failed unexpectedly.",
      },
      { status: 500 }
    );
  }
}
