# Ember Developer Operating Model

**Status:** Canonical engineering doctrine (required doc — see `DOCS_MANIFEST.md`)
**Audience:** Every AI agent and human developer. `AGENTS.md` is the short front door; this is the reasoning and the worked examples.
**Origin:** Distilled from the PR #264 / #265 / #266 Stage 3 episode, where good code still failed in production because of process and layering mistakes. Raw post-mortem: `agent-tools/feedback/CODEX_STAGE3_FEEDBACK_2026-07.md`.

This document covers the doctrine that is **not** written elsewhere. For things that already have a home, it links there rather than repeating:

- PR handoff / green preview → `.cursor/rules/pr-handoff.mdc`
- Progress logging → `.cursor/rules/progress-log.mdc`
- Deploy / merge / rollback → `web/docs/DEPLOY-CHECKLIST.md`
- Rocket scope, pricing, waitlist → `.cursor/rules/project-rocket.mdc`
- Parent persona / copy bar → `.cursor/rules/conscientious-conor.mdc`

The guiding principle behind everything below:

> **When the environment resists — a CLI mismatch, missing data, a failing join — fix the obstacle, don't route around it. Every workaround becomes the next defect.**

---

## 1. Branch & PR discipline

**Rule.** Branch from `origin/main`. A PR's base must be `main` unless you are deliberately stacking, and a stacked child must be re-targeted to `main` once its parent merges.

**Why it matters — real failure.** PR #265 was opened with base `codex/stage3-ui-persimmon-pop`, the feature branch of PR #264, which had *already merged to main*. Every fix in #265 — corrected image rendering, the fixed migration, cache headers — merged into a branch nothing deploys. Production never saw any of it. The founder reported the same bugs as "still broken" because, from `main`'s perspective, they were never touched.

**Do this.**

```bash
git fetch origin
git checkout -b fix/<name> origin/main
# ...work...
gh pr create --base main ...
# before merge, always:
gh pr view <n> --json baseRefName   # expect "main"
```

If you intentionally stack B on A: after A merges, `gh pr edit <B> --base main` and confirm the diff is only B's changes.

---

## 2. Migration discipline

### 2a. A migration is not done until it has executed

**Rule.** Never mark a migration complete on the strength of having *written* it. Run it against a real database — a Supabase branch, or the target DB within the same session — and confirm the row counts.

**Why — two real bugs that only surfaced on execution:**

1. **Non-existent column.** The first 1-3m Stage 3 migration joined `pl_category_types.age_band_id`. That column does not exist — `pl_category_types` is global; age scoping lives in `pl_age_band_development_need_category_types`. The migration would have failed on *any* deploy, but it was committed as "done" because it had only been read, never run.
2. **All-NULL `VALUES` type inference.** In the backup-rows insert, `gift_suitable` was `NULL` in every row of the `VALUES` list, so Postgres inferred `text` and rejected the insert against the `boolean` column. This survived Codex's own fix and only died when the repair actually ran `db push`. The fix:

```sql
-- backup_rows VALUES has gift_suitable NULL in every row → inferred text
r.gift_suitable::boolean,   -- explicit cast to the target column type
```

**Watch for:** any generated bulk insert with a nullable typed column (boolean, uuid, timestamptz, arrays). If a `VALUES` column is NULL in every row, cast it explicitly. Fix the **generator**, not just the generated SQL (see §6).

### 2b. Repair migration history; do not route around it

**Rule.** A history mismatch between remote and local is a known, repairable state — not a wall.

**Why — real failure.** `supabase db push --dry-run` reported remote rows missing locally. Instead of repairing, Codex abandoned the CLI: MCP SQL chunks, an attempted short-lived `SECURITY DEFINER` function (correctly blocked by the safety reviewer), and manual per-category inserts. Worse, each MCP `apply_migration` wrote *new* history rows under fresh timestamps, duplicating local files under different versions and deepening the mismatch.

**The actual fix took under two minutes:**

```bash
supabase migration repair --status reverted <orphan_remote_versions>
supabase migration repair --status applied  <already_applied_local_versions>
supabase db push --dry-run    # now clean
supabase db push              # apply for real
```

**Before declaring a tool unavailable, prove it.** Codex claimed "no access token on this box"; `supabase projects list` in fact succeeded and the project was linked. Run a cheap read (`supabase projects list`, `gh auth status`) first. If access is genuinely missing, **ask** — do not build a bypass.

### 2c. No partial DB patching

**Rule.** The migration file is the unit of change: apply all of it or none. The only exception is a declared production incident hotfix, and even then you apply the *complete committed SQL* and record exactly what ran in `PROGRESS.md`.

**Why — real failure.** With the preview DB empty, Codex hand-inserted 2 of 9 categories (`cat_board_books`, `cat_baby_safe_mirror`) via MCP and stopped. The live DB then matched neither the prior state nor the migration. Symptom: picks appeared on two cards and nowhere else — which reads as a half-broken feature, not a deployment gap. Partial manual data is *silent*: nothing errors, behaviour is just inconsistent, and the next engineer has to reverse-engineer what was done by hand.

---

## 3. Data bugs live in data — not in application code

**Rule.** If the database is missing a mapping or a row, fix it in a migration. Application code must never contain lookup guessing, keyword scoring, similarity heuristics, or hardcoded data tables that belong in the database.

**Why — real failure.** Several wrappers (all of 25-27m, two of 34-36m, two of 6-9m) resolved to zero Stage 2 categories, because `v_gateway_age_band_wrapper_needs_public` was never updated after the 2026-07-03 v2 reimport rehomed categories under new need slugs. Rather than fix the view, PR #264 added ~90 lines to `web/src/lib/pl/public.ts` to *guess* the intended need at request time:

```ts
// REMOVED in the repair — do not reintroduce this shape
function tokeniseForNeedMatch(value) { /* strip stopwords, tokenise */ }
function scoreNeedMatch(wrapperTokens, categoryTokens) { /* +4 exact, +1 partial */ }
function recoverDevelopmentNeedIdsForWrapper(ageBandId, wrapperSlug) {
  // ...score every need, pick the best if score >= 8
}
// plus a hardcoded AGE_BAND_WRAPPER_NEED_SLUG_OVERRIDES map in TS
```

**Why this is wrong, concretely:**
- It **hides** the data bug — the view stays broken for every other consumer (other APIs, exports, other agents).
- It is **content-dependent** — a future copy edit to a category rationale could silently re-route a wrapper to the wrong need, a bug no one would trace back here.
- It **costs queries per request** to compensate for a one-time data fix.

**The correct fix** (what the repair shipped): one migration adding the 11 missing rows to the mapping view, then delete all the guessing code. Deterministic, visible in history, fixes every consumer at once.

**Heuristic:** if you catch yourself writing a `recover*`, `guess*`, `fuzzy*`, or `score*` function for data resolution, stop — you have found a data bug to migrate, not a feature to build.

---

## 4. Entitlement comes from auth, not data shape

**Rule.** Membership and access state derive from the auth layer (server-resolved, RLS-enforced). Never infer them from what data happens to be visible. Before inventing a signal, check whether the API already returns it.

**Why — real failure.** `DiscoveryPageClient.tsx` computed:

```ts
// circular and fragile — REMOVED
const isEmberPlusMember =
  displayHasPipsPicks && ... && !displayIdeas.some((p) => p.product.is_locked);
```

i.e. "if nothing is locked, they must be a member." But the lock flags are *themselves* a function of membership, so this is circular; and any data glitch returning unlocked rows would silently grant the paid UI. The server had already done it properly — `/api/discover/picks` called `resolveEmberMembershipAccess(user)` and returned `access.canSeeLocked`. The client just ignored it. The fix was to consume the value the API already provided.

---

## 5. UI replacement checklist

**Rule.** When you replace a component wholesale, diff the old component's *responsibilities* and account for each — carried over, or explicitly called out as an intentional drop in the PR body. Compliance elements are never silently droppable.

**Why — real failure.** The #264 rewrite silently removed the `AffiliateDisclosureNotice` from the Stage 3 section (a compliance requirement) and dropped product-level save/have actions with no mention.

**Before replacing, enumerate the old component's:**
- [ ] Compliance elements (affiliate disclosure, safety notes, pricing caveats)
- [ ] Analytics events (`trackEvent` calls and their properties — never send child names)
- [ ] Accessibility affordances (roles, `aria-*`, focus management, keyboard handlers)
- [ ] User actions (save, have, gift, share)
- [ ] State coverage (empty, loading, error, locked/gated)
- [ ] Mobile behaviour (touch targets, hit-testing — see §6 example)

---

## 6. Verify like the founder will

**Rule.** Verification = reproduce each reported symptom and confirm it is gone *on the deployed preview*, on the platform where it was reported. A passing build and one happy-path check is not a handoff.

**Why — real failures.**
- The **mobile dead-CTA** bug was never diagnosed, because testing was desktop-only. Root cause found later: `rotateY` / `translateZ` / `preserve-3d` transforms inside a scroll-snap track break tap hit-testing on mobile browsers. Desktop worked perfectly, so desktop testing revealed nothing. Fix: flat physics on touch devices, 3D only for `(hover: hover) and (pointer: fine)`.
- The **"See Ember Picks on every card"** gating fix existed in code but was never checked across a full wrapper's cards — and, per §1, never deployed anyway.

**Do this.** List the founder's original complaints and tick each against the live preview:

```
[ ] Symptom 1 (images) — reproduced gone at <preview>/discover/2 on mobile
[ ] Symptom 2 (mobile CTA) — tapped on a phone viewport, opens retailer
[ ] Symptom 3 (gating) — verified across all cards in one wrapper
```

Cheap live smoke checks beat assumptions — e.g. hit the API on the preview and inspect the JSON, and confirm previously-broken cases now return data.

---

## 7. Stop-and-ask triggers

Stop and ask the founder (or flag loudly) rather than inventing a bypass when:

- Tooling access appears blocked (verify with a cheap read first; then ask for the credential/route).
- Migration history is dirty and repair is non-obvious.
- You are tempted by any workaround — fuzzy matching, hand-patched data, a privileged temporary function, disabling a check.
- A required doc (`DOCS_MANIFEST.md`) is missing on the branch.
- Scope would expand or a destructive/irreversible action is involved.

The founder is non-technical (marketing background, systems thinker, real parent) but wants to be kept abreast of the how/why at founder level, and prefers granting an efficient route over watching an agent hack around a missing one.

---

## 8. What good looked like (keep doing)

From the same episode, these were correct and were preserved in the repair:

- **Root-causing the image bug** — the `opacity-0`-until-`onLoad` pattern could leave cards permanently blank; the placeholder-underneath fix was the right shape.
- **Fixing the generator, not just the output** — the bad join was corrected in `web/scripts/ingest-stage3-pips-picks.mjs`, guarding future bands, not only the one file.
- **Respecting the safety reviewer** — abandoning the `SECURITY DEFINER` function when blocked.
- **Forward-compatible RLS** — `pl_stage3_picks` policy: anon sees rank 1; founder / Ember Plus see locked rows via `app_metadata.membership_type`.
- **Good `PROGRESS.md` and PR-body verification steps.**

---

## 9. Pre-flight / in-flight / handoff checklist

**Before starting**
- [ ] Branched from `origin/main`; `git log -1 origin/main` confirms the real head.
- [ ] Tool access proven with cheap reads (`supabase projects list`, `gh auth status`). Missing access → ask.
- [ ] Required docs present on the branch.

**While building**
- [ ] Data bug → data migration. No guessing code / hardcoded maps in the app layer.
- [ ] Every migration executed against a real DB; row counts confirmed; generator fixed if generated.
- [ ] Entitlement from auth/RLS; reuse API-provided signals.
- [ ] History mismatch → `migration repair` → dry-run → push. No partial manual writes.
- [ ] Replaced components: responsibilities preserved or drops declared.

**Before handoff** (see also `.cursor/rules/pr-handoff.mdc`)
- [ ] `gh pr view <n> --json baseRefName,mergeable,mergeStateStatus` → `main` / `MERGEABLE` / `CLEAN`.
- [ ] Each reported symptom reproduced-gone on the deployed preview, on its platform.
- [ ] `PROGRESS.md` updated; plain-English "How to verify it worked" included.
- [ ] Green `*.vercel.app` preview URL in the closing message.
