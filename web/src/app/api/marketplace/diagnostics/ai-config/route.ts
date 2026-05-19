import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { getAiListingEnvironment } from "@/lib/marketplace/ai-listing-gemini-config";
import {
  buildProviderTestFailureSummary,
  runGeminiProviderTextTest,
} from "@/lib/marketplace/ai-listing-gemini-test";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

async function resolveIsAdmin(
  supabase: ReturnType<typeof createClient>,
  user: { id: string; email?: string | null }
): Promise<boolean> {
  if (isAdminEmail(user.email)) return true;
  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(adminRole?.role === "admin");
}

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createClient(request, response);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdminUser = await resolveIsAdmin(supabase, user);
  if (!isAdminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const environment = getAiListingEnvironment();
  const testProvider = request.nextUrl.searchParams.get("testProvider") === "1";

  if (!testProvider) {
    return NextResponse.json(
      {
        provider: environment.provider,
        configured: environment.configured,
        effectiveModel: environment.effectiveModel,
        dailyLimit: environment.dailyLimit,
        timeoutMs: environment.timeoutMs,
        hasApiKey: environment.hasApiKey,
      },
      { status: 200, headers: response.headers }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        ...environment,
        providerTest: {
          attempted: false,
          providerStatus: null,
          providerCode: null,
          responseReceived: false,
          textPreview: null,
          parsedOk: false,
          safeMessage: "Image checking is not configured for this preview.",
          projectIdentityNote:
            "Could not verify project identity from API response. Founder must verify manually in Google AI Studio → API Keys.",
        },
        safeSummary: "Gemini API key is not configured.",
      },
      { status: 200, headers: response.headers }
    );
  }

  const providerTest = await runGeminiProviderTextTest({
    apiKey,
    timeoutMs: environment.timeoutMs,
    model: environment.effectiveModel,
  });

  return NextResponse.json(
    {
      ...environment,
      providerTest,
      safeSummary: buildProviderTestFailureSummary(providerTest),
    },
    { status: 200, headers: response.headers }
  );
}
