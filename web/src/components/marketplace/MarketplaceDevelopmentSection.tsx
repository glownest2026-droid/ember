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
    <section className="space-y-2" data-testid="marketplace-development-section">
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-[#1A1E23]">
            Local toys by development area
          </h2>
          {mode === "personalised" && childContext?.display_label ? (
            <p className="text-xs text-[#5C646D] mt-0.5">
              For <span className="font-medium text-[#1A1E23]">{childContext.display_label}</span>
              {childContext.age_months != null ? ` · ${childContext.age_months} mo` : ""}
              {" · "}
              now or next 6 months
            </p>
          ) : (
            <p className="text-xs text-[#5C646D] mt-0.5">Same areas as Discover — tap to filter</p>
          )}
        </div>
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

      {mode === "all_children" && (
        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          Choose a child above to personalise counts.
        </p>
      )}

      {mode === "missing_age" && (
        <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          Add your child&apos;s age to personalise opportunities.
        </p>
      )}

      {loading ? (
        <p className="text-xs text-[#5C646D]">Loading areas…</p>
      ) : (
        <div
          className="-mx-1 flex gap-2 overflow-x-auto pb-1 px-1 snap-x snap-mandatory scrollbar-thin"
          role="tablist"
          aria-label="Development areas"
        >
          {wrappers.map((card) => (
            <MarketplaceDevelopmentCard
              key={card.stage1_wrapper_ux_slug}
              card={card}
              compact
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
          ))}
        </div>
      )}
    </section>
  );
}
