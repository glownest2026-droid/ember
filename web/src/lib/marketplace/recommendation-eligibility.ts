/**
 * Recommendation eligibility helper (PR9).
 *
 * Foundation for future buyer matching (PR10/PR11). Decides, cautiously,
 * whether a marketplace item should be personalised to a child.
 *
 * Core principles:
 * - Manufacturer age guidance wins when known.
 * - AI estimates are never described as "suitable" or "safe".
 * - Matching window is the child's current age + lookahead (default 6 months).
 *
 * Pure module (no server-only imports) so it can be unit-tested offline.
 */

import type { RecommendationPolicy, RiskLevel } from "./marketplace-taxonomy";

export type RecommendationEligibility =
  | "recommended"
  | "browse_with_caution"
  | "do_not_recommend"
  | "review_needed";

export type RecommendationEligibilityInput = {
  child_age_months?: number | null;
  child_lookahead_months?: number | null;
  ai_estimated_min_age_months?: number | null;
  ai_estimated_max_age_months?: number | null;
  parent_confirmed_min_age_months?: number | null;
  parent_confirmed_max_age_months?: number | null;
  manufacturer_min_age_months?: number | null;
  manufacturer_max_age_months?: number | null;
  risk_level?: RiskLevel | null;
  recommendation_policy?: RecommendationPolicy | null;
  safety_flags?: string[] | null;
};

export type RecommendationEligibilityResult = {
  eligibility: RecommendationEligibility;
  reason: string;
  safety_copy: string;
};

const DEFAULT_LOOKAHEAD = 6;

function num(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/**
 * Resolves the effective minimum age. Manufacturer guidance wins, then
 * parent-confirmed, then AI estimate.
 */
function resolveEffectiveMin(input: RecommendationEligibilityInput): {
  min: number | null;
  source: "manufacturer" | "parent" | "ai" | "none";
} {
  const manufacturer = num(input.manufacturer_min_age_months);
  if (manufacturer !== null) return { min: manufacturer, source: "manufacturer" };
  const parent = num(input.parent_confirmed_min_age_months);
  if (parent !== null) return { min: parent, source: "parent" };
  const ai = num(input.ai_estimated_min_age_months);
  if (ai !== null) return { min: ai, source: "ai" };
  return { min: null, source: "none" };
}

export function computeRecommendationEligibility(
  input: RecommendationEligibilityInput
): RecommendationEligibilityResult {
  const policy: RecommendationPolicy = input.recommendation_policy ?? "recommendable";
  const risk: RiskLevel = input.risk_level ?? "low";
  const childAge = num(input.child_age_months);
  const lookahead = num(input.child_lookahead_months) ?? DEFAULT_LOOKAHEAD;
  const windowTop = childAge !== null ? childAge + lookahead : null;

  const { min: effectiveMin, source } = resolveEffectiveMin(input);

  // 3. Hard policy: never recommend.
  if (policy === "do_not_recommend" || risk === "restricted") {
    return {
      eligibility: "do_not_recommend",
      reason: "Item policy or risk level prevents personalised recommendation.",
      safety_copy: "This item isn’t recommended through Ember. Please check age guidance before buying.",
    };
  }

  // 1 + 2. Manufacturer guidance wins. If the manufacturer min age is clearly
  // above the child's matching window, do not personalise as recommended.
  if (source === "manufacturer" && effectiveMin !== null && windowTop !== null && effectiveMin > windowTop) {
    const eligibility: RecommendationEligibility = risk === "high" ? "do_not_recommend" : "browse_with_caution";
    return {
      eligibility,
      reason: `Manufacturer minimum age (${effectiveMin}m) is above the child's matching window (${windowTop}m).`,
      safety_copy: "Older-child item. Check age guidance before buying.",
    };
  }

  // Same caution for parent/AI estimates that are clearly above the window,
  // but never assert suitability.
  if (effectiveMin !== null && windowTop !== null && effectiveMin > windowTop) {
    return {
      eligibility: "browse_with_caution",
      reason: `Estimated minimum age (${effectiveMin}m, ${source}) is above the child's matching window (${windowTop}m).`,
      safety_copy: "This item may be better for a later stage.",
    };
  }

  // 4. Cautious policy.
  if (policy === "browse_with_caution") {
    const childInWindow =
      childAge !== null &&
      effectiveMin !== null &&
      childAge + lookahead >= effectiveMin;
    if (childInWindow && (risk === "low" || risk === "medium")) {
      return {
        eligibility: "browse_with_caution",
        reason: "Cautious-policy item within the child's matching window.",
        safety_copy: "Estimated play stage, please check manufacturer age guidance.",
      };
    }
    return {
      eligibility: "browse_with_caution",
      reason: "Cautious-policy item; review age and safety before recommending.",
      safety_copy: "Please check the manufacturer’s age guidance before buying.",
    };
  }

  // 5. Only an AI estimate exists -> cautious wording, never "suitable".
  if (source === "ai") {
    return {
      eligibility: "browse_with_caution",
      reason: "Only an AI estimate is available for age suitability.",
      safety_copy: "Estimated play stage, please check manufacturer age guidance.",
    };
  }

  // Recommendable with manufacturer/parent confidence and acceptable risk.
  if (effectiveMin === null) {
    return {
      eligibility: "review_needed",
      reason: "No age guidance available to assess suitability.",
      safety_copy: "Please check the manufacturer’s age guidance before buying.",
    };
  }

  return {
    eligibility: "recommended",
    reason: `Within the child's matching window using ${source} guidance.`,
    safety_copy: "Please check the manufacturer’s age guidance if shown.",
  };
}
