import type { ListingDraftReviewJson } from "@/components/marketplace/ListingDraftReviewSection";

export type ListingFlowStepId = "photo" | "item" | "details" | "review" | "opportunity";

export type ListingFlowStepState = {
  photoComplete: boolean;
  itemComplete: boolean;
  detailsComplete: boolean;
  reviewComplete: boolean;
  opportunityComplete: boolean;
  publishedBeta: boolean;
  activeStep: ListingFlowStepId | "complete";
};

export function deriveListingFlowSteps(input: {
  imageStoragePath: string | null;
  itemConfirmed: boolean;
  detailsSavedOnce: boolean;
  title: string | null;
  description: string | null;
  condition: string | null;
  review: ListingDraftReviewJson | null;
  opportunityLoaded: boolean;
  publishedBeta: boolean;
}): ListingFlowStepState {
  const photoComplete = Boolean(input.imageStoragePath?.trim());
  const itemComplete = input.itemConfirmed;
  const detailsComplete =
    input.detailsSavedOnce &&
    Boolean(input.title?.trim()) &&
    Boolean(input.description?.trim()) &&
    Boolean(input.condition?.trim());
  const reviewComplete = Boolean(
    input.review?.ready_for_next_step && !input.review?.stale_after_edit
  );

  let activeStep: ListingFlowStepId | "complete" = "photo";
  if (!photoComplete) activeStep = "photo";
  else if (!itemComplete) activeStep = "item";
  else if (!detailsComplete) activeStep = "details";
  else if (!reviewComplete) activeStep = "review";
  else if (!input.opportunityLoaded) activeStep = "opportunity";
  else if (!input.publishedBeta) activeStep = "opportunity";
  else activeStep = "complete";

  const opportunityComplete = input.opportunityLoaded;

  return {
    photoComplete,
    itemComplete,
    detailsComplete,
    reviewComplete,
    opportunityComplete,
    publishedBeta: input.publishedBeta,
    activeStep,
  };
}

export const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
  needs_repair: "Needs repair",
  not_sure: "Not sure yet",
};
