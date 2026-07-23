/**
 * PR7 smoke checks (run: node web/scripts/marketplace-pr7-smoke.mjs)
 */
import assert from "node:assert/strict";

function normalizeMessageBody(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return null;
  if (trimmed.length > 2000) return null;
  return trimmed;
}

function privacyWarningForMessage(body) {
  if (/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(body)) {
    return "For privacy, avoid sharing personal contact details until you're ready.";
  }
  return null;
}

assert.equal(normalizeMessageBody("  hello  "), "hello");
assert.equal(normalizeMessageBody(""), null);
assert.equal(normalizeMessageBody("x".repeat(2001)), null);
assert.ok(privacyWarningForMessage("email me at test@example.com"));

console.log("PR7 smoke checks passed.");
