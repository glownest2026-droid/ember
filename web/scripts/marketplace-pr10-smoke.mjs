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
assert.match(pageClient, /MarketplaceDevelopmentSection/);
assert.match(pageClient, /development-opportunities/);
assert.match(pageClient, /listing-match-reason/);
assert.match(pageClient, /childId/);

const devSection = read("src/components/marketplace/MarketplaceDevelopmentSection.tsx");
assert.match(devSection, /View local toys by development area/);
assert.match(devSection, /Choose a child/);

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

console.log("marketplace-pr10-smoke: all checks passed ✓");
