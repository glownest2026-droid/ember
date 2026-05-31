/**
 * Selected-child context for Marketplace 2.0 (buyer-side, parent-only).
 */

import {
  displayLabelFromProfile,
  monthsOldFromBirthdate,
} from "@/lib/discover/personalization";

export type ChildMarketplaceMode = "personalised" | "all_children" | "missing_age";

export type ChildMarketplaceContext = {
  mode: ChildMarketplaceMode;
  child_id: string | null;
  /** Parent-only display label; never sent to other users. */
  display_label: string | null;
  age_months: number | null;
  lookahead_months: number;
};

export const DEFAULT_CHILD_LOOKAHEAD_MONTHS = 6;

export function resolveChildMarketplaceContext(args: {
  childId: string | null | undefined;
  childRow: Record<string, unknown> | null;
}): ChildMarketplaceContext {
  const childId = args.childId?.trim() || null;
  if (!childId) {
    return {
      mode: "all_children",
      child_id: null,
      display_label: null,
      age_months: null,
      lookahead_months: DEFAULT_CHILD_LOOKAHEAD_MONTHS,
    };
  }

  if (!args.childRow) {
    return {
      mode: "all_children",
      child_id: null,
      display_label: null,
      age_months: null,
      lookahead_months: DEFAULT_CHILD_LOOKAHEAD_MONTHS,
    };
  }

  const birth =
    (typeof args.childRow.birthdate === "string" && args.childRow.birthdate) ||
    (typeof args.childRow.date_of_birth === "string" && args.childRow.date_of_birth) ||
    null;
  const ageMonths = monthsOldFromBirthdate(birth);
  const displayLabel = displayLabelFromProfile(
    typeof args.childRow.child_name === "string" ? args.childRow.child_name : null,
    typeof args.childRow.display_name === "string" ? args.childRow.display_name : null
  );

  if (ageMonths === null) {
    return {
      mode: "missing_age",
      child_id: childId,
      display_label: displayLabel,
      age_months: null,
      lookahead_months: DEFAULT_CHILD_LOOKAHEAD_MONTHS,
    };
  }

  return {
    mode: "personalised",
    child_id: childId,
    display_label: displayLabel,
    age_months: ageMonths,
    lookahead_months: DEFAULT_CHILD_LOOKAHEAD_MONTHS,
  };
}
