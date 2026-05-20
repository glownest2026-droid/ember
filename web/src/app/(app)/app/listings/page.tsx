"use client";

import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Camera, Lock } from "lucide-react";
import { ListingDraftDetailsSection, type ListingDraftDetailsJson } from "@/components/marketplace/ListingDraftDetailsSection";
import { createClient } from "@/utils/supabase/client";

const RAW_LISTING_BUCKET = "marketplace-raw-listing-photos";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type DraftRow = {
  id: string;
  image_storage_path: string | null;
  product_type_id: string | null;
  status: string;
  title_draft: string | null;
  description_draft: string | null;
  condition_confirmed_by_user: string | null;
  listing_draft_details_json: ListingDraftDetailsJson | null;
  listing_details_generated_at: string | null;
  ai_detected_label: string | null;
  ai_raw_response_json: { parent_confirmed_display_label?: string; analysis?: { detected_item_label?: string } } | null;
};

type AuthUser = {
  id: string;
};

type CandidateCard = {
  id: string | null;
  label: string;
  catalog_match_label: string | null;
  subtitle: string | null;
  reason: string;
  confidence_bucket: "high" | "medium" | "low";
  confidence_label: "Looks likely" | "Possible match" | "Not sure yet";
  source: "canonical_match" | "ai_suggestion";
};

type AnalysisResponse = {
  draft_id: string;
  detected_item_label: string;
  confidence_bucket: "high" | "medium" | "low";
  candidate_cards: CandidateCard[];
  missing_parts_questions: string[];
  safety_warnings: string[];
  low_confidence_message: string | null;
  debug_id?: string;
};

type ApiErrorShape = {
  error?: string;
  error_code?: string;
  debug_id?: string;
  retryable?: boolean;
  provider_status?: number | null;
  provider_code?: string | null;
};

type SelectCandidateResponse = {
  ok?: boolean;
  message?: string;
  selected_product_type?: {
    id: string;
    label: string;
    display_label?: string | null;
    subtitle: string | null;
  };
  draft?: {
    id: string;
    product_type_id: string | null;
    status: string;
  };
};

type ConfirmedDraftState = {
  status: string;
  productTypeId: string | null;
  label: string | null;
  displayLabel: string | null;
};

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export default function AppListingsPhotoDraftPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [imageStoragePath, setImageStoragePath] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [savingSelection, setSavingSelection] = useState(false);
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [confirmedDraft, setConfirmedDraft] = useState<ConfirmedDraftState | null>(null);
  const [draftDetails, setDraftDetails] = useState<{
    title: string | null;
    description: string | null;
    condition: string | null;
    detailsJson: ListingDraftDetailsJson | null;
    generatedAt: string | null;
  }>({
    title: null,
    description: null,
    condition: null,
    detailsJson: null,
    generatedAt: null,
  });

  const parseApiPayload = async <T,>(
    response: Response
  ): Promise<{ payload: T | null; rawText: string }> => {
    const rawText = await response.text();
    if (!rawText) return { payload: null, rawText };
    try {
      return { payload: JSON.parse(rawText) as T, rawText };
    } catch {
      return { payload: null, rawText };
    }
  };

  const refreshSignedPreview = useCallback(async (path: string) => {
    const supabase = createClient();
    const { data, error: signedError } = await supabase.storage
      .from(RAW_LISTING_BUCKET)
      .createSignedUrl(path, 3600);
    if (signedError) {
      setPreviewUrl(null);
      setError(`Uploaded, but preview link failed: ${signedError.message}`);
      return;
    }
    setPreviewUrl(data?.signedUrl ?? null);
  }, []);

  useEffect(() => {
    let active = true;
    const boot = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({ id: authUser.id });

      const { data: drafts, error: draftsError } = await supabase
        .from("marketplace_listing_drafts")
        .select(
          "id, image_storage_path, product_type_id, status, title_draft, description_draft, condition_confirmed_by_user, listing_draft_details_json, listing_details_generated_at, ai_detected_label, ai_raw_response_json"
        )
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!active) return;

      if (draftsError) {
        setError(draftsError.message);
        setLoading(false);
        return;
      }

      const latest = (drafts?.[0] ?? null) as DraftRow | null;
      if (latest) {
        setDraftId(latest.id);
        setImageStoragePath(latest.image_storage_path);
        setDraftDetails({
          title: latest.title_draft,
          description: latest.description_draft,
          condition: latest.condition_confirmed_by_user,
          detailsJson: latest.listing_draft_details_json,
          generatedAt: latest.listing_details_generated_at,
        });
        if (latest.status === "confirmed" && latest.product_type_id) {
          const { data: productType } = await supabase
            .from("product_types")
            .select("label")
            .eq("id", latest.product_type_id)
            .maybeSingle();
          const visualLabel =
            latest.ai_raw_response_json?.parent_confirmed_display_label?.trim() ||
            latest.ai_raw_response_json?.analysis?.detected_item_label?.trim() ||
            latest.ai_detected_label?.trim() ||
            null;
          setConfirmedDraft({
            status: latest.status,
            productTypeId: latest.product_type_id,
            label: productType?.label ?? null,
            displayLabel: visualLabel,
          });
          setSelectionMessage("Confirmed item type saved on this draft.");
        } else if (latest.status === "draft" && !latest.product_type_id) {
          setConfirmedDraft({
            status: latest.status,
            productTypeId: null,
            label: null,
            displayLabel: null,
          });
        }
        if (latest.image_storage_path) {
          await refreshSignedPreview(latest.image_storage_path);
        }
      }

      if (active) setLoading(false);
    };

    void boot();
    return () => {
      active = false;
    };
  }, [refreshSignedPreview]);

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setError(null);
    setSuccess(null);
    setAnalysisError(null);
    setSelectionMessage(null);
    setConfirmedDraft(null);
    setDraftDetails({
      title: null,
      description: null,
      condition: null,
      detailsJson: null,
      generatedAt: null,
    });

    if (!file) return;
    if (!user) {
      setError("Please sign in to upload a listing photo.");
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image is too large. Max file size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      let activeDraftId = draftId;

      if (!activeDraftId) {
        const { data: insertedDraft, error: insertDraftError } = await supabase
          .from("marketplace_listing_drafts")
          .insert({
            user_id: user.id,
            status: "draft",
          })
          .select("id")
          .single();

        if (insertDraftError || !insertedDraft?.id) {
          throw new Error(insertDraftError?.message ?? "Failed to create draft.");
        }

        activeDraftId = insertedDraft.id;
        setDraftId(activeDraftId);
      }

      const path = `${user.id}/${activeDraftId}/${Date.now()}-${crypto.randomUUID()}.${getFileExtension(file)}`;
      const { error: uploadError } = await supabase.storage
        .from(RAW_LISTING_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { error: updateDraftError } = await supabase
        .from("marketplace_listing_drafts")
        .update({
          image_storage_path: path,
          product_type_id: null,
          status: "draft",
          title_draft: null,
          description_draft: null,
          condition_confirmed_by_user: null,
          listing_draft_details_json: null,
          listing_details_generated_at: null,
          ai_detected_label: null,
          ai_confidence: null,
          ai_raw_response_json: null,
        })
        .eq("id", activeDraftId)
        .eq("user_id", user.id);

      if (updateDraftError) throw new Error(updateDraftError.message);

      setImageStoragePath(path);
      await refreshSignedPreview(path);
      setSuccess("Photo uploaded privately to your draft.");
      setAnalysisResult(null);
      setConfirmedDraft(null);
      setSelectionMessage(null);
    } catch (uploadFlowError) {
      setError(uploadFlowError instanceof Error ? uploadFlowError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSuggestItem = async () => {
    if (analysisLoading) return;
    setAnalysisError(null);
    setSelectionMessage(null);

    if (!draftId) {
      setAnalysisError("Please upload a photo first.");
      return;
    }
    setAnalysisLoading(true);
    setConfirmedDraft(null);
    setSelectionMessage(null);
    setDraftDetails({
      title: null,
      description: null,
      condition: null,
      detailsJson: null,
      generatedAt: null,
    });
    try {
      const response = await fetch(
        `/api/marketplace/listing-drafts/${draftId}/analyse-image`,
        { method: "POST" }
      );
      const { payload } = await parseApiPayload<AnalysisResponse & ApiErrorShape>(
        response
      );
      if (!response.ok) {
        const base = payload?.error ?? "Unable to analyse this image right now. Please try again.";
        const showDiagnostics =
          process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
        const code = showDiagnostics && payload?.error_code ? ` (${payload.error_code})` : "";
        const provider =
          showDiagnostics && (payload?.provider_status || payload?.provider_code)
            ? ` Provider: ${payload.provider_status ?? "n/a"}${payload?.provider_code ? `/${payload.provider_code}` : ""}`
            : "";
        const debug = showDiagnostics && payload?.debug_id ? ` Ref: ${payload.debug_id}` : "";
        throw new Error(`${base}${code}${provider}${debug}`);
      }
      if (!payload) {
        throw new Error("We received an unexpected response. Please try again.");
      }
      setAnalysisResult(payload);
    } catch (analysisRequestError) {
      const message =
        analysisRequestError instanceof Error ? analysisRequestError.message : "Unable to analyse this image.";
      setAnalysisError(
        message === "Failed to fetch"
          ? "Could not reach image suggestion service. Please check connection and try again."
          : message
      );
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleSelectCandidate = async (
    productTypeId: string | null,
    displayLabel?: string | null
  ) => {
    if (savingSelection) return;
    if (!draftId) return;
    setSavingSelection(true);
    setAnalysisError(null);
    setSelectionMessage(null);
    try {
      const response = await fetch(
        `/api/marketplace/listing-drafts/${draftId}/select-candidate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            productTypeId
              ? {
                  selection: "canonical",
                  product_type_id: productTypeId,
                  display_label: displayLabel?.trim() || null,
                }
              : { selection: "not_sure" }
          ),
        }
      );
      const { payload } = await parseApiPayload<SelectCandidateResponse & ApiErrorShape>(response);
      if (!response.ok) {
        const base = payload?.error ?? "Could not save your selection.";
        const code = payload?.error_code ? ` (${payload.error_code})` : "";
        const provider =
          payload?.provider_status || payload?.provider_code
            ? ` Provider: ${payload.provider_status ?? "n/a"}${payload?.provider_code ? `/${payload.provider_code}` : ""}`
            : "";
        const debug = payload?.debug_id ? ` Ref: ${payload.debug_id}` : "";
        throw new Error(`${base}${code}${provider}${debug}`);
      }
      const draft = payload?.draft;
      if (draft?.status === "confirmed" && draft.product_type_id) {
        setConfirmedDraft({
          status: draft.status,
          productTypeId: draft.product_type_id,
          label: payload?.selected_product_type?.label ?? null,
          displayLabel:
            payload?.selected_product_type?.display_label?.trim() ||
            displayLabel?.trim() ||
            analysisResult?.detected_item_label?.trim() ||
            null,
        });
        setDraftDetails({
          title: null,
          description: null,
          condition: null,
          detailsJson: null,
          generatedAt: null,
        });
      } else {
        setConfirmedDraft({
          status: draft?.status ?? "draft",
          productTypeId: null,
          label: null,
          displayLabel: null,
        });
      }
      setSelectionMessage(payload?.message ?? "Saved to your draft.");
    } catch (selectionError) {
      const message =
        selectionError instanceof Error ? selectionError.message : "Could not save your selection.";
      setAnalysisError(
        message === "Failed to fetch"
          ? "Could not reach save service. Please try again."
          : message
      );
    } finally {
      setSavingSelection(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#5C646D]">Loading your listing draft…</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-[#5C646D]">
          Please{" "}
          <Link className="underline text-primary" href="/signin">
            sign in
          </Link>{" "}
          to upload a listing photo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-normal text-[#1A1E23]">Start a listing with a photo</h1>
        <p className="text-sm text-[#5C646D]">
          Upload one item photo to your private draft. Nothing is public and nothing is published.
        </p>
      </header>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#1A1E23] bg-[#FAFAFA] border border-[#E5E7EB] rounded-full px-3 py-1.5">
          <Lock className="w-3.5 h-3.5" />
          Private storage only
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
              htmlFor="draft-photo-take"
            >
              <Camera className="w-4 h-4" />
              {uploading ? "Uploading..." : "Take photo"}
            </label>
            <label
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#1A1E23]"
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
            onChange={handleFileSelected}
            disabled={uploading}
          />
          <input
            id="draft-photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelected}
            disabled={uploading}
          />
          <p className="mt-2 text-xs text-[#5C646D]">Allowed: JPG, PNG, WebP. Max size: 10MB.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-700">{success}</p>}

        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
          <p className="text-xs text-[#5C646D] mb-2">
            Draft ID: <span className="font-mono">{draftId ?? "will be created on first upload"}</span>
          </p>
          <p className="text-xs text-[#5C646D] break-all">
            Image path: <span className="font-mono">{imageStoragePath ?? "none yet"}</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-base font-medium text-[#1A1E23] mb-3">Owner preview</h2>
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Your uploaded listing draft photo" className="w-full max-h-[420px] object-contain rounded-xl border border-[#E5E7EB]" />
        ) : (
          <p className="text-sm text-[#5C646D]">Upload a photo to preview it here.</p>
        )}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4">
        <h2 className="text-base font-medium text-[#1A1E23]">Item suggestion</h2>
        <p className="text-sm text-[#5C646D]">
          Ember will look at the photo and suggest likely matches. You’ll confirm before anything is used.
        </p>
        <button
          type="button"
          disabled={!imageStoragePath || analysisLoading || uploading}
          onClick={handleSuggestItem}
          className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {analysisLoading ? "Checking the photo…" : "Suggest item"}
        </button>

        {analysisError && <p className="text-sm text-red-600">{analysisError}</p>}
        {selectionMessage && <p className="text-sm text-emerald-700">{selectionMessage}</p>}

        {confirmedDraft?.status === "confirmed" && confirmedDraft.productTypeId && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1">
            <p className="text-sm font-medium text-emerald-900">Confirmed on your draft</p>
            <p className="text-sm text-emerald-800">
              {confirmedDraft.displayLabel ?? confirmedDraft.label ?? "Item type saved."}
              {confirmedDraft.displayLabel &&
                confirmedDraft.label &&
                confirmedDraft.displayLabel.toLowerCase() !== confirmedDraft.label.toLowerCase() && (
                  <> (catalog: {confirmedDraft.label})</>
                )}
              . Ember will only use this match after your confirmation.
            </p>
          </div>
        )}
        {confirmedDraft?.status === "draft" && !confirmedDraft.productTypeId && selectionMessage && (
          <p className="text-sm text-[#5C646D]">
            No canonical item type saved yet. You can choose manually in a later step.
          </p>
        )}

        {analysisResult && (
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-medium text-[#1A1E23]">Is it one of these?</h3>
            {analysisResult.low_confidence_message && (
              <p className="text-sm text-[#5C646D]">{analysisResult.low_confidence_message}</p>
            )}
            <ul className="space-y-3">
              {analysisResult.candidate_cards.map((candidate) => (
                <li key={`${candidate.id ?? candidate.label}-${candidate.source}`} className="rounded-xl border border-[#E5E7EB] p-4 bg-[#FAFAFA] space-y-2">
                  <p className="font-medium text-[#1A1E23]">{candidate.label}</p>
                  {candidate.catalog_match_label &&
                    candidate.catalog_match_label.toLowerCase() !== candidate.label.toLowerCase() && (
                      <p className="text-xs text-[#5C646D]">
                        Catalog match: {candidate.catalog_match_label}
                        {candidate.subtitle ? ` · ${candidate.subtitle}` : ""}
                      </p>
                    )}
                  {candidate.subtitle && !candidate.catalog_match_label && (
                    <p className="text-xs text-[#5C646D]">{candidate.subtitle}</p>
                  )}
                  <p className="text-sm text-[#5C646D]">{candidate.reason}</p>
                  <p className="text-xs text-[#5C646D]">{candidate.confidence_label}</p>
                  {candidate.id ? (
                    <button
                      type="button"
                      disabled={savingSelection}
                      onClick={() => handleSelectCandidate(candidate.id, candidate.label)}
                      className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm text-[#1A1E23] disabled:opacity-60"
                    >
                      Choose this
                    </button>
                  ) : (
                    <p className="text-xs text-[#5C646D]">No exact Ember catalog ID yet.</p>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={savingSelection}
              onClick={() => handleSelectCandidate(null)}
              className="inline-flex items-center rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm text-[#1A1E23] disabled:opacity-60"
            >
              Not sure / choose manually
            </button>
            {(selectionMessage || savingSelection) && (
              <p className="text-sm text-[#5C646D]">
                Next: Ember will draft the listing details.
              </p>
            )}

            {analysisResult.missing_parts_questions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#1A1E23]">Parent checks</p>
                <ul className="list-disc ml-5 text-xs text-[#5C646D] space-y-1">
                  {analysisResult.missing_parts_questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {draftId && (
        <ListingDraftDetailsSection
          draftId={draftId}
          initialTitle={draftDetails.title}
          initialDescription={draftDetails.description}
          initialCondition={draftDetails.condition}
          initialDetails={draftDetails.detailsJson}
          initialGeneratedAt={draftDetails.generatedAt}
          hasConfirmedItem={Boolean(
            confirmedDraft?.status === "confirmed" && confirmedDraft.productTypeId
          )}
        />
      )}

      <p className="text-xs text-[#5C646D]">
        Raw photos stay private. AI is a suggestion, and parent confirmation is required before Ember uses a match.
      </p>
    </div>
  );
}
