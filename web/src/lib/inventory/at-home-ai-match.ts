import "server-only";

import type { AtHomeCatalogue } from "./at-home-catalogue";
import type { AtHomeTextClassifyOutput } from "./at-home-text-classify";
import { isAtHomeAiClassificationUsable } from "./at-home-text-classify";

export type AtHomeResolvedMatch = {
  product_type_id: string;
  slug: string;
  label: string;
  subtitle: string | null;
  family_slug: string | null;
  family_label: string | null;
  family_hint: string | null;
  specific_label: string | null;
  confidence_bucket: "high" | "medium" | "low";
  score: number | null;
  match_source: "catalogue" | "ai";
  ai_hint: string | null;
};

export function resolveAtHomeAiMatch(
  classification: AtHomeTextClassifyOutput,
  catalogue: AtHomeCatalogue
): AtHomeResolvedMatch | null {
  if (!isAtHomeAiClassificationUsable(classification, catalogue)) {
    return null;
  }

  const family = catalogue.families.find((entry) => entry.slug === classification.family_slug)!;
  const type = catalogue.typeBySlug.get(classification.product_type_slug)!;

  const confidenceBucket =
    classification.confidence >= 0.85 ? "high" : classification.confidence >= 0.72 ? "medium" : "low";

  return {
    product_type_id: type.id,
    slug: type.slug,
    label: family.label,
    subtitle: classification.parent_hint || family.hint || type.subtitle,
    family_slug: family.slug,
    family_label: family.label,
    family_hint: family.hint,
    specific_label: type.label,
    confidence_bucket: confidenceBucket,
    score: Math.round(classification.confidence * 100),
    match_source: "ai",
    ai_hint: classification.why || classification.parent_hint || null,
  };
}
