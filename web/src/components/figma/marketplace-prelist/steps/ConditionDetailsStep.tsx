"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import type { ListingData } from "../types";

interface PhotoItem {
  id: string;
  storagePath: string;
  previewUrl?: string;
}

interface ConditionDetailsStepProps {
  data: Partial<ListingData>;
  onChange: (data: Partial<ListingData>) => void;
  errors: Record<string, string>;
  photos?: PhotoItem[];
  onUploadPhoto?: (file: File) => Promise<void>;
  onRemovePhoto?: (id: string) => void;
  uploadDisabled?: boolean;
}

const conditions = [
  {
    value: "new",
    label: "New",
    description: "Never used, with tags",
  },
  {
    value: "like-new",
    label: "Like new",
    description: "Barely used, excellent condition",
  },
  {
    value: "good",
    label: "Good",
    description: "Used but well cared for",
  },
  {
    value: "well-loved",
    label: "Well loved",
    description: "Shows signs of use but still functional",
  },
];

export function ConditionDetailsStep({
  data,
  onChange,
  errors,
  photos = [],
  onUploadPhoto,
  onRemovePhoto,
  uploadDisabled,
}: ConditionDetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadPhoto) return;
    await onUploadPhoto(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Tell us about the condition
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--ember-gray-600)" }}
        >
          Be honest — it helps families know what to expect.
        </p>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-3"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Condition{" "}
            <span style={{ color: "var(--ember-primary)" }}>*</span>
          </label>
          <div className="grid sm:grid-cols-2 gap-3">
            {conditions.map((condition) => (
              <button
                key={condition.value}
                type="button"
                onClick={() => onChange({ condition: condition.value })}
                className="p-4 rounded-xl border-2 text-left transition-all duration-300 hover:border-[var(--ember-primary)]"
                style={{
                  backgroundColor:
                    data.condition === condition.value
                      ? "var(--ember-primary-5)"
                      : "white",
                  borderColor:
                    data.condition === condition.value
                      ? "var(--ember-primary)"
                      : "var(--ember-gray-300)",
                }}
              >
                <div
                  className="font-medium mb-1"
                  style={{
                    color:
                      data.condition === condition.value
                        ? "var(--ember-primary)"
                        : "var(--ember-gray-900)",
                  }}
                >
                  {condition.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  {condition.description}
                </div>
              </button>
            ))}
          </div>
          {errors.condition && (
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--ember-primary)" }}
            >
              {errors.condition}
            </p>
          )}
        </div>

        {data.isBundle && (
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--ember-gray-900)" }}
            >
              How many items in this bundle?
            </label>
            <input
              type="number"
              value={data.quantity || ""}
              onChange={(e) => onChange({ quantity: e.target.value })}
              placeholder="e.g., 6"
              min={1}
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)]"
              style={{ borderColor: "var(--ember-gray-300)" }}
            />
          </div>
        )}

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Photos
          </label>
          <p
            className="text-sm mb-3"
            style={{ color: "var(--ember-gray-600)" }}
          >
            Photos help families trust what they&apos;re getting (optional, but
            recommended).
          </p>
          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border bg-[var(--ember-gray-200)]"
                >
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--ember-gray-600)] text-xs">
                      Photo
                    </div>
                  )}
                  {onRemovePhoto && (
                    <button
                      type="button"
                      onClick={() => onRemovePhoto(p.id)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={uploadDisabled}
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-[var(--ember-primary)] hover:bg-[var(--ember-primary-5)] disabled:opacity-50"
            style={{ borderColor: "var(--ember-gray-300)" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--ember-primary-10)" }}
              >
                <Camera
                  className="w-8 h-8"
                  style={{ color: "var(--ember-primary)" }}
                />
              </div>
              <div className="text-center">
                <p
                  className="font-medium mb-1"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  Add photos
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  You can add these now or later
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Brand (optional)
          </label>
          <input
            type="text"
            value={data.brand || ""}
            onChange={(e) => onChange({ brand: e.target.value })}
            placeholder="e.g., Melissa & Doug"
            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)]"
            style={{ borderColor: "var(--ember-gray-300)" }}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Additional notes (optional)
          </label>
          <textarea
            value={data.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Any other details families should know..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)] resize-none"
            style={{ borderColor: "var(--ember-gray-300)" }}
          />
        </div>

        <div className="space-y-3">
          {[
            {
              key: "includesAccessories" as const,
              label: "Includes extra accessories",
            },
            { key: "missingParts" as const, label: "Missing parts" },
            { key: "smokeFree" as const, label: "Smoke-free home" },
            { key: "petFree" as const, label: "Pet-free home" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[var(--ember-gray-100)]"
            >
              <input
                type="checkbox"
                checked={data[key] ?? false}
                onChange={(e) => onChange({ [key]: e.target.checked })}
                className="mt-0.5 w-5 h-5 rounded"
                style={{ accentColor: "var(--ember-primary)" }}
              />
              <div>
                <div
                  className="font-medium text-sm"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  {label}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
