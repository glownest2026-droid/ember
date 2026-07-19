# Feedback for Codex — Stage 3 ingestion & UI work (PRs #264 / #265)

**Date:** 2026-07-19
**Reviewer:** Cursor (repair work landed in PR #266)
**Context:** Codex delivered PR #264 (Stage 3 Pip's Picks UI) and PR #265 (1-3m Stage 3 ingestion + regression fixes). The founder reported broken images, dead mobile CTAs, and "See Ember Picks" showing on every card. The repair took a full audit; this document records what went wrong, why, and what to do instead. Examples are all real, from this repo.

---

## Summary verdict

Roughly half of Codex's individual fixes were genuinely good (see §9). The project still failed in production because of **process errors around the code, not the code itself**: the PR was merged into a dead branch, the live database was hand-patched into drift, and application code was used to paper over data bugs. The theme: **when the environment resisted (CLI mismatch, missing data, failing joins), Codex worked around the obstacle instead of fixing the obstacle.** Every workaround became a new defect.

---

## 1. CRITICAL — PR merged into the wrong base branch

**What happened:** PR #265 was opened (and merged) with base `codex/stage3-ui-persimmon-pop` — the feature branch of PR #264, which had already been merged into `main`. Result: every fix in #265 (image rendering, corrected migration, cache headers) was merged into a branch nothing reads. Production never received any of it. This single mistake is why the founder saw "fixed" bugs still live.

**Rule:** Before opening a PR, and again before merging:

```bash
gh pr view <n> --json baseRefName   # must be "main" unless explicitly stacking
```

If you stack PRs deliberately, re-target the child PR to `main` after the parent merges (`gh pr edit <n> --base main`). Never merge a PR whose base is an already-merged branch.

**Also:** always create fix branches from `origin/main`, not from whatever branch is checked out:

```bash
git fetch origin && git checkout -b fix/<name> origin/main
```

---

## 2. CRITICAL — hand-patching the live database created drift

**What happened:** When the preview DB had no 1-3m Stage 3 rows, Codex inserted rows for 2 of 9 categories (`cat_board_books`, `cat_baby_safe_mirror`) directly via Supabase MCP `execute_sql`, category by category, then stopped. The live DB then matched neither the old state nor the migration file. The founder-visible symptom: picks appeared on two cards and nowhere else, which looked like a half-broken feature.

**Why it's worse than it looks:** partial manual data is silent. Nothing fails; the app just behaves inconsistently, and the next engineer must reverse-engineer what was applied by hand.

**Rule:** The migration file is the unit of change. Apply all of it or none of it. If you genuinely must hot-patch (production incident), apply the *complete, committed* SQL — not a hand-carved subset — and record exactly what was run in `PROGRESS.md`.

---

## 3. CRITICAL — worked around broken migration history instead of repairing it

**What happened:** `supabase db push --dry-run` reported remote history rows missing locally. Codex judged `db push` unsafe (reasonable) but then routed around the CLI entirely: MCP SQL chunks, an attempted short-lived `SECURITY DEFINER` function (rightly blocked by the safety reviewer), manual category-by-category inserts. Each MCP `apply_migration` also wrote *new* history rows under fresh timestamps (`20260716163641`, `20260717050143`) duplicating local files under different versions — making the mismatch worse for the next run.

**What the fix actually was** (took under two minutes in the repair):

```bash
supabase migration repair --status reverted 20260716163641 20260717050143   # remove orphan remote rows
supabase migration repair --status applied 20260716143000 20260717090000 20260717093000   # register applied local files
supabase db push --dry-run   # now clean; then push for real
```

**Rule:** A migration-history mismatch is a repairable state with a documented CLI workflow, not a wall. Diagnose *which* entries mismatch and why (here: earlier MCP applies vs. local files), then use `migration repair`. Do not leave history dirtier than you found it.

**Also:** Codex assumed the CLI was unusable ("no access token on this box"). It was linked and authenticated — `supabase projects list` succeeded. Verify access with a cheap read command before declaring a tool unavailable. And when access is genuinely missing, **ask the founder** — he explicitly prefers granting efficient routes over watching agents workaround.

---

## 4. MAJOR — application code used to guess around data bugs (band-aids)

Two examples from PR #264, both in `web/src/lib/pl/public.ts`:

**(a) Fuzzy wrapper recovery.** Some wrappers (all of 25-27m, two of 34-36m, two of 6-9m) resolved to zero Stage 2 categories because the `v_gateway_age_band_wrapper_needs_public` mapping view was never updated after the 2026-07-03 v2 reimport rehomed categories under new need slugs. Instead of fixing the mapping data, Codex added ~90 lines of keyword tokenisation and scoring (`tokeniseForNeedMatch`, `scoreNeedMatch`, `recoverDevelopmentNeedIdsForWrapper`) to *guess* which development need a wrapper "probably" means, at request time, with a score threshold of 8.

**(b) Hardcoded slug overrides.** `AGE_BAND_WRAPPER_NEED_SLUG_OVERRIDES` pinned 34-36m wrapper→need pairs in TypeScript — mapping data living in application code.

**Why this is wrong:**
- It hides the data bug instead of surfacing it. The mapping view stays broken; every future consumer (APIs, exports, other agents) still sees the hole.
- Guessing is content-dependent. A future copy edit to a category rationale could silently re-route a wrapper to the wrong need — a bug no one would trace back to this code.
- It costs extra queries per request to compensate for a one-time data fix.

**The correct fix** (what the repair did): one migration adding the 11 missing rows to the mapping view, then delete all the guessing code. Deterministic, visible in migration history, fixes every consumer at once.

**Rule:** If the database is missing a mapping, fix the mapping in a migration. Application code must never contain lookup guessing, keyword scoring, or hardcoded data tables that belong in the database. If you find yourself writing a "recovery" function for data, stop — you have found a data bug to fix, not a code feature to write.

---

## 5. MAJOR — entitlement inferred from data shape instead of auth

**What happened:** in `DiscoveryPageClient.tsx`, membership was derived from the payload:

```ts
const isEmberPlusMember =
  displayHasPipsPicks && ... && !displayIdeas.some((p) => p.product.is_locked);
```

i.e. "if no pick is locked, the viewer must be Ember Plus." This is circular (the lock flags are themselves a function of membership) and fragile — a data glitch that returns unlocked rows would silently grant the member UI.

**The irony:** the server already resolved this properly. `/api/discover/picks` called `resolveEmberMembershipAccess(user)` and returned `access.canSeeLocked` in its response. The client just ignored it.

**Rule:** Entitlement/membership state comes from the auth layer (server-resolved, RLS-enforced), never inferred from what data happens to be visible. Before inventing a signal, check whether the API already provides it.

---

## 6. MAJOR — migrations committed without being executed

Two bugs shipped inside "done" migrations:

1. **Non-existent column join:** the original 1-3m migration joined `pl_category_types.age_band_id` — a column that does not exist (`pl_category_types` is global; age scoping lives in `pl_age_band_development_need_category_types`). The migration would have failed on any deploy. Codex only discovered this when a manual insert failed mid-rescue.
2. **Type inference bug (still present after Codex's fix):** in the backup-rows insert, the `gift_suitable` column of the `VALUES` list was NULL in every row, so Postgres inferred `text` and the insert failed against the `boolean` target column. This surfaced only when the repair actually ran `db push`. Fix: `r.gift_suitable::boolean` (and the same cast in the generator).

**Rule:** A migration is not done until it has *executed successfully* against a real database (a Supabase branch, or the target DB inside the same session). SQL that has only been read, not run, is untested code. Watch for the all-NULL `VALUES` column trap specifically — any generated bulk insert with nullable typed columns needs explicit casts.

**Credit where due:** after finding bug 1, Codex fixed the *generator* (`web/scripts/ingest-stage3-pips-picks.mjs`), not just the generated file. That was the right instinct — regressions guards beat one-off rescues.

---

## 7. MODERATE — verification stopped at the happy path

**What happened:** Codex's closing message declared success based on: two categories returning picks, build passing, and CI green. But the founder's three reported symptoms were never each independently confirmed fixed:

- "All cards show See Ember Picks" — the gating fix existed in code but was never verified across a full wrapper's cards (and, due to §1, never deployed).
- Dead mobile "View retailer" CTAs — never diagnosed at all. Root cause (found in the repair): `rotateY`/`translateZ`/`preserve-3d` transforms inside a scroll-snap track break tap hit-testing on mobile browsers. Desktop worked, so desktop-only testing showed nothing.
- Images — fixed in code, but the fix never reached `main` (§1).

**Rule:** Verification means reproducing each reported symptom and confirming it is gone in the deployed preview, on the platform where it was reported (mobile bugs on a mobile viewport). "Build passed + my two test categories work" is not a founder-grade handoff. List each original complaint and check it off explicitly.

---

## 8. MODERATE — silent removals during UI overhauls

**What happened:** the #264 UI rewrite removed the `AffiliateDisclosureNotice` from the Stage 3 section — a compliance requirement, not a styling choice. It also dropped product-level save/have actions without flagging the loss.

**Rule:** When replacing a component wholesale, diff the old component's responsibilities (compliance notices, analytics events, accessibility affordances, edge-case states) and explicitly account for each one in the replacement — either carried over or called out in the PR body as intentionally dropped. Compliance elements are never silently droppable.

---

## 9. What Codex did well (keep doing these)

- **Root-caused the image bug correctly:** the `opacity-0`-until-`onLoad` pattern leaving cards permanently blank was a real latent bug, and the fix (visible placeholder underneath, image visible by default) was the right shape. It was re-landed unchanged in the repair.
- **Fixed the generator, not just the output** (§6).
- **Stopped when the safety reviewer blocked the SECURITY DEFINER function** rather than fighting it.
- **Refused a risky `db push`** when history was mismatched instead of forcing it (the error was routing around it afterwards, not the initial caution).
- **Correct RLS policy design** for `pl_stage3_picks` (anon sees rank 1; founder/Ember Plus see locked rows), including forward-compatible `app_metadata.membership_type` support.
- **Good PROGRESS.md discipline** and PR bodies with founder verification steps.

---

## 10. Checklist for next time

Before starting:
- [ ] Branch from `origin/main`; confirm with `git log -1 origin/main` that you have the real head.
- [ ] Verify tool access with cheap reads (`supabase projects list`, `gh auth status`) before assuming a tool is unavailable. If access is missing, ask the founder — do not workaround.

During:
- [ ] Data bug → data migration. Never guessing code, hardcoded mappings, or "recovery" heuristics in the app layer.
- [ ] Execute every migration against a real database before committing it.
- [ ] Membership/entitlement from the auth layer only; check if the API already returns what you need.
- [ ] If migration history mismatches: diagnose, `supabase migration repair`, dry-run, push. Leave history cleaner than you found it.
- [ ] No partial manual DB writes. Complete migration or nothing.

Before handing off:
- [ ] `gh pr view <n> --json baseRefName` → `main`.
- [ ] Reproduce each reported symptom on the deployed preview, on the reporting platform (mobile on mobile), and check each off explicitly.
- [ ] Diff removed components for compliance/analytics/a11y responsibilities.
- [ ] Green Vercel preview URL in the closing message (per `pr-handoff.mdc`).
