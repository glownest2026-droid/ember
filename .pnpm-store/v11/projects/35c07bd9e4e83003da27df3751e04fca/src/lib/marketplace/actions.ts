"use server";

import { createClient } from "@/utils/supabase/server";

export type CreateDraftListingResult =
  | { listingId: string }
  | { error: string };

/**
 * Create a draft marketplace listing. Call on modal open or first Next.
 */
export async function createDraftListing(
  childId: string | null,
  rawItemText: string
): Promise<CreateDraftListingResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("marketplace_listings")
    .insert({
      user_id: user.id,
      child_id: childId,
      raw_item_text: rawItemText || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (!data?.id) return { error: "No id returned" };
  return { listingId: data.id };
}

export type SubmitListingPayload = {
  listingId: string;
  rawItemText: string;
  selectedItemTypeId: string | null;
  normalizationConfidence: number | null;
  condition: string;
  notes: string;
  postcode: string | null;
  radiusMiles: number;
};

export type SubmitListingResult = { ok: true } | { error: string };

/**
 * Set listing to submitted and set submitted_at.
 */
export async function submitListing(
  payload: SubmitListingPayload
): Promise<SubmitListingResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("marketplace_listings")
    .update({
      raw_item_text: payload.rawItemText || null,
      selected_item_type_id: payload.selectedItemTypeId || null,
      normalized_item_type_id: payload.selectedItemTypeId || null,
      normalization_confidence: payload.normalizationConfidence ?? null,
      condition: payload.condition || null,
      notes: payload.notes || null,
      postcode: payload.postcode || null,
      radius_miles: payload.radiusMiles,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", payload.listingId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  if (payload.postcode?.trim()) {
    await supabase.from("marketplace_preferences").upsert(
      {
        user_id: user.id,
        postcode: payload.postcode.trim(),
        radius_miles: payload.radiusMiles,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  }
  return { ok: true };
}

export type UpsertPreferencesResult = { ok: true } | { error: string };

/**
 * Save marketplace preferences (postcode, radius). Used when user edits pickup area.
 */
export async function upsertMarketplacePreferences(
  postcode: string,
  radiusMiles: number
): Promise<UpsertPreferencesResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("marketplace_preferences").upsert(
    {
      user_id: user.id,
      postcode: postcode.trim() || null,
      radius_miles: radiusMiles,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: error.message };
  return { ok: true };
}

export type GetPreferencesResult =
  | { postcode: string | null; radius: string }
  | { error: string };

/**
 * Get current user's marketplace preferences for prefill.
 */
export async function getMarketplacePreferences(): Promise<GetPreferencesResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data, error } = await supabase
    .from("marketplace_preferences")
    .select("postcode, radius_miles")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") return { error: error.message };
  return {
    postcode: data?.postcode ?? null,
    radius: data?.radius_miles != null ? String(data.radius_miles) : "5",
  };
}
