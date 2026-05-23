import { NextRequest } from "next/server";
import { saveMarketplacePreferencesForUser } from "@/lib/marketplace/marketplace-preferences-service";
import { publishBetaListingFromDraft } from "@/lib/marketplace/publish-beta";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { draftId } = await params;
  if (!draftId) return json({ error: "Draft id is required." }, { status: 400 });

  let body: { approximate_area_label?: string; postcode?: string } = {};
  try {
    const raw = await request.text();
    if (raw) body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { data: draft, error: draftError } = await supabase
    .from("marketplace_listing_drafts")
    .select(
      "id, user_id, product_type_id, status, image_storage_path, title_draft, description_draft, condition_confirmed_by_user, listing_draft_details_json, ai_raw_response_json"
    )
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (draftError) return json({ error: draftError.message }, { status: 500 });
  if (!draft) return json({ error: "Draft not found." }, { status: 404 });

  if (body.postcode?.trim()) {
    const saved = await saveMarketplacePreferencesForUser(supabase, user.id, {
      postcode: body.postcode,
    });
    if ("error" in saved) {
      return json({ error: saved.error }, { status: 400 });
    }
  }

  const result = await publishBetaListingFromDraft(supabase, draft, {
    approximate_area_label: body.approximate_area_label,
    postcode: body.postcode,
  });

  if ("error" in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json(
    {
      ok: true,
      message: result.created
        ? "Your listing is live to nearby Ember families."
        : "Your listing is already live to nearby Ember families.",
      listing: result.listing,
      created: result.created,
    },
    { status: 200 }
  );
}
