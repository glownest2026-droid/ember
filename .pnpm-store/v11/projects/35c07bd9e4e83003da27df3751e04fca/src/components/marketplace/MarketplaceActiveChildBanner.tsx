"use client";

import { UserRound } from "lucide-react";
import type { ChildContextPayload } from "@/components/marketplace/MarketplaceDevelopmentSection";

function childInitial(label: string | null): string {
  const t = (label ?? "").trim();
  if (!t) return "?";
  return t.charAt(0).toUpperCase();
}

type Props = {
  childContext: ChildContextPayload | null;
};

export function MarketplaceActiveChildBanner({ childContext }: Props) {
  const mode = childContext?.mode ?? "all_children";

  if (mode === "personalised" && childContext?.display_label) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3"
        data-testid="marketplace-active-child"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-white"
          aria-hidden
        >
          {childInitial(childContext.display_label)}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Browsing marketplace for
          </p>
          <p className="text-lg font-medium text-[#1A1E23] leading-tight truncate">
            {childContext.display_label}
          </p>
          {childContext.age_months != null ? (
            <p className="text-xs text-[#5C646D] mt-0.5">
              {childContext.age_months} months · items that may fit now or over the next 6 months
            </p>
          ) : (
            <p className="text-xs text-[#5C646D] mt-0.5">
              Items that may fit now or over the next 6 months
            </p>
          )}
        </div>
      </div>
    );
  }

  if (mode === "missing_age" && childContext?.display_label) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        data-testid="marketplace-active-child"
      >
        <UserRound className="h-9 w-9 text-amber-800 shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-medium text-amber-950">
            {childContext.display_label}
          </p>
          <p className="text-xs text-amber-900">Add age to personalise local opportunities.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3"
      data-testid="marketplace-active-child"
    >
      <UserRound className="h-9 w-9 text-[#5C646D] shrink-0" aria-hidden />
      <div>
        <p className="text-sm font-medium text-[#1A1E23]">All children</p>
        <p className="text-xs text-[#5C646D]">
          Choose a child in the menu above to browse for one child at a time.
        </p>
      </div>
    </div>
  );
}
