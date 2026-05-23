import type { SellerLocationInput } from "./beta-listing-types";

export type ResolvedSellerLocation = {
  approximate_area_label: string;
  postcode_outward: string | null;
  lat: number | null;
  lng: number | null;
  radius_miles: number;
  confidence: "low" | "medium";
};

const DEFAULT_RADIUS_MILES = 5;

export function normalizeUkPostcodeOutward(postcode: string | null | undefined): string | null {
  const raw = String(postcode ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
  if (!raw) return null;
  const parts = raw.split(" ");
  if (parts.length >= 2) return parts[0] ?? null;
  if (raw.length >= 3) return raw.slice(0, Math.min(4, raw.length));
  return raw;
}

export function areaLabelFromPostcode(postcode: string | null | undefined): string | null {
  const outward = normalizeUkPostcodeOutward(postcode);
  if (!outward) return null;
  return `${outward} area`;
}

export function mergeSellerLocation(
  prefs: {
    postcode: string | null;
    lat: number | null;
    lng: number | null;
    radius_miles: number | null;
  } | null,
  override?: SellerLocationInput | null
): ResolvedSellerLocation {
  const postcode = override?.postcode?.trim() || prefs?.postcode?.trim() || null;
  const lat = override?.lat ?? (prefs?.lat != null ? Number(prefs.lat) : null);
  const lng = override?.lng ?? (prefs?.lng != null ? Number(prefs.lng) : null);
  const radius = Math.round(
    override ? DEFAULT_RADIUS_MILES : Number(prefs?.radius_miles ?? DEFAULT_RADIUS_MILES)
  );
  const areaFromPostcode = areaLabelFromPostcode(postcode);
  const approximate_area_label =
    override?.approximate_area_label?.trim() ||
    areaFromPostcode ||
    "Your area";

  const confidence: "low" | "medium" =
    lat != null && lng != null ? "medium" : areaFromPostcode ? "medium" : "low";

  return {
    approximate_area_label,
    postcode_outward: normalizeUkPostcodeOutward(postcode),
    lat: lat != null && Number.isFinite(lat) ? lat : null,
    lng: lng != null && Number.isFinite(lng) ? lng : null,
    radius_miles: radius > 0 ? radius : DEFAULT_RADIUS_MILES,
    confidence,
  };
}
