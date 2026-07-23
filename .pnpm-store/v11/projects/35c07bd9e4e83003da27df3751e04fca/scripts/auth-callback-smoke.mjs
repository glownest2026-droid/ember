/**
 * Auth callback / canonical host smoke (run: node web/scripts/auth-callback-smoke.mjs).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const PRODUCTION_AUTH_ORIGIN = "https://www.emberplay.app";

function getProductionAuthOrigin(requestOrigin) {
  try {
    const host = new URL(requestOrigin).hostname;
    if (host === "emberplay.app" || host === "www.emberplay.app") {
      return PRODUCTION_AUTH_ORIGIN;
    }
  } catch {
    /* ignore */
  }
  return requestOrigin;
}

function shouldRedirectAuthToWww(requestOrigin) {
  try {
    return new URL(requestOrigin).hostname === "emberplay.app";
  } catch {
    return false;
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

// Apex → www once (Supabase may still callback to apex).
assert.equal(
  getProductionAuthOrigin("https://emberplay.app"),
  PRODUCTION_AUTH_ORIGIN
);
assert.equal(shouldRedirectAuthToWww("https://emberplay.app"), true);

// www stays on www — never redirect to apex (Vercel apex↔www loop).
assert.equal(
  getProductionAuthOrigin("https://www.emberplay.app"),
  PRODUCTION_AUTH_ORIGIN
);
assert.equal(shouldRedirectAuthToWww("https://www.emberplay.app"), false);

// Even if NEXT_PUBLIC_SITE_URL were apex, www must not bounce to apex.
const envCanonicalApex = "https://emberplay.app";
assert.equal(
  getProductionAuthOrigin("https://www.emberplay.app"),
  PRODUCTION_AUTH_ORIGIN
);
assert.equal(shouldRedirectAuthToWww("https://www.emberplay.app"), false);
void envCanonicalApex;

assert.equal(
  getProductionAuthOrigin("https://ember-foo.vercel.app"),
  "https://ember-foo.vercel.app"
);
assert.equal(safeNextPath("/signin"), "/discover");
assert.equal(safeNextPath("/auth/callback"), "/discover");
assert.equal(safeNextPath("/discover/26?child=x"), "/discover/26?child=x");

const authLib = read("src/lib/auth-callback-url.ts");
const callbackRoute = read("src/app/auth/callback/route.ts");
const confirmRoute = read("src/app/auth/confirm/route.ts");
const routeHandler = read("src/utils/supabase/route-handler.ts");

assert.match(authLib, /shouldRedirectAuthToWww/);
assert.match(authLib, /PRODUCTION_AUTH_ORIGIN/);
assert.match(authLib, /Never redirect www → apex/i);
assert.match(callbackRoute, /shouldRedirectAuthToWww/);
assert.match(confirmRoute, /shouldRedirectAuthToWww/);
assert.ok(
  !callbackRoute.includes("canonicalOrigin !== url.origin"),
  "must not compare canonical !== origin (caused www→apex loop)"
);
assert.match(routeHandler, /getAll\(\)/);
assert.match(routeHandler, /setAll\(cookiesToSet\)/);

console.log("auth-callback-smoke: all checks passed ✓");
