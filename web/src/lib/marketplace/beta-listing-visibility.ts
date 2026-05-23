import "server-only";

import { haversineMiles, samePostcodeOutward } from "./distance";
import { normalizeUkPostcodeOutward } from "./location";
import type { ResolvedSellerLocation } from "./location";

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

export function buyerCanViewBetaListing(
  listing: BetaListingRow,
  buyerUserId: string,
  buyerLocation: ResolvedSellerLocation
): boolean {
  if (listing.user_id === buyerUserId) return false;
  if (listing.status !== "published_beta") return false;

  const listingLat =
    listing.approximate_lat != null ? Number(listing.approximate_lat) : null;
  const listingLng =
    listing.approximate_lng != null ? Number(listing.approximate_lng) : null;

  if (
    buyerLocation.lat != null &&
    buyerLocation.lng != null &&
    listingLat != null &&
    listingLng != null
  ) {
    const radius = Number(listing.radius_miles ?? buyerLocation.radius_miles);
    return haversineMiles(buyerLocation.lat, buyerLocation.lng, listingLat, listingLng) <= radius;
  }

  return samePostcodeOutward(
    buyerLocation.postcode_outward,
    normalizeUkPostcodeOutward(listing.postcode)
  );
}
