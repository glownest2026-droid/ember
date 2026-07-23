import { formatConditionLabel, formatPriceRange } from "./beta-listing-display";
import type { PriceGuidance } from "./beta-listing-types";
import { resolveListingMapMarker } from "./marketplace-map-coordinates";

type ListingRow = {
  id: string;
  user_id: string;
  title: string | null;
  item_label: string | null;
  condition: string | null;
  price_low: number | null;
  price_high: number | null;
  price_currency: string | null;
  approximate_area_label: string | null;
  approximate_lat: number | null;
  approximate_lng: number | null;
  radius_miles: number | null;
  status: string;
  published_at: string | null;
  image_storage_path: string | null;
};

export type MarketplaceMapListingPayload = {
  id: string;
  user_id: string;
  title: string | null;
  item_label: string | null;
  condition: string | null;
  price_low: number | null;
  price_high: number | null;
  price_currency: string | null;
  approximate_area_label: string | null;
  radius_miles: number | null;
  status: string;
  published_at: string | null;
  map_marker_lat: number | null;
  map_marker_lng: number | null;
  buyer_interested?: boolean;
  conversation_id?: string | null;
  interest_count?: number;
};

function priceLabelFromRow(row: {
  price_low: number | null;
  price_high: number | null;
  price_currency: string | null;
}): string | null {
  const price: PriceGuidance = {
    price_low: row.price_low,
    price_high: row.price_high,
    currency: row.price_currency ?? "GBP",
    confidence: "medium",
    source_type: "manual_price_band",
    explanation: "",
    caveats: [],
  };
  return formatPriceRange(price);
}

export function toMarketplaceMapListingPayload(
  row: ListingRow,
  extras?: { buyer_interested?: boolean; conversation_id?: string | null; interest_count?: number }
): MarketplaceMapListingPayload {
  const marker = resolveListingMapMarker({
    id: row.id,
    approximate_lat: row.approximate_lat,
    approximate_lng: row.approximate_lng,
    approximate_area_label: row.approximate_area_label,
  });

  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    item_label: row.item_label,
    condition: row.condition,
    price_low: row.price_low,
    price_high: row.price_high,
    price_currency: row.price_currency,
    approximate_area_label: row.approximate_area_label,
    radius_miles: row.radius_miles,
    status: row.status,
    published_at: row.published_at,
    map_marker_lat: marker?.lat ?? null,
    map_marker_lng: marker?.lng ?? null,
    ...extras,
  };
}

export function mapListingToMapProps(
  listing: Pick<
    MarketplaceMapListingPayload,
    | "id"
    | "title"
    | "item_label"
    | "condition"
    | "price_low"
    | "price_high"
    | "price_currency"
    | "approximate_area_label"
    | "map_marker_lat"
    | "map_marker_lng"
  >
): {
  id: string;
  title: string;
  priceLabel: string | null;
  conditionLabel: string | null;
  approximateAreaLabel: string | null;
  map_marker_lat: number;
  map_marker_lng: number;
} | null {
  if (listing.map_marker_lat == null || listing.map_marker_lng == null) return null;
  return {
    id: listing.id,
    title: listing.title ?? listing.item_label ?? "Listing",
    priceLabel: priceLabelFromRow(listing),
    conditionLabel: formatConditionLabel(listing.condition),
    approximateAreaLabel: listing.approximate_area_label,
    map_marker_lat: listing.map_marker_lat,
    map_marker_lng: listing.map_marker_lng,
  };
}
