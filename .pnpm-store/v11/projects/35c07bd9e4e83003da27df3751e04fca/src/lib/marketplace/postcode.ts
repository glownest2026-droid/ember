/** UK postcode helpers (safe for client and server). */

const FULL_UK_POSTCODE =
  /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;

/**
 * Normalise to canonical UK full postcode (e.g. "SL4 2ABC").
 * Returns null if not a complete postcode.
 */
export function normalizeUkPostcode(postcode: string | null | undefined): string | null {
  const compact = String(postcode ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!compact) return null;
  const match = compact.match(FULL_UK_POSTCODE);
  if (!match?.[1] || !match[2]) return null;
  return `${match[1]} ${match[2]}`;
}

/** Outward code for approximate area labels only (not used for distance matching). */
export function normalizeUkPostcodeOutward(postcode: string | null | undefined): string | null {
  const full = normalizeUkPostcode(postcode);
  if (full) return full.split(" ")[0] ?? null;
  const raw = String(postcode ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
  if (!raw) return null;
  const parts = raw.split(" ");
  if (parts.length >= 2) return parts[0] ?? null;
  if (raw.length >= 2 && /^[A-Z]{1,2}\d[A-Z\d]?$/i.test(raw)) return raw;
  return null;
}

export function areaLabelFromPostcode(postcode: string | null | undefined): string | null {
  const outward = normalizeUkPostcodeOutward(postcode);
  if (!outward) return null;
  return `${outward} area`;
}

export function isValidUkPostcode(postcode: string | null | undefined): boolean {
  return normalizeUkPostcode(postcode) != null;
}
