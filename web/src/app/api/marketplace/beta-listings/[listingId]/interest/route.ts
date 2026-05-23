import { NextRequest } from "next/server";
import { buyerCanViewBetaListing, type BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { mergeSellerLocation } from "@/lib/marketplace/location";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { listingId } = await params;
  if (!listingId) return json({ error: "Listing id is required." }, { status: 400 });

  const { data: listing, error: listingError } = await supabase
    .from("marketplace_listings")
    .select(
      "id, user_id, status, approximate_area_label, approximate_lat, approximate_lng, radius_miles, postcode"
    )
    .eq("id", listingId)
    .maybeSingle();

  if (listingError) return json({ error: listingError.message }, { status: 500 });
  if (!listing) return json({ error: "Listing not found." }, { status: 404 });
  if (listing.status !== "published_beta") {
    return json({ error: "This listing is not available." }, { status: 400 });
  }
  if (listing.user_id === user.id) {
    return json({ error: "You cannot express interest in your own listing." }, { status: 400 });
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

  if (!buyerCanViewBetaListing(listing as BetaListingRow, user.id, buyerLocation)) {
    return json({ error: "This listing is not available in your area." }, { status: 403 });
  }

  const { error: upsertError } = await supabase.from("marketplace_listing_interests").upsert(
    {
      listing_id: listingId,
      buyer_user_id: user.id,
      seller_user_id: listing.user_id,
      status: "interested",
    },
    { onConflict: "listing_id,buyer_user_id" }
  );

  if (upsertError) return json({ error: upsertError.message }, { status: 500 });

  const { count } = await supabase
    .from("marketplace_listing_interests")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId)
    .eq("status", "interested");

  return json(
    {
      ok: true,
      message: "Interest sent",
      interest_count: count ?? 1,
    },
    { status: 200 }
  );
}
