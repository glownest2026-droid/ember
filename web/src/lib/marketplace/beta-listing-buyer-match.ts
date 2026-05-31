import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChildMarketplaceContext } from "@/lib/marketplace/child-marketplace-context";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { getMarketplaceDevelopmentOpportunities } from "@/lib/marketplace/development-opportunities-service";
import type { EnrichedBuyerListingMatch } from "@/lib/marketplace/listing-match-enrichment";

export type BuyerListingMatchPayload = {
  development_wrapper_slugs: string[];
  primary_development_wrapper_slug: string | null;
  match_reason: string | null;
  age_stage_copy: string | null;
  caution_copy: string | null;
  coverage_copy: string | null;
  recommendation_eligibility: string;
};

export function toBuyerListingMatchPayload(
  match: EnrichedBuyerListingMatch
): BuyerListingMatchPayload {
  return {
    development_wrapper_slugs: match.wrapper_slugs,
    primary_development_wrapper_slug: match.primary_wrapper_slug,
    match_reason: match.match_reason,
    age_stage_copy: match.age_stage_copy,
    caution_copy: match.caution_copy,
    coverage_copy: match.coverage_copy,
    recommendation_eligibility: match.recommendation_eligibility,
  };
}

export async function loadBuyerMatchByListingId(args: {
  supabase: SupabaseClient;
  userId: string;
  childId: string | null;
  developmentWrapperSlug?: Stage1WrapperSlug | null;
}): Promise<Map<string, BuyerListingMatchPayload>> {
  const { opportunities } = await getMarketplaceDevelopmentOpportunities({
    supabase: args.supabase,
    userId: args.userId,
    childId: args.childId,
    selectedWrapperSlug: args.developmentWrapperSlug ?? null,
  });

  const map = new Map<string, BuyerListingMatchPayload>();
  for (const entry of opportunities.all_listings) {
    map.set(entry.listing.id, toBuyerListingMatchPayload(entry.match));
  }

  return map;
}

export function filterListingIdsForDevelopment(
  matchMap: Map<string, BuyerListingMatchPayload>,
  allListingIds: string[],
  developmentSlug: Stage1WrapperSlug | null,
  childContext: ChildMarketplaceContext
): string[] {
  if (!developmentSlug) return allListingIds;
  if (childContext.mode !== "personalised") {
    return allListingIds.filter((id) => {
      const m = matchMap.get(id);
      return m?.development_wrapper_slugs.includes(developmentSlug);
    });
  }
  return allListingIds.filter((id) => {
    const m = matchMap.get(id);
    if (!m) return false;
    if (!m.development_wrapper_slugs.includes(developmentSlug)) return false;
    return m.recommendation_eligibility === "recommended";
  });
}
