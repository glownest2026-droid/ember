"use client";

import Link from "next/link";
import { CheckCircle, Package, ArrowRight, X, Sparkles } from "lucide-react";
import type { ListingData } from "./types";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: ListingData | null;
  onListAnother: () => void;
  selectedChildName?: string;
}

const suggestedItems = [
  "Baby bottles (6-pack)",
  "Teething toys",
  "Soft blocks set",
  "Bath toys bundle",
];

export function SuccessModal({
  isOpen,
  onClose,
  listing,
  onListAnother,
  selectedChildName = "your child",
}: SuccessModalProps) {
  if (!isOpen || !listing) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "var(--shadow-xl)" }}
      >
        <div
          className="p-6 lg:p-8 border-b"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--ember-primary-10)" }}
                >
                  <CheckCircle
                    className="w-8 h-8"
                    style={{ color: "var(--ember-primary)" }}
                  />
                </div>
                <div>
                  <h2
                    className="text-2xl lg:text-3xl font-medium"
                    style={{ color: "var(--ember-gray-900)" }}
                  >
                    Your item is saved for launch
                  </h2>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-[var(--ember-gray-200)] flex-shrink-0"
              style={{ color: "var(--ember-gray-600)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-6">
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "var(--ember-blush)" }}
          >
            <h3
              className="text-lg font-medium mb-3"
              style={{ color: "var(--ember-gray-900)" }}
            >
              What happens next
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--ember-primary)" }}
                >
                  1
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  We&apos;ve saved{" "}
                  <strong style={{ color: "var(--ember-gray-900)" }}>
                    {listing.itemName}
                  </strong>{" "}
                  safely — you can edit it anytime from{" "}
                  <Link
                    href="/marketplace/listings"
                    onClick={onClose}
                    className="font-medium underline hover:no-underline"
                    style={{ color: "var(--ember-primary)" }}
                  >
                    My listings
                  </Link>
                </p>
              </div>
              <div className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--ember-primary)" }}
                >
                  2
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  When Marketplace launches in your area, we&apos;ll send you one
                  calm email
                </p>
              </div>
              <div className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--ember-primary)" }}
                >
                  3
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  You&apos;ll be able to publish and start matching with nearby
                  families right away
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border"
            style={{
              borderColor: "var(--ember-primary-light)",
              backgroundColor: "white",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <Sparkles
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--ember-primary)" }}
              />
              <div>
                <h3
                  className="text-lg font-medium mb-2"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  Likely good match for
                </h3>
                <p
                  className="text-sm mb-3"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  Based on your item and area, we think this will be useful for:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--ember-primary-10)",
                      color: "var(--ember-primary)",
                    }}
                  >
                    Families with 8–12 month olds
                  </span>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: "var(--ember-primary-10)",
                      color: "var(--ember-primary)",
                    }}
                  >
                    Families with 12–18 month olds
                  </span>
                </div>
                <p
                  className="text-xs mt-3"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  We&apos;ll notify you when matching opens in {listing.postcode}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3
              className="text-lg font-medium mb-3"
              style={{ color: "var(--ember-gray-900)" }}
            >
              Items {selectedChildName} may be outgrowing
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--ember-gray-600)" }}
            >
              Based on stage, these might be good to list next:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {suggestedItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="p-4 rounded-xl border text-left transition-all duration-300 hover:border-[var(--ember-primary)] hover:bg-[var(--ember-primary-5)]"
                  style={{ borderColor: "var(--ember-gray-300)" }}
                  onClick={onListAnother}
                >
                  <div className="flex items-center gap-3">
                    <Package
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--ember-primary)" }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--ember-gray-900)" }}
                    >
                      {item}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-6 lg:p-8 border-t"
          style={{ borderColor: "var(--ember-gray-300)" }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onListAnother}
              className="flex-1 px-6 py-4 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--ember-primary)",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span className="flex items-center justify-center gap-2">
                List another item
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
            <Link
              href="/marketplace/listings"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl font-medium border transition-all duration-300 hover:border-[var(--ember-primary)] text-center"
              style={{
                borderColor: "var(--ember-gray-300)",
                color: "var(--ember-gray-900)",
              }}
            >
              View my listings
            </Link>
          </div>
          <Link
            href="/marketplace"
            onClick={onClose}
            className="block w-full mt-3 px-6 py-3 rounded-xl font-normal transition-all duration-300 hover:bg-[var(--ember-gray-100)] text-center"
            style={{ color: "var(--ember-gray-600)" }}
          >
            Browse marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
