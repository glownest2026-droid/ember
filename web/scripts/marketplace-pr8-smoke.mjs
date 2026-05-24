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

function jitterMapMarker(listingId, lat, lng) {
  let hash = 0;
  for (let i = 0; i < listingId.length; i++) {
    hash = (hash * 31 + listingId.charCodeAt(i)) | 0;
  }
  hash = Math.abs(hash);
  const angle = ((hash % 360) * Math.PI) / 180;
  const distance = 0.006 + (hash % 7) * 0.0015;
  const latOffset = distance * Math.cos(angle);
  const lngOffset = (distance * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);
  return { lat: lat + latOffset, lng: lng + lngOffset };
}

function formatListingLocalCue(areaLabel, radiusMiles = 5) {
  return `${ensureAreaLabel(areaLabel)} · within ${radiusMiles} miles`;
}

function displayStringHidesFullPostcode(text) {
  return !/^[A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2}$/i.test(text.trim());
}

assert.equal(ensureAreaLabel("SL4 3QB"), "SL4 area");
assert.equal(formatListingLocalCue("SL4 area", 5), "SL4 area · within 5 miles");
assert.ok(displayStringHidesFullPostcode("SL4 area · within 5 miles"));
assert.ok(!displayStringHidesFullPostcode("SL4 3QB"));

const jittered = jitterMapMarker("listing-abc", 51.48, -0.6);
assert.notEqual(jittered.lat, 51.48);
assert.notEqual(jittered.lng, -0.6);

const marketplaceMap = readFileSync(
  join(root, "src/components/marketplace/MarketplaceMap.tsx"),
  "utf8"
);
assert.match(marketplaceMap, /getMapboxToken/);
assert.match(marketplaceMap, /MarketplaceMapFallback/);
assert.match(marketplaceMap, /data-testid="marketplace-mapbox-map"/);
assert.match(marketplaceMap, /mapbox-gl/);
assert.doesNotMatch(marketplaceMap, /pk\.[a-z0-9]/i);

const marketplacePage = readFileSync(
  join(root, "src/app/(app)/app/marketplace/page.tsx"),
  "utf8"
);
assert.match(marketplacePage, /MarketplaceMap/);
assert.match(marketplacePage, /data-testid="marketplace-local-map-module"/);
assert.match(marketplacePage, /data-testid="listing-local-cue"/);
assert.match(marketplacePage, /MarketplaceBuyerInterestActions/);
assert.match(marketplacePage, /selectedListingId/);

const apiRoute = readFileSync(
  join(root, "src/app/api/marketplace/beta-listings/route.ts"),
  "utf8"
);
assert.match(apiRoute, /toMarketplaceMapListingPayload/);
assert.doesNotMatch(apiRoute, /listings: nearby\.map\(\(\{ postcode/);

const payloadLib = readFileSync(
  join(root, "src/lib/marketplace/marketplace-map-payload.ts"),
  "utf8"
);
assert.match(payloadLib, /map_marker_lat/);
assert.doesNotMatch(payloadLib, /postcode/);

const envExample = readFileSync(join(root, ".env.example"), "utf8");
assert.match(envExample, /NEXT_PUBLIC_MAPBOX_TOKEN=/);

console.log("PR8 smoke checks passed.");
