"use client";

import {
  Package,
  MapPin,
  CheckCircle,
  Mail,
} from "lucide-react";
import type { ListingData } from "../types";

interface ReviewPhoto {
  id: string;
  storagePath: string;
  previewUrl?: string;
}

interface ReviewStepProps {
  data: Partial<ListingData>;
  selectedChildName: string;
  photos?: ReviewPhoto[];
  emailWhenLaunch?: boolean;
  onEmailWhenLaunchChange?: (value: boolean) => void;
}

export function ReviewStep({
  data,
  selectedChildName,
  photos = [],
  emailWhenLaunch,
  onEmailWhenLaunchChange,
}: ReviewStepProps) {
  const pricingLabels: Record<string, string> = {
    later: "I'll decide later",
    rough: "Rough price",
    free: "Free to a family nearby",
    offers: "Open to offers",
  };

  return (
    <div className="space-y-3">
      <div>
        <h3
          className="text-lg font-medium mb-1"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Review your listing
        </h3>
        <p
          className="text-xs mb-3"
          style={{ color: "var(--ember-gray-600)" }}
        >
          We&apos;ll save this now. You can edit before Marketplace opens.
        </p>

        <div
          className="rounded-xl border-2 overflow-hidden"
          style={{
            borderColor: "var(--ember-primary-light)",
            backgroundColor: "white",
          }}
        >
          <div
            className="px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            style={{ backgroundColor: "var(--ember-blush)" }}
          >
            <div>
              <span
                className="text-xs font-medium block"
                style={{ color: "var(--ember-primary)" }}
              >
                Pre-launch listing
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--ember-gray-600)" }}
              >
                Not public yet
              </span>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full bg-white self-start sm:self-auto font-medium"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Not public yet
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-start gap-3 mb-2">
                <div
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--ember-gray-200)] bg-[var(--ember-gray-100)]"
                >
                  {photos[0]?.previewUrl ? (
                    <img
                      src={photos[0].previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package
                      className="w-10 h-10"
                      style={{ color: "var(--ember-primary)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-lg font-medium mb-0.5"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    {data.itemName || "Untitled item"}
                  </h4>
                  {data.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "var(--ember-primary-10)",
                        color: "var(--ember-primary)",
                      }}
                    >
                      {data.category}
                    </span>
                  )}
                  {data.isBundle && (
                    <span
                      className="inline-block ml-2 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "var(--ember-gray-200)",
                        color: "var(--ember-gray-600)",
                      }}
                    >
                      Bundle{data.quantity ? ` (${data.quantity} items)` : ""}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--ember-gray-100)" }}
                >
                  <div
                    className="text-xs mb-0.5"
                    style={{ color: "var(--ember-gray-600)" }}
                  >
                    Condition
                  </div>
                  <div
                    className="font-medium capitalize"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    {data.condition?.replace("-", " ") || "Not specified"}
                  </div>
                </div>
                {data.brand && (
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--ember-gray-100)" }}
                  >
                    <div
                      className="text-xs mb-0.5"
                      style={{ color: "var(--ember-gray-600)" }}
                    >
                      Brand
                    </div>
                    <div
                      className="font-medium"
                      style={{ color: "var(--ember-gray-900)" }}
                    >
                      {data.brand}
                    </div>
                  </div>
                )}
              </div>

              {data.notes && (
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "var(--ember-gray-100)" }}
                >
                  <div
                    className="text-xs mb-0.5"
                    style={{ color: "var(--ember-gray-600)" }}
                  >
                    Notes
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    {data.notes}
                  </div>
                </div>
              )}

              {(data.includesAccessories ||
                data.missingParts ||
                data.smokeFree ||
                data.petFree) && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.includesAccessories && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--ember-primary-5)",
                        color: "var(--ember-gray-600)",
                      }}
                    >
                      ✓ Includes accessories
                    </span>
                  )}
                  {data.missingParts && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--ember-gray-200)",
                        color: "var(--ember-gray-600)",
                      }}
                    >
                      Missing parts
                    </span>
                  )}
                  {data.smokeFree && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--ember-primary-5)",
                        color: "var(--ember-gray-600)",
                      }}
                    >
                      Smoke-free home
                    </span>
                  )}
                  {data.petFree && (
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--ember-primary-5)",
                        color: "var(--ember-gray-600)",
                      }}
                    >
                      Pet-free home
                    </span>
                  )}
                </div>
              )}
            </div>

            <div
              className="h-px"
              style={{ backgroundColor: "var(--ember-gray-300)" }}
            />

            <div className="flex items-center gap-2">
              <MapPin
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--ember-primary)" }}
              />
              <div className="text-sm" style={{ color: "var(--ember-gray-900)" }}>
                {data.postcode || "Saved area"} • {data.radius} mile radius
              </div>
              <span className="text-xs" style={{ color: "var(--ember-gray-600)" }}>
                Pickup only
              </span>
            </div>

            <div
              className="h-px"
              style={{ backgroundColor: "var(--ember-gray-300)" }}
            />

            <div className="flex items-center gap-2">
              <div className="text-sm font-medium" style={{ color: "var(--ember-gray-900)" }}>
                {data.pricingIntent === "rough" && data.priceAmount
                  ? `£${data.priceAmount}`
                  : pricingLabels[data.pricingIntent || "later"]}
              </div>
              <span className="text-xs" style={{ color: "var(--ember-gray-600)" }}>
                Change when Marketplace launches
              </span>
            </div>

            <div
              className="h-px"
              style={{ backgroundColor: "var(--ember-gray-300)" }}
            />

            <div
              className="p-3 rounded-lg flex items-center gap-2"
              style={{ backgroundColor: "var(--ember-blush)" }}
            >
              <CheckCircle
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "var(--ember-primary)" }}
              />
              <div>
                <span className="text-sm font-medium" style={{ color: "var(--ember-gray-900)" }}>
                  Listed for {selectedChildName}
                </span>
                <span className="text-xs ml-1" style={{ color: "var(--ember-gray-600)" }}>
                  — we&apos;ll use their stage to match
                </span>
              </div>
            </div>

            {onEmailWhenLaunchChange && (
              <>
                <div
                  className="h-px"
                  style={{ backgroundColor: "var(--ember-gray-300)" }}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailWhenLaunch ?? true}
                    onChange={(e) =>
                      onEmailWhenLaunchChange(e.target.checked)
                    }
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "var(--ember-primary)" }}
                  />
                  <Mail
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "var(--ember-primary)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    Email me when Marketplace launches
                  </span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
