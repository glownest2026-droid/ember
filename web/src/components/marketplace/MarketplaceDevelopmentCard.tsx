"use client";

import { getWrapperIcon } from "@/app/discover/[months]/_lib/wrapperIcons";
import type { DevelopmentWrapperOpportunity } from "@/lib/marketplace/development-opportunities";

type Props = {
  card: DevelopmentWrapperOpportunity;
  selected: boolean;
  disabled?: boolean;
  compact?: boolean;
  onSelect: () => void;
};

export function MarketplaceDevelopmentCard({
  card,
  selected,
  disabled,
  compact = false,
  onSelect,
}: Props) {
  const Icon = getWrapperIcon(card.stage1_wrapper_ux_slug, card.stage1_wrapper_ux_label);

  if (compact) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onSelect}
        data-testid={`marketplace-dev-card-${card.stage1_wrapper_ux_slug}`}
        className={`snap-start shrink-0 w-[168px] rounded-lg border px-2.5 py-2 text-left transition-colors ${
          disabled
            ? "border-[#E5E7EB] bg-[#FAFAFA] opacity-70 cursor-not-allowed"
            : selected
              ? "border-primary bg-primary/5 ring-1 ring-primary/25"
              : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
              selected ? "bg-primary/15 text-primary" : "bg-[#F3F4F6] text-[#5C646D]"
            }`}
            aria-hidden
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#1A1E23] leading-tight line-clamp-2">
              {card.stage1_wrapper_ux_label}
            </p>
            <p
              className={`text-[11px] font-medium mt-0.5 truncate ${
                card.watch_mode ? "text-[#5C646D]" : "text-primary"
              }`}
            >
              {card.display_count_label}
            </p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      data-testid={`marketplace-dev-card-${card.stage1_wrapper_ux_slug}`}
      className={`w-full rounded-xl border p-4 text-left transition-colors min-h-[88px] ${
        disabled
          ? "border-[#E5E7EB] bg-[#FAFAFA] opacity-70 cursor-not-allowed"
          : selected
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-[#E5E7EB] bg-white hover:border-[#D1D5DB]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            selected ? "bg-primary/15 text-primary" : "bg-[#F3F4F6] text-[#5C646D]"
          }`}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-[#1A1E23] leading-snug">
            {card.stage1_wrapper_ux_label}
          </p>
          <p
            className={`text-xs font-medium ${
              card.watch_mode ? "text-[#5C646D]" : "text-primary"
            }`}
          >
            {card.display_count_label}
          </p>
          {!card.watch_mode && card.recommended_count > 0 ? (
            <p className="text-xs text-[#5C646D] line-clamp-2">{card.helper_copy}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
