import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

type AtHomeMatchRow = {
  product_type_id: string;
  slug: string;
  label: string;
  subtitle: string | null;
  family_slug: string | null;
  family_label: string | null;
  family_hint: string | null;
  specific_label: string | null;
  confidence_bucket: "high" | "medium" | "low";
  score: number | null;
};

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "1");
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(3, Math.floor(parsed)));
}

/** GET /api/inventory/match-at-home?q=paddington&limit=1 */
export async function GET(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const limit = parseLimit(searchParams.get("limit"));

  if (!query) {
    return json({ match: null, candidates: [] }, { status: 200 });
  }

  const { data, error } = await supabase.rpc("inventory_match_at_home", {
    query_text: query,
    p_limit: limit,
  });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const candidates: AtHomeMatchRow[] = (data ?? [])
    .map(
    (row: {
      product_type_id: string;
      slug: string;
      label: string;
      subtitle: string | null;
      family_slug: string | null;
      family_label: string | null;
      family_hint: string | null;
      specific_label: string | null;
      confidence_bucket: "high" | "medium" | "low";
      score?: number;
    }) => ({
      product_type_id: row.product_type_id,
      slug: row.slug,
      label: row.label,
      subtitle: row.subtitle,
      family_slug: row.family_slug,
      family_label: row.family_label,
      family_hint: row.family_hint,
      specific_label: row.specific_label,
      confidence_bucket: row.confidence_bucket,
      score: row.score ?? null,
    })
  )
    .filter(
      (row) =>
        row.confidence_bucket === "high" ||
        (row.confidence_bucket === "medium" && (row.score ?? 0) >= 68)
    );

  const qualityCandidates = candidates.slice(0, limit);

  await supabase.from("inventory_search_events").insert({
    user_id: user.id,
    raw_query: query,
    selected_product_type_id: null,
    confidence_bucket: qualityCandidates[0]?.confidence_bucket ?? null,
    was_confirmed: false,
  });

  return json({
    match: qualityCandidates[0] ?? null,
    candidates: qualityCandidates,
  });
}
