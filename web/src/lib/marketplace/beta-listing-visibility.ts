import "server-only";

import { geocodeUkPostcode } from "./geocode-uk-postcode";
import { haversineMiles } from "./distance";
import type { ResolvedSellerLocation } from "./location";
import { normalizeUkPostcode } from "./postcode";

export type BetaListingRow = {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  condition: string | null;
  item_label: string | null;
  price_low: number | null;
  price_high: number | null;
  price_currency: string | null;
  approximate_area_label: string | null;
  approximate_lat: number | null;
  approximate_lng: number | null;
  radius_miles: number | null;
  postcode: string | null;
  status: string;
  published_at: string | null;
  image_storage_path: string | null;
};

const listingCoordsCache = new Map<string, { lat: number; lng: number } | null>();

async function listingCoords(
  listing: BetaListingRow
): Promise<{ lat: number; lng: number } | null> {
  const lat = listing.approximate_lat != null ? Number(listing.approximate_lat) : null;
  const lng = listing.approximate_lng != null ? Number(listing.approximate_lng) : null;
  if (lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  const cacheKey = listing.id;
  if (listingCoordsCache.has(cacheKey)) {
    return listingCoordsCache.get(cacheKey) ?? null;
  }

  const postcode = listing.postcode ? normalizeUkPostcode(listing.postcode) : null;
  if (!postcode) {
    listingCoordsCache.set(cacheKey, null);
    return null;
  }

  const geocoded = await geocodeUkPostcode(postcode);
  const coords = geocoded ? { lat: geocoded.lat, lng: geocoded.lng } : null;
  listingCoordsCache.set(cacheKey, coords);
  return coords;
}

export async function buyerCanViewBetaListing(
  listing: BetaListingRow,
  buyerUserId: string,
  buyerLocation: ResolvedSellerLocation
): Promise<boolean> {
  if (listing.user_id === buyerUserId) return false;
  if (listing.status !== "published_beta") return false;

  const buyerLat = buyerLocation.lat;
  const buyerLng = buyerLocation.lng;
  if (buyerLat == null || buyerLng == null) return false;

  const coords = await listingCoords(listing);
  if (!coords) return false;

  const radius = buyerLocation.radius_miles;
  return haversineMiles(buyerLat, buyerLng, coords.lat, coords.lng) <= radius;
}
