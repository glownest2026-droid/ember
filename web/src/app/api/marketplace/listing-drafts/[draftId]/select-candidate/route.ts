import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

type SelectionPayload =
  | { selection: "canonical"; product_type_id: string; display_label?: string | null }
  | { selection: "not_sure" };

function isSelectionPayload(value: unknown): value is SelectionPayload {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<string, unknown>;
  if (source.selection === "not_sure") return true;
  if (
    source.selection === "canonical" &&
    typeof source.product_type_id === "string" &&
    source.product_type_id.trim().length > 0
  ) {
    return true;
  }
  return false;
}

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
    return json({ error: "Please sign in to confirm a candidate." }, { status: 401 });
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

  if (!isSelectionPayload(body)) {
    return json(
      { error: "Expected selection payload with canonical product_type_id or not_sure." },
      { status: 400 }
    );
  }

  const { data: draft, error: draftError } = await supabase
    .from("marketplace_listing_drafts")
    .select("id, user_id, status, ai_raw_response_json")
    .eq("id", draftId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (draftError) {
    return json({ error: draftError.message }, { status: 500 });
  }
  if (!draft) {
    return json({ error: "Draft not found." }, { status: 404 });
  }

  if (body.selection === "not_sure") {
    const { data: updated, error: updateError } = await supabase
      .from("marketplace_listing_drafts")
      .update({
        product_type_id: null,
        status: "draft",
        title_draft: null,
        description_draft: null,
        condition_confirmed_by_user: null,
        listing_draft_details_json: null,
        listing_details_generated_at: null,
      })
      .eq("id", draftId)
      .eq("user_id", user.id)
      .select("id, product_type_id, status")
      .single();

    if (updateError) {
      return json({ error: updateError.message }, { status: 500 });
    }
    return json(
      {
        ok: true,
        message: "Saved as not sure. You can choose manually in the next step.",
        draft: updated,
      },
      { status: 200 }
    );
  }

  const productTypeId = body.product_type_id.trim();
  const { data: productType, error: productTypeError } = await supabase
    .from("product_types")
    .select("id, label, subtitle")
    .eq("id", productTypeId)
    .maybeSingle();

  if (productTypeError) {
    return json({ error: productTypeError.message }, { status: 500 });
  }
  if (!productType) {
    return json({ error: "Selected candidate is not in Ember’s canonical catalog." }, { status: 400 });
  }

  const displayLabel =
    typeof body.display_label === "string" && body.display_label.trim().length > 0
      ? body.display_label.trim()
      : null;
  const existingRaw =
    draft.ai_raw_response_json && typeof draft.ai_raw_response_json === "object"
      ? (draft.ai_raw_response_json as Record<string, unknown>)
      : {};
  const mergedRaw = {
    ...existingRaw,
    parent_confirmed_display_label: displayLabel,
  };

  const { data: updatedDraft, error: updateError } = await supabase
    .from("marketplace_listing_drafts")
    .update({
      product_type_id: productType.id,
      status: "confirmed",
      title_draft: null,
      description_draft: null,
      condition_confirmed_by_user: null,
      listing_draft_details_json: null,
      listing_details_generated_at: null,
      ai_raw_response_json: mergedRaw,
    })
    .eq("id", draftId)
    .eq("user_id", user.id)
    .select("id, product_type_id, status")
    .single();

  if (updateError) {
    return json({ error: updateError.message }, { status: 500 });
  }

  return json(
    {
      ok: true,
      message: "Saved to your draft.",
      selected_product_type: {
        id: productType.id,
        label: productType.label,
        display_label: displayLabel,
        subtitle: productType.subtitle ?? null,
      },
      draft: updatedDraft,
    },
    { status: 200 }
  );
}
