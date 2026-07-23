import { NextRequest } from "next/server";
import { createBetaListingPhotoSignedUrl } from "@/lib/marketplace/beta-listing-photo";
import type { BetaListingRow } from "@/lib/marketplace/beta-listing-visibility";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to view this photo." }, { status: 401 });
  }

  const { listingId } = await params;
  if (!listingId) return json({ error: "Listing id is required." }, { status: 400 });

  const { data: listing, error: listingError } = await supabase
    .from("marketplace_listings")
    .select(
      "id, user_id, status, image_storage_path, approximate_area_label, approximate_lat, approximate_lng, radius_miles, postcode"
    )
    .eq("id", listingId)
    .maybeSingle();

  if (listingError) return json({ error: listingError.message }, { status: 500 });
  if (!listing) return json({ error: "Listing not found." }, { status: 404 });

  const photo = await createBetaListingPhotoSignedUrl(
    supabase,
    listing as BetaListingRow,
    user.id
  );

  if ("error" in photo) {
    return json({ error: photo.error }, { status: photo.status });
  }

  return json({ signed_url: photo.signedUrl, expires_in_seconds: 300 }, { status: 200 });
}
