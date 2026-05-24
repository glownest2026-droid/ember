/**
 * PR8 smoke checks (run: node web/scripts/marketplace-pr8-smoke.mjs)
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function ensureAreaLabel(label, fallback = "Approximate area") {
  const trimmed = String(label ?? "").trim();
  if (!trimmed) return fallback;
  if (/^[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}$/i.test(trimmed)) {
    const outward = trimmed.split(" ")[0];
    return outward ? `${outward} area` : fallback;
  }
  return trimmed;
}

function formatAreaRadiusHeadline(areaLabel, radiusMiles) {
  return `${ensureAreaLabel(areaLabel)} + ${radiusMiles} miles`;
}

function formatDemandPrimaryCopy(count) {
  if (count <= 0) return "No clear local signal yet";
  if (count === 1) return "1 nearby family may be interested";
  return `${count} nearby families may be interested`;
}

function formatListingLocalCue(areaLabel, radiusMiles = 5) {
  return `${ensureAreaLabel(areaLabel)} · within ${radiusMiles} miles`;
}

function formatConditionLabel(condition) {
  if (!condition?.trim()) return null;
  return condition
    .trim()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function displayStringHidesFullPostcode(text) {
  return !/^[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}$/i.test(text.trim());
}

assert.equal(ensureAreaLabel("SL4 3QB"), "SL4 area");
assert.equal(ensureAreaLabel("Windsor area"), "Windsor area");
assert.equal(formatAreaRadiusHeadline("SL4 area", 5), "SL4 area + 5 miles");
assert.equal(formatDemandPrimaryCopy(0), "No clear local signal yet");
assert.equal(formatDemandPrimaryCopy(3), "3 nearby families may be interested");
assert.equal(formatListingLocalCue("SL4 area", 5), "SL4 area · within 5 miles");
assert.equal(formatConditionLabel("like_new"), "Like New");
assert.ok(displayStringHidesFullPostcode("SL4 area · within 5 miles"));
assert.ok(!displayStringHidesFullPostcode("SL4 3QB"));

const opportunityCard = readFileSync(
  join(root, "src/components/marketplace/OpportunityMapCard.tsx"),
  "utf8"
);
assert.match(opportunityCard, /data-testid="opportunity-map-card"/);
assert.match(opportunityCard, /OPPORTUNITY_MAP_PRIVACY_COPY/);
assert.doesNotMatch(opportunityCard, /mapbox/i);

const marketplacePage = readFileSync(
  join(root, "src/app/(app)/app/marketplace/page.tsx"),
  "utf8"
);
assert.match(marketplacePage, /OpportunityMapCard/);
assert.match(marketplacePage, /data-testid="marketplace-local-map-module"/);
assert.match(marketplacePage, /data-testid="listing-local-cue"/);
assert.match(marketplacePage, /MarketplaceBuyerInterestActions/);

const listingOpportunity = readFileSync(
  join(root, "src/components/marketplace/ListingOpportunitySection.tsx"),
  "utf8"
);
assert.match(listingOpportunity, /OpportunityMapCard/);

console.log("PR8 smoke checks passed.");
