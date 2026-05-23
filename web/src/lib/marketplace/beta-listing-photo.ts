import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buyerCanViewBetaListing, type BetaListingRow } from "./beta-listing-visibility";
import { mergeSellerLocation } from "./location";

const RAW_BUCKET = "marketplace-raw-listing-photos";

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE?.trim();
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

export async function createBetaListingPhotoSignedUrl(
  userClient: SupabaseClient,
  listing: BetaListingRow,
  viewerUserId: string
): Promise<{ signedUrl: string } | { error: string; status: number }> {
  if (!listing.image_storage_path) {
    return { error: "Photo not available.", status: 404 };
  }

  const isSeller = listing.user_id === viewerUserId;
  if (!isSeller) {
    const { data: prefs } = await userClient
      .from("marketplace_preferences")
      .select("postcode, lat, lng, radius_miles")
      .eq("user_id", viewerUserId)
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

    if (!buyerCanViewBetaListing(listing, viewerUserId, buyerLocation)) {
      return { error: "Not allowed to view this listing photo.", status: 403 };
    }
  }

  const service = getServiceSupabase();
  if (!service) {
    if (isSeller) {
      const { data, error } = await userClient.storage
        .from(RAW_BUCKET)
        .createSignedUrl(listing.image_storage_path, 300);
      if (error || !data?.signedUrl) {
        return { error: error?.message ?? "Could not load photo.", status: 500 };
      }
      return { signedUrl: data.signedUrl };
    }
    return { error: "Photo access unavailable.", status: 503 };
  }

  const { data, error } = await service.storage
    .from(RAW_BUCKET)
    .createSignedUrl(listing.image_storage_path, 300);

  if (error || !data?.signedUrl) {
    return { error: error?.message ?? "Could not load photo.", status: 500 };
  }

  return { signedUrl: data.signedUrl };
}
