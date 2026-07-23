import { NextRequest } from "next/server";
import {
  filterListingIdsForDevelopment,
  loadBuyerMatchByListingId,
} from "@/lib/marketplace/beta-listing-buyer-match";
import { buyerCanViewBetaListing, type BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { resolveChildMarketplaceContext } from "@/lib/marketplace/child-marketplace-context";
import { isAllowedStage1Slug } from "@/lib/marketplace/marketplace-taxonomy";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { resolveUserMarketplaceLocation } from "@/lib/marketplace/marketplace-preferences-service";
import { toMarketplaceMapListingPayload } from "@/lib/marketplace/marketplace-map-payload";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to view the marketplace." }, { status: 401 });
  }

  const view = request.nextUrl.searchParams.get("view") ?? "nearby";

  if (view === "mine") {
    const { data: listings, error } = await supabase
      .from("marketplace_listings")
      .select(
        "id, user_id, title, description, condition, item_label, price_low, price_high, price_currency, approximate_area_label, status, published_at, image_storage_path"
      )
      .eq("user_id", user.id)
      .in("status", ["published_beta", "paused"])
      .order("published_at", { ascending: false });

    if (error) return json({ error: error.message }, { status: 500 });

    const withCounts = await Promise.all(
      (listings ?? []).map(async (listing) => {
        const { count } = await supabase
          .from("marketplace_listing_interests")
          .select("id", { count: "exact", head: true })
          .eq("listing_id", listing.id)
          .eq("status", "interested");
        return { ...listing, interest_count: count ?? 0 };
      })
    );

    return json({ listings: withCounts }, { status: 200 });
  }

  const buyerLocation = await resolveUserMarketplaceLocation(supabase, user.id);

  const { data: listings, error } = await supabase
    .from("marketplace_listings")
    .select(
      "id, user_id, title, description, condition, item_label, price_low, price_high, price_currency, approximate_area_label, approximate_lat, approximate_lng, radius_miles, postcode, status, published_at, image_storage_path"
    )
    .eq("status", "published_beta");

  if (error) return json({ error: error.message }, { status: 500 });

  const { data: myInterests } = await supabase
    .from("marketplace_listing_interests")
    .select("listing_id")
    .eq("buyer_user_id", user.id)
    .eq("status", "interested");

  const interestedIds = new Set((myInterests ?? []).map((row) => row.listing_id));

  const visibility = await Promise.all(
    (listings ?? []).map(async (row) => ({
      row,
      visible: await buyerCanViewBetaListing(row as BetaListingRow, user.id, buyerLocation),
    }))
  );

  let nearby = visibility.filter((v) => v.visible).map((v) => v.row);

  const childIdParam = request.nextUrl.searchParams.get("childId");
  const developmentParam = request.nextUrl.searchParams.get("development");
  const developmentSlug =
    developmentParam && isAllowedStage1Slug(developmentParam)
      ? (developmentParam as Stage1WrapperSlug)
      : null;

  let childRow: Record<string, unknown> | null = null;
  if (childIdParam?.trim()) {
    const { data } = await supabase
      .from("children")
      .select("*")
      .eq("id", childIdParam.trim())
      .eq("user_id", user.id)
      .maybeSingle();
    childRow = (data as Record<string, unknown> | null) ?? null;
  }
  const childContext = resolveChildMarketplaceContext({
    childId: childIdParam,
    childRow,
  });

  const matchById = await loadBuyerMatchByListingId({
    supabase,
    userId: user.id,
    childId: childContext.child_id,
    developmentWrapperSlug: developmentSlug,
  });

  if (developmentSlug) {
    const allowedIds = new Set(
      filterListingIdsForDevelopment(
        matchById,
        nearby.map((r) => r.id),
        developmentSlug,
        childContext
      )
    );
    nearby = nearby.filter((row) => allowedIds.has(row.id));
  }

  const { data: myConversations } = await supabase
    .from("marketplace_conversations")
    .select("id, listing_id")
    .eq("buyer_user_id", user.id);

  const conversationByListing = new Map(
    (myConversations ?? []).map((row) => [row.listing_id, row.id])
  );

  return json(
    {
      listings: nearby.map((row) => {
        const match = matchById.get(row.id);
        return {
          ...toMarketplaceMapListingPayload(row, {
            buyer_interested: interestedIds.has(row.id),
            conversation_id: conversationByListing.get(row.id) ?? null,
          }),
          ...(match ? { buyer_match: match } : {}),
        };
      }),
      child_context: {
        mode: childContext.mode,
        child_id: childContext.child_id,
        display_label: childContext.display_label,
        age_months: childContext.age_months,
      },
      development_filter: developmentSlug,
      buyer_has_postcode: Boolean(buyerLocation.postcode && buyerLocation.lat != null),
      buyer_area_label: buyerLocation.approximate_area_label,
      buyer_radius_miles: buyerLocation.radius_miles,
      buyer_lat: buyerLocation.lat,
      buyer_lng: buyerLocation.lng,
    },
    { status: 200 }
  );
}
