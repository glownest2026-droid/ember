# For Codex — Ember now has a Developer Operating Model. Read it before working.

Paste this to Codex at the start of any Ember task (or add it to your Codex project/system instructions).

---

## What changed

The Ember repo now has a **central knowledge base** for how we build. It exists because of the Stage 3 episode (PRs #264 / #265 / #266): the code was largely fine, but the work failed in production due to process and layering mistakes. The operating model turns those learnings into standing rules that apply to every agent — you included.

## What to read, in order

1. **`AGENTS.md`** (repo root) — the front door. The 10 non-negotiables and a map of the canonical source for every topic. Read this first, every time.
2. **`web/docs/DEVELOPER_OPERATING_MODEL.md`** — the full doctrine with worked examples from the exact PRs you worked on.
3. **`agent-tools/feedback/CODEX_STAGE3_FEEDBACK_2026-07.md`** — the detailed post-mortem of #264/#265 (what went wrong and why). Background reading; the two docs above are the standing rules.

These are enforced: `AGENTS.md` and `web/docs/DEVELOPER_OPERATING_MODEL.md` are now required docs in `web/docs/DOCS_MANIFEST.md` and `web/scripts/check-required-docs.js`. Do not delete, rename, or bypass them.

## The rules you most need to internalise

These are the ones the Stage 3 work got wrong. Full reasoning + examples are in `DEVELOPER_OPERATING_MODEL.md` (section numbers below).

1. **Branch from `origin/main`; PR base must be `main`.** (§1) — #265 was merged into an already-merged feature branch, so none of its fixes reached production. Always `gh pr view <n> --json baseRefName` before merge.
2. **A migration is not done until it has executed against a real DB.** (§2a) — two migrations shipped "done" with a non-existent-column join and an all-NULL `VALUES` boolean that only failed when actually run. Fix the generator, not just the generated SQL.
3. **Repair migration history; never route around it.** (§2b) — `supabase migration repair` then `db push` is the two-minute fix. Prove a tool is unavailable with a cheap read before abandoning it; if access is truly missing, **ask the founder**.
4. **No partial hand-patched DB writes.** (§2c) — inserting 2 of 9 categories by hand created silent drift. Whole migration or nothing.
5. **Data bugs live in data.** (§3) — the fuzzy wrapper-recovery keyword matcher and hardcoded slug overrides were band-aids over a missing mapping-view row. Fix the mapping in a migration; never guess in app code.
6. **Entitlement from auth/RLS, not data shape.** (§4) — membership was inferred circularly from lock flags when the API already returned `access.canSeeLocked`.
7. **Verify like the founder will.** (§6) — reproduce each reported symptom on the deployed preview, on its platform. The mobile dead-CTA bug was invisible to desktop-only testing.
8. **Preserve responsibilities when replacing UI.** (§5) — the rewrite silently dropped the affiliate disclosure (a compliance element).
9. **Stop and ask** when tooling is blocked, history is dirty, or a workaround is tempting. (§7)

## Also update your Ember skills

When you next touch these skills, add a one-line reference so they inherit the operating model:

> "Follow the Ember Developer Operating Model — read `AGENTS.md` and `web/docs/DEVELOPER_OPERATING_MODEL.md` before starting. Data bugs get migrations, not app-code guessing; migrations must execute before they are done; PR base must be `main`."

Priority skills: **Ember Stage 3 Card Ingestion**, **Ember Stage 3 Founder Review**, and **Ember Stage 2 Pilot Converter**.

## The one line to remember

> When the environment resists — a CLI mismatch, missing data, a failing join — fix the obstacle, don't route around it. Every workaround becomes the next defect.
