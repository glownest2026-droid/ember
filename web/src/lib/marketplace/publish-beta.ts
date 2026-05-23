import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { SellerLocationInput } from "./beta-listing-types";
import { mergeSellerLocation, normalizeUkPostcodeOutward } from "./location";
import { isDraftReadyForOpportunity } from "./draft-readiness";
import { buildOpportunityForDraft } from "./opportunity-service";

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

export async function publishBetaListingFromDraft(
  supabase: SupabaseClient,
  draft: DraftRow,
  locationOverride?: SellerLocationInput | null
): Promise<
  | { listing: { id: string; status: string }; created: boolean }
  | { error: string; status: number }
> {
  const readiness = isDraftReadyForOpportunity(draft);
  if (!readiness.ready) {
    return {
      error: "Review your draft before publishing to nearby families.",
      status: 400,
    };
  }

  const { data: existing } = await supabase
    .from("marketplace_listings")
    .select("id, status")
    .eq("source_draft_id", draft.id)
    .eq("status", "published_beta")
    .maybeSingle();

  if (existing?.id) {
    return { listing: { id: existing.id, status: existing.status }, created: false };
  }

  if (!locationOverride?.approximate_area_label?.trim()) {
    const { data: prefs } = await supabase
      .from("marketplace_preferences")
      .select("postcode")
      .eq("user_id", draft.user_id)
      .maybeSingle();
    if (!prefs?.postcode?.trim() && !locationOverride?.postcode?.trim()) {
      return {
        error: "Add an approximate area before publishing.",
        status: 400,
      };
    }
  }

  const opportunityResult = await buildOpportunityForDraft(supabase, draft, locationOverride);
  if ("error" in opportunityResult) {
    return { error: opportunityResult.error, status: opportunityResult.status };
  }

  const { opportunity } = opportunityResult;
  const location = mergeSellerLocation(
    null,
    locationOverride ?? {
      approximate_area_label: opportunity.approximate_area_label,
    }
  );

  const details = draft.listing_draft_details_json as { category_label?: string } | null;
  const item_label =
    draft.ai_raw_response_json?.parent_confirmed_display_label?.trim() ||
    draft.title_draft?.trim() ||
    null;

  const outward = normalizeUkPostcodeOutward(locationOverride?.postcode ?? null);

  const { data: listing, error: insertError } = await supabase
    .from("marketplace_listings")
    .insert({
      user_id: draft.user_id,
      source_draft_id: draft.id,
      title: draft.title_draft?.trim(),
      description: draft.description_draft?.trim(),
      condition: draft.condition_confirmed_by_user,
      item_label,
      category_label: details?.category_label ?? null,
      price_low: opportunity.price.price_low,
      price_high: opportunity.price.price_high,
      price_currency: opportunity.price.currency,
      price_confidence: opportunity.price.confidence,
      price_source_type: opportunity.price.source_type,
      price_guidance_json: opportunity.price,
      approximate_area_label: location.approximate_area_label,
      approximate_lat: location.lat,
      approximate_lng: location.lng,
      radius_miles: location.radius_miles,
      image_storage_path: draft.image_storage_path,
      postcode: outward,
      status: "published_beta",
      published_at: new Date().toISOString(),
    })
    .select("id, status")
    .single();

  if (insertError || !listing?.id) {
    return { error: insertError?.message ?? "Could not publish listing.", status: 500 };
  }

  await supabase
    .from("marketplace_listing_drafts")
    .update({ status: "published" })
    .eq("id", draft.id)
    .eq("user_id", draft.user_id);

  await supabase
    .from("marketplace_opportunity_snapshots")
    .update({ listing_id: listing.id })
    .eq("id", opportunity.snapshot_id);

  if (locationOverride?.postcode?.trim()) {
    await supabase.from("marketplace_preferences").upsert(
      {
        user_id: draft.user_id,
        postcode: locationOverride.postcode.trim(),
        lat: location.lat,
        lng: location.lng,
        radius_miles: location.radius_miles,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }

  return { listing: { id: listing.id, status: listing.status }, created: true };
}
