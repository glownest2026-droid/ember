import "server-only";

import type { GeminiListingAnalysisOutput } from "./ai-listing-analysis";
import { pickUserFacingDisplayLabel } from "./ai-listing-display-label";

type ConfidenceBucket = "high" | "medium" | "low";

export type CanonicalCandidateCard = {
  id: string | null;
  label: string;
  catalog_match_label: string | null;
  subtitle: string | null;
  reason: string;
  confidence_bucket: ConfidenceBucket;
  confidence_label: "Looks likely" | "Possible match" | "Not sure yet";
  source: "canonical_match" | "ai_suggestion";
};

function confidenceLabel(bucket: ConfidenceBucket): CanonicalCandidateCard["confidence_label"] {
  if (bucket === "high") return "Looks likely";
  if (bucket === "medium") return "Possible match";
  return "Not sure yet";
}

function confidenceFromNumber(value: number): ConfidenceBucket {
  if (value >= 0.8) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

function pickLowerConfidenceBucket(a: ConfidenceBucket, b: ConfidenceBucket): ConfidenceBucket {
  const rank: Record<ConfidenceBucket, number> = { low: 1, medium: 2, high: 3 };
  return rank[a] <= rank[b] ? a : b;
}

export async function buildCanonicalCandidates(
  supabase: Pick<import("@supabase/supabase-js").SupabaseClient, "rpc">,
  analysis: GeminiListingAnalysisOutput
): Promise<CanonicalCandidateCard[]> {
  const cards: CanonicalCandidateCard[] = [];
  const seenCanonicalIds = new Set<string>();
  const seenLabels = new Set<string>();

  const detectedVisualLabel = analysis.detected_item_label.trim();
  const aiCandidates = analysis.product_type_candidates.slice(0, 4);
  for (const aiCandidate of aiCandidates) {
    const normalizedLabel = aiCandidate.label.trim().toLowerCase();
    if (!normalizedLabel || seenLabels.has(normalizedLabel)) continue;
    seenLabels.add(normalizedLabel);

    const searchTerms = Array.from(
      new Set(
        [aiCandidate.label, aiCandidate.slug_hint.replace(/_/g, " ").trim()]
          .map((entry) => entry.trim())
          .filter((entry) => entry.length > 0)
      )
    );

    let bestCanonical:
      | {
          id: string;
          label: string;
          subtitle: string | null;
          confidence_bucket: ConfidenceBucket;
        }
      | null = null;

    for (const searchTerm of searchTerms) {
      const { data } = await supabase.rpc("inventory_match_product_types", {
        query_text: searchTerm,
        p_limit: 1,
      });
      const topRow = Array.isArray(data) ? data[0] : null;
      if (!topRow?.id) continue;

      bestCanonical = {
        id: topRow.id as string,
        label: String(topRow.label ?? searchTerm),
        subtitle: topRow.subtitle ? String(topRow.subtitle) : null,
        confidence_bucket: (topRow.confidence_bucket as ConfidenceBucket) ?? "low",
      };
      break;
    }

    if (bestCanonical && !seenCanonicalIds.has(bestCanonical.id)) {
      seenCanonicalIds.add(bestCanonical.id);
      const aiBucket = confidenceFromNumber(aiCandidate.confidence);
      const mergedBucket = pickLowerConfidenceBucket(bestCanonical.confidence_bucket, aiBucket);
      const displayLabel = pickUserFacingDisplayLabel({
        visualLabel: detectedVisualLabel,
        aiCandidateLabel: aiCandidate.label,
        canonicalCatalogLabel: bestCanonical.label,
        categoryLabel: analysis.broad_category || bestCanonical.subtitle || "",
        reason: aiCandidate.why,
      });
      cards.push({
        id: bestCanonical.id,
        label: displayLabel,
        catalog_match_label: bestCanonical.label,
        subtitle: bestCanonical.subtitle,
        reason: aiCandidate.why || "Matched against Ember canonical product types.",
        confidence_bucket: mergedBucket,
        confidence_label: confidenceLabel(mergedBucket),
        source: "canonical_match",
      });
      continue;
    }

    const displayLabel = pickUserFacingDisplayLabel({
      visualLabel: detectedVisualLabel,
      aiCandidateLabel: aiCandidate.label,
      categoryLabel: analysis.broad_category || "",
      reason: aiCandidate.why,
    });
    cards.push({
      id: null,
      label: displayLabel,
      catalog_match_label: null,
      subtitle: analysis.broad_category || null,
      reason: aiCandidate.why || "Possible match from photo analysis.",
      confidence_bucket: confidenceFromNumber(aiCandidate.confidence),
      confidence_label: confidenceLabel(confidenceFromNumber(aiCandidate.confidence)),
      source: "ai_suggestion",
    });
  }

  if (cards.length === 0 && analysis.detected_item_label.trim()) {
    cards.push({
      id: null,
      label: pickUserFacingDisplayLabel({
        visualLabel: analysis.detected_item_label.trim(),
        categoryLabel: analysis.broad_category || "",
      }),
      catalog_match_label: null,
      subtitle: analysis.broad_category || null,
      reason: "We are not yet confident about the exact catalog match.",
      confidence_bucket: analysis.confidence_bucket,
      confidence_label: confidenceLabel(analysis.confidence_bucket),
      source: "ai_suggestion",
    });
  }

  return cards.slice(0, 4);
}
