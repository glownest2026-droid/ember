import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "5");
  if (!Number.isFinite(parsed)) return 5;
  return Math.max(1, Math.min(20, Math.floor(parsed)));
}

/** GET /api/inventory/match?q=...&limit=5 */
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

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const limit = parseLimit(searchParams.get("limit"));

  if (!query) {
    return NextResponse.json({ candidates: [] }, { status: 200 });
  }

  const { data, error } = await supabase.rpc("inventory_match_product_types", {
    query_text: query,
    p_limit: limit,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const candidates = (data ?? []).map((row: {
    id: string;
    slug: string;
    label: string;
    subtitle: string | null;
    confidence_bucket: "high" | "medium" | "low";
  }) => ({
    id: row.id,
    slug: row.slug,
    label: row.label,
    subtitle: row.subtitle,
    confidence_bucket: row.confidence_bucket,
  }));

  await supabase.from("inventory_search_events").insert({
    user_id: user.id,
    raw_query: query,
    selected_product_type_id: null,
    confidence_bucket: candidates[0]?.confidence_bucket ?? null,
    was_confirmed: false,
  });

  return NextResponse.json({ candidates }, { status: 200, headers: response.headers });
}
