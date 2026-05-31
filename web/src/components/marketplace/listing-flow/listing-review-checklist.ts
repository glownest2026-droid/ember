import type { ListingDraftReviewJson } from "@/components/marketplace/ListingDraftReviewSection";

export const LISTING_REVIEW_CHECKLIST_ITEMS: {
  key: keyof Pick<
    ListingDraftReviewJson,
    | "accuracy_confirmed"
    | "condition_confirmed"
    | "parts_checked"
    | "safety_checked"
    | "photo_quality_confirmed"
  >;
  label: string;
}[] = [
  { key: "accuracy_confirmed", label: "The title and description look accurate." },
  { key: "condition_confirmed", label: "I’ve checked the condition." },
  { key: "parts_checked", label: "I’ve checked what parts/accessories are included." },
  { key: "safety_checked", label: "I’ve checked the safety notes." },
  { key: "photo_quality_confirmed", label: "The photo is clear enough for another parent." },
];

export type ReviewChecklistState = Pick<
  ListingDraftReviewJson,
  | "accuracy_confirmed"
  | "condition_confirmed"
  | "parts_checked"
  | "safety_checked"
  | "photo_quality_confirmed"
>;

export function isReviewChecklistComplete(checklist: ReviewChecklistState): boolean {
  return Object.values(checklist).every(Boolean);
}
