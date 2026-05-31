"use client";

import type { DevelopmentWrapperOpportunity } from "@/lib/marketplace/development-opportunities";
import type { Stage1WrapperSlug } from "@/lib/marketplace/development-wrappers";
import { MarketplaceDevelopmentCard } from "@/components/marketplace/MarketplaceDevelopmentCard";

export type ChildContextPayload = {
  mode: "personalised" | "all_children" | "missing_age";
  child_id: string | null;
  display_label: string | null;
  age_months: number | null;
};

type Props = {
  wrappers: DevelopmentWrapperOpportunity[];
  selectedSlug: Stage1WrapperSlug | null;
  loading?: boolean;
  onSelectWrapper: (slug: Stage1WrapperSlug | null) => void;
};

export function MarketplaceDevelopmentSection({
  wrappers,
  selectedSlug,
  loading,
  onSelectWrapper,
}: Props) {
  return (
    <section className="space-y-2" data-testid="marketplace-development-section">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-[#1A1E23]">
          Local opportunities by development area
        </h2>
        {selectedSlug ? (
          <button
            type="button"
            onClick={() => onSelectWrapper(null)}
            className="text-xs text-primary underline shrink-0"
          >
            Clear filter
          </button>
        ) : null}
      </div>
      <p className="text-xs text-[#5C646D]">Same areas as Discover — tap a card to filter the map</p>

      {loading ? (
        <p className="text-xs text-[#5C646D]">Loading areas…</p>
      ) : (
        <ul
          className="grid grid-cols-2 lg:grid-cols-4 gap-2"
          role="tablist"
          aria-label="Development areas"
        >
          {wrappers.map((card) => (
            <li key={card.stage1_wrapper_ux_slug}>
              <MarketplaceDevelopmentCard
                card={card}
                grid
                selected={selectedSlug === card.stage1_wrapper_ux_slug}
                disabled={card.cards_disabled}
                onSelect={() =>
                  onSelectWrapper(
                    selectedSlug === card.stage1_wrapper_ux_slug
                      ? null
                      : card.stage1_wrapper_ux_slug
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
