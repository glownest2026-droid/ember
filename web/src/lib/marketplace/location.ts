import type { SellerLocationInput } from "./beta-listing-types";
import { areaLabelFromPostcode, normalizeUkPostcode, normalizeUkPostcodeOutward } from "./postcode";

export type ResolvedSellerLocation = {
  approximate_area_label: string;
  /** Full UK postcode — single source of truth for matching when geocoded. */
  postcode: string | null;
  postcode_outward: string | null;
  lat: number | null;
  lng: number | null;
  radius_miles: number;
  confidence: "low" | "medium";
};

const DEFAULT_RADIUS_MILES = 5;

/** Sync merge for callers that already have geocoded prefs (prefer resolveUserMarketplaceLocation). */
export function mergeSellerLocation(
  prefs: {
    postcode: string | null;
    lat: number | null;
    lng: number | null;
    radius_miles: number | null;
  } | null,
  override?: SellerLocationInput | null
): ResolvedSellerLocation {
  const rawPostcode = override?.postcode?.trim() || prefs?.postcode?.trim() || null;
  const postcode = rawPostcode ? normalizeUkPostcode(rawPostcode) ?? rawPostcode : null;
  const lat = override?.lat ?? (prefs?.lat != null ? Number(prefs.lat) : null);
  const lng = override?.lng ?? (prefs?.lng != null ? Number(prefs.lng) : null);
  const radius = Math.round(Number(prefs?.radius_miles ?? DEFAULT_RADIUS_MILES));
  const areaFromPostcode = areaLabelFromPostcode(postcode);
  const approximate_area_label =
    override?.approximate_area_label?.trim() ||
    areaFromPostcode ||
    "Your area";

  const confidence: "low" | "medium" =
    lat != null && lng != null ? "medium" : postcode ? "medium" : "low";

  return {
    approximate_area_label,
    postcode,
    postcode_outward: normalizeUkPostcodeOutward(postcode),
    lat: lat != null && Number.isFinite(lat) ? lat : null,
    lng: lng != null && Number.isFinite(lng) ? lng : null,
    radius_miles: radius > 0 ? radius : DEFAULT_RADIUS_MILES,
    confidence,
  };
}
