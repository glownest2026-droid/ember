import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDemandSignal } from "./demand";
import type { OpportunityPayload, SellerLocationInput } from "./beta-listing-types";
import { isDraftReadyForOpportunity } from "./draft-readiness";
import { resolveUserMarketplaceLocation } from "./marketplace-preferences-service";
import { buildPriceGuidance } from "./price-guidance";

type DraftRow = {
  id: string;
  user_id: string;
  product_type_id: string | null;
  status: string;
  image_storage_path: string | null;
  title_draft: string | null;
  description_draft: string | null;
  condition_confirmed_by_user: string | null;
  listing_draft_details_json: unknown;
  ai_raw_response_json: { parent_confirmed_display_label?: string } | null;
};

export async function buildOpportunityForDraft(
  supabase: SupabaseClient,
  draft: DraftRow,
  locationOverride?: SellerLocationInput | null
): Promise<{ opportunity: OpportunityPayload } | { error: string; status: number }> {
  const readiness = isDraftReadyForOpportunity(draft);
  if (!readiness.ready) {
    return {
      error: "Review your draft before seeing the marketplace opportunity.",
      status: 400,
    };
  }

  const location = await resolveUserMarketplaceLocation(supabase, draft.user_id, {
    approximate_area_label: locationOverride?.approximate_area_label,
    postcode: locationOverride?.postcode,
    lat: locationOverride?.lat,
    lng: locationOverride?.lng,
  });

  const details = draft.listing_draft_details_json as { category_label?: string } | null;
  const item_label =
    draft.ai_raw_response_json?.parent_confirmed_display_label?.trim() ||
    draft.title_draft?.trim() ||
    "Item";
  const category_label = details?.category_label ?? null;

  const price = await buildPriceGuidance({
    item_label,
    category_label,
    condition: String(draft.condition_confirmed_by_user),
  });

  const demand = await buildDemandSignal(supabase, {
    sellerUserId: draft.user_id,
    productTypeId: draft.product_type_id,
    location,
  });

  const map_summary = {
    area_label: location.approximate_area_label,
    radius_miles: location.radius_miles,
    hotspot_count: Math.min(demand.total_may_be_interested_count, 5),
    provider: "provider_light" as const,
  };

  const { data: existingListing } = await supabase
    .from("marketplace_listings")
    .select("id")
    .eq("source_draft_id", draft.id)
    .eq("status", "published_beta")
    .maybeSingle();

  const { data: snapshot, error: snapError } = await supabase
    .from("marketplace_opportunity_snapshots")
    .insert({
      draft_id: draft.id,
      listing_id: existingListing?.id ?? null,
      user_id: draft.user_id,
      item_label,
      category_label,
      price_low: price.price_low,
      price_high: price.price_high,
      price_currency: price.currency,
      price_confidence: price.confidence,
      price_source_type: price.source_type,
      price_guidance_json: price,
      local_radius_miles: location.radius_miles,
      approximate_area_label: location.approximate_area_label,
      soft_stage_match_count: demand.soft_stage_match_count,
      behavioural_interest_count: demand.behavioural_interest_count,
      explicit_interest_count: demand.explicit_interest_count,
      total_may_be_interested_count: demand.total_may_be_interested_count,
      demand_confidence: demand.confidence,
      demand_breakdown_json: demand.breakdown,
      map_summary_json: map_summary,
    })
    .select("id")
    .single();

  if (snapError || !snapshot?.id) {
    return { error: snapError?.message ?? "Could not save opportunity.", status: 500 };
  }

  return {
    opportunity: {
      snapshot_id: snapshot.id,
      price,
      demand,
      map_summary,
      approximate_area_label: location.approximate_area_label,
    },
  };
}
