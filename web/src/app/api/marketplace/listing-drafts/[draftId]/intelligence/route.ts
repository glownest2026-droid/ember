import { NextRequest } from "next/server";
import {
  buildLockedConfirmedItemPayload,
  type LockedConfirmedItem,
} from "@/lib/marketplace/identity-guard";
import {
  getSeedItemType,
  isAllowedStage1Slug,
  normalizeAliasText,
  type RecommendationPolicy,
  type RiskLevel,
} from "@/lib/marketplace/marketplace-taxonomy";
import { computeRecommendationEligibility } from "@/lib/marketplace/recommendation-eligibility";
import { resolveCoverageState } from "@/lib/marketplace/coverage-state";
import { sanitizeAgeRange } from "@/lib/marketplace/intelligence";
import type { Pr3AiRawResponse } from "@/lib/marketplace/ai-listing-details-types";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ItemTypeRow = {
  id: string;
  slug: string;
  label: string | null;
  canonical_name: string | null;
  default_min_age_months: number | null;
  default_max_age_months: number | null;
  default_outgrown_months: number | null;
  risk_level: string | null;
  recommendation_policy: string | null;
};

type DevMappingRow = {
  stage1_wrapper_ux_slug: string;
  stage1_wrapper_ux_label: string | null;
  mapping_strength: string | null;
  estimated_min_months: number | null;
  estimated_max_months: number | null;
  safety_gate_policy: string | null;
};

function buildConfirmedFromDraft(
  draft: { ai_detected_label: string | null; ai_raw_response_json: unknown },
  productType: { label: string | null; subtitle: string | null } | null
): LockedConfirmedItem {
  const raw = (draft.ai_raw_response_json ?? null) as Pr3AiRawResponse | null;
  const parentDisplay =
    typeof raw?.parent_confirmed_display_label === "string"
      ? raw.parent_confirmed_display_label.trim()
      : "";
  const label =
    parentDisplay ||
    productType?.label?.trim() ||
    raw?.analysis?.user_facing_item_label?.trim() ||
    draft.ai_detected_label?.trim() ||
    "";
  const visual =
    raw?.analysis?.visual_description?.trim() ||
    raw?.analysis?.detected_item_label?.trim() ||
    "";
  const category = productType?.subtitle?.trim() || raw?.analysis?.broad_category?.trim() || "";
  return buildLockedConfirmedItemPayload({
    confirmedItemLabel: label,
    confirmedVisualDescription: visual,
    confirmedCategoryLabel: category,
    source: "parent_confirmation",
  });
}

function matchItemType(
  confirmedText: string,
  itemTypes: ItemTypeRow[],
  aliasesByType: Map<string, string[]>
): ItemTypeRow | null {
  const norm = ` ${normalizeAliasText(confirmedText)} `;
  if (norm.trim().length === 0) return null;
  for (const it of itemTypes) {
    const candidates = [
      it.label ?? "",
      it.canonical_name ?? "",
      it.slug.replace(/_/g, " "),
      ...(aliasesByType.get(it.id) ?? []),
    ];
    for (const candidate of candidates) {
      const c = normalizeAliasText(candidate);
      if (!c) continue;
      if (norm.includes(` ${c} `) || normalizeAliasText(confirmedText) === c) {
        return it;
      }
    }
  }
  return null;
}

async function loadIntelligenceContext(
  supabase: ReturnType<typeof createClient>["supabase"],
  confirmedText: string
): Promise<{ itemType: ItemTypeRow | null; mappings: DevMappingRow[] }> {
  const { data: itemTypes } = await supabase
    .from("marketplace_item_types")
    .select(
      "id, slug, label, canonical_name, default_min_age_months, default_max_age_months, default_outgrown_months, risk_level, recommendation_policy"
    )
    .eq("is_active", true);
  const rows = (itemTypes ?? []) as ItemTypeRow[];

  const { data: aliases } = await supabase
    .from("marketplace_item_type_aliases")
    .select("item_type_id, alias_text")
    .eq("is_active", true);
  const aliasesByType = new Map<string, string[]>();
  for (const a of (aliases ?? []) as { item_type_id: string; alias_text: string }[]) {
    const list = aliasesByType.get(a.item_type_id) ?? [];
    list.push(a.alias_text);
    aliasesByType.set(a.item_type_id, list);
  }

  const itemType = matchItemType(confirmedText, rows, aliasesByType);
  if (!itemType) return { itemType: null, mappings: [] };

  const { data: mappings } = await supabase
    .from("marketplace_item_type_development_mappings")
    .select(
      "stage1_wrapper_ux_slug, stage1_wrapper_ux_label, mapping_strength, estimated_min_months, estimated_max_months, safety_gate_policy"
    )
    .eq("item_type_id", itemType.id)
    .eq("is_active", true);

  return { itemType, mappings: (mappings ?? []) as DevMappingRow[] };
}

function buildSafePayload(row: Record<string, unknown>) {
  return {
    confirmed_item_label: row.confirmed_item_label ?? null,
    marketplace_item_type_slug: row.marketplace_item_type_slug ?? null,
    development_area_slugs: row.development_area_slugs_json ?? [],
    ai_estimated_min_age_months: row.ai_estimated_min_age_months ?? null,
    ai_estimated_max_age_months: row.ai_estimated_max_age_months ?? null,
    parent_confirmed_min_age_months: row.parent_confirmed_min_age_months ?? null,
    parent_confirmed_max_age_months: row.parent_confirmed_max_age_months ?? null,
    manufacturer_min_age_months: row.manufacturer_min_age_months ?? null,
    manufacturer_max_age_months: row.manufacturer_max_age_months ?? null,
    manufacturer_age_source: row.manufacturer_age_source ?? null,
    safety_flags: row.safety_flags_json ?? [],
    risk_level: row.risk_level ?? null,
    recommendation_eligibility: row.recommendation_eligibility ?? null,
    outgrown_estimate_months: row.outgrown_estimate_months ?? null,
    confidence: row.confidence ?? null,
    coverage_state: row.coverage_state ?? null,
    parent_confirmed_intelligence_at: row.parent_confirmed_intelligence_at ?? null,
  };
}

async function fetchOwnedDraft(
  supabase: ReturnType<typeof createClient>["supabase"],
  draftId: string,
  userId: string
) {
  return supabase
    .from("marketplace_listing_drafts")
    .select("id, user_id, status, product_type_id, ai_detected_label, ai_raw_response_json")
    .eq("id", draftId)
    .eq("user_id", userId)
    .maybeSingle();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "Please sign in to build listing intelligence." }, { status: 401 });
  }

  const { draftId } = await params;
  if (!draftId) return json({ error: "Draft id is required." }, { status: 400 });

  const { data: draft, error: draftError } = await fetchOwnedDraft(supabase, draftId, user.id);
  if (draftError) return json({ error: draftError.message }, { status: 500 });
  if (!draft) return json({ error: "Draft not found." }, { status: 404 });
  if (!(draft.product_type_id && draft.status === "confirmed")) {
    return json(
      { error: "Confirm the item in the previous step before building intelligence." },
      { status: 400 }
    );
  }

  const { data: productType } = await supabase
    .from("product_types")
    .select("label, subtitle")
    .eq("id", draft.product_type_id)
    .maybeSingle();

  const confirmed = buildConfirmedFromDraft(draft, productType ?? null);
  const confirmedText = [
    confirmed.confirmed_item_label,
    confirmed.confirmed_visual_description,
    confirmed.confirmed_category_label,
  ].join(" ");

  const { itemType, mappings } = await loadIntelligenceContext(supabase, confirmedText);
  const seed = getSeedItemType(itemType?.slug ?? null);

  const developmentAreaSlugs = mappings
    .map((mp) => mp.stage1_wrapper_ux_slug)
    .filter((s) => isAllowedStage1Slug(s));

  const { min: aiMin, max: aiMax } = sanitizeAgeRange(
    itemType?.default_min_age_months ?? null,
    itemType?.default_max_age_months ?? null
  );

  const safetyFlags = seed?.safety_flags ?? [];
  const riskLevel = (itemType?.risk_level ?? null) as RiskLevel | null;
  const policy = (itemType?.recommendation_policy ?? "recommendable") as RecommendationPolicy;

  const eligibility = computeRecommendationEligibility({
    ai_estimated_min_age_months: aiMin,
    ai_estimated_max_age_months: aiMax,
    risk_level: riskLevel,
    recommendation_policy: policy,
    safety_flags: safetyFlags,
  });

  const coverageState = resolveCoverageState({
    age_band_min_months: aiMin,
    age_band_max_months: aiMax,
    stage1_wrapper_ux_slug: developmentAreaSlugs[0] ?? null,
    has_exact_abi_content: false,
    has_marketplace_estimate: Boolean(itemType),
  });

  const intelligenceRow = {
    draft_id: draftId,
    seller_user_id: user.id,
    confirmed_item_label: confirmed.confirmed_item_label || null,
    confirmed_visual_description: confirmed.confirmed_visual_description || null,
    marketplace_item_type_id: itemType?.id ?? null,
    marketplace_item_type_slug: itemType?.slug ?? null,
    ai_marketplace_item_type_candidates_json: itemType
      ? [{ slug: itemType.slug, label: itemType.label ?? itemType.canonical_name }]
      : [],
    development_area_slugs_json: developmentAreaSlugs,
    ai_estimated_min_age_months: aiMin,
    ai_estimated_max_age_months: aiMax,
    manufacturer_age_source: null,
    safety_flags_json: safetyFlags,
    risk_level: itemType?.risk_level ?? null,
    recommendation_eligibility: eligibility.eligibility,
    outgrown_estimate_months: itemType?.default_outgrown_months ?? null,
    confidence: itemType ? "medium" : "low",
    coverage_state: coverageState,
  };

  // Upsert by draft_id (no Gemini call in the deterministic path).
  const { data: existing } = await supabase
    .from("marketplace_listing_intelligence")
    .select("id")
    .eq("draft_id", draftId)
    .maybeSingle();

  let savedRow: Record<string, unknown> | null = null;
  if (existing?.id) {
    const { data, error } = await supabase
      .from("marketplace_listing_intelligence")
      .update(intelligenceRow)
      .eq("id", existing.id)
      .eq("seller_user_id", user.id)
      .select("*")
      .maybeSingle();
    if (error) return json({ error: error.message }, { status: 500 });
    savedRow = data ?? null;
  } else {
    const { data, error } = await supabase
      .from("marketplace_listing_intelligence")
      .insert(intelligenceRow)
      .select("*")
      .maybeSingle();
    if (error) return json({ error: error.message }, { status: 500 });
    savedRow = data ?? null;
  }

  // If no controlled type matched, queue the observed label for human review.
  if (!itemType) {
    await supabase.from("marketplace_taxonomy_review_queue").insert({
      draft_id: draftId,
      submitted_by_user_id: user.id,
      observed_item_label: confirmed.confirmed_item_label || null,
      reason: "No controlled marketplace item type matched the confirmed item.",
      confidence: "low",
      status: "pending",
    });
  }

  return json(
    {
      ok: true,
      matched: Boolean(itemType),
      intelligence: savedRow ? buildSafePayload(savedRow) : buildSafePayload(intelligenceRow),
      safety_copy: eligibility.safety_copy,
    },
    { status: 200 }
  );
}

type PatchPayload = {
  parent_confirmed_min_age_months?: number | null;
  parent_confirmed_max_age_months?: number | null;
  manufacturer_min_age_months?: number | null;
  manufacturer_max_age_months?: number | null;
  manufacturer_age_source?: string | null;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "Please sign in to save your estimate." }, { status: 401 });
  }

  const { draftId } = await params;
  if (!draftId) return json({ error: "Draft id is required." }, { status: 400 });

  let body: PatchPayload;
  try {
    body = (await request.json()) as PatchPayload;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { data: row, error: rowError } = await supabase
    .from("marketplace_listing_intelligence")
    .select("*")
    .eq("draft_id", draftId)
    .eq("seller_user_id", user.id)
    .maybeSingle();
  if (rowError) return json({ error: rowError.message }, { status: 500 });
  if (!row) return json({ error: "Intelligence not found for this draft." }, { status: 404 });

  // Validate age fields: parent edits override the *display* estimate but never
  // erase the AI estimate (stored separately).
  const parent = sanitizeAgeRange(
    body.parent_confirmed_min_age_months,
    body.parent_confirmed_max_age_months
  );
  const manufacturer = sanitizeAgeRange(
    body.manufacturer_min_age_months,
    body.manufacturer_max_age_months
  );
  const manufacturerSource =
    typeof body.manufacturer_age_source === "string" && body.manufacturer_age_source.trim()
      ? body.manufacturer_age_source.trim().slice(0, 40)
      : null;

  const eligibility = computeRecommendationEligibility({
    ai_estimated_min_age_months: row.ai_estimated_min_age_months,
    ai_estimated_max_age_months: row.ai_estimated_max_age_months,
    parent_confirmed_min_age_months: parent.min,
    parent_confirmed_max_age_months: parent.max,
    manufacturer_min_age_months: manufacturer.min,
    manufacturer_max_age_months: manufacturer.max,
    risk_level: row.risk_level,
    recommendation_policy: "recommendable",
    safety_flags: row.safety_flags_json,
  });

  const { data: updated, error: updateError } = await supabase
    .from("marketplace_listing_intelligence")
    .update({
      parent_confirmed_min_age_months: parent.min,
      parent_confirmed_max_age_months: parent.max,
      manufacturer_min_age_months: manufacturer.min,
      manufacturer_max_age_months: manufacturer.max,
      manufacturer_age_source: manufacturerSource,
      recommendation_eligibility: eligibility.eligibility,
      parent_confirmed_intelligence_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("seller_user_id", user.id)
    .select("*")
    .maybeSingle();
  if (updateError) return json({ error: updateError.message }, { status: 500 });

  return json(
    {
      ok: true,
      intelligence: updated ? buildSafePayload(updated) : null,
      safety_copy: eligibility.safety_copy,
    },
    { status: 200 }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return json({ error: "Please sign in." }, { status: 401 });
  }
  const { draftId } = await params;
  if (!draftId) return json({ error: "Draft id is required." }, { status: 400 });

  const { data: row, error } = await supabase
    .from("marketplace_listing_intelligence")
    .select("*")
    .eq("draft_id", draftId)
    .eq("seller_user_id", user.id)
    .maybeSingle();
  if (error) return json({ error: error.message }, { status: 500 });
  return json({ ok: true, intelligence: row ? buildSafePayload(row) : null }, { status: 200 });
}
