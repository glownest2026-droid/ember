import "server-only";

import type { AtHomeCatalogue } from "./at-home-catalogue";

export function buildAtHomeTextClassifyPrompt(
  parentQuery: string,
  catalogue: AtHomeCatalogue
): string {
  const catalogueJson = JSON.stringify(
    catalogue.families.map((family) => ({
      family_slug: family.slug,
      family_label: family.label,
      family_hint: family.hint,
      item_types: family.types.map((type) => ({
        product_type_slug: type.slug,
        label: type.label,
        subtitle: type.subtitle,
      })),
    })),
    null,
    2
  );

  return [
    "You classify what a UK parent owns for Ember At home inventory.",
    "Parents type toys and child kit they keep at home — assume child items unless clearly adult-only household goods.",
    "Pick the best match from the controlled catalogue only. Do not invent slugs.",
    "Use world knowledge for characters and brands (e.g. Sooty and Sweep puppets → soft toy / character soft toy).",
    "If the query says toy, prefer toy-class types — not prams, strollers, swaddles, or sleep aids.",
    "If you are not reasonably sure, set confidence below 0.72.",
    "Output JSON only. No markdown.",
    "",
    `Parent typed: "${parentQuery.trim()}"`,
    "",
    "Controlled catalogue:",
    catalogueJson,
    "",
    "Return exactly:",
    "{",
    '  "family_slug": "soft_toys",',
    '  "product_type_slug": "character_soft_toy",',
    '  "parent_hint": "Character puppets like Sooty and Sweep",',
    '  "confidence": 0.86,',
    '  "why": "Short UK-parent reason, one sentence."',
    "}",
    "",
    "Rules:",
    "- family_slug and product_type_slug must exist in the catalogue above.",
    "- product_type_slug must belong to the chosen family.",
    "- confidence is 0 to 1.",
    "- parent_hint is warm plain English for the parent (no age bands).",
  ].join("\n");
}
