import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";
import { resolveAtHomeAiMatch } from "@/lib/inventory/at-home-ai-match";
import {
  atHomeTextClassifyLimitReachedMessage,
  countAtHomeTextClassifyEventsLast24h,
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
    },
    cost_estimate: null,
    success: args.success,
    error_message: args.errorMessage,
  });
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

  if (qualityCandidates.length === 0 && query.length >= 3) {
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
