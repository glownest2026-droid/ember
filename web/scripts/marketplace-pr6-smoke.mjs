/**
 * PR6 smoke checks (run: node web/scripts/marketplace-pr6-smoke.mjs)
 */
import assert from "node:assert/strict";

const EARTH_RADIUS_MILES = 3958.8;

function haversineMiles(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

function normalizeUkPostcodeOutward(postcode) {
  const raw = String(postcode ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
  if (!raw) return null;
  const parts = raw.split(" ");
  if (parts.length >= 2) return parts[0] ?? null;
  if (raw.length >= 3) return raw.slice(0, Math.min(4, raw.length));
  return raw;
}

assert.ok(haversineMiles(51.5, -0.1, 51.51, -0.11) < 2, "nearby coords within 2 miles");
assert.ok(haversineMiles(51.5, -0.1, 52.5, -1.5) > 50, "far coords beyond 50 miles");
assert.equal(normalizeUkPostcodeOutward("sl4 2abc"), "SL4");
assert.equal(normalizeUkPostcodeOutward("SW1A 1AA"), "SW1A");

console.log("PR6 smoke checks passed.");
