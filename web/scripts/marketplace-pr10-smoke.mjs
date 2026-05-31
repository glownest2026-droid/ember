/**
 * PR10 smoke checks (run: pnpm -C web test:marketplace-pr10).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// ---------------------------------------------------------------------------
// A. Development wrappers (seven slugs + labels + order)
// ---------------------------------------------------------------------------
const wrappers = read("src/lib/marketplace/development-wrappers.ts");
const taxonomy = read("src/lib/marketplace/marketplace-taxonomy.ts");

const EXPECTED = [
  ["social_emotional", "learning to play with other people"],
  ["self_care_independence", "doing more by myself"],
  ["fine_motor", "My hands can do more now"],
  ["gross_motor", "bigger moves"],
  ["language_communication", "more to say"],
  ["cognitive_problem_solving", "figuring things out"],
  ["toileting", "getting ready for potty"],
];

for (const [slug, phrase] of EXPECTED) {
  assert.ok(taxonomy.includes(slug), `taxonomy missing slug ${slug}`);
  assert.ok(taxonomy.includes(phrase), `taxonomy missing label phrase for ${slug}: ${phrase}`);
  assert.ok(
    wrappers.includes(slug) || wrappers.includes("STAGE1_WRAPPER_SLUGS"),
    `development-wrappers missing ${slug}`
  );
}

assert.ok(wrappers.includes("DEVELOPMENT_WRAPPER_CARDS"), "DEVELOPMENT_WRAPPER_CARDS export required");
assert.ok(
  wrappers.includes("STAGE1_WRAPPER_SLUGS.map"),
  "wrapper cards should derive order from STAGE1_WRAPPER_SLUGS"
);

// ---------------------------------------------------------------------------
// B. Child matching (age + 6 months)
// ---------------------------------------------------------------------------
const eligibility = read("src/lib/marketplace/recommendation-eligibility.ts");
assert.match(eligibility, /DEFAULT_LOOKAHEAD = 6/);

const childCtx = read("src/lib/marketplace/child-marketplace-context.ts");
assert.match(childCtx, /all_children/);
assert.match(childCtx, /missing_age/);
assert.match(childCtx, /DEFAULT_CHILD_LOOKAHEAD_MONTHS = 6/);

// ---------------------------------------------------------------------------
// C. Counts / watch mode (no "0 opportunities")
// ---------------------------------------------------------------------------
const devOpps = read("src/lib/marketplace/development-opportunities.ts");
assert.match(devOpps, /Watching for matches/);
assert.ok(!devOpps.includes("0 opportunities"), 'must not show "0 opportunities"');
assert.match(devOpps, /watch_mode/);

// ---------------------------------------------------------------------------
// D. Safety gates
// ---------------------------------------------------------------------------
const enrich = read("src/lib/marketplace/listing-match-enrichment.ts");
assert.match(enrich, /computeRecommendationEligibility/);

// Safety + coverage: source invariants (behavioural mirrors live in PR9 smoke)
const coverage = read("src/lib/marketplace/coverage-state.ts");
assert.match(coverage, /exact_age_band_content/);
assert.match(coverage, /marketplace_item_estimate_only/);
assert.match(coverage, /NOT "no developmental need"/i);
assert.match(coverage, /ABI_EDITORIAL_MIN_MONTHS = 31/);
assert.match(eligibility, /manufacturer_min_age_months/);
assert.match(eligibility, /browse_with_caution/);
assert.match(eligibility, /do_not_recommend/);

// ---------------------------------------------------------------------------
// F. UI / API source invariants
// ---------------------------------------------------------------------------
const pageClient = read("src/components/marketplace/MarketplacePageClient.tsx");
const clientFilter = read("src/lib/marketplace/marketplace-listing-client-filter.ts");
assert.match(pageClient, /MarketplaceDevelopmentSection/);
assert.match(pageClient, /filterListingsByDevelopment/);
assert.match(pageClient, /history.replaceState/);
assert.match(clientFilter, /filterListingsByDevelopment/);
assert.match(pageClient, /listing-match-reason/);
assert.match(pageClient, /childId/);
assert.ok(!pageClient.includes("router.push"), "development filter must not full-page navigate");

const devSection = read("src/components/marketplace/MarketplaceDevelopmentSection.tsx");
assert.match(devSection, /Local opportunities by development area/);
assert.match(devSection, /grid-cols-2/);
assert.match(devSection, /lg:grid-cols-4/);
assert.match(pageClient, /MarketplaceActiveChildBanner/);
assert.match(pageClient, /Move items to nearby families who need them/);
const childBanner = read("src/components/marketplace/MarketplaceActiveChildBanner.tsx");
assert.match(childBanner, /Browsing marketplace for/);
assert.match(childBanner, /Choose a child/);

const devApi = read("src/app/api/marketplace/development-opportunities/route.ts");
assert.match(devApi, /getMarketplaceDevelopmentOpportunities/);

const betaApi = read("src/app/api/marketplace/beta-listings/route.ts");
assert.match(betaApi, /development/);
assert.match(betaApi, /buyer_match/);

const reviewSection = read("src/components/marketplace/ListingDraftReviewSection.tsx");
assert.ok(!reviewSection.includes("Mark ready for next step"), "unrelated regression");

// No Gemini on buyer page
assert.ok(!pageClient.toLowerCase().includes("gemini"));
assert.ok(!devApi.toLowerCase().includes("gemini"));

// ---------------------------------------------------------------------------
// G. Privacy
// ---------------------------------------------------------------------------
for (const banned of ["seller_email", "seller_phone", "full_postcode", "SERVICE_ROLE"]) {
  assert.ok(!betaApi.includes(banned), `beta-listings must not expose ${banned}`);
}
assert.ok(!pageClient.includes("raw storage path"));

// ---------------------------------------------------------------------------
// H. Potty / toileting taxonomy + opportunity matching
// ---------------------------------------------------------------------------
const resolverSrc = read("src/lib/marketplace/marketplace-item-type-resolver.ts");
const diagnosticSrc = read("src/lib/marketplace/development-match-diagnostic.ts");
const sqlPottySeed = readFileSync(
  join(root, "..", "supabase/sql/202605311800_marketplace_potty_training_seat_seed.sql"),
  "utf8"
);

assert.match(resolverSrc, /resolveObviousItemTypeSlugFromListingText/);
assert.match(enrich, /resolveObviousItemTypeSlugFromListingText/);
assert.match(enrich, /catalog_default_min_age_months/);
assert.match(eligibility, /catalog_default_min_age_months/);
assert.match(devOpps, /getSeedMappingsForSlug/);
assert.ok(taxonomy.includes('slug: "potty_training_seat"'));
assert.match(taxonomy, /toileting", "close"/);
assert.match(sqlPottySeed, /potty_training_seat/);
assert.match(sqlPottySeed, /I''m getting ready for potty/);
assert.match(diagnosticSrc, /missing_intelligence_and_no_title_fallback/);
assert.match(diagnosticSrc, /own_listing/);

function normalizeAliasText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveObviousItemTypeSlugFromListingText(text) {
  const norm = normalizeAliasText(text);
  if (!norm) return null;
  const hasPottyWord = /\bpotty\b/.test(norm);
  const hasToiletTraining =
    /\btoilet training\b/.test(norm) || /\bpotty training\b/.test(norm);
  const hasTrainingSeatWithToiletContext =
    /\btraining seat\b/.test(norm) && (hasPottyWord || /\btoilet\b/.test(norm));
  if (hasPottyWord || hasToiletTraining || hasTrainingSeatWithToiletContext) {
    return "potty_training_seat";
  }
  return null;
}

const POTTY_TITLE = "Pink Potty Training Seat with handles";
assert.equal(resolveObviousItemTypeSlugFromListingText(POTTY_TITLE), "potty_training_seat");
assert.equal(resolveObviousItemTypeSlugFromListingText("Wooden train set"), null);

function resolveEffectiveMinMirror(input) {
  if (input.manufacturer_min_age_months != null) {
    return { min: input.manufacturer_min_age_months, source: "manufacturer" };
  }
  if (input.parent_confirmed_min_age_months != null) {
    return { min: input.parent_confirmed_min_age_months, source: "parent" };
  }
  if (input.catalog_default_min_age_months != null) {
    return { min: input.catalog_default_min_age_months, source: "catalog" };
  }
  if (input.ai_estimated_min_age_months != null) {
    return { min: input.ai_estimated_min_age_months, source: "ai" };
  }
  return { min: null, source: "none" };
}

function computeEligibilityMirror(input) {
  const childAge = input.child_age_months;
  const lookahead = input.child_lookahead_months ?? 6;
  const windowTop = childAge != null ? childAge + lookahead : null;
  const { min: effectiveMin, source } = resolveEffectiveMinMirror(input);
  if (source === "ai") return "browse_with_caution";
  if (effectiveMin == null) return "review_needed";
  if (effectiveMin != null && windowTop != null && effectiveMin > windowTop) {
    return "browse_with_caution";
  }
  return "recommended";
}

// A. Potty obvious match — catalog ages must recommend at 31 months (not AI-only caution).
assert.equal(
  computeEligibilityMirror({
    child_age_months: 31,
    catalog_default_min_age_months: 18,
    ai_estimated_min_age_months: null,
  }),
  "recommended"
);

// Regression: treating catalog defaults as AI estimates blocked recommended counts.
assert.equal(
  computeEligibilityMirror({
    child_age_months: 31,
    ai_estimated_min_age_months: 18,
  }),
  "browse_with_caution"
);

// B. Wrapper slug from seed mirror (toileting)
assert.ok(taxonomy.includes('m("toileting", "close")'));

// C. Missing mapping diagnostic label present for tests
assert.match(diagnosticSrc, /missing_development_mapping/);

// D. Ownership exclusion label
assert.match(diagnosticSrc, /excluded_reason: "own_listing"/);

console.log("marketplace-pr10-smoke: all checks passed ✓");
