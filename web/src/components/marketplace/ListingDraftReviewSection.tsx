"use client";

import type { ListingDraftDetailsJson } from "@/lib/marketplace/ai-listing-details-types";

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

type DetailsWithReview = ListingDraftDetailsJson & { review?: ListingDraftReviewJson };

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
  needs_repair: "Needs repair",
  not_sure: "Not sure yet",
};

type Props = {
  draftId: string;
  previewUrl: string | null;
  confirmedDisplayLabel: string | null;
  possibleBrandHint: string | null;
  titleDraft: string;
  descriptionDraft: string;
  condition: string;
  detailsJson: ListingDraftDetailsJson | null;
  initialReview: ListingDraftReviewJson | null;
  onReviewUpdated?: (review: ListingDraftReviewJson | null) => void;
  onEditDetailsClick: () => void;
  embedded?: boolean;
  compactPhoto?: boolean;
};

export function ListingDraftReviewSection({
  previewUrl,
  confirmedDisplayLabel,
  possibleBrandHint,
  titleDraft,
  descriptionDraft,
  condition,
  detailsJson,
  initialReview,
  onReviewUpdated: _onReviewUpdated,
  onEditDetailsClick,
  embedded = false,
  compactPhoto = false,
}: Props) {
  const readyForNextStep = Boolean(
    initialReview?.ready_for_next_step && !initialReview?.stale_after_edit
  );
  const staleAfterEdit = Boolean(initialReview?.stale_after_edit);

  const conditionBlocksReady = condition === "not_sure" || !condition.trim();

  const details = detailsJson as DetailsWithReview | null;

  const wrapperClass = embedded ? "space-y-5" : "rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-5";

  return (
    <div className={wrapperClass}>
      {!embedded && (
        <div className="space-y-1">
          <h2 className="text-base font-medium text-[#1A1E23]">Review your draft</h2>
          <p className="text-sm text-[#5C646D]">
            Check the details before Ember helps with price and local interest. Nothing is public yet.
          </p>
          <p className="text-xs text-[#5C646D]">Nothing is public. This is still your private draft.</p>
        </div>
      )}
      {embedded && (
        <p className="text-sm text-[#5C646D]">
          Check everything looks right. Nothing is public yet.
        </p>
      )}

      {staleAfterEdit && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
          You edited details after review — please review again.
        </p>
      )}

      {readyForNextStep && !staleAfterEdit && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
          <p className="text-sm font-medium text-emerald-900">Ready for the next step</p>
          <p className="text-sm text-emerald-800">
            Your draft is saved privately. Price guidance and local interest are not available yet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#1A1E23]">Private draft photo</p>
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Your private listing draft photo"
              className={
                compactPhoto
                  ? "h-20 w-20 object-cover rounded-lg border border-[#E5E7EB]"
                  : "w-full max-h-[280px] object-contain rounded-xl border border-[#E5E7EB]"
              }
            />
          ) : (
            <p className="text-sm text-[#5C646D]">Photo preview unavailable.</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#1A1E23]">Confirmed item</p>
          <p className="text-sm text-[#1A1E23]">{confirmedDisplayLabel ?? "Item type confirmed"}</p>
          {possibleBrandHint && possibleBrandHint.toLowerCase() !== "unknown" && (
            <p className="text-xs text-[#5C646D]">
              Looks like: {possibleBrandHint}. Please only keep this if you’re confident it’s right.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-[#1A1E23]">Listing title</p>
            <button
              type="button"
              onClick={onEditDetailsClick}
              className="text-xs text-primary underline"
            >
              Edit details
            </button>
          </div>
          <p className="text-sm text-[#1A1E23]">{titleDraft || "—"}</p>
          <p className="text-xs text-[#5C646D]">
            Ember drafted this from your photo and item choice. Please edit anything that isn’t right.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#1A1E23]">Description</p>
          <p className="text-sm text-[#5C646D] whitespace-pre-wrap">{descriptionDraft || "—"}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#1A1E23]">Condition</p>
          <p className="text-sm text-[#1A1E23]">
            {(CONDITION_LABELS[condition] ?? condition) || "—"}
          </p>
          <p className="text-xs text-[#5C646D]">
            Condition is your judgement — Ember can’t confirm this from a photo.
          </p>
          {conditionBlocksReady && (
            <p className="text-xs text-amber-800">
              Choose a condition other than “Not sure yet” in step 3, then save your draft.
            </p>
          )}
        </div>

        {details?.included_parts_checklist && details.included_parts_checklist.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#1A1E23]">Included parts to check</p>
            <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
              {details.included_parts_checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {(details?.missing_parts_questions?.length ?? 0) > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#1A1E23]">Parts / accessories to check</p>
            <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
              {details!.missing_parts_questions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {(details?.safety_resale_notes?.length ?? 0) > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#1A1E23]">Before listing, check…</p>
            <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
              {details!.safety_resale_notes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {(details?.photo_improvement_suggestions?.length ?? 0) > 0 ? (
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#1A1E23]">Photo tips</p>
            <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
              {details!.photo_improvement_suggestions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-[#5C646D]">More photos can be added later.</p>
        )}
      </div>

      {embedded && !readyForNextStep && !staleAfterEdit && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
          Go back to &ldquo;Draft the listing&rdquo;, tick the five quick checks, and tap{" "}
          <strong>Save draft details</strong>.
        </p>
      )}

      <p className="text-xs text-[#5C646D] border-t border-[#E5E7EB] pt-3">
        Next: price guidance and local interest. Not available yet.
      </p>
    </div>
  );
}
