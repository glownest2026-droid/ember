import { NextRequest } from "next/server";
import { buyerCanViewBetaListing, type BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { resolveUserMarketplaceLocation } from "@/lib/marketplace/marketplace-preferences-service";
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

  const nearby = visibility.filter((v) => v.visible).map((v) => v.row);

  const { data: myConversations } = await supabase
    .from("marketplace_conversations")
    .select("id, listing_id")
    .eq("buyer_user_id", user.id);

  const conversationByListing = new Map(
    (myConversations ?? []).map((row) => [row.listing_id, row.id])
  );

  return json(
    {
      listings: nearby.map(({ postcode: _postcode, ...listing }) => ({
        ...listing,
        buyer_interested: interestedIds.has(listing.id),
        conversation_id: conversationByListing.get(listing.id) ?? null,
      })),
      buyer_has_postcode: Boolean(buyerLocation.postcode && buyerLocation.lat != null),
      buyer_area_label: buyerLocation.approximate_area_label,
      buyer_radius_miles: buyerLocation.radius_miles,
    },
    { status: 200 }
  );
}
