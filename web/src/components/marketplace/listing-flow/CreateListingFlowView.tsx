"use client";

import Link from "next/link";
import { Camera, Lock } from "lucide-react";
import type { ChangeEvent } from "react";
import { ListingDraftDetailsSection } from "@/components/marketplace/ListingDraftDetailsSection";
import { ListingOpportunitySection } from "@/components/marketplace/ListingOpportunitySection";
import { ListingDraftReviewSection } from "@/components/marketplace/ListingDraftReviewSection";
import { EmberEstimateSection } from "@/components/marketplace/EmberEstimateSection";
import { ListingDeveloperDiagnostics } from "@/components/marketplace/listing-flow/ListingDeveloperDiagnostics";
import { ListingFlowStepShell } from "@/components/marketplace/listing-flow/ListingFlowStepShell";
import {
  CONDITION_LABELS,
  type ListingFlowStepId,
  type ListingFlowStepState,
} from "@/components/marketplace/listing-flow/listing-flow-types";
import type { ListingDraftDetailsJson } from "@/components/marketplace/ListingDraftDetailsSection";
import type { ListingDraftReviewJson } from "@/components/marketplace/ListingDraftReviewSection";

type CandidateCard = {
  id: string | null;
  label: string;
  user_facing_item_label?: string;
  internal_category_label?: string | null;
  catalog_match_weak?: boolean;
  reason: string;
  confidence_label: string;
};

type ConfirmedDraftState = {
  status: string;
  productTypeId: string | null;
  label: string | null;
  displayLabel: string | null;
};

export type CreateListingFlowViewProps = {
  debugMode: boolean;
  draftId: string | null;
  imageStoragePath: string | null;
  previewUrl: string | null;
  uploading: boolean;
  error: string | null;
  success: string | null;
  flow: ListingFlowStepState;
  displayActiveStep: ListingFlowStepId | null;
  onScrollToStep: (step: ListingFlowStepId) => void;
  onFileSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  analysisLoading: boolean;
  analysisError: string | null;
  analysisResult: {
    candidate_cards: CandidateCard[];
    low_confidence_message: string | null;
    missing_parts_questions: string[];
  } | null;
  onSuggestItem: () => void;
  savingSelection: boolean;
  selectionMessage: string | null;
  confirmedDraft: ConfirmedDraftState | null;
  onSelectCandidate: (productTypeId: string | null, displayLabel?: string | null) => void;
  draftDetails: {
    title: string | null;
    description: string | null;
    condition: string | null;
    detailsJson: ListingDraftDetailsJson | null;
    generatedAt: string | null;
  };
  itemConfirmed: boolean;
  detailsSavedOnce: boolean;
  onDetailsSaved: (saved: {
    title: string;
    description: string;
    condition: string | null;
    detailsJson: ListingDraftDetailsJson | null;
  }) => void;
  draftReview: ListingDraftReviewJson | null;
  onReviewUpdated: (review: ListingDraftReviewJson | null) => void;
  brandCharacterHint: string | null;
  defaultAreaLabel?: string | null;
  defaultPostcode?: string | null;
  opportunityLoaded: boolean;
  publishedBeta: boolean;
  publishedListingId: string | null;
  flowMode: "create" | "edit-published";
  onStartNewListing?: () => void;
  onOpportunityLoaded: () => void;
  onPublished: (listingId: string) => void;
};

export function CreateListingFlowView({
  debugMode,
  draftId,
  imageStoragePath,
  previewUrl,
  uploading,
  error,
  success,
  flow,
  displayActiveStep,
  onScrollToStep,
  onFileSelected,
  analysisLoading,
  analysisError,
  analysisResult,
  onSuggestItem,
  savingSelection,
  selectionMessage,
  confirmedDraft,
  onSelectCandidate,
  draftDetails,
  itemConfirmed,
  detailsSavedOnce,
  onDetailsSaved,
  draftReview,
  onReviewUpdated,
  brandCharacterHint,
  defaultAreaLabel,
  defaultPostcode,
  opportunityLoaded,
  publishedBeta,
  publishedListingId,
  flowMode,
  onStartNewListing,
  onOpportunityLoaded,
  onPublished,
}: CreateListingFlowViewProps) {
  const editingPublished = flowMode === "edit-published";
  const conditionLabel =
    CONDITION_LABELS[draftDetails.condition ?? ""] ?? draftDetails.condition ?? "";

  const photoActive = displayActiveStep === "photo";
  const itemActive = displayActiveStep === "item";
  const detailsActive = displayActiveStep === "details";
  const reviewActive = displayActiveStep === "review";
  const opportunityActive = displayActiveStep === "opportunity";

  const showReviewStep =
    (detailsSavedOnce &&
      Boolean(draftDetails.title?.trim()) &&
      Boolean(draftDetails.description?.trim()) &&
      Boolean(draftDetails.condition?.trim())) ||
    flow.reviewComplete;
  const showOpportunityStep = flow.reviewComplete || flow.opportunityComplete || publishedBeta;

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4 pb-10 sm:p-6">
      <header className="space-y-2">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            publishedBeta
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-[#E5E7EB] bg-[#FAFAFA] text-[#1A1E23]"
          }`}
        >
          <Lock className="h-3.5 w-3.5" aria-hidden />
          {editingPublished || publishedBeta ? "Listed to nearby families" : "Private draft"}
        </div>
        <h1 className="text-2xl font-normal text-[#1A1E23]">
          {editingPublished ? "Edit listing" : "Create a listing"}
        </h1>
        <p className="text-sm text-[#5C646D]">
          {editingPublished
            ? "Update your live listing. Changes to title, description, and condition appear on the marketplace when you save."
            : publishedBeta
              ? "Your listing is live on the Ember marketplace for nearby families. Check back for interest and price guidance."
              : "Add a photo, confirm the item, then review the draft. Nothing is public until you list locally."}
        </p>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div id="listing-step-photo">
        <ListingFlowStepShell
          stepNumber={1}
          title="Add a photo"
          isComplete={flow.photoComplete}
          isActive={photoActive}
          onEdit={flow.photoComplete && !photoActive ? () => onScrollToStep("photo") : undefined}
          editLabel="Change photo"
          completedSummary={
            <div className="flex items-center gap-3">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt=""
                  className="h-14 w-14 rounded-lg border border-[#E5E7EB] object-cover"
                />
              )}
              <span>Photo added privately</span>
            </div>
          }
        >
          <p className="text-sm text-[#5C646D]">Your photo stays private. Nothing is published.</p>
          <div className="flex flex-wrap gap-2">
            <label
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
              htmlFor="draft-photo-take"
            >
              <Camera className="h-4 w-4" />
              {uploading ? "Uploading…" : "Take photo"}
            </label>
            <label
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#1A1E23]"
              htmlFor="draft-photo-upload"
            >
              Choose from gallery
            </label>
          </div>
          <input
            id="draft-photo-take"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            className="hidden"
            onChange={onFileSelected}
            disabled={uploading}
          />
          <input
            id="draft-photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileSelected}
            disabled={uploading}
          />
          <p className="text-xs text-[#5C646D]">JPG, PNG, or WebP. Max 10MB.</p>
          {success && photoActive && <p className="text-sm text-emerald-700">{success}</p>}
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Your private draft photo"
              className="max-h-[360px] w-full rounded-xl border border-[#E5E7EB] object-contain"
            />
          )}
        </ListingFlowStepShell>
      </div>

      {flow.photoComplete && (
        <div id="listing-step-item">
          <ListingFlowStepShell
            stepNumber={2}
            title="Confirm the item"
            isComplete={flow.itemComplete}
            isActive={itemActive}
            onEdit={flow.itemComplete && !itemActive ? () => onScrollToStep("item") : undefined}
            completedSummary={
              <div className="space-y-1">
                <p className="font-medium text-[#1A1E23]">
                  {confirmedDraft?.displayLabel ?? "Item confirmed"}
                </p>
                {brandCharacterHint && (
                  <p className="text-xs">
                    Only keep brand or character names if you&apos;re confident they&apos;re right.
                  </p>
                )}
              </div>
            }
          >
            <p className="text-sm text-[#5C646D]">
              Ember will suggest what the item might be. You choose what fits.
            </p>
            <button
              type="button"
              disabled={!imageStoragePath || analysisLoading || uploading}
              onClick={onSuggestItem}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {analysisLoading ? "Checking the photo…" : "Suggest item"}
            </button>
            {analysisError && <p className="text-sm text-red-600">{analysisError}</p>}
            {selectionMessage && itemActive && (
              <p className="text-sm text-emerald-700">{selectionMessage}</p>
            )}

            {analysisResult && itemActive && (
              <div className="space-y-3">
                {analysisResult.low_confidence_message && (
                  <p className="text-sm text-[#5C646D]">{analysisResult.low_confidence_message}</p>
                )}
                <p className="text-sm font-medium text-[#1A1E23]">Is it one of these?</p>
                <ul className="space-y-3">
                  {analysisResult.candidate_cards.map((candidate) => (
                    <li
                      key={`${candidate.id ?? candidate.label}`}
                      className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-2"
                    >
                      <p className="font-medium text-[#1A1E23]">
                        {candidate.user_facing_item_label ?? candidate.label}
                      </p>
                      {candidate.internal_category_label && (
                        <p className="text-xs text-[#5C646D]">
                          Category: {candidate.internal_category_label}
                        </p>
                      )}
                      <p className="text-sm text-[#5C646D]">{candidate.reason}</p>
                      {candidate.id ? (
                        <button
                          type="button"
                          disabled={savingSelection}
                          onClick={() =>
                            onSelectCandidate(
                              candidate.id,
                              candidate.user_facing_item_label ?? candidate.label
                            )
                          }
                          className="inline-flex min-h-[40px] items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm disabled:opacity-60"
                        >
                          Choose this
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={savingSelection}
                  onClick={() => onSelectCandidate(null)}
                  className="text-sm text-[#5C646D] underline"
                >
                  Not sure / choose manually
                </button>
              </div>
            )}
          </ListingFlowStepShell>
        </div>
      )}

      {flow.itemComplete && draftId && (
        <div id="listing-step-details">
          <ListingFlowStepShell
            stepNumber={3}
            title="Draft the listing"
            isComplete={flow.detailsComplete}
            isActive={detailsActive}
            onEdit={flow.detailsComplete && !detailsActive ? () => onScrollToStep("details") : undefined}
            completedSummary={
              <div className="space-y-0.5">
                <p className="font-medium text-[#1A1E23]">{draftDetails.title}</p>
                <p>Condition: {conditionLabel}</p>
                <p className="text-emerald-800">Draft details saved</p>
              </div>
            }
          >
            <ListingDraftDetailsSection
              draftId={draftId}
              sectionId="listing-draft-details"
              embedded
              initialTitle={draftDetails.title}
              initialDescription={draftDetails.description}
              initialCondition={draftDetails.condition}
              initialDetails={draftDetails.detailsJson}
              initialGeneratedAt={draftDetails.generatedAt}
              hasConfirmedItem={itemConfirmed}
              onSaved={onDetailsSaved}
            />
          </ListingFlowStepShell>
        </div>
      )}

      {showReviewStep && draftId && imageStoragePath && itemConfirmed && (
        <div id="listing-step-review">
          <ListingFlowStepShell
            stepNumber={4}
            title="Review your draft"
            isComplete={flow.reviewComplete}
            isActive={reviewActive}
            onEdit={flow.reviewComplete && !reviewActive ? () => onScrollToStep("review") : undefined}
            completedSummary={
              <div className="space-y-1">
                <p className="font-medium text-emerald-900">Draft marked ready for the next step</p>
                <p className="text-xs">Ready to see your local opportunity.</p>
              </div>
            }
          >
            <ListingDraftReviewSection
              draftId={draftId}
              previewUrl={previewUrl}
              confirmedDisplayLabel={confirmedDraft?.displayLabel ?? null}
              possibleBrandHint={brandCharacterHint}
              titleDraft={draftDetails.title ?? ""}
              descriptionDraft={draftDetails.description ?? ""}
              condition={draftDetails.condition ?? ""}
              detailsJson={draftDetails.detailsJson}
              initialReview={draftReview}
              onReviewUpdated={onReviewUpdated}
              onEditDetailsClick={() => onScrollToStep("details")}
              embedded
              compactPhoto
            />
            <div className="mt-4">
              <EmberEstimateSection draftId={draftId} />
            </div>
          </ListingFlowStepShell>
        </div>
      )}

      {showOpportunityStep && draftId && flow.reviewComplete && (
        <div id="listing-step-opportunity">
          <ListingFlowStepShell
            stepNumber={5}
            title="Local opportunity"
            isComplete={publishedBeta}
            isActive={opportunityActive}
            completedSummary={
              <div className="space-y-2">
                <p className="font-medium text-emerald-900">Listed to nearby Ember families</p>
                <p className="text-xs">
                  Price guidance and interest updates appear on the marketplace as families respond.
                </p>
                <Link href="/app/marketplace" className="inline-flex text-sm font-medium text-primary underline">
                  Open marketplace
                </Link>
              </div>
            }
          >
            <ListingOpportunitySection
              draftId={draftId}
              defaultAreaLabel={defaultAreaLabel}
              defaultPostcode={defaultPostcode}
              initialPublishedListingId={publishedListingId}
              onOpportunityLoaded={onOpportunityLoaded}
              onPublished={onPublished}
            />
          </ListingFlowStepShell>
        </div>
      )}

      {publishedBeta && !editingPublished && (
        <section
          id="listing-flow-complete"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3"
        >
          <h2 className="text-lg font-medium text-emerald-950">You&apos;re all set</h2>
          <p className="text-sm text-emerald-900">
            Your listing is visible to signed-in Ember families near you. Messaging comes later — for
            now, watch the marketplace for interest and price guidance.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/app/marketplace"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
            >
              Go to marketplace
            </Link>
            {onStartNewListing && (
              <button
                type="button"
                onClick={onStartNewListing}
                className="inline-flex min-h-[44px] items-center rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-medium text-emerald-950"
              >
                List another item
              </button>
            )}
          </div>
          {publishedListingId && debugMode && (
            <p className="text-xs text-emerald-800">Listing id: {publishedListingId}</p>
          )}
        </section>
      )}

      {editingPublished && (
        <section className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-2">
          <p className="text-sm text-[#5C646D]">
            Save each section you change. When you&apos;re done, return to the marketplace to see your
            listing.
          </p>
          <Link href="/app/marketplace" className="inline-flex text-sm font-medium text-primary underline">
            Back to marketplace
          </Link>
        </section>
      )}

      {debugMode && (
        <ListingDeveloperDiagnostics draftId={draftId} imageStoragePath={imageStoragePath} />
      )}

      <p className="text-xs text-[#5C646D]">
        {editingPublished
          ? "Your listing stays live while you edit. Only saved changes update what families see."
          : publishedBeta
            ? "You can return here anytime to edit earlier steps. Your listing stays on the marketplace until you remove it."
            : "Steps stay private until you list to nearby families in step 5."}
      </p>
    </div>
  );
}
