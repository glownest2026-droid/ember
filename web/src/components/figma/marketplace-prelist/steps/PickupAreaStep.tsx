"use client";

import { useState } from "react";
import { MapPin, Home, Edit2 } from "lucide-react";
import type { ListingData } from "../types";

interface PickupAreaStepProps {
  data: Partial<ListingData>;
  onChange: (data: Partial<ListingData>) => void;
  errors: Record<string, string>;
  /** Prefilled from marketplace_preferences */
  savedArea?: { postcode: string; radius: string } | null;
  /** When user edits, parent should persist to marketplace_preferences */
  onSavePreferences?: (postcode: string, radius: string) => Promise<void>;
}

const radiusOptions = [
  { value: "0.5", label: "0.5 miles", description: "Very local" },
  { value: "1", label: "1 mile", description: "Walking distance" },
  { value: "2", label: "2 miles", description: "Short drive" },
  { value: "5", label: "5 miles", description: "Nearby areas" },
  { value: "10", label: "10 miles", description: "Wider area" },
];

export function PickupAreaStep({
  data,
  onChange,
  errors,
  savedArea,
  onSavePreferences,
}: PickupAreaStepProps) {
  const [isEditingArea, setIsEditingArea] = useState(!savedArea?.postcode);

  const handleUseSaved = () => {
    if (savedArea) {
      onChange({ radius: savedArea.radius, postcode: savedArea.postcode });
      setIsEditingArea(false);
    }
  };

  const handleSaveAndUse = async () => {
    const postcode = (data.postcode || "").trim();
    const radius = data.radius || "5";
    if (postcode && onSavePreferences) {
      await onSavePreferences(postcode, radius);
      setIsEditingArea(false);
    }
  };

  if (savedArea && !isEditingArea && (!data.postcode || !data.radius)) {
    onChange({ radius: savedArea.radius, postcode: savedArea.postcode });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Where can families collect?
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--ember-gray-600)" }}
        >
          We&apos;ll use this to match you with nearby families. Your exact
          address stays private.
        </p>

        {savedArea?.postcode && !isEditingArea ? (
          <div
            className="mb-6 p-4 rounded-xl border-2 flex items-center justify-between"
            style={{
              backgroundColor: "var(--ember-primary-5)",
              borderColor: "var(--ember-primary)",
            }}
          >
            <div className="flex items-center gap-3">
              <MapPin
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--ember-primary)" }}
              />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  Using your saved area: {savedArea.postcode} · {savedArea.radius}{" "}
                  miles
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  From your Marketplace preferences
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingArea(true)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition-all duration-300 hover:bg-white"
              style={{ color: "var(--ember-primary)" }}
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--ember-gray-900)" }}
              >
                Postcode or area{" "}
                <span style={{ color: "var(--ember-primary)" }}>*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "var(--ember-gray-600)" }}
                />
                <input
                  type="text"
                  value={data.postcode || ""}
                  onChange={(e) => onChange({ postcode: e.target.value })}
                  placeholder="e.g., SW1A 1AA"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.postcode
                      ? "var(--ember-primary)"
                      : "var(--ember-gray-300)",
                    boxShadow: errors.postcode
                      ? "0 0 0 1px var(--ember-primary)"
                      : "none",
                  }}
                />
              </div>
              {errors.postcode && (
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--ember-primary)" }}
                >
                  {errors.postcode}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: "var(--ember-gray-900)" }}
              >
                Match radius{" "}
                <span style={{ color: "var(--ember-primary)" }}>*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {radiusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange({ radius: option.value })}
                    className="px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-300 hover:border-[var(--ember-primary)]"
                    style={{
                      backgroundColor:
                        data.radius === option.value
                          ? "var(--ember-primary-5)"
                          : "white",
                      borderColor:
                        data.radius === option.value
                          ? "var(--ember-primary)"
                          : "var(--ember-gray-300)",
                      color:
                        data.radius === option.value
                          ? "var(--ember-primary)"
                          : "var(--ember-gray-900)",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.radius && (
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--ember-primary)" }}
                >
                  {errors.radius}
                </p>
              )}
            </div>

            {onSavePreferences && (data.postcode?.trim() || data.radius) && (
              <button
                type="button"
                onClick={handleSaveAndUse}
                className="text-sm font-medium"
                style={{ color: "var(--ember-primary)" }}
              >
                Save as my default area
              </button>
            )}
          </>
        )}

        <div className="mb-6">
          <div className="flex items-start gap-3">
            <Home
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "var(--ember-primary)" }}
            />
            <div className="flex-1">
              <div
                className="font-medium text-sm mb-1"
                style={{ color: "var(--ember-gray-900)" }}
              >
                Pickup only
              </div>
              <p
                className="text-xs"
                style={{ color: "var(--ember-gray-600)" }}
              >
                Marketplace launch is initially pick-up only - no postage.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mb-6 p-3 rounded-lg"
          style={{ backgroundColor: "var(--ember-blush)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--ember-gray-600)" }}
          >
            🔒{" "}
            <strong style={{ color: "var(--ember-gray-900)" }}>
              Exact address stays private
            </strong>{" "}
            — only shared once a match is confirmed
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Available from (optional)
          </label>
          <input
            type="date"
            value={data.availableFrom || ""}
            onChange={(e) => onChange({ availableFrom: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)]"
            style={{ borderColor: "var(--ember-gray-300)" }}
          />
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--ember-gray-600)" }}
          >
            Leave blank if available now
          </p>
        </div>

        <div
          className="p-4 rounded-xl border"
          style={{
            backgroundColor: "var(--ember-blush)",
            borderColor: "var(--ember-primary-light)",
          }}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.wantReminders !== false}
              onChange={(e) => onChange({ wantReminders: e.target.checked })}
              className="mt-0.5 w-5 h-5 rounded"
              style={{ accentColor: "var(--ember-primary)" }}
            />
            <div>
              <div
                className="font-medium text-sm mb-1"
                style={{ color: "var(--ember-gray-900)" }}
              >
                Email me when there&apos;s a strong match nearby
              </div>
              <p
                className="text-xs"
                style={{ color: "var(--ember-gray-600)" }}
              >
                Only when it&apos;s genuinely relevant. No spam.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
