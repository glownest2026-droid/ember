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
  childContext: ChildContextPayload | null;
  wrappers: DevelopmentWrapperOpportunity[];
  selectedSlug: Stage1WrapperSlug | null;
  loading?: boolean;
  onSelectWrapper: (slug: Stage1WrapperSlug | null) => void;
};

export function MarketplaceDevelopmentSection({
  childContext,
  wrappers,
  selectedSlug,
  loading,
  onSelectWrapper,
}: Props) {
  const mode = childContext?.mode ?? "all_children";

  return (
    <section className="space-y-3" data-testid="marketplace-development-section">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-[#1A1E23]">
          View local toys by development area
        </h2>
        <p className="text-sm text-[#5C646D]">
          Matched to the same development areas you see in Discover.
        </p>
      </div>

      {mode === "all_children" && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
          Choose a child in the menu above to personalise these cards. Nearby listings are
          still shown below.
        </p>
      )}

      {mode === "missing_age" && (
        <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
          Add your child&apos;s age to personalise local opportunities.
        </p>
      )}

      {mode === "personalised" && childContext?.display_label && (
        <p className="text-sm text-[#1A1E23]">
          Local opportunities for{" "}
          <span className="font-medium">{childContext.display_label}</span>
          {childContext.age_months != null ? (
            <span className="text-[#5C646D]"> · {childContext.age_months} months</span>
          ) : null}
        </p>
      )}

      {mode === "personalised" && (
        <p className="text-xs text-[#5C646D]">
          Showing items that may fit now or over the next 6 months.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#5C646D]">Loading development areas…</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {wrappers.map((card) => (
            <li key={card.stage1_wrapper_ux_slug}>
              <MarketplaceDevelopmentCard
                card={card}
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

      {selectedSlug && (
        <button
          type="button"
          onClick={() => onSelectWrapper(null)}
          className="text-sm text-primary underline"
        >
          Clear development filter
        </button>
      )}
    </section>
  );
}
