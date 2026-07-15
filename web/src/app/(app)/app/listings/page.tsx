"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
    parent_confirmed_item_label?: string;
    parent_confirmed_category_label?: string;
    parent_confirmed_visual_description?: string;
    analysis?: {
      detected_item_label?: string;
      user_facing_item_label?: string;
      visual_description?: string;
      possible_brand?: string;
      broad_category?: string;
    };
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
    category_label?: string | null;
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
  categoryLabel: string | null;
};

type PublishedListingRow = {
  id: string;
  source_draft_id: string | null;
  title: string | null;
  description: string | null;
  condition: string | null;
  item_label: string | null;
  image_storage_path: string | null;
};

function getFileExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function resolveDraftDisplayLabels(
  draft: DraftRow,
  productType?: { label: string | null; subtitle: string | null } | null
): { displayLabel: string | null; categoryLabel: string | null } {
  const raw = draft.ai_raw_response_json;
  const displayLabel =
    raw?.parent_confirmed_item_label?.trim() ||
    raw?.parent_confirmed_display_label?.trim() ||
    raw?.analysis?.user_facing_item_label?.trim() ||
    raw?.analysis?.detected_item_label?.trim() ||
    draft.ai_detected_label?.trim() ||
    null;
  const categoryLabel =
    raw?.parent_confirmed_category_label?.trim() ||
    productType?.subtitle?.trim() ||
    raw?.analysis?.broad_category?.trim() ||
    productType?.label?.trim() ||
    null;
  return { displayLabel, categoryLabel };
}

async function draftHasPublishedListing(
  supabase: ReturnType<typeof createClient>,
  draftId: string
): Promise<{ id: string } | null> {
  const { data } = await supabase
    .from("marketplace_listings")
    .select("id")
    .eq("source_draft_id", draftId)
    .eq("status", "published_beta")
    .maybeSingle();
  return data?.id ? { id: data.id } : null;
}

function AppListingsPhotoDraftPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [flowMode, setFlowMode] = useState<"create" | "edit-published">("create");
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
  const [householdItemId, setHouseholdItemId] = useState<string | null>(null);
  const [householdItemLabel, setHouseholdItemLabel] = useState<string | null>(null);
  const [householdProductTypeId, setHouseholdProductTypeId] = useState<string | null>(null);
  const debugMode = useListingDebugMode();

  const brandCharacterHint = useMemo(() => {
    const brand = possibleBrand?.trim();
    if (!brand || brand.toLowerCase() === "unknown") return null;
    const label = confirmedDraft?.displayLabel?.trim();
    if (label) return `${brand} ${label}`;
    return brand;
  }, [possibleBrand, confirmedDraft?.displayLabel]);

  const itemConfirmed = Boolean(
    flowMode === "edit-published"
      ? confirmedDraft?.displayLabel?.trim()
      : confirmedDraft?.status === "confirmed" && confirmedDraft.productTypeId
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

  const loadMarketplacePrefs = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data: prefs } = await supabase
      .from("marketplace_preferences")
      .select("postcode")
      .eq("user_id", userId)
      .maybeSingle();
    if (prefs?.postcode) {
      setDefaultPostcode(prefs.postcode);
      const outward = prefs.postcode.trim().split(" ")[0];
      if (outward) setDefaultAreaLabel(`${outward.toUpperCase()} area`);
    }
  }, []);

  const resetToNewListingState = useCallback(() => {
    setFlowMode("create");
    setDraftId(null);
    setImageStoragePath(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
    setAnalysisError(null);
    setAnalysisResult(null);
    setSavingSelection(false);
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
    setEditStep(null);
    setOpportunityLoaded(false);
    setPublishedBeta(false);
    setPublishedListingId(null);
    // Keep household item context when starting a fresh listing from At home.
  }, []);

  const clearHouseholdItemContext = useCallback(() => {
    setHouseholdItemId(null);
    setHouseholdItemLabel(null);
    setHouseholdProductTypeId(null);
  }, []);

  const hydratePublishedListingForEdit = useCallback(
    async (
      supabase: ReturnType<typeof createClient>,
      userId: string,
      listing: PublishedListingRow,
      draft: DraftRow
    ) => {
      const imagePath = listing.image_storage_path?.trim() || draft.image_storage_path;
      const title = listing.title?.trim() || draft.title_draft;
      const description = listing.description?.trim() || draft.description_draft;
      const condition = listing.condition?.trim() || draft.condition_confirmed_by_user;

      const draftNeedsSync =
        (title && draft.title_draft !== title) ||
        (description && draft.description_draft !== description) ||
        (condition && draft.condition_confirmed_by_user !== condition) ||
        (imagePath && draft.image_storage_path !== imagePath);

      if (draftNeedsSync) {
        await supabase
          .from("marketplace_listing_drafts")
          .update({
            title_draft: title ?? draft.title_draft,
            description_draft: description ?? draft.description_draft,
            condition_confirmed_by_user: condition ?? draft.condition_confirmed_by_user,
            ...(imagePath ? { image_storage_path: imagePath } : {}),
          })
          .eq("id", draft.id)
          .eq("user_id", userId);
      }

      setDraftId(draft.id);
      setImageStoragePath(imagePath);
      setDraftDetails({
        title: title ?? null,
        description: description ?? null,
        condition: condition ?? null,
        detailsJson: draft.listing_draft_details_json,
        generatedAt: draft.listing_details_generated_at,
      });
      setDraftReview(getReviewFromDetailsJson(draft.listing_draft_details_json));
      setDetailsSavedOnce(Boolean(condition?.trim()));
      setPossibleBrand(draft.ai_raw_response_json?.analysis?.possible_brand?.trim() ?? null);

      if (draft.product_type_id) {
        const { data: productType } = await supabase
          .from("product_types")
          .select("label, subtitle")
          .eq("id", draft.product_type_id)
          .maybeSingle();
        const labels = resolveDraftDisplayLabels(draft, productType);
        setConfirmedDraft({
          status: "confirmed",
          productTypeId: draft.product_type_id,
          label: productType?.label ?? null,
          displayLabel:
            listing.item_label?.trim() || labels.displayLabel,
          categoryLabel: labels.categoryLabel,
        });
      } else {
        const labels = resolveDraftDisplayLabels(draft, null);
        setConfirmedDraft({
          status: "confirmed",
          productTypeId: null,
          label: null,
          displayLabel: listing.item_label?.trim() || labels.displayLabel,
          categoryLabel: labels.categoryLabel,
        });
      }

      setSelectionMessage("Editing your live listing.");

      if (imagePath) {
        await refreshSignedPreview(imagePath);
      }

      setPublishedBeta(true);
      setPublishedListingId(listing.id);
      setOpportunityLoaded(true);
    },
    [refreshSignedPreview]
  );

  const hydrateDraftRow = useCallback(
    async (supabase: ReturnType<typeof createClient>, latest: DraftRow, publishedListingId: string | null) => {
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
          .select("label, subtitle")
          .eq("id", latest.product_type_id)
          .maybeSingle();
        const labels = resolveDraftDisplayLabels(latest, productType);
        setConfirmedDraft({
          status: latest.status,
          productTypeId: latest.product_type_id,
          label: productType?.label ?? null,
          displayLabel: labels.displayLabel,
          categoryLabel: labels.categoryLabel,
        });
        setSelectionMessage("Confirmed item type saved on this draft.");
      } else if (latest.status === "draft" && !latest.product_type_id) {
        setConfirmedDraft({
          status: latest.status,
          productTypeId: null,
          label: null,
          displayLabel: null,
          categoryLabel: null,
        });
      }

      if (latest.image_storage_path) {
        await refreshSignedPreview(latest.image_storage_path);
      }

      if (publishedListingId) {
        setPublishedBeta(true);
        setPublishedListingId(publishedListingId);
        setOpportunityLoaded(true);
      }
    },
    [refreshSignedPreview]
  );

  const handleStartNewListing = useCallback(() => {
    resetToNewListingState();
    clearHouseholdItemContext();
    router.replace("/app/listings?new=1");
    setSuccess("Add a photo to start your next listing.");
  }, [resetToNewListingState, clearHouseholdItemContext, router]);

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
      await loadMarketplacePrefs(authUser.id);

      const forceNew = searchParams.get("new") === "1";
      const editListingId = searchParams.get("edit")?.trim() || null;
      const fromHouseholdItem = searchParams.get("household_item")?.trim() || null;

      if (fromHouseholdItem) {
        const { data: owned } = await supabase
          .from("garage_items")
          .select(
            `
            id,
            product_type_id,
            raw_query,
            product_types ( label ),
            pl_category_types ( label )
          `
          )
          .eq("id", fromHouseholdItem)
          .eq("user_id", authUser.id)
          .maybeSingle();

        if (!active) return;

        if (owned?.id) {
          const pt = owned.product_types as { label?: string | null } | null;
          const ct = owned.pl_category_types as { label?: string | null } | null;
          const label =
            ct?.label?.trim() ||
            pt?.label?.trim() ||
            (owned.raw_query as string | null)?.trim() ||
            "Item at home";
          setHouseholdItemId(owned.id);
          setHouseholdItemLabel(label);
          setHouseholdProductTypeId((owned.product_type_id as string | null) ?? null);
          resetToNewListingState();
          setSuccess(`Listing from At home: ${label}. Add a photo to continue.`);
          if (active) setLoading(false);
          return;
        }

        clearHouseholdItemContext();
        setError("That At home item could not be found.");
      } else {
        clearHouseholdItemContext();
      }

      if (forceNew) {
        resetToNewListingState();
        if (active) setLoading(false);
        return;
      }

      if (editListingId) {
        const { data: listing, error: listingError } = await supabase
          .from("marketplace_listings")
          .select(
            "id, source_draft_id, title, description, condition, item_label, image_storage_path, status"
          )
          .eq("id", editListingId)
          .eq("user_id", authUser.id)
          .eq("status", "published_beta")
          .maybeSingle();

        if (!active) return;

        if (listingError || !listing) {
          setError("That listing could not be loaded for editing.");
          resetToNewListingState();
          setLoading(false);
          return;
        }

        let draftQuery = supabase
          .from("marketplace_listing_drafts")
          .select(
            "id, image_storage_path, product_type_id, status, title_draft, description_draft, condition_confirmed_by_user, listing_draft_details_json, listing_details_generated_at, ai_detected_label, ai_raw_response_json"
          )
          .eq("user_id", authUser.id);

        if (listing.source_draft_id) {
          draftQuery = draftQuery.eq("id", listing.source_draft_id);
        } else if (listing.image_storage_path) {
          draftQuery = draftQuery.eq("image_storage_path", listing.image_storage_path);
        } else {
          setError("This listing is missing its draft link. Contact support.");
          resetToNewListingState();
          setLoading(false);
          return;
        }

        const { data: draft, error: draftError } = await draftQuery.maybeSingle();

        if (!active) return;

        if (draftError || !draft) {
          setError("Draft for this listing was not found.");
          resetToNewListingState();
          setLoading(false);
          return;
        }

        setFlowMode("edit-published");
        await hydratePublishedListingForEdit(
          supabase,
          authUser.id,
          listing as PublishedListingRow,
          draft as DraftRow
        );
        if (active) setLoading(false);
        return;
      }

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
      if (latest?.id) {
        const published = await draftHasPublishedListing(supabase, latest.id);
        if (!active) return;

        if (published) {
          resetToNewListingState();
        } else {
          setFlowMode("create");
          await hydrateDraftRow(supabase, latest, null);
        }
      } else {
        resetToNewListingState();
      }

      if (active) setLoading(false);
    };

    void boot();
    return () => {
      active = false;
    };
  }, [
    searchParams,
    refreshSignedPreview,
    resetToNewListingState,
    clearHouseholdItemContext,
    hydrateDraftRow,
    hydratePublishedListingForEdit,
    loadMarketplacePrefs,
  ]);

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
            ...(householdItemId
              ? {
                  household_item_id: householdItemId,
                  product_type_id: householdProductTypeId,
                }
              : {}),
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
          product_type_id: householdItemId ? householdProductTypeId : null,
          ...(householdItemId ? { household_item_id: householdItemId } : {}),
          status: "draft",
          title_draft: null,
          description_draft: null,
          condition_confirmed_by_user: null,
          condition_suggestion: null,
          listing_draft_details_json: null,
          listing_details_generated_at: null,
          ai_detected_label: null,
          ai_confidence: null,
          ai_raw_response_json: null,
        })
        .eq("id", activeDraftId)
        .eq("user_id", user.id);

      if (updateDraftError) throw new Error(updateDraftError.message);

      await supabase
        .from("marketplace_listing_intelligence")
        .delete()
        .eq("draft_id", activeDraftId)
        .eq("seller_user_id", user.id);
      await supabase
        .from("marketplace_taxonomy_review_queue")
        .delete()
        .eq("draft_id", activeDraftId)
        .eq("submitted_by_user_id", user.id);

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
          categoryLabel:
            payload?.selected_product_type?.category_label?.trim() ||
            payload?.selected_product_type?.subtitle?.trim() ||
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
          categoryLabel: null,
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
        setDraftReview(
          saved.review ?? getReviewFromDetailsJson(saved.detailsJson)
        );
        setDetailsSavedOnce(true);
        setEditStep(null);
        if (saved.condition?.trim() && saved.review?.ready_for_next_step) {
          requestAnimationFrame(() => {
            document.getElementById("listing-step-opportunity")?.scrollIntoView({
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
      flowMode={flowMode}
      onStartNewListing={handleStartNewListing}
      onOpportunityLoaded={() => setOpportunityLoaded(true)}
      onPublished={() => {
        resetToNewListingState();
        router.replace("/app/listings?new=1");
        setSuccess("Your listing is live. Add another item below, or open the marketplace to see it.");
      }}
    />
  );
}

export default function AppListingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#5C646D]">Loading your listing draft…</div>}>
      <AppListingsPhotoDraftPage />
    </Suspense>
  );
}
