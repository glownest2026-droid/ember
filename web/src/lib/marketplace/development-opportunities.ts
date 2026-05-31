/**
 * Marketplace 2.0 development opportunity aggregation (PR10).
 */

import type { ChildMarketplaceContext } from "@/lib/marketplace/child-marketplace-context";
import {
  DEVELOPMENT_WRAPPER_CARDS,
  type Stage1WrapperSlug,
} from "@/lib/marketplace/development-wrappers";
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
import { resolveCoverageState, type CoverageState } from "@/lib/marketplace/coverage-state";

export type NearbyListingForOpportunities = {
  id: string;
  user_id: string;
  source_draft_id: string | null;
  item_label: string | null;
};

export type DevelopmentWrapperOpportunity = {
  stage1_wrapper_ux_slug: Stage1WrapperSlug;
  stage1_wrapper_ux_label: string;
  recommended_count: number;
  caution_count: number;
  watch_mode: boolean;
  coverage_state: CoverageState;
  display_count_label: string;
  helper_copy: string;
  cards_disabled: boolean;
};

export type ListingWithBuyerMatch = {
  listing: NearbyListingForOpportunities;
  match: EnrichedBuyerListingMatch;
};

export type MarketplaceDevelopmentOpportunitiesResult = {
  child_context: ChildMarketplaceContext;
  radius_miles: number;
  area_label: string;
  wrappers: DevelopmentWrapperOpportunity[];
  selected_wrapper_slug: Stage1WrapperSlug | null;
  personalised_listings: ListingWithBuyerMatch[];
  caution_listings: ListingWithBuyerMatch[];
  /** Every nearby listing with match metadata (for API payloads). */
  all_listings: ListingWithBuyerMatch[];
};

function wrapperHelperCopy(coverage: CoverageState, watchMode: boolean): string {
  if (watchMode) {
    return "We’ll watch for local items that fit this development area.";
  }
  if (coverage === "exact_age_band_content") {
    return "Local items that may support this stage over the next few months.";
  }
  if (coverage === "marketplace_item_estimate_only") {
    return "Local items matched using Ember’s estimate for this stage.";
  }
  return "Local items that may support this stage over the next few months.";
}

function displayCountLabel(recommended: number, caution: number, watchMode: boolean): string {
  if (recommended > 0) {
    return `${recommended} local ${recommended === 1 ? "opportunity" : "opportunities"}`;
  }
  if (watchMode) return "Watching for matches";
  if (caution > 0) return "Check guidance";
  return "Watching for matches";
}

export function buildMarketplaceDevelopmentOpportunities(args: {
  childContext: ChildMarketplaceContext;
  radiusMiles: number;
  areaLabel: string;
  nearbyListings: NearbyListingForOpportunities[];
  intelligenceByListingId: Map<string, ListingIntelligenceRow>;
  intelligenceByDraftId: Map<string, ListingIntelligenceRow>;
  mappingsByTypeId: Map<string, DevMappingRow[]>;
  itemTypeBySlug: Map<string, ItemTypeRow>;
  itemTypeById: Map<string, ItemTypeRow>;
  selectedWrapperSlug?: Stage1WrapperSlug | null;
  buyerUserId: string;
}): MarketplaceDevelopmentOpportunitiesResult {
  const canPersonalise =
    args.childContext.mode === "personalised" && args.childContext.age_months !== null;
  const childAge = args.childContext.age_months;
  const cardsDisabled = args.childContext.mode === "all_children";

  const enriched: ListingWithBuyerMatch[] = [];

  for (const listing of args.nearbyListings) {
    if (listing.user_id === args.buyerUserId) continue;

    const intel =
      args.intelligenceByListingId.get(listing.id) ??
      (listing.source_draft_id
        ? args.intelligenceByDraftId.get(listing.source_draft_id) ?? null
        : null);

    const itemType =
      (intel?.marketplace_item_type_id
        ? args.itemTypeById.get(intel.marketplace_item_type_id)
        : null) ??
      (intel?.marketplace_item_type_slug
        ? args.itemTypeBySlug.get(intel.marketplace_item_type_slug)
        : null) ??
      null;

    const typeId =
      intel?.marketplace_item_type_id ??
      itemType?.id ??
      (itemType?.slug
        ? [...args.itemTypeById.entries()].find(([, t]) => t.slug === itemType.slug)?.[0]
        : undefined);
    const mappings = typeId ? args.mappingsByTypeId.get(typeId) ?? [] : [];

    const match = enrichListingForBuyerMatch({
      intelligence: intel,
      mappings,
      itemType,
      itemLabel: listing.item_label,
      childAgeMonths: canPersonalise ? childAge : null,
      childLookaheadMonths: args.childContext.lookahead_months,
    });

    enriched.push({ listing, match });
  }

  const wrappers: DevelopmentWrapperOpportunity[] = DEVELOPMENT_WRAPPER_CARDS.map((card) => {
    const slug = card.stage1_wrapper_ux_slug;
    let recommended_count = 0;
    let caution_count = 0;

    if (canPersonalise) {
      for (const { match } of enriched) {
        if (!listingMatchesWrapper(match, slug)) continue;
        if (isPersonalisedRecommended(match)) recommended_count += 1;
        else if (isPersonalisedCaution(match)) caution_count += 1;
      }
    } else if (!cardsDisabled) {
      for (const { match } of enriched) {
        if (listingMatchesWrapper(match, slug)) recommended_count += 1;
      }
    }

    const watch_mode = canPersonalise && recommended_count === 0;
    const coverage_state = resolveCoverageState({
      child_age_months: childAge,
      stage1_wrapper_ux_slug: slug,
      has_exact_abi_content: false,
      has_marketplace_estimate: true,
    });

    return {
      stage1_wrapper_ux_slug: slug,
      stage1_wrapper_ux_label: card.stage1_wrapper_ux_label,
      recommended_count,
      caution_count,
      watch_mode,
      coverage_state,
      display_count_label: displayCountLabel(recommended_count, caution_count, watch_mode),
      helper_copy: wrapperHelperCopy(coverage_state, watch_mode),
      cards_disabled: cardsDisabled,
    };
  });

  const selected = args.selectedWrapperSlug ?? null;
  const personalised_listings =
    canPersonalise && selected
      ? enriched.filter(
          ({ match }) =>
            listingMatchesWrapper(match, selected) && isPersonalisedRecommended(match)
        )
      : canPersonalise
        ? enriched.filter(({ match }) => isPersonalisedRecommended(match))
        : enriched;

  const caution_listings =
    canPersonalise && selected
      ? enriched.filter(
          ({ match }) =>
            listingMatchesWrapper(match, selected) && isPersonalisedCaution(match)
        )
      : [];

  return {
    child_context: args.childContext,
    radius_miles: args.radiusMiles,
    area_label: args.areaLabel,
    wrappers,
    selected_wrapper_slug: selected,
    personalised_listings,
    caution_listings,
    all_listings: enriched,
  };
}
