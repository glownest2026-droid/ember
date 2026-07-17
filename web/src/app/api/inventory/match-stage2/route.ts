import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

type Stage2Candidate = {
  category_type_id: string;
  slug: string;
  label: string;
  age_band_id: string | null;
  image_url: string | null;
  confidence_bucket: "high" | "medium" | "low";
  score: number | null;
};

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "3");
  if (!Number.isFinite(parsed)) return 3;
  return Math.max(1, Math.min(20, Math.floor(parsed)));
}

/** GET /api/inventory/match-stage2?q=helmet&ageBandId=13-15m&limit=3 */
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
  const ageBandId = (searchParams.get("ageBandId") ?? "").trim() || null;
  const childId = (searchParams.get("childId") ?? "").trim() || null;
  const limit = parseLimit(searchParams.get("limit"));

  if (!query) {
    return json({ candidates: [] }, { status: 200 });
  }

  let resolvedAgeBandId = ageBandId;
  if (!resolvedAgeBandId && childId) {
    const { data: child } = await supabase
      .from("children")
      .select("age_band")
      .eq("id", childId)
      .eq("user_id", user.id)
      .maybeSingle();
    const band = (child as { age_band?: string | null } | null)?.age_band?.trim();
    if (band) resolvedAgeBandId = band;
  }

  const { data, error } = await supabase.rpc("inventory_match_stage2_categories", {
    query_text: query,
    p_age_band_id: resolvedAgeBandId,
    p_limit: Math.max(6, limit * 3),
  });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const rankedCandidates: Stage2Candidate[] = (data ?? []).map(
    (row: {
      category_type_id: string;
      slug: string;
      label: string;
      age_band_id: string | null;
      image_url: string | null;
      confidence_bucket: "high" | "medium" | "low";
      score?: number;
    }) => ({
      category_type_id: row.category_type_id,
      slug: row.slug,
      label: row.label,
      age_band_id: row.age_band_id,
      image_url: row.image_url,
      confidence_bucket: row.confidence_bucket,
      score: row.score ?? null,
    })
  );

  // Keep the strongest suggestion, then only genuinely close runners-up.
  // This prevents a long tail of weak fuzzy matches from looking authoritative.
  const topScore = Number(rankedCandidates[0]?.score ?? 0);
  const runnerUpFloor = Math.max(12, topScore * 0.8);
  const candidates = rankedCandidates
    .filter((candidate: Stage2Candidate, index: number) => {
      if (index === 0) return true;
      return Number(candidate.score ?? 0) >= runnerUpFloor;
    })
    .slice(0, limit);

  await supabase.from("inventory_search_events").insert({
    user_id: user.id,
    raw_query: query,
    selected_product_type_id: null,
    confidence_bucket: candidates[0]?.confidence_bucket ?? null,
    was_confirmed: false,
  });

  return json({ candidates, age_band_id: resolvedAgeBandId }, { status: 200 });
}
