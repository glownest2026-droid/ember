import { NextRequest } from "next/server";
import { getAiListingEnvironment } from "@/lib/marketplace/ai-listing-gemini-config";
import { resolveIsAdminUser } from "@/lib/marketplace/ai-listing-admin";
import { getImageAnalysisUsageSnapshot } from "@/lib/marketplace/ai-listing-rate-limit";
import { getDiagnosticsAccessDeniedReason } from "@/lib/marketplace/ai-listing-diagnostics-access";
import {
  buildProviderTestWithFallbackSummary,
  runGeminiProviderTextTestWithFallback,
} from "@/lib/marketplace/ai-listing-gemini-test";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { supabase, json } = createClient(request);

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const accessDenied = getDiagnosticsAccessDeniedReason({
      isAuthenticated: Boolean(user && !authError),
      isAdmin: user ? await resolveIsAdminUser(supabase, user) : false,
    });

    if (accessDenied === "disabled") {
      return json({ error: "Not found" }, { status: 404 });
    }
    if (accessDenied === "unauthorized") {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    if (accessDenied === "forbidden") {
      return json({ error: "Forbidden" }, { status: 403 });
    }

    const environment = getAiListingEnvironment();
    const testProvider = request.nextUrl.searchParams.get("testProvider") === "1";

    const usage =
      user && !authError
        ? await getImageAnalysisUsageSnapshot(supabase, { id: user.id, email: user.email })
        : null;

    if (!testProvider) {
      return json(
        {
          provider: environment.provider,
          configured: environment.configured,
          effectiveModel: environment.effectiveModel,
          fallbackModel: environment.fallbackModel,
          dailyLimit: environment.dailyLimit,
          timeoutMs: environment.timeoutMs,
          timeoutSource: environment.timeoutSource,
          hasApiKey: environment.hasApiKey,
          imageAnalysisLimit: usage?.imageAnalysisLimit ?? null,
          imageAnalysisUsedLast24h: usage?.imageAnalysisUsedLast24h ?? null,
          imageAnalysisRemaining: usage?.imageAnalysisRemaining ?? null,
          limitWindowStart: usage?.limitWindowStart ?? null,
          imageAnalysisCountError: usage?.countError ?? null,
        },
        { status: 200 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return json(
        {
          ...environment,
          providerTest: {
            primary: {
              attempted: false,
              model: environment.effectiveModel,
              providerStatus: null,
              providerCode: null,
              responseReceived: false,
              textPreview: null,
              parsedOk: false,
              safeMessage: "Image checking is not configured for this preview.",
              projectIdentityNote:
                "Could not verify project identity from API response. Founder must verify manually in Google AI Studio → API Keys.",
            },
            fallback: null,
            finalSuccess: false,
            finalModelUsed: null,
            fallbackUsed: false,
          },
          safeSummary: "Gemini API key is not configured.",
        },
        { status: 200 }
      );
    }

    const providerTest = await runGeminiProviderTextTestWithFallback({
      apiKey,
      timeoutMs: environment.timeoutMs,
      primaryModel: environment.effectiveModel,
      fallbackModel: environment.fallbackModel,
    });

    return json(
      {
        ...environment,
        imageAnalysisLimit: usage?.imageAnalysisLimit ?? null,
        imageAnalysisUsedLast24h: usage?.imageAnalysisUsedLast24h ?? null,
        imageAnalysisRemaining: usage?.imageAnalysisRemaining ?? null,
        limitWindowStart: usage?.limitWindowStart ?? null,
        imageAnalysisCountError: usage?.countError ?? null,
        providerTest,
        safeSummary: buildProviderTestWithFallbackSummary(providerTest),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ai-config-diagnostic] unexpected_route_error", error);
    return json(
      {
        error: "Diagnostic route failed unexpectedly.",
        error_code: "diagnostic_route_failed",
      },
      { status: 500 }
    );
  }
}
