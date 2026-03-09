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
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Review your listing
        </h3>
        <p
          className="text-sm mb-2"
          style={{ color: "var(--ember-gray-600)" }}
        >
          We&apos;ll save this now and let you know when you can publish or
          when matching opens.
        </p>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--ember-gray-600)" }}
        >
          <strong style={{ color: "var(--ember-gray-900)" }}>
            We&apos;ll notify you when Marketplace opens
          </strong>{" "}
          — you can edit before publishing.
        </p>

        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: "var(--ember-primary-light)",
            backgroundColor: "white",
          }}
        >
          <div
            className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
            style={{ backgroundColor: "var(--ember-blush)" }}
          >
            <div>
              <span
                className="text-sm font-medium block"
                style={{ color: "var(--ember-primary)" }}
              >
                Pre-launch listing
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--ember-gray-600)" }}
              >
                Not public yet — we&apos;ll notify you when Marketplace opens
              </span>
            </div>
            <span
              className="text-xs px-3 py-1.5 rounded-full bg-white self-start sm:self-auto font-medium"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Not public yet
            </span>
          </div>

          <div className="p-6 space-y-6">
            {photos.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "var(--ember-gray-600)" }}>
                  Photos
                </div>
                <div className="flex flex-wrap gap-2">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--ember-gray-300)] bg-[var(--ember-gray-100)] flex-shrink-0"
                    >
                      {p.previewUrl ? (
                        <img
                          src={p.previewUrl}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6" style={{ color: "var(--ember-gray-500)" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-[var(--ember-gray-200)]"
                  style={{ backgroundColor: "var(--ember-primary-10)" }}
                >
                  {photos[0]?.previewUrl ? (
                    <img
                      src={photos[0].previewUrl}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package
                      className="w-6 h-6"
                      style={{ color: "var(--ember-primary)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-2xl font-medium mb-1"
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

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--ember-gray-100)" }}
                >
                  <div
                    className="text-xs mb-1"
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
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--ember-gray-100)" }}
                  >
                    <div
                      className="text-xs mb-1"
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
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--ember-gray-100)" }}
                >
                  <div
                    className="text-xs mb-1"
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
                <div className="flex flex-wrap gap-2 mt-3">
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

            <div className="flex items-start gap-3">
              <MapPin
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--ember-primary)" }}
              />
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  {data.postcode || "Saved area"} • {data.radius} mile radius
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  Pickup only (V0)
                </div>
              </div>
            </div>

            <div
              className="h-px"
              style={{ backgroundColor: "var(--ember-gray-300)" }}
            />

            <div className="flex items-start gap-3">
              <div>
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  {data.pricingIntent === "rough" && data.priceAmount
                    ? `£${data.priceAmount}`
                    : pricingLabels[data.pricingIntent || "later"]}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  You can change this when Marketplace launches
                </div>
              </div>
            </div>

            <div
              className="h-px"
              style={{ backgroundColor: "var(--ember-gray-300)" }}
            />

            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--ember-blush)" }}
            >
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "var(--ember-primary)" }}
                />
                <div>
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    Listed for {selectedChildName}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--ember-gray-600)" }}
                  >
                    We&apos;ll use {selectedChildName}&apos;s stage to help
                    match with families
                  </div>
                </div>
              </div>
            </div>

            {onEmailWhenLaunchChange && (
              <>
                <div
                  className="h-px"
                  style={{ backgroundColor: "var(--ember-gray-300)" }}
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailWhenLaunch ?? true}
                    onChange={(e) =>
                      onEmailWhenLaunchChange(e.target.checked)
                    }
                    className="mt-0.5 w-5 h-5 rounded"
                    style={{ accentColor: "var(--ember-primary)" }}
                  />
                  <div className="flex items-center gap-2">
                    <Mail
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--ember-primary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--ember-gray-900)" }}
                    >
                      Email me when Marketplace launches
                    </span>
                  </div>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
