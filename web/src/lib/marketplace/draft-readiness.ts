import type { ListingDraftReviewJson } from "@/lib/marketplace/ai-listing-review-types";
import type { ListingDraftDetailsJson } from "@/lib/marketplace/ai-listing-details-types";

export function getReviewFromDetailsJson(
  details: ListingDraftDetailsJson | null | undefined
): ListingDraftReviewJson | null {
  if (!details || typeof details !== "object") return null;
  const review = (details as ListingDraftDetailsJson & { review?: ListingDraftReviewJson }).review;
  return review ?? null;
}

export function isDraftReadyForOpportunity(draft: {
  image_storage_path: string | null;
  product_type_id: string | null;
  status: string;
  title_draft: string | null;
  description_draft: string | null;
  condition_confirmed_by_user: string | null;
  listing_draft_details_json: unknown;
}): { ready: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!String(draft.image_storage_path ?? "").trim()) missing.push("Upload a private photo.");
  if (draft.status !== "confirmed" || !draft.product_type_id) {
    missing.push("Confirm the item type.");
  }
  if (!String(draft.title_draft ?? "").trim()) missing.push("Add a listing title.");
  if (!String(draft.description_draft ?? "").trim()) missing.push("Add a description.");
  const condition = String(draft.condition_confirmed_by_user ?? "").trim();
  if (!condition) missing.push("Choose a condition.");
  else if (condition === "not_sure") missing.push("Choose a condition other than “Not sure yet”.");

  const review = getReviewFromDetailsJson(
    draft.listing_draft_details_json as ListingDraftDetailsJson | null
  );
  if (!review?.ready_for_next_step || review.stale_after_edit) {
    missing.push("Mark your draft ready for the next step.");
  }

  return { ready: missing.length === 0, missing };
}
