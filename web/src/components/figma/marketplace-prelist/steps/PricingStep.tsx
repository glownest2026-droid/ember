"use client";

import { DollarSign, Gift, Clock } from "lucide-react";
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
    icon: DollarSign,
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
    icon: DollarSign,
  },
];

export function PricingStep({ data, onChange }: PricingStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          Pricing intent
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--ember-gray-600)" }}
        >
          You can set or change this when Marketplace goes live. This is just
          to help us prepare.
        </p>

        <div className="space-y-3 mb-6">
          {pricingOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ pricingIntent: option.value })}
                className="w-full p-4 rounded-xl border-2 text-left transition-all duration-300 hover:border-[var(--ember-primary)]"
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
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--ember-primary-10)" }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "var(--ember-primary)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-medium mb-1"
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
                      className="text-sm"
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
            className="p-6 rounded-xl"
            style={{ backgroundColor: "var(--ember-blush)" }}
          >
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--ember-gray-900)" }}
            >
              Rough price
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-lg"
                style={{ color: "var(--ember-gray-600)" }}
              >
                £
              </span>
              <input
                type="number"
                value={data.priceAmount || ""}
                onChange={(e) => onChange({ priceAmount: e.target.value })}
                placeholder="0"
                min={0}
                step={0.5}
                className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--ember-primary)]"
                style={{
                  borderColor: "var(--ember-gray-300)",
                  backgroundColor: "white",
                }}
              />
            </div>
            <p
              className="mt-2 text-xs"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Don&apos;t worry about being exact. You can change this when
              Marketplace launches.
            </p>
          </div>
        )}

        <div
          className="mt-6 p-4 rounded-xl"
          style={{ backgroundColor: "var(--ember-gray-200)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--ember-gray-600)" }}
          >
            💡{" "}
            <strong style={{ color: "var(--ember-gray-900)" }}>
              Why ask now?
            </strong>{" "}
            Pre-listing helps you go live faster when Marketplace launches.
            You&apos;re in full control and can edit everything.
          </p>
        </div>
      </div>
    </div>
  );
}
