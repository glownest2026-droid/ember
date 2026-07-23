import { NextRequest } from "next/server";
import type { ListingDraftDetailsJson } from "@/lib/marketplace/ai-listing-details-types";
import {
  allChecklistTrue,
  assessDraftReviewEligibility,
  buildReviewStateFromPatch,
  getReviewFromDetailsJson,
  isReviewPatchBody,
  mergeReviewIntoDetailsJson,
} from "@/lib/marketplace/ai-listing-review";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ draftId: string }> }
) {
  const { supabase, json } = createClient(request);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to review your draft." }, { status: 401 });
  }

  const { draftId } = await params;
  if (!draftId) {
    return json({ error: "Draft id is required." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isReviewPatchBody(body)) {
    return json({ error: "Invalid review checklist payload." }, { status: 400 });
  }

  const { data: draft, error: draftError } = await supabase
    .from("marketplace_listing_drafts")
    .select(
      "id, user_id, status, product_type_id, image_storage_path, title_draft, description_draft, condition_confirmed_by_user, listing_draft_details_json, listing_details_generated_at"
    )
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (draftError) {
    return json({ error: draftError.message }, { status: 500 });
  }
  if (!draft) {
    return json({ error: "Draft not found." }, { status: 404 });
  }

  const eligibility = assessDraftReviewEligibility(draft);
  if (!eligibility.eligible) {
    return json(
      {
        error: "Your draft is not ready to review yet.",
        missing_requirements: eligibility.missing_requirements,
        ready_for_next_step: false,
      },
      { status: 400 }
    );
  }

  const checklistComplete = allChecklistTrue(body);
  const readyForNextStep = checklistComplete;

  if (!checklistComplete) {
    const missing: string[] = [];
    if (!body.accuracy_confirmed) missing.push("Confirm the title and description look accurate.");
    if (!body.condition_confirmed) missing.push("Confirm you’ve checked the condition.");
    if (!body.parts_checked) missing.push("Confirm you’ve checked included parts and accessories.");
    if (!body.safety_checked) missing.push("Confirm you’ve checked the safety notes.");
    if (!body.photo_quality_confirmed) {
      missing.push("Confirm the photo is clear enough for another parent.");
    }

    const existingDetails = (draft.listing_draft_details_json ?? null) as ListingDraftDetailsJson | null;
    const reviewState = buildReviewStateFromPatch(body, false);
    const mergedDetails = mergeReviewIntoDetailsJson(existingDetails, reviewState);

    const { error: savePartialError } = await supabase
      .from("marketplace_listing_drafts")
      .update({ listing_draft_details_json: mergedDetails })
      .eq("id", draftId)
      .eq("user_id", user.id);

    if (savePartialError) {
      return json({ error: savePartialError.message }, { status: 500 });
    }

    return json(
      {
        error: "Complete every checklist item before marking ready for the next step.",
        missing_requirements: missing,
        ready_for_next_step: false,
        review: reviewState,
      },
      { status: 400 }
    );
  }

  const existingDetails = (draft.listing_draft_details_json ?? null) as ListingDraftDetailsJson | null;
  const reviewState = buildReviewStateFromPatch(body, readyForNextStep);
  const mergedDetails = mergeReviewIntoDetailsJson(existingDetails, reviewState);

  const { data: updated, error: updateError } = await supabase
    .from("marketplace_listing_drafts")
    .update({ listing_draft_details_json: mergedDetails })
    .eq("id", draftId)
    .eq("user_id", user.id)
    .select("id, listing_draft_details_json, title_draft, description_draft, condition_confirmed_by_user")
    .single();

  if (updateError) {
    return json({ error: updateError.message }, { status: 500 });
  }

  return json(
    {
      ok: true,
      message: "Draft marked ready for the next step.",
      ready_for_next_step: true,
      missing_requirements: [] as string[],
      review: getReviewFromDetailsJson(
        (updated?.listing_draft_details_json ?? null) as ListingDraftDetailsJson | null
      ),
    },
    { status: 200 }
  );
}
