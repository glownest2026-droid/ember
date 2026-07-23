/**
 * ABI coverage-state helper (PR9).
 *
 * Ember currently only has editorial ABI / buying-guide content for the
 * 31–33 month age band. Other bands are MISSING CONTENT COVERAGE — they are
 * NOT "no developmental need". This helper classifies how grounded a
 * marketplace intelligence mapping is.
 *
 * Pure module (no server-only imports) so it can be unit-tested offline.
 */

import { isAllowedStage1Slug } from "./marketplace-taxonomy";

export type CoverageState =
  | "exact_age_band_content"
  | "adjacent_age_band_content"
  | "marketplace_item_estimate_only"
  | "no_editorial_content_coverage";

/** Age band that currently has editorial ABI content (pilot). */
export const ABI_EDITORIAL_MIN_MONTHS = 31;
export const ABI_EDITORIAL_MAX_MONTHS = 33;
/** How far either side of the editorial band still counts as "adjacent". */
const ADJACENT_TOLERANCE_MONTHS = 3;

export type CoverageStateInput = {
  /** Child age in months, if known. */
  child_age_months?: number | null;
  /** Or an explicit age band range, if known. */
  age_band_min_months?: number | null;
  age_band_max_months?: number | null;
  stage1_wrapper_ux_slug?: string | null;
  stage2_category_type_slug?: string | null;
  /**
   * Whether exact ABI editorial content exists for this band+slug.
   * The route can pass the result of a real DB lookup; offline tests pass false.
   */
  has_exact_abi_content?: boolean | null;
  /** Whether a usable marketplace taxonomy estimate (mapping) exists. */
  has_marketplace_estimate?: boolean | null;
};

function bandOverlapsEditorial(min: number | null, max: number | null): "exact" | "adjacent" | "none" {
  if (min === null && max === null) return "none";
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? lo;
  // Overlaps the editorial band directly.
  if (hi >= ABI_EDITORIAL_MIN_MONTHS && lo <= ABI_EDITORIAL_MAX_MONTHS) return "exact";
  // Within tolerance either side.
  if (
    hi >= ABI_EDITORIAL_MIN_MONTHS - ADJACENT_TOLERANCE_MONTHS &&
    lo <= ABI_EDITORIAL_MAX_MONTHS + ADJACENT_TOLERANCE_MONTHS
  ) {
    return "adjacent";
  }
  return "none";
}

export function resolveCoverageState(input: CoverageStateInput): CoverageState {
  const hasMapping =
    Boolean(input.has_marketplace_estimate) || isAllowedStage1Slug(input.stage1_wrapper_ux_slug);

  // Determine the age band we are reasoning about.
  let min = typeof input.age_band_min_months === "number" ? input.age_band_min_months : null;
  let max = typeof input.age_band_max_months === "number" ? input.age_band_max_months : null;
  if (min === null && max === null && typeof input.child_age_months === "number") {
    min = input.child_age_months;
    max = input.child_age_months;
  }

  const overlap = bandOverlapsEditorial(min, max);

  // Exact editorial content only if it genuinely exists for this band/slug.
  if (overlap === "exact" && input.has_exact_abi_content) {
    return "exact_age_band_content";
  }

  // Adjacent: defensible when a related ABI slug exists but not the exact age.
  if ((overlap === "exact" || overlap === "adjacent") && input.has_exact_abi_content) {
    return "adjacent_age_band_content";
  }

  // No ABI content for the band, but we have a marketplace taxonomy estimate.
  if (hasMapping) {
    return "marketplace_item_estimate_only";
  }

  // No usable mapping at all. (Still NOT "no developmental need".)
  return "no_editorial_content_coverage";
}
