import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";
import { resolveAtHomeAiMatch } from "@/lib/inventory/at-home-ai-match";
import {
  atHomeTextClassifyLimitReachedMessage,
  countAtHomeTextClassifyEventsLast24h,
  getAtHomeTextClassifyLimitWindowStart,
  resolveAtHomeTextClassifyDailyLimit,
} from "@/lib/inventory/at-home-ai-rate-limit";
import { loadAtHomeCatalogue } from "@/lib/inventory/at-home-catalogue";
import { classifyAtHomeTextWithGemini } from "@/lib/inventory/at-home-text-classify";
import { GeminiConfigError, GeminiProviderError } from "@/lib/marketplace/ai-listing-analysis";
import { getAiListingEnvironment } from "@/lib/marketplace/ai-listing-gemini-config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 45;

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
  match_source: "catalogue" | "ai";
  ai_hint: string | null;
};

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "1");
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(3, Math.floor(parsed)));
}

function mapCatalogueRow(row: {
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
}): AtHomeMatchRow {
  return {
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
    match_source: "catalogue",
    ai_hint: null,
  };
}

async function logAtHomeTextClassifyEvent(
  supabase: ReturnType<typeof createClient>["supabase"],
  args: {
    userId: string;
    query: string;
    modelUsed: string | null;
    success: boolean;
    errorMessage: string | null;
    debugId: string;
    matched: boolean;
    match?: AtHomeMatchRow | null;
  }
) {
  await supabase.from("ai_listing_analysis_events").insert({
    user_id: args.userId,
    draft_id: null,
    model_used: args.modelUsed,
    input_image_path: null,
    token_usage: null,
    vision_features_used: {
      mode: "at_home_text_classify",
      raw_query: args.query,
      debug_id: args.debugId,
      matched: args.matched,
      ...(args.match
        ? {
            product_type_id: args.match.product_type_id,
            family_slug: args.match.family_slug,
            family_label: args.match.family_label,
            specific_label: args.match.specific_label,
          }
        : {}),
    },
    cost_estimate: null,
    success: args.success,
    error_message: args.errorMessage,
  });
}

async function loadCachedAtHomeAiMatch(
  supabase: ReturnType<typeof createClient>["supabase"],
  userId: string,
  query: string
): Promise<AtHomeMatchRow | null> {
  const limitWindowStart = getAtHomeTextClassifyLimitWindowStart();
  const { data } = await supabase
    .from("ai_listing_analysis_events")
    .select("vision_features_used")
    .eq("user_id", userId)
    .eq("success", true)
    .gte("created_at", limitWindowStart)
    .eq("vision_features_used->>mode", "at_home_text_classify")
    .eq("vision_features_used->>raw_query", query)
    .eq("vision_features_used->>matched", "true")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = (data as { vision_features_used?: Record<string, unknown> } | null)
    ?.vision_features_used;
  const productTypeId = String(payload?.product_type_id ?? "").trim();
  if (!productTypeId) return null;

  const { data: productType } = await supabase
    .from("product_types")
    .select("id, slug, label, subtitle, family_slug")
    .eq("id", productTypeId)
    .eq("is_active", true)
    .maybeSingle();

  if (!productType?.id) return null;

  const familySlug = productType.family_slug ? String(productType.family_slug) : null;
  let familyLabel = String(payload?.family_label ?? "").trim() || null;
  let familyHint: string | null = null;
  if (familySlug) {
    const { data: family } = await supabase
      .from("item_type_families")
      .select("label, hint")
      .eq("slug", familySlug)
      .maybeSingle();
    familyLabel = family?.label ? String(family.label) : familyLabel;
    familyHint = family?.hint ? String(family.hint) : null;
  }

  return {
    product_type_id: productType.id,
    slug: String(productType.slug),
    label: familyLabel ?? String(productType.label),
    subtitle: familyHint ?? (productType.subtitle ? String(productType.subtitle) : null),
    family_slug: familySlug,
    family_label: familyLabel,
    family_hint: familyHint,
    specific_label: String(payload?.specific_label ?? productType.label),
    confidence_bucket: "high",
    score: 95,
    match_source: "ai",
    ai_hint: null,
  };
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
  const allowAi = searchParams.get("allowAi") === "1";

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

  const catalogueCandidates: AtHomeMatchRow[] = (data ?? [])
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
      }) => mapCatalogueRow(row)
    )
    .filter(
      (row: AtHomeMatchRow) =>
        row.confidence_bucket === "high" ||
        (row.confidence_bucket === "medium" && (row.score ?? 0) >= 68)
    );

  let qualityCandidates = catalogueCandidates.slice(0, limit);

  if (allowAi && qualityCandidates.length === 0 && query.length >= 3) {
    const cachedAiMatch = await loadCachedAtHomeAiMatch(supabase, user.id, query);
    if (cachedAiMatch) {
      qualityCandidates = [cachedAiMatch];
    }
  }

  if (allowAi && qualityCandidates.length === 0 && query.length >= 3) {
    const aiEnv = getAiListingEnvironment();
    const dailyLimit = await resolveAtHomeTextClassifyDailyLimit(supabase, user);
    const usedToday = await countAtHomeTextClassifyEventsLast24h(supabase, user.id);
    const debugId = crypto.randomUUID();

    if (aiEnv.hasApiKey && usedToday < dailyLimit) {
      try {
        const catalogue = await loadAtHomeCatalogue(supabase);
        const { classification, modelUsed } = await classifyAtHomeTextWithGemini({
          apiKey: process.env.GEMINI_API_KEY,
          model: aiEnv.effectiveModel,
          query,
          catalogue,
        });
        const aiMatch = resolveAtHomeAiMatch(classification, catalogue);
        if (aiMatch) {
          qualityCandidates = [aiMatch];
        }

        await logAtHomeTextClassifyEvent(supabase, {
          userId: user.id,
          query,
          modelUsed,
          success: true,
          errorMessage: null,
          debugId,
          matched: Boolean(aiMatch),
          match: aiMatch,
        });
      } catch (err) {
        const message =
          err instanceof GeminiConfigError || err instanceof GeminiProviderError
            ? err.message
            : "Could not classify that name.";
        await logAtHomeTextClassifyEvent(supabase, {
          userId: user.id,
          query,
          modelUsed: aiEnv.effectiveModel,
          success: false,
          errorMessage: message,
          debugId,
          matched: false,
        });
      }
    } else if (usedToday >= dailyLimit) {
      await supabase.from("inventory_search_events").insert({
        user_id: user.id,
        raw_query: query,
        selected_product_type_id: null,
        confidence_bucket: null,
        was_confirmed: false,
      });
      return json({
        match: null,
        candidates: [],
        ai_limit_reached: true,
        ai_limit_message: atHomeTextClassifyLimitReachedMessage(),
      });
    }
  }

  await supabase.from("inventory_search_events").insert({
    user_id: user.id,
    raw_query: query,
    selected_product_type_id: qualityCandidates[0]?.product_type_id ?? null,
    confidence_bucket: qualityCandidates[0]?.confidence_bucket ?? null,
    was_confirmed: false,
  });

  return json({
    match: qualityCandidates[0] ?? null,
    candidates: qualityCandidates,
  });
}
