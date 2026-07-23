/**
 * Client-side listing filter for development wrapper selection (mirrors server rules).
 */

import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { isAllowedStage1Slug } from "@/lib/marketplace/marketplace-taxonomy";

export type BuyerMatchForFilter = {
  development_wrapper_slugs: string[];
  recommendation_eligibility: string;
};

export type ChildFilterMode = "personalised" | "all_children" | "missing_age";

export function filterListingsByDevelopment<T extends { buyer_match?: BuyerMatchForFilter }>(
  listings: T[],
  developmentSlug: Stage1WrapperSlug | null,
  childMode: ChildFilterMode | undefined
): T[] {
  if (!developmentSlug) return listings;
  return listings.filter((listing) => {
    const match = listing.buyer_match;
    if (!match) return false;
    if (!match.development_wrapper_slugs.includes(developmentSlug)) return false;
    if (childMode === "personalised") {
      return match.recommendation_eligibility === "recommended";
    }
    return true;
  });
}

export function parseDevelopmentSlugFromUrl(
  value: string | null
): Stage1WrapperSlug | null {
  if (!value || !isAllowedStage1Slug(value)) return null;
  return value;
}
