"use client";

import { PoundSterling, Gift, Clock } from "lucide-react";
import type { ListingData } from "../types";

interface PricingStepProps {
  data: Partial<ListingData>;
  onChange: (data: Partial<ListingData>) => void;
}

const pricingOptions = [
  {
    value: "later",
    label: "I'll decide later",
    description: "Set or change when Marketplace launches",
    icon: Clock,
  },
  {
    value: "rough",
    label: "I have a rough price in mind",
    description: "You can adjust this anytime",
    icon: PoundSterling,
  },
  {
    value: "free",
    label: "Free to a family nearby",
    description: "Pass it on with no charge",
    icon: Gift,
  },
  {
    value: "offers",
    label: "Open to offers",
    description: "Let families suggest a price",
    icon: PoundSterling,
  },
];

export function PricingStep({ data, onChange }: PricingStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Pricing intent
        </h3>
        <p
          className="text-sm mb-4"
          style={{ color: "var(--ember-gray-600)" }}
        >
          You can set or change this when Marketplace goes live. This is just
          to help us prepare.
        </p>

        <div className="space-y-2 mb-4">
          {pricingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ pricingIntent: option.value })}
                className="w-full p-3 rounded-xl border-2 text-left transition-all duration-300 hover:border-[var(--ember-primary)]"
                style={{
                  backgroundColor:
                    data.pricingIntent === option.value
                      ? "var(--ember-primary-5)"
                      : "white",
                  borderColor:
                    data.pricingIntent === option.value
                      ? "var(--ember-primary)"
                      : "var(--ember-gray-300)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--ember-primary-10)" }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: "var(--ember-primary)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-sm"
                      style={{
                        color:
                          data.pricingIntent === option.value
                            ? "var(--ember-primary)"
                            : "var(--ember-gray-900)",
                      }}
                    >
                      {option.label}
                    </div>
                    <div
                      className="text-xs truncate"
                      style={{ color: "var(--ember-gray-600)" }}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {data.pricingIntent === "rough" && (
          <div
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: "var(--ember-blush)" }}
          >
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--ember-gray-900)" }}
            >
              Rough price (GBP)
            </label>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-medium"
                style={{ color: "var(--ember-gray-700)" }}
              >
                £
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={data.priceAmount || ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  onChange({ priceAmount: v });
                }}
                placeholder="0"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)] text-base"
                style={{
                  borderColor: "var(--ember-gray-300)",
                  backgroundColor: "white",
                }}
              />
            </div>
            <p
              className="mt-1.5 text-xs"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Don&apos;t worry about being exact. You can change this when
              Marketplace launches.
            </p>
          </div>
        )}

        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: "var(--ember-gray-200)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--ember-gray-600)" }}
          >
            💡{" "}
            <strong style={{ color: "var(--ember-gray-900)" }}>
              Why ask now?
            </strong>{" "}
            Pre-listing helps you go live faster when Marketplace launches.
          </p>
        </div>
      </div>
    </div>
  );
}
