/**
 * Buyer-safe listing match enrichment from PR9 taxonomy + intelligence (no Gemini on buyer page).
 */

import { resolveCoverageState, type CoverageState } from "@/lib/marketplace/coverage-state";
import { getDevelopmentWrapper, type Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import {
  getSeedItemType,
  isAllowedStage1Slug,
  matchSeedItemTypeByText,
  type RecommendationPolicy,
  type RiskLevel,
} from "@/lib/marketplace/marketplace-taxonomy";
import {
  computeRecommendationEligibility,
  type RecommendationEligibility,
} from "@/lib/marketplace/recommendation-eligibility";

export type ListingIntelligenceRow = {
  marketplace_item_type_slug: string | null;
  marketplace_item_type_id: string | null;
  development_area_slugs_json: unknown;
  ai_estimated_min_age_months: number | null;
  ai_estimated_max_age_months: number | null;
  parent_confirmed_min_age_months: number | null;
  parent_confirmed_max_age_months: number | null;
  manufacturer_min_age_months: number | null;
  manufacturer_max_age_months: number | null;
  risk_level: string | null;
  recommendation_eligibility: string | null;
  coverage_state: string | null;
};

export type DevMappingRow = {
  stage1_wrapper_ux_slug: string;
  stage1_wrapper_ux_label: string | null;
  mapping_strength: string | null;
};

export type ItemTypeRow = {
  id?: string;
  slug: string;
  default_min_age_months: number | null;
  default_max_age_months: number | null;
  risk_level: string | null;
  recommendation_policy: string | null;
};

export type EnrichedBuyerListingMatch = {
  wrapper_slugs: Stage1WrapperSlug[];
  primary_wrapper_slug: Stage1WrapperSlug | null;
  recommendation_eligibility: RecommendationEligibility;
  coverage_state: CoverageState;
  match_reason: string | null;
  age_stage_copy: string | null;
  caution_copy: string | null;
  coverage_copy: string | null;
};

function parseSlugArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((s): s is string => typeof s === "string" && isAllowedStage1Slug(s));
}

function ageStageCopy(min: number | null, max: number | null): string | null {
  if (min === null && max === null) return null;
  if (min !== null && max !== null) {
    return `Estimated play stage: around ${min}–${max} months. Please check age guidance.`;
  }
  if (min !== null) return `Estimated play stage: from around ${min} months. Please check age guidance.`;
  return `Estimated play stage: up to around ${max} months. Please check age guidance.`;
}

function coverageCopy(state: CoverageState): string | null {
  if (state === "exact_age_band_content") return null;
  if (state === "marketplace_item_estimate_only") {
    return "Matched using Ember’s marketplace estimate while we build this age stage.";
  }
  if (state === "no_editorial_content_coverage") return null;
  return null;
}

export function resolveWrapperSlugsForListing(args: {
  intelligence: ListingIntelligenceRow | null;
  mappings: DevMappingRow[];
  itemType: ItemTypeRow | null;
  itemLabel: string | null;
}): Stage1WrapperSlug[] {
  const fromIntel = parseSlugArray(args.intelligence?.development_area_slugs_json);
  const fromMappings = args.mappings
    .map((m) => m.stage1_wrapper_ux_slug)
    .filter((s): s is Stage1WrapperSlug => isAllowedStage1Slug(s));
  const slugs = [...new Set([...fromIntel, ...fromMappings])] as Stage1WrapperSlug[];
  if (slugs.length > 0) return slugs;

  const seedSlug =
    args.itemType?.slug ??
    (args.intelligence?.marketplace_item_type_slug &&
    getSeedItemType(args.intelligence.marketplace_item_type_slug)
      ? args.intelligence.marketplace_item_type_slug
      : matchSeedItemTypeByText(args.itemLabel));
  const seed = getSeedItemType(seedSlug);
  if (!seed) return [];
  return seed.development_mappings.map((m) => m.stage1_wrapper_ux_slug);
}

export function enrichListingForBuyerMatch(args: {
  intelligence: ListingIntelligenceRow | null;
  mappings: DevMappingRow[];
  itemType: ItemTypeRow | null;
  itemLabel: string | null;
  childAgeMonths: number | null;
  childLookaheadMonths?: number;
}): EnrichedBuyerListingMatch {
  const wrapperSlugs = resolveWrapperSlugsForListing(args);
  const primary = wrapperSlugs[0] ?? null;

  const itemType = args.itemType;
  const intel = args.intelligence;

  const aiMin = intel?.ai_estimated_min_age_months ?? itemType?.default_min_age_months ?? null;
  const aiMax = intel?.ai_estimated_max_age_months ?? itemType?.default_max_age_months ?? null;

  const eligibilityResult = computeRecommendationEligibility({
    child_age_months: args.childAgeMonths,
    child_lookahead_months: args.childLookaheadMonths ?? 6,
    ai_estimated_min_age_months: aiMin,
    ai_estimated_max_age_months: aiMax,
    parent_confirmed_min_age_months: intel?.parent_confirmed_min_age_months ?? null,
    parent_confirmed_max_age_months: intel?.parent_confirmed_max_age_months ?? null,
    manufacturer_min_age_months: intel?.manufacturer_min_age_months ?? null,
    manufacturer_max_age_months: intel?.manufacturer_max_age_months ?? null,
    risk_level: (intel?.risk_level ?? itemType?.risk_level) as RiskLevel | null,
    recommendation_policy: (itemType?.recommendation_policy ??
      "recommendable") as RecommendationPolicy,
  });

  const coverageState = resolveCoverageState({
    child_age_months: args.childAgeMonths,
    stage1_wrapper_ux_slug: primary,
    has_exact_abi_content: false,
    has_marketplace_estimate: wrapperSlugs.length > 0,
  });

  const primaryLabel = primary ? getDevelopmentWrapper(primary)?.stage1_wrapper_ux_label : null;
  let matchReason: string | null = null;
  if (primaryLabel && eligibilityResult.eligibility === "recommended") {
    matchReason = `May support: ${primaryLabel}`;
  } else if (primaryLabel && eligibilityResult.eligibility === "browse_with_caution") {
    matchReason = `May relate to: ${primaryLabel}`;
  }

  return {
    wrapper_slugs: wrapperSlugs,
    primary_wrapper_slug: primary,
    recommendation_eligibility: eligibilityResult.eligibility,
    coverage_state: coverageState,
    match_reason: matchReason,
    age_stage_copy: ageStageCopy(aiMin, aiMax),
    caution_copy:
      eligibilityResult.eligibility === "browse_with_caution" ||
      eligibilityResult.eligibility === "do_not_recommend"
        ? eligibilityResult.safety_copy
        : null,
    coverage_copy: coverageCopy(coverageState),
  };
}

export function listingMatchesWrapper(
  match: EnrichedBuyerListingMatch,
  wrapperSlug: Stage1WrapperSlug
): boolean {
  return match.wrapper_slugs.includes(wrapperSlug);
}

export function isPersonalisedRecommended(
  match: EnrichedBuyerListingMatch
): boolean {
  return match.recommendation_eligibility === "recommended";
}

export function isPersonalisedCaution(
  match: EnrichedBuyerListingMatch
): boolean {
  return (
    match.recommendation_eligibility === "browse_with_caution" ||
    match.recommendation_eligibility === "review_needed"
  );
}
