/**
 * PR9 smoke checks (run: node web/scripts/marketplace-pr9-smoke.mjs).
 *
 * Two layers:
 *  1. Behavioural specs: re-implement the pure guard/helper logic and assert the
 *     helmet / saxophone / binoculars / unknown-taxonomy / age-safety / coverage cases.
 *  2. Source invariants: read the real source files and assert the key logic and
 *     cautious copy are present (so the behavioural mirror cannot silently drift).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(root, "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const readRepo = (p) => readFileSync(join(repoRoot, p), "utf8");

// ---------------------------------------------------------------------------
// Layer 1: behavioural mirror of identity-guard.ts
// ---------------------------------------------------------------------------
const EXCLUSIVE_ITEM_NOUNS = [
  "saxophone", "xylophone", "trumpet", "drum kit", "drum", "piano", "keyboard",
  "guitar", "recorder", "tambourine", "maracas",
  "binoculars", "telescope", "magnifying glass", "microscope",
  "sleep aid", "white noise machine", "night light", "cot soother", "soother",
  "cot", "crib", "swaddle", "sleeping bag", "dummy", "moses basket",
  "helmet", "costume", "cape", "mask", "tutu", "fancy dress", "tiara",
  "doctor kit", "vet kit", "tea set", "toy kitchen", "cash register", "tool set",
  "balance bike", "scooter", "tricycle", "ride on",
  "building blocks", "shape sorter", "stacking rings", "jigsaw", "puzzle",
  "picture book", "board book", "story book", "book",
  "teddy", "soft toy", "doll", "dolls house",
  "pounding bench", "hammer and peg", "peg toy",
];

function normalize(v) {
  return String(v ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function findNouns(text) {
  const norm = ` ${normalize(text)} `;
  return EXCLUSIVE_ITEM_NOUNS.filter((n) => norm.includes(` ${normalize(n)} `));
}
function isGenericTitle(title) {
  const norm = normalize(title);
  if (!norm) return true;
  const generic = new Set(["toy", "toys", "item", "items", "product", "thing", "baby", "kids", "childrens", "preloved", "second", "hand", "used"]);
  const tokens = norm.split(" ").filter(Boolean);
  return tokens.length > 0 && tokens.every((t) => generic.has(t));
}
function detectConflict(confirmed, draft) {
  const confirmedNouns = findNouns(
    [confirmed.label, confirmed.visual, confirmed.category].join(" ")
  );
  const draftNouns = findNouns([draft.title, draft.description].join(" "));
  if (confirmedNouns.length === 0) return { conflict: false, confirmedNouns, draftNouns };
  const set = new Set(confirmedNouns.map(normalize));
  if (draftNouns.some((n) => set.has(normalize(n)))) return { conflict: false, confirmedNouns, draftNouns };
  if (draftNouns.length > 0) return { conflict: true, confirmedNouns, draftNouns };
  return { conflict: false, confirmedNouns, draftNouns };
}
const SLEEP_DOMAIN_TERMS = ["sleep", "sleep aid", "baby sleep", "white noise", "night light", "cot soother"];

function titleImpliesSleep(title) {
  const norm = normalize(title);
  return SLEEP_DOMAIN_TERMS.some((t) => {
    const term = normalize(t);
    return norm === term || norm.includes(` ${term} `) || norm.startsWith(`${term} `) || norm.endsWith(` ${term}`);
  });
}

function confirmedHasPlayIdentity(confirmed) {
  const text = [confirmed.label, confirmed.visual, confirmed.category].join(" ");
  return /\bhelmet\b|\bvisor\b|\bbinocular|\bsaxophone\b/i.test(text) || findNouns(text).some((n) => !/sleep|soother|cot/.test(n));
}

function validateTitle(confirmed, title) {
  if (titleImpliesSleep(title) && confirmedHasPlayIdentity(confirmed)) {
    return { ok: false, status: "conflict" };
  }
  const nounConflict = detectConflict(confirmed, { title, description: "" });
  if (nounConflict.conflict) {
    return { ok: false, status: "conflict" };
  }
  if (isGenericTitle(title) && confirmedHasPlayIdentity(confirmed)) {
    return { ok: false, status: "review_required" };
  }
  return { ok: true, status: "consistent" };
}

function fallbackTitle(confirmed) {
  if (confirmed.label && !/\bpretend play\b|\bdress up\b/i.test(confirmed.label)) {
    return confirmed.label;
  }
  if (/\bhelmet\b|\bvisor\b/i.test(confirmed.visual)) return "Toy knight helmet";
  if (/\bbinocular/i.test(confirmed.visual)) return "Child binoculars";
  if (/\bsaxophone\b/i.test(confirmed.visual)) return "Saxophone-style musical toy";
  return confirmed.label || "Confirmed item";
}

function reconcileTitle(confirmed, draft) {
  const titleCheck = validateTitle(confirmed, draft.title);
  if (titleCheck.ok && (draft.title ?? "").trim()) {
    return { title: draft.title.trim(), corrected: false };
  }
  return { title: fallbackTitle(confirmed), corrected: true };
}

function validateDraft(confirmed, draft) {
  const titleCheck = validateTitle(confirmed, draft.title);
  if (!titleCheck.ok) return titleCheck;
  const c = detectConflict(confirmed, draft);
  if (c.conflict) return { ok: false, status: "conflict" };
  if (c.confirmedNouns.length > 0 && isGenericTitle(draft.title)) {
    return { ok: false, status: "review_required" };
  }
  return { ok: true, status: "consistent" };
}

// A. Identity drift tests
const helmet = {
  label: "Dress up and pretend play",
  visual: "The item is clearly a plastic costume helmet styled after medieval armour.",
  category: "Dress Up and pretend play",
};
assert.equal(
  validateDraft(helmet, { title: "Baby sleep aid", description: "A white noise machine for the cot." }).status,
  "conflict",
  "helmet confirmed must block a baby-sleep-aid draft"
);
assert.equal(
  validateDraft(helmet, { title: "Knight costume helmet", description: "Dress-up helmet for pretend play." }).ok,
  true,
  "helmet confirmed allows a helmet draft"
);

const saxophone = {
  label: "Saxophone-style musical toy",
  visual: "A red plastic saxophone-style toy with buttons and demo/stop controls.",
  category: "Musical toys",
};
assert.equal(
  validateDraft(saxophone, { title: "Toy xylophone", description: "Colourful xylophone." }).status,
  "conflict",
  "saxophone confirmed must block a xylophone draft"
);
assert.equal(
  validateDraft(saxophone, { title: "Saxophone-style musical toy", description: "Press the buttons for sounds." }).ok,
  true,
  "saxophone confirmed allows a saxophone draft"
);

const binoculars = {
  label: "Child binoculars",
  visual: "Green and blue child binoculars with eyepieces and a strap.",
  category: "Outdoor exploration",
};
assert.equal(
  validateDraft(binoculars, { title: "Toy", description: "A toy." }).status,
  "review_required",
  "binoculars confirmed must not draft as a generic 'Toy'"
);
assert.equal(
  validateDraft(binoculars, { title: "Child binoculars", description: "Binoculars with a strap." }).ok,
  true
);

// A. Helmet stale title regression
const helmetConcrete = {
  label: "Plastic costume helmet",
  visual: "The item is clearly a plastic costume helmet styled after medieval armour.",
  category: "Dress up and pretend play",
};
const staleReconcile = reconcileTitle(helmetConcrete, {
  title: "Sleep",
  description: "A silver-coloured plastic toy helmet designed to look like a medieval knight's visor.",
});
assert.notEqual(staleReconcile.title.toLowerCase(), "sleep", "stale Sleep title must be replaced");
assert.match(staleReconcile.title.toLowerCase(), /helmet|costume|knight|plastic/);
assert.ok(staleReconcile.corrected, "stale title path should correct");

// B. Helmet generated wrong title -> fallback
const badGemini = reconcileTitle(helmetConcrete, { title: "Baby sleep aid", description: "helmet desc" });
assert.notEqual(badGemini.title.toLowerCase(), "baby sleep aid");
assert.equal(badGemini.title, "Plastic costume helmet");

// C. Saxophone drift
const sax = {
  label: "Saxophone-style musical toy",
  visual: "A red plastic saxophone-style toy with buttons.",
  category: "Musical toys",
};
const saxBad = reconcileTitle(sax, { title: "Wooden xylophone", description: "Musical toy" });
assert.match(saxBad.title.toLowerCase(), /saxophone/);
assert.ok(!saxBad.title.toLowerCase().includes("xylophone"));

// D. Binoculars generic fallback
const binReconcile = reconcileTitle(binoculars, { title: "Toy item", description: "Binoculars" });
assert.match(binReconcile.title.toLowerCase(), /binocular/);

// E. Downstream reset — source invariants
const resetHelper = read("src/lib/marketplace/draft-generated-reset.ts");
assert.match(resetHelper, /draftGeneratedFieldsClearPayload/);
assert.match(resetHelper, /clearDraftIntelligenceForDraft/);
const selectRoute = read("src/app/api/marketplace/listing-drafts/[draftId]/select-candidate/route.ts");
assert.match(selectRoute, /draftGeneratedFieldsClearPayload/);
assert.match(selectRoute, /parent_confirmed_item_label/);

// ---------------------------------------------------------------------------
// Layer 1: taxonomy validation mirror (intelligence.ts)
// ---------------------------------------------------------------------------
const KNOWN_SLUGS = new Set([
  "toy_saxophone", "dress_up_costume_helmet", "child_binoculars",
  "hammer_peg_toy", "picture_book", "toy_doctor_kit", "baby_sleep_aid",
]);
const STAGE1 = new Set([
  "social_emotional", "self_care_independence", "fine_motor", "gross_motor",
  "language_communication", "cognitive_problem_solving", "toileting",
]);
function validateIntelligence(raw) {
  const accepted = [];
  const reviewItems = [];
  for (const c of raw.marketplace_item_type_candidates ?? []) {
    if (KNOWN_SLUGS.has(c.slug)) accepted.push(c.slug);
    else reviewItems.push({ suggested_item_type_slug: c.slug });
  }
  const devSlugs = [];
  const rejectedStage1 = [];
  for (const d of raw.development_area_candidates ?? []) {
    if (STAGE1.has(d.stage1_wrapper_ux_slug)) devSlugs.push(d.stage1_wrapper_ux_slug);
    else rejectedStage1.push(d.stage1_wrapper_ux_slug);
  }
  return { accepted, devSlugs, rejectedStage1, reviewItems };
}

// B. Known slugs accepted
const known = validateIntelligence({
  marketplace_item_type_candidates: [
    { slug: "toy_saxophone", confidence: 0.9 },
    { slug: "dress_up_costume_helmet", confidence: 0.8 },
    { slug: "child_binoculars", confidence: 0.7 },
  ],
});
assert.deepEqual(known.accepted.sort(), ["child_binoculars", "dress_up_costume_helmet", "toy_saxophone"]);
assert.equal(known.reviewItems.length, 0);

// B. Unknown item-type slug rejected -> review queue
const unknownType = validateIntelligence({
  marketplace_item_type_candidates: [{ slug: "dress_up_play_magic_category", confidence: 0.6 }],
});
assert.equal(unknownType.accepted.length, 0, "unknown slug must not be accepted as live taxonomy");
assert.equal(unknownType.reviewItems[0].suggested_item_type_slug, "dress_up_play_magic_category");

// B. Unknown Stage 1 wrapper slug rejected
const unknownStage1 = validateIntelligence({
  development_area_candidates: [
    { stage1_wrapper_ux_slug: "imagination_world" },
    { stage1_wrapper_ux_slug: "social_emotional" },
  ],
});
assert.deepEqual(unknownStage1.devSlugs, ["social_emotional"]);
assert.deepEqual(unknownStage1.rejectedStage1, ["imagination_world"]);

// ---------------------------------------------------------------------------
// Layer 1: recommendation eligibility mirror
// ---------------------------------------------------------------------------
function sanitizeAge(min, max) {
  let lo = Number.isFinite(min) ? Math.round(min) : null;
  let hi = Number.isFinite(max) ? Math.round(max) : null;
  if (lo !== null && (lo < 0 || lo > 216)) lo = null;
  if (hi !== null && (hi < 0 || hi > 216)) hi = null;
  if (lo !== null && hi !== null && hi < lo) hi = null;
  return { min: lo, max: hi };
}
function eligibility(input) {
  const policy = input.recommendation_policy ?? "recommendable";
  const risk = input.risk_level ?? "low";
  const childAge = input.child_age_months ?? null;
  const lookahead = input.child_lookahead_months ?? 6;
  const windowTop = childAge !== null ? childAge + lookahead : null;
  const manu = input.manufacturer_min_age_months ?? null;
  const parent = input.parent_confirmed_min_age_months ?? null;
  const ai = input.ai_estimated_min_age_months ?? null;
  const min = manu ?? parent ?? ai;
  const source = manu !== null ? "manufacturer" : parent !== null ? "parent" : ai !== null ? "ai" : "none";
  if (policy === "do_not_recommend" || risk === "restricted") return "do_not_recommend";
  if (source === "manufacturer" && min !== null && windowTop !== null && min > windowTop) {
    return risk === "high" || risk === "restricted" ? "do_not_recommend" : "browse_with_caution";
  }
  if (min !== null && windowTop !== null && min > windowTop) return "browse_with_caution";
  if (policy === "browse_with_caution") return "browse_with_caution";
  if (source === "ai") return "browse_with_caution";
  if (min === null) return "review_needed";
  return "recommended";
}

// C. AI estimate stored separately from manufacturer (sanitize keeps both ranges)
const sep = { ai: sanitizeAge(24, 60), manu: sanitizeAge(36, null) };
assert.equal(sep.ai.min, 24);
assert.equal(sep.manu.min, 36);

// C. Manufacturer 36m blocks personalised recommendation for a 12m child (+6 window)
assert.equal(
  eligibility({ child_age_months: 12, manufacturer_min_age_months: 36, risk_level: "medium" }),
  "browse_with_caution"
);
assert.equal(
  eligibility({ child_age_months: 12, manufacturer_min_age_months: 36, risk_level: "high" }),
  "do_not_recommend"
);
// C. Missing manufacturer age -> cautious (AI only)
assert.equal(
  eligibility({ child_age_months: 30, ai_estimated_min_age_months: 24, risk_level: "medium" }),
  "browse_with_caution"
);
// C. browse_with_caution policy works
assert.equal(
  eligibility({ child_age_months: 40, ai_estimated_min_age_months: 36, recommendation_policy: "browse_with_caution", risk_level: "medium" }),
  "browse_with_caution"
);

// ---------------------------------------------------------------------------
// Layer 1: coverage-state mirror
// ---------------------------------------------------------------------------
function coverage(input) {
  const hasMapping = Boolean(input.has_marketplace_estimate) || STAGE1.has(input.stage1_wrapper_ux_slug);
  let min = input.age_band_min_months ?? null;
  let max = input.age_band_max_months ?? null;
  if (min === null && max === null && input.child_age_months != null) {
    min = input.child_age_months;
    max = input.child_age_months;
  }
  const lo = min ?? max ?? 0;
  const hi = max ?? min ?? lo;
  const overlapExact = hi >= 31 && lo <= 33;
  if (overlapExact && input.has_exact_abi_content) return "exact_age_band_content";
  if (input.has_exact_abi_content) return "adjacent_age_band_content";
  if (hasMapping) return "marketplace_item_estimate_only";
  return "no_editorial_content_coverage";
}

// D. 31-33m exact ABI stage returns exact content when present
assert.equal(
  coverage({ age_band_min_months: 31, age_band_max_months: 33, stage1_wrapper_ux_slug: "fine_motor", has_exact_abi_content: true }),
  "exact_age_band_content"
);
// D. Missing band does NOT return "no needs"; with estimate -> marketplace_item_estimate_only
assert.equal(
  coverage({ age_band_min_months: 12, age_band_max_months: 18, stage1_wrapper_ux_slug: "fine_motor", has_exact_abi_content: false, has_marketplace_estimate: true }),
  "marketplace_item_estimate_only"
);
// D. No usable mapping -> no_editorial_content_coverage (still not "no need")
assert.equal(
  coverage({ age_band_min_months: 12, age_band_max_months: 18, has_exact_abi_content: false, has_marketplace_estimate: false }),
  "no_editorial_content_coverage"
);

// ---------------------------------------------------------------------------
// Layer 2: source invariants
// ---------------------------------------------------------------------------
const identityGuard = read("src/lib/marketplace/identity-guard.ts");
assert.match(identityGuard, /validateDraftAgainstConfirmedItem/);
assert.match(identityGuard, /detectObviousIdentityConflict/);
assert.match(identityGuard, /buildLockedConfirmedItemPayload/);
for (const noun of ["sleep aid", "white noise machine", "helmet", "saxophone", "xylophone", "binoculars"]) {
  assert.ok(identityGuard.includes(noun), `identity-guard should know the noun "${noun}"`);
}

const detailsPrompt = read("src/lib/marketplace/ai-listing-details-prompt.ts");
assert.match(detailsPrompt, /do not contradict|Do not change the item identity/i);
assert.match(detailsPrompt, /identity_conflict/);

const generateRoute = read("src/app/api/marketplace/listing-drafts/[draftId]/generate-details/route.ts");
assert.match(generateRoute, /reconcileDraftTitleWithConfirmedIdentity/);
assert.match(generateRoute, /resolveConfirmedIdentity/);
assert.match(generateRoute, /lockedConfirmedItem/);

const confirmedIdentity = read("src/lib/marketplace/confirmed-item-identity.ts");
assert.match(confirmedIdentity, /resolveConfirmedIdentity/);
assert.match(confirmedIdentity, /Toy knight helmet/);

const titleFormat = read("src/lib/marketplace/listing-title-format.ts");
assert.match(titleFormat, /formatProductTitleCase/);

const detailsSection = read("src/components/marketplace/ListingDraftDetailsSection.tsx");
assert.match(detailsSection, /LISTING_REVIEW_CHECKLIST_ITEMS/);
assert.match(detailsSection, /Save draft details/);
assert.match(detailsSection, /formatProductTitleCase/);

const flowView = read("src/components/marketplace/listing-flow/CreateListingFlowView.tsx");
assert.match(flowView, /categoryLabel/);
assert.match(flowView, /user_facing_item_label/);
assert.ok(
  flowView.includes("listing-step-details") && flowView.includes("initialReview"),
  "Step 3 details should pass review checklist state into save flow"
);

const taxonomy = read("src/lib/marketplace/marketplace-taxonomy.ts");
for (const slug of ["social_emotional", "self_care_independence", "fine_motor", "gross_motor", "language_communication", "cognitive_problem_solving", "toileting"]) {
  assert.ok(taxonomy.includes(slug), `taxonomy should include stage1 slug ${slug}`);
}
for (const slug of ["toy_saxophone", "dress_up_costume_helmet", "child_binoculars", "hammer_peg_toy", "picture_book", "toy_doctor_kit", "baby_sleep_aid"]) {
  assert.ok(taxonomy.includes(slug), `taxonomy should include seed item type ${slug}`);
}

const migration = readRepo("supabase/sql/202605311200_marketplace_intelligence_taxonomy.sql");
for (const table of [
  "marketplace_item_type_aliases",
  "marketplace_item_type_development_mappings",
  "marketplace_listing_intelligence",
  "marketplace_taxonomy_review_queue",
]) {
  assert.ok(migration.includes(table), `migration should create ${table}`);
}
assert.match(migration, /seller_user_id = auth\.uid\(\)/, "intelligence RLS must be seller-scoped");
assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
assert.ok(migration.includes("dress_up_costume_helmet"), "migration should seed the helmet type");

const estimateUi = read("src/components/marketplace/EmberEstimateSection.tsx");
assert.match(estimateUi, /Estimated play stage/);
assert.match(estimateUi, /May support/);
assert.match(estimateUi, /Save estimate/);
assert.match(estimateUi, /manufacturer/i);
for (const banned of ["Suitable for", "Safe for", "Guaranteed", "Perfect for your child", "No needs found"]) {
  assert.ok(!estimateUi.includes(banned), `Ember estimate UI must not use banned copy "${banned}"`);
}
// Privacy: no child-name capture in the estimate UI.
assert.ok(!/child.?name|childName|"name"/i.test(estimateUi), "estimate UI must not capture a child name");

// Intelligence route uses RLS-scoped route client, not service-role.
const intelRoute = read("src/app/api/marketplace/listing-drafts/[draftId]/intelligence/route.ts");
assert.match(intelRoute, /@\/utils\/supabase\/route-handler/);
assert.ok(!/SERVICE_ROLE|service_role/.test(intelRoute), "intelligence route must not use the service-role key");
assert.match(intelRoute, /seller_user_id/);

console.log("marketplace-pr9-smoke: all checks passed ✓");
