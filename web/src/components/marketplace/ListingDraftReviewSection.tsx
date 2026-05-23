"use client";

import { useEffect, useMemo, useState } from "react";
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

const CHECKLIST_ITEMS: { key: keyof ListingDraftReviewJson; label: string }[] = [
  { key: "accuracy_confirmed", label: "The title and description look accurate." },
  { key: "condition_confirmed", label: "I’ve checked the condition." },
  { key: "parts_checked", label: "I’ve checked what parts/accessories are included." },
  { key: "safety_checked", label: "I’ve checked the safety notes." },
  { key: "photo_quality_confirmed", label: "The photo is clear enough for another parent." },
];

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
  onReviewUpdated: (review: ListingDraftReviewJson | null) => void;
  onEditDetailsClick: () => void;
  embedded?: boolean;
  compactPhoto?: boolean;
};

async function parseApiPayload<T>(response: Response): Promise<{ payload: T | null }> {
  const rawText = await response.text();
  if (!rawText) return { payload: null };
  try {
    return { payload: JSON.parse(rawText) as T };
  } catch {
    return { payload: null };
  }
}

export function ListingDraftReviewSection({
  draftId,
  previewUrl,
  confirmedDisplayLabel,
  possibleBrandHint,
  titleDraft,
  descriptionDraft,
  condition,
  detailsJson,
  initialReview,
  onReviewUpdated,
  onEditDetailsClick,
  embedded = false,
  compactPhoto = false,
}: Props) {
  const [checklist, setChecklist] = useState({
    accuracy_confirmed: initialReview?.accuracy_confirmed ?? false,
    condition_confirmed: initialReview?.condition_confirmed ?? false,
    parts_checked: initialReview?.parts_checked ?? false,
    safety_checked: initialReview?.safety_checked ?? false,
    photo_quality_confirmed: initialReview?.photo_quality_confirmed ?? false,
  });
  const [readyForNextStep, setReadyForNextStep] = useState(
    Boolean(initialReview?.ready_for_next_step && !initialReview?.stale_after_edit)
  );
  const [staleAfterEdit, setStaleAfterEdit] = useState(Boolean(initialReview?.stale_after_edit));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setChecklist({
      accuracy_confirmed: initialReview?.accuracy_confirmed ?? false,
      condition_confirmed: initialReview?.condition_confirmed ?? false,
      parts_checked: initialReview?.parts_checked ?? false,
      safety_checked: initialReview?.safety_checked ?? false,
      photo_quality_confirmed: initialReview?.photo_quality_confirmed ?? false,
    });
    setReadyForNextStep(Boolean(initialReview?.ready_for_next_step && !initialReview?.stale_after_edit));
    setStaleAfterEdit(Boolean(initialReview?.stale_after_edit));
  }, [initialReview]);

  const conditionBlocksReady = condition === "not_sure" || !condition.trim();
  const hasTitleAndDescription = Boolean(titleDraft.trim() && descriptionDraft.trim());

  const allChecked = useMemo(
    () => Object.values(checklist).every(Boolean),
    [checklist]
  );

  const canMarkReady =
    allChecked && !conditionBlocksReady && hasTitleAndDescription && !saving && !readyForNextStep;

  const handleToggle = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess(null);
    if (readyForNextStep) {
      setReadyForNextStep(false);
      onReviewUpdated(null);
    }
  };

  const handleMarkReady = async () => {
    if (!canMarkReady) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/marketplace/listing-drafts/${draftId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checklist),
      });
      const { payload } = await parseApiPayload<{
        error?: string;
        missing_requirements?: string[];
        review?: ListingDraftReviewJson;
        ready_for_next_step?: boolean;
      }>(response);
      if (!response.ok) {
        const missing = payload?.missing_requirements?.length
          ? ` ${payload.missing_requirements.join(" ")}`
          : "";
        throw new Error((payload?.error ?? "Could not save your review.") + missing);
      }
      const review = payload?.review ?? {
        ...checklist,
        ready_for_next_step: true,
        reviewed_at: new Date().toISOString(),
        stale_after_edit: false,
      };
      setReadyForNextStep(true);
      setStaleAfterEdit(false);
      onReviewUpdated(review);
      setSuccess("Draft marked ready for the next step.");
    } catch (markError) {
      setError(markError instanceof Error ? markError.message : "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

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
              Choose a condition other than “Not sure yet” before marking ready.
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

      {!readyForNextStep || staleAfterEdit ? (
        <div className="space-y-3 border-t border-[#E5E7EB] pt-4">
          <p className="text-sm font-medium text-[#1A1E23]">Review checklist</p>
          <ul className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <li key={item.key}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist[item.key as keyof typeof checklist]}
                    onChange={() => handleToggle(item.key as keyof typeof checklist)}
                    className="mt-1 h-5 w-5 rounded border-[#E5E7EB]"
                  />
                  <span className="text-sm text-[#1A1E23]">{item.label}</span>
                </label>
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={!canMarkReady}
            onClick={handleMarkReady}
            className="inline-flex items-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:opacity-50 min-h-[44px]"
          >
            {saving ? "Saving…" : "Mark ready for next step"}
          </button>
        </div>
      ) : null}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}

      <p className="text-xs text-[#5C646D] border-t border-[#E5E7EB] pt-3">
        Next: price guidance and local interest. Not available yet.
      </p>
    </div>
  );
}
