import { NextRequest } from "next/server";
import { buyerCanViewBetaListing, type BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { mergeSellerLocation } from "@/lib/marketplace/location";
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

  const { data: prefs } = await supabase
    .from("marketplace_preferences")
    .select("postcode, lat, lng, radius_miles")
    .eq("user_id", user.id)
    .maybeSingle();

  const buyerLocation = mergeSellerLocation(
    prefs
      ? {
          postcode: prefs.postcode,
          lat: prefs.lat != null ? Number(prefs.lat) : null,
          lng: prefs.lng != null ? Number(prefs.lng) : null,
          radius_miles: prefs.radius_miles != null ? Number(prefs.radius_miles) : null,
        }
      : null,
    null
  );

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

  const nearby = (listings ?? []).filter((row) =>
    buyerCanViewBetaListing(row as BetaListingRow, user.id, buyerLocation)
  );

  return json(
    {
      listings: nearby.map((listing) => ({
        ...listing,
        buyer_interested: interestedIds.has(listing.id),
      })),
    },
    { status: 200 }
  );
}
