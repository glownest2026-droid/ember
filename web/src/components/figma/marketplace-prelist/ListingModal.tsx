"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { ItemNameStep } from "./steps/ItemNameStep";
import { ConditionDetailsStep } from "./steps/ConditionDetailsStep";
import { PickupAreaStep } from "./steps/PickupAreaStep";
import { PricingStep } from "./steps/PricingStep";
import { ReviewStep } from "./steps/ReviewStep";
import type { ListingData } from "./types";
import {
  createDraftListing,
  submitListing,
  upsertMarketplacePreferences,
  getMarketplacePreferences,
} from "@/lib/marketplace/actions";
import type { ItemTypeSuggestion } from "./types";

interface PhotoItem {
  id: string;
  storagePath: string;
  previewUrl?: string;
}

interface ListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: ListingData) => void;
  selectedChildId: string | null;
  selectedChildName: string;
  /** When editing, pass existing listing id + prefilled form + photos */
  initialListingId?: string | null;
  initialFormData?: Partial<ListingData> | null;
  initialPhotos?: PhotoItem[] | null;
}

const defaultFormData: Partial<ListingData> = {
  isBundle: false,
  includesAccessories: false,
  missingParts: false,
  smokeFree: false,
  petFree: false,
  wantReminders: true,
  pickupOnly: true,
  canPost: false,
  pricingIntent: "later",
  radius: "5",
};

export function ListingModal({
  isOpen,
  onClose,
  onComplete,
  selectedChildId,
  selectedChildName,
  initialListingId,
  initialFormData,
  initialPhotos,
}: ListingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ListingData>>(
    initialFormData ?? defaultFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [listingId, setListingId] = useState<string | null>(
    initialListingId ?? null
  );
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos ?? []);
  const [savedArea, setSavedArea] = useState<{
    postcode: string;
    radius: string;
  } | null>(null);
  const [emailWhenLaunch, setEmailWhenLaunch] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const steps = [
    { number: 1, label: "What item" },
    { number: 2, label: "Condition" },
    { number: 3, label: "Pickup area" },
    { number: 4, label: "Pricing" },
    { number: 5, label: "Review" },
  ];

  const supabase = createClient();

  useEffect(() => {
    if (isOpen && initialListingId && initialFormData) {
      setListingId(initialListingId);
      setFormData({ ...defaultFormData, ...initialFormData });
      setPhotos(initialPhotos ?? []);
      setCurrentStep(1);
    }
    if (isOpen && !initialListingId) {
      setListingId(null);
      setFormData(defaultFormData);
      setPhotos([]);
      setCurrentStep(1);
    }
  }, [isOpen, initialListingId, initialFormData, initialPhotos]);

  useEffect(() => {
    if (!isOpen) return;
    void getMarketplacePreferences().then((r) => {
      if (!("error" in r) && r.postcode) {
        setSavedArea({ postcode: r.postcode, radius: r.radius });
      } else {
        setSavedArea(null);
      }
    });
  }, [isOpen]);

  const suggestItemTypes = useCallback(
    async (query: string): Promise<ItemTypeSuggestion[]> => {
      const { data, error } = await supabase.rpc("suggest_marketplace_item_types", {
        query_text: query,
        p_limit: 5,
      });
      if (error) return [];
      return (data ?? []) as ItemTypeSuggestion[];
    },
    [supabase]
  );

  const ensureDraft = useCallback(async () => {
    if (listingId) return listingId;
    const result = await createDraftListing(
      selectedChildId,
      formData.itemName?.trim() ?? ""
    );
    if ("error" in result) throw new Error(result.error);
    setListingId(result.listingId);
    return result.listingId;
  }, [listingId, selectedChildId, formData.itemName]);

  const updateFormData = (data: Partial<ListingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setErrors({});
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.itemName?.trim()) {
        newErrors.itemName = "Please enter an item name";
      }
    } else if (currentStep === 2) {
      if (!formData.condition) {
        newErrors.condition = "Please select a condition";
      }
    } else if (currentStep === 3) {
      if (!formData.radius) {
        newErrors.radius = "Please select a radius";
      }
      if (!formData.postcode?.trim() && !savedArea?.postcode) {
        newErrors.postcode = "Please enter a postcode or area";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
    if (currentStep === 1) {
      try {
        await ensureDraft();
      } catch (e) {
        setErrors({
          itemName: e instanceof Error ? e.message : "Could not create listing",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleUploadPhoto = async (file: File) => {
    if (!listingId) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const name = `${crypto.randomUUID()}.${ext}`;
      const path = `${user.id}/${listingId}/${name}`;
      const { error: upError } = await supabase.storage
        .from("marketplace-listing-photos")
        .upload(path, file, { contentType: file.type });
      if (upError) throw upError;
      const { data: insertRow, error: insertError } = await supabase
        .from("marketplace_listing_photos")
        .insert({
          listing_id: listingId,
          storage_path: path,
          sort_order: photos.length,
        })
        .select("id")
        .single();
      if (insertError) throw insertError;
      const { data: signed } = await supabase.storage
        .from("marketplace-listing-photos")
        .createSignedUrl(path, 3600);
      setPhotos((prev) => [
        ...prev,
        {
          id: insertRow.id,
          storagePath: path,
          previewUrl: signed?.signedUrl ?? undefined,
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    await supabase
      .from("marketplace_listing_photos")
      .delete()
      .eq("id", id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSavePreferences = async (postcode: string, radius: string) => {
    const num = parseFloat(radius) || 5;
    const result = await upsertMarketplacePreferences(postcode.trim(), num);
    if (!("error" in result)) {
      setSavedArea({ postcode: postcode.trim(), radius });
    }
  };

  const buildNotes = (): string => {
    const parts: string[] = [];
    const intent = formData.pricingIntent || "later";
    if (intent === "later") {
      parts.push("Pricing: decide later.");
    } else if (intent === "rough" && formData.priceAmount) {
      parts.push(`Pricing: £${formData.priceAmount}.`);
    } else if (intent === "free") {
      parts.push("Pricing: free to a family nearby.");
    } else if (intent === "offers") {
      parts.push("Pricing: open to offers.");
    }
    if (formData.notes?.trim()) {
      parts.push(formData.notes.trim());
    }
    return parts.join(" ");
  };

  const handleSubmit = async () => {
    if (!listingId) return;
    setSubmitting(true);
    try {
      const notes = buildNotes();
      const result = await submitListing({
        listingId,
        rawItemText: formData.itemName?.trim() ?? "",
        selectedItemTypeId: formData.selectedItemTypeId ?? null,
        normalizationConfidence: formData.normalizationConfidence ?? null,
        condition: formData.condition ?? "",
        notes,
        postcode: formData.postcode?.trim() || savedArea?.postcode || null,
        radiusMiles: parseFloat(formData.radius || "5") || 5,
      });
      if ("error" in result) {
        setErrors({ submit: result.error });
        return;
      }
      if (emailWhenLaunch) {
        const { data: { user: u } } = await supabase.auth.getUser();
        if (u?.id) {
          await supabase.from("user_notification_prefs").upsert({
            user_id: u.id,
            development_reminders_enabled: true,
          });
        }
      }
      onComplete(formData as ListingData);
      setCurrentStep(1);
      setFormData(defaultFormData);
      setErrors({});
      setListingId(null);
      setPhotos([]);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <div
          className="p-6 lg:p-8 border-b"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl lg:text-3xl font-normal"
              style={{ color: "var(--ember-gray-900)" }}
            >
              Pre-list an item for {selectedChildName}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[var(--ember-gray-200)]"
              style={{ color: "var(--ember-gray-600)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
                    style={{
                      backgroundColor:
                        currentStep >= step.number
                          ? "var(--ember-primary)"
                          : "var(--ember-gray-200)",
                      color:
                        currentStep >= step.number
                          ? "white"
                          : "var(--ember-gray-600)",
                    }}
                  >
                    {step.number}
                  </div>
                  <span
                    className="hidden lg:inline text-sm"
                    style={{
                      color:
                        currentStep === step.number
                          ? "var(--ember-primary)"
                          : "var(--ember-gray-600)",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className="h-0.5 flex-1 mx-2"
                    style={{
                      backgroundColor:
                        currentStep > step.number
                          ? "var(--ember-primary)"
                          : "var(--ember-gray-200)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {currentStep === 1 && (
            <ItemNameStep
              data={formData}
              onChange={updateFormData}
              errors={errors}
              onSuggestItemTypes={suggestItemTypes}
            />
          )}
          {currentStep === 2 && (
            <ConditionDetailsStep
              data={formData}
              onChange={updateFormData}
              errors={errors}
              photos={photos}
              onUploadPhoto={handleUploadPhoto}
              onRemovePhoto={handleRemovePhoto}
              uploadDisabled={uploading || !listingId}
            />
          )}
          {currentStep === 3 && (
            <PickupAreaStep
              data={formData}
              onChange={updateFormData}
              errors={errors}
              savedArea={savedArea}
              onSavePreferences={handleSavePreferences}
            />
          )}
          {currentStep === 4 && (
            <PricingStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 5 && (
            <ReviewStep
              data={formData}
              selectedChildName={selectedChildName}
              photos={photos}
              emailWhenLaunch={emailWhenLaunch}
              onEmailWhenLaunchChange={setEmailWhenLaunch}
            />
          )}
        </div>

        {errors.submit && (
          <p
            className="px-6 text-sm"
            style={{ color: "var(--ember-primary)" }}
          >
            {errors.submit}
          </p>
        )}

        <div
          className="p-6 lg:p-8 border-t"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                color:
                  currentStep === 1
                    ? "var(--ember-gray-600)"
                    : "var(--ember-gray-900)",
              }}
            >
              Back
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: "var(--ember-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Next step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--ember-primary)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {submitting ? "Saving…" : "Save pre-launch listing"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
