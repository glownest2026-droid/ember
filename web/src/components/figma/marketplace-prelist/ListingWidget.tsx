"use client";

import { Package, Sparkles, ArrowRight } from "lucide-react";

interface ListingWidgetProps {
  selectedChildName: string;
  ageBandLabel?: string;
  onListItem: () => void;
}

export function ListingWidget({
  selectedChildName,
  ageBandLabel,
  onListItem,
}: ListingWidgetProps) {
  return (
    <div
      className="mb-8 p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border-2 transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundColor: "var(--ember-blush)",
        borderColor: "var(--ember-primary-light)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "var(--ember-primary-10)" }}
          >
            <Package
              className="w-5 h-5 sm:w-6 sm:h-6"
              style={{ color: "var(--ember-primary)" }}
            />
          </div>
          <div className="flex-1">
            <h2
              className="text-lg sm:text-xl lg:text-2xl font-normal mb-1"
              style={{ color: "var(--ember-gray-900)" }}
            >
              Ready to pass anything on for {selectedChildName}?
            </h2>
            <p
              className="text-sm sm:text-base mb-1"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Pre-list items now and we&apos;ll help match them when Marketplace
              launches.
            </p>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--ember-gray-600)" }}
            >
              No public listing yet. You can edit anytime.
            </p>
          </div>
        </div>

        {ageBandLabel && (
          <div className="flex flex-wrap gap-2">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border"
              style={{
                color: "var(--ember-primary)",
                borderColor: "var(--ember-primary-light)",
              }}
            >
              <Sparkles className="w-3 h-3 inline-block mr-1" />
              Likely outgrown soon
            </span>
            <span
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border"
              style={{
                color: "var(--ember-gray-600)",
                borderColor: "var(--ember-gray-300)",
              }}
            >
              {selectedChildName}: {ageBandLabel}
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onListItem}
            className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--ember-primary)",
              boxShadow: "var(--shadow-md)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--ember-primary-dark)";
              e.currentTarget.style.boxShadow = "var(--shadow-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--ember-primary)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }}
          >
            List an item
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
