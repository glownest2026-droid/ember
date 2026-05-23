import "server-only";

export const REVIEW_CHECKLIST_KEYS = [
  "accuracy_confirmed",
  "condition_confirmed",
  "parts_checked",
  "safety_checked",
  "photo_quality_confirmed",
] as const;

export type ReviewChecklistKey = (typeof REVIEW_CHECKLIST_KEYS)[number];

export type ListingDraftReviewJson = {
  accuracy_confirmed: boolean;
  condition_confirmed: boolean;
  parts_checked: boolean;
  safety_checked: boolean;
  photo_quality_confirmed: boolean;
  ready_for_next_step: boolean;
  reviewed_at: string | null;
  stale_after_edit?: boolean;
};

export const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
  needs_repair: "Needs repair",
  not_sure: "Not sure yet",
};

export type ReviewPatchBody = {
  accuracy_confirmed: boolean;
  condition_confirmed: boolean;
  parts_checked: boolean;
  safety_checked: boolean;
  photo_quality_confirmed: boolean;
};
