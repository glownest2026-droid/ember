"use client";

import { useState, useCallback } from "react";
import { Package, Layers } from "lucide-react";
import type { ListingData, ItemTypeSuggestion } from "../types";

interface ItemNameStepProps {
  data: Partial<ListingData>;
  onChange: (data: Partial<ListingData>) => void;
  errors: Record<string, string>;
  onSuggestItemTypes?: (query: string) => Promise<ItemTypeSuggestion[]>;
}

const categories = [
  "Books",
  "Toys",
  "Sensory",
  "Push/pull",
  "Baby gear",
  "Feeding",
  "Sleep",
  "Clothing bundle",
];

export function ItemNameStep({
  data,
  onChange,
  errors,
  onSuggestItemTypes,
}: ItemNameStepProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rpcSuggestions, setRpcSuggestions] = useState<ItemTypeSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!onSuggestItemTypes || query.trim().length < 2) {
        setRpcSuggestions([]);
        return;
      }
      setSuggestionsLoading(true);
      try {
        const list = await onSuggestItemTypes(query.trim());
        setRpcSuggestions(list);
      } finally {
        setSuggestionsLoading(false);
      }
    },
    [onSuggestItemTypes]
  );

  const handleInputChange = (value: string) => {
    onChange({ itemName: value });
    setShowSuggestions(value.length > 0);
    void fetchSuggestions(value);
  };

  const pickSuggestion = (s: ItemTypeSuggestion) => {
    onChange({
      itemName: s.canonical_name,
      selectedItemTypeId: s.item_type_id,
      normalizationConfidence: s.similarity_score,
    });
    setShowSuggestions(false);
    setRpcSuggestions([]);
  };

  const clearType = () => {
    onChange({
      selectedItemTypeId: null,
      normalizationConfidence: null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3
          className="text-xl font-medium mb-2"
          style={{ color: "var(--ember-gray-900)" }}
        >
          What are you listing?
        </h3>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--ember-gray-600)" }}
        >
          Just type naturally — we&apos;ll tidy this up before launch.
        </p>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Item name
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.itemName || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() =>
                setShowSuggestions((data.itemName?.length ?? 0) > 0)
              }
              onBlur={() =>
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 200)
              }
              placeholder="e.g., Wooden stacking rings"
              className="w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.itemName
                  ? "var(--ember-primary)"
                  : "var(--ember-gray-300)",
                boxShadow: errors.itemName
                  ? "0 0 0 1px var(--ember-primary)"
                  : "none",
              }}
            />
            {errors.itemName && (
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--ember-primary)" }}
              >
                {errors.itemName}
              </p>
            )}

            {/* Did you mean from RPC (do not auto-pick) */}
            {rpcSuggestions.length > 0 &&
              data.itemName &&
              data.itemName.length >= 2 && (
                <div className="mt-2 space-y-2">
                  <span
                    className="text-sm"
                    style={{ color: "var(--ember-gray-600)" }}
                  >
                    Did you mean:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {rpcSuggestions.slice(0, 5).map((s) => (
                      <button
                        key={s.item_type_id}
                        type="button"
                        onClick={() => pickSuggestion(s)}
                        className="px-3 py-1.5 rounded-full border-2 font-medium transition-all duration-300 hover:bg-[var(--ember-primary-5)]"
                        style={{
                          color: "var(--ember-primary)",
                          borderColor: "var(--ember-primary)",
                        }}
                      >
                        {s.canonical_name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={clearType}
                      className="px-3 py-1.5 rounded-full border text-sm"
                      style={{
                        color: "var(--ember-gray-600)",
                        borderColor: "var(--ember-gray-300)",
                      }}
                    >
                      Not sure
                    </button>
                  </div>
                  {suggestionsLoading && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--ember-gray-600)" }}
                    >
                      Checking…
                    </span>
                  )}
                </div>
              )}

            {showSuggestions && rpcSuggestions.length === 0 && !suggestionsLoading && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border overflow-hidden z-10"
                style={{
                  borderColor: "var(--ember-gray-300)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <p
                  className="px-4 py-3 text-sm"
                  style={{ color: "var(--ember-gray-600)" }}
                >
                  Keep typing for suggestions, or continue as-is.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--ember-gray-900)" }}
          >
            Category (optional)
          </label>
          <p
            className="text-xs mb-3"
            style={{ color: "var(--ember-gray-600)" }}
          >
            Helpful to narrow it down, but not required
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  onChange({ category: cat === data.category ? "" : cat })
                }
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border"
                style={{
                  backgroundColor:
                    data.category === cat ? "var(--ember-primary-10)" : "white",
                  borderColor:
                    data.category === cat
                      ? "var(--ember-primary)"
                      : "var(--ember-gray-300)",
                  color:
                    data.category === cat
                      ? "var(--ember-primary)"
                      : "var(--ember-gray-600)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div
          className="p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:border-[var(--ember-primary)]"
          style={{
            backgroundColor: data.isBundle ? "var(--ember-primary-5)" : "white",
            borderColor: data.isBundle
              ? "var(--ember-primary)"
              : "var(--ember-gray-300)",
          }}
          onClick={() => onChange({ isBundle: !data.isBundle })}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--ember-primary-10)" }}
            >
              <Layers
                className="w-5 h-5"
                style={{ color: "var(--ember-primary)" }}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={data.isBundle ?? false}
                  onChange={(e) => onChange({ isBundle: e.target.checked })}
                  className="w-4 h-4 rounded accent-[var(--ember-primary)]"
                  style={{ accentColor: "var(--ember-primary)" }}
                />
                <label
                  className="font-medium cursor-pointer"
                  style={{ color: "var(--ember-gray-900)" }}
                >
                  List a bundle instead
                </label>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--ember-gray-600)" }}
              >
                Perfect for multiple items you want to pass on together (e.g.,
                &quot;6 board books&quot; or &quot;Newborn clothing bundle&quot;)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
