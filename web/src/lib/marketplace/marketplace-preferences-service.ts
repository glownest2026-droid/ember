import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { geocodeUkPostcode, reverseGeocodeUkLatLng } from "./geocode-uk-postcode";
import {
  areaLabelFromPostcode,
  normalizeUkPostcode,
  normalizeUkPostcodeOutward,
} from "./postcode";
import type { ResolvedSellerLocation } from "./location";

export const DEFAULT_MARKETPLACE_RADIUS_MILES = 5;

export type MarketplacePreferencesRow = {
  postcode: string | null;
  lat: number | null;
  lng: number | null;
  radius_miles: number;
  approximate_area_label: string | null;
};

export async function getMarketplacePreferencesForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<MarketplacePreferencesRow | null> {
  const { data } = await supabase
    .from("marketplace_preferences")
    .select("postcode, lat, lng, radius_miles")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;

  const postcode = data.postcode ? normalizeUkPostcode(data.postcode) : null;
  const radius = Number(data.radius_miles ?? DEFAULT_MARKETPLACE_RADIUS_MILES);

  return {
    postcode,
    lat: data.lat != null ? Number(data.lat) : null,
    lng: data.lng != null ? Number(data.lng) : null,
    radius_miles: radius > 0 ? radius : DEFAULT_MARKETPLACE_RADIUS_MILES,
    approximate_area_label: areaLabelFromPostcode(postcode),
  };
}

export type SaveMarketplacePreferencesInput = {
  postcode?: string | null;
  lat?: number | null;
  lng?: number | null;
  radius_miles?: number | null;
};

export async function saveMarketplacePreferencesForUser(
  supabase: SupabaseClient,
  userId: string,
  input: SaveMarketplacePreferencesInput
): Promise<{ preferences: MarketplacePreferencesRow } | { error: string }> {
  const existing = await getMarketplacePreferencesForUser(supabase, userId);
  const radius =
    input.radius_miles != null && input.radius_miles > 0
      ? Number(input.radius_miles)
      : (existing?.radius_miles ?? DEFAULT_MARKETPLACE_RADIUS_MILES);

  let postcode = input.postcode !== undefined ? input.postcode : (existing?.postcode ?? null);
  let lat = input.lat !== undefined ? input.lat : (existing?.lat ?? null);
  let lng = input.lng !== undefined ? input.lng : (existing?.lng ?? null);

  if (input.lat != null && input.lng != null && !input.postcode) {
    const reversed = await reverseGeocodeUkLatLng(Number(input.lat), Number(input.lng));
    if (!reversed) {
      return {
        error:
          "Could not find a UK postcode for your location. Enter your postcode manually instead.",
      };
    }
    postcode = reversed.postcode;
    lat = reversed.lat;
    lng = reversed.lng;
  } else if (postcode?.trim()) {
    const normalized = normalizeUkPostcode(postcode);
    if (!normalized) {
      return { error: "Enter a full UK postcode (e.g. SL4 2ABC)." };
    }
    const geocoded = await geocodeUkPostcode(normalized);
    if (!geocoded) {
      return { error: "That postcode could not be found. Check it and try again." };
    }
    postcode = geocoded.postcode;
    lat = geocoded.lat;
    lng = geocoded.lng;
  } else if (!postcode?.trim()) {
    return { error: "Enter your postcode or use your location." };
  }

  const { error } = await supabase.from("marketplace_preferences").upsert(
    {
      user_id: userId,
      postcode,
      lat,
      lng,
      radius_miles: radius,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: error.message };

  return {
    preferences: {
      postcode,
      lat,
      lng,
      radius_miles: radius,
      approximate_area_label: areaLabelFromPostcode(postcode),
    },
  };
}

/** Account-wide location used for nearby matching, listings, and opportunity. */
export async function resolveUserMarketplaceLocation(
  supabase: SupabaseClient,
  userId: string,
  override?: {
    approximate_area_label?: string | null;
    postcode?: string | null;
    lat?: number | null;
    lng?: number | null;
    radius_miles?: number | null;
  } | null
): Promise<ResolvedSellerLocation> {
  const prefs = await getMarketplacePreferencesForUser(supabase, userId);

  let postcode = override?.postcode?.trim() ? normalizeUkPostcode(override.postcode) : null;
  let lat = override?.lat ?? null;
  let lng = override?.lng ?? null;
  const radius =
    override?.radius_miles != null && override.radius_miles > 0
      ? Number(override.radius_miles)
      : (prefs?.radius_miles ?? DEFAULT_MARKETPLACE_RADIUS_MILES);

  if (!postcode && prefs?.postcode) {
    postcode = prefs.postcode;
    lat = lat ?? prefs.lat;
    lng = lng ?? prefs.lng;
  }

  if (postcode && (lat == null || lng == null)) {
    const geocoded = await geocodeUkPostcode(postcode);
    if (geocoded) {
      postcode = geocoded.postcode;
      lat = geocoded.lat;
      lng = geocoded.lng;
    }
  }

  const approximate_area_label =
    override?.approximate_area_label?.trim() ||
    areaLabelFromPostcode(postcode) ||
    prefs?.approximate_area_label ||
    "Your area";

  const confidence: "low" | "medium" =
    lat != null && lng != null ? "medium" : postcode ? "medium" : "low";

  return {
    approximate_area_label,
    postcode,
    postcode_outward: normalizeUkPostcodeOutward(postcode),
    lat: lat != null && Number.isFinite(lat) ? lat : null,
    lng: lng != null && Number.isFinite(lng) ? lng : null,
    radius_miles: radius,
    confidence,
  };
}
