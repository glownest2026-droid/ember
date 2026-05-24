import type { DemandConfidence } from "./beta-listing-types";

const FULL_UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}$/i;

/** Normalise area labels and avoid leaking full postcodes in buyer-facing UI. */
export function ensureAreaLabel(label: string | null | undefined, fallback = "Approximate area"): string {
  const trimmed = String(label ?? "").trim();
  if (!trimmed) return fallback;
  if (FULL_UK_POSTCODE.test(trimmed)) {
    const outward = trimmed.split(" ")[0];
    return outward ? `${outward} area` : fallback;
  }
  return trimmed;
}

export function formatAreaRadiusHeadline(areaLabel: string, radiusMiles: number): string {
  return `${ensureAreaLabel(areaLabel)} + ${radiusMiles} miles`;
}

export function formatDemandPrimaryCopy(count: number): string {
  if (count <= 0) return "No clear local signal yet";
  if (count === 1) return "1 nearby family may be interested";
  return `${count} nearby families may be interested`;
}

export function formatDemandSupportingCopy(
  confidence: DemandConfidence | undefined,
  hasDemand: boolean
): string {
  if (!hasDemand) return "Nearby families can still discover this once listed.";
  if (confidence === "low") return "Early signal based on limited Ember activity.";
  return "Based on age-stage fit and recent Ember activity.";
}

export function formatMarketplaceListingCopy(count: number, areaLabel: string): string {
  const area = ensureAreaLabel(areaLabel);
  if (count <= 0) return "No nearby listings yet";
  if (count === 1) return `1 nearby listing around ${area}`;
  return `${count} nearby listings around ${area}`;
}

export function formatListingLocalCue(
  areaLabel: string | null | undefined,
  radiusMiles?: number | null
): string {
  const area = ensureAreaLabel(areaLabel);
  const radius = radiusMiles ?? 5;
  return `${area} · within ${radius} miles`;
}

export const OPPORTUNITY_MAP_PRIVACY_COPY =
  "Approximate area only. Exact addresses are not shown.";

export function hotspotBlobCount(count: number): number {
  if (count <= 0) return 0;
  return Math.min(count, 5);
}

/** Smoke-test helper: buyer-facing copy must not expose a full UK postcode. */
export function displayStringHidesFullPostcode(text: string): boolean {
  return !FULL_UK_POSTCODE.test(text.trim());
}
