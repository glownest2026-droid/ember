import "server-only";

import type { Pr3AiRawResponse } from "./ai-listing-details-types";

export function buildListingDetailsGenerationPrompt(args: {
  confirmedItemLabel: string;
  categoryLabel: string;
  productTypeSubtitle: string | null;
  pr3Analysis: Pr3AiRawResponse | null;
}): string {
  const analysis = args.pr3Analysis?.analysis;
  const visibleText = (analysis?.visible_text ?? []).slice(0, 6);
  const conditionObservations = (analysis?.condition_observations ?? []).slice(0, 4);
  const pr3MissingParts = (analysis?.missing_parts_questions ?? []).slice(0, 4);
  const pr3Safety = (analysis?.safety_warnings ?? []).slice(0, 4);

  return [
    "You are helping create an editable second-hand marketplace listing draft for a UK parent.",
    "The parent has already confirmed the item type. Generate useful draft copy only — not final truth.",
    "Be cautious and honest. Use British English.",
    "Use the visual identification for the listing title whenever it is specific and sensible.",
    "Do not force the title to match a broad internal category.",
    "If the internal category is broad, create a natural parent-facing title from the visible item.",
    "If the image appears to show a saxophone-style toy, do not call it a xylophone unless it is clearly a xylophone.",
    "Do not invent brand, model, or RRP.",
    "Do not invent material words (wooden/plastic/metal) unless visually supported.",
    "Do not generate any price, currency, or RRP language.",
    "Do not claim condition from a photo alone.",
    "Do not claim the item is complete or recall-free.",
    "Do not claim the item is safe to sell — only prompt the parent to check.",
    "Ask the parent to confirm condition and included parts.",
    "Return JSON only. No markdown. No prose outside JSON.",
    "",
    "Confirmed item context:",
    `- Confirmed item label: ${args.confirmedItemLabel}`,
    `- Category: ${args.categoryLabel}`,
    args.productTypeSubtitle ? `- Catalogue subtitle: ${args.productTypeSubtitle}` : "",
    analysis?.possible_brand && analysis.possible_brand !== "unknown"
      ? `- Possible brand from photo (unverified): ${analysis.possible_brand}`
      : "",
    visibleText.length > 0 ? `- Visible text from photo (unverified): ${visibleText.join("; ")}` : "",
    conditionObservations.length > 0
      ? `- Photo observations (parent must confirm): ${conditionObservations.join("; ")}`
      : "",
    pr3MissingParts.length > 0 ? `- Prior missing-parts prompts: ${pr3MissingParts.join("; ")}` : "",
    pr3Safety.length > 0 ? `- Prior safety prompts from photo review: ${pr3Safety.join("; ")}` : "",
    "",
    "Required JSON shape:",
    "{",
    '  "suggested_title": "Toy doctor kit",',
    '  "suggested_description": "A pretend play doctor kit with toy medical accessories. Please check all pieces are included and add any brand details before publishing.",',
    '  "category_label": "Pretend play",',
    '  "condition_suggestion": "Condition needs parent confirmation",',
    '  "condition_questions": ["Is everything clean and ready to use?"],',
    '  "included_parts_checklist": ["Stethoscope"],',
    '  "missing_parts_questions": ["Are all original accessories included?"],',
    '  "safety_resale_notes": ["Check for small loose parts before listing."],',
    '  "photo_improvement_suggestions": ["Add a second photo showing all accessories laid out clearly."],',
    '  "restricted_or_blocked": false,',
    '  "parent_editing_note": "Please review and edit before publishing."',
    "}",
  ]
    .filter((line) => line.length > 0)
    .join("\n");
}
