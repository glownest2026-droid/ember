"use client";

import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { type ListingDraftDetailsJson } from "@/components/marketplace/ListingDraftDetailsSection";
import { type ListingDraftReviewJson } from "@/components/marketplace/ListingDraftReviewSection";
import {
  deriveListingFlowSteps,
  type ListingFlowStepId,
} from "@/components/marketplace/listing-flow/listing-flow-types";
import { useListingDebugMode } from "@/components/marketplace/listing-flow/useListingDebugMode";
import { createClient } from "@/utils/supabase/client";
import { CreateListingFlowView } from "@/components/marketplace/listing-flow/CreateListingFlowView";

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
  ai_raw_response_json: {
    parent_confirmed_display_label?: string;
    analysis?: { detected_item_label?: string; possible_brand?: string };
  } | null;
};

function getReviewFromDetailsJson(
  details: ListingDraftDetailsJson | null
): ListingDraftReviewJson | null {
  if (!details) return null;
  const review = (details as ListingDraftDetailsJson & { review?: ListingDraftReviewJson }).review;
  return review ?? null;
}

type AuthUser = {
  id: string;
};

type CandidateCard = {
  id: string | null;
  label: string;
  user_facing_item_label?: string;
  suggested_ai_label?: string;
  catalog_match_weak?: boolean;
  internal_category_label?: string | null;
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
  const [draftReview, setDraftReview] = useState<ListingDraftReviewJson | null>(null);
  const [detailsSavedOnce, setDetailsSavedOnce] = useState(false);
  const [possibleBrand, setPossibleBrand] = useState<string | null>(null);
  const [editStep, setEditStep] = useState<ListingFlowStepId | null>(null);
  const [opportunityLoaded, setOpportunityLoaded] = useState(false);
  const [publishedBeta, setPublishedBeta] = useState(false);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);
  const [defaultAreaLabel, setDefaultAreaLabel] = useState<string | null>(null);
  const [defaultPostcode, setDefaultPostcode] = useState<string | null>(null);
  const debugMode = useListingDebugMode();

  const brandCharacterHint = useMemo(() => {
    const brand = possibleBrand?.trim();
    if (!brand || brand.toLowerCase() === "unknown") return null;
    const label = confirmedDraft?.displayLabel?.trim();
    if (label) return `${brand} ${label}`;
    return brand;
  }, [possibleBrand, confirmedDraft?.displayLabel]);

  const itemConfirmed = Boolean(
    confirmedDraft?.status === "confirmed" && confirmedDraft.productTypeId
  );

  const flow = useMemo(
    () =>
      deriveListingFlowSteps({
        imageStoragePath,
        itemConfirmed,
        detailsSavedOnce,
        title: draftDetails.title,
        description: draftDetails.description,
        condition: draftDetails.condition,
        review: draftReview,
        opportunityLoaded,
        publishedBeta,
      }),
    [
      imageStoragePath,
      itemConfirmed,
      detailsSavedOnce,
      draftDetails.title,
      draftDetails.description,
      draftDetails.condition,
      draftReview,
      opportunityLoaded,
      publishedBeta,
    ]
  );

  const displayActiveStep: ListingFlowStepId | null =
    editStep ?? (flow.activeStep === "complete" ? null : flow.activeStep);

  const scrollToStep = (stepId: ListingFlowStepId) => {
    setEditStep(stepId);
    requestAnimationFrame(() => {
      document.getElementById(`listing-step-${stepId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const formatApiError = (payload: ApiErrorShape | null, fallback: string) => {
    const base = payload?.error ?? fallback;
    if (!debugMode) return base;
    const code = payload?.error_code ? ` (${payload.error_code})` : "";
    const provider =
      payload?.provider_status || payload?.provider_code
        ? ` Provider: ${payload.provider_status ?? "n/a"}${payload.provider_code ? `/${payload.provider_code}` : ""}`
        : "";
    const debug = payload?.debug_id ? ` Debug ref: ${payload.debug_id}` : "";
    return `${base}${code}${provider}${debug}`;
  };

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
        setDraftReview(getReviewFromDetailsJson(latest.listing_draft_details_json));
        setDetailsSavedOnce(Boolean(latest.condition_confirmed_by_user?.trim()));
        setPossibleBrand(latest.ai_raw_response_json?.analysis?.possible_brand?.trim() ?? null);
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

        const { data: prefs } = await supabase
          .from("marketplace_preferences")
          .select("postcode")
          .eq("user_id", authUser.id)
          .maybeSingle();
        if (prefs?.postcode) {
          setDefaultPostcode(prefs.postcode);
          const outward = prefs.postcode.trim().split(" ")[0];
          if (outward) setDefaultAreaLabel(`${outward.toUpperCase()} area`);
        }

        if (latest?.id) {
          const { data: published } = await supabase
            .from("marketplace_listings")
            .select("id, status")
            .eq("source_draft_id", latest.id)
            .eq("status", "published_beta")
            .maybeSingle();
          if (published?.id) {
            setPublishedBeta(true);
            setPublishedListingId(published.id);
            setOpportunityLoaded(true);
          }
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
    setDraftReview(null);
    setDetailsSavedOnce(false);
    setPossibleBrand(null);

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
      setSuccess("Photo uploaded privately.");
      setAnalysisResult(null);
      setConfirmedDraft(null);
      setSelectionMessage(null);
      setEditStep(null);
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
    setDraftReview(null);
    setDetailsSavedOnce(false);
    try {
      const response = await fetch(
        `/api/marketplace/listing-drafts/${draftId}/analyse-image`,
        { method: "POST" }
      );
      const { payload } = await parseApiPayload<AnalysisResponse & ApiErrorShape>(
        response
      );
      if (!response.ok) {
        throw new Error(
          formatApiError(payload, "Unable to analyse this image right now. Please try again.")
        );
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
        throw new Error(formatApiError(payload, "Could not save your selection."));
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
        setDraftReview(null);
        setDetailsSavedOnce(false);
      } else {
        setConfirmedDraft({
          status: draft?.status ?? "draft",
          productTypeId: null,
          label: null,
          displayLabel: null,
        });
      }
      setSelectionMessage(payload?.message ?? "Item confirmed.");
      setEditStep(null);
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
    <CreateListingFlowView
      debugMode={debugMode}
      draftId={draftId}
      imageStoragePath={imageStoragePath}
      previewUrl={previewUrl}
      uploading={uploading}
      error={error}
      success={success}
      flow={flow}
      displayActiveStep={displayActiveStep}
      onScrollToStep={scrollToStep}
      onFileSelected={handleFileSelected}
      analysisLoading={analysisLoading}
      analysisError={analysisError}
      analysisResult={analysisResult}
      onSuggestItem={handleSuggestItem}
      savingSelection={savingSelection}
      selectionMessage={selectionMessage}
      confirmedDraft={confirmedDraft}
      onSelectCandidate={handleSelectCandidate}
      draftDetails={draftDetails}
      itemConfirmed={itemConfirmed}
      detailsSavedOnce={detailsSavedOnce}
      onDetailsSaved={(saved) => {
        setDraftDetails((prev) => ({
          ...prev,
          title: saved.title,
          description: saved.description,
          condition: saved.condition,
          detailsJson: saved.detailsJson,
        }));
        setDraftReview(getReviewFromDetailsJson(saved.detailsJson));
        setDetailsSavedOnce(true);
        setEditStep(null);
        if (saved.condition?.trim()) {
          requestAnimationFrame(() => {
            document.getElementById("listing-step-review")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          });
        }
      }}
      draftReview={draftReview}
      onReviewUpdated={(review) => {
        setDraftReview(review);
        if (review?.ready_for_next_step && !review?.stale_after_edit) {
          setEditStep(null);
        }
      }}
      brandCharacterHint={brandCharacterHint}
      defaultAreaLabel={defaultAreaLabel}
      defaultPostcode={defaultPostcode}
      opportunityLoaded={opportunityLoaded}
      publishedBeta={publishedBeta}
      publishedListingId={publishedListingId}
      onOpportunityLoaded={() => setOpportunityLoaded(true)}
      onPublished={(listingId) => {
        setPublishedBeta(true);
        setPublishedListingId(listingId);
        setEditStep(null);
        requestAnimationFrame(() => {
          document.getElementById("listing-flow-complete")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }}
    />
  );
}
