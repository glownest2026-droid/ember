/**
 * Shared payload to clear downstream generated listing state when the photo
 * or confirmed item changes. Server routes must use this — not only the client.
 */

export function draftGeneratedFieldsClearPayload() {
  return {
    title_draft: null,
    description_draft: null,
    condition_confirmed_by_user: null,
    condition_suggestion: null,
    listing_draft_details_json: null,
    listing_details_generated_at: null,
  } as const;
}

/** Clears intelligence + pending taxonomy review rows for a draft (server-side). */
export async function clearDraftIntelligenceForDraft(
  supabase: { from: (table: string) => unknown },
  draftId: string,
  userId: string
): Promise<void> {
  const client = supabase as {
    from: (table: string) => {
      delete: () => { eq: (col: string, val: string) => { eq: (col2: string, val2: string) => Promise<unknown> } };
    };
  };
  await client
    .from("marketplace_listing_intelligence")
    .delete()
    .eq("draft_id", draftId)
    .eq("seller_user_id", userId);
  await client
    .from("marketplace_taxonomy_review_queue")
    .delete()
    .eq("draft_id", draftId)
    .eq("submitted_by_user_id", userId);
}
