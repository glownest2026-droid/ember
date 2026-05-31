"use client";

import { useEffect, useState } from "react";

export type ListingDraftDetailsJson = {
  suggested_title: string;
  suggested_description: string;
  category_label: string;
  condition_suggestion: string;
  condition_questions: string[];
  included_parts_checklist: string[];
  missing_parts_questions: string[];
  safety_resale_notes: string[];
  photo_improvement_suggestions: string[];
  restricted_or_blocked: boolean;
  parent_editing_note: string;
  generation_model?: string;
  generated_at?: string;
};

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "like_new", label: "Like new" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs_repair", label: "Needs repair" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

type ApiErrorShape = {
  error?: string;
  error_code?: string;
  debug_id?: string;
  provider_status?: number | null;
  provider_code?: string | null;
};

type GenerateDetailsResponse = {
  draft_id: string;
  details: ListingDraftDetailsJson;
  title_draft: string;
  description_draft: string;
  condition_suggestion: string;
  listing_details_generated_at: string;
  restricted_or_blocked: boolean;
  debug_id?: string;
};

type SavedDraftPayload = {
  title: string;
  description: string;
  condition: string | null;
  detailsJson: ListingDraftDetailsJson | null;
};

type Props = {
  draftId: string;
  initialTitle: string | null;
  initialDescription: string | null;
  initialCondition: string | null;
  initialDetails: ListingDraftDetailsJson | null;
  initialGeneratedAt: string | null;
  hasConfirmedItem: boolean;
  sectionId?: string;
  embedded?: boolean;
  onSaved?: (payload: SavedDraftPayload) => void;
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

export function ListingDraftDetailsSection({
  draftId,
  initialTitle,
  initialDescription,
  initialCondition,
  initialDetails,
  initialGeneratedAt,
  hasConfirmedItem,
  sectionId,
  embedded = false,
  onSaved,
}: Props) {
  const [titleDraft, setTitleDraft] = useState(initialTitle ?? "");
  const [descriptionDraft, setDescriptionDraft] = useState(initialDescription ?? "");
  const [condition, setCondition] = useState(initialCondition ?? "");
  const [detailsJson, setDetailsJson] = useState<ListingDraftDetailsJson | null>(initialDetails);
  const [generatedAt, setGeneratedAt] = useState<string | null>(initialGeneratedAt);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [conditionHighlight, setConditionHighlight] = useState(false);

  useEffect(() => {
    setTitleDraft(initialTitle ?? "");
    setDescriptionDraft(initialDescription ?? "");
    setCondition(initialCondition ?? "");
    setDetailsJson(initialDetails);
    setGeneratedAt(initialGeneratedAt);
  }, [initialTitle, initialDescription, initialCondition, initialDetails, initialGeneratedAt]);

  const formatApiError = (payload: ApiErrorShape | null, fallback: string) => {
    return payload?.error ?? fallback;
  };

  const hasGeneratedContent = Boolean(
    generatedAt || titleDraft.trim() || descriptionDraft.trim() || detailsJson
  );

  const handleGenerate = async () => {
    if (generating || !hasConfirmedItem) return;
    setGenerating(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(
        `/api/marketplace/listing-drafts/${draftId}/generate-details`,
        { method: "POST" }
      );
      const { payload } = await parseApiPayload<GenerateDetailsResponse & ApiErrorShape>(response);
      if (!response.ok) {
        throw new Error(formatApiError(payload, "Ember couldn’t draft the listing right now. Please try again in a minute."));
      }
      if (!payload?.details) {
        throw new Error("We received an unexpected response. Please try again.");
      }
      setDetailsJson(payload.details);
      setTitleDraft(payload.title_draft ?? payload.details.suggested_title);
      setDescriptionDraft(payload.description_draft ?? payload.details.suggested_description);
      setGeneratedAt(payload.listing_details_generated_at ?? new Date().toISOString());
      setSuccess("Draft listing details are ready to review and edit.");
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : "Ember couldn’t draft the listing right now. Please try again in a minute."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    if (!condition.trim()) {
      setConditionHighlight(true);
      setError("Choose a condition above, then save again. The review step only appears after condition is saved.");
      setSuccess(null);
      return;
    }
    setConditionHighlight(false);
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`/api/marketplace/listing-drafts/${draftId}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title_draft: titleDraft,
          description_draft: descriptionDraft,
          condition_confirmed_by_user: condition || undefined,
          listing_draft_details_json: detailsJson ?? undefined,
        }),
      });
      const { payload } = await parseApiPayload<
        {
          message?: string;
          error?: string;
          draft?: {
            title_draft: string | null;
            description_draft: string | null;
            condition_confirmed_by_user: string | null;
            listing_draft_details_json: ListingDraftDetailsJson | null;
          };
        } & ApiErrorShape
      >(response);
      if (!response.ok) {
        throw new Error(formatApiError(payload, "Your edits couldn’t be saved. Please try again."));
      }
      const savedTitle = payload?.draft?.title_draft ?? titleDraft;
      const savedDescription = payload?.draft?.description_draft ?? descriptionDraft;
      const savedCondition = payload?.draft?.condition_confirmed_by_user ?? condition;
      const savedDetails = payload?.draft?.listing_draft_details_json ?? detailsJson;
      if (payload?.draft?.title_draft) setTitleDraft(payload.draft.title_draft);
      if (payload?.draft?.description_draft) setDescriptionDraft(payload.draft.description_draft);
      if (payload?.draft?.condition_confirmed_by_user) {
        setCondition(payload.draft.condition_confirmed_by_user);
      }
      if (payload?.draft?.listing_draft_details_json) {
        setDetailsJson(payload.draft.listing_draft_details_json);
      }
      onSaved?.({
        title: savedTitle,
        description: savedDescription,
        condition: savedCondition || null,
        detailsJson: savedDetails,
      });
      setSuccess("Draft details saved. The review step is ready below.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Your edits couldn’t be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!hasConfirmedItem) {
    return null;
  }

  const wrapperClass = embedded
    ? "space-y-4 scroll-mt-4"
    : "rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 scroll-mt-4";

  return (
    <div id={sectionId} className={wrapperClass}>
      {!embedded && (
        <div className="space-y-1">
          <h2 className="text-base font-medium text-[#1A1E23]">Draft listing details</h2>
          <p className="text-sm text-[#5C646D]">
            Ember can draft the basics, but you’ll review and edit everything before anything is used.
          </p>
        </div>
      )}
      {embedded && (
        <p className="text-sm text-[#5C646D]">
          Ember can draft the basics. Edit anything that isn’t right, then save.
        </p>
      )}

      {!hasGeneratedContent && (
        <button
          type="button"
          disabled={generating}
          onClick={handleGenerate}
          className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {generating ? "Drafting your listing…" : "Draft listing details"}
        </button>
      )}

      {hasGeneratedContent && (
        <>
          {detailsJson?.restricted_or_blocked && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              This item may need extra safety checks before it can be listed. Please review carefully.
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1A1E23]" htmlFor="listing-title-draft">
                Listing title
              </label>
              <input
                id="listing-title-draft"
                type="text"
                maxLength={90}
                value={titleDraft}
                onChange={(event) => setTitleDraft(event.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#1A1E23]" htmlFor="listing-description-draft">
                Description
              </label>
              <textarea
                id="listing-description-draft"
                maxLength={1000}
                rows={5}
                value={descriptionDraft}
                onChange={(event) => setDescriptionDraft(event.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>

            <div
              className={`space-y-2 rounded-xl p-3 -mx-1 ${
                conditionHighlight && !condition.trim()
                  ? "border border-amber-300 bg-amber-50/80"
                  : "border border-transparent"
              }`}
            >
              <p className="text-sm font-medium text-[#1A1E23]">
                Condition <span className="font-normal text-[#5C646D]">(required)</span>
              </p>
              <p className="text-xs text-[#5C646D]">
                Pick the option that best matches the item. Ember can suggest one, but only you can
                confirm it — the review step unlocks after you save with a condition chosen.
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Item condition">
                {CONDITION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-xs ${
                      condition === option.value
                        ? "border-primary bg-primary/10 text-[#1A1E23]"
                        : "border-[#E5E7EB] text-[#5C646D]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="listing-condition"
                      value={option.value}
                      checked={condition === option.value}
                      onChange={() => {
                        setCondition(option.value);
                        setConditionHighlight(false);
                        setError(null);
                      }}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              {!condition.trim() && (
                <p className="text-xs text-amber-900">
                  No condition selected yet — choose one before tapping &ldquo;Save draft details&rdquo;.
                </p>
              )}
              {detailsJson?.condition_suggestion && (
                <p className="text-xs text-[#5C646D]">
                  Condition needs your confirmation. Ember&apos;s note:{" "}
                  {detailsJson.condition_suggestion.replace(
                    /^Condition needs parent confirmation$/i,
                    "please choose an option above"
                  )}
                </p>
              )}
            </div>

            {(detailsJson?.included_parts_checklist?.length ?? 0) > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1E23]">Included parts to check</p>
                <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
                  {detailsJson?.included_parts_checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(detailsJson?.missing_parts_questions?.length ?? 0) > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1E23]">Missing parts / completeness</p>
                <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
                  {detailsJson?.missing_parts_questions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(detailsJson?.safety_resale_notes?.length ?? 0) > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1E23]">Before listing, check…</p>
                <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
                  {detailsJson?.safety_resale_notes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(detailsJson?.photo_improvement_suggestions?.length ?? 0) > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#1A1E23]">Photo tips (optional)</p>
                <ul className="list-disc ml-5 text-sm text-[#5C646D] space-y-1">
                  {detailsJson?.photo_improvement_suggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {detailsJson?.parent_editing_note && (
              <p className="text-xs text-[#5C646D]">{detailsJson.parent_editing_note}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save draft details"}
            </button>
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="inline-flex items-center rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#1A1E23] disabled:opacity-60"
            >
              {generating ? "Regenerating…" : "Regenerate draft"}
            </button>
          </div>

          {success && <p className="text-sm text-emerald-700">{success}</p>}
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
