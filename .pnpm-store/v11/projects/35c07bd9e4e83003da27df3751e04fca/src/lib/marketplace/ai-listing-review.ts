import "server-only";

import type { ListingDraftDetailsJson } from "./ai-listing-details-types";
import {
  REVIEW_CHECKLIST_KEYS,
  type ListingDraftReviewJson,
  type ReviewPatchBody,
} from "./ai-listing-review-types";

export { CONDITION_LABELS, REVIEW_CHECKLIST_KEYS } from "./ai-listing-review-types";
export type { ListingDraftReviewJson, ReviewPatchBody } from "./ai-listing-review-types";

export function isReviewPatchBody(value: unknown): value is ReviewPatchBody {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<string, unknown>;
  return REVIEW_CHECKLIST_KEYS.every((key) => typeof source[key] === "boolean");
}

export function allChecklistTrue(body: ReviewPatchBody): boolean {
  return REVIEW_CHECKLIST_KEYS.every((key) => body[key] === true);
}

export function getReviewFromDetailsJson(
  details: ListingDraftDetailsJson | null | undefined
): ListingDraftReviewJson | null {
  if (!details || typeof details !== "object") return null;
  const review = (details as ListingDraftDetailsJson & { review?: ListingDraftReviewJson }).review;
  if (!review || typeof review !== "object") return null;
  return review;
}

export function mergeReviewIntoDetailsJson(
  details: ListingDraftDetailsJson | null,
  review: ListingDraftReviewJson
): ListingDraftDetailsJson & { review: ListingDraftReviewJson } {
  const base = (details && typeof details === "object" ? { ...details } : {}) as ListingDraftDetailsJson;
  return { ...base, review };
}

export function clearReviewInDetailsJson(
  details: ListingDraftDetailsJson | null,
  options?: { staleAfterEdit?: boolean }
): ListingDraftDetailsJson {
  if (!details || typeof details !== "object") {
    return details ?? ({} as ListingDraftDetailsJson);
  }
  const { review: _removed, ...rest } = details as ListingDraftDetailsJson & {
    review?: ListingDraftReviewJson;
  };
  if (options?.staleAfterEdit) {
    return {
      ...rest,
      review: {
        accuracy_confirmed: false,
        condition_confirmed: false,
        parts_checked: false,
        safety_checked: false,
        photo_quality_confirmed: false,
        ready_for_next_step: false,
        reviewed_at: null,
        stale_after_edit: true,
      },
    } as ListingDraftDetailsJson & { review: ListingDraftReviewJson };
  }
  return rest as ListingDraftDetailsJson;
}

export type DraftReviewEligibility = {
  eligible: boolean;
  missing_requirements: string[];
};

export function assessDraftReviewEligibility(draft: {
  image_storage_path: string | null;
  product_type_id: string | null;
  status: string;
  title_draft: string | null;
  description_draft: string | null;
  condition_confirmed_by_user: string | null;
  listing_details_generated_at: string | null;
}): DraftReviewEligibility {
  const missing: string[] = [];

  if (!String(draft.image_storage_path ?? "").trim()) {
    missing.push("Upload a private photo first.");
  }
  if (draft.status !== "confirmed" || !draft.product_type_id) {
    missing.push("Confirm the item type before reviewing.");
  }
  if (!String(draft.listing_details_generated_at ?? "").trim()) {
    missing.push("Generate and save draft listing details first.");
  }
  if (!String(draft.title_draft ?? "").trim()) {
    missing.push("Add a listing title.");
  }
  if (!String(draft.description_draft ?? "").trim()) {
    missing.push("Add a listing description.");
  }
  const condition = String(draft.condition_confirmed_by_user ?? "").trim();
  if (!condition) {
    missing.push("Choose a condition.");
  } else if (condition === "not_sure") {
    missing.push("Choose a condition other than “Not sure yet” before marking ready.");
  }

  return { eligible: missing.length === 0, missing_requirements: missing };
}

export function buildReviewStateFromPatch(
  body: ReviewPatchBody,
  ready: boolean
): ListingDraftReviewJson {
  return {
    accuracy_confirmed: body.accuracy_confirmed,
    condition_confirmed: body.condition_confirmed,
    parts_checked: body.parts_checked,
    safety_checked: body.safety_checked,
    photo_quality_confirmed: body.photo_quality_confirmed,
    ready_for_next_step: ready,
    reviewed_at: ready ? new Date().toISOString() : null,
    stale_after_edit: false,
  };
}
