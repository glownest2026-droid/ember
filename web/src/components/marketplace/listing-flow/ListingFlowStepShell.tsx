"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  stepNumber: number;
  title: string;
  isComplete: boolean;
  isActive: boolean;
  completedSummary: ReactNode;
  children?: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
};

export function ListingFlowStepShell({
  stepNumber,
  title,
  isComplete,
  isActive,
  completedSummary,
  children,
  onEdit,
  editLabel = "Edit",
}: Props) {
  if (!isComplete && !isActive) return null;

  if (isComplete && !isActive) {
    return (
      <section className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-[#1A1E23]">{title}</p>
              <div className="text-sm text-[#5C646D]">{completedSummary}</div>
            </div>
          </div>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="shrink-0 text-xs text-primary underline"
            >
              {editLabel}
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-primary/15 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
          {stepNumber}
        </span>
        <h2 className="text-lg font-medium text-[#1A1E23]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
