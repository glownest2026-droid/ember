/**
 * Explain why a nearby listing is or is not counted under a development wrapper (tests/dev).
 */

import type { ChildMarketplaceContext } from "@/lib/marketplace/child-marketplace-context";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import {
  enrichListingForBuyerMatch,
  isPersonalisedCaution,
  isPersonalisedRecommended,
  listingMatchesWrapper,
  type DevMappingRow,
  type EnrichedBuyerListingMatch,
  type ItemTypeRow,
  type ListingIntelligenceRow,
} from "@/lib/marketplace/listing-match-enrichment";
import { resolveObviousItemTypeSlugFromListingText } from "@/lib/marketplace/marketplace-item-type-resolver";

export type DevelopmentMatchDiagnostic = {
  listing_id: string;
  item_label: string | null;
  item_type_slug: string | null;
  wrapper_slugs: Stage1WrapperSlug[];
  recommendation_eligibility: string;
  counts_as_recommended_for_wrapper: boolean;
  excluded_reason: string | null;
};

export function diagnoseListingDevelopmentMatch(args: {
  listingId: string;
  itemLabel: string | null;
  sellerUserId: string;
  buyerUserId: string;
  childContext: ChildMarketplaceContext;
  wrapperSlug: Stage1WrapperSlug;
  intelligence: ListingIntelligenceRow | null;
  mappings: DevMappingRow[];
  itemType: ItemTypeRow | null;
}): DevelopmentMatchDiagnostic {
  if (args.sellerUserId === args.buyerUserId) {
    return {
      listing_id: args.listingId,
      item_label: args.itemLabel,
      item_type_slug: null,
      wrapper_slugs: [],
      recommendation_eligibility: "excluded",
      counts_as_recommended_for_wrapper: false,
      excluded_reason: "own_listing",
    };
  }

  const obviousSlug = resolveObviousItemTypeSlugFromListingText(args.itemLabel);
  const itemTypeSlug =
    args.itemType?.slug ??
    args.intelligence?.marketplace_item_type_slug ??
    obviousSlug;

  const canPersonalise =
    args.childContext.mode === "personalised" && args.childContext.age_months !== null;

  const match: EnrichedBuyerListingMatch = enrichListingForBuyerMatch({
    intelligence: args.intelligence,
    mappings: args.mappings,
    itemType: args.itemType,
    itemLabel: args.itemLabel,
    childAgeMonths: canPersonalise ? args.childContext.age_months : null,
    childLookaheadMonths: args.childContext.lookahead_months,
  });

  let excluded_reason: string | null = null;
  if (!canPersonalise) {
    excluded_reason = "child_not_personalised";
  } else if (match.wrapper_slugs.length === 0) {
    excluded_reason = args.intelligence
      ? "missing_development_mapping"
      : "missing_intelligence_and_no_title_fallback";
  } else if (!listingMatchesWrapper(match, args.wrapperSlug)) {
    excluded_reason = "wrapper_not_mapped";
  } else if (isPersonalisedCaution(match)) {
    excluded_reason = `eligibility_${match.recommendation_eligibility}`;
  } else if (!isPersonalisedRecommended(match)) {
    excluded_reason = `eligibility_${match.recommendation_eligibility}`;
  }

  const counts =
    canPersonalise &&
    listingMatchesWrapper(match, args.wrapperSlug) &&
    isPersonalisedRecommended(match);

  return {
    listing_id: args.listingId,
    item_label: args.itemLabel,
    item_type_slug: itemTypeSlug,
    wrapper_slugs: match.wrapper_slugs,
    recommendation_eligibility: match.recommendation_eligibility,
    counts_as_recommended_for_wrapper: counts,
    excluded_reason: counts ? null : excluded_reason,
  };
}
