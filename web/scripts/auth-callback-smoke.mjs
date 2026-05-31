/**
 * Auth callback / canonical host smoke (run: node web/scripts/auth-callback-smoke.mjs).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

// Mirror production normalization (must match auth-callback-url.ts).
const EMBERPLAY_HOSTS = new Set(["emberplay.app", "www.emberplay.app"]);

function normalizeAuthOrigin(origin, canonical) {
  if (!canonical) return origin;
  try {
    const current = new URL(origin);
    if (!EMBERPLAY_HOSTS.has(current.hostname)) return origin;
    return new URL(canonical).origin;
  } catch {
    return origin;
  }
}

function safeNextPath(next) {
  const fallback = "/discover";
  if (!next) return fallback;
  const value = next.trim();
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  const pathOnly = value.split(/[?#]/)[0];
  if (pathOnly === "/") return fallback;
  const blocked = ["/signin", "/signout", "/auth"];
  if (blocked.some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`))) return fallback;
  return value;
}

const canonical = "https://www.emberplay.app";

assert.equal(
  normalizeAuthOrigin("https://emberplay.app", canonical),
  "https://www.emberplay.app"
);
assert.equal(
  normalizeAuthOrigin("https://www.emberplay.app", canonical),
  "https://www.emberplay.app"
);
assert.equal(
  normalizeAuthOrigin("https://ember-foo.vercel.app", canonical),
  "https://ember-foo.vercel.app"
);
assert.equal(safeNextPath("/signin"), "/discover");
assert.equal(safeNextPath("/auth/callback"), "/discover");
assert.equal(safeNextPath("/discover/26?child=x"), "/discover/26?child=x");

const authLib = read("src/lib/auth-callback-url.ts");
const callbackRoute = read("src/app/auth/callback/route.ts");
const routeHandler = read("src/utils/supabase/route-handler.ts");

assert.match(authLib, /normalizeAuthOrigin/);
assert.match(authLib, /buildAuthCallbackUrl[\s\S]*safeNextPath/);
assert.match(callbackRoute, /canonicalOrigin !== url\.origin/);
assert.match(routeHandler, /getAll\(\)/);
assert.match(routeHandler, /setAll\(cookiesToSet\)/);

console.log("auth-callback-smoke: all checks passed ✓");
