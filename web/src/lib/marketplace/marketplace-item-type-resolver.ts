/**
 * Conservative, deterministic item-type resolution from listing text (buyer page safe).
 * Used when published intelligence is missing or incomplete — no Gemini on buyer flows.
 */

import { normalizeAliasText } from "@/lib/marketplace/marketplace-taxonomy";

/**
 * Obvious potty / toilet-training items → controlled slug `potty_training_seat`.
 * Requires explicit potty/toilet-training language (not broad "training seat" alone).
 */
export function resolveObviousItemTypeSlugFromListingText(
  text: string | null | undefined
): string | null {
  const norm = normalizeAliasText(text);
  if (!norm) return null;

  const hasPottyWord = /\bpotty\b/.test(norm);
  const hasToiletTraining =
    /\btoilet training\b/.test(norm) || /\bpotty training\b/.test(norm);
  const hasTrainingSeatWithToiletContext =
    /\btraining seat\b/.test(norm) &&
    (hasPottyWord || /\btoilet\b/.test(norm));

  if (hasPottyWord || hasToiletTraining || hasTrainingSeatWithToiletContext) {
    return "potty_training_seat";
  }

  return null;
}
