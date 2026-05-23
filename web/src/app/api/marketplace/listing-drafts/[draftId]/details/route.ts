import { NextRequest } from "next/server";
import {
  LISTING_CONDITION_VALUES,
  LISTING_DESCRIPTION_SAVE_MAX,
  LISTING_TITLE_MAX,
  type ListingConditionValue,
  type ListingDraftDetailsJson,
} from "@/lib/marketplace/ai-listing-details-types";
import { clearReviewInDetailsJson } from "@/lib/marketplace/ai-listing-review";
import { syncPublishedBetaListingFromDraft } from "@/lib/marketplace/sync-beta-listing";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

type DetailsPatchBody = {
  title_draft?: string;
  description_draft?: string;
  condition_confirmed_by_user?: string;
  listing_draft_details_json?: ListingDraftDetailsJson;
};

function isConditionValue(value: string): value is ListingConditionValue {
  return (LISTING_CONDITION_VALUES as readonly string[]).includes(value);
}

function isDetailsPatchBody(value: unknown): value is DetailsPatchBody {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<string, unknown>;
  if (source.title_draft !== undefined && typeof source.title_draft !== "string") return false;
  if (source.description_draft !== undefined && typeof source.description_draft !== "string") return false;
  if (
    source.condition_confirmed_by_user !== undefined &&
    typeof source.condition_confirmed_by_user !== "string"
  ) {
    return false;
  }
  if (
    source.listing_draft_details_json !== undefined &&
    (typeof source.listing_draft_details_json !== "object" || source.listing_draft_details_json === null)
  ) {
    return false;
  }
  return true;
}

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
    return json({ error: "Please sign in to save draft details." }, { status: 401 });
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

  if (!isDetailsPatchBody(body)) {
    return json({ error: "Invalid draft details payload." }, { status: 400 });
  }

  const { data: draft, error: draftError } = await supabase
    .from("marketplace_listing_drafts")
    .select("id, user_id, status, listing_draft_details_json")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (draftError) {
    return json({ error: draftError.message }, { status: 500 });
  }
  if (!draft) {
    return json({ error: "Draft not found." }, { status: 404 });
  }

  if (body.title_draft !== undefined && body.title_draft.trim().length > LISTING_TITLE_MAX) {
    return json({ error: `Title must be ${LISTING_TITLE_MAX} characters or fewer.` }, { status: 400 });
  }
  if (
    body.description_draft !== undefined &&
    body.description_draft.trim().length > LISTING_DESCRIPTION_SAVE_MAX
  ) {
    return json(
      { error: `Description must be ${LISTING_DESCRIPTION_SAVE_MAX} characters or fewer.` },
      { status: 400 }
    );
  }
  if (body.condition_confirmed_by_user !== undefined) {
    const condition = body.condition_confirmed_by_user.trim();
    if (!isConditionValue(condition)) {
      return json({ error: "Invalid condition value." }, { status: 400 });
    }
  }

  const updatePayload: Record<string, unknown> = {};
  if (body.title_draft !== undefined) updatePayload.title_draft = body.title_draft.trim();
  if (body.description_draft !== undefined) {
    updatePayload.description_draft = body.description_draft.trim();
  }
  if (body.condition_confirmed_by_user !== undefined) {
    updatePayload.condition_confirmed_by_user = body.condition_confirmed_by_user.trim();
  }
  const contentFieldsChanging =
    body.title_draft !== undefined ||
    body.description_draft !== undefined ||
    body.condition_confirmed_by_user !== undefined;

  if (body.listing_draft_details_json !== undefined) {
    updatePayload.listing_draft_details_json = contentFieldsChanging
      ? clearReviewInDetailsJson(body.listing_draft_details_json, { staleAfterEdit: true })
      : body.listing_draft_details_json;
  } else if (contentFieldsChanging) {
    const existingDetails = (draft.listing_draft_details_json ?? null) as ListingDraftDetailsJson | null;
    updatePayload.listing_draft_details_json = clearReviewInDetailsJson(existingDetails, {
      staleAfterEdit: true,
    });
  }

  if (Object.keys(updatePayload).length === 0) {
    return json({ error: "No fields to update." }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("marketplace_listing_drafts")
    .update(updatePayload)
    .eq("id", draftId)
    .eq("user_id", user.id)
    .select(
      "id, title_draft, description_draft, condition_confirmed_by_user, condition_suggestion, listing_draft_details_json, listing_details_generated_at, product_type_id, status"
    )
    .single();

  if (updateError) {
    return json({ error: updateError.message }, { status: 500 });
  }

  await syncPublishedBetaListingFromDraft(supabase, draftId, user.id, {
    title: updated.title_draft,
    description: updated.description_draft,
    condition: updated.condition_confirmed_by_user,
  });

  return json(
    {
      ok: true,
      message: "Draft details saved.",
      draft: updated,
    },
    { status: 200 }
  );
}
