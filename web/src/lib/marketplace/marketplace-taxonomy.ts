/**
 * Controlled marketplace taxonomy mirror (PR9).
 *
 * This is a code-side mirror of the seed rows in
 * supabase/sql/202605311200_marketplace_intelligence_taxonomy.sql.
 * The DB remains the live source of truth; this mirror is used for
 * server-side validation, cautious copy, and offline tests/smoke checks.
 *
 * Gemini may *suggest* slugs, but only slugs present here (or active in the DB)
 * are accepted as live taxonomy. Unknown slugs are quarantined to the review queue.
 */

export const STAGE1_WRAPPER_SLUGS = [
  "social_emotional",
  "self_care_independence",
  "fine_motor",
  "gross_motor",
  "language_communication",
  "cognitive_problem_solving",
  "toileting",
] as const;

export type Stage1WrapperSlug = (typeof STAGE1_WRAPPER_SLUGS)[number];

export const STAGE1_WRAPPER_LABELS: Record<Stage1WrapperSlug, string> = {
  social_emotional: "I’m learning to play with other people",
  self_care_independence: "I’m doing more by myself",
  fine_motor: "My hands can do more now",
  gross_motor: "My body is ready for bigger moves",
  language_communication: "I’ve got more to say",
  cognitive_problem_solving: "I’m figuring things out",
  toileting: "I’m getting ready for potty",
};

export const RISK_LEVELS = ["low", "medium", "high", "restricted"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RECOMMENDATION_POLICIES = [
  "recommendable",
  "browse_with_caution",
  "do_not_recommend",
] as const;
export type RecommendationPolicy = (typeof RECOMMENDATION_POLICIES)[number];

export const MAPPING_STRENGTHS = ["exact", "close", "estimated", "review_needed"] as const;
export type MappingStrength = (typeof MAPPING_STRENGTHS)[number];

export type SeedDevelopmentMapping = {
  stage1_wrapper_ux_slug: Stage1WrapperSlug;
  stage1_wrapper_ux_label: string;
  mapping_strength: MappingStrength;
};

export type SeedItemType = {
  slug: string;
  label: string;
  aliases: string[];
  default_min_age_months: number | null;
  default_max_age_months: number | null;
  default_outgrown_months: number | null;
  risk_level: RiskLevel;
  recommendation_policy: RecommendationPolicy;
  development_mappings: SeedDevelopmentMapping[];
  safety_flags?: string[];
};

const m = (
  slug: Stage1WrapperSlug,
  strength: MappingStrength
): SeedDevelopmentMapping => ({
  stage1_wrapper_ux_slug: slug,
  stage1_wrapper_ux_label: STAGE1_WRAPPER_LABELS[slug],
  mapping_strength: strength,
});

export const SEED_MARKETPLACE_ITEM_TYPES: SeedItemType[] = [
  {
    slug: "toy_saxophone",
    label: "Toy saxophone",
    aliases: [
      "toy saxophone",
      "saxophone-style musical toy",
      "red plastic saxophone",
      "button musical instrument",
    ],
    default_min_age_months: 24,
    default_max_age_months: 60,
    default_outgrown_months: 72,
    risk_level: "medium",
    recommendation_policy: "recommendable",
    development_mappings: [m("fine_motor", "close"), m("cognitive_problem_solving", "estimated")],
  },
  {
    slug: "dress_up_costume_helmet",
    label: "Dress-up costume helmet",
    aliases: [
      "costume helmet",
      "knight helmet",
      "dress up helmet",
      "medieval helmet",
      "plastic costume helmet",
    ],
    default_min_age_months: 36,
    default_max_age_months: 72,
    default_outgrown_months: 84,
    risk_level: "medium",
    recommendation_policy: "browse_with_caution",
    development_mappings: [
      m("social_emotional", "estimated"),
      m("cognitive_problem_solving", "estimated"),
    ],
    safety_flags: [
      "Check manufacturer age guidance",
      "Costume item; check fit and visibility",
      "Check for sharp edges or broken plastic",
    ],
  },
  {
    slug: "child_binoculars",
    label: "Child binoculars",
    aliases: ["children’s binoculars", "toy binoculars", "safari binoculars", "binoculars"],
    default_min_age_months: 36,
    default_max_age_months: 72,
    default_outgrown_months: 84,
    risk_level: "medium",
    recommendation_policy: "browse_with_caution",
    development_mappings: [
      m("cognitive_problem_solving", "estimated"),
      m("gross_motor", "estimated"),
    ],
    safety_flags: ["Check cord/strap length", "Check manufacturer age guidance"],
  },
  {
    slug: "hammer_peg_toy",
    label: "Hammer and peg toy",
    aliases: ["hammer and peg toy", "wooden hammer peg toy", "pounding bench", "peg hammer toy"],
    default_min_age_months: 18,
    default_max_age_months: 48,
    default_outgrown_months: 54,
    risk_level: "medium",
    recommendation_policy: "recommendable",
    development_mappings: [m("fine_motor", "close"), m("cognitive_problem_solving", "estimated")],
  },
  {
    slug: "picture_book",
    label: "Picture book",
    aliases: ["picture book", "children’s book", "board book", "story book"],
    default_min_age_months: 0,
    default_max_age_months: 72,
    default_outgrown_months: null,
    risk_level: "low",
    recommendation_policy: "recommendable",
    development_mappings: [
      m("language_communication", "estimated"),
      m("cognitive_problem_solving", "estimated"),
    ],
  },
  {
    slug: "toy_doctor_kit",
    label: "Toy doctor kit",
    aliases: ["doctor kit", "vet kit", "toy medical kit", "pretend doctor set"],
    default_min_age_months: 24,
    default_max_age_months: 60,
    default_outgrown_months: 72,
    risk_level: "medium",
    recommendation_policy: "recommendable",
    development_mappings: [
      m("social_emotional", "close"),
      m("language_communication", "estimated"),
    ],
  },
  {
    slug: "baby_sleep_aid",
    label: "Baby sleep aid",
    aliases: ["sleep aid", "white noise machine", "baby night light", "cot soother"],
    default_min_age_months: 0,
    default_max_age_months: 24,
    default_outgrown_months: 36,
    risk_level: "high",
    recommendation_policy: "browse_with_caution",
    development_mappings: [m("self_care_independence", "review_needed")],
    safety_flags: [
      "Check electrical/battery safety",
      "Check manufacturer age guidance",
      "Do not place loose items in sleep space unless manufacturer guidance supports it",
    ],
  },
];

const SEED_BY_SLUG = new Map(SEED_MARKETPLACE_ITEM_TYPES.map((t) => [t.slug, t]));

export function isAllowedStage1Slug(slug: string | null | undefined): slug is Stage1WrapperSlug {
  if (!slug) return false;
  return (STAGE1_WRAPPER_SLUGS as readonly string[]).includes(slug);
}

export function getStage1Label(slug: string | null | undefined): string | null {
  return isAllowedStage1Slug(slug) ? STAGE1_WRAPPER_LABELS[slug] : null;
}

export function getSeedItemType(slug: string | null | undefined): SeedItemType | null {
  if (!slug) return null;
  return SEED_BY_SLUG.get(slug) ?? null;
}

/** Lower-cased, punctuation-normalised string for alias matching. */
export function normalizeAliasText(value: string | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Best-effort offline alias match against the seed taxonomy.
 * Returns a known item-type slug, or null if no confident match.
 * (The live route also queries the DB aliases table; this mirror covers
 * the seed set and powers offline tests.)
 */
export function matchSeedItemTypeByText(text: string | null | undefined): string | null {
  const norm = normalizeAliasText(text);
  if (!norm) return null;
  for (const type of SEED_MARKETPLACE_ITEM_TYPES) {
    const candidates = [type.label, type.slug.replace(/_/g, " "), ...type.aliases];
    for (const candidate of candidates) {
      const c = normalizeAliasText(candidate);
      if (!c) continue;
      if (norm === c || norm.includes(c) || c.includes(norm)) {
        return type.slug;
      }
    }
  }
  return null;
}
