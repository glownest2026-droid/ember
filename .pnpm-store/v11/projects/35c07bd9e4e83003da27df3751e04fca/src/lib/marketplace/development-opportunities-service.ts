import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildMarketplaceDevelopmentOpportunities,
  type MarketplaceDevelopmentOpportunitiesResult,
  type NearbyListingForOpportunities,
} from "@/lib/marketplace/development-opportunities";
import {
  resolveChildMarketplaceContext,
  type ChildMarketplaceContext,
} from "@/lib/marketplace/child-marketplace-context";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { isAllowedStage1Slug } from "@/lib/marketplace/marketplace-taxonomy";
import type {
  DevMappingRow,
  ItemTypeRow,
  ListingIntelligenceRow,
} from "@/lib/marketplace/listing-match-enrichment";
import { buyerCanViewBetaListing, type BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { resolveUserMarketplaceLocation } from "@/lib/marketplace/marketplace-preferences-service";
import { createMarketplaceServiceClient } from "@/lib/marketplace/marketplace-service-client";

async function loadChildRow(
  supabase: SupabaseClient,
  userId: string,
  childId: string | null
): Promise<Record<string, unknown> | null> {
  if (!childId) return null;
  const { data } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .eq("user_id", userId)
    .maybeSingle();
  return (data as Record<string, unknown> | null) ?? null;
}

async function loadPublishedIntelligenceMaps(
  listings: NearbyListingForOpportunities[]
): Promise<{
  byListingId: Map<string, ListingIntelligenceRow>;
  byDraftId: Map<string, ListingIntelligenceRow>;
}> {
  const byListingId = new Map<string, ListingIntelligenceRow>();
  const byDraftId = new Map<string, ListingIntelligenceRow>();
  if (listings.length === 0) return { byListingId, byDraftId };

  const service = createMarketplaceServiceClient();
  if (!service) return { byListingId, byDraftId };

  const listingIds = listings.map((l) => l.id);
  const draftIds = listings.map((l) => l.source_draft_id).filter((id): id is string => Boolean(id));

  const queries: Promise<void>[] = [];

  if (listingIds.length > 0) {
    queries.push(
      (async () => {
        const { data } = await service
          .from("marketplace_listing_intelligence")
          .select(
            "listing_id, draft_id, marketplace_item_type_slug, marketplace_item_type_id, development_area_slugs_json, ai_estimated_min_age_months, ai_estimated_max_age_months, parent_confirmed_min_age_months, parent_confirmed_max_age_months, manufacturer_min_age_months, manufacturer_max_age_months, risk_level, recommendation_eligibility, coverage_state"
          )
          .in("listing_id", listingIds);
        for (const row of data ?? []) {
          const intel = row as ListingIntelligenceRow & {
            listing_id: string;
            draft_id: string | null;
          };
          if (intel.listing_id) byListingId.set(intel.listing_id, intel);
          if (intel.draft_id) byDraftId.set(intel.draft_id, intel);
        }
      })()
    );
  }

  if (draftIds.length > 0) {
    queries.push(
      (async () => {
        const { data } = await service
          .from("marketplace_listing_intelligence")
          .select(
            "listing_id, draft_id, marketplace_item_type_slug, marketplace_item_type_id, development_area_slugs_json, ai_estimated_min_age_months, ai_estimated_max_age_months, parent_confirmed_min_age_months, parent_confirmed_max_age_months, manufacturer_min_age_months, manufacturer_max_age_months, risk_level, recommendation_eligibility, coverage_state"
          )
          .in("draft_id", draftIds);
        for (const row of data ?? []) {
          const intel = row as ListingIntelligenceRow & {
            listing_id: string | null;
            draft_id: string;
          };
          if (intel.draft_id && !byDraftId.has(intel.draft_id)) {
            byDraftId.set(intel.draft_id, intel);
          }
          if (intel.listing_id && !byListingId.has(intel.listing_id)) {
            byListingId.set(intel.listing_id, intel);
          }
        }
      })()
    );
  }

  await Promise.all(queries);
  return { byListingId, byDraftId };
}

async function loadTaxonomyMaps(supabase: SupabaseClient): Promise<{
  mappingsByTypeId: Map<string, DevMappingRow[]>;
  itemTypeBySlug: Map<string, ItemTypeRow>;
  itemTypeById: Map<string, ItemTypeRow>;
}> {
  const mappingsByTypeId = new Map<string, DevMappingRow[]>();
  const itemTypeBySlug = new Map<string, ItemTypeRow>();
  const itemTypeById = new Map<string, ItemTypeRow>();

  const { data: itemTypes } = await supabase
    .from("marketplace_item_types")
    .select(
      "id, slug, default_min_age_months, default_max_age_months, risk_level, recommendation_policy"
    )
    .eq("is_active", true);

  for (const row of (itemTypes ?? []) as (ItemTypeRow & { id: string })[]) {
    itemTypeBySlug.set(row.slug, row);
    itemTypeById.set(row.id, row);
  }

  const { data: mappings } = await supabase
    .from("marketplace_item_type_development_mappings")
    .select("item_type_id, stage1_wrapper_ux_slug, stage1_wrapper_ux_label, mapping_strength")
    .eq("is_active", true);

  for (const m of (mappings ?? []) as (DevMappingRow & { item_type_id: string })[]) {
    const list = mappingsByTypeId.get(m.item_type_id) ?? [];
    list.push(m);
    mappingsByTypeId.set(m.item_type_id, list);
  }

  return { mappingsByTypeId, itemTypeBySlug, itemTypeById };
}

export async function getMarketplaceDevelopmentOpportunities(args: {
  supabase: SupabaseClient;
  userId: string;
  childId: string | null;
  selectedWrapperSlug?: string | null;
}): Promise<{
  childContext: ChildMarketplaceContext;
  buyerLocation: Awaited<ReturnType<typeof resolveUserMarketplaceLocation>>;
  opportunities: MarketplaceDevelopmentOpportunitiesResult;
}> {
  const childRow = await loadChildRow(args.supabase, args.userId, args.childId);
  const childContext = resolveChildMarketplaceContext({
    childId: args.childId,
    childRow,
  });

  const buyerLocation = await resolveUserMarketplaceLocation(args.supabase, args.userId);

  const { data: listings, error } = await args.supabase
    .from("marketplace_listings")
    .select(
      "id, user_id, source_draft_id, item_label, title, description, condition, price_low, price_high, price_currency, approximate_lat, approximate_lng, approximate_area_label, radius_miles, postcode, status, published_at, image_storage_path"
    )
    .eq("status", "published_beta");

  if (error) throw new Error(error.message);

  const visibility = await Promise.all(
    (listings ?? []).map(async (row) => ({
      row: row as BetaListingRow & NearbyListingForOpportunities,
      visible: await buyerCanViewBetaListing(row as unknown as BetaListingRow, args.userId, buyerLocation),
    }))
  );

  const nearby: NearbyListingForOpportunities[] = visibility
    .filter((v) => v.visible)
    .map((v) => ({
      id: v.row.id,
      user_id: v.row.user_id,
      source_draft_id: v.row.source_draft_id ?? null,
      item_label: v.row.item_label ?? v.row.title ?? null,
    }));

  const { byListingId, byDraftId } = await loadPublishedIntelligenceMaps(nearby);
  const { mappingsByTypeId, itemTypeBySlug, itemTypeById } = await loadTaxonomyMaps(args.supabase);

  const selectedSlug =
    args.selectedWrapperSlug && isAllowedStage1Slug(args.selectedWrapperSlug)
      ? (args.selectedWrapperSlug as Stage1WrapperSlug)
      : null;

  const opportunities = buildMarketplaceDevelopmentOpportunities({
    childContext,
    radiusMiles: buyerLocation.radius_miles,
    areaLabel: buyerLocation.approximate_area_label?.trim() || "Approximate area",
    nearbyListings: nearby,
    intelligenceByListingId: byListingId,
    intelligenceByDraftId: byDraftId,
    mappingsByTypeId,
    itemTypeBySlug,
    itemTypeById,
    selectedWrapperSlug: selectedSlug,
    buyerUserId: args.userId,
  });

  return { childContext, buyerLocation, opportunities };
}
