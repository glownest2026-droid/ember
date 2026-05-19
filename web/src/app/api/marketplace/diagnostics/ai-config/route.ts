import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { DEFAULT_GEMINI_MODEL } from "@/lib/marketplace/ai-listing-analysis";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? "");
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.floor(parsed));
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

  if (!isAdminUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const effectiveModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const configured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const dailyLimit = parsePositiveInt(process.env.AI_LISTING_DAILY_LIMIT, 5);
  const timeoutMs = parsePositiveInt(process.env.GEMINI_TIMEOUT_MS, 8000);

  return NextResponse.json(
    {
      provider: "gemini",
      configured,
      effectiveModel,
      dailyLimit,
      timeoutMs,
    },
    { status: 200, headers: response.headers }
  );
}
