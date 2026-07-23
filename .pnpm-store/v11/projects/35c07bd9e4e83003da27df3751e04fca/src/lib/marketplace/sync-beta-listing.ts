import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

/** Keep published beta listing in sync when the parent edits the source draft. */
export async function syncPublishedBetaListingFromDraft(
  supabase: SupabaseClient,
  draftId: string,
  userId: string,
  fields: {
    title?: string | null;
    description?: string | null;
    condition?: string | null;
  }
): Promise<void> {
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("id")
    .eq("source_draft_id", draftId)
    .eq("user_id", userId)
    .eq("status", "published_beta")
    .maybeSingle();

  if (!listing?.id) return;

  const update: Record<string, string | null> = {};
  if (fields.title !== undefined) update.title = fields.title?.trim() ?? null;
  if (fields.description !== undefined) update.description = fields.description?.trim() ?? null;
  if (fields.condition !== undefined) update.condition = fields.condition?.trim() ?? null;

  if (Object.keys(update).length === 0) return;

  await supabase.from("marketplace_listings").update(update).eq("id", listing.id).eq("user_id", userId);
}
