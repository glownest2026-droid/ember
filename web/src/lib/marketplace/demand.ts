import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { geocodeUkPostcode } from "./geocode-uk-postcode";
import { haversineMiles } from "./distance";
import type { DemandConfidence, DemandSignal } from "./beta-listing-types";
import type { ResolvedSellerLocation } from "./location";
import { normalizeUkPostcode } from "./postcode";

type DemandInput = {
  sellerUserId: string;
  productTypeId: string | null;
  listingId?: string | null;
  location: ResolvedSellerLocation;
};

type PrefsRow = {
  user_id: string;
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  radius_miles?: number | null;
};

const buyerCoordsCache = new Map<string, { lat: number; lng: number } | null>();

async function buyerCoords(row: PrefsRow): Promise<{ lat: number; lng: number } | null> {
  const lat = row.lat != null ? Number(row.lat) : null;
  const lng = row.lng != null ? Number(row.lng) : null;
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  if (buyerCoordsCache.has(row.user_id)) {
    return buyerCoordsCache.get(row.user_id) ?? null;
  }

  const postcode = row.postcode ? normalizeUkPostcode(row.postcode) : null;
  if (!postcode) {
    buyerCoordsCache.set(row.user_id, null);
    return null;
  }

  const geocoded = await geocodeUkPostcode(postcode);
  const coords = geocoded ? { lat: geocoded.lat, lng: geocoded.lng } : null;
  buyerCoordsCache.set(row.user_id, coords);
  return coords;
}

function demandDisplayCopy(total: number): string {
  if (total <= 0) return "No clear local Ember signal yet.";
  if (total === 1) return "1 nearby family may be interested.";
  return `${total} nearby families may be interested.`;
}

function supportingCopy(confidence: DemandConfidence, hasCoords: boolean): string {
  if (confidence === "low") {
    return "Early signal based on limited Ember activity.";
  }
  if (hasCoords) {
    return "Based on age-stage fit and recent Ember activity within 5 miles.";
  }
  return "Based on approximate area and recent Ember activity on Ember.";
}

async function isNearby(
  seller: ResolvedSellerLocation,
  buyer: PrefsRow
): Promise<boolean> {
  if (seller.lat == null || seller.lng == null) return false;
  const coords = await buyerCoords(buyer);
  if (!coords) return false;
  return haversineMiles(seller.lat, seller.lng, coords.lat, coords.lng) <= seller.radius_miles;
}

export async function buildDemandSignal(
  supabase: SupabaseClient,
  input: DemandInput
): Promise<DemandSignal> {
  const { data: prefsRows } = await supabase
    .from("marketplace_preferences")
    .select("user_id, postcode, lat, lng, radius_miles");

  const nearbyUserIds = new Set<string>();
  for (const row of (prefsRows ?? []) as PrefsRow[]) {
    if (row.user_id === input.sellerUserId) continue;
    if (await isNearby(input.location, row)) nearbyUserIds.add(row.user_id);
  }

  let behavioural_interest_count = 0;
  if (input.productTypeId && nearbyUserIds.size > 0) {
    const ids = Array.from(nearbyUserIds);
    const { count } = await supabase
      .from("garage_items")
      .select("id", { count: "exact", head: true })
      .in("user_id", ids)
      .eq("product_type_id", input.productTypeId);
    behavioural_interest_count = count ?? 0;
  }

  let soft_stage_match_count = 0;
  if (nearbyUserIds.size > 0) {
    const ids = Array.from(nearbyUserIds);
    const { count } = await supabase
      .from("children")
      .select("id", { count: "exact", head: true })
      .in("user_id", ids);
    soft_stage_match_count = Math.min(count ?? 0, 3);
  }

  let explicit_interest_count = 0;
  if (input.listingId) {
    const { count } = await supabase
      .from("marketplace_listing_interests")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", input.listingId)
      .eq("status", "interested");
    explicit_interest_count = count ?? 0;
  }

  const total_may_be_interested_count =
    behavioural_interest_count + soft_stage_match_count + explicit_interest_count;

  const hasCoords = input.location.lat != null && input.location.lng != null;
  let confidence: DemandConfidence = "low";
  if (total_may_be_interested_count >= 3 && hasCoords) confidence = "high";
  else if (total_may_be_interested_count >= 1) confidence = "medium";

  return {
    radius_miles: input.location.radius_miles,
    approximate_area_label: input.location.approximate_area_label,
    soft_stage_match_count,
    behavioural_interest_count,
    explicit_interest_count,
    total_may_be_interested_count,
    confidence,
    breakdown: {
      soft_stage_match_count,
      behavioural_interest_count,
      explicit_interest_count,
    },
    display_copy: demandDisplayCopy(total_may_be_interested_count),
    supporting_copy: supportingCopy(confidence, hasCoords),
  };
}
