import { NextRequest } from "next/server";
import { getMarketplaceDevelopmentOpportunities } from "@/lib/marketplace/development-opportunities-service";
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

  const childId = request.nextUrl.searchParams.get("childId");
  const development = request.nextUrl.searchParams.get("development");

  try {
    const { childContext, buyerLocation, opportunities } =
      await getMarketplaceDevelopmentOpportunities({
        supabase,
        userId: user.id,
        childId: childId?.trim() || null,
        selectedWrapperSlug: development,
      });

    return json(
      {
        child: {
          id: childContext.child_id,
          display_label: childContext.display_label,
          age_months: childContext.age_months,
          mode: childContext.mode,
          lookahead_months: childContext.lookahead_months,
        },
        buyer_has_postcode: Boolean(buyerLocation.postcode && buyerLocation.lat != null),
        buyer_area_label: buyerLocation.approximate_area_label,
        buyer_radius_miles: buyerLocation.radius_miles,
        buyer_lat: buyerLocation.lat,
        buyer_lng: buyerLocation.lng,
        wrappers: opportunities.wrappers,
        selected_wrapper_slug: opportunities.selected_wrapper_slug,
        personalised_listing_ids: opportunities.personalised_listings.map(
          ({ listing }) => listing.id
        ),
        caution_listing_ids: opportunities.caution_listings.map(({ listing }) => listing.id),
      },
      { status: 200 }
    );
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Could not load development opportunities." },
      { status: 500 }
    );
  }
}
