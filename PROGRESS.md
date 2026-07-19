## 2026-07-19: Stage 3 follow-up bug bash — save-to-Products, signed-out carousel repair, expanded-view navigation (11 items)

Founder follow-up after merging #271. All 11 items shipped in one PR (branch `fix/stage3-followups`).

- **Item 1 — Save works and lands in Products tab.** New `stage3_pick` kind on `user_list_items` (`supabase/migrations/20260719140000_stage3_pick_saves.sql`): FK to `pl_stage3_picks`, widened kind/ref constraints, unique index, `upsert_user_list_item` consolidated to one 9-arg function (the live DB had an ambiguous 7/8-arg overload pair), subnav stats + public gift list count/resolve stage3 picks. `DiscoveryPageClient` gets `handleSaveStage3Pick` (+ auth replay case `save_stage3_pick`), modal links to `/my-ideas?tab=products`. `MyIdeasClient` renders saved picks in Products with Google Shopping "Browse offers".
- **Item 10 — desktop "1 / 1" broken arrows root cause.** RLS hides locked picks from non-members, so after the placeholder change the app couldn't tell 5 picks existed and rendered one card with dead arrows. New owner-privilege counts view `v_gateway_stage3_pick_counts_public` (`20260719141000`) exposes only counts; `public.ts` fills locked placeholders to the true researched count. Signed-out users get the 1-free + locked-upsell carousel back.
- **Item 6 — "Best for…" tags standardised in data** (`20260719142000`): all 55 visible picks (1–3m + 34–36m) rewritten as `Best for <situation>`; verified 0 non-conforming. Format rule added to `ember-stage3-research` skill; QA gate added to `ember-stage3-card-ingestion` skill.
- **Item 9 — icon hard rule**: `pickIcon()` rewritten most-specific-first with word boundaries (playmat → mat icon not tree; "cards" no longer matches "car"); rule documented in the ingestion skill.
- **Items 5 + 11 — expanded view**: close button anchored to the card (not screen corner), swipe + arrow keys + on-card chevrons navigate all visible picks without closing; desktop chevrons sit beside the card.
- **Item 3 — dead space**: verdict box follows description directly; thumb row anchors the card bottom; clamps loosened one line.
- **Items 2 + 7 — anchor balance**: compact Pip's Picks header on mobile, card heights `clamp()`ed to viewport, scroll offset now reserves room for the Start over FAB (148px mobile / 88px desktop) so header + card + Start over share the viewport without overlap.
- **Item 4 — lane swap**: "Things that can help" renders before "Useful ideas" in parent mode.
- **Item 8 — robin silver**: card-corner robins get a grayscale/brightness filter (premium silver); header robin keeps brand colours.
- Cache bump `20260719-stage3-followups`. Migrations applied via `supabase db push` and mirrored to `supabase/sql/`. `tsc` + `pnpm build` pass.

**Round 2 (founder screenshots on preview):** (a) card still clipped on ~760–880px-tall phones — height floor lowered to 380px, text clamps now step down in exclusive viewport-height ranges (`>880` / `761–880` / `≤760`), tag clamped to 1 line, tighter mobile padding; (b) popup "not swipeable" for signed-out users was by design (only 1 unlocked pick) but wrong — expanded view now swipes onto the locked upsell card too (Ember Plus pitch inside the popup, `Discover Ember Plus` → `/pricing`), and the swipe surface covers the whole overlay with `touch-action: pan-y`.

## 2026-07-19: Stage 3 card UX cleanup + Start over + breadth (bug bash items 5–8)

**PR #270** (stacked on the cluster-mapping branch, PR #269 — merge #269 first). All UI/plumbing, no DB changes. Vercel green, preview: `ember-git-fix-stage3-card-ux-tims-projects-cd69a894.vercel.app`.

- **Item 5 — card cleanup** (`web/src/components/discover/figma/PipsPicksPersimmonCarousel.tsx`): removed "Pick X" tag prefix and price; new thumb row at the card bottom with three controls — **Browse offers** (primary), expand, save (wired to the same save-to-my-ideas action as Stage 2 cards via `onSavePick`). Expand button moved out of the top corner. Card/carousel heights now scale with the viewport (`min(…, calc(100dvh - …))`) with tighter line clamps under 720px-tall screens, so content breathes without ever overflowing the device.
- **Item 5v — retailer rule**: retailer CTAs never deep-link one retailer. `googleShoppingUrl()` sends every Browse offers / expanded-view CTA to Google Shopping (`brand + name` query). Rule documented in the component.
- **Item 6 — Start over**: `DiscoveryPageClient.tsx` now observes the Stage 3 picks section too, so the floating Start over button stays visible through Stage 3; picks section got `pb-20` so the FAB never overlaps the last card.
- **Item 7 — personalisation**: verified `personalizePickCopy` + `childDisplayLabel` already flow into the verdict copy; no code change needed (was not lost).
- **Item 8 — breadth 5→10**: picks pipeline now supports up to 10 per category — API limit (`api/discover/picks/route.ts`), carousel slice, and `public.ts` placeholder logic (placeholders only fill gaps up to the highest researched rank, so 5-pick categories stay at 5 with no "coming soon" padding). **Judgement for 1–3m: stay at 5 visible picks** — the existing rank 6–15 longlist rows are `backup_not_card_ready` (no tags/short descriptions) and would dilute quality; board books is the natural first 10-pick candidate once research delivers card-ready depth.
- **Item 8ii — research skill upgraded**: `~/.codex/skills/ember-stage3-research/SKILL.md` (mirrored at `agent-tools/skill-updates/ember-stage3-research/SKILL.md`) now takes `target_pick_count` (default 5, max 10), with a pick-depth test (does pick 10 help a different parent than picks 1–9?), category guidance (books yes; mirrors/safety no), and a hard rule that picks 6–10 must meet the same card-ready bar.

Verified: `tsc --noEmit` and `pnpm build` pass in the worktree. Outstanding from the bug bash: item 2 (Tummy Time Stage 3 picks) — blocked on the Manus research files, which were not attached.

**2026-07-19 follow-up:** #270 was merged into its stacked base branch after #269's merge commit was cut, so its changes never reached `main`. Re-landed on `main` via PR #271 (branch `fix/stage3-card-ux-mainland`).

## 2026-07-19: Stage 1→2 duplication root-cause fix — cluster context on Stage 2 mapping (bug bash item 1)

Founder reported Stage 1 cards leading to the same Stage 2 cards (e.g. "I'm finding your face" and "I'm listening to your voice"). Validated against the offline source of truth (Spine 3.0 Bible `discover_projection` tab, 1–3m workbook): **confirmed a real bug, not content reality.** The Bible gives each cluster its own curated list (55 rows, only 2 intentional overlaps), but ingestion dropped the cluster column and keyed rows by shared development needs — clusters sharing a need rendered the union of each other's cards ("I'm starting to wriggle" showed 20 cards instead of 7; "I'm finding your face" was missing its high-contrast card), and per-cluster copy variants collapsed to one arbitrary winner.

Fix (schema + data + app, no band-aids):

- **`supabase/migrations/20260719110000_add_wrapper_context_stage2_junction.sql`** — adds `ux_wrapper_id` to `pl_age_band_development_need_category_types`, widens the unique key (`NULLS NOT DISTINCT`), exposes `wrapper_slug` on `v_gateway_category_types_public`.
- **`scripts/generate-discover-projection-sql.mjs`** — generator now carries `cluster_entity_id` through to the junction (wrapper join, DISTINCT ON, conflict target, deactivation all wrapper-aware). Future band reimports get exact Bible fidelity automatically.
- **`supabase/migrations/20260719112000_reimport_discover_1_3m_cluster_context.sql`** — regenerated 1–3m from the Bible (55 rows / 10 clusters, validation notices pass). Applied via `supabase db push` (also committed 16 previously-applied-but-uncommitted image-mapping migrations to sync history).
- **`web/src/lib/pl/public.ts`** — cluster-tagged rows are now the source of truth: wrapper-scoped fetch per cluster; legacy need-based resolution kept only for bands not yet re-ingested (rows with NULL wrapper). No fuzzy logic.
- **Cache bump:** `GATEWAY_CATALOGUE_CACHE_VERSION = '20260719-stage2-cluster-context'`.

Verified in live DB: every 1–3m cluster now returns exactly the Bible's list; shared categories carry per-cluster copy ("Face books to look at together" rank 5 under faces vs "Board books and face books" rank 3 under listen). Note: 9–12m has the same latent duplication (shared needs: books/container/parent_day/bilateral) — fixed automatically when that band is re-ingested from its Bible.

Same PR, bug bash item 4 — **picks-first Stage 2 ranking**: `sortedPlayIdeas` in `DiscoveryPageClient.tsx` now leads each lane with cards that have Ember Picks (9 categories have visible Stage 3 picks in 1–3m, incl. `cat_soft_carrier_sling` per the founder's example).

Same PR, bug bash item 3 — **old-image audit** (read-only): `agent-tools/exports/old_images_audit_2026-07-19.md`. 41 card placements use pre-2026-06-26 images across two old generations (2026-04-22: 9 files/26 placements, mostly 19–36m; 2026-06-16: 5 files/15 placements incl. founder-reported reach-and-grab). Highest-impact replacement: `ember_cat_soft_graspable_balls_category.png` (10 bands). Replacements need founder-generated assets, then the standard image-mapping migration.

## 2026-07-19: Codified offline source of truth for Discover content (docs-only, PR #268)

Founder rule made durable: the offline source of truth for Discover content and Stage 1→Stage 2 mapping is **always** the Spine 3.0 Bible workbook — `Spine 3.0 → Spine 3.0_02 Ember Bibles → 02_Ember_Bible_<band>_*.xlsx → discover_projection tab` (1–3m: `02_Ember_Bible_1_3m_Conor_Thea_Depth_v2_more_purchase_depth.xlsx`).

- New §0 in `.cursor/rules/conor-grade-catalogue-upload.mdc` (always-applied): path pattern, tab contents, and the rule that when live DB and workbook disagree, the workbook wins — fix via migration, never fuzzy lookups.
- Cross-referenced in `AGENTS.md` topic map and `web/docs/DEVELOPER_OPERATING_MODEL.md` §3.
- PR: https://github.com/glownest2026-droid/ember/pull/268 (docs-only).

## 2026-07-19: Developer Operating Model — central knowledge base (docs-only)

Created a cross-agent knowledge base so the #264/#265 learnings become standing rules for every agent (Cursor, Codex, etc.), not just Cursor rules.

- **`AGENTS.md`** (repo root) — front door: 10 non-negotiables + map of canonical sources. First cross-agent entrypoint in the repo.
- **`web/docs/DEVELOPER_OPERATING_MODEL.md`** — full doctrine with real #264/#265/#266 examples; references existing rules rather than duplicating them.
- **`.cursor/rules/developer-operating-model.mdc`** — thin always-on pointer to both.
- **Enforcement:** both new docs added to `web/docs/DOCS_MANIFEST.md` and `web/scripts/check-required-docs.js` (now 6 required docs; `node web/scripts/check-required-docs.js` passes).
- **Codex handoff:** `agent-tools/feedback/CODEX_ONBOARDING_OPERATING_MODEL.md` — shareable brief to point Codex at the knowledge base; post-mortem source is `agent-tools/feedback/CODEX_STAGE3_FEEDBACK_2026-07.md`.

Deliberately references (does not restate) `pr-handoff.mdc`, `progress-log.mdc`, `DEPLOY-CHECKLIST.md` to avoid doctrine drift.

## 2026-07-18: Pip's Picks expand pop-up + guaranteed card fit — PR #266 follow-up 2

Founder still saw cut-off CTAs and wanted the Stage 2 pattern: compact cards that always fit, with a pop-up for the full text.

- Every text block on the compact card is now clamped (tag 2 lines, title 2, brand 1, description 3/4, verdict 5/6) so the View retailer button is guaranteed visible within the fixed card height.
- New full-screen expanded view (`PipsPickExpanded` in `PipsPicksPersimmonCarousel.tsx`), mirroring `DiscoverFigmaPlayIdeaExpanded`: unclamped text, same dark card styling, View retailer CTA, Escape/close button, body scroll lock, reduced-motion aware. Opened via a `Maximize2` button next to the rank pill (unlocked cards only).
- Robin mark enlarged from 48px to 64px (72px desktop), still tucked in the corner; tag/title right padding increased to keep clear.

## 2026-07-18: Pip's Picks card polish (mobile) — PR #266 follow-up

Founder review of the preview on a phone flagged three issues, fixed in `PipsPicksPersimmonCarousel.tsx`:

1. **Truncation:** card content could overflow the fixed card height, cutting off the View retailer button. Description now clamps to 3 lines (4 on desktop), "Why Pip picked this" to 5 lines (6 on desktop); mobile card height +20px.
2. **Robin mark:** shrunk from 88px to 48px and tucked into the top-right corner (2.5 inset); tag and title rows get right padding so text never runs underneath.
3. **Non-member locked cards:** instead of four identical locked cards, non-members now see pick 1 plus a single locked upsell card with a "4 more picks available" counter pill (count = hidden picks). Members still see all five. Rank badge keeps "n / 5" so the full shortlist size stays visible.

## 2026-07-18: Stage 3 1-3m repair — re-land lost PR #265 fixes properly (Cursor)

**Why:** PR #265 was merged into the already-merged feature branch `codex/stage3-ui-persimmon-pop` instead of `main`, so none of its fixes reached production. This PR re-lands the good parts on a clean branch from `main`, removes the band-aid patterns, and repairs the database properly.

**Re-landed from #265:**
- `20260718101000_ingest_stage3_pips_picks_1_3m.sql` — corrected join via `pl_age_band_development_need_category_types` (+ new `::boolean` cast fix for the all-NULL backup `gift_suitable` column, also fixed in the generator `web/scripts/ingest-stage3-pips-picks.mjs`)
- `DiscoverFigmaImage` fix — image no longer hides at `opacity:0` waiting for `onLoad`; placeholder renders underneath
- Stage 3 gating (`withStage3Availability`) — "See Our Picks" only where visible Stage 3 picks exist
- Private no-store caching on `/api/discover/picks` category path; `force-dynamic` on both discover API routes (removed contradictory `revalidate` exports)

**Band-aids removed (new in this repair):**
- Deleted fuzzy wrapper-recovery (keyword scoring) and the hardcoded 34-36m need-slug override from `web/src/lib/pl/public.ts`. Root cause fixed in data: `20260718160000_fix_wrapper_need_mappings_6_9m_25_27m_34_36m.sql` adds the missing wrapper→need rows (6-9m first-foods/mouth-sensory, all 25-27m clusters from the 2026-07-03 v2 reimport, 34-36m talk-stories/feelings) to `v_gateway_age_band_wrapper_needs_public`. Verified: every wrapper on every band now resolves ≥1 category without code-side guessing.
- Ember Plus state on `/discover` now comes from the server-resolved `access.canSeeLocked` returned by `/api/discover/picks` (`resolveEmberMembershipAccess`), not inferred from lock flags in the payload.

**New fixes:**
- Mobile dead "View retailer" CTA: 3D transforms (`rotateY`/`translateZ`/`preserve-3d`) break tap hit-testing inside a scroll-snap track on mobile browsers. `PipsPicksPersimmonCarousel` now applies 3D physics only on hover/fine-pointer devices; touch gets a flat snap carousel.
- Affiliate disclosure restored under the Pip's Picks section (removed in #264; compliance).

**Database (live, via Supabase CLI after history repair):**
- `supabase migration repair` — reverted orphan history rows `20260716163641`/`20260717050143` (Codex MCP duplicates), marked `20260716143000`/`20260717090000`/`20260717093000` as applied. Migration history now matches the repo.
- `supabase db push` applied `20260718101000` + `20260718160000`. Verified: 1-3m Stage 3 = 45 visible + 83 backup across all 9 categories (was 10 rows / 2 categories of manual drift).
- Cache version bumped to `20260718-stage3-repair-v2`.

**Verification:** `tsc --noEmit` clean, `npm run build` clean. PR [#266](https://github.com/glownest2026-droid/ember/pull/266) — Vercel checks green, `MERGEABLE`/`CLEAN`. Preview smoke checks passed: 1-3m `ent_cluster_listen_and_coo` shows `See Our Picks` on exactly the 3 pilot categories (all others hidden); anon picks API returns rank 1 unlocked with real retailer URL + `access.canSeeLocked=false`; previously broken wrappers (25-27m ×2, 6-9m first foods, 34-36m ×2) all return 5–9 categories. Preview: https://ember-git-fix-stage3-1-3m-repair-tims-projects-cd69a894.vercel.app

## 2026-07-17: At home add UX (text-first + Stage 2 confirm)

- Dedicated `/family/at-home/add`: one hero image, text-first, photo optional
- Stage 2 match: `inventory_match_stage2_categories` + `GET /api/inventory/match-stage2`
- Parent confirms Discover category card; Marketplace copy scrubbed from entry points
- Founder follow-up: one hero image; strongest three matches only; confidence labels removed
- No-match is non-blocking: save parent-entered text now; classify before Marketplace listing
- Context-aware return link from Family or At home; no em dashes in this parent flow
- Migration applied: `20260717054756_at_home_unmatched_and_match_quality`
- Old `/app/listings?intent=at-home` redirects to the new add page
- List it still uses full Marketplace publish flow

## 2026-07-15: Project Rocket: At home (Inventory first ship)

- Parent name **At home**; route `/family/at-home` under Family
- Discover Have syncs into `garage_items` via `sync_at_home_from_discover_have` (+ backfill)
- **Add item** → `/family/at-home/add` (supersedes listings intent path)
- List it → `/app/listings?new=1&household_item=…` (full Marketplace publish flow)
- Migrations applied: `20260715134457` + `20260715134927` + `20260717060500`
- Garage parent-facing language removed from Family UI

## 2026-07-15 — Manus research brief (jigsaws 34–36m)

- `agent-tools/exports/manus_stage3_research_brief_34-36m_jigsaws.md` — single-card brief; **top 5** Ember Picks
- Required return: `ember_picks_research_v1` JSON + CSV (`research_date`, URL + `url_checked_date` / `price_checked_date`) for later ingest

## 2026-07-15 — Manus research brief (Pip’s Picks 34–36m)

- Brief: `agent-tools/exports/manus_stage3_research_brief_34-36m.md`
- 7 research rows with Spine educational objectives + age nuance; Conor guardrails; methodology left to Manus
- Safety Stage 1 excluded (Quick Check only)

## 2026-07-15 — Pip’s Picks MVP shortlist (34–36m)

- **Launch principle:** ≥1 Stage 2 card with Stage 3 recs under every Stage 1 card (product rows only; safety clusters may skip).
- **Script:** `web/scripts/export-stage3-research-shortlist.mjs`
- **Source:** `02_Ember_Bible_34_36m_v1_1.xlsx` (`discover_projection`)
- **Output:** `agent-tools/exports/stage3_shortlist_34-36m.md` + `.csv`
- **Result:** 8 Stage 1 clusters → **7 research candidates**; 1 no-pick (`The safety reset…` → Keep as Quick Check)

## 2026-07-15 — pricing: Learn more → Ember Plus features

- Orange centred “Learn more” above Ember Plus “Join the waitlist” CTA
- Anchors to `#ember-plus-features` on the features block
- Desktop scroll offset: `scroll-mt-[calc(var(--header-height)+24px)]` so heading clears sticky nav

## 2026-07-15 — Project Rocket Phase 0 waitlist

- Migrations applied: `20260715003133_ember_plus_waitlist` + `…_anon_insert` (RLS INSERT for anon/authenticated)
- API `POST /api/waitlist/ember-plus`; pricing CTA + modal; FAQ waitlist-honest
- Anon insert smoke-tested (unique email dedupe OK)
- View rows: Supabase → Table Editor → `ember_plus_waitlist`
- PR #259 green preview: https://ember-git-feat-ember-plus-waitlist-tims-projects-cd69a894.vercel.app
- Standing rule: always open PR + green Vercel for app builds (never ask) — `pr-handoff.mdc` / `project-rocket.mdc`
- Founder: waitlist **confirmation email deferred** (modal sufficient for Phase 0)

## 2026-07-15 — Project Rocket founder IDs renumbered F1–F9

- No gap: F1 bands · F2 Picks rules · F3 shortlist rows · F4–F9 unchanged roles
- Waitlist is Cursor-owned (not a missing F1)

## 2026-07-15 — Project Rocket HTML v3 founder briefs

- Abundant founder deliverables: copy-paste templates, examples, done-when per F1–F8
- Dual-track board points at briefs; Inventory still Cursor-owned
- Drive + Knowledge + `agent-tools/exports/Ember_Project_Rocket_Roadmap.html`

## 2026-07-15 — Project Rocket dual-track HTML v2

- Rebuilt Drive HTML: Founder Jobs ‖ Cursor Builds; blockers; Inventory = Cursor-owned
- Waitlist: Supabase-native interest only; founding offer dropped
- Mirrors: Knowledge folder + `agent-tools/exports/Ember_Project_Rocket_Roadmap.html`

## 2026-07-15 — Project Rocket founder HTML roadmap

- Branded HTML for marketing founder: phases, what goes live, parent examples, F1–F9 deps
- Drive: `Project Leaf/Project Rocket/Ember_Project_Rocket_Roadmap.html` (+ Knowledge mirror)
- Repo mirror: `agent-tools/exports/Ember_Project_Rocket_Roadmap.html`

## 2026-07-15 — Project Rocket kickoff

- Formalised `web/docs/PROJECT_ROCKET.md` + always-on `.cursor/rules/project-rocket.mdc`
- `$MVP_Threshold` BRD, waitlist-first GTM, phased roadmap, founder dependency checklist
- Spine 3.0 finding: Pip’s Picks “high priority” = Bible `show_ember_picks` (not Source Captures)

## 2026-07-15 — docs: privacy promise — optional child call-names

- Policy flip: parents may optionally share a call-name; Ember may personalise product + marketing/push; name never required
- Added `.cursor/rules/privacy-promise.mdc` (alwaysApply)
- Updated OneSignal runbook privacy boundary, analytics §F (vendor telemetry ban retained), Leaf image-mapping hard requirement, FamilyDashboardClient comment
- Founder still needs to replace Cursor **User Rules** line that says “Never collect a child’s name”

## 2026-07-15 — fix(home): Developmental Play heading

- Homepage How it works: “One calm loop” → “Developmental Play”

## 2026-07-15 — fix(pricing + home): copy follow-ups after merge

- Hero 3-line split; Ember Plus + Pip lead; Free label “browse in your own time”; £29 for 12 months
- Free card: Marketplace link only in bullet (not label)
- FAQ: drop “make money”; add card/cancel/post-cancel questions
- Homepage How it works: Buy it → Find it

## 2026-07-14 — fix(pricing): spacing breathe + swipe hint

- “Ember Plus features:”; swipe hint → “Swipe to discover >”
- More section/card/FAQ/journey-node whitespace (SaaS breathing room)

## 2026-07-14 — fix(pricing): Ember Plus wording, features intro, Seasons v2

- Hero: “Get more from Ember with Pip, your play coach”; always “Ember Plus” in UI copy
- Journey intro: “Ember Plus features”
- Uploaded + mapped `ember_pricing_journey_seasons_christmas_v2_category.png` (HEAD 200)

## 2026-07-14 — feat(pricing): map custom journey images (HEAD 200)

- Wired 5 Make uploads into `pricingImages.ts` (Free, Patch, Seasons, Chapters, Pass-On)
- Pathway + Picks unchanged (stacking cups / first puzzles)
- Storage verified HEAD 200 for each `ember_pricing_journey_*_category.png`

## 2026-07-14 — fix(pricing): Find it + shortlist + Make journey art input

- Copy: Find it (not Buy it); shortlist; pocket play coach; Pass-On “right local family”; drop “Cups back out”; six exclusive features line
- Make input (5 images, keep Pathway/Picks): `agent-tools/exports/ABI_Image_Creation_Template_pricing_journey_INPUT.csv`

## 2026-07-14 — feat(pricing): feature rename — Patch Finds / Chapters / Pass-On

- Proximity → Pip’s Patch Finds; Moments → Pip’s Chapters; Move-On → Pip’s Pass-On
- PMF Draft v2.3 naming confirmed

## 2026-07-14 — fix(pricing): stacking cups + Proximity “scouting” wording

- Pathway spike: “stacking cups and pouring” (nesting wasn’t clear)
- Proximity: “Pip has been scouting for local walkers…” (watching local baby = creepy)

## 2026-07-14 — fix(pricing): plain language, spike formatting, Marketplace links

- Ban forever / stage / research-backed on `/pricing` + PMF v2.2
- Journey cards: split lines + bold/underline personalised spikes; drop “Catalogue example”
- Picks: child-specific animal-play notice (no “spark up”)
- Hyperlink Marketplace everywhere it appears

## 2026-07-14 — fix(pricing): Meet Pip before plans, slim hero

- Order: short hero → Meet Pip → Free/Plus → journey → FAQ
- Dropped unexplained hero Pip badge + long Plus paragraph (Meet Pip owns that story)
- Compact Meet Pip profile so price cards still peek on mobile

## 2026-07-14 — feat(pricing): founder V3 human voice + PMF 2.1

- Live `/pricing` copy replaced with founder dad edit (post–real-mum AI-language feedback)
- PMF → Draft v2.1: ban AI red flags; optimistic pain framing; Ember/Pip proactive voice
- Conor rule: pointer to marketing AI red flags
- Light overlays of founder learnings on leftover negatives (“feel behind”, “stage ideas”, spirals)

## 2026-07-14 — fix(pricing): card hierarchy, Picks retailers, hero/path copy

- Concept cards lead with ~20-word explainer; sample titles demoted
- Picks mini-list: Argos / Amazon / Ergobaby dummies
- Mobile hint: “Swipe to discover each feature”; journey subcopy + hero + “Ember Plus adds your assistant Pip”

## 2026-07-14 — fix(pricing): mobile horizontal journey + Ember Plus hero

- Mobile journey: horizontal snap carousel (one feature + one card); desktop keeps vertical Pip track
- Hero: “Ember Plus puts / Pip on the path with you.”

## 2026-07-14 — fix(pricing): mobile UX feedback on PMF v2 page

- Hero: Pip logo above the fold so “puts Pip on the path” has a face
- Journey: concept card first + sticky on mobile; shorter card image; drop per-node robin marks
- Free card: no redundant £0; Meet Pip title enlarged as the section headline

## 2026-07-14 — feat(pricing): PMF 2.0 page replace (live `/pricing`)

- Replaces live `/pricing` copy with Product Marketing Library v2.0: Free = good / Plus = great
- Naming: Pathway, Picks, Proximity, Seasons, Moments, Move-On, Smart Marketplace
- Journey adds Seasons + Moments stops; Picks/Seasons/Moments use varied card formats (mini-list / pills)
- Ships draft `web/docs/PRODUCT_MARKETING_LIBRARY.md` alongside

## 2026-07-14 — docs(pricing): Pricing Page v2 HTML from PMF 2.0

- Static branded HTML for founder copy edit (preceded live port)
- Grounded in `PRODUCT_MARKETING_LIBRARY.md` Draft v2.0
- Journey: Gemini linear UI + PMF copy + Stage 2 `category_images`
- Files: `agent-tools/exports/ember_pricing_v2_pmf.html` · Google Drive `Ember_Pricing_v2.html`

## 2026-07-13 — feat(pricing): haircut — lean SaaS structure

- Page reduced to: hero → plans → Meet Pip → journey → short FAQ
- Removed trust grid, final CTA, hero Pip badge, journey Seasons/Moments stops, and FAQ bloat
- Meet Pip kept as compact profile; journey kept as the single Plus differentiator

## 2026-07-13 — feat(pricing): Meet Pip clarity + Ember journey art

- Meet Pip section names the logo as Plus guide; journey cards use Stage 2 `category_images` + “Pip spotted this” chips
- Explore the catalogue card links to `/discover`; hero price is £3.99/month (no “from”)
- Journey + FAQ copy rewritten for Conor tone

## 2026-07-13 — feat(pricing): Pip journey explainer + brand refresh

- `/pricing` uses marketing container, canvas `#FBFAF7`, Manrope via `homepage-discover-brand`, accent `#FF5C34` with white CTA text
- Hero introduces Pip as Plus guide; plan cards use Pip Trail / Picks language (no banned "unlock")
- After **Know it. Buy it. Move it on.**, replaced interactive comparison with `PipJourneyExplainer` (Gemini HTML port)
- FAQ + trust + final CTA updated for Pip; affiliate links to `/how-ember-makes-money` and `/affiliate-disclosure`

**Verify:** open `/pricing` — Pip logo in hero; journey auto-advances; Free/Plus cards; Start free → sign-in or Discover

- **Hero image:** `ember_cat_copy_me_games_category.png` (white family; single hero use)

## 2026-07-13 — fix(marketing): white text on orange homepage CTAs

- Removed blanket `a { color: inherit }` that overrode Tailwind `text-white`
- `.home-cta` locked to `#ffffff` on orange buttons

## 2026-07-13 — fix(marketing): homepage fonts locked to Discover Manrope

- **Source of truth:** Discover body = Manrope 16/17px `#66717D` (`DiscoverFigmaChildHero`)
- **Conflict found:** ThemeProvider defaults still inject Inter (body) + Source Serif 4 (headings)
- Homepage now forces `--brand-font-*` + every `.home-*` class to Discover Manrope; body metrics match Discover

### How to verify
1. Preview `/` vs `/discover/26` — body copy should be the same Manrope face
2. "How Ember Works." and other section titles — Manrope, not serif

## 2026-07-13 — fix(marketing): full-viewport hero (Apple-style first impression)

- Hero `min-h` fills viewport below sticky nav so age slider sits below the fold
- Display ~48–88px; image up to ~620px tall; larger CTAs + lead

### How to verify
1. Preview `/` on desktop — first screen is brand + hero only
2. Scroll once to reach "My child's current age"

## 2026-07-13 — fix(marketing): homepage image diversity, hero scale, nav alignment

- **Images:** five distinct families/scenes — dropped recurring orange-sweater catalogue model
- **Hero:** display ~44–68px semibold (SaaS opening impact, still not bold)
- **Layout:** shared `max-w-7xl` marketing container; nav widens on `/` + `/pricing`; removed redundant `ContentSpacer`

### How to verify
1. Preview `/` — no repeat orange-sweater parent; logo aligns with hero text edges
2. Hero headline reads larger than section titles
3. No double gap under sticky nav

## 2026-07-13 — fix(marketing): softer homepage type scale + stages image swap

- **Type:** shared `.home-*` scale — semibold/medium headings (not bold), body 16–18px like Discover
- **Stages image:** `ember_cat_real_object_baskets_category.png` (replaces old soft-balls art)
- **Rhythm:** slightly tighter section padding + lighter image shadows

### How to verify
1. Preview `/` — headings feel lighter; body reads at ~17px not 24px+
2. "Parenting moves in stages" block shows real-object basket art

## 2026-07-13 — fix(marketing): homepage typography, crop, no em dashes

- Hero/body: regular weight (Discover body pattern); headings stay Manrope bold
- CTAs: `font-medium` / normal only (never bold)
- Media: edge-to-edge `object-cover` + live `rounded-3xl` shadow (no padded card frame)
- Em dashes removed from homepage copy + site title

### How to verify
1. Preview `/` vs live: hero image fills the frame edge-to-edge
2. Subtext and CTAs are not bold
3. No "—" in hero line

## 2026-07-13 — feat(marketing): homepage Discover brand + Stage 2 Storage images

- **Brand:** `.homepage-discover-brand` remaps tokens to Discover Figma (`#253044`, `#FF5C34`, `#FBFAF7`, `#E7E2DC`); Manrope headings (no Source Serif)
- **Imagery:** Unsplash / local webp replaced with `category_images` Stage 2 PNGs (`homeStage2Images.ts` + `HomeStage2Media`)
- **PR:** continues #254

### How to verify
1. Open `/` — headings look like Discover (Manrope bold); accent is `#FF5C34`
2. Hero + stage blocks + final CTA show Stage 2 product art (not stock photos)
3. Compare side-by-side with `/discover/14`

## 2026-07-12 — feat(marketing): homepage calls out 600+ Stage 2 ideas

- **Hero:** “over 600 free ideas for what they’re practising next”
- **Also:** How it works (Know it), How it shows up (Discover), final CTA, root meta description
- **Tone:** catalogue depth without “science-backed” / catalogue-speak

### How to verify
1. Open `/` — hero subhead mentions over 600 free ideas
2. Scroll to How Ember Works / How it shows up — same signal, lightly
3. View page source meta description includes “Over 600 free ideas…”

## 2026-07-02 — feat(data): map 31–33m Stage 2 category images (60/60)

- **Preflight:** HEAD 200 on all 60 slugs in `category_images` — global filenames `ember_{slug}_category.png` (no age-scoped `*_31_33m_*` variants uploaded)
- **Manifest:** `agent-tools/exports/31-33m_category_image_verified_map.json`
- **Migration:** `20260702222945_fix_31_33m_category_images_verified.sql` — applied via `supabase db push`
- **Result:** 60 active rows in `v_gateway_category_type_images` for `age_band_id=31-33m`; export gap count **0**

### How to verify
1. `node web/scripts/export-stage2-no-image-band.mjs 31-33m` → `missing_managed_image: 0`
2. REST `v_gateway_category_type_images?age_band_id=eq.31-33m` → 60 rows, all `image_url` HEAD 200
3. `/discover/32` → drill into any Stage 1 cluster → Stage 2 cards show images (not grey placeholders)

## 2026-07-02 — fix(discover): mutually exclusive bands, Have-it toggle, name/gender copy

- **Age bands:** migration `20260702230000_mutually_exclusive_age_band_ranges.sql` — `6-9m` → **7–9**, `9-12m` → **10–12** (no month overlap); hero keys `7-9` / `10-12`
- **Have it:** light-switch UX — content greys out, action row stays interactive; no optimistic flip before auth; persist per child; reload only on user/child change
- **Personalisation:** `personalizeDiscoverCopy()` — name swaps (`your baby`/`your toddler` → child name) + gender (`them`/`their` → him/her) on hero, Stage 1 why-text, Stage 2 rationale/notes
- **Cache:** `GATEWAY_CATALOGUE_CACHE_VERSION = 20260702c`

### How to verify
1. Slider shows **7–9 months** and **10–12 months**; hero sub matches chip exactly
2. `/discover/8` → Things that can help → tap Have → card greys, stays grey on refresh; tap again to restore
3. Child with name + gender → hero/why-text uses name and him/her not them
4. `pnpm -C web build` passes

## 2026-07-02 — fix(discover): audit — icons, notes, Have-it layout, hero bands

- **Stage 1 icons:** slug + label patterns for 4–6m, 16–18m, 19–21m, 25–27m, 31–33m; `ent_cluster_solve` → Eye (hidden things)
- **Gift mode notes:** `ownership_note` hidden in gift toggle; `gift_note` only via `resolveStage2HelperNote`
- **Parent notes:** client filter (`cardNotes.ts`) + migration `20260702220000_prune_redundant_ownership_notes.sql` — prunes well-duh borrow/reuse copy
- **Have it mobile:** two-row card actions — CTA row, then Save / Have / Gift icons; dim/hide state unchanged
- **Age band hero:** removed legacy `PILOT_AGE_BAND_RANGE_BY_ID` overrides; hero sub uses slider `min–max` from gateway (fixes 10–12 showing 9–12)
- **Cache:** `GATEWAY_CATALOGUE_CACHE_VERSION = 20260702b`

### How to verify
1. `/discover/5` gift toggle → product cards show gift notes only, no “borrow or reuse…”
2. `/discover/10` hero sub starts “At 9–12 months” (matches slider chip)
3. `/discover/8` parent → Things that can help → mobile: Ember Picks on row 1, Save+Have+Gift on row 2
4. Stage 1 icons spot-check 4–6m floor gym (Activity), 9–12m hidden things (Eye)
5. `pnpm -C web build` passes

## 2026-07-01 — feat(discover): 31–33m Conor+Thea depth v2

- **Source:** `02_Ember_Bible_31_33m_Conor_Thea_Depth_v2.xlsx` (`discover_projection`) — replaces legacy ABI v8 child-voice band
- **Migrations:** `20260701180000_reimport_discover_31_33m_conor_thea_depth_v2.sql` + `20260701180100_fix_31_33m_wrapper_needs.sql`; applied via `supabase db push`
- **Counts:** 60 workbook rows → **60** junction rows, **8** Stage 1 clusters, **35** `gift_friendly` product rows, Stage 3 active = 0; **0** slug dedupes
- **Wiring:** One `ent_need_31_33_*` per cluster in `v_gateway_age_band_wrapper_needs_public`
- **Cache:** `GATEWAY_CATALOGUE_CACHE_VERSION = 20260701e`

### How to verify
1. `/discover/32` → **I'm the parent** — 8 child-voice Stage 1 cards; three lanes on Stage 2
2. `/discover/32` → **Buying a gift** — gift carousels on all 8 clusters
3. `/discover/32?wrapper=ent_cluster_hands_make_more&show=1` → **Twist, turn and peg puzzles**
4. REST `v_gateway_category_types_public?age_band_id=eq.31-33m` → 60 rows, 35 with `gift_friendly=true`

## 2026-07-01 — feat(discover): 1–3m Conor+Thea depth v2 (more purchase depth)

- **Source:** `02_Ember_Bible_1_3m_Conor_Thea_Depth_v2_more_purchase_depth.xlsx` (`discover_projection`) — replaces v1 workbook
- **Migration:** `20260701140000_reimport_discover_1_3m_conor_thea_depth_v2.sql` — **55** workbook rows → **53** junction rows (10 clusters), **26** `gift_friendly` product rows (was 16 in v1); Stage 3 active = 0; applied via `supabase db push`
- **Depth:** More `things_that_can_help` product cards with ownership / buy-borrow copy across child clusters
- **Snag (unchanged from v1):** `cat_high_contrast_cards` under **I'm finding your face** maps `ent_need_visual_tracking` — won't surface on faces carousel; 2 slug collisions deduped (`cat_board_books`, `cat_high_contrast_cards`)

### How to verify
1. `/discover/2` → **I'm the parent** — 10 Stage 1 cards; heavier product lane vs v1
2. `/discover/2` → **Buying a gift** — gift carousels populated on child clusters
3. REST `v_gateway_category_types_public?age_band_id=eq.1-3m` → 53 rows, 26 with `gift_friendly=true`
4. `pnpm -C web build` passes

## 2026-07-01 — feat(discover): 1–3m Conor+Thea depth v1 catalogue rebuild

- **Source:** `02_Ember_Bible_1_3m_Conor_Thea_Depth_v1.xlsx` (`discover_projection`)
- **Migration:** `20260701120000_reimport_discover_1_3m_conor_thea_depth_v1.sql` — 45 workbook rows → **43** junction rows (10 clusters), **16** `gift_friendly` product rows; Stage 3 active = 0
- **Generator fix:** `scripts/generate-discover-projection-sql.mjs` — `DISTINCT ON (age_band_id, development_need_id, category_type_id)` when shared slugs appear under multiple clusters with the same need (2 collisions: `cat_board_books`, `cat_high_contrast_cards`)
- **Gift toggle:** enabled — 6 child clusters with gift depth; parent-only clusters (settling, feeding kit, sleep, health trips) hidden in gift mode
- **Workbook snag (founder):** `cat_high_contrast_cards` row under **I'm finding your face** uses `ent_need_visual_tracking`, but that cluster only resolves `ent_need_face_smile_chat` in `v_gateway_age_band_wrapper_needs_public` — the card will not appear on the faces carousel (watching/listen clusters still show it). Faces-specific labels for the two deduped slugs collapse to listen/watching versions.

### How to verify
1. `/discover/2` → **I'm the parent** — 10 Stage 1 cards; Stage 2 lanes (`Useful ideas` / `Things that can help` / `Quick checks`)
2. `/discover/2` → **Buying a gift** — 6 development cards with populated carousels (no empty gift grids)
3. REST `v_gateway_category_types_public?age_band_id=eq.1-3m` → 43 rows, 16 with `gift_friendly=true`
4. REST `v_gateway_wrappers_public?age_band_id=eq.1-3m` → 10 clusters with child-voice labels
5. `pnpm -C web build` passes

## 2026-07-01 — chore(rules): Conor-grade catalogue upload workflow

- **Rule:** `.cursor/rules/conor-grade-catalogue-upload.mdc` — ingest + verify + **always open PR** with green Vercel preview (founder should not need to ask).

### How to verify
1. Say "Upload this Conor-grade catalogue" — agent follows full pipeline including PR handoff.
2. Rule visible in Cursor Rules as always-applied.

## 2026-07-01 — fix(discover): hero layout + navbar Manrope typography

- **Typography:** Hero `h1` and navbar both use Manrope (`--font-sans` / `font-sans`) — fixes serif/sans mismatch from brandbook `h1` rule.
- **Hero layout (desktop):** Parent/gift toggle on same row as age chip, right-aligned above hero image.
- **Hero layout (desktop):** Image height stretches to match description + age slider block (grid row symmetry).
- **Add-child:** Figma shell styling (warm `#FBFAF7`, Manrope, orange icons); form left / marketing right on desktop; edit saves return to `/family?saved=1&child=…`.
- **Discover toggle:** Removed auto-scroll to developments section on parent/gift switch (toggle is now at top).
- **Files:** `globals.css`, `layout.tsx`, `navStyles.ts`, `DiscoverFigmaChildHero.tsx`, `DiscoverAudienceToggle.tsx`, `DiscoveryPageClient.tsx`, `AddChildForm.tsx`, card components.

### How to verify
1. `/discover/14` desktop — single top row: compact age chip left, parent/gift pills right; image height matches title + copy + slider.
2. Navbar "Ember" wordmark uses pre-change brand font (not forced `font-sans`).
3. `/add-children` desktop — hero + full form (incl. consent + submit) above the fold; no duplicate "Add a child" header row.

## 2026-07-01 — fix(typography): navbar matches discover hero Manrope

- **Issue:** Hero headline (`h1`) used brandbook serif via global `h1` rule; navbar used Manrope via `discoverManrope.className` — visually mismatched.
- **Fix:** Figma app shell (`ember-figma-app`) forces `h1`/`h2` and nav links to `var(--font-sans)` (Manrope); hero `h1` gets explicit `font-sans`; `ember-figma-app` on `<html>` for SSR.

### How to verify
1. Open `/discover/14` — inspect navbar links and “What your child’s practising now” headline: both should be Manrope (not Source Serif).
2. DevTools → Computed → `font-family` on both elements should match.

## 2026-06-30 — perf(discover): Phase 2 client navigation and ISR shell

- **Client nav:** `discoverClientNav.ts` — wrapper/show/category URL updates via `history.pushState` (no RSC refetch on Stage 1/2 taps)
- **Picks:** Ember Picks loaded client-side from `/api/discover/picks` when opening examples
- **API:** `/api/discover/category-types` — CDN-cached Stage 2 fallback
- **Entry:** `/discover` server `redirect()` + resume cookie mirror (drops client double-hop spinner)
- **ISR:** `/discover/[months]` `revalidate=1800`; query params handled client-side only
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/14` — tap Stage 1 cards rapidly: no full page reload between wrappers (Network: no new document requests)
2. Tap Ember Picks on a product row — examples load without document navigation
3. `/discover` — instant server redirect (no "Loading discover…" flash)
4. Return to `/discover` after browsing — resumes last section via cookie
5. `pnpm -C web build` passes

## 2026-06-30 — perf(discover): Phase 1 server catalogue speed

- **Public client:** `createPublicCatalogueClient()` — cookieless Supabase for gateway reads; safe inside `unstable_cache` (fixes May redirect-loop constraint)
- **Batch fetch:** `getGatewayCategoryTypesByWrapperForAgeBand` — one mapping + one category + one image query per age band (was N×wrapper sequential loops)
- **Cache wired:** `/discover/[months]` uses `gateway-cache` for bands, wrappers, categories, products, picks, hero
- **SSR images:** deterministic Storage URLs via `applyDeterministicStorageCategoryImages` — no blocking HEAD probes
- **Client:** `categoriesByWrapper` preloaded on page — wrapper tap shows Stage 2 cards instantly from props (no skeleton wait for server round-trip)
- **Also:** `/discover` + `/api/discover/age-bands` use cached age bands
- **Build:** `pnpm -C web build` pass

### How to verify
1. DevTools → Network → `/discover/14` document TTFB: should drop sharply vs before (especially on 2nd load within 30m)
2. `/discover/14` → tap any Stage 1 card → Stage 2 carousel appears immediately (no multi-second skeleton)
3. `/discover` → single redirect to band page; no redirect loop
4. Signed-in `?child=` — hero still personalises
5. `pnpm -C web build` passes

## 2026-06-30 — feat(discover): 13–15m Thea depth v5 catalogue rebuild

- **Source:** `02_Ember_Bible_13_15m_Thea_Depth_v5.xlsx` (`discover_projection`)
- **Why:** v4 gift depth too thin for Thea; v5 adds tangible gift rows across six child clusters
- **Migration:** `20260630140000_reimport_discover_13_15m_thea_depth_v5.sql` — 74 rows, 10 clusters, 30 `gift_friendly` product rows (was 58 / 14 in v4); Stage 3 active = 0
- **Gift clusters visible in Buying a gift mode:** working things out, telling you things, copying your day, braver on feet, first marks, joining in (meals / safety / parent-only clusters still hidden)
- **Applied:** `supabase db push` OK
- **Follow-up:** `20260630150000_fix_13_15m_cluster_why_text.sql` restores full Stage 1 why-text (v5 workbook cells were truncated at ~80 chars)

### How to verify
1. `/discover/14` → **Buying a gift** → six development cards (not empty carousels on any visible card)
2. Pick e.g. “I'm working things out” → multiple gift-friendly rows in carousel
3. “I'm taking charge at meals” still hidden in gift mode (no gift rows by design)
4. **I'm the parent** → full 74-row lane split (`Useful ideas` / `Things that can help` / `Quick checks`)
5. REST `v_gateway_category_types_public?age_band_id=eq.13-15m` → 74 rows, 30 with `gift_friendly=true`

## 2026-06-30 — feat(discover): 13–15m Conor+Thea v4 rebuild (lane UI + gift mode)

- **Source:** `02_Ember_Bible_13_15m_Conor_Thea_v4.xlsx` (`discover_projection`)
- **Data model:** Added Stage 2 lane/action metadata on junction (`content_type`, `ui_lane`, `show_ember_picks`, `show_gift_action`, `gift_friendly`, `buyer_mode_label`, `gift_note`, `ownership_note`, `product_family_label`, `card_cta_label`, `render_rule`)
- **Migrations:** `20260630103000_discover_stage2_ui_lanes.sql`; `20260630110000_reimport_discover_13_15m_conor_thea_v4.sql` (58 rows, 10 clusters; Stage 3 active = 0)
- **UI:** Stage 2 split into `Useful ideas`, `Things that can help`, and `Quick checks`; early **Who is this for?** toggle (`I'm the parent` / `Buying a gift`) above Stage 1 grid
- **Thea fix:** In gift mode, Stage 1 cards with zero `gift_friendly` rows are hidden (e.g. “I'm taking charge at meals” on 13–15m); no empty gift carousels
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/14` → choose a development, then confirm separate `Useful ideas`, `Things that can help`, `Quick checks` sections (no mixed carousel)
2. `Useful ideas` and `Quick checks` do not show Ember Picks CTA
3. `Things that can help` shows Ember Picks only on rows flagged for it
4. Toggle **Buying a gift** above the development grid → only clusters with gift rows appear; “I'm taking charge at meals” is hidden
5. Select a gift cluster → gift carousel only (no empty “No gift-friendly rows” state)
6. REST `v_gateway_category_types_public?age_band_id=eq.13-15m` shows lane/gift fields populated

## 2026-06-30 — feat(discover): Conor-grade 13–15m content overhaul

- **Source:** `02_Ember_Bible_13-15M_Ember_ABI_Conor_Grade_v3.xlsx` (`discover_projection` + `age_band_meta`)
- **Migration:** `20260630120000_import_discover_13_15m_conor_grade.sql` — 50 rows, **10 clusters** (was 8/40); new Conor-grade Stage 1 voice + Stage 2 ideas with buy/borrow/bring-back-out in rationale
- **Hero:** `discoverHeroCopy.ts` updated from workbook `hero_summary`
- **Icons:** 10 new cluster slugs mapped in `wrapperIcons.tsx`
- **Applied:** `supabase db push` — validation notices pass; Stage 3 active = 0
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/14` — 10 Stage 1 clusters (e.g. "I'm working things out"); hero mentions purposeful experiments
2. `/discover/14?wrapper=ent_cluster_working_things_out&show=1` — Stage 2 cards match workbook; expanded card shows buy/borrow copy
3. REST `v_gateway_wrappers_public?age_band_id=eq.13-15m` — 10 rows
4. REST `v_gateway_category_types_public?age_band_id=eq.13-15m` — 50 rows

## 2026-06-30 — fix(pwa): open to Discover instead of /app placeholder

- **Root cause:** PWA `manifest.ts` had `start_url: '/app'`, and `/app` was a dev placeholder (“Signed in as …email…”).
- **Fix:** `start_url` → `/discover`; `/app` now server-redirects to `/discover` (covers existing installed PWAs still bookmarked at `/app`).

### How to verify
1. Open `/app` in browser — should redirect to `/discover` (or age-band child route).
2. Reinstall PWA (or clear site data) and launch from home screen — lands on Discover, not email page.
3. `/app/marketplace`, `/app/messages`, etc. still work unchanged.

## 2026-06-30 — fix(discover): carousel loading hang on wrapper select

- **Branch:** `fix/discover-carousel-loading-hang`
- **Root cause:** (1) `ideasSectionLoading` treated synced empty `categoryTypes` as still loading → infinite skeleton; (2) gateway resolved one global `development_need_id` per wrapper slug, so 13–15m clusters like `ent_cluster_words` queried 9–12m needs and returned zero categories.
- **Fix:** Loading skeleton only while client/server wrapper slug mismatch; age-band wrapper→need view resolves `development_need_id` via anchored category slugs; gateway fetches categories for all mapped needs per band.
- **Migrations:** `20260630053819_fix_age_band_wrapper_needs_mapping.sql`, `20260630054526_fix_age_band_wrapper_needs_via_category.sql` (applied via `supabase db push`).

### How to verify
1. `/discover/14` → tap **I'm telling you things** — carousel shows 5 ideas (not loading skeleton)
2. Repeat for **I'm off and moving**, **I'm posting, stacking and finding out**
3. Direct URL `/discover/14?wrapper=ent_cluster_words` — Board books and Picture cards visible

## 2026-06-29 — fix(discover): faster category image delivery

- **Branch:** `fix/discover-image-delivery`
- **Images:** Supabase Storage render URLs (WebP, width-capped) — ~37 KB vs ~1.5 MB PNG origin
- **UX:** Per-wrapper play-idea cache, loading skeleton (no stale images on toggle), route + image prefetch on card hover
- **Server:** Gateway cached queries on discover month page — **reverted** (`unstable_cache` + `cookies()` broke age-band load → redirect loop)
- **Carousel:** Eager load for first two visible slides
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/2` — tap “I'm watching the world”; skeleton then images (not wrong wrapper's cards)
2. Toggle development cards — revisit prior card shows images instantly from cache
3. DevTools Network — category images ~30–40 KB WebP, not 1.5 MB PNG
4. Hover a development card before tap — route prefetched

## 2026-06-29 — fix(discover): perceived performance and image loading

- **Branch:** `fix/discover-perceived-performance` — PR [#238](https://github.com/glownest2026-droid/ember/pull/238)
- **Scope:** `/discover`, `/discover/[months]` — recommendation card tap scroll + card images only
- **Interaction:** Scroll no longer waits for server `categoryTypes`; instant `behavior: 'auto'` on tap; immediate NeedCard press feedback
- **Images:** `DiscoverFigmaImage` upgraded to `next/image` with `sizes`, lazy load, reserved aspect-ratio placeholders, hero `priority`
- **Build:** `pnpm -C web build` pass
- **Browser smoke:** Playwright desktop + iPhone 13 — tap→scroll movement 100–213ms, settled &lt;400ms, routes stable, no console errors, no oversized card images on mobile

### How to verify
1. `/discover/26` — tap 3 development cards; scroll begins within ~150ms; no long smooth-scroll pause
2. `/discover/32` — play-idea card images fade in over reserved space (no strip loading)
3. `/discover` — client redirect to age band; no redirect loop
4. `pnpm -C web build` passes

## 2026-06-28 — fix(snag-pack): restore Discover 7–9 months age band

- **Branch:** `fix/snag-pack-discover-7-9m-band` — PR [#235](https://github.com/glownest2026-droid/ember/pull/235)
- **Root cause:** Spine v2 deprecate migration deactivated `6-9m` (label 7–9 months) with no import; the 7–9M workbook existed on G Drive as `02_Ember_Bible_Pilot_6_9m_discover_projection_voice_v1.xlsx` (misnamed 6-9m).
- **Fix:** `20260628182042_restore_discover_7_9m_age_band.sql` (reactivate band); `20260628203000_import_discover_6_9m_spine_v2.sql` (42 rows, 8 clusters from workbook; id `6-9m`, label **7–9 months**, min 7 max 9).
- **Applied:** `supabase db push` — validation notices pass.
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/8` — slider shows **7–9 months**; Stage 1 includes "Things can hide and come back" (Spine v2 voice).
2. Stage 2 first card on sitting cluster: **A safe floor-play mat** with updated rationale copy.
3. REST `v_gateway_age_bands_public?id=eq.6-9m` — label `7–9 months`, min 7 max 9.
4. No console errors desktop + mobile.

## 2026-06-28 — feat(catalogue): Spine v2 slug cleanup + unified re-import (mega-PR)

- **Branch:** `feat/catalogue-spine-v2-cleanup` — PR [#234](https://github.com/glownest2026-droid/ember/pull/234)
- **Source of truth:** 5 G Drive Spine 2.0 workbooks (`1-3M`, `4-6M`, `10-12M`, `13-15M`, `16-18M`)
- **Crosswalk:** `agent-tools/exports/category_slug_crosswalk.csv` — 161 source slugs → 145 canonical `cat_*`
- **Workbooks:** Patched `discover_projection.category_entity_id` on G Drive (97 cells across 10-12M, 13-15M, 16-18M); backups in `agent-tools/backups/spine-v2-workbooks-pre-slug-cleanup/`
- **Migrations:** `20260628180000_catalogue_spine_v2_deprecate_merge.sql` (6 deprecated bands + 95 slug merges); `20260628190000_reimport_discover_spine_v2_all_bands.sql` (197 rows, 5 bands)
- **Deprecated bands:** `6-9m`, `22-24m`, `25-27m`, `28-30m`, `31-33m`, `34-36m` — deactivated, label suffixed `[deprecated — pre-Spine 2.0]`
- **Distinct slug preserved:** `cat_bedtime_board_books` (not merged into `cat_board_books`)
- **Applied:** `supabase db push` — validation notices pass; zero `ent_cat_*` on 9-12m gateway
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/10?wrapper=ent_cluster_move&show=1` — Stage 2 uses `cat_*` slugs; e.g. "Posting boxes and hiding lids" on `cat_posting_boxes`
2. REST `v_gateway_age_bands_public` — no deprecated bands (6-9m, 34-36m absent)
3. REST `v_gateway_category_types_public?age_band_id=eq.9-12m` — 48 rows, all `cat_*` slugs
4. Open crosswalk CSV — `cat_bedtime_board_books` distinct from `cat_board_books`
5. G Drive workbooks — `category_entity_id` columns use canonical `cat_*` (no `ent_cat_*`, no `cat_13_15_*`)

## 2026-06-28 — fix(snag-pack): discover age-band hero copy

- **Branch:** `fix/snag-pack-discover-hero-copy`
- **PR:** https://github.com/glownest2026-droid/ember/pull/232
- **Preview:** https://ember-git-fix-snag-pack-discover-655092-tims-projects-cd69a894.vercel.app
- **Snags:** Per-band hero headline + body on Discover for 1–3m, 4–6m, 7–9m, 10–12m, 13–15m (13–15m uses "young one" headline); pilot band slider labels corrected 6–9→7–9 and 9–12→10–12
- **Migration:** `20260628120000_fix_pilot_age_band_ranges_7_9_10_12.sql` (applied via `supabase db push`)
- **Build:** `pnpm -C web build` pass

### How to verify
1. Preview `/discover/2` — headline "What your baby's practising now"; body mentions turning towards faces.
2. `/discover/5` — reaching with purpose / first tastes copy.
3. `/discover/8` — sitting steadier / finger foods copy.
4. `/discover/10` — 9–12 months busy/brave copy (band label still 10–12 months).
5. `/discover/14` — "What your young one's practising now" + toddler steadier-on-feet copy.
6. Slide age slider — hero updates per band; no console errors desktop + mobile.

## 2026-06-27 — fix(snag-pack): discover UX polish (7 snags)

- **Branch:** `fix/snag-pack-discover-ux`
- **PR:** https://github.com/glownest2026-droid/ember/pull/231
- **Preview:** https://ember-git-fix-snag-pack-discover-ux-tims-projects-cd69a894.vercel.app
- **Snags:** 1-3m Lucide icons; Stage 2 Have toggle (grey/browse); save modal child name + “View X’s List”; remove science Read more; expandable Stage 2 cards; discover session resume via sessionStorage; My List widget mobile bleed
- **Build:** `pnpm -C web build` pass

### How to verify
1. `/discover/2` — Stage 1 tiles show distinct icons (Smile, Mic, Eye, … not generic Shapes).
2. Stage 2 Have button greys/restores card; save modal uses child name; expand icon opens fullscreen card.
3. Discover → deep section → Saves → Discover tab resumes same wrapper.
4. `/my-ideas` on mobile — sidebar widgets edge-to-edge.

## 2026-06-27 - feat(discover): v2 display_label, age-scoped images, deterministic storage lookup

- **Branch:** `feat/discover-v2-display-label-age-images`
- **Migration:** `20260627120000_discover_v2_display_label_age_images.sql` (applied via `supabase db push`)
- **Schema:** `pl_age_band_development_need_category_types.display_label`; `pl_category_type_images.age_band_id`; updated `v_gateway_category_types_public` (COALESCE display label) and `v_gateway_category_type_images` (exposes age_band_id)
- **Backfill:** 246 junction `display_label` rows from import migrations; fixes cross-band title bleed (e.g. soft balls now band-specific)
- **Slug fix:** `ent_cat_soft_balls` → `cat_soft_graspable_balls` on 9-12m
- **App:** `getGatewayCategoryTypeImages(ids, ageBandId)` band-aware; replaced v2 fuzzy `categoryImageOverrides` with deterministic Storage HEAD probe (`ember_{slug}_{band}_category.png` → global fallback)
- **Generator:** `generate-discover-projection-sql.mjs` v2 — `need_entity_ids`, junction `display_label`, no global label UPDATE, canonical name from slug
- **Tooling:** `scripts/generate-display-label-backfill.mjs`; import templates + column dictionary updated
- **Build:** `pnpm -C web build` pass
- **Not in scope:** 207 unmapped slugs still need PNG uploads; 38 stock-photo mappings unchanged; zero age-scoped Storage files yet (convention ready)

### How to verify
1. Query `v_gateway_category_types_public?slug=eq.cat_soft_graspable_balls` — labels differ by band
2. `/discover/5?wrapper=ent_cluster_4_6_floor_strength&show=1` — soft balls title = "Soft balls to watch, hold and roll"
3. Upload `ember_cat_soft_graspable_balls_4_6m_category.png` then confirm band-specific image resolves

## 2026-06-27 - docs(discover): ABI Spine v2 ingestion template + catalogue differentiation plan

- **Context:** Reviewed `4-6M Ember ABI.xlsx` `discover_projection` columns vs current gateway import; documented age-scoped presentation model for shared category slugs (e.g. `cat_soft_graspable_balls`).
- **Deliverable:** `supabase/import_templates/Leaf_Cursor_Template_ABI_Spine_Age_Band_Ingestion_v2.txt` + `Leaf_Cursor_Template_Category_Image_Mapping.txt`; G Drive image prompt upgraded. Slug rule: trust `category_entity_id` only.
- **Next engineering:** One-time schema migration + update `scripts/generate-discover-projection-sql.mjs` to v2 rules before next band import.

## 2026-06-16 - feat(discover): ingest pilot 4–6m + 16–18m discover_projection bands

- **Branch:** `feat/discover-4-6m-16-18m-pilot`
- **Goal:** Import `discover_projection` tabs from 4–6M and 16–18M Ember ABI workbooks (Downloads) into the existing Discover gateway path; Stage 1 clusters + Stage 2 categories only.
- **Ground-truth read path:** `web/src/app/discover/page.tsx`, `web/src/app/discover/[months]/page.tsx`, `web/src/lib/pl/public.ts` → curated views (`v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_category_types_public`).
- **Generator:** `scripts/generate-discover-projection-sql.mjs` with `--migration=20260616200000_import_discover_4_6m_16_18m_pilot`.
- **Migration:** `20260616200000_import_discover_4_6m_16_18m_pilot.sql` — 67 rows (34 + 33), 8 clusters per band; Stage 3 products = 0.
- **Overlap:** Month 6 resolves to `6-9m` (higher min_months tie-break); no competing placeholder bands for 4–6 or 16–18 ranges.
- **Validation (REST):** 8 wrappers + 34 categories on `4-6m`; 8 wrappers + 33 categories on `16-18m`; month resolver: 4–5→`4-6m`, 16–18→`16-18m`.
- **Build:** `pnpm -C web build` pass; migration applied via `supabase db push`.

### Rollback (scoped)
```sql
DELETE FROM pl_age_band_development_need_category_types WHERE age_band_id IN ('4-6m','16-18m');
DELETE FROM pl_age_band_ux_wrappers WHERE age_band_id IN ('4-6m','16-18m');
UPDATE pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('4-6m','16-18m');
```

## 2026-06-16 - feat(discover): re-import 1–3m from Ember Bible v3 voice rebuild

- **Branch:** `feat/discover-1-3m-13-15m-pilot` (PR #228)
- **Source:** `02_Ember_Bible_1_3m_v3_voice_rebuild.xlsx` → `discover_projection` tab only (replaces prior `1-3M Ember ABI.xlsx` import).
- **Migration:** `20260616190000_reimport_discover_1_3m_bible_v3.sql` — 42 rows, **10 clusters** (was 38 rows / 8 clusters).
- **New clusters:** `ent_cluster_listen_and_coo` (rank 2), `ent_cluster_kicks_wriggles` (rank 5); voice-rebuilt parent-friendly labels throughout.
- **13-15m:** unchanged from `20260616180000_reimport_discover_13_15m_bible_v2.sql`.
- **Validation:** 10 wrappers on `1-3m`; Stage 3 = 0.

## 2026-06-16 - feat(discover): re-import 13–15m from Ember Bible v2

- **Branch:** `feat/discover-1-3m-13-15m-pilot` (PR #228)
- **Source:** `02_Ember_Bible_13_15m_v2.xlsx` → `discover_projection` tab only (replaces prior `13-15M Ember ABI.xlsx` import).
- **Migration:** `20260616180000_reimport_discover_13_15m_bible_v2.sql` — 47 rows, **10 clusters** (was 40 rows / 8 clusters).
- **New clusters:** `ent_cluster_first_marks` (rank 6), `ent_cluster_joining_in` (rank 7); `ent_cluster_safety` label updated to "Keep curious hands safer"; ranks reordered.
- **1-3m:** unchanged from `20260616170000_import_discover_1_3m_13_15m_pilot.sql`.
- **Validation:** 10 wrappers + 47 category mappings on `13-15m`; Stage 3 = 0.

## 2026-06-16 - feat(discover): ingest pilot 1–3m + 13–15m discover_projection bands

- **Branch:** `feat/discover-1-3m-13-15m-pilot`
- **Goal:** Import `discover_projection` tabs from 1–3M and 13–15M Ember ABI workbooks (Downloads) into the existing Discover gateway path; Stage 1 clusters + Stage 2 categories only.
- **Ground-truth read path:** `web/src/app/discover/page.tsx`, `web/src/app/discover/[months]/page.tsx`, `web/src/lib/pl/public.ts` → curated views (`v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_category_types_public`).
- **Generator:** `scripts/generate-discover-projection-sql.mjs` — generic `age_N_Mm` → `N-Mm` mapping, dynamic per-band row/cluster validation, requires `--migration=` + workbook path(s).
- **Migration:** `20260616170000_import_discover_1_3m_13_15m_pilot.sql` — 78 rows (38 + 40), 8 clusters per band; Stage 3 products = 0.
- **Overlap:** No competing active placeholder bands for months 1–3 or 13–15 (verified via `pl_age_bands` query before import).
- **Note:** 13–15m reuses `ent_cluster_*` slugs shared with 9–12m; global `pl_ux_wrappers.ux_label` is per-slug (existing architecture).
- **Build:** `pnpm -C web install --frozen-lockfile` + `pnpm -C web build` pass; migration applied via `supabase db push`.

### Rollback (scoped)
```sql
DELETE FROM pl_age_band_development_need_category_types WHERE age_band_id IN ('1-3m','13-15m');
DELETE FROM pl_age_band_ux_wrappers WHERE age_band_id IN ('1-3m','13-15m');
UPDATE pl_age_band_category_type_products SET is_active = false WHERE age_band_id IN ('1-3m','13-15m');
```

## 2026-06-15 - feat(discover): re-ingest 6–9m + 9–12m brand voice copy

- **Branch:** `feat/discover-6-9m-9-12m-brand-voice`
- **Goal:** Re-import `discover_projection` from Brand Voice Update workbooks; slugs unchanged, all public-facing labels and rationale text revised.
- **Generator:** `scripts/generate-discover-projection-sql.mjs` now overwrites `pl_development_needs` and `pl_category_types` text on re-import (not fill-empty-only); supports `--migration=` flag.
- **Migration:** `20260615140000_reimport_discover_6_9m_9_12m_brand_voice.sql` — 90 rows (42 + 48), 8 clusters per band.
- **UI:** `wrapperIcons.tsx` label-pattern fallbacks for first-person cluster titles (e.g. "I can sit and reach").
- **Build:** `pnpm -C web build` pass; migration applied via `supabase db push`.

## 2026-06-15 - feat(discover): ingest pilot 6–9m + 9–12m discover_projection bands

- **Branch:** `feat/discover-6-9m-9-12m-pilot`
- **Goal:** Import `discover_projection` tabs from 6–9M and 9–12M Ember ABI workbooks into the existing Discover gateway path; wire parent-friendly cluster labels, long why-text, category labels, and `audience_lens` card styling in `/discover/[months]`.
- **Ground-truth read path:** `web/src/app/discover/page.tsx`, `web/src/app/discover/[months]/page.tsx`, `web/src/app/discover/[months]/DiscoveryPageClient.tsx`, `web/src/lib/pl/public.ts` → curated views (`v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_category_types_public`).
- **Ingestion:** `scripts/generate-discover-projection-sql.mjs` → migrations `20260615120000` (audience_lens schema + views), `20260615120100` (90-row import), `20260615120200` (overlap + lens fix), `20260615120300`/`20260615120400` (age-band visibility).
- **Import proof:** 42 rows (6–9m, 8 clusters) + 48 rows (9–12m, 8 clusters) = 90; Stage 3 products = 0.
- **UI:** `audienceLens.ts` token mapping for `for_your_child` / `for_you` / `for_both` on Stage 1 + Stage 2 cards.
- **Follow-up UX:** Restored full age-band slider taxonomy; grouped Stage 1 cards under “For them” / “For you” with higher-contrast lens colours; tightened Stage 2 vertical spacing for desktop viewport.
- **Build:** `pnpm -C web install --frozen-lockfile` + `pnpm -C web build` pass.


- **Branch:** `fix/auth-callback-redirect-loop` · PR follow-up to #223

### Root cause
- PR #223 used `normalizeAuthOrigin()` to force **any** emberplay host to `NEXT_PUBLIC_SITE_URL`.
- When that env was `https://emberplay.app` (apex) but Vercel serves **www**, the app redirected **www → apex** on `/auth/callback` while Vercel redirected **apex → www** → infinite loop.

### Fix
- Production auth origin is always `https://www.emberplay.app`.
- Server only redirects **apex → www** once (`shouldRedirectAuthToWww`); never www → apex.
- `pnpm -C web test:auth-callback` updated.

## 2026-05-31 - PR10 Patch: Potty Development Mapping Fix

- **Branch:** `fix/marketplace-potty-toileting-mapping`

### Summary
- Fixed obvious potty-training listing not appearing under “I’m getting ready for potty”.
- Added `potty_training_seat` marketplace item type with aliases and toileting mapping (seed + SQL).
- Added conservative `resolveObviousItemTypeSlugFromListingText` for buyer-side title fallback.
- Fixed catalog default ages being treated as AI estimates (`browse_with_caution`), which blocked `recommended` counts.
- Added `development-match-diagnostic.ts` for explainable non-match reasons in tests.
- PR10 smoke tests for potty resolver, catalog eligibility, and toileting seed.
- UI: “Local opportunities by development area” (was “Local toys…”).

### Root cause
- No `potty_training_seat` in controlled taxonomy → title “Pink Potty Training Seat…” resolved to **zero** development wrappers.
- Nearby beta listings list is unfiltered by development; development cards require wrapper + `recommended` eligibility.
- Separately, when item types did match via catalog defaults, `enrichListingForBuyerMatch` passed defaults through `ai_estimated_*` fields → `computeRecommendationEligibility` treated them as AI-only → `browse_with_caution` → not counted as opportunities.

### Verification
- Build: pass
- PR10 smoke: pass
- PR9 smoke: pass
- Potty listing appears under toileting: pass (code path; preview after deploy + optional SQL apply)
- Map/listing filter works: pass (existing client filter + buyer_match)
- Own listing exclusion still works: pass (`buyerUserId` skip unchanged)
- Safety/cautious copy: pass (“May support”, estimated stage copy)
- No exact location/privacy leak: pass (unchanged)

## 2026-05-31 - PR10 UX: Child banner, dev card grid, copy

- **Branch:** `feat/marketplace-development-opportunities` · commit `0f693e5f`

### Summary
- Subtitle: “Move items to nearby families who need them”.
- Development cards: `grid-cols-2` mobile, `lg:grid-cols-4` desktop (no horizontal scroll).
- `MarketplaceActiveChildBanner`: prominent “Browsing marketplace for {name}” widget.
- Removed duplicate watch-mode empty copy in results panel.
- Smoke updated; `pnpm -C web test:marketplace-pr10` passes.

## 2026-05-31 - fix(auth): canonical www OAuth callback (apex PKCE break)

- **Branch:** `fix/auth-canonical-www-callback`

### Summary
- Root cause: Vercel serves `www.emberplay.app` but Supabase OAuth often returned to `emberplay.app`; PKCE verifier and session cookies were host-scoped → `exchangeCodeForSession` failed silently / user stayed signed out.
- `normalizeAuthOrigin()` + callback/confirm redirect to canonical host before code exchange.
- `buildAuthCallbackUrl()` always uses canonical www in production; `bindSupabaseToResponse` uses `getAll`/`setAll` for auth cookies.
- Docs: `FEB_2026_AUTH_SETUP.md` — allowlist both www and apex; `NEXT_PUBLIC_SITE_URL=https://www.emberplay.app`.
- Smoke: `pnpm -C web test:auth-callback`.

## 2026-05-31 - PR10 UX: Compact marketplace layout + instant dev filter

- **Branch:** `feat/marketplace-development-opportunities`

### Summary
- Marketplace layout: compact header, single location bar, horizontal development chips, map + listings side-by-side on desktop.
- Development card taps filter client-side (no full page reload); URL updates via `history.replaceState`.
- Shorter map height on marketplace; seller listings in collapsible section.

## 2026-05-31 - PR10: Personalised Marketplace by Development Area

- **Branch:** `feat/marketplace-development-opportunities`

### Summary
- Upgraded `/app/marketplace` into a child-personalised development-led marketplace.
- Added Discover-aligned development cards (seven Stage 1 wrappers) with real counts or watch-mode copy.
- Selected child (URL `?child=`) drives opportunity counts, listing filters, and map markers.
- Listing cards show cautious match reasons from PR9 intelligence + taxonomy (no buyer-side Gemini).
- Preserved All children fallback, map, interest, and chat flows.
- Signed-in nav links now point to `/app/marketplace` with child query preserved.

### Product decisions
- Matching window: current child age + 6 months.
- Manufacturer age guidance and PR9 recommendation gates override personalised counts.
- Browse-with-caution items are not counted as normal opportunities.
- Missing ABI age-band data treated as coverage gap (`marketplace_item_estimate_only`), not “no needs”.
- No durable match records, push/email, or new migrations.

### Data/API
- `GET /api/marketplace/development-opportunities?childId=&development=`
- Extended `GET /api/marketplace/beta-listings` with `childId` + `development` + `buyer_match` payload
- Server-only intelligence reads for published listings (service role, not client-exposed)

### Verification
- Build: pass
- PR10 smoke: pass
- PR9 smoke: pass

## 2026-05-31 - PR9 UX: Remove duplicate review CTA, slim estimate, continue after save

- **Branch:** `feat/marketplace-intelligence-taxonomy-safety` (PR #221)

### Summary
- Removed **Mark ready for next step** and the duplicate review checklist from Step 4 (read-only review only; checks live in Step 3 **Save draft details**).
- **Ember’s estimate** in Step 3: dropped “May support…” development lines; **Continue to quick review** appears after **Save estimate**.
- After **Save draft details**, **Continue to review your draft** scrolls to Step 4.

## 2026-05-31 - PR9 UX: Product labels, title case, single save CTA

- **Branch:** `feat/marketplace-intelligence-taxonomy-safety` (PR #221)

### Summary
- Step 2 candidate cards show a concrete product title (e.g. “Toy knight helmet”) with category as subtitle, not the broad play category alone.
- Listing titles use consistent product title casing (`formatProductTitleCase`) in Step 3 and server reconciliation paths.
- Step 3 “Draft the listing” now includes the five quick-review checkboxes above **Save draft details**; saving also marks review ready (no separate **Mark ready** when embedded in the flow).

### Verification
- `pnpm -C web build`
- `pnpm -C web test:marketplace-pr9`

## 2026-05-31 - PR9 Patch: Identity Drift and Stale Draft Title Fix

- **Branch:** `feat/marketplace-intelligence-taxonomy-safety` (same PR #221)

### Summary
- Fixed remaining helmet identity drift where Step 3 title could remain “Sleep” after helmet confirmation.
- Step 2 now preserves concrete item identity separately from category/development label.
- Step 3 draft generation atomically updates title and description; bad titles get a deterministic fallback instead of being saved.
- Stale downstream draft fields are cleared when photo or confirmed item changes (server + client).
- Identity guard now validates title as well as description (catches standalone “Sleep” vs helmet).
- Ember’s estimate moved to Step 3 (Draft the listing) so it is visible without scrolling to Review.

### Root cause
- Stale `title_draft` (“Sleep”) from a prior item could persist while a new helmet description was generated.
- Step 2 stored only the broad category (“Dress up and pretend play”) as the confirmed label.
- Identity guard did not treat standalone “Sleep” as conflicting with helmet/costume identity.

### Verification
- Build: pass
- PR9 smoke: pass (includes stale Sleep title, saxophone/xylophone, binoculars, downstream reset invariants)

## 2026-05-31 - PR9: Marketplace Intelligence Backbone, Taxonomy Bridge & Safety Gates

- **Branch:** `feat/marketplace-intelligence-taxonomy-safety`

### Summary
- Fixed Step 2 → Step 3 identity drift in Create a Listing.
- Step 3 draft generation now anchors to the parent-confirmed item identity.
- Added a controlled marketplace item taxonomy (extended existing `marketplace_item_types`).
- Added item aliases for Gemini/user wording.
- Added a bridge from marketplace item types to Ember Stage 1 development wrapper cards.
- Added a per-listing marketplace intelligence profile.
- Added a taxonomy review queue for unmatched Gemini suggestions.
- Added cautious age suitability and safety fields.
- Added optional parent confirmation/editing for age guidance.
- Added a recommendation eligibility helper for future child matching.
- Added an ABI coverage-state helper for missing/non-missing age band logic.

### Critical bug fixed
- A helmet recognised as a plastic costume helmet can no longer draft as a Baby sleep aid.
- Step 3 may enrich the confirmed item identity but may not contradict it. The
  `generate-details` route now refuses to save a contradictory or too-generic draft
  (`identity_conflict` / `identity_review_required`, HTTP 409). The guard is generic
  (noun-based), not hard-coded to the helmet case.

### Product decisions
- Gemini suggests; Ember validates; the parent confirms.
- Gemini cannot create live taxonomy truth.
- Unknown taxonomy suggestions go to the review queue.
- Manufacturer age guidance wins when known.
- AI age suitability is an estimate, not a safety prescription.
- Cautious copy: "Estimated play stage".
- Optional manufacturer age confirmation, not forced.
- Current child matching window for future PRs: current age + 6 months.
- Missing ABI age band data is a content-coverage gap, NOT "no developmental need".

### Data model
- Migration: `supabase/sql/202605311200_marketplace_intelligence_taxonomy.sql`.
- Extended (not recreated): `marketplace_item_types` (+`label`, `description`,
  `parent_category_slug`, `default_min/max/outgrown_age_months`, `risk_level`,
  `recommendation_policy`).
- Added: `marketplace_item_type_aliases`, `marketplace_item_type_development_mappings`,
  `marketplace_listing_intelligence`, `marketplace_taxonomy_review_queue`.
- RLS: seller-owned draft intelligence protected; taxonomy tables authenticated-read /
  server-write; review queue owner-scoped (no cross-user exposure; no dashboard in PR9).

### Seed taxonomy
- `toy_saxophone`, `dress_up_costume_helmet`, `child_binoculars`, `hammer_peg_toy`,
  `picture_book`, `toy_doctor_kit`, `baby_sleep_aid` (+ aliases + Stage 1 dev mappings).

### ABI/development bridge
- Uses the exact seven Stage 1 wrapper slugs: `social_emotional`,
  `self_care_independence`, `fine_motor`, `gross_motor`, `language_communication`,
  `cognitive_problem_solving`, `toileting` (text slug bridge, no ABI FK).
- Does not create new ABI Stage 2 editorial content.
- Unknown Stage 1/Stage 2 suggestions go to the review queue.

### Key files
- `web/src/lib/marketplace/identity-guard.ts` (lock + drift detection)
- `web/src/lib/marketplace/marketplace-taxonomy.ts` (controlled taxonomy mirror)
- `web/src/lib/marketplace/intelligence.ts` (Gemini contract + validation)
- `web/src/lib/marketplace/recommendation-eligibility.ts`
- `web/src/lib/marketplace/coverage-state.ts`
- `web/src/app/api/marketplace/listing-drafts/[draftId]/intelligence/route.ts` (POST/PATCH/GET)
- `web/src/components/marketplace/EmberEstimateSection.tsx` ("Ember's estimate" UI)
- `web/scripts/marketplace-pr9-smoke.mjs` (+ `test:marketplace-pr9`)

### Verification
- Build: pass (`pnpm -C web build`, 31 May 2026).
- PR9 smoke: pass.
- Helmet identity guard: pass (helmet → sleep aid blocked).
- Saxophone identity guard: pass (saxophone → xylophone blocked; saxophone draft allowed).
- Binoculars intelligence: pass (generic "Toy" draft → review_required; binoculars draft allowed).
- Taxonomy unknown slug quarantine: pass (`dress_up_play_magic_category`, `imagination_world` not live).
- Age/safety helper: pass (manufacturer 36m blocks <window child; AI-only → cautious).
- Coverage-state helper: pass (31–33m exact; missing band → estimate-only, never "no needs").
- Existing regression: PR7 smoke pass, PR8 smoke pass.

### Known debt
- PR10 will build personalised marketplace development cards and map filtering.
- PR11 will build auto-matchmaking and in-app recommendations.
- Full admin taxonomy review UI deferred.
- Full restricted-category policy and moderation dashboard deferred.
- ABI coverage beyond 31–33 months still requires content expansion.
- Intelligence classification uses a deterministic alias→taxonomy mapping in PR9;
  the Gemini classification contract (`intelligence.ts`) is ready to wire in later.

## fix(snag-pack): feedback round — home slider Expecting, remove-child hang, sign-out CTA, sign-in → /discover (30 May 2026)

- **Branch:** `fix/snag-pack-discover-family-may30` (PR #220)
- **Feedback #1/#2 (homepage slider):** Home slider now mirrors `/discover`: the `0–0 months` band renders as **"Expecting"** (`longLabel`/`shortLabel`), and the caption changed from "My toddler's current age" → **"My child's current age"** — `HomeAgeSlider.tsx`.
- **Feedback #3 (remove-child hang):** The confirm popup hung on "Removing…" because `deleteChild` is a server action that calls `redirect()`, which soft-navigates without unmounting the client component (modal state stuck). Replaced with a direct client-side delete (same `children` table, RLS-scoped to `user_id`), then close the popup, drop the child from local state, reset to "All", and `router.replace('/family?deleted=1')`. No hang — `FamilyFigmaClient.tsx`.
- **Feedback #4 (sign-out CTA):** `/signout` button was a black CTA pinned to the far left (outside the page width). Now wrapped in `container-wrap` with a heading and styled as the standard orange CTA — `signout/page.tsx`.
- **Feedback #5 (post-sign-in destination):** Sign-in still landed on the marketing homepage when `next=/`. `safeNextPath` now treats `/` as a non-destination and defaults to `/discover` — `auth-callback-url.ts`.
- **Build:** `pnpm -C web build` — pass (30 May 2026).

## fix(snag-pack): discover Expecting, family remove/quick-add, mobile CTA, sign-in redirect (30 May 2026)

- **Branch:** `fix/snag-pack-discover-family-may30`
- **Snag #1 (discover slider / Have icon):** The newborn band (`0–0 months`) now displays as **"Expecting"** on `/discover` (`formatBandLabel` in `DiscoveryPageClient.tsx`). When that stage is selected the hero headline changes to **"What your baby will need"** with prep-focused subtext (`DiscoverFigmaChildHero.tsx`, new `isExpecting` prop). The product carousel **"Have"** button icon swapped from `Check` → `CircleX` (circle-x) — `DiscoverFigmaProductCarousel.tsx`.
- **Snag #6 (expecting baby bug):** `/discover?child=` with a **future** birthdate previously fell back to the 25–27 month default. Now future birthdates resolve to the Expecting band (month 0) — `web/src/app/discover/page.tsx`.
- **Snag #2 (remove child):** Added a **"Remove child"** button next to **"Add child"** on `/family` with a confirm popup ("Are you sure?", explainer "All of {child}'s history, saves and information will be deleted permanently.", **Back** / **Yes - remove**). Targets the selected child (or the only child in "All" view). Reuses the existing `deleteChild` server action — `FamilyFigmaClient.tsx`.
- **Snag #3 (family copy):** "Add what's in your house" → **"Move on {child}'s items locally"**; "Type or snap - we'll match it." → **"List for free in seconds. We'll matchmake a local family."** — `FamilyFigmaClient.tsx`.
- **Snag #4 (quick add):** The "Quick add" card now opens the marketplace **Add a product** (prelist) flow via `/marketplace?prelist=1` (with `child` when scoped) instead of the inline modal — `FamilyFigmaClient.tsx`.
- **Snag #5 (mobile CTA):** On `/add-children` the fixed bottom **"Add a child"** CTA was hidden behind the signed-in mobile bottom nav. Lifted it above the nav on mobile (`bottom-20 md:bottom-0`, `z-40`) and increased page bottom padding — `AddChildForm.tsx`.
- **Snag #7 (sign-in redirect):** Added `safeNextPath()` so post-sign-in `next` never points back to an auth route (`/signin`, `/signout`, `/auth`) — defaults to `/discover`. Applied in `signin/page.tsx`, `signin/password/page.tsx`, and `auth/callback/route.ts` (`auth-callback-url.ts`).
- **Privacy:** No new name fields or prompts added; child names are only displayed from existing data.
- **Build:** `pnpm -C web build` — pass (30 May 2026).

## fix(snag-pack): home slider true alignment with /discover bands (30 May 2026)

- **Branch:** `fix/snag-pack-discover-home`
- **Snag #1 (re-fix 2):** Two bugs found after review:
  1. The `/api/discover/age-bands` route wrapped `getGatewayAgeBandsPublic()` (which calls `cookies()`) in `unstable_cache`, which throws — so the route returned `[]` and the slider fell back to hardcoded (wrong) bands. Switched the route to read the function directly (uncached; CDN cached via headers).
  2. The slider only rendered the two end labels. Now renders **all** bands as tick labels, derived from `min_months`/`max_months` exactly like `/discover`'s `formatBandLabel` (the live source uses e.g. `22–24 months`, not the `label` field). Ticks are inset by half the thumb width to align with the native slider thumb.
  - Removed the hardcoded fallback bands entirely so the homepage never shows numbers that disagree with `/discover`; shows a loading state until the real taxonomy loads.
  - Verified the live endpoint returns the real 13-band taxonomy (`0–0m … 34–36m`) — the homepage now renders all of them (tick mark per band; labels thinned on mobile), matching `/discover` exactly.
  - Files: `web/src/components/home/HomeAgeSlider.tsx`, `web/src/app/api/discover/age-bands/route.ts`.

## fix(snag-pack): home slider now reuses the /discover slider (30 May 2026)

- **Branch:** `fix/snag-pack-discover-home`
- **Snag #1 (re-fix):** Replaced the homepage's custom slider with the exact `/discover` native slider (`discovery-age-slider` + `discovery-slider-wrap`, native thumb so no handle/line drift). "Begin your journey" routes to `/discover/<band.min_months>`, matching `/discover`'s own slider navigation. Files: `web/src/components/home/HomeAgeSlider.tsx`, `web/src/app/api/discover/age-bands/route.ts`.

## fix(snag-pack): feedback round — slider, ideas heading, start-over FAB (30 May 2026)

- **Branch:** `fix/snag-pack-discover-home`
- **Snag #1 (home slider):** Relabelled the homepage age slider to mirror the `/discover` band taxonomy (`23–25m, 25–27m, 28–30m, 31–33m, 34–36m`) and switched to index-based positioning so the drag handle, fill and tick labels all derive from the same fraction — fixes the handle/line misalignment. "Begin your journey" now routes to `/discover/<band midpoint>`. File: `web/src/components/home/HomeAgeSlider.tsx`.
- **Snag #5 (ideas heading):** Capitalise the first letter of the development name in `Ideas for "…"` (e.g. `i'm` → `I'm`). File: `web/src/app/discover/[months]/DiscoveryPageClient.tsx`.
- **Snag #6 (start over):** Floating "Start over" FAB now gated on an `IntersectionObserver` over the `Ideas for…` section, so it only shows while that section is in view and hides when scrolled back up. File: `web/src/app/discover/[months]/DiscoveryPageClient.tsx`.
- **Build:** `pnpm -C web build` — pass (30 May 2026)

## fix(discover): stop redirect loop after performance cleanup (29 May 2026)

- **Branch:** `fix/discover-redirect-loop-after-performance-cleanup`
- **Incident:** After PR #216, `/discover` ↔ `/discover/26` redirect loop (ERR_TOO_MANY_REDIRECTS).
- **Root cause:** `revalidate = 1800` on `/discover/[months]` could bake a build-time `redirect('/discover')` when age-band lookup failed; plus `getAgeBandForAgeCached` could cache `null` for 30m. `/discover` always redirects to `/discover/26`.
- **Fix:** Restore `force-dynamic` on `[months]`; uncached gateway reads on Discover pages (cached `Set` + `cookies()` in `unstable_cache` broke `.has()` and SSR); never redirect `[months]` → `/discover`; `gateway-cache` kept for `/api/discover/picks` only.
- **Preserved from #216:** WebP images, nav `prefetch={false}`, `/go` bot guard, picks API cache headers.
- **Build:** `pnpm -C web build` — pass (29 May 2026)
- **Verify (local prod):** `/discover` → single 307 → `/discover/26` 200; `/discover/26` and `/discover/32` 200 stable; Playwright desktop + iPhone 13 viewport PASS; `/api/discover/picks` 200. Signed-in `?child=` not automated (no test session in CI/local).

## fix(vercel): reduce residual function and transfer usage (29 May 2026)

- **Branch:** `fix/vercel-cost-shield-performance-cleanup`
- **Goal:** Lower Discover SSR cost, nav prefetch noise, homepage transfer, and /go bot logging after cost-shield PRs #213–#215.
- **Discover:** `gateway-cache.ts` — `unstable_cache` 30m on public gateway reads; `/discover/[months]` removed `force-dynamic`, added `revalidate=1800`; `/api/discover/picks` CDN cache headers + cached fetches.
- **Nav:** `prefetch={false}` on signed-in links to `/discover`, `/my-ideas`, `/family`, `/marketplace`, `/app/messages`.
- **Images:** `hero.webp` (~59 KB), `stages.webp` (~58 KB) from ~733/768 KB PNGs.
- **`/go/[id]`:** UUID guard; skip `click_events` insert for known bot UAs; redirects unchanged.
- **Build:** `pnpm -C web build` — pass (29 May 2026)

## fix(vercel): lock down cron and diagnostic routes (28 May 2026)

- **Branch:** `fix/vercel-cost-shield-runtime-lockdown`
- **Goal:** Fail-closed cron/preview/diagnostic routes so resumed Vercel usage stays safe without new env vars.
- **Changes:** `web/src/lib/runtime-guards.ts`; cron requires `CRON_SECRET` (404 if unset); preview/probe require `BUILDER_PREVIEW_SECRET`; `/whoami`, `/cms/diag`, `/cms/_diag` → `notFound()` in production; `robots.ts` disallows `/api/`, `/go/`, diagnostics; static `/ping` + `/__ping`.
- **`/go/[id]`:** Audited only — Supabase fetch + click log per hit; follow-up PR for rate limiting recommended.
- **Build:** `pnpm -C web build` — pass (28 May 2026); `/robots.txt` static

## fix(vercel): stop forcing public app routes dynamic (28 May 2026)

- **Branch:** `fix/vercel-cost-shield-public-static`
- **Goal:** Remove global `force-dynamic` from root layout so public pages can be statically generated / cached.
- **Changes:** Dropped `export const dynamic` from `web/src/app/layout.tsx` and `web/src/components/ThemeProvider.tsx`; `loadTheme()` only calls `noStore()` when reading DB theme (`BRANDBOOK_WINS` uses static `DEFAULT_THEME`); added `web/src/app/(app)/app/layout.tsx` with `force-dynamic` for `/app/*` only; `Suspense` around `ConditionalHeader` + pages using `useSearchParams` (`/marketplace`, `/signin`, `/auth/error`) so static prerender succeeds.
- **Discover tradeoff:** `/discover/[months]` keeps page-level `force-dynamic` for gateway freshness; `/discover` index may still be dynamic when `?child=` triggers auth lookup.
- **Build:** `pnpm -C web build` — pass; 27 static pages prerendered (was ~10 dynamic-only before). Public `○`: `/`, `/marketplace`, `/pricing`, `/signin`, etc. Private `ƒ`: `/app/*`, `/discover/*`, `/family`, etc.

## fix(vercel): narrow middleware scope to protected routes (28 May 2026)

- **Branch:** `fix/vercel-cost-shield-middleware`
- **Goal:** Stop running `updateSession` + `getUser()` on every public/bot request (Vercel Hobby overage).
- **Change:** `web/middleware.ts` matcher — from catch-all minus static assets → explicit `/app`, `/add-children`, `/account`, `/api/preview`, `/cms` (excl. `/cms/diag`, `/cms/_diag`).
- **Unchanged:** Auth redirect rules for `/app/*`, `/add-children/*`, `/account`; CMS preview secret redirect + CSP; no Supabase helper edits.
- **Build:** `pnpm -C web build` — pass (28 May 2026)

## fix(snag-pack): discover + desktop nav (18 May 2026)

- **Branch:** `fix/snag-pack-discover-nav-may18`
- **PR:** https://github.com/glownest2026-droid/ember/pull/202
- **Preview:** https://ember-git-fix-snag-pack-discover-037e81-tims-projects-cd69a894.vercel.app
- **Snags:** Discover `/discover/0` copy/tiles/science/cards/save modal; desktop nav child name only, no counters/reminders; centred desktop nav links + child dropdown; Start over FAB only at page bottom; nav bar uses same `max-w-5xl` container as page content
- **Nav layout fix:** `UnifiedSignedInNav` desktop header uses flex sides + full-row absolute centre overlay (logo | centred nav+child | profile); all signed-in routes use `max-w-5xl` container
- **Global Figma nav branding:** `navStyles.ts` + `ConditionalHeader` applies discover Manrope/warm header/orange accents on all routes; signed-out `DiscoverStickyHeader` restyled; signed-in always uses figma nav + bottom mobile tabs
- **Active nav underline:** `globals.css` `.figma-desktop-nav-link--active` matches Figma `Root.tsx` (`border-bottom: 2px solid #ff5c34`, `py-1`); desktop header row `md:h-20`
- **Nav alignment + child dropdown (19 May):** Figma 3-column layout (logo | flex-1 centred nav | child pill + profile); `FigmaChildAvatar` on pill + list items; dropdown uses `FIGMA_DROPDOWN_ITEM_CLASS` (pointer + hover)
- **Build:** `pnpm -C web build` — pass (18 May 2026)

## feat(discover): Figma Make overhaul + preserved wiring (May 2026)

- **Branch:** `feat/discover-figma-make-overhaul-may-UI-update`
- **Goal:** Implement May 2026 Figma Make `/discover` UI (Hero, focus grid, why panel, Embla ideas carousel) while preserving gateway data, save/have/auth, and age routing.
- **Routes touched:** `web/src/app/discover/[months]/page.tsx`, `web/src/app/discover/[months]/DiscoveryPageClient.tsx`
- **Figma UI folder:** `web/src/components/discover/figma/*` (+ barrel `web/src/components/figma/discover/index.ts`)
- **Data wiring preserved (reads):** `getGatewayAgeBandsPublic`, `getGatewayWrappersForAgeBand`, `getGatewayCategoryTypesForAgeBandAndWrapper`, `getGatewayTopPicksForAgeBandAndWrapperSlug`, `getGatewayTopPicksForAgeBandAndCategoryType`, `getGatewayTopProductsForAgeBand`, `getDiscoverServerPersonalization` — views `v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_wrapper_detail_public`, `v_gateway_category_types_public`, `v_gateway_products_public`, `v_gateway_category_type_images`
- **Data wiring preserved (writes):** `upsert_user_list_item` RPC (category/product save + have), legacy fallbacks `user_saved_ideas` / `user_saved_products`, `/api/click` outbound tracking
- **Image override:** `web/src/lib/discover/categoryImageOverrides.ts` — server-side HEAD probe of `category_images` `*-v2.png*` files; high-confidence slug/name match only; fallback to existing `image_url`
- **V2 image mapping (public storage, May 2026):**

  | Filename | Matched category | Confidence | URL source |
  | --- | --- | --- | --- |
  | `ember_visual_countdown_timer_category-v2.png.png` | Visual Countdown Timer (`visual_timer`) | high | Supabase public `category_images` |
  | `ember_emotion_matching_tiles_category-v2.png.png` | Emotion Faces Matching Tiles | high | Supabase public `category_images` |
  | `ember_social_scripts_books_category-v2.png.png` | Social Script Board Books (Sharing/Turns) | high | Supabase public `category_images` |

  **Note:** Only **3** `-v2` objects are currently reachable in `category_images`; a 4th filename was not found via exhaustive slug/label probes. Override helper will pick up additional files automatically when uploaded.

- **Build:** `pnpm -C web build` — pass (May 2026)
- **Preview URL:** _(fill from Vercel after `git push` + PR)_
- **Verification steps:**
  1. Open `/discover/32` (or your child’s month band).
  2. Confirm hero: robin chip, mobile image, integrated age slider.
  3. Choose a focus → warm “Why this matters now” panel.
  4. Ideas carousel: Embla swipe, See examples / Save / Already have.
  5. Examples section when picks exist; “Examples coming soon” when Stage 3 empty.
  6. Confirm v2 images only on the three mapped categories; others unchanged.
- **Known debt / follow-up:**
  - Upload/confirm 4th `-v2.png` category image in `category_images` if founder has a specific mapping.
  - Figma pack had no bundled PNG assets in-repo; hero uses live category/product image or fallback.
  - Desktop/mobile screenshots for PR proof-of-done pending founder QA on Vercel preview.

### follow-up: founder nav + discover UI fixes (May 2026)

- **Desktop nav:** Restored `UnifiedSignedInNav` (Discover / Saves / Marketplace, full child dropdown) with Figma shell styling — `#FBFAF7` background, orange underline active tab, Manrope.
- **Mobile nav:** Fixed bottom bar — Discover / Saves / Marketplace / **Menu** (hamburger → same Account / Family / Membership / Sign out list as desktop profile menu). Legacy in-header tabs hidden on app-shell routes.
- **Robin logo:** `EmberRobinMark` component — larger readable sizes in age chip + “Why this matters now” panel.
- **Focus cards:** Doorway Lucide icons + explicit `#FF5C34` / `#66717D` icon colours.
- **CTA:** **Ember Picks ›** (removed “See”; `whitespace-nowrap` + chevron).
- **Removed:** “Change focus” link on discover detail view.

### follow-up: Figma parity pass — fonts, nav, layout, CTA (May 2026)

- **Branch:** `feat/discover-figma-make-overhaul-may-UI-update`
- **FONT:** Manrope 400/500/600/700 via `next/font` (`web/src/lib/discover/manrope.ts`); applied on app-shell routes via `EmberFigmaAppNav` + `html.ember-figma-app` + `/discover` layout.
- **NAV:** New `EmberFigmaAppNav` from Figma `Root.tsx` — desktop sticky header (`max-w-5xl`), mobile child pill header, fixed bottom tabs (What's next / My ideas / Marketplace / Family). Wired in `ConditionalHeader` for `/discover`, `/my-ideas`, `/marketplace`, `/family`.
- **CTA:** Idea cards → **See Ember Picks** with `BadgeCheck` icon (`DiscoverFigmaPlayIdeaCard.tsx`).
- **LAYOUT:** Content width `max-w-5xl` (`figmaTokens.ts`); main column `gap-10 md:gap-14` rhythm.
- **Build:** `pnpm -C web build` pass.

## feat(data): import ABI 31-33m v8 child-voice csv (Apr 2026)

- **Branch:** `feat/abi-import-31-33m-v8`
- **Goal:** Execute `ABI_31_33m_v8_ready_child_voice.csv` through the existing Discover ABI V2 ingestion path for `31-33m`, overriding this age band only and skipping Stage 3 import.
- **Ground-truth read path confirmed:** `web/src/app/discover/page.tsx`, `web/src/app/discover/[months]/page.tsx`, and `web/src/lib/pl/public.ts` read from curated views (`v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_wrapper_detail_public`, `v_gateway_category_types_public`, `v_gateway_products_public`).
- **Ingestion path used:** New idempotent migration `supabase/migrations/20260409084000_import_31_33m_abi_v8_child_voice.sql` (authored from `scripts/generate-abi-31-33m-v8-sql.mjs`; mirrored in `supabase/sql/202604090840_import_31_33m_abi_v8_child_voice.sql`).
- **What changed:**
  - Normalized CSV formatting at import boundary (`True` booleans and `1.0` numeric ranks coerced to typed SQL values, whitespace trimmed).
  - Upserted Stage 1 wrappers + need links + age-band wrapper rankings for `31-33m`.
  - Upserted Stage 2 category masters + need->category mappings for `31-33m`.
  - Deactivated Stage 3 product mappings for `31-33m` by design (`DO NOT IMPORT Stage 3` for this task), even though CSV includes some product columns.
  - Kept scope deterministic and limited to `age_band_id = '31-33m'`.
- **Import execution proof:** `supabase db push --yes` applied migration successfully with notices:
  - `ABI 31-33 v8 rows loaded: 32`
  - `Distinct Stage 1 wrappers: 7`
  - `Distinct Stage 2 category types: 32`
  - `Stage 3 active mappings (expected 0): 0`
- **Build proof:** `pnpm install --frozen-lockfile` and `pnpm build` passed in `web/`.
- **Status:** Live migration applied; PR creation/checks/preview tracking in progress.
- **Rollback:** Revert this PR and run rollback steps in migration footer (scoped deletes/deactivations for `31-33m` mappings only).

### follow-up: discover UX polish for Stage 1/2 (Apr 2026)

- **Goal:** Fix Stage 1 click scroll anchor, diversify Stage 1 icons by wrapper meaning, and remove product-example text from Stage 2 card titles.
- **What changed:**
  - `web/src/app/discover/[months]/DiscoveryPageClient.tsx`
    - Stage 1 card click now scrolls to the Stage 1 "Why this matters" section (not directly to Stage 2), with increased scroll margin.
    - Stage 2 card title text now strips parenthetical `"(e.g. ...)"` fragments at render time.
  - `web/src/app/discover/[months]/_lib/wrapperIcons.tsx`
    - Added explicit icon mapping for 31–33m wrapper slugs (`social_emotional`, `self_care_independence`, `fine_motor`, `gross_motor`, `language_communication`, `cognitive_problem_solving`, `toileting`) to avoid identical fallback icons.
- **Proof:** `pnpm build` passes in `web/`.

### follow-up: anchor + explainer placement adjustment (Apr 2026)

- **Goal:** Fine-tune Stage 1 anchor position and move `Explained ⓘ` into the explainer card header.
- **What changed:**
  - `web/src/components/discover/figma/DiscoverFigmaScienceSection.tsx`
    - Added optional `onExplain` action and rendered `Explained ⓘ` inline after `Why this matters for your child`.
  - `web/src/app/discover/[months]/DiscoveryPageClient.tsx`
    - Removed the separate `Chosen for 31–33 months • Explained` line under Stage 1 title.
    - Updated Stage 1 click auto-scroll to land slightly lower (`targetTop = sectionTop + 64`) so the explainer and Stage 2 CTA area can coexist in first view.
- **Proof:** `pnpm build` passes in `web/`.

## feat(discover): import and wire ABI 28-30m + 31-33m into Discover (Apr 2026)

- **Branch:** `feat/discover-28-33m-abi-import`
- **Goal:** Execute `ABI_28_30m_ready.csv` and `ABI_31_33m_ready.csv` through the existing ABI V2 gateway path for `/discover` and `/discover/[months]`, with Stage 3 explicitly empty where CSV product fields are blank.
- **Ground-truth read path confirmed:** `web/src/app/discover/page.tsx`, `web/src/app/discover/[months]/page.tsx`, `web/src/app/discover/[months]/DiscoveryPageClient.tsx`, and `web/src/lib/pl/public.ts` read from curated gateway views (`v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_wrapper_detail_public`, `v_gateway_category_types_public`, `v_gateway_products_public`).
- **Ingestion path used:** Added idempotent migration `supabase/sql/202604071200_discover_abi_28_33_import.sql` (canonical gateway tables only, no parallel runtime importer).
- **What changed:**
  - Imports Stage 1 + Stage 2 for `28-30m` and `31-33m` into canonical gateway tables.
  - Reuses existing masters where resolvable by slug/name; creates missing global development needs/category types only when no clean match exists.
  - Enforces Stage 3 empty semantics for these CSVs (deactivates Stage 3 product mappings for imported bands).
  - Updates Discover unlock logic so Stage 1+2 can render even when Stage 3 products are absent.
  - Updates Stage 1 cards to render from dataset wrappers (not hardcoded doorway labels), with existing Lucide style via slug→icon mapping in `wrapperIcons.tsx`.
  - Updates Stage 3 empty state text to **`Examples coming soon`**.
- **CSV stats (source files):**
  - `ABI_28_30m_ready.csv`: 11 rows, 6 wrappers, 11 category slugs, Stage 3 product rows: 0.
  - `ABI_31_33m_ready.csv`: 12 rows, 6 wrappers, 11 category slugs, Stage 3 product rows: 0.
- **Execution status:** SQL import execution is **blocked in this runner** (`supabase` CLI and DB credentials are not present here), so migration was authored and committed but not applied from this environment.
- **Follow-up fix (Apr 2026):** addressed SQL runtime error `ON CONFLICT DO UPDATE command cannot affect row a second time` by pre-deduplicating staged records per conflict key before upserts (`tmp_abi_stage1_wrappers`, `tmp_abi_stage1_age_band_wrappers`, `tmp_abi_stage2_category_types`) in the same migration file.
- **Build proof:** `pnpm -C web build` passes on this branch after changes.
- **Rollback:** Revert commit `2e7cbe9`; if migration has been applied in another environment, run inverse deletes scoped to `age_band_id IN ('28-30m','31-33m')` from the gateway mapping tables listed in the migration footer.

## feat(discover): import ABI 34-36m CSV into gateway (Apr 2026)

- **Goal:** Execute `ABI_34_36m_completed.csv` through the Discover gateway canonical path (ABI V2 Stage 1-3), with no fabricated Stage 3 products.
- **Ground truth path used:** Discover reads `v_gateway_age_bands_public`, `v_gateway_wrappers_public`, `v_gateway_wrapper_detail_public`, `v_gateway_category_types_public`, and `v_gateway_products_public` via `web/src/lib/pl/public.ts` and `/discover/[months]`.
- **Ingestion path used:** New idempotent SQL migration `supabase/sql/202604071315_import_34_36m_abi_v2.sql` (also copied into `supabase/migrations/20260407131500_import_34_36m_abi_v2.sql`) plus generator `scripts/generate-abi-34-36m-sql.mjs`.
- **What changed:** Inserted/updated age band `34-36m`, Stage 1 wrappers + wrapper->need links + age-band wrapper ranks, need meta, category-type masters, and age-band need->category mappings. Explicitly cleared Stage 3 product mappings for `34-36m` because CSV Stage 3 product fields are blank.
- **Import proof:** CSV rows read: 22. Remote push succeeded (`supabase db push --yes`). Post-import REST checks: age band rows=1, wrappers=6, wrapper_detail=6, categories=22, products=0 for `34-36m`.
- **Discover behavior proof:** Month 34 resolver returns `34-36m`; Stage 1 and Stage 2 data present; Stage 3 products intentionally absent, so `/discover/34` is expected to show the "Catalogue coming soon" empty-products state from CSV-only import.
- **Build proof:** `pnpm install --frozen-lockfile` and `pnpm build` in `web/` passed.
- **Rollback:** Revert this PR and run an inverse migration to remove `34-36m` mappings (or restore from DB backup snapshot if needed).

### follow-up: unlock Stage 1+2 without Stage 3 products (Apr 2026)

- **Goal:** If Stage 1 + Stage 2 exist, show the discover slide/doorway experience; when Stage 3 is missing, show explicit empty-state copy in Stage 3 section.
- **What changed:**
  - `web/src/app/discover/[months]/page.tsx` now computes `selectedBandHasStage12Data` from real wrapper + category data (not product presence), and uses it to unlock the experience.
  - Stage 3 navigation (`show=1`) now works from Stage 2 even when product mappings are empty.
  - `web/src/app/discover/[months]/DiscoveryPageClient.tsx` now gates main experience by Stage 1+2 availability and shows `Examples coming soon` in Stage 3 when no product examples exist.
  - `web/src/lib/discover/doorways.ts` maps new 34–36m wrapper slugs to existing Lucide doorway definitions/icons (same visual system as existing 25–27m cards).
- **Proof:** `pnpm build` passes in `web/`.

### follow-up: fix Stage 1 cards to match 34-36m dataset (Apr 2026)

- **Root cause found:** Stage 1 card UI text/labels were hardcoded doorway content; wrapper data was only used for slug resolution, not displayed label content.
- **Fix:** `web/src/app/discover/[months]/DiscoveryPageClient.tsx` now renders non-25–27 age bands directly from `wrappers` data (label from DB, e.g. `Pretend & story play`) while preserving Lucide icon styling.
- **Behavior:** 34–36 now shows dataset-driven Stage 1 wrapper labels; selecting `Pretend & story play` flows to Stage 2 categories including `Dressing-up clothes`.
- **Proof:** `pnpm build` passes in `web/`.

### follow-up: mobile arrow overlap in Stage 2 carousel (Apr 2026)

- **Issue:** On mobile `/discover`, Stage 2 carousel arrows overlapped card title text/content.
- **Fix:** Moved mobile-only Stage 2 carousel arrow controls higher by changing `top-[45%]` to `top-[34%]` in `web/src/components/discover/figma/DiscoverFigmaPlayCarousel.tsx`.
- **Scope:** Minimal, mobile-only positioning change; desktop unchanged.
- **Proof:** `pnpm build` passes in `web/`.

# CTO Snapshot (Source of Truth)
 _Last updated: 2026-03-25_

## feat(inventory): controlled CSV canonical ingestion (PR4) — 2026-04-01
- **Branch:** `feat/inventory-pr4-csv-canonical-ingestion`
- **Goal:** Expand canonical dictionary coverage from attached draft CSV without bloating product_types or weakening canonical truth.
- **Ground truth checks completed:** CSV parsed safely (1000 rows, 124 proposed canonical slugs). Controlled ingest keeps only `seed_confidence='medium'` rows (500). Overlap cluster detected and collapsed deterministically (`pram`/`pushchair`/`stroller` -> `stroller`).
- **What changed:** Added migration `supabase/sql/202604011100_pr4_inventory_csv_controlled_ingestion.sql` that stages CSV rows, deterministically merges into existing dictionary (slug -> normalized label -> existing alias), creates minimal net-new `product_types`, inserts deduplicated aliases (<=3-word aliases + canonical label/slug forms), and resolves matching queue rows with `resolution_note='resolved via PR4 CSV seed'`.
- **Verification bundle in migration:** emits before/after counts, new canonical rows, ambiguous deferred candidates, and matcher spot-check outputs for `pram`, `cash register`, `potty`, `foot gauge`.
- **Boundaries protected:** no anon policy changes, no marketplace/lifecycle logic, no Find it/At home boundary changes.
- **Verification:** `pnpm -C web build` passes.
- **Rollback:** Revert PR4 commit(s). Optional DB rollback migration should remove only PR4-added product_types/aliases and revert queue resolution notes set by PR4.

## feat(posthog): PostHog foundation (privacy-safe, discovery-grounded) — 2026-03-25
- **Branch:** `feat/posthog-foundation`
- **Goal:** Install a minimal, privacy-safe PostHog foundation for Ember using the analytics discovery contract as the source of truth, without changing runtime product behavior beyond necessary client navigation timing for child-save tracking.
- **Scope (no vendors besides PostHog):**
  - Client-side PostHog init + app-owned event wrapper (manual `page_view` capture only)
  - No session replay (stopped after init), no heatmaps capture enablement, no surveys enablement
  - Env-driven configuration via `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` with fail-closed behavior when missing
- **Events implemented (NOW, grounded insertion points):**
  - `page_view`
  - `sign_in_completed` (auth callback/confirm via cookie + `/verify` + `/signin/password`)
  - `child_profile_created` / `child_profile_updated` (emitted after successful `saveChild()` server action returns)
  - `shortlist_viewed` (Discovery examples section entry)
  - `retailer_outbound_clicked` (paired with existing `/api/click` logging insertion points)
  - `product_saved` (Discovery save_product success)
  - `gift_page_viewed` / `gift_page_shared` (gift list load + share copy success)
- **Explicitly deferred:**
  - `garage_item_added` (not proven as a deterministic insertion point yet)
  - All other lifecycle/marketplace events reserved in the contract
- **Stop-sign handling:** Did not widen anon access, did not invent canonical IDs, and only sent safe IDs/flags to PostHog.
- **Verification:** `pnpm -C web build` succeeds in `web/` on this branch.
- **Rollback:** Revert branch / close the PR (PostHog integration is isolated to the analytics wrapper + event call sites).

## feat(ui): /family action-first redesign (Figma Manage Family V2) — 2026-03-19
- **Branch:** `feat/family-figma-redesign`
- **Goal:** Redesign the signed-in `/family` page into an action-first “family control room” while preserving existing Supabase children + per-child saved stats + gift-share plumbing. Scope is `/family` only.
- **UI wiring (no new backend logic):**
  - Child saved counters use existing `get_my_subnav_stats(p_child_id)` calls already powering `/family`.
  - “Remind me” toggle uses existing reminders model via `user_notification_prefs.development_reminders_enabled` (same pattern as `MyIdeasClient`).
  - Action cards are wired to existing routes: `/discover?child=`, `/my-ideas?tab=ideas|products&child=`, `/marketplace?child=`.
- **Deviations from pack where plumbing is missing:** We did not port the pack’s mock “quick add / inventory drawer” flows (no matching inventory backend found); “Quick add” navigates to Discover.
- **Verification:** `pnpm build` in `web/`; `pnpm exec eslint` on the modified `/family` components.
- **Rollback:** Revert the branch / close the PR (no DB/schema changes were made).
- **Follow-up (same PR, visual parity pass):**
  - Removed the desktop right column (“Keep the home in sync” hero + duplicate right-side modules).
  - Removed the redundant bottom child profile card grid from `/family`.
  - Kept plumbing, counters, route links, gift-share widget, and reminder persistence intact in a single-column layout.
- **Follow-up 2 (same PR, Figma parity tightening):**
  - Added top child tabs (`All` + dynamic child tabs from real children data) to match Figma header controls.
  - Updated household tools to keep a strict 4-card row on desktop (`lg:grid-cols-4`).
  - Reworked reminders card to Figma structure with icon, subtitle, and 2 switch rows.
  - Added gift icon treatment in gift-share card.
  - Removed hardcoded child copy from headline/pulse; now derived from actual household data.
  - Added full “Add what’s in your house” modal journey (search, suggested matches, assign-to, add-to-home CTA) with live routing back into existing Discover flow.
- **Follow-up 3 (same PR, consistency + polish pass):**
  - Synced scope logic so selected tab drives header pulse, counters, action subtitle, links, and action copy consistently.
  - Removed non-approved header control (`Settings`) and kept focused controls (`Add child`, scope tabs, counters).
  - Tightened top-card visual hierarchy (primary card density/shadow/spacing + calmer secondary cards).
  - Added clearer tool-card specificity and stronger Find it vs At home separation.
  - Reduced Gift list visual weight via compact integrated card presentation.
  - Tightened section rhythm and reminders card hierarchy/copy for closer Figma pacing.

## fix(pwa): Android install icon (maskable + solid canvas) — 2026-03-18
- **Goal:** Installed PWA on Android uses full-bleed, premium icon (no white tile from transparent PNG on launcher).
- **Assets:** `web/public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — solid **#FFFCF8** canvas, trimmed robin centred (~76% for `any`, ~56% for maskable safe zone). **RGB only** (no alpha). `web/public/apple-touch-icon.png` regenerated to match.
- **Why maskable:** Android adaptive icons crop to circle/squircle; `purpose: "maskable"` + smaller artwork keeps the robin inside the safe zone; `any` icons stay bolder for square contexts.
- **Regenerate:** `node web/scripts/generate-pwa-icons.mjs` (fetches brand PNG once; do not point manifest at Supabase URL).
- **Manifest:** `web/src/app/manifest.ts` — icons under `/icons/…` with `purpose: any` + `maskable`. `layout.tsx` `metadata.icons.icon` → `/icons/icon-192.png`.
- **Verification:** `pnpm run build` in `web/`; open `/manifest.webmanifest`; install PWA on Android Chrome and confirm launcher icon.

## feat(ui): Discover page Figma redesign + child personalization — 2026-03-17
- **Branch:** `feat/discover-figma-redesign`
- **Goal:** Implement Figma Discover layout on `/discover/[months]` (REPLACE UI); keep doorway → category → picks flow, Save/Have/Visit, How we choose sheet, age band slider. No duplicate AppBar (global header unchanged).
- **Personalization:** When signed in and `?child=`, load `child_name`, `display_name`, `gender`, `birthdate`. **Full display label** (child_name || display_name, e.g. “Pop pop”) for hero/stage copy; hero **month count** from **birthdate** when available (not URL band). Closing line uses gender object pronoun (**her/him/them**). If no name → **your child** / **your family**.
- **New files:** `web/src/lib/discover/personalization.ts`; `web/src/components/discover/figma/` (ChildHero, NeedCard, ScienceSection, PlayCarousel, PlayIdeaCard, ProductCarousel, Image).
- **Removed from discover page:** `CategoryCarousel`, `DiscoverCardStack` (replaced by Figma carousels). Guest still sees `DiscoverHeroPocketPlayGuide`.
- **Auth (Preview PKCE fix, same PR):** `web/src/lib/auth-callback-url.ts` — browser OAuth/magic `redirectTo` uses **`window.location.origin`** so Vercel Preview returns to the same preview host. Server: `VERCEL_ENV=preview` → `https://${VERCEL_URL}`; production → `NEXT_PUBLIC_SITE_URL`; else localhost. Docs: `web/docs/FEB_2026_AUTH_SETUP.md` §2c. **Supabase** must allow preview `/auth/callback` URLs (wildcard or explicit).
- **Nav (child toggle dead clicks, same PR):** `UnifiedSignedInNav` used one `ref` for both desktop and mobile child dropdowns; React kept only the mobile node, so desktop **click-outside** fired on mousedown inside the open menu and unmounted it before `handleChildSelect` ran. **Fix:** separate `childDropdownDesktopRef` / `childDropdownMobileRef`; click-outside treats either as inside.
- **Discover + nav (same PR):** On Discover, child switch → **full load** `/discover?child=` (or `/discover`) so server redirects to that child’s age band + **`?child=`**; hero personalizes from URL child id. Toggle **accent ring** ~850ms (sessionStorage after full navigation). Toast host removed. **Age slider** always when band empty.
- **Discover personalization (server):** `getDiscoverServerPersonalization(childParam)` uses **`select('*')`** on `children` + shared `personalizationFromChildrenRow` (avoids fixed column lists breaking on schema drift).
- **Discover personalization (client):** Same `select('*')`; **`getUser()` + `onAuthStateChange(INITIAL_SESSION | SIGNED_IN)`** so load runs after session is ready (fixes race vs SubnavStats `user`).
- **Verification:** `pnpm run build` in `web/`. Discover: `/discover/26?child=<uuid>`. Auth: Google sign-in on a Preview deployment completes on that preview origin without PKCE error.
- **Rollback:** Revert PR / branch.

## feat(ui): Discover page Figma redesign + child personalization — 2026-03-17
- **Branch:** `feat/discover-figma-redesign`
- **Goal:** Implement Figma Discover layout on `/discover/[months]` (REPLACE UI); keep doorway → category → picks flow, Save/Have/Visit, How we choose sheet, age band slider. No duplicate AppBar (global header unchanged).
- **Personalization:** When signed in and `?child=`, load `child_name`, `display_name`, `gender`, `birthdate`. **Full display label** (child_name || display_name, e.g. “Pop pop”) for hero/stage copy; hero **month count** from **birthdate** when available (not URL band). Closing line uses gender object pronoun (**her/him/them**). If no name → **your child** / **your family**.
- **New files:** `web/src/lib/discover/personalization.ts`; `web/src/components/discover/figma/` (ChildHero, NeedCard, ScienceSection, PlayCarousel, PlayIdeaCard, ProductCarousel, Image).
- **Removed from discover page:** `CategoryCarousel`, `DiscoverCardStack` (replaced by Figma carousels). Guest still sees `DiscoverHeroPocketPlayGuide`.
- **Auth (Preview PKCE fix, same PR):** `web/src/lib/auth-callback-url.ts` — browser OAuth/magic `redirectTo` uses **`window.location.origin`** so Vercel Preview returns to the same preview host. Server: `VERCEL_ENV=preview` → `https://${VERCEL_URL}`; production → `NEXT_PUBLIC_SITE_URL`; else localhost. Docs: `web/docs/FEB_2026_AUTH_SETUP.md` §2c. **Supabase** must allow preview `/auth/callback` URLs (wildcard or explicit).
- **Nav (child toggle dead clicks, same PR):** `UnifiedSignedInNav` used one `ref` for both desktop and mobile child dropdowns; React kept only the mobile node, so desktop **click-outside** fired on mousedown inside the open menu and unmounted it before `handleChildSelect` ran. **Fix:** separate `childDropdownDesktopRef` / `childDropdownMobileRef`; click-outside treats either as inside.
- **Discover + nav (same PR):** On Discover, child switch → **full load** `/discover?child=` (or `/discover`) so server redirects to that child’s age band + **`?child=`**; hero personalizes from URL child id. Toggle **accent ring** ~850ms (sessionStorage after full navigation). Toast host removed. **Age slider** always when band empty.
- **Discover personalization (server):** `getDiscoverServerPersonalization(childParam)` uses **`select('*')`** on `children` + shared `personalizationFromChildrenRow` (avoids fixed column lists breaking on schema drift).
- **Discover personalization (client):** Same `select('*')`; **`getUser()` + `onAuthStateChange(INITIAL_SESSION | SIGNED_IN)`** so load runs after session is ready (fixes race vs SubnavStats `user`).
- **Verification:** `pnpm run build` in `web/`. Discover: `/discover/26?child=<uuid>`. Auth: Google sign-in on a Preview deployment completes on that preview origin without PKCE error.
- **Rollback:** Revert PR / branch.

## fix(auth): Google SSO production callback domain (emberplay.app) — 2026-03-17
- **Branch:** `fix/google-sso-production-domain`
- **Goal:** OAuth and magic-link `redirectTo` uses `https://emberplay.app/auth/callback` in production (via `NEXT_PUBLIC_SITE_URL`); localhost unchanged (always browser origin).
- **Code:** `web/src/lib/auth-callback-url.ts` — `buildAuthCallbackUrl()`; wired in `signin/page.tsx`, `SaveToListModal.tsx`, `account/page.tsx` (link Google/Apple). `/auth/callback` route unchanged (`exchangeCodeForSession`).
- **Vercel Production:** Set `NEXT_PUBLIC_SITE_URL=https://emberplay.app` (no trailing slash). Do not set locally.
- **Verification:** `pnpm run build` + `pnpm run lint` in `web/`; code review: production build with env → `redirectTo` base is emberplay.app; localhost → `http://localhost:3000/auth/callback`.
- **Rollback:** Revert PR; remove `NEXT_PUBLIC_SITE_URL` from Vercel if needed.

### Founder follow-up: Google Cloud + Supabase settings

**Must do (production Google sign-in)**

1. **Supabase → Authentication → URL configuration**
   - **Site URL:** `https://emberplay.app`
   - **Redirect URLs:** include `https://emberplay.app/auth/callback` and `http://localhost:3000/auth/callback` (and preview URLs if you test OAuth on Vercel previews).

2. **Vercel → Production env:** add `NEXT_PUBLIC_SITE_URL` = `https://emberplay.app`, redeploy.

3. **Google Cloud → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs:** keep **`https://<project-ref>.supabase.co/auth/v1/callback`** (copy exact URL from Supabase → Authentication → Providers → Google). The app does **not** use `emberplay.app` as Google’s redirect URI — Google returns to Supabase first; Supabase then sends the user to our `/auth/callback`.

**Should do (branding & trust)**

4. **Google Cloud → OAuth consent screen:** App name **Ember**; **Authorized domains** include `emberplay.app`; **Application home page** `https://emberplay.app`; add privacy policy / terms links if you have them; support email.

5. **Google Cloud → Credentials → Authorized JavaScript origins:** include `https://emberplay.app` (and `http://localhost:3000` for local testing).

**Nice to do**

6. Logo on consent screen; verified app status when ready.

---

## feat(ui): Unified signed-in navigation (Figma Subnav Bar V3) — 2026-03-16
- **Branch:** feat/unified-signed-in-nav
- **Goal:** Upgrade navigation for signed-in users by consolidating the previous two navs (header + subnav) into one sticky bar from the Figma Subnav Bar V3 code pack.
- **Scope:** One PR. ConditionalHeader shows UnifiedSignedInNav when signed-in, DiscoverStickyHeader when signed-out. SubnavGate no longer renders SubnavBar (returns null). ContentSpacer uses --unified-nav-height when signed-in.
- **Figma pack:** `C:\Users\timwo\OneDrive\Documents\Project Leaf\Project Leaf - UI Components\Figma - Subnav Bar V3` (App.tsx). Assets replaced with Ember logo URL and lucide-react icons; no figma:asset imports.
- **Data:** useSubnavStats (user, stats, refetch), children from Supabase, pathname/searchParams for active section and ?child=. All links/buttons wired: Discover, Saves, Marketplace, child dropdown (Add a child → /add-children, Manage my family → /family), stats → my-ideas?tab=, Account, Sign out, Reminders toggle + tooltip.
- **Non-negotiables:** Sticky on scroll; subnav hidden for logged-out users; width max-w-[90rem] px-4 md:px-6 lg:px-12; no dead buttons/icons.
- **Files changed:** web/src/components/subnav/UnifiedSignedInNav.tsx (new), ConditionalHeader.tsx, SubnavGate.tsx, ContentSpacer.tsx, app/globals.css (--unified-nav-height). SubnavBar.tsx retained but no longer rendered.
- **Verification:** Signed out → single header (logo, Sign in, Get started). Signed in → one sticky bar: logo, Discover/Saves/Marketplace, child switcher, stats (ideas/products/gifts), Reminders toggle, profile dropdown (email, Account, Sign out); mobile: tabs + stats row + reminders. Build passes.
- **Mobile tab row (2026-03-17):** CSS `position: sticky` for Discover/Saves/Marketplace did not work inside the tall `<header>`. Fix: scroll listener + 1px sentinel above tab row; when sentinel scrolls above viewport, tab row switches to `position: fixed` with spacer to avoid layout jump; safe-area padding on fixed bar. Desktop unchanged (`lg:sticky` on header).
- **Rollback:** Revert PR; restore ConditionalHeader to only DiscoverStickyHeader; restore SubnavGate to render SubnavBar when user; restore ContentSpacer to header+subnav height.

## chore(staging): Frontend/deployment foundation — staging lane (2026-03-12)
- **Branch:** feat/staging-frontend-foundation
- **Scope:** One PR: confirm current truth, lock staging topology (main → prod, staging branch → stable staging, PRs → preview), add docs and runbook. No staging backend, seed data, or feature flags.
- **Deliverables:** `docs/staging/current-truth.md`, `docs/staging/topology-decision.md`, `docs/staging/runbook.md`, `docs/staging/environment-matrix.md`; optional creation/push of `staging` branch; PROGRESS.md and state/latest.json updated.
- **Verification:** Build passes; PR checks green; Vercel preview URL works. Founder: follow runbook for creating/verifying `staging` branch, Vercel Staging environment, and staging env vars.
- **Rollback:** Revert PR; delete `docs/staging/` if desired; no production or DB changes.

## feat(marketplace): Pre-list flow (Figma exact) + wiring (2026-03-05)
- **Branch:** feat/marketplace-prelist-figma-wiring
- **Scope:** One PR: pre-launch listing flow from Figma Make code pack, wired to PR1 backend. No DB/schema changes.
- **Route:** /marketplace (logged-in): widget above hero + modal; /marketplace/listings: canonical My listings page; /app/listings redirects to /marketplace/listings.
- **Flow:** Step 1 item + pg_trgm suggestions; Step 2 condition + photo upload (storage + marketplace_listing_photos); Step 3 pickup area + marketplace_preferences; Step 4 pricing intent (GBP, rough price visible); Step 5 review (photos + £ price) + submit (status=submitted). Success modal → "View my listings" → /marketplace/listings.
- **Snag fixes:** (1) Pricing step: compact layout so Rough price box visible; GBP (£) everywhere, no conversion. (2) Review step: show uploaded photos; price as £ (GBP). (3) Listings at /marketplace/listings; link from SuccessModal; /app/listings redirect. (4) Listing cards: object-contain for photo (no squish); notes parsed for price display; show condition, area, price. (5) Subnav: Marketplace links preserve ?child=; marketplace page reads ?child= for header "Ready to pass anything on for [child name]?" else "your child"; subnav child toggle applies on /marketplace so "All children" updates URL and shows "your child".
- **Flow bugs (2026-03-05):** (1) Pickup area: last submitted postcode/radius saved to marketplace_preferences on submit; modal pre-fills postcode/radius from preferences for new listings so user does not re-enter. (2) Review modal: content area has min-h-0 and flex-shrink-0 on header/footer so modal fits in viewport and body scrolls; Back/Save always visible. (3) Review step: submitted photo(s) render in Photos section and first photo shown next to item name (replacing package icon).
- **Files:** web/src/components/figma/marketplace-prelist/* (ListingWidget, ListingModal, SuccessModal, steps/*); web/src/app/marketplace/page.tsx; web/src/app/marketplace/listings/page.tsx; web/src/app/(app)/app/listings/page.tsx (redirect); DiscoverStickyHeader, MyIdeasClient, SubnavBar (withChild / marketplace childToggle); lib/marketplace/actions.ts; globals.css (prelist tokens).
- **Verification:** Login → /marketplace → List an item → set rough price £10 → Review shows photo + £10 (GBP) → submit → View my listings → /marketplace/listings; card shows photo (correct aspect), condition, price. From /my-ideas?child=id → Marketplace → header uses child name; subnav shows same child.

## feat(marketplace): Listings backend — schema, storage, pg_trgm (2026-03-05)
- **Branch:** feat/marketplace-listings-backend
- **Scope:** One PR: (a) pre-launch marketplace listings schema, (b) photo upload storage bucket, (c) fuzzy item-type suggestions via pg_trgm.
- **DB migrations (apply in order):** `202603051200_marketplace_pg_trgm_item_types.sql`, `202603051201_marketplace_listings_tables.sql`, `202603051202_marketplace_rls.sql`, `202603051203_marketplace_storage.sql`, `202603051204_marketplace_suggest_rpc.sql`.
- **Deliverables:** pg_trgm + `marketplace_item_types` (search_text, GIN index, seed); `marketplace_listings` + `marketplace_listing_photos` + `marketplace_preferences`; RLS on all; private bucket `marketplace-listing-photos` with path `{user_id}/{listing_id}/{filename}`; RPC `suggest_marketplace_item_types(query_text, limit)`.
- **Smoke tests:** `docs/marketplace_smoke_tests.sql` — run in Supabase SQL Editor after migrations.
- **Verification:** Migrations apply cleanly; RLS blocks cross-user access; bucket exists; RPC returns suggestions for "chair", "hi chair", "bath".

## fix(snag-pack): Nav and pages snags (2026-03-05)
- **Branch:** fix/snag-pack-nav-and-pages
- **Snags:** (A) /gift header → "Live gift list for..."; (B) /my-ideas: removed content between header and My list grid, removed "Today for My Child" box, header "My ideas for [Child Name]" when child in URL; (C) Subnav "toys" → "products"; (D) Main nav: Family icon hidden on desktop and mobile bar, kept in hamburger only; (E) /discover: age slider preset from child age when ?child= and known age, else 25–27 months; (F) /add-children: hero height reduced by third (h-64→h-[168px]), future birth dates allowed, birthdate modal blurb updated.
- **Files:** GiftListClient, MyIdeasClient, SubnavBar, DiscoverStickyHeader, discover/page.tsx, AddChildForm, PrivacySheet.

## feat(marketplace): Figma Make overhaul — /marketplace (2026-03-05)
- **Branch:** feat/marketplace-figma-make-overhaul
- **Route:** `/marketplace` (new). Public marketing page; uses existing app shell (ConditionalHeader, SubnavGate from root layout). No Figma Header — per brief, do not import code-pack navbar.
- **UI (exact from Figma Make pack):** Hero (value prop + NotificationAnimation), How it works (3 steps), Trust & safety (6 pillars), Pre-launch preview (SellSuggestions), Early access benefits (3 cards), FAQ (6-item accordion), Final CTA, Footer. Layout/typography/spacing/animations match code pack; desktop + mobile responsive.
- **Data wiring:** None. Static marketing content; no new tables or API. Links: /join, /notify, /login → /signin; SellSuggestions “Start a listing” / “List a bundle” → /products.
- **Files:** `web/src/app/marketplace/page.tsx`; `web/src/components/figma/marketplace/*` (NotificationAnimation, SellSuggestions, ui/button, ui/card, ui/accordion, ui/utils). Design tokens added to `globals.css` @theme (primary, border, muted, accent, etc.) and accordion keyframes for Radix content height animation.
- **Dependencies added:** @radix-ui/react-accordion, @radix-ui/react-slot, class-variance-authority (scoped to figma/marketplace UI).
- **Nav:** DiscoverStickyHeader and HomeShowsUp “Marketplace” links now point to /marketplace (was /products).
- **Verification:** Visit /marketplace → hero, notification carousel, how it works, trust, sell suggestions, early access cards, FAQ accordion, final CTA, footer. Nav “Marketplace” and homepage “Explore marketplace” go to /marketplace. Build passes.
- **Known debt:** Footer “About”, “Trust & Safety”, “Contact”, “Privacy”, “Terms” link to / (placeholder until those routes exist).

## fix(my-ideas): Hide saves for suppressed children (2026-03-05)
- **Branch:** fix/suppress-saves-when-child-removed
- **Problem:** When a user removes all child profiles, legacy saves still appeared; after adding a new child, those saves "came flooding back."
- **Requirement:** Saves for removed children must be hidden and stay hidden; data remains in DB for recovery.
- **Solution:** (1) **RLS:** Show only rows where `child_id IS NOT NULL` and that child is visible (not suppressed). **Unassigned items (`child_id IS NULL`) are never shown** so legacy unassigned saves do not reappear when the user adds a new child. (2) **Stats:** Same rule — only count items assigned to a visible child; unassigned never counted.
- **Migrations:** Run `202603051000_PART1_rls_only.sql` then `202603051000_PART2_stats_only.sql` (or full `202603051000_suppress_saves_for_suppressed_children.sql`).
- **Verification:** Remove all children → 0/empty; add a new child → still 0 until user saves new items for that child. Legacy unassigned and suppressed-child saves stay in DB but never surface.
- **Gift page:** Migration `202603051100_gift_list_hide_legacy.sql`: `get_public_gift_list` now returns only items assigned to a visible (non-suppressed) child; unassigned and suppressed-child gift items are excluded so /gift does not show legacy content. Dropdown "Unassigned" no longer appears when there are no unassigned items.

## feat(gifts): Public gift sharing /gift/[slug] (2026-03-04)
- **Branch:** feat/gift-share-widget
- **Scope:** Share your gift list widget on /family: Copy link + Preview. Public route /gift/[slug] shows read-only gift list (no auth).
- **Part A — Slug model:** Migration `supabase/sql/202603041100_gift_shares.sql`: table `gift_shares` (id, user_id, slug, created_at), UNIQUE(user_id), UNIQUE(slug). RLS: owner CRUD only; anon cannot read table. Functions: `resolve_gift_slug_user_id(p_slug)` (internal), `get_public_gift_list(p_slug)` SECURITY DEFINER returns only gift-flagged items; GRANT EXECUTE to anon/authenticated.
- **Part B — Public route:** `web/src/app/gift/[slug]/page.tsx`: server component, no auth; calls `get_public_gift_list(slug)`; 404 if slug invalid or no items; renders read-only list (title, image, saved time). No user IDs or edit/remove.
- **Part C — Widget:** `ShareYourGiftListWidget` in FamilyFigmaClient and MyIdeasClient (Gifts tab): Copy link (getOrCreateGiftShareSlug → clipboard, “Link copied”), Preview (open /gift/{slug} in new tab). Slug created on first use (8–12 char URL-safe). Server action `lib/gift/actions.ts`: getOrCreateGiftShareSlug().
- **Security:** Anonymous cannot read gift_shares or user_list_items; only get_public_gift_list(slug) returns gift rows. No service_role in client.
- **Verification:** Apply migration; sign in → /family → Copy link → paste in new tab (or Preview) → see gift list when logged out. Add/remove gift items on /my-ideas; shared link reflects only gift-flagged items.
- **Follow-up (same branch):** My List on /my-ideas: (1) Grid filters by URL `?child=` so it auto-updates when subnav child toggle changes (no hard refresh). (2) List fetches once on mount; no refetch on browser tab visibility so grid stays settled. (3) “Share your gift list” widget moved to top of Gifts tab only (inside My list card, above the grid).
- **Follow-up 2 (same branch):** Public /gift/[slug] page: family members can filter by child. Migration `202603041200_gift_list_child_id.sql`: get_public_gift_list now returns child_id (nullable). GiftListClient shows "All children" dropdown plus "Child 1", "Child 2" (no names; order by first appearance). Grid filters by selected child; subnav-like behaviour.
- **Follow-up 3 (same branch):** Gift page UX: (1) Title "Gift list for [Name]'s family" via get_gift_share_list_title(p_slug) (first name from auth.users; migration 202603041300). (2) Human copy: "Here's what they're hoping for." (no "Read-only"). (3) Child toggle always visible when there are items; add "Unassigned" option for items with null child_id. (4) Global nav on /gift constrained to max-w-3xl to match page content (DiscoverStickyHeader pathname check).
- **Follow-up 4 (same branch):** Gift list title + child dropdown fixes: (1) get_gift_share_list_title now prefers display_name, full_name, name, then first_name + last_name, then first_name (so Dashboard "Display name" e.g. "Tim Wood" shows). (2) New RPC get_public_gift_children(p_slug) returns child ids for the list owner; GiftListClient receives childrenIds from server and shows "Child 1", "Child 2" in dropdown (not only from items). Dropdown visible when items or children exist.
- **Follow-up 5 (same branch):** (1) Gift page child dropdown shows real labels: get_public_gift_children now returns (child_id, label) with label = child_name/display_name + " - Aged " + age_band (e.g. "Alex - Aged 6+"); fallback "Child N". (2) Subnav child param preserved: handleWrapperSelect, handleShowExamples, and age-slider navigation in DiscoveryPageClient now use withChildParam() so ?child= sticks when selecting a doorway or changing age. openAuth effect preserves child in signin next URL. (3) Save idea / Have them: handleSaveCategory and handleHaveThemCategory run() wrapped in try/catch with error toast so failed RPC shows "Could not save idea" / "Couldn't update" instead of no feedback.
- **Follow-up 6 (same branch):** (1) Share your gift list widget: Preview button shows "Loading..." while slug is fetched and new tab opens; button disabled during load. (2) My ideas Examples modal: Save and Have CTAs pass p_child_id (effectiveChildForSave = filterChildId ?? selectedChildId) so saves are stored for the selected child; on error set actionError; clear actionError when opening modal.
- **Follow-up 7 (same branch):** Gift page card images: get_public_gift_list image_url for ideas now uses same source as /my-ideas — v_gateway_category_type_images first, then pl_category_types.image_url fallback (so e.g. "Picture books and board books" shows image on /gift). Migration 202603041200 updated; 202603041400_gift_list_image_from_gateway.sql provided for DBs that already applied 202603041200.

## feat(family): Remove child profile (soft) + is_suppressed (2026-03-04)
- **Scope:** Child profile cards get a working Remove flow with confirmation; removed children are hidden (soft) via `is_suppressed`, not hard-deleted.
- **DB:** Migration `supabase/sql/202603041000_children_is_suppressed.sql`: add `children.is_suppressed` (boolean, default false), index `children_user_suppressed_idx` for list queries.
- **Backend:** `lib/children/actions.ts`: new `suppressChild(childId)` server action (sets `is_suppressed = true` for own row).
- **Family UI:** `ChildProfileCard` already had Remove button + “Are you sure?” modal; `ChildProfilesSection` now accepts `onRemove` and passes it to each card; `FamilyFigmaClient` calls `suppressChild(id)` then refetches children so list updates without reload.
- **Filtering:** All list queries for children now exclude suppressed: `FamilyFigmaClient`, `FamilyDashboardClient`, `MyIdeasClient`, `SubnavBar` (all 3 fallbacks), `SaveToListModal`, `app/recs/page`. Edit-by-id (`add-children/[id]`) still loads the child (no filter) so link-to-edit remains valid.
- **Verification:** Run migration; sign in → /family → Remove on a card → confirm → card disappears; subnav and my-ideas no longer show that child; DB row remains with `is_suppressed = true`.

## feat(family): Figma Make overhaul on /family (2026-03-03)
- Branch: feat/family-figma-make-overhaul
- **Route:** `/family` (unchanged). App shell (ConditionalHeader, SubnavGate) preserved.
- **UI:** Manage My Family page replaced with Figma Make design: header (title + Settings), left column (Child profiles section with grid of cards + Add a child CTA + Add another child card), right column on desktop (hero image, 2 secondary images, “Growing together” card). Layout: `max-w-[90rem]`, `lg:grid-cols-[1fr_400px]`, responsive; sidebar hidden on mobile.
- **Data wiring (unchanged):** `children` table (id, birthdate, gender, age_band); per-child stats via `get_my_subnav_stats(p_child_id)` (ideas_saved_count, toys_saved_count, gifts_saved_count). No DB schema or RLS changes.
- **Privacy:** No child name displayed; card title “Little One”, avatar initial from deterministic `getAvatarInitial(child.id)` (no PII).
- **Files:** `web/src/app/family/page.tsx` → uses `FamilyFigmaClient`; `web/src/components/figma/family/*` (FamilyFigmaClient, ChildProfilesSection, ChildProfileCard, AddChildCard, EmptyChildProfiles, GenderIcon, ImageWithFallback, utils). Sidebar images: Unsplash URLs (existing remotePatterns).
- **Verification:** Sign in → go to /family → see new layout; child cards show birthdate, age, ideas/toys/gifts; Edit → /add-children/[id]; Add a child → /add-children; Settings → /account; Go to My ideas → /my-ideas. ?saved=1 / ?deleted=1 toasts still work; ?child=id scrolls to card.
- **Known debt:** Gender tooltip uses native `title` (no Radix); optional later: Radix Tooltip for exact Figma behaviour.

## fix(my-ideas): My List grid filtered by selected child (2026-03-03)
- Branch: fix/my-ideas-grid-filter-by-child
- Bug: On /my-ideas with a child selected in subnav (e.g. Geraldine, "1 idea"), the My List grid showed all items (9 ideas, 3 toys, 3 gifts). Grid was not wired to child.
- Root cause: (1) childFilteredItems included `child_id == null` when a child was selected (inherited unassigned). (2) When URL had no ?child= (All children), fetchChildren defaulted selectedChildId to list[0].id so grid showed first child + unassigned instead of all.
- Fix: MyIdeasClient: filter to only `child_id === selectedChildId` when a child is selected (no inheritance). When initialChildId absent, keep selectedChildId null and sync from URL so "All children" shows all items. Effect syncs selectedChildId to null when initialChildId is cleared.

## fix(child-toggle): dropdown labels, family/discover/my-ideas use child param, list filter by child (2026-03-03)
- Branch: fix/child-toggle-labels-and-context
- Snags: (1) Subnav child dropdown: show "Name – Aged X" or "Gender – Aged X" instead of "Child 1/2/3"; robust query (child_name/display_name then fallback with gender). (2) Family: pass params.child to FamilyDashboardClient; highlight and scroll to selected child card. (3) Discover: read ?child= in searchParams; pass initialChildId to DiscoveryPageClient; show "Ideas for Alex" / "Chosen for Alex" when child selected; redirect from /discover preserves child. (4) My-ideas: fetch user_list_items with child_id; filter list by selected child (child_id = selected OR null); counts and tabs reflect filtered list.
- **Follow-up (same PR):** New child not in toggle after add; stats not 0 for new child. (5) SubnavBar refetches children when pathname changes so new/edited child appears after add-children. (6) get_my_subnav_stats(p_child_id) optional param; when set, counts only items for that child (child_id = p_child_id OR null). SubnavStatsContext refetch(childId); SubnavBar calls refetch(selectedChildId) when pathname/selectedChildId change so stat counters show per-child (e.g. 0 for new child). Migration: 202603031000_subnav_stats_per_child.sql.
- **Follow-up 2 (same PR):** (7) Dropdown labels: first query now selects id, child_name, display_name, age_band, gender; toSubnavChild() normalizes API row so names (Geraldine/Alex) show when present; fallbacks for display_name-only then gender/age. (8) Saves from /discover store against selected child: upsert_user_list_item(p_child_id) in 202603031100_upsert_user_list_item_child.sql; DiscoveryPageClient passes selectedChildId from URL to all save/have RPCs and to replay payload; getReturnUrl preserves ?child= so post–sign-in return keeps selection.
- **Follow-up 3 (same PR):** (9) Add-child/edit UX: CTA shows "Save changes" when editing (initial?.id), "Add a child" when new. Consent checkbox defaults to true when editing so user does not re-confirm. (10) saveChild writes name to both child_name and display_name so toggle shows it; SubnavBar fetchChildren on pathname + 300ms delayed refetch on subnav pages + visibilitychange refetch so list updates after redirect from add-children.
- **Follow-up 4 (same PR):** (11) Subnav stats inverted: "All children" showed 0, per-child (e.g. Sophie) showed totals. SubnavStatsContext now always passes `p_child_id` explicitly: `null` for aggregate (all), UUID for per-child; avoids ambiguity so RPC branch is correct. Ensure migration 202603031300_subnav_stats_child_only.sql is applied so per-child counts only that child (Sophie = 0 when no saves).
- **Follow-up 5 (same PR):** (12) Sophie still showed 8/3/3 despite no saves: per-child stats were inheriting unassigned items (old 202603031000 had `OR child_id IS NULL`). Child profiles must NEVER inherit; 202603031000_subnav_stats_per_child.sql updated to count only `child_id = p_child_id` (no OR unassigned). Re-apply that migration or run 202603031300 on Supabase so Sophie = 0, Geraldine = her actual counts.

## fix(snag-pack): mobile nav 1-click, child name on discover/my-ideas, subnav toggle + deeplinks (2026-03-03)
- Branch: fix/snag-pack-nav-discover-subnav
- Snags: (A) Mobile nav: signed out = Sign in + Get started in main bar (no hamburger click); signed in = Discover/My Saves/Marketplace/Family icons in main bar + same links in hamburger. (B) /discover and my-ideas: "My child" replaced with child's name from children.child_name/display_name when populated. (C) Subnav: child toggle stays on current page (discover/my-ideas/family) with ?child=; first CTA = child selector (amber), second = "+ Add a child"; stat counters (ideas/toys/gifts) link to /my-ideas?tab=ideas|products|gifts. MyIdeasClient accepts initialTab from URL for deeplinks.

## fix(snag-pack): nav 4+2, discover hero hide when signed-in, family/my-ideas split, Examples modal (2026-02-28)
- Branch: fix/snag-pack-nav-and-family
- Snags: (A i–ii) Nav simplified to 4+2: Discover, My Saves, Marketplace, Family | Account, Sign out; Lucide icons (Compass, Bookmark, ShoppingBag, Users, User, LogOut); desktop icon before text, mobile stacked (text then icon). (A iii) /discover: hide “Your pocket play guide” hero for signed-in users; first section = age slider. (A iv) /family: child profiles only; content below (child selector, Today, My list, sidebar) moved to /my-ideas. (A v) My List Examples: API accepts wrapperSlug for idea kind; FamilyExamplesModal uses wrapperSlug when set; Examples button shown for ideas with ux_slug; picks load via getGatewayTopPicksForAgeBandAndWrapperSlug.

## fix(snag-pack): mobile nav, add-children CTA, discover CTA, child name field, subnav switcher (2026-02-28)
- Branch: fix/snag-pack-mobile-and-ux
- Snags: (1) DiscoverStickyHeader mobile-friendly: hamburger menu on md-down, slide-down panel with nav links. (2) /add-children bottom CTA: text "Add a child", mobile-safe width + safe-area padding. (3) /discover hero: hide "Get started" CTA when signed in (DiscoverHeroPocketPlayGuide hideGetStarted). (4) Add-child form: "What do you call them?" optional field from Figma; DB migration 202602280000_children_display_name.sql (display_name column). (5) Subnav: child profile switcher (select) after "Add a child"; navigates to /family?child=id; FamilyDashboardClient accepts initialChildId from URL.
- **Snag pack round 2 (same PR):** (A) Post sign-in redirect to /discover (auth/callback, auth/confirm, signin, signin/password default `next`). (B) Add-child consent error shown above "Add a child" CTA in fixed bottom bar. (C) Older-child "Just a heads up" modal: compact centre square (OlderChildSheet) instead of full-width bottom sheet. (D) After saving a child redirect to /discover (saveChild redirect); child write path unchanged (children table). (E) Nav logo: Supabase URL already correct; increased Image width/height to 96 for sharper display.
- **child_name column:** Migration 202602281000_children_child_name.sql adds `children.child_name` (optional text) for "What do you call them?"; form and actions write/read `child_name`; SubnavBar and edit page use `child_name`; backfill from `display_name` where present.

## Homepage Figma rebuild (feat/homepage-figma-rebuild)
- Branch: feat/homepage-figma-rebuild
- Replaced (/) content with Figma code-pack design: HomeHero, HomeAgeSlider, HomeHowItWorks, HomeStageBlocks, HomeShowsUp, HomeHowWeChoose, HomeFinalCTA. Assets in web/public/home/; Unsplash in next.config images.
- **Figma navbar:** DiscoverStickyHeader updated to Figma style from same code pack: sticky, max-w-[90rem], px-6 lg:px-12, py-5, logo from /home/ember-logo.png, wordmark “Ember” text-2xl. No “How it works” or “About”. Signed-in only: “Manage Family”, “Account”, “Sign out”. Signed-out: “Get started” CTA. Subnav (SubnavGate) unchanged; still shown for signed-in users only. --header-height set to 88px for new navbar height.

## Environments
- Production URL: https://ember-mocha-eight.vercel.app
- Git default branch: main
- Current active Preview (auth testing): https://ember-git-feat-auth-password-12a-tims-projects-cd69a894.vercel.app

## Core stack
- Web: Next.js App Router under /web (Vercel Root Directory = web)
- Hosting: Vercel (Free / Hobby)
- Auth + DB: Supabase (project ref: shjccflwlayacppuyskl)
- CMS: Builder.io under /cms/* with preview via /api/preview and CSP allowlist for Builder editor
- Theme: Theme v1 via ThemeProvider + CSS variables, editable in /app/admin/theme (merged)

## Auth posture (as of today)
- Invite-only: ✅ Signups disabled in Supabase Auth
- Friends sign-in: ✅ Magic link (existing users only; no auto-create)
- Admin sign-in: ✅ Email + Password (admin user created directly in Supabase Auth Users)
- Forgot password / email recovery: ❌ NOT reliable in current maturity state (no custom domain; email delivery inconsistent)
- Resend: ✅ Account created | ❌ NOT wired into Supabase (deferred)

## Supabase Auth redirect allowlist (high level)
- Includes: localhost, production, wildcard Vercel previews, /auth/callback, /reset-password
- Note: allowlist is NOT the blocker; current blocker is reliable auth email delivery + appropriate maturity gates.

## Proof-of-done routes (source of truth)
- /signin
- /auth/callback
- /app (logged out → redirect to /signin?next=/app)
- /add-children (add-child form only; list lives on /family; /app/children redirects here)
- /add-children/[id] (edit child; back/save/delete → /family)
- /app/children, /app/children/new → redirect to /add-children
- /app/children/[id] → redirect to /add-children/[id]
- /app/recs
- /ping
- /cms/lego-kit-demo
- (optional) /cms/diag
- /discover (canonical; redirects to first band)
- /discover/[months] (V1.0 doorways experience)
- /new, /new/[months] (308 redirect to /discover)
- /family (Manage My Family dashboard; Child profiles list below header; auth-gated, list + child data, images/toggle/remind/gift; save/delete from add-children redirect here with ?saved=1|?deleted=1)

## Open PR policy
- Keep ≤ 1 open “feature PR” at a time (currently: #79 only).
- Merge strategy: Rebase & merge.
- Conflict strategy: resolve locally via rebase (never GitHub UI conflict buttons).

## Current open PRs
- #79 feat(auth): admin password login + reset flows (12A) — OPEN

## Known issues (active)
1) Branding/theme only renders after sign-in on some public routes (reported: / and /signin at minimum). Must be fixed so logged-out users see correct branding.
2) Forgot-password emails not reliable (logs show recovery requested, but delivery inconsistent). Deferred until custom domain + proper sender is in place.

---

## PR0 — Feb 2026 Auth Baseline Audit Receipt (no behavior changes)

- **What changed:** Added Feb 2026 Auth Baseline Audit docs; no runtime changes. New: `web/docs/FEB_2026_AUTH_BASELINE.md`, `web/docs/FEB_2026_DECISION_LOG.md`.
- **Proof:** `pnpm -C web build` passes (run on main after pull).
- **PR:** [PR URL placeholder — fill after PR is opened]

---

## PR1 — Auth Modal + Session Plumbing (Apple/Google/Email OTP)

- **What changed:** Upgraded SaveToListModal to auth modal with Apple/Google (feature-flagged), Email OTP (6-digit in-modal); fixed auth callback and confirm routes to set session cookies via route-handler Supabase client; DiscoverStickyHeader shows “Signed in” when authed; OAuth return-to via `next` param; added `web/docs/FEB_2026_AUTH_SETUP.md` and `web/src/lib/auth-flags.ts`.
- **Proof:** `pnpm -C web build` passes. Manual: open Vercel Preview → /discover/26 → “Save to my list” → Email OTP flow → verify code → modal closes, header shows “Signed in”.
- **PR:** [PR URL placeholder — fill after PR is opened]

### PR1 mini-step: OTP template docs + error UX

- **What changed:** (1) Docs: `FEB_2026_AUTH_SETUP.md` now includes section “Email OTP: show a 6-digit code in the email” — Magic link template must include `{{ .Token }}`, with Founder click path (Authentication → Email → Templates → Magic link → add `{{ .Token }}` → Save) and note that with custom SMTP OFF, Supabase rate limits may apply (OK for prototype). (2) In-app: when OTP send fails, modal shows “We couldn’t send a code right now. Please try again in a minute.” and, for email-delivery/5xx errors, a second line: “If this keeps happening, we may need to fix email delivery settings in Supabase.”; “Send code” becomes “Try again in Xs” with 60s cooldown; dev-only `console.warn` for send failure (no secrets). (3) Code step copy: “Check your email for a 6-digit code. We sent it to {email}.”
- **Proof:** `pnpm -C web build` passes.
- **Note:** The Supabase Magic link template change (adding `{{ .Token }}`) was done by Founder (Tim) in the dashboard; this commit only documents it and improves error UX.

### PR1: OTP success confirmation step

- **What changed:** After OTP verify succeeds, modal shows “You’re signed in” / “Nice — you can save ideas now.” for ~1s, then closes and calls `onAuthSuccess`. Timeout stored in ref and cleared on modal close or unmount to avoid state update on unmounted component.
- **Proof:** `pnpm -C web build` passes.
## PR2 — Gate actions + replay after sign-in (no anonymous saves)

- **Goal:** Gate first actions (Save / Have / Join) behind auth and replay the intended action once after sign-in. No anonymous saves.
- **What changed:** New shared utility `web/src/lib/auth/requireAuthThen.ts` (requireAuthThen, consumePendingAuthAction, replayPendingAuthAction). Pending action stored in sessionStorage key `ember.pendingAuthAction.v1`; replayed in one place only: DiscoveryPageClient on auth state (mount + onAuthStateChange). All four triggers now use requireAuthThen: Save category (Layer B), Save product (Layer C), Have category, Have product. “Join free” in discover header opens auth modal via `?openAuth=1` and URL is cleaned; no replay for join-only. Replay validates returnUrl matches current path; on failure shows toast: “Signed in — we couldn’t save that just now. Please try again.”
- **Key files:** `web/src/lib/auth/requireAuthThen.ts`, `web/src/app/discover/[months]/DiscoveryPageClient.tsx`, `web/src/components/discover/DiscoverStickyHeader.tsx`.
- **Proof:** `pnpm -C web build` passes. Vercel Preview: [PR URL].
- **Manual QA (browser):** Guest on /discover/26 → Save category → auth modal → sign in → action replays (toast/modal). Same for Save product, Have it already. Join free → modal opens; after sign-in stay on page. Guest browsing works; no sign-in on load.
- **Rollback:** Revert PR2 commits; main remains deployable.

---

## PR3+4 — Account hardening: optional password + link providers

- **Goal:** Single PR: (1) Set a password (optional) after OTP sign-in; (2) Password sign-in + Forgot password working; (3) Explicit “Link Google” / “Link Apple” on /account. No automatic merges; no anonymous saves.
- **What changed:** New `/account` page (protected by middleware): signed-in email, “Set a password (optional)” form (updateUser password, success message per spec), “Link Google” / “Link Apple” (feature-flagged; linkIdentity with redirectTo `/auth/callback?next=/account`). DiscoverStickyHeader: “Account” link when signed in. Middleware: protect `/account` (redirect to signin?next=/account). Docs: `FEB_2026_AUTH_SETUP.md` sections 7 (Set password), 8 (Account linking); `FEB_2026_DECISION_LOG.md` PR3+4 entry.
- **Proof:** `pnpm -C web build` passes. Manual QA: OTP sign-in from /discover → /account → set password → success message; sign out → /signin/password works; forgot/reset flow; linking (when flags + Supabase configured) returns to /account.
- **Rollback:** Revert this PR; main remains usable via OTP.

---

## PR5 — Enable Google + Apple SSO (flags + setup + QA)

- **Goal:** Make Google/Apple provider enablement production-ready via documentation and founder QA script. No code changes unless callback/linking breaks; flags remain env-only.
- **What changed:** Docs only. `web/docs/FEB_2026_AUTH_SETUP.md`: new sections **2a** Enable Google SSO (Founder click-path: Supabase + Google Console + redirect URLs), **2b** Enable Apple SSO (Founder click-path), **2c** Redirect URL allowlist, **3** Vercel Environment Variables (keys/values, keep flags OFF until Supabase setup complete), **10** QA Script (Browser-only) — Test 1 Google sign-in from /discover, Test 2 Apple sign-in, Test 3 Linking while signed in, Test 4 Regression (guest, OTP, sign out). Section numbers 3–9 renumbered to 4–9.
- **Proof:** `pnpm -C web build` passes. No code changes; mergeable even if providers not configured.
- **Rollback:** Set `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` / `NEXT_PUBLIC_AUTH_ENABLE_APPLE` to `false` in Vercel (no code revert needed).

---

## UI — Google icon on auth modal button

- **What changed:** Added Google “G” icon to the “Continue with Google” button in the auth modal (SaveToListModal). New `web/src/components/icons/GoogleMark.tsx` (18px inline SVG, aria-hidden); button keeps label “Continue with Google” and existing gap-2 layout. Same “Logo + Continue with Google” option added on `/signin` (gated by `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE`, same OAuth redirectTo pattern). Removed “Admin?” text from signin page; “Sign in with password” link kept. No auth logic, flags, or redirect changes.
- **Proof:** `pnpm -C web build` passes. With `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE=true`, modal and /signin show icon + label; with flag off, buttons remain hidden.
- **Rollback:** Revert the commit(s) on the branch.

---

## PR — /family dashboard shell (visual + auth gate, no DB)

- **Goal:** Add authenticated `/family` route (“Manage My Family” dashboard) as a production-quality visual shell matching the Figma Manage Family prototype layout. No DB reads or writes; placeholder/skeleton data only.
- **What changed:** New route `web/src/app/family/page.tsx` (server component: `createClient().auth.getUser()`; if no user → `FamilySignInRequired`, else → `FamilyDashboardClient`). New components: `web/src/components/family/FamilySignInRequired.tsx` (signed-out state: “Sign in to manage your family” + CTA to `/signin?next=/family` and link to `/discover?returnTo=/family`); `web/src/components/family/FamilyDashboardClient.tsx` (shell: header “Manage My Family”, child chips strip with one placeholder child, personalization strip “Today for {displayName}” with optional name fallback “My child”, two-column layout: left = My list with Ideas/Products/Gifts tabs + skeleton card with **Want** and **Gift** as two separate controls, right = Next steps, Reminders, Settings; all actions “Coming soon” or placeholder).
- **Intentionally placeholder:** Children list (one neutral “— · —” chip); saved counts (0); list items (one skeleton card with Want/Gift toggles, no persistence); reminders toggle; Add child, Filter, Search, Share my list.
- **QA (founder):** 1) Signed out: go to `/family` → see “Sign in to manage your family” and “Sign in” button; 2) Sign in, go to `/family` → see full shell with “Manage My Family” header, child chip “— · —”, “Today for My child” strip, My list (Ideas/Products/Gifts tabs), one skeleton card with Want + Gift checkboxes, Next steps / Remind me / Settings; 3) Build: `cd web && pnpm install && pnpm run build` passes.
- **Follow-on PRs (not in this PR):** Wire children from DB; wire saved ideas/products/gifts from DB; persist Want/Gift/reminders; Add child flow; Filter/Search; Share my list.
- **Rollback:** Revert PR or delete `web/src/app/family/` and `web/src/components/family/`. No DB/RLS changes.

---

## PR — /family My list plumbing (user_list_items + Want/Have/Gift)

- **Goal:** Implement real, persistent “My list” with Want/Have/Gift flags; wire /family to show real counts and items; wire Discover “Save idea” and “Have them” to persist to a single canonical table.
- **Ground truth:** Existing save tables `user_saved_products` and `user_saved_ideas` (supabase/sql/202602190000_subnav_saves_and_consent.sql) were actively used by DiscoveryPageClient. This PR adds a new canonical table `user_list_items` with unified semantics (Want, Have, Gift; Gift implies Want), backfills from those tables, and switches all writes to `user_list_items`. get_my_subnav_stats now counts from user_list_items.
- **What changed:** (1) **DB:** New migration `supabase/sql/202602250000_family_user_list_items.sql`: table `public.user_list_items` (id, user_id, child_id, kind, ux_wrapper_id, category_type_id, product_id, want, have, gift, created_at, updated_at); constraints: kind+ref match, gift⇒want; partial unique indexes per ref type; RLS (auth-only, child ownership for INSERT/UPDATE); backfill from user_saved_products and user_saved_ideas; `get_my_subnav_stats()` updated to count from user_list_items; RPC `upsert_user_list_item(p_kind, p_product_id, p_category_type_id, p_ux_wrapper_id, p_want, p_have, p_gift)`. Verification script `supabase/sql/verify_family_user_list_items.sql`. (2) **Discover:** DiscoveryPageClient save_category, save_product, have_category, have_product (and replay) now call `upsert_user_list_item` instead of user_saved_ideas/user_saved_products. (3) **/family:** FamilyDashboardClient fetches user_list_items (with joins to products, pl_category_types, pl_ux_wrappers), shows real counts and list grid; Want/Gift toggles call upsert (Gift on ⇒ want=true; Want off ⇒ gift=false).
- **Founder runbook:** See PR description: copy/paste migration block into Supabase SQL Editor, then verification block.
- **Remains (out of scope):** Add child modal persistence; Remind me preference persistence; gift list sharing links.
- **Rollback:** Code: revert PR. DB: `DROP TABLE IF EXISTS public.user_list_items CASCADE;` then re-run `202602190000_subnav_saves_and_consent.sql` to restore get_my_subnav_stats to read from user_saved_* (or leave function as-is if no revert of migration).

---

## Fix — Discover “Save idea” dead link + /family sync with subnav

- **Bugs addressed:** (1) On /discover, “Save idea” / “Save” did nothing (RPC missing or silent failure). (2) Subnav showed “3 ideas” but /family showed 0 (family only read `user_list_items`; when migration not applied, table missing or empty).
- **What changed:** (1) **Discover:** `handleSaveCategory` and `handleSaveToList` (and replay handlers) now try `upsert_user_list_item` RPC first; if it fails with function/relation missing (e.g. code 42883), fall back to legacy `user_saved_ideas` / `user_saved_products` upsert so Save idea/Save work before migration. Success path shows a “Saved.” toast. (2) **/family:** `FamilyDashboardClient` `fetchList` tries `user_list_items` first; on error (e.g. 42P01 or “user_list_items does not exist”), falls back to fetching `user_saved_ideas` and `user_saved_products` and mapping to the same list shape so Ideas/Products tabs show the same counts as the subnav.
- **Proof:** `pnpm -C web build` passes. Manual: sign in → /discover → click “Save idea” on a category → see “Saved.” toast and subnav count update; go to /family → Ideas tab shows saved ideas. If migration not applied, both Save and /family still work via legacy tables.
- **Rollback:** Revert the commit(s) that added fallbacks.

---

## Fix — /family Figma prototype alignment (cards + child data)

- **Goal:** Align /family dashboard with Figma Manage Family prototype: card visuals (image, title, saved time, Want/Have pill, examples + Gift list), and child data from profile.
- **What changed:** (1) **Child data:** FamilyDashboardClient fetches real children from `children` table (id, birthdate, age_band); child chips show “My child · {ageBand}” (age from age_band or calculateAgeBand(birthdate)); “+ Add child” links to /app/children/new. Personalization strip uses “My child (aged X): —” and a short next-steps placeholder. (2) **List cards (Figma-style):** List items use card layout: aspect-square image (from pl_category_types.image_url or products.image_url), title, “Saved X ago”, Want/Have pill toggle, “examples” (link to /discover), “+ Gift list” (toggles gift); gift badge (Gift icon) on image when row.gift. Fetch includes image_url in products and pl_category_types joins (and legacy fallback). (3) **Next steps / Remind me:** Copy updated to match placeholder messaging.
- **Proof:** `pnpm -C web build` passes. Manual: sign in → /family → child chips show real profiles or “My child · —”; list cards show image, title, saved time, Want/Have pill, examples, Gift list.
- **Rollback:** Revert the commit(s).

---

## Fix — /family: images, Want/Have toggle, Remind me sync, Gift list

- **Goal:** Match Figma and fix four issues: (1) list card images from same source as /discover; (2) Want/Have as a single toggle; (3) Remind me as toggle in sync with subnav; (4) “+ Gift list” working with “Successfully added” feedback.
- **What changed:** (1) **Images:** Family list cards use `v_gateway_category_type_images` for category/idea images (same as /discover). After loading items, component fetches that view by `category_type_id` and merges into `categoryImageMap`; `getItemImageUrl(row, categoryImageMap)` prefers the map for category/idea, then falls back to joined `pl_category_types.image_url` or `products.image_url`. (2) **Want/Have:** Single pill control with `role="group"` and `aria-pressed` so it reads as one toggle (Want | Have). (3) **Remind me:** Replaced checkbox with `SubnavSwitch`; state comes from `useSubnavStats().stats.remindersEnabled`; `handleRemindersChange` upserts `user_notification_prefs.development_reminders_enabled` and calls `refetchSubnavStats()` so /family and subnav stay in sync. (4) **Gift list:** “+ Gift list” calls `updateItem(row, { gift: true })` (await); `updateItem` returns `Promise<boolean>`. On success, set `giftSuccessId` and show green “Successfully added” for 3s, then “On gift list”. If already on list, show “On gift list” only.
- **Proof:** `pnpm -C web build` passes. Manual: /family list cards show discover images when present; Want/Have is one pill; Remind me toggle matches subnav; click “+ Gift list” → “Successfully added” (green) → “On gift list”, item in Gifts tab.
- **Rollback:** Revert the commit(s).

---

## Fix — /family: Want/Have slider, Gift list button, Product images

- **Bugs addressed:** (1) Want/Have in My list was pill buttons, not a toggle slider; (2) “+ Gift list” still dead (click not adding to Gifts tab); (3) Products tab images not pulling through (same source as /discover).
- **What changed:** (1) **Want/Have:** Replaced pill with `SubnavSwitch` (sliding toggle) with “Want” and “Have” labels; `checked={row.have}`, `onCheckedChange` calls `updateItem(row, { have: checked })`. (2) **Gift list:** Button uses `e.preventDefault()` and `e.stopPropagation()`; handler calls `updateItem(row, { gift: true }).then(ok => …)` so the promise is handled and success sets `giftSuccessId` for “Successfully added” feedback. (3) **Product images:** Same source as /discover: after loading items, fetch `v_gateway_products_public` for product ids in the list (`select('id, image_url').in('id', productIds)`), build `productImageMap`; `getItemImageUrl(row, categoryImageMap, productImageMap)` uses `productImageMap` for product rows first, then joined `products.image_url`.
- **Proof:** `pnpm -C web build` passes. Manual: /family Ideas & Products tabs show Want/Have as a switch; “+ Gift list” adds item to Gifts tab and shows “Successfully added”; Products tab cards show images when present in gateway.
- **Rollback:** Revert the commit(s).

---

## Fix — /family: Toggles + Gift list + Product images (optimistic UI + errors + image fallback)

- **Bugs addressed:** Want/Have toggles and Gift list button still not working; product images showing “No image”.
- **What changed:** (1) **Optimistic UI:** Added `optimisticHave` and `optimisticGift` state so the toggle and “+ Gift list” update immediately on click; on RPC failure state reverts. (2) **Error feedback:** `updateItem` now sets `actionError` on RPC failure (and on “function does not exist” shows “My list isn’t set up yet. Run the database migration.”); error message shown above the list. (3) **Product images:** Product image fetch now uses both `v_gateway_products_public` and `products` table (`Promise.all`); first fill from gateway view, then fill missing from `products.id, image_url` so images show when gateway has no row for that product. (4) **Handlers:** Want/Have uses dedicated `handleHaveChange` that sets optimistic state then calls `updateItem`; Gift list handler sets `optimisticGift` then `updateItem`, reverts on failure.
- **Proof:** `pnpm -C web build` passes. Manual: /family → toggle Want/Have (moves immediately; if migration not applied, reverts and shows error); click “+ Gift list” (shows “Successfully added” or error); Products tab shows image when present in gateway or products table.
- **Rollback:** Revert the commit(s).

---

## chore(prod): sync /family improvements to main

- **Goal:** One safe PR to bring intended /family changes from feature branches onto main (production drift fix). No new features; sync only.
- **Source branch:** feat/family-my-list-plumbing (full list plumbing + images, Want/Have toggle, Gift list, child data, Discover fallback).
- **What changed:** Merged origin/feat/family-my-list-plumbing into feat/prod-sync-family (from main). Resolved conflicts in PROGRESS.md, state/latest.json, FamilyDashboardClient.tsx (kept incoming full dashboard).
- **Commits included:** 551fd2e (merge), b7c7148, 49d74b9, 7791092, 0ced016, 1728f20, e0dd25b, a80e742. Final SHA after merge: 551fd2e (or GitHub-created merge commit).
- **PR:** Open at https://github.com/glownest2026-droid/ember/compare/main...feat/prod-sync-family — title: "chore(prod): sync /family improvements to main". Description in `.pr_prod_sync_family_body.md`.
- **Proof:** cd web && pnpm install && pnpm run build passes. Manual: /family shows real list, toggles, images; Discover Save idea works; apply migration 202602250000 if not already in production.
- **Rollback:** Revert PR. DB: DROP TABLE IF EXISTS public.user_list_items CASCADE; restore get_my_subnav_stats from 202602190000 if needed.

---

## Service Pack PR 1 — Navbar polish + counters (2026-02-26)

- **Goal:** One PR: navbar signed-in UX (remove “Signed In” text, move Sign out far right, add “Manage Family” → /family) and fix subnav gift counter so it shows real count, not undefined.
- **What changed:** (1) **Navbar** (`DiscoverStickyHeader.tsx`): Removed “Signed In” text; layout flex `justify-between` with left group (Logo, Ember, About, Manage Family, Account) and right group (Sign out). “Manage Family” and “Account” visible only when signed in; “Sign out” far right. (2) **Gift counter:** New migration `supabase/sql/202602261000_subnav_gifts_count.sql` — `get_my_subnav_stats()` now returns `gifts_saved_count` (count from `user_list_items` where `user_id = auth.uid()` and `gift = true`). `SubnavStatsContext` reads `gifts_saved_count` from RPC and defaults to 0; `SubnavBar` displays with defensive `typeof stats.giftsSaved === 'number' ? stats.giftsSaved : 0`.
- **Routes touched:** Global header (all routes); subnav (signed-in only: /, /discover, /family).
- **Verification:** Signed OUT: navbar shows only Logo, Ember, About, “Join free”. Signed IN: no “Signed In” text; “Manage Family” (→ /family) and “Account” visible; “Sign out” far right; subnav gift counter shows a number (0 if none), never undefined. Check /, /discover, /family.
- **Preview URL:** (set after PR opened; Vercel bot comment.)
- **Known debt:** None. Apply migration `202602261000_subnav_gifts_count.sql` in Supabase SQL Editor if not yet in production so gift counter reflects real data.
- **Rollback:** Revert PR. If migration was applied: re-run `202602250000_family_user_list_items.sql` PART 3 (get_my_subnav_stats without gifts_saved_count) or leave as-is (extra key in JSON is harmless).

---

## Service Pack PR 2 — /family Examples modal (2026-02-26)

- **Goal:** /family “Examples” capitalised; clicking “Examples” on a saved idea opens a modal that shows example cards using the same DiscoverCardStack widget as /discover “Next steps for…” section. No DB/schema changes.
- **What changed:** (1) **Capitalisation:** “examples” → “Examples” in FamilyDashboardClient list row (link and disabled span). (2) **Examples modal:** New `FamilyExamplesModal` (backdrop, X, Esc) and API route `GET /api/discover/picks?ageBandId=&categoryTypeId=` that returns picks via existing `getGatewayTopPicksForAgeBandAndCategoryType`. For idea/category rows with `category_type_id`, “Examples” opens the modal; modal fetches picks and renders `DiscoverCardStack` (same as /discover). Product rows keep “Examples” as link to /discover. (3) **Save/Have in modal:** Handlers call `upsert_user_list_item` and refetch list/subnav (signed-in only; /family is auth-gated).
- **Routes touched:** /family; shared reuse: `DiscoverCardStack`, `web/src/components/family/FamilyExamplesModal.tsx`, `web/src/app/api/discover/picks/route.ts`.
- **Verification:** Signed in → /family → confirm “Examples” capitalised. Click “Examples” on a saved idea (idea or category row) → modal opens with title “Examples for {idea title}”, example cards (same layout as /discover), loading/empty states. Close via X, backdrop click, or Esc. Confirm /discover “Next steps for…” and examples section unchanged (no regression).
- **Preview URL:** (set after PR opened; Vercel bot comment.)
- **Known debt:** None. PR3 will handle /discover “Saved to …’s ideas” personalisation + CTA link rename to /family.
- **Rollback:** Revert PR; no DB changes.

---

## Service Pack PR 3 — /discover save modal personalisation + CTA to /family (2026-02-26)

- **Goal:** After saving an idea on /discover, confirmation modal shows personalised copy (“Saved to {Name}'s ideas” / “your son's ideas” / “your daughter's ideas” / “your child's ideas”) and CTA “View my toy ideas” linking to /family. No DB/schema changes. Also: /family Products tab image sourcing aligned with /discover.
- **What changed:** (1) **SaveToListModal** (`web/src/components/ui/SaveToListModal.tsx`): Exported helper `savedToCopy({ name, gender })` (UK English; apostrophe “Poppy's ideas”; gender male/m/boy/son → son, female/f/girl/daughter → daughter). (2) When modal is open and signed in, if no `savedToLabel` prop: default headline “Saved to your child's ideas”; fetch first child's `gender` from `children` (user-scoped) and update headline. Optional prop `savedToLabel` lets callers override. (3) Replaced “Saved to your list” with computed label; replaced “View my list” with “View my toy ideas” and `href="/family"`. No name fetched from DB (privacy). (4) **/family Products tab image fix:** `FamilyDashboardClient` product image fetch now uses the same sourcing as /discover “Examples you might like”: query `v_gateway_products_public` with `.order('age_band_id').order('category_type_id').order('rank')` so “first wins” per product is deterministic; then fall back to `products` table for missing. Comment clarified for `getItemImageUrl`. (5) When no image is available, show Lucide ImageOff icon instead of "No image" text. For product rows: replace "Examples" with Search icon + "Visit" linking to retailer URL (same precedence as /discover); productUrlMap built from gateway and products URL columns.
- **Routes/components touched:** SaveToListModal (used by /discover); FamilyDashboardClient (Products tab images, no-image icon, product Visit link); DiscoveryPageClient unchanged (does not pass savedToLabel).
- **Verification:** Signed in on /discover → Save idea → modal shows personalised headline; CTA “View my toy ideas” → /family. No regression to save action. /family → Products tab: product images from gateway/products; no image → ImageOff icon; product rows show Search + "Visit" (retailer link) instead of "Examples".
- **Preview URL:** (set after PR opened; Vercel bot comment.)
- **Known debt:** None. Children table has no name field (privacy); name-based copy only if parent passes `savedToLabel`.
- **Rollback:** Revert PR; no DB changes.

---

# Decision Log (dated)
## 2026-02-13 — fix(discover): Show Examples anchor + swipe progress direction (mobile)

### Summary
- **Anchor lower**: "Show Examples" scroll target was still showing "Chosen for 25–27 months" at the top. Progress bar container scroll-margin changed from `scroll-mt-24` to `scroll-mt-[var(--header-height,4rem)]` so the progress bar is the first visible content (just below the fixed header).
- **Swipe vs progress**: Swiping the product card was moving the progress bar backwards; arrow clicks correctly moved it forwards. Inverted swipe→direction mapping in DiscoverProductCard: swipe left (offset.x < 0) = next card ('right'), swipe right = previous ('left'), so progress advances when user swipes to reveal the next card.

### Files changed
- `web/src/components/discover/DiscoverCardStack.tsx` — progress bar container scroll-mt uses var(--header-height)
- `web/src/components/discover/DiscoverProductCard.tsx` — onSwipe(info.offset.x < 0 ? 'right' : 'left')

### Rollback
Revert commit; no schema changes.

---

## 2026-02-13 — feat(discover): Replace bottom product cards with Figma Product Cards UI

### Summary
- **Bottom product cards on /discover**: Replaced the "Examples you might like" section (AnimatedTestimonials carousel) with the new Product Cards UI from Figma: swipeable card stack (DiscoverProductCard + DiscoverCardStack) with Save / Have / Visit actions, progress bar, Shuffle/Reset/Prev/Next controls. Data unchanged: still uses `picks` or `exampleProducts` from gateway views (v_gateway_*); no new DB/RLS or fabricated data.
- **Components**: DiscoverProductCard (single card: image/icon, age + brand badges, title, rationale, "Why this toy?", actions). DiscoverCardStack (stack of up to 4 visible cards, swipe/controls, maps GatewayPick to card).
- One goal per PR; no hero/doorways/category changes.

### Files changed
- `web/src/components/discover/DiscoverProductCard.tsx` — new (Figma-aligned card UI; motion/react)
- `web/src/components/discover/DiscoverCardStack.tsx` — new (stack + controls)
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — examples section now uses DiscoverCardStack; removed AnimatedTestimonials + albumItems; removed unused imports (Bookmark, Check, ExternalLink, Link, getProductIconKey)

### QA (manual, Vercel preview)
- Go to /discover → select age → select a focus (e.g. "Let me help") → open category or "Show examples". Bottom section shows new card stack. Swipe or use Prev/Next; Shuffle/Reset work. Save / Have / Visit behave as before (sign-in modal when needed, toast, Visit opens product URL).

### Rollback
Revert PR. Restore AnimatedTestimonials + albumItems in DiscoveryPageClient; remove DiscoverProductCard.tsx and DiscoverCardStack.tsx.

---

## 2026-02-12 — feat(discover): Pocket play guide hero (UI-only)

### Summary
- **Discover hero upgrade**: Replace existing /discover hero with premium “Your pocket play guide” hero. Headline (Source Serif 4): “Your pocket” / “play guide” with exact responsive sizes (60px → 128px). Subheadline (Inter 300): “From bump to big steps — science-powered toy ideas for what they’re learning next.” Single CTA “Get started” (accent #FF6347, hover #B8432B) with ArrowRight icon; click scrolls to discovery start (id="discover-start") with prefers-reduced-motion respected.
- **Background**: White hero on canvas #FAFAFA; three gradient layers (warm cream/golden, subtle peach, top-right ember glow) as per Figma snippet; pointer-events-none.
- No DB/RLS/vendor changes. No nav/header/Layer A/B/C or analytics changes.

### Files changed
- `web/src/components/discover/DiscoverHeroPocketPlayGuide.tsx` — new hero component (gradients, typography, CTA)
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — use DiscoverHeroPocketPlayGuide; scroll target id="discover-start"; Back to choices scrolls to discover-start

### QA (browser only, Vercel preview URL)
- **Desktop (1440px)**: Hero ~85vh, text centered, warm glow subtle. Headline Source Serif 4, large at largest breakpoint. Subheadline lighter, max-w-3xl. CTA accent with hover + arrow nudge.
- **Mobile (~390px)**: Headline 60px, tight leading, no overflow. Subheadline 20px, wraps. CTA tappable.
- **Behaviour**: “Get started” scrolls to discovery start; reduced motion respected.

### Rollback
Revert PR (no schema changes). Remove DiscoverHeroPocketPlayGuide import and restore previous hero markup + selectorSection id if needed.

---

## 2026-02-11 — feat(ui): sticky header + calm hero + "What is Ember?" bottom sheet

### Summary
- **Discover-only sticky header**: Replace top-of-page shell on `/discover` with mobile-first sticky header. Left: Ember robin logo (brand-assets URL) + "Ember" text, button scrolls to top. Right: "What is Ember?" (opens bottom sheet), "Join free" (existing `/signin?next=...`). Styling: minimal, border #E5E7EB, white surface, accent #FF6347 / hover #B8432B, safe-area padding.
- **Bottom sheet "What is Ember?"**: Reusable sheet; close by swipe down, X icon, tap outside. Exact copy: What it does / How it works (bullets) / Privacy. Single CTA "Join free".
- **Calm hero**: Replace hero with 240–320px responsive container; gradient + subtle ember glow; exact copy: "Guided toy shopping. From bump to big steps." / "See what they're learning next - and what to buy for it." / "Use what you've got. Add what you need."
- **5 regression fixes**: (1) Header alignment + logo size (max-w-7xl, h-6/h-7 logo). (2) "Show examples" cursor + hover underline. (3) "Explained ⓘ" + "Why these?" open HowWeChooseSheet (exact "How Ember chooses" copy). (4) Layer B carousel reset on doorway change (resetKey). (5) "Have them" wired with toast.
- **Residual**: (1) Header: bigger logo h-7/h-8, max-w-6xl wrapper. (2) What is Ember?: desktop = centered modal (720px/92vw), mobile = bottom sheet. (3) Auto-scroll to Next steps on tile click (ref + setTimeout, reduced-motion). (4) Have them / Have it already: signed out → auth modal + toast; signed in → toast and/or /api/click.
- No DB/RLS/gateway. No new deps.

### Files changed
- `web/src/components/discover/DiscoverStickyHeader.tsx` — sticky header + alignment + logo size
- `web/src/components/discover/WhatIsEmberSheet.tsx` — bottom sheet
- `web/src/components/discover/HowWeChooseSheet.tsx` — new: "How Ember chooses" sheet (single source of truth)
- `web/src/components/discover/CategoryCarousel.tsx` — Show examples affordance; resetKey; Have them cursor
- `web/src/components/ConditionalHeader.tsx` — DiscoverStickyHeader when path /discover
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — hero; Explained ⓘ / Why these? → HowWeChooseSheet; resetKey; howWeChooseOpen state

### QA (founder, browser only — Vercel preview URL)
A) Desktop header: logo readable; no giant middle space; actions right. B) Desktop "What is Ember?" = centered modal. C) Mobile "What is Ember?" = bottom sheet. D) Click development tile → scrolls to Next steps. E) "Have them" / "Have it already": signed out → auth modal + toast; signed in → toast/click.

### Rollback
Revert PR (no schema changes).

---

## 2026-02-09 — feat(discover): frictionless load + swipe-first carousels + Save-first CTAs

### Summary
- **Default load**: B/C sections hidden until doorway selected; server passes `selectedWrapperSlug` from URL only; category types fetched only when wrapper in URL.
- **No "See next steps"**: Doorway tile click sets selection, updates URL, scrolls to Layer B (next steps). Respects `prefers-reduced-motion` for scroll behavior.
- **Swipe carousels**: Layer B = horizontal scroll-snap (overflow-x-auto, snap, hidden scrollbar). Layer C = swipe/drag on stacked cards to change active index (40px threshold so taps don’t trigger).
- **CTA hierarchy**: B = Save idea (primary), Have them (outline), Show examples (ghost). C = Save product (primary), Have it already (outline), Visit (ghost).

### Files changed
- `web/src/app/discover/[months]/page.tsx` — selectedWrapperSlug from URL only; categoryTypes when slug set
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — remove See next steps; doorway click scroll to B; Layer C button order + labels
- `web/src/components/discover/CategoryCarousel.tsx` — scroll-snap carousel; button order (Save idea primary, Show examples tertiary)
- `web/src/components/ui/animated-testimonials.tsx` — swipe/drag to change active index

### QA (browser only, preview URL)
1. Load /discover/26 → only doorway tiles. 2. Tap doorway → scroll to B, categories correct. 3. Swipe B + arrows. 4. Save idea primary, Show examples tertiary. 5. Show examples → C appears. 6. Swipe C. 7. Reduce motion → no smooth scroll.

### Rollback
Revert PR (no schema changes).

## 2026-02-09 — feat(save): open "Save to my list" as a modal (no navigation)

### Summary
- **SaveToListModal**: New accessible modal using native `<dialog>` — focus trap, ESC close, backdrop click close, focus return to trigger. Signed out: Sign in / Join free links; **Email address** field + magic link (same as /signin); Not now.
- **DiscoveryPageClient**: "Save to my list" (Layer C) and **CategoryCarousel** "Save idea" (Layer B) both open the same modal.
- No page navigation unless user chooses Sign in, Join free, View my list, or submits magic link. "Have it already" / "Have them" unchanged.

### Files changed
- `web/src/components/ui/SaveToListModal.tsx` — modal + email magic link
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — Save button + handleSaveCategory
- `web/src/components/discover/CategoryCarousel.tsx` — Save idea button + onSaveIdea

### QA checklist (founder manual)
1. `pnpm -C web build` passes
2. Preview → /discover/26 → select doorway → See next steps → Layer C products
3. Signed out: Click "Save to my list" → modal, no nav. ESC/backdrop/Not now closes.
4. Signed in: Click "Save to my list" → "Saved" modal, View my list works
5. "Have it already" still works

### Rollback
Revert PR (no schema changes).

## 2026-02-08 — feat(discover): polish category carousel cards (HD image legibility + peek next/prev)

### Summary
- **Category card media**: Fixed 4:3 aspect ratio (better vertical space for overlay text; works well for category/product imagery). Image uses object-cover; fallback gradient + Sparkles. Calm scrim overlay (stronger toward bottom) for text legibility.
- **Text legibility**: Title and “why” line-clamp-2; “More” as stable ghost pill over scrim. Actions area has solid surface so buttons are always readable. Ember tokens: borders #E5E7EB, text #1A1E23/#5C646D, accent #FF6347 / deep #B8432B.
- **Peek/tease carousel**: Desktop card 380px, ~80px peek each side; mobile 320px card, ~40px peek. Active card centered; prev/next arrows + counter; clicking teased card advances. User-controlled only (no auto-advance).
- **Reduced motion**: useReducedMotion (motion/react); when set, carousel transform uses no transition.

### Files changed
- `web/src/components/discover/CategoryCarousel.tsx` — card refactor (4:3 media, scrim, pill), peek carousel layout, reduced motion

### QA checklist (founder manual)
1. Open Vercel preview → /discover/26
2. Select doorway → click “See next steps”
3. Navigate carousel to “Tea sets and tableware” (or any category with HD image)
4. Confirm: image crops nicely (no awkward stretching); title and why text readable over image; “More” affordance stable and usable
5. Confirm desktop shows a “peek” of next/prev card
6. Confirm mobile layout has no overlap and buttons are tappable
7. Confirm “Show examples” still reveals Layer C products
8. Turn on Reduce Motion (OS) and refresh: carousel still works, motion simplified

### Rollback
Revert PR (no DB/schema changes).

## 2026-02-08 — fix(discover): Layer B guidance polish (public label header + readable why text)

### Summary
- **Header label fix**: In "Next steps for …", use the same parent-friendly label shown in the doorway tile grid (e.g. "Play with others"). Label derived from doorway definition the user selected, not gateway wrapper ux_label.
- **Category tile why readability**: 2-line clamp with ellipsis for rationale; native title tooltip on hover; "More" / "Less" toggle for full text on tap or click.

### Files changed
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — selectedWrapperLabel from doorway.label (prefer over wrapper.ux_label)
- `web/src/components/discover/CategoryCarousel.tsx` — rationale line-clamp-2, More/Less expand, title tooltip

### QA checklist (founder manual)
1. Open Vercel preview → /discover/26
2. Select "Play with others"
3. Confirm header says "Next steps for Play with others"
4. On a category tile, confirm the "why" line shows cleanly (up to 2 lines)
5. Confirm full "why" text accessible via hover tooltip or tap "More"
6. Confirm "Show examples" still reveals products correctly

### Rollback
Revert PR (no DB changes).

## 2026-02-08 — feat(discover): vertical A→B→C next steps flow (category carousel + optional examples)

### Summary
- **Vertical journey**: /discover is now a guided vertical flow: selector (Layer A) → Next steps (Layer B) → Examples (Layer C). Products are only revealed after user clicks "Show examples" on a category tile.
- **Layer B**: Category carousel (user-controlled, no auto-advance) with tiles showing category imagery (from `pl_category_type_images` or `pl_category_types.image_url`). CTAs: Save idea, Have them, Show examples. Empty state: "We're adding more ideas here." when no category types.
- **Layer C**: AnimatedTestimonials product album. Product face: one-line why-it-fits, "More details" drawer for long rationale. WhyThese drawer explains chain: Chosen for {age band} • Focus: {doorway} • Category: {selected category} with 2–4 bullets.
- **Scroll anchors**: "See next steps ↓" scrolls to Layer B; "Back to choices" scrolls to selector. Respects prefers-reduced-motion (no smooth scroll when reduced).
- **DB**: `pl_category_type_images` table + `v_gateway_category_type_images` view for founder-managed category imagery. Canonical table protected; public reads via gateway view only.

### Files changed
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — vertical layout, state machine, scroll anchors, CategoryCarousel, WhyThese chain
- `web/src/app/discover/[months]/page.tsx` — fetch category types, pass to client
- `web/src/lib/pl/public.ts` — getGatewayCategoryTypesForAgeBandAndWrapper, getGatewayCategoryTypeImages, image join
- `web/src/components/discover/CategoryCarousel.tsx` — Layer B carousel (user-scrolled, Lucide icons)
- `web/src/components/ui/animated-testimonials.tsx` — AlbumItem.longDescription, "More details" drawer, line-clamp quote
- `supabase/sql/202602080000_pl_category_type_images.sql` — pl_category_type_images table + v_gateway_category_type_images view

### QA checklist (founder manual)
1. `pnpm install` then `pnpm run build` (passes).
2. Open /discover or /discover/26. Select a doorway → "Next steps" section appears below.
3. Click "See next steps" → scrolls to Next steps section.
4. Next steps shows category carousel (or empty state). Prev/Next buttons work; no auto-advance.
5. Click "Show examples" on a category tile → Examples section appears, scrolls into view, products load.
6. Product face: one-line quote; "More details" expands when rationale is long.
7. "Why these?" shows chain: age band, focus, category (when available).
8. Save to my list | Have it already | Visit work on products.
9. Reduced motion ON → scroll uses instant jump.
10. Apply migration `supabase/sql/202602080000_pl_category_type_images.sql` in Supabase SQL Editor to enable founder-managed category imagery.

### Rollback
- Revert PR. If migration applied: `DROP VIEW v_gateway_category_type_images; DROP TABLE pl_category_type_images;`

## 2026-02-06 — PR3: Discover animated product album (Aceternity shuffle)

### Summary
- **Right panel**: Replaced the list of 3 idea cards with an Aceternity-style **animated product album** (stacked cards + next/prev, word-by-word blur reveal). Same interaction and timing feel as Aceternity Animated Testimonials.
- **Album items**: Up to 12 products from existing gateway read path (picks or example products). No filtering by “has image”: if `product.image_url` exists show image; else show **icon tile** (Lucide icon in #B8432B on soft gradient background, rounded-3xl).
- **Icons**: `web/src/lib/icons/productIcon.ts` — `getProductIconKey(product, focusDoorwayLabelOrSlug)` with fixed mapping for 12 doorways; no DB backfill.
- **Actions**: Save to my list | Have it already | Visit on each item (renderActions slot). Have it already unchanged (POST /api/click, source: discover_owned).
- **Layout**: Responsive grid (image stack left, text right on md+; stacked on narrow). `prefers-reduced-motion` respected (no y-bounce, reduced blur).
- **Deps**: motion, clsx, tailwind-merge; `cn()` in `web/src/lib/utils.ts`. No @tabler/icons-react; Lucide ChevronLeft/ChevronRight.

### Proof
- Manual QA only (no headless screenshots, no GitHub API polling). See QA checklist below.

### Files changed
- `web/src/components/ui/animated-testimonials.tsx` — new (AlbumItem, image or icon tile, blur reveal, reduced-motion)
- `web/src/lib/utils.ts` — new (cn)
- `web/src/lib/icons/productIcon.ts` — new (getProductIconKey, doorway → icon mapping)
- `web/src/app/discover/[months]/page.tsx` — fetch 12 picks / 12 example products
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — albumItems from displayIdeas, AnimatedTestimonials + renderActions; removed IdeaCard

### QA checklist (founder manual)
1. `pnpm install` then `pnpm run build` (passes).
2. Open /discover (or /discover/26), choose a focus, click “Show my 3 ideas”.
3. Right panel shows album: stacked “photos” (images or icon tiles), next/prev arrows, 1/12 counter.
4. Next/Prev cycle smoothly; text area shows title, optional subtitle, quote with word-by-word blur.
5. Items without image show icon tile (gradient + Lucide icon).
6. Save to my list | Have it already | Visit present and clickable; “Have it already” shows toast.
7. Reduce motion: enable OS “Reduce motion” → no bounce, quote shows without blur animation.
8. No console errors.

### 2026-02-07 — Component alignment to Aceternity + useReducedMotion
- **animated-testimonials.tsx** aligned to Aceternity source: AnimatePresence stack, active card `y: [0,-80,0]`, deterministic `hashToRotation(id)`; Motion `useReducedMotion()` — when reduced: no bounce, no rotate, quote without word blur. Icon tiles: white surface + border + #B8432B stroke. Preview URL: set after push/Vercel. Rollback: revert PR (no DB changes).

## 2026-02-05 — Acquisition landing course-correct (hero v2, doorways 12→6+See all, icons, Have it already)

### Summary
- **Hero**: Exact 3 lines (H1, subheader, reassurance); no extra trust line. Faded Pexels background image behind hero; hero + main content in same `max-w-7xl` wrapper for alignment.
- **Doorways**: 12 needs, 6 default + "See all"; section **"What they're learning right now"** + guide copy; 1:1 mapping to existing gateway wrapper slugs; Suggested pills for 25–27m on Do it myself, Big feelings, Little hands; default selected for 25–27m = Do it myself; selected glow 0px 0px 28px rgba(255,99,71,0.35), 0px 10px 30px rgba(0,0,0,0.06); tile label/helper line-clamp-2. **Removed** "We only use age to tailor ideas." under age slider.
- **Layout**: Bottom two containers (left/right columns) aligned with hero and nav by wrapping hero + main in one `max-w-7xl mx-auto px-4 sm:px-6` container.
- **Product cards**: getProductIcon (Sparkles fallback); never exclude products for missing images; **"Why?"** from `product.rationale` (data layer: rationale = stage_reason \| age_suitability_note); buttons: **Bookmark** + "Save to my list", **Check** + "Have it already", **ExternalLink** + **"Visit"** (was "View"); icon colour #B8432B.
- **Have it already**: Event capture via POST /api/click with source: discover_owned; toast "Marked as have it already." (best-effort; 401 when signed out still shows toast).
- **Copy**: ideas/my list; no AI, magic, algorithm, unlock, smart on /discover.
- **/new**: Redirect to /discover preserving params (unchanged).

### Follow-up (not in this PR)
- **Have it already persistence**: Add saved/owned status to existing save pipeline or new table when safe minimal migration is available. See TODO in codebase; no DB/RLS changes in this PR.

### Files changed
- `web/src/lib/discover/doorways.ts` — ALL_DOORWAYS (12), DEFAULT_DOORWAYS, MORE_DOORWAYS, helper text, SUGGESTED_DOORWAY_KEYS_25_27, DEFAULT_WRAPPER_SLUG_25_27
- `web/src/lib/discover/ideaIcons.ts` — getProductIcon, Sparkles default
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — hero (unchanged), doorways section, IdeaCard with getProductIcon + Have it already + toast
- `web/src/app/discover/[months]/page.tsx` — default wrapper for 25–27m (let-me-help)

### Rollback
Revert PR (no DB changes).

## 2026-02-03 — Discovery polish: glow, truncation, icons

### Summary
- **Stronger tile glow**: box-shadow 0 0 26px rgba(255,99,71,0.48) + 0 10px 24px; translateY(-1px); 250ms transition; prefers-reduced-motion respected.
- **Tile truncation**: min-h-[120px], title + subtitle line-clamp-2, title attr for hover, leading-snug.
- **Idea icons**: `lib/discover/ideaIcons.ts` with iconForIdea(title, categoryTypeLabel, categoryTypeSlug, productId); deterministic keyword mapping; ICON_OVERRIDES for product UUIDs; always returns icon.
- **Icon accent #B8432B**: doorway tiles + idea cards use icon accent.

### Files changed
- `web/src/lib/discover/ideaIcons.ts` — new iconForIdea resolver
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — glow, truncation, icon imports
- `web/src/app/discover/[months]/_lib/ideaIcons.tsx` — removed (replaced by lib)

### Rollback
Revert PR (no DB changes).

## 2026-02-03 — Discovery V1.0 doorways

### Summary
- **Copy sweep**: picks→ideas, shortlist→my list, "Your 3 picks"→"A quick example" (pre) / "Three ideas for {Focus}" (post). Chips: No child details, Under a minute, Clear reasons. Headline: "Three age-right ideas in under a minute."
- **6 Today doorways + More**: Burn energy, Quiet focus, Big feelings, Let me help, Talk & stories, Play together. "More" reveals remaining wrappers. Mapping in `lib/discover/doorways.ts`.
- **Right panel Narnia hook**: Pre-interaction shows "A quick example" with 3 real example idea cards from gateway (getGatewayTopProductsForAgeBand). Post-interaction: "Three ideas for {Focus}" with filtered ideas + "Why these?" inline drawer.
- **Idea card icons**: ideaIconForTitle() deterministic mapping (Package default). Icons render with #5C646D, 16px, stroke 1.5.
- **/new redirect**: /new and /new/[months] 308 redirect to /discover.

### Files changed
- `web/src/lib/discover/doorways.ts` — 6 doorway defs + resolveDoorwayToWrapper
- `web/src/lib/pl/public.ts` — getGatewayTopProductsForAgeBand
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx` — new doorways UI
- `web/src/app/discover/[months]/_lib/ideaIcons.tsx` — ideaIconForTitle
- `web/src/app/discover/[months]/_lib/wrapperIcons.tsx` — getWrapperIcon
- `web/src/app/discover/[months]/page.tsx` — exampleProducts, DiscoveryPageClient
- `web/src/app/new/page.tsx` — redirect to /discover
- `web/src/app/new/[months]/page.tsx` — redirect to /discover/[months]
- `web/src/components/ConditionalHeader.tsx` — homeHref /discover for both

### Verification (Proof-of-Done)
- `pnpm install` + `pnpm run build` — ✅

### Rollback
Revert PR (no DB changes).

## 2026-02-03 — Website Brand Refresh (Brandbook)

### Summary
- Applied brandbook design tokens site-wide (excluding /new/ path which was recently refreshed).
- **Design tokens**: Added ember-shadow-ambient, ember-glow-active, ember-alpha-disabled, ember-radius-button (8px), ember-radius-card (12px). Typography: H1/H2 Serif (Source Serif 4), H3+ Sans (Inter). Body line-height 1.6.
- **DEFAULT_THEME**: Updated to Brandbook palette — ember-accent-base (#FF6347), ember-accent-hover (#B8432B), ember-bg-canvas (#FAFAFA), ember-text-high (#1A1E23), ember-text-low (#5C646D), ember-border-subtle (#E5E7EB). sourceserif4_inter font pair for headings.
- **Header**: All navigation headers use ember tokens (accent, text, border, radius-8). Wordmark gradient, buttons, nav links aligned to brandbook.
- **globals.css**: Cards use radius-12, ember-shadow-ambient; buttons radius-8, ember-accent-base; inputs radius-8, ember-focus-ring. prefers-reduced-motion respected.
- **layout.tsx**: themeColor #FF6347 (ember-accent-base).

### Files changed
- `web/src/app/globals.css` — Brandbook tokens, typography, card/btn/input radius
- `web/src/lib/theme.ts` — DEFAULT_THEME brandbook palette
- `web/src/components/ThemeProvider.tsx` — sourceserif4_inter font pair, default fallbacks
- `web/src/components/Header.tsx` — ember tokens, radius-8
- `web/src/app/layout.tsx` — themeColor #FF6347

### Verification (Proof-of-Done)
- `pnpm install` (in `/web`) — ✅
- `pnpm run build` (in `/web`) — ✅

### Rollback
- Revert PR (frontend only).

## 2026-02-03 — Discovery Page UI Overhaul (Ember 2026 spec)

### Summary
- End-to-end UI overhaul of the Discovery flow to match the Unified UX + Brand Implementation Brief.
- **Routes**: `/new` and `/new/[months]` remain the canonical discovery flow; **added `/discover` and `/discover/[months]** as aliases using the same `NewLandingPageClient` component (no duplication). Existing `/new` deep links unchanged.
- **Design tokens**: Added Ember 2026 CSS variables (ember-bg-canvas, ember-surface-primary, ember-text-high/low, ember-accent-base/hover, ember-focus-ring, etc.) in `globals.css`. Font variables `--font-serif` (Source Serif 4), `--font-sans` (Inter), `--font-mono` (IBM Plex Mono); Source Serif 4 and IBM Plex Mono loaded via ThemeProvider.
- **Page layout**: Page background #FAFAFA; single central surface container (white, 12px radius, 0px 4px 24px rgba(0,0,0,0.04)); max-width mobile 100%, tablet 640px, desktop 720px. Orange gradient removed.
- **Header**: H1 serif, calm copy (“Ideas that fit this stage.”); supporting line Inter 16px ember-text-low. Three trust chips only: “No child name”, “Under a minute”, “Reasoned picks” (ember-surface-soft, no icons).
- **Slider**: Track inactive/active per spec; thumb 20px, accent fill, focus ring 2px #D44D31; age label IBM Plex Mono 14px; helper copy: “We only use age to tailor ideas.”
- **Wrapper grid**: 2 cols mobile/tablet, 3 desktop; tile border default, selected state glow only (0px 0px 16px rgba(255, 99, 71, 0.4)), no fill change. No invented icons.
- **CTA**: Single “Show my 3 picks”; disabled until age resolved + one wrapper selected (30% opacity); hover ember-accent-hover; microcopy “Takes about a minute.”
- **Picks section**: Destination feel; calm empty states; “Why these?” text-only button toggles **inline** expansion (no modal). Reasoning block: serif heading, Inter body, up to 3 bullets (age + selected focus), no AI/algorithm language.
- **Motion**: 250ms, cubic-bezier(0.4, 0, 0.2, 1); prefers-reduced-motion respected on slider.
- **Copy**: No “Unlock”, “AI”, “Magic”, “Algorithm”, “Smart”, or “moment” language on the page.
- **Security/data**: No DB, RLS, or policy changes; reads remain via gateway public views.

### Files changed
- `web/src/app/globals.css` — Ember 2026 tokens, discovery slider styles, motion vars
- `web/src/components/ThemeProvider.tsx` — Source Serif 4, IBM Plex Mono loaded
- `web/src/app/new/[months]/NewLandingPageClient.tsx` — Full UI overhaul, basePath prop
- `web/src/app/new/[months]/page.tsx` — Pass basePath="/new"
- `web/src/app/discover/page.tsx` — New (redirect to first band)
- `web/src/app/discover/[months]/page.tsx` — New (shared client, basePath="/discover")
- `web/src/components/ConditionalHeader.tsx` — homeHref for /discover

### Verification (Proof-of-Done)
- `pnpm install` (in `/web`) — ✅
- `pnpm run build` (in `/web`) — ✅

### Rollback
- Revert PR (frontend only).

## 2025-12-30
- Decision: Defer "forgot password email reliability" work until Ember has a custom domain and deliberate email sender setup. For now, unblock admin access by creating admin user with password directly in Supabase Auth Users.
- Decision: Maintain invite-only access (no auto-create users; friends must be pre-created in Supabase Auth).
- Decision: Keep PR hygiene strict: one open feature PR at a time; close stale PRs promptly.


------

## 2026-02-01 — PR3b: Age-band-first slider for `/new` (UI only)

### Summary
- Switched the `/new` age control from **month-first** to **age-band-first** (range slider).
- Kept deep links `/new/[months]` working by snapping the month param to the correct age band on load, while showing the age range in the UI.
- `/new` now redirects deterministically to the **first band with picks** (otherwise the newest band).
- Added a calm “catalogue coming soon” empty state for bands with no picks.
- **No DB changes** and no invented coverage.

### Follow-up fix (same branch)
- Fixed overlap tie-break: when a month sits in two bands (e.g. 25), **prefer the newer band** (higher `min_months`), so `/new/25` resolves to `25–27m`.
- Restored public gateway picks flow using **gateway views only**: wrapper grid + “Show my 3 picks” → 3 product cards.
- Slider changes update the URL again using representative mid-month per band (e.g. 23–25 → 24, 25–27 → 26).

### Files changed
- `web/src/app/new/page.tsx`
- `web/src/app/new/[months]/page.tsx`
- `web/src/app/new/[months]/NewLandingPageClient.tsx`
- `web/src/lib/pl/public.ts`
- `web/docs/FEB_2026_DECISION_LOG.md`

### Verification (Proof-of-Done)
- `pnpm install` (in `/web`) — ✅ (already up to date)
- `pnpm run build` (in `/web`) — ✅

### Rollback
- Revert PR (frontend + docs only).

## 2026-02-01 — PR3: 23–25m coverage audit + provenance-safe apply script (no UI changes)

### Summary
- Added a founder-safe audit doc + SQL to determine whether **real** 23–25m picks can be produced from existing Manus-derived DB fields (no inventing/cloning).
- Added an **apply SQL** script that is explicitly gated: it aborts unless the audit proves required tables/columns exist and seed rows exist for `23-25m`.
- **No UI changes** in PR3. UI remains honest-empty until mappings exist.

### Files added
- `web/docs/FEB_2026_23_25_COVERAGE_AUDIT.md`
- `web/docs/FEB_2026_23_25_COVERAGE_APPLY.sql`
- `NEXT.md` (follow-ups not in PR3)

### Verification (Proof-of-Done)
- `pnpm install` (in `/web`) — ✅
- `pnpm run build` (in `/web`) — ✅

### Rollback
- Revert PR (code/doc only).
- If APPLY SQL was run in Supabase: use rollback SQL included in the apply file.

## 2026-01-31 — PR0: Feb 2026 baseline audit snapshot + decision log scaffold

### Summary
- Added a **permanent Feb 2026 baseline audit snapshot** + **decision log scaffold** for the public gateway (`/new`, `/new/[months]`).
- **Docs-only PR0**: no functional changes, no DB changes.

### Files added
- `web/docs/FEB_2026_BASELINE_AUDIT.md`
- `web/docs/FEB_2026_DECISION_LOG.md`

### Verification (Proof-of-Done)
- `pnpm install` (in `/web`) — already up to date
- `pnpm run build` (in `/web`) — ✅ succeeded
- Note: `pnpm run lint` currently fails because `next lint` is not a supported command in Next.js `v16.0.7` CLI; **left unchanged** in PR0 to keep scope docs-only.

### Rollback
- Revert PR.

## 2026-01-15 — Phase A: DB Foundation (Gateway Spine + Curated Public Views)

### Summary
- Created comprehensive SQL migration for Phase A gateway spine tables
- Added curated public views (`v_gateway_*_public`) for anonymous access
- Implemented RLS policies (admin CRUD, public read on views only)
- Added triggers (updated_at, immutability for pl_age_bands.id)
- Populated data from seed tables for MVP age bands (23-25m and 25-27m)
- Included proof bundle for verification

### DB & RLS
- **Migration**: `supabase/sql/202601150000_phase_a_db_foundation.sql`
- **New Tables**:
  - `pl_ux_wrappers` — UX wrapper vocabulary
  - `pl_ux_wrapper_needs` — Wrapper → need mapping (1:1 via UNIQUE)
  - `pl_age_band_ux_wrappers` — Age-band-specific wrapper ranking
  - `pl_age_band_development_need_meta` — Age-band-specific stage metadata
  - `pl_age_band_development_need_category_types` — Age-band-specific need → category mapping
  - `pl_age_band_category_type_products` — Age-band-specific category → product mapping
- **Curated Public Views** (gateway-scoped for security):
  - `v_gateway_age_bands_public` — Only age bands with active wrapper rankings
  - `v_gateway_wrappers_public` — UX wrappers with rank per age band
  - `v_gateway_wrapper_detail_public` — Wrapper + need + stage metadata (NEW)
  - `v_gateway_development_needs_public` — Only needs reachable from active wrappers
  - `v_gateway_category_types_public` — Age-band scoped, only via active mappings (includes age_band_id, development_need_id, rank, rationale)
  - `v_gateway_products_public` — Age-band scoped, only via active mappings, excludes archived (includes age_band_id, category_type_id, rank, rationale)
- **RLS Policies**: Admin CRUD on base tables, public SELECT on curated views only
- **Triggers**: Updated_at triggers on all new tables, immutability trigger for `pl_age_bands.id`

### Data Population
- Ensures age bands "23-25m" and "25-27m" exist
- Populates `pl_development_needs` from `pl_seed_development_needs` (idempotent, only fills missing descriptions)
- Creates UX wrappers from `pl_need_ux_labels` (if exists) for 25-27m
- Populates stage metadata from seed tables for both age bands
- Maps category types to development needs based on `mapped_developmental_needs` (comma-separated)
- Maps products to category types from `pl_seed_products` for both age bands

### Key Features
- **Idempotent**: Safe to re-run (uses IF NOT EXISTS, ON CONFLICT, etc.)
- **Security-first**: Canonical tables remain protected; anonymous users read from gateway-scoped curated views only (no broad exposure)
- **Preflight check**: Verifies `is_admin()` function exists before creating RLS policies
- **Preflight check**: Verifies `products.is_archived` column exists before creating products view
- **Operational toggles**: `is_active` on mapping tables and `pl_ux_wrappers` for soft delete pattern
- **Stage metadata**: Stored per age band per need (not on base tables)
- **Immutability**: Trigger prevents updates to `pl_age_bands.id`
- **Gateway-scoped views**: Views only expose content reachable via active mappings (not all needs/category types/products)
- **Rationale fields**: Added to category types and products views for gateway context

### Verification (Proof-of-Done)
- **Build Status**: ✅ Build passes (`pnpm run build` succeeds)
- **Proof Bundle**: Migration includes embedded proof bundle with counts and sample data
- **Migration File**: `supabase/sql/202601150000_phase_a_db_foundation.sql` (updated with gateway-scoped views, security fixes, and rationale fields)

### Hotfix (2026-01-15, same day)
- **Issue**: Migration failed in Supabase with `ERROR: column "need_name" of relation "pl_development_needs" does not exist`
- **Root Cause**: Migration attempted to use `need_name` column (seed table) instead of `name` (canonical table), and tried to insert seed-only columns into canonical table
- **Fix**: 
  - Replaced all `need_name` references with `name` in `pl_development_needs` operations
  - Only insert canonical columns: `name`, `slug`, `plain_english_description`, `why_it_matters`
  - Stage fields stored only in `pl_age_band_development_need_meta` with age band overlap filtering
  - Fixed variable shadowing bug in product population (`v_age_band_id`)
  - Populated rationale fields in category and product mappings
  - Updated proof bundle with seed import verification indicators
- **PR**: `feat/phase-a-db-foundation-supabase-fix` (hotfix branch)
- **Conflicts resolved by Cursor**: Merged with latest main, kept hotfix changes (name vs need_name), maintained security hardening
- **Hotfix #2 (2026-01-15, same day)**:
  - **Issue**: Supabase error `ERROR: 42702: column reference "product_id" is ambiguous` in Part 10.5 (seed product mapping)
  - **Root Cause**: PL/pgSQL variables (`product_id`, `category_id`, `need_id`, `wrapper_id`) conflicted with column names in INSERT statements
  - **Fix**: Renamed all variables to use `v_` prefix convention:
    * `need_id` -> `v_need_id` (Parts 10.1, 10.3, 10.4)
    * `wrapper_id` -> `v_wrapper_id` (Part 10.2)
    * `category_id` -> `v_category_id` (Parts 10.4, 10.5)
    * `product_id` -> `v_product_id` (Part 10.5)
  - **Safety**: Added comment at top of Part 10 documenting variable naming convention
  - **PR**: `feat/phase-a-db-foundation-supabase-fix-2`
  - **Verification**: Run migration in Supabase SQL Editor; proof bundle should complete without errors
- **Hotfix #3 (2026-01-15, same day)**:
  - **Issue**: Migration ran successfully but wrappers are empty (pl_ux_wrappers = 0, pl_ux_wrapper_needs = 0, pl_age_band_ux_wrappers = 0)
  - **Root Cause**: Wrapper population (Part 10.2) depends on `pl_need_ux_labels` table which was missing or empty
  - **Fix**: Added Part 10.6 fallback wrapper population:
    * Creates wrappers from gateway development needs (from `pl_age_band_development_need_meta`)
    * Uses deterministic naming: `ux_slug = dn.slug` (stable), `ux_label` with CASE mapping for known needs
    * Maps wrappers to needs (1:1 via `pl_ux_wrapper_needs`)
    * Ranks wrappers per age band using `stage_anchor_month` proximity to band midpoint
    * All operations are set-based and idempotent
  - **Updated**: Proof bundle now includes wrapper counts and sample wrapper detail data
  - **PR**: `feat/phase-a-wrapper-population-fix`
  - **Verification**: 
    * Run migration in Supabase SQL Editor
    * Check: `SELECT COUNT(*) FROM pl_ux_wrappers;` (should be > 0, matches distinct needs in meta)
    * Check: `SELECT COUNT(*) FROM pl_age_band_ux_wrappers WHERE age_band_id IN ('23-25m','25-27m');` (should be > 0)
    * Check: `SELECT COUNT(*) FROM v_gateway_wrappers_public;` (should be > 0)
  - **Next Step**: UI cutover to use gateway views (`v_gateway_*_public`) instead of legacy tables

### Migration Application Steps
1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase_a_db_foundation.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)
5. Verify: Age bands exist, UX wrappers created, mappings populated, views accessible

### Known Limitations
- Data population is best-effort (matches by name/slug, may miss some products if names don't match exactly)
- UX wrapper creation depends on `pl_need_ux_labels` table existing (gracefully handles if missing)
- Product matching uses name + brand (may need refinement for exact matching)

### Next Step
- **PR #3**: Wire new Phase A data flow into `/new/[months]` route (read from curated views instead of legacy tables)

------

## 2026-01-15 — Phase A: Ground Truth + Gateway Schema (No Migrations)

### Summary
- Audited current gateway implementation (`/new` and `/new/[months]` routes)
- Documented current data flow (legacy `pl_age_moment_sets` / `pl_reco_cards` pattern)
- Created ground truth documentation and Phase A gateway schema design
- No migrations in this PR (write-only plan for PR #2)

### Routes Audited
- `/new` — Redirects to `/new/26` (default age)
- `/new/[months]` — Main gateway landing page with age slider (24–30 months), moment selection, and top 3 picks display

### Data Fetching (Current)
- Server-side data fetching via `web/src/lib/pl/public.ts`
- Reads from: `pl_age_bands`, `pl_moments`, `pl_age_moment_sets`, `pl_reco_cards`, `pl_category_types`, `products`
- Uses legacy pattern: age band + moment → published set → cards → category types/products

### Legacy Freeze
- **FROZEN** (no new writes for Phase A): `pl_age_moment_sets`, `pl_reco_cards`, `pl_evidence` (legacy), `pl_pool_items`
- Phase A will use new tables: `pl_ux_wrappers`, `pl_age_band_ux_wrappers`, mapping tables

### Documentation Added
- `web/docs/PHASE_A_GROUND_TRUTH.md` — Current state audit:
  - Gateway routes and UI components
  - Supabase read paths
  - Legacy freeze declaration
  - DB reality summary (canonical tables, seed tables, delimiter formats)
  - Discovered surprises (no mock HTML, legacy tables still in use, seed table delimiters)
- `web/docs/PHASE_A_GATEWAY_SCHEMA.md` — Schema design:
  - ERD in text (age band → UX wrapper → development need → category types → products)
  - New tables to be created in PR #2 (7 tables + optional `pl_product_sources`)
  - Curated public views (`v_gateway_*_public`) for anonymous access
  - Updated_at triggers plan (shared function)
  - Immutability plan for `pl_age_bands.id` (trigger prevents updates)
  - RLS stance (canonical tables protected, public reads via curated views only)

### Discovered Surprises
1. **No mock HTML files**: Current implementation appears production-ready
2. **Legacy tables still in use**: Current `/new` route uses legacy `pl_age_moment_sets` / `pl_reco_cards` pattern
3. **Public read policies exist**: `pl_category_types` and `products` have public read policies, but CTO Alex requires curated views instead
4. **Seed table delimiters**: Different formats (comma for `mapped_developmental_needs`, pipe for `evidence_urls`/`evidence_notes`)
5. **Stage metadata in seed tables**: `stage_anchor_month`, `stage_phase`, `stage_reason` exist in seed tables but not on base canonical tables (will be moved to age-specific mapping tables in Phase A)

### Next Step
- **PR #2**: Create migrations for new Phase A tables (`pl_ux_wrappers`, mapping tables, curated public views) + triggers + RLS policies

### Verification (Proof-of-Done)
- Documentation files created: `web/docs/PHASE_A_GROUND_TRUTH.md`, `web/docs/PHASE_A_GATEWAY_SCHEMA.md`
- PROGRESS.md updated with Phase A section
- Build verification: TBD (run `pnpm run build` in `/web`)

------

## 2026-01-15 — Phase 2A: Canonise Layer A (Development Needs)

### Summary
- Canonised Layer A (Development Needs) table with full Manus Layer A CSV data
- Added public read RLS policy (required for MVP landing page with anonymous access)
- Added proof bundle at end of migration for single-paste verification
- Migration is idempotent and safe to re-run

### DB & RLS
- **Migration**: `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
- **Table**: `pl_development_needs` (12 development needs from Manus Layer A CSV)
- **RLS Policies**:
  - `pl_development_needs_admin_all`: Admin CRUD (FOR ALL using is_admin())
  - `pl_development_needs_authenticated_read`: Authenticated users can read
  - `pl_development_needs_public_read`: **Public read (anon + authenticated)** — required for MVP landing page
- **Schema**: 14 columns including need_name, slug, plain_english_description, why_it_matters, min_month, max_month, stage_anchor_month, stage_phase, stage_reason, evidence_urls, evidence_notes
- **Constraints**: UNIQUE on need_name and slug
- **Proof Bundle**: Included at end of migration (prints row count, sample rows, duplicate checks, null checks, RLS policies)

### Key Changes
- **Public Read Access**: Added `pl_development_needs_public_read` policy with `USING (true)` to allow anonymous users to read development needs (required for public MVP landing page)
- **Proof Bundle**: Added DO block at end of migration that prints verification results (row count, samples, duplicates, nulls, policies) — founder runs ONE paste and sees all outputs
- **Idempotent**: Migration safely handles existing table and skips inserts if data already exists

### Implementation Details
- Source of Truth: Manus_LayerA-Sample-Development-Needs.csv (12 development needs)
- Slug generation: Auto-generated from need_name using `slugify_need_name()` function
- Evidence URLs: Stored as TEXT[] array (converted from pipe-separated CSV format)
- All 12 needs populated with complete data (need_name, descriptions, age ranges, stage info, evidence)

### Verification (Proof-of-Done)
- **Proof Bundle Output**: Run migration and check NOTICE messages for:
  - Row count = 12
  - 5 sample rows displayed
  - Duplicate checks = 0 for both need_name and slug
  - Null checks = 0 for all required fields
  - 3 RLS policies listed (admin_all, authenticated_read, public_read)
- **Build Status**: ✅ Build passes (`pnpm run build` succeeds)
- **PR**: https://github.com/glownest2026-droid/ember/compare/main...feat/pl-admin-4-merch-office-v1

### Migration Application Steps
1. Open Supabase Dashboard → SQL Editor
2. Paste entire contents of `supabase/sql/202601150000_phase2a_canonise_layer_a_development_needs.sql`
3. Execute
4. Check NOTICE messages in output (proof bundle runs automatically)
5. Verify: Row count = 12, no duplicates, no nulls, 3 policies

### Known Debt
- None — migration is complete and production-ready

### Patch (2026-01-15, same day)
- **Issue**: Migration failed with `ERROR 23502: null value in column "name" of relation "pl_development_needs" violates not-null constraint`
- **Root Cause**: Legacy schema drift — live table has NOT NULL `name` column that wasn't being populated
- **Fix**: 
  - Added schema reconciliation: detect and add `name` column if missing (for backwards compatibility)
  - Changed from "only if table empty" to UPSERT-based loader using `ON CONFLICT (need_name) DO UPDATE`
  - Added preflight/backfill step: populate `name` from `need_name` (and vice versa) for existing rows
  - UPSERT now populates both `need_name` and `name` (if `name` column exists) to handle legacy schema
- **Result**: Migration is now truly idempotent and robust to legacy schema drift

### Rollback
- Revert PR to remove migration file
- If SQL already applied: Drop `pl_development_needs_public_read` policy if you need to restrict access (but this breaks MVP landing page)

------

## 2026-01-14 — PL Need UX Labels: Scalable UX Wrapper Mapping Table

### Founder Exec Summary

Implemented Option B: a scalable UX wrapper mapping table from development needs (Layer A) to parent-friendly labels ("moments"). Created `pl_need_ux_labels` table and seeded 12 brand director mappings for 25–27m. This enables flexible UX labeling without changing core development needs data.

### Summary

- Added `slug` column to `pl_development_needs` table (if missing) with backfill from `need_name`
- Created `pl_need_ux_labels` table with constraints for primary labels and active slugs
- Seeded 12 brand director mappings for 25–27m (development needs → UX labels)
- Migration is idempotent and handles cases where table/column may not exist

### DB & RLS

- Migration file: `supabase/sql/202601142252_pl_need_ux_labels.sql`
- `pl_development_needs.slug`: Added if missing, backfilled from `need_name` (slugify: lowercase, hyphens, alnum only)
- `pl_need_ux_labels` table: New mapping table with unique constraints for primary labels per need and active slugs
- Constraints: Unique primary label per need, unique active ux_slug
- Updated_at trigger: Uses existing `set_updated_at()` function

### Key code

- `supabase/sql/202601142252_pl_need_ux_labels.sql` — complete migration with slug column logic, table creation, and seeding

### Implementation Details

- Slug generation: Lowercase, keep alnum and spaces, replace spaces with hyphens, collapse multiple hyphens
- Seeding logic: Prefers slug lookup, falls back to exact `need_name` match
- Idempotent: Migration checks for table/column existence before modifying
- Seeded mappings: 12 brand director mappings (e.g., "Color and shape recognition" → "Shapes & colours")

### Verification (Proof-of-Done)

- Migration file exists: `supabase/sql/202601142252_pl_need_ux_labels.sql`
- Verification SQL included in migration file (commented out)
- Expected results: 12 primary active mappings when verification SQL is run
- Migration is idempotent: Can be run multiple times without errors
- All proof routes pass: `/signin`, `/auth/callback`, `/app`, `/app/children`, `/app/recs`, `/ping`, `/cms/lego-kit-demo`

### Verification SQL

Run this in Supabase SQL Editor to verify all primary active mappings:

```sql
SELECT
  dn.need_name,
  dn.slug AS need_slug,
  ul.ux_label,
  ul.ux_slug
FROM public.pl_need_ux_labels ul
JOIN public.pl_development_needs dn ON ul.development_need_id = dn.id
WHERE ul.is_primary = true AND ul.is_active = true
ORDER BY ul.sort_order NULLS LAST, ul.ux_label;
```

Expected: 12 rows showing the mappings (need_name, need_slug, ux_label, ux_slug)

### Migration Application Steps

1. Apply migration via Supabase Dashboard → SQL Editor → paste and run `supabase/sql/202601142252_pl_need_ux_labels.sql`
2. Verify: Run verification SQL to confirm 12 mappings are seeded
3. After migration: `pl_development_needs` has `slug` column (if it didn't before), `pl_need_ux_labels` table exists with 12 seeded rows

### Rollback

- Revert PR to remove migration file
- If SQL already applied: Drop `pl_need_ux_labels` table and remove `slug` column from `pl_development_needs` (if added by this migration)

## 2026-01-04 — PL-0: Product Library Ground Truth & Guardrails

### Summary
- Added PL-0 Supabase SQL migration with pl_* tables and hardened products table RLS
- Created admin-only route `/app/admin/pl` that lists pl_age_bands and pl_moments
- Products table write access (INSERT/UPDATE/DELETE) now requires admin role via user_roles table

### Routes added
- `/app/admin/pl` — admin-only product library stub page (lists age bands + moments)

### DB & RLS
- Migration file: `supabase/sql/202601041654_pl0_product_library.sql`
- Products table: SELECT remains public, INSERT/UPDATE/DELETE are admin-only (via user_roles.role='admin')
- New tables: pl_age_bands, pl_moments, pl_dev_tags, pl_category_types, pl_age_moment_sets, pl_reco_cards, pl_evidence
- All pl_* tables: Admin has full CRUD access
- Public SELECT allowed ONLY for published sets and their related cards/evidence

### Key code
- `supabase/sql/202601041654_pl0_product_library.sql` — complete migration with RLS policies
- `web/src/app/(app)/app/admin/pl/page.tsx` — admin page with graceful handling for unmigrated DB

### Implementation Details
- Products RLS: Dropped all existing policies, recreated SELECT (public) and INSERT/UPDATE/DELETE (admin-only)
- Helper function: `is_admin()` SECURITY DEFINER function checks user_roles table
- Admin page: Uses `isAdmin()` from `web/src/lib/admin.ts` (checks email allowlist + user_roles)
- Graceful degradation: Page shows "DB not migrated yet" message if tables don't exist

### Verification (Proof-of-Done)
- Build passes: `pnpm build` succeeds, `/app/admin/pl` route registered
- SQL migration: File created with all required tables, enums, RLS policies
- Admin access: Non-admin users see "Not authorized" screen
- DB migration: Page handles missing tables gracefully (shows migration message)
- All proof routes pass: /signin, /auth/callback, /app, /app/children, /app/recs, /ping, /cms/lego-kit-demo

### Migration Application Steps
- Apply migration via Supabase Dashboard → SQL Editor → paste and run migration SQL
- After migration: `/app/admin/pl` will display age bands and moments tables

### Rollback
- Revert PR to remove admin page
- If SQL already applied: Drop pl_* tables/types and restore products policies to public select + authenticated write (if needed)

## 2026-01-06 — Manus-ready: Scoring and Gating Logic

### Summary
- Added Manus scoring columns to products and pl_category_types tables
- Created general-purpose pl_evidence table for entity evidence (category_types/products)
- Implemented gating rules in `/app/recs`:
  * Quality gate: (quality_score >= 8) OR (amazon_rating >= 4)
  * Confidence gate: confidence_score >= 5 (or fallback: amazon_rating >= 4.2 AND review_count >= 50 for NULL confidence_score)
- Updated sorting: quality_score desc nulls last, amazon_rating desc nulls last, confidence_score desc nulls last
- Updated empty state message for zero products passing gating

### Routes modified
- `/app/recs` — updated product filtering and sorting logic

### Key code
- `supabase/sql/202601060000_manus_ready_scoring_and_evidence.sql` — idempotent migration with scoring columns and pl_evidence table
- `web/src/app/(app)/app/recs/page.tsx` — updated gating logic and sorting

### Implementation Details
- Migration is idempotent: uses ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS, DROP POLICY IF EXISTS
- Products table: Added amazon_rating, amazon_review_count, confidence_score, quality_score, primary_url, source_name, source_run_id, manus_payload
- pl_category_types: Added min_month, max_month, evidence_urls, confidence_score (all optional)
- pl_evidence: New table with entity_type/entity_id pattern (handles existing pl_evidence table by renaming to pl_card_evidence if needed)
- RLS: pl_evidence allows authenticated read only; writes via service role server-side
- Gating logic: Applied in-memory after fetching products (fetches up to 200, filters, sorts, limits to top 50)
- Sorting: Multi-level sort with nulls last for all score fields

### Database
- Migration file: `supabase/sql/202601060000_manus_ready_scoring_and_evidence.sql`
- Products table: Added 8 new columns (all nullable for backward compatibility)
- pl_category_types: Added 4 new optional columns
- pl_evidence: New table with index on (entity_type, entity_id)
- All changes are additive and idempotent

### Verification (Proof-of-Done)
- Migration file exists and runs without errors in Supabase (idempotent)
- products table has new columns (amazon_rating, confidence_score, quality_score, etc.)
- `/app/recs` applies gating rules: products pass only if (quality_score >= 8 OR amazon_rating >= 4) AND (confidence_score >= 5 OR fallback criteria)
- Sorting works correctly: products ordered by quality_score, then amazon_rating, then confidence_score (nulls last)
- Empty state shows helpful message when zero products pass gating
- All proof routes pass: `/signin`, `/auth/callback`, `/app`, `/app/children`, `/app/recs`, `/ping`, `/cms/lego-kit-demo`

### Migration Application Steps
- Apply migration via Supabase Dashboard → SQL Editor → paste and run migration SQL
- After migration: products table will have new scoring columns; pl_evidence table will be available for evidence storage

### Rollback
- Revert PR to restore previous recs query logic
- Migration is additive, so no data loss (new columns are nullable)
- If needed: ALTER TABLE to drop new columns (but not recommended if data has been populated)

## 2025-11-01 — Module 1: Baseline Audit & Guardrails

- Added `/SECURITY.md` documenting surfaces, env vars, and RLS (waitlist insert-only; play_idea public select).
- Added `/web/docs/DEPLOY-CHECKLIST.md` with preflight, Vercel settings, and rollback steps.
- Added `/web/.env.example` with required public vars (names only).
- Tailwind/PostCSS sanity: aligned files to installed Tailwind major version; local build passes.
- Verified Vercel: Production Branch=`main`, Root Directory=`web`, env vars present in Preview + Production.
- Verified Supabase RLS policies per module objective (waitlist: INSERT anon+authenticated, no SELECT; play_idea: SELECT anon+authenticated).
- Merged PR via **Rebase and merge**: `chore: baseline audit & guardrails (module 1)`.
- Production validation: https://ember-mocha-eight.vercel.app/

## 2025-11-01 — Module 2: Auth + Protected App Shell
- Added cookie-based auth via `@supabase/ssr` (App Router).
- Added `/signin` (magic link) and `/auth/callback` (code exchange).
- Protected `/app/*` via middleware; added private shell with user email + sign out.
- Verified Supabase URL configuration (Site URL + Additional Redirect URLs) and Vercel envs.
- Local build passed; PR merged via **Rebase and merge**.

## 2025-11-04 — Module 2b: Auth + Protected App Shell
- Magic-link email sign-in via Supabase (PKCE)
- `/auth/callback` exchanges code and redirects to `/app`
- Middleware gates `/app/*`; header “Sign in” fixed to be a real link
- Added `/verify` code fallback to bypass email scanners
- Local and preview builds green

## 2025-11-30 — Module 8: Builder.io Install & Wiring

### Summary
- Installed Builder SDK and wired a draft-aware CMS route under `/cms/[[...path]]`.
- Added preview flow via `/api/preview?secret=...&path={{content.data.url}}`.
- Added CSP headers (`frame-ancestors`) for Builder editor on `/cms/:path*` and `/api/preview`.
- Created diagnostics: `/ping` (health) and `/api/probe/builder` (content/draft check).

### Routes touched/added
- `/cms/[[...path]]` — public (draft-aware via builder.preview or Next draftMode)
- `/api/preview` — public endpoint that sets draftMode with secret
- `/api/probe/builder` — public JSON probe (uses secret to include unpublished)
- `/ping` — public health check

### Env & Secrets
- Local `.env.local`: `NEXT_PUBLIC_BUILDER_API_KEY`, `BUILDER_PREVIEW_SECRET`
- Vercel (Preview): `NEXT_PUBLIC_BUILDER_API_KEY`, `BUILDER_PREVIEW_SECRET`
- Vercel (Production): (optional for now — add before publishing CMS content to prod)
- **Note:** Secret values must be set in Vercel; never commit secrets to the repository.

### 3rd-party wiring
- Builder **Model:** `page`
- Builder **Preview URL:** `/api/preview?secret=__SET_IN_VERCEL__&path={{content.data.url}}` (ROTATE THIS VALUE - set `BUILDER_PREVIEW_SECRET` in Vercel env vars)
- Page target example: `/cms/hello2`

### DB & RLS
- N/A for this module (no schema changes)

### Verification (Proof-of-Done)
- `/ping` → **200**
- `/api/preview?secret=<BUILDER_PREVIEW_SECRET>&path=/cms/hello2` → **307** to `/cms/hello2?builder.preview=true` (use secret set in Vercel env vars)
- `/cms/hello2?builder.preview=true` (in dev/preview) → **200** (renders draft)
- `/api/probe/builder?path=/cms/hello2&secret=<BUILDER_PREVIEW_SECRET>` → `{ ok: true, preview: true, hasContent: true }` when draft exists (use secret set in Vercel env vars)
- Published content: `/cms/hello2` → **200** (if published), **404** (if not)

### Known debt / risks (carried forward)
- Ensure `NEXT_PUBLIC_BUILDER_API_KEY` is a **real key** in all envs (not a placeholder).
- Re-apply CSP headers any time `next.config.*` is replaced.
- Keep `BUILDER_PREVIEW_SECRET` private (rotate if leaked). **Secret value must be set in Vercel; never commit secrets.**
- Vercel Hobby cron remains **daily**; upgrade to Pro before switching to hourly.

### Next module handoff
- Branch to create: `feat/9-branded-blocks`
- Start in: `web/src/components/builder/` (register tokenized blocks), update Builder model inputs
- Keep `PROGRESS.md` + `state/latest.json` up to date for continuity

## 2025-12-05 — Module 8: Register Branded Blocks (8-Pack)

### Summary
- Installed and wired the Builder.io SDK with Next 16-safe patterns for the `page` model.
- Implemented a catch-all `/cms` route that fetches Builder content via `fetchOneEntry` on the server and passes it into a `BuilderPageClient` renderer.
- Registered the branded Lego kit blocks (Hero, ValueProps, FeatureGrid, CTA, TestimonialList, FAQList, LogoWall, StatsBar) behind a block-shell abstraction.
- Hardened Builder preview with CSP middleware, `/api/preview` guard, probes (`/_ds/builder`, `/api/probe/builder`), and a branded `/cms/diag` page.
- Upgraded Next.js to a patched 16.x version to satisfy Vercel’s security enforcement.

### Routes touched/added
- `/cms/[[...path]]` — public (Builder-driven CMS pages)
- `/cms/diag` — private (branded blocks debug / sanity page)
- `/api/probe/builder` — private (Builder content probe, draft-aware)
- `/whoami` — private (Next 16-safe debug route)

### Env & Secrets
- Local `.env.local`: `NEXT_PUBLIC_BUILDER_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` present.
- Vercel (Preview): `NEXT_PUBLIC_BUILDER_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` present.
- Vercel (Production): same key set, ready for future CMS usage.
- Last deploy: Module 8 PR rebased-and-merged into `main` with Next 16.0.7+.

### 3rd-party wiring
- Builder.io `page` model wired with preview URL:
  - `https://<preview-domain>/cms{{content.data.url}}?builder.preview=true`
- `/cms/[[...path]]` uses `fetchOneEntry` on the server and passes `content` + `urlPath` into `BuilderPageClient`.
- Branded blocks registered and exposed to Builder as custom components for the `page` model.

### DB & RLS (if applicable)
- No new tables, columns, or RLS policies for this module.

### Verification (Proof-of-Done)
- Visit `/cms/lego-kit-demo` on the Vercel preview → Builder-driven Lego kit demo renders with branded blocks.
- Visit `/cms/diag` → diagnostic page renders branded test blocks without error.
- Visit `/api/probe/builder` → JSON probe reports `contentFound: yes` and lists `page` entries.
- `/whoami` renders without dynamic-server usage errors and shows debug info.

### Known debt / risks (carried forward)
- Builder preview UX is sensitive to preview URL configuration; mis-configured models can still produce the “site not loading as expected” popup.
- CMS routes currently focused on the `page` model; additional models (e.g. blog, docs) will need their own wiring and possibly separate probes.
- Branded block set is Lego-kit specific; future modules may extend or refactor these into a shared design system.

### Next module handoff
- Branch: `main`
- Latest Preview URL: `<insert latest Vercel preview for main>`
- Start here:
  - `web/src/app/cms/[[...path]]/page.tsx`
  - `web/src/app/cms/BuilderPageClient.tsx`
  - `web/src/app/cms/blocks/*`
  - `web/middleware.ts`

## 2025-12-20 — Module 10A: Privacy Hotfix — Remove Child Name Collection

### Summary
- Privacy compliance: Removed child name field from `children` table schema (privacy promise: never collect child's name)
- Database migration: Renamed `name` column to `legacy_name` and made it nullable to preserve legacy data while preventing new collection
- No code changes required: No application code was referencing the `children` table or `name` field

### Routes touched/added
- N/A (database-only change)

### Env & Secrets
- No changes to environment variables

### DB & RLS
- Migration file: `supabase/sql/2025-12-20_module_10A_remove_child_name.sql`
- Change: `children.name` → `legacy_name` (nullable, deprecated)
- RLS policies unchanged: Existing policies only check `user_id` ownership, not name field

### Verification (Proof-of-Done)
- Migration file exists: `supabase/sql/2025-12-20_module_10A_remove_child_name.sql`
- No code references: `rg "children.name|from\('children'\)" web/src` returns zero matches
- Supabase schema: `children` table no longer has required `name` column (renamed to `legacy_name` nullable)
- Existing routes still work: `/signin`, `/app` redirects logged out, `/cms/lego-kit-demo`, `/ping`

### Known debt / risks (carried forward)
- Legacy data may still contain names in `legacy_name` column (existing data preserved for compatibility)
- Future Module 10 implementation must use birthdate/stage-based age calculation, not name collection

### Migration Application Steps
- Apply migration via Supabase Dashboard → SQL Editor → paste and run migration SQL
- No application deployment required (database-only change)

## 2025-12-20 — Module 10B: Child Profile UI (Stage, Not Name)

### Summary
- Built CRUD interface for child profiles under `/app/children` routes
- Privacy compliance: No name fields, labels, placeholders, or event payloads (privacy promise: never collect child's name)
- Age band calculation: Server-side computation from birthdate (Option A - preferred approach)
- RLS enforcement: All operations respect `user_id = auth.uid()` via Supabase RLS policies

### Routes touched/added
- `/app/children` — list child profiles (birthdate, computed age band, gender)
- `/app/children/new` — create new child profile form
- `/app/children/[id]` — edit and delete existing child profile (ownership verified)

### Env & Secrets
- No changes to environment variables
- Uses existing Supabase configuration

### DB & RLS
- Uses existing `children` table: `id`, `user_id`, `birthdate`, `gender`, `age_band`, `preferences`, `created_at`, `updated_at`
- RLS policies unchanged: Existing policies enforce `user_id = auth.uid()` for all operations
- Age band computed server-side from `birthdate` and stored in `age_band` column

### Implementation Details
- Server actions: `/app/children/_actions.ts` handles save/delete with server-side `user_id` assignment (never accepts from client)
- Age band utility: `/lib/ageBand.ts` calculates age bands (0-6m, 6-12m, 12-18m, 18-24m, 2-3y, 3-4y, 4-5y, 5-6y, 6+)
- Form component: Client-side form with server actions for data submission
- List page: Displays birthdate, computed age band, and gender with edit links

### Verification (Proof-of-Done)
- Logged out: `/app/children` redirects to `/signin?next=/app/children` (middleware protection)
- Logged in: Can create, view, edit, and delete child profiles
- Age band: Automatically calculated from birthdate on save
- Ownership: Users can only access their own child profiles (RLS enforced)
- Existing routes still pass: `/signin`, `/app` redirects logged out, `/cms/lego-kit-demo`, `/ping`

### Known debt / risks (carried forward)
- Age band calculation assumes current date; may need timezone handling for edge cases
- Preferences field exists but is not exposed in UI (hidden for MVP as specified)
- Gender field is optional; may need validation or additional options in future

### Next module handoff
- Branch: `feat/module-10B-child-profiles`
- Routes ready for integration with product recommendations based on child age bands

## 2025-12-20 — Module 10A: Privacy Promise Enforcement (No Child Name)

### Summary
- Enforced privacy promise: we never collect a child's name.
- Repo schema snapshot aligned so `children` table has NO `name` column.
- Migration hardened to be idempotent + safe in environments where `name/legacy_name` never existed.

### Files changed
- `supabase/sql/2025-11-04_core_schema.sql` — removed `children.name` and added privacy comment
- `supabase/sql/2025-12-20_module_10A_remove_child_name.sql` — guarded rename/nullability/comment so it never errors when columns don't exist

### Verification (Proof-of-Done)
- Supabase SQL:
  - Confirm no child name columns:
    `select column_name from information_schema.columns where table_schema='public' and table_name='children' and column_name in ('name','legacy_name');`
    Expected: no rows (or legacy_name only in truly legacy environments)
- Production smoke:
  - `/app` redirects to `/signin?next=/app` when logged out

### Decision log
- Decision: No child names anywhere (schema, UI, analytics). Only stage inputs (birthdate/gender/age band/preferences).

## 2025-12-23 — Module 10B: Child Profiles (Stage, Not Name)

### Summary
- Built child profile CRUD under `/app/children` using birthdate + optional gender.
- Age band computed server-side from birthdate (no name fields anywhere).
- Ownership enforced via RLS; user_id set server-side only.

### Routes added
- `/app/children` — list + CTA to add profile
- `/app/children/new` — create
- `/app/children/[id]` — edit/delete

### Key code
- `web/src/app/(app)/app/children/page.tsx`
- `web/src/app/(app)/app/children/new/page.tsx`
- `web/src/app/(app)/app/children/[id]/page.tsx`
- `web/src/app/(app)/app/children/_actions.ts`
- `web/src/app/(app)/app/children/_components/ChildForm.tsx`
- `web/src/lib/ageBand.ts`

### Verification (Proof-of-Done)
- Logged out: `/app/children` → redirects to `/signin?next=/app/children`
- Logged in:
  - Create profile → appears in list
  - Edit birthdate → age band updates
  - Delete profile → removed from list

## 2025-12-23 — Module 10B.1: UX Polish + /app Header Auth State

### Summary
- Added visible success/error messaging for child profile save/delete.
- Fixed `/app` navbar to reflect signed-in state (email + Sign out).

### Verification (Proof-of-Done)
- Save child → redirect to `/app/children?saved=1` and banner shows "Profile saved"
- Delete child → redirect to `/app/children?deleted=1` and banner shows "Profile deleted"
- Signed in: `/app` header shows email + Sign out (not "Sign in")
- Existing proof routes still work: `/signin`, `/auth/callback`, `/ping`, `/cms/lego-kit-demo`

### CTO Receipt
- Latest shipped: child profiles + UX + auth-aware /app header.
- Next focus: personalised products v0 by child age band + click tracking.

## 2025-12-23 — Module 11A: Recommendations v0 (Age-Band)

### Summary
- Added `/app/recs` route for product recommendations filtered by selected child's age band.
- MVP filter rules: product.age_band == selectedChild.age_band, rating >= 4.0, exclude null ratings, exclude archived if field exists (with graceful fallback).
- Empty state for 0 children with CTA to `/app/children/new`.
- Child selector dropdown with query param navigation (`?child=<uuid>`).
- Product cards with link precedence: deep_link_url > affiliate_url > affiliate_deeplink > none.

### Routes added
- `/app/recs` — recommendations page (protected by existing `/app/*` middleware)

### Key code
- `web/src/app/(app)/app/recs/page.tsx` — server component with auth, children fetch, product query
- `web/src/app/(app)/app/recs/_components/ChildSelector.tsx` — client component for child selection
- `web/src/app/(app)/app/recs/_components/ProductCard.tsx` — product card with image validation and link precedence
- `web/src/app/(app)/layout.tsx` — added "Recommendations" nav link

### Implementation Details
- Server-side age band derivation reuses existing `calculateAgeBand` helper from `/lib/ageBand.ts`.
- Default child selection: most recently updated (updated_at desc), fallback to first child.
- Product query: filters by age_band, rating >= 4.0, excludes null ratings, attempts to exclude archived products with graceful fallback if column doesn't exist.
- Image rendering: uses `validateImage` from `/lib/imagePolicy.ts` with fallback to no image (no Next/Image config changes).
- Link precedence: deep_link_url > affiliate_url > affiliate_deeplink (no click tracking yet per requirements).

### Verification (Proof-of-Done)
- `/app/recs` exists and is accessible only when signed in (via existing `/app/*` protection)
- Empty state: 0 children → shows CTA to `/app/children/new`
- Child selector: >=1 child → dropdown appears, default selection works, selection updates via `?child=` query param
- Recommendations: only shows products with matching age_band AND rating >= 4 AND non-null rating
- Archived handling: if `is_archived` exists → archived excluded; if not → page still works (graceful fallback)
- CTA link precedence: deep_link_url > affiliate_url > affiliate_deeplink > none (disabled button)
- All proof routes pass: `/signin`, `/auth/callback`, `/app` (logged out → redirect), `/app/children`, `/app/recs`, `/ping`, `/cms/lego-kit-demo`

## 2025-12-23 — Module 11B: Click Tracking v0 (Recs CTA)

### Summary
- Added click tracking for "View product" clicks on `/app/recs` product cards.
- Best-effort, non-blocking tracking using `navigator.sendBeacon` with `fetch` fallback.
- Stores safe metadata only: product_id, child_id, age_band, dest_host (domain only, not full URL), source.
- Privacy promise: no child name collection; only child_id (UUID) and age_band.

### Routes added
- `/api/click` — POST endpoint for click tracking (returns 204, best-effort insert)

### Key code
- `web/src/app/api/click/route.ts` — API route with auth check and best-effort Supabase insert
- `web/src/app/(app)/app/recs/_components/ProductCard.tsx` — converted to client component with click handler
- `web/src/app/(app)/app/recs/page.tsx` — updated to pass selectedChild info to ProductCard

### Implementation Details
- API route: validates user session, product_id (UUID format), optional child_id/age_band/dest_host.
- Best-effort insert: if table missing or RLS blocks, error is swallowed and 204 is still returned (doesn't block navigation).
- Client tracking: uses `navigator.sendBeacon` (preferred) with `fetch` + `keepalive` fallback.
- URL safety: only stores `dest_host` (domain) extracted via `new URL(outboundUrl).host`, never full URLs.
- Non-blocking: click handler does NOT preventDefault; link opens normally even if tracking fails.

### Database
- Table: `public.product_clicks` (created via Supabase SQL Editor, not in repo migrations)
- Schema: `id`, `user_id`, `child_id`, `product_id`, `age_band`, `dest_host`, `source`, `clicked_at`
- RLS: insert/select own (enforced by Supabase, code resilient if missing)

### Verification (Proof-of-Done)
- Clicking "View product" triggers POST to `/api/click` and still opens product link (non-blocking)
- Click rows appear in Supabase `product_clicks` for signed-in user (when table exists)
- No child name collection (only child_id UUID and age_band string)
- All proof routes pass: `/signin`, `/auth/callback`, `/app`, `/app/children`, `/app/recs`, `/ping`, `/cms/lego-kit-demo`

## 2025-12-24 — Module 11C: Theme v1 (Global Apply + Live Preview + Semantic Tokens + Gradients)

### Summary
- Shipped admin-managed brand theming with global site apply (home/signin/app/cms) and a live preview editor.
- Expanded from basic tokens to a clearer, semantic theme model (button foregrounds, section backgrounds) and added “Reset to factory” to restore Ember defaults.
- Hardened deployment hygiene (resolved merge-conflict markers causing build failure).
- Applied homepage section theming so marketing page blocks follow the Background/Section alternation (no hard-coded white outliers).


### Routes added
- /app/admin/theme — admin-only theme settings page with live preview
- /api/admin/theme — theme save endpoint with revalidation


### Key code
- web/src/lib/theme.ts — theme schema, DEFAULT_THEME (factory), mergeTheme(), luminance helpers + safe merges
- web/src/lib/admin.ts — admin role check utility
- web/src/components/ThemeProvider.tsx — applies theme globally via CSS variables
- web/src/app/layout.tsx — root layout wraps all routes with ThemeProvider (global apply)
- web/src/app/(app)/app/admin/theme/page.tsx — admin theme page
- web/src/app/(app)/app/admin/theme/_components/ThemeEditor.tsx — editor UI incl. sticky preview + reset
- web/src/app/(app)/app/admin/theme/_components/ThemePreview.tsx — live preview mock showing token effects
- web/src/app/api/admin/theme/route.ts — POST endpoint + revalidatePath for immediate propagation
- web/src/app/globals.css — maps theme vars into global styling (background, text, buttons, sections, optional scrollbar)
- web/src/app/page.tsx — homepage sections updated to use theme background/section tokens (remove hard-coded white)
- web/src/components/ui/Button.tsx + web/src/components/Header.tsx — primary/accent buttons use foreground tokens for readable text


### Theme Schema (as-shipped)
#### Colors

- primary, primaryForeground (auto-calculated fallback)

- accent, accentForeground (auto-calculated fallback)

- background, surface, text, muted, border

- section (or section1/section2 if gradients shipped), scrollbarThumb (subtle)

#### Typography

- fontHeading, fontBody (or heading/subheading/body if shipped)

- baseFontSize (higher cap than v0; numeric input supported if shipped)


#### Components

- radius


### CSS Variables Applied (core)
-- brand-primary, --brand-primary-foreground
-- brand-accent, --brand-accent-foreground
-- brand-bg, --brand-surface, --brand-text, --brand-muted, --brand-border
-- brand-section
-- brand-font-body, --brand-font-head
-- brand-font-size-base
-- brand-radius
(plus --brand-scrollbar-thumb if enabled)


### Implementation Details
- Global apply: ThemeProvider in root layout covers all routes (/, /signin, /cms/, /app/).
- Live preview: Draft state updates preview panel without affecting saved theme until “Save Theme”.
- Immediate propagation: save endpoint triggers revalidation (revalidatePath on relevant layouts/routes).
- Reset: “Reset to factory” writes DEFAULT_THEME back to site_settings.theme and revalidates.
- Semantic mapping: background/surface/section drive page + sections; primary/accent drive buttons/links; foreground tokens ensure readable button text.
- Fonts: curated dropdown expanded beyond v0 (ensure list matches current implementation).
- Deployment hygiene: resolved and prevented merge conflict markers in theme.ts that broke Turbopack build.


### Verification (Proof-of-Done)
- Access control: non-admin cannot access /app/admin/theme (redirects/blocked).
- Save works: admin saves theme; changes apply across /, /signin, /app/* after refresh.
- Preview works: changing controls updates the live preview immediately (incl. fonts).
- Reset works: returns site to factory Ember branding immediately.
- Homepage sections: previously white outliers (e.g., Trust/FAQs) now follow Background/Section styling.
- Build passes: no conflict markers; Vercel build succeeds.
- All proof routes pass: /signin, /auth/callback, /app, /app/children, /app/recs, /ping, /cms/lego-kit-demo

## 2025-12-30 — Module 11D: Mobile + PWA-lite

### Summary
- Added PWA-lite manifest route with icons for installability (best-effort).
- Updated metadata and viewport for mobile safe-area support and theme color.
- Applied mobile CSS polish: tap targets (44px minimum), input font-size (16px to prevent iOS zoom), overflow prevention.

### Routes added
- `/manifest.webmanifest` — PWA manifest route (auto-generated by Next.js from `manifest.ts`)

### Key code
- `web/src/app/manifest.ts` — PWA manifest configuration (name, icons, theme_color, background_color, display: standalone)
- `web/src/app/layout.tsx` — added viewport export (viewportFit: cover), themeColor metadata, appleWebApp metadata, apple-touch-icon
- `web/src/app/globals.css` — mobile polish: `.btn` min-height 44px, `.input` font-size 16px and min-height 44px, `html/body` overflow-x hidden, `.container-wrap` box-sizing, `.card` box-sizing
- `web/src/components/Header.tsx` — responsive padding (px-4 sm:px-6) for mobile overflow prevention
- `web/scripts/generate-icons.mjs` — utility script to generate placeholder icons (icon-192.png, icon-512.png, apple-touch-icon.png)
- `web/public/icon-192.png`, `web/public/icon-512.png`, `web/public/apple-touch-icon.png` — generated placeholder icons with brand colors

### Implementation Details
- Manifest: uses DEFAULT_THEME colors (primary: #FFBEAB, background: #FFFCF8), start_url: /app, display: standalone.
- Icons: simple placeholder icons with "E" letter on gradient background (can be replaced later with official branding).
- Viewport: viewportFit: cover for safe-area support on notched devices.
- Mobile CSS: tap targets meet 44px minimum (iOS/accessibility recommendation), inputs use 16px font to prevent iOS auto-zoom on focus, overflow-x hidden on body to prevent horizontal scrolling.
- Header: responsive padding (px-4 on mobile, px-6 on sm+) to prevent overflow on small screens.

### Verification (Proof-of-Done)
- Build passes: `pnpm build` succeeds, manifest route registered.
- Icons present: icon-192.png, icon-512.png, apple-touch-icon.png in public/.
- Manifest served: `/manifest.webmanifest` accessible (check via DevTools → Application → Manifest).
- Mobile layout: no horizontal overflow, buttons/inputs tappable (44px minimum), inputs don't trigger iOS zoom (16px font).
- All proof routes pass: /signin, /auth/callback, /app, /app/children, /app/recs, /ping, /cms/lego-kit-demo

## 2026-01-05 — PL Taxonomy: Category Types + Products Admin + Curation Control

### Summary
- Implemented founder-facing admin capabilities for Category Types and Products (SKUs)
- Created `pl_category_types` table and linked `products` via `category_type_id`
- Built admin API routes (service role, admin-guarded) for CRUD operations
- Created admin UI pages for managing category types and products
- Fixed PL curation UI dropdowns (populated from real data, proper labels, conditional filtering)
- Removed mutual exclusivity: cards can have both `category_type_id` and `product_id`
- Added age band dropdown and optional rating field to products admin

### Routes added
- `/app/admin/category-types` — Category Types admin (list + create/edit)
- `/app/admin/products` — Products admin (list + create/edit with category_type_id, age_band dropdown, optional rating)
- `/api/admin/category-types` — Category Types API (GET, POST)
- `/api/admin/category-types/[id]` — Category Type API (PATCH)
- `/api/admin/products` — Products API (GET, POST)
- `/api/admin/products/[id]` — Product API (PATCH)
- `/api/admin/age-bands` — Age Bands API (GET, for products dropdown)

### Key code
- `supabase/sql/202601050000_pl_category_types_and_products.sql` — Migration: pl_category_types table + category_type_id column on products (handles existing `label` column gracefully)
- `supabase/sql/202601050001_remove_rating_min_constraint.sql` — Migration to remove any rating >= 4 constraint (if exists)
- `web/src/app/api/admin/category-types/**` — Category Types API routes (admin-guarded, service role writes)
- `web/src/app/api/admin/products/**` — Products API routes (admin-guarded, service role writes, rating optional 0-5)
- `web/src/app/api/admin/age-bands/route.ts` — Age Bands API route for dropdown
- `web/src/app/(app)/app/admin/category-types/page.tsx` — Category Types admin UI
- `web/src/app/(app)/app/admin/products/page.tsx` — Products admin UI (with age_band dropdown from pl_age_bands, optional rating field)
- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx` — Fixed dropdowns to use `name` field, proper labels, controlled components, conditional product filtering by category type
- `web/src/app/(app)/app/admin/pl/_actions.ts` — Removed mutual exclusivity from card updates

### Implementation Details
- Category Types: name (required, unique), slug (auto-generated from name), description (optional), image_url (optional)
  - Migration handles existing `label` column (from PL-0) by adding `name` column and syncing values
- Products: linked to category types via `category_type_id` (one-to-many, nullable)
  - Age Band: dropdown populated from `pl_age_bands` table (not free-text)
  - Rating: optional field (0-5), can be null or any value in range (no minimum requirement)
- Admin API: all writes use service role client; admin check via `isAdminEmail()` from `EMBER_ADMIN_EMAILS`
- RLS: authenticated read for category types (for dropdowns); admin writes via API routes only
- PL Curation UI: 
  - Dropdowns show real data (category types and products), labels updated to "Category Type" and "Product (SKU)"
  - Product dropdown is disabled until Category Type is selected
  - Products filtered by selected category_type_id (strict matching)
  - Controlled components with proper state management
- Cards: can pin both `category_type_id` (preferred) and `product_id` (optional override)
- ProductForm.tsx: updated to handle empty ratings as null (not 0) and allow 0-5 range

### Bug Fixes & Iterations
1. Fixed SQL migration idempotency (DROP IF EXISTS for triggers/policies)
2. Fixed schema mismatch: `pl_category_types` had `label` column from PL-0, added `name` column with data sync
3. Fixed category type creation: ensure both `name` and `label` are set during create/update
4. Added age band dropdown: replaced text input with dropdown from `pl_age_bands` table
5. Added optional rating field: products can have rating 0-5 or null (removed >= 4 requirement from UI/API)
6. Fixed product filtering: PL curation UI now filters products by selected category type (controlled components)
7. Fixed ProductForm.tsx: properly handles empty ratings as null (empty string converts to null, not 0)
8. Added migration to remove any database constraint requiring rating >= 4 (if exists)
9. Improved product filtering: strict category type matching with controlled component state management

### Verification (Proof-of-Done)
- Migration applies cleanly (DROP IF EXISTS for triggers/policies, handles existing `label` column)
- Category Types admin: create/edit works, slug auto-generates, both `name` and `label` fields maintained
- Products admin: create/edit works, category_type_id dropdown populates, age_band is dropdown (not text), rating is optional
- PL curation UI: 
  - Dropdowns show real data (no "None only" bug)
  - Product dropdown disabled until Category Type selected
  - Products filtered by selected category type
  - Both category_type_id and product_id can be set (no mutual exclusivity)
- All proof routes pass: /signin, /auth/callback, /app, /app/children, /app/recs, /ping, /cms/lego-kit-demo
- Theme admin still works: /app/admin/theme

## 2026-01-10 — FT-1: Public /new landing page (age slider) + signup gate

### Founder Exec Summary

We shipped the public acquisition page that lets a brand-new visitor set their child’s age (slider), pick a “moment”, instantly see curated picks, and then hit a natural conversion gate (“Save to shortlist” → sign in). This is the MVP “paid landing page” surface for TikTok/ads.

### Summary

- Added public landing routes /new and /new/[months] (deep linkable from ads)
- Slider is preloaded from the URL (e.g. /new/25) and updates the URL as you change it
- Moment selection is reflected in the URL via query params (shareable / consistent refresh)
- Integrates with PL curation: shows “top 3 picks” only when a published set exists for that age+moment
- “Save to shortlist” triggers sign-in immediately and preserves return state (month + moment)
- Routes added
- /new — public landing (default age range)
- /new/[months] — deep-link landing (preloads slider)
- (No new auth routes; uses existing /signin?next=... flow)

### Key code

- web/src/app/new/page.tsx and/or web/src/app/new/[months]/page.tsx — public landing routes
- web/src/components/*NewLandingPage* — client component implementing slider + moment + cards UI
- PL fetch integration (published sets only): uses pl_age_moment_sets + related cards/evidence (read-only)
- Header behaviour: header/logo remains inside the experience; signup redirects preserve state
- Verification (Proof-of-Done)
- /new loads logged-out and renders the slider + moment UI
- /new/25 preloads age to 25 months
- Changing slider updates URL and refreshes picks deterministically
- If no published set exists for chosen age+moment: show premium empty state (no crash)
- “Save to shortlist” redirects to /signin?next=<return-to-same-new-url>
- All proof routes still pass: /signin, /auth/callback, /app, /app/children, /app/recs, /ping, /cms/lego-kit-demo
- Theme still applies globally (no regression): /app/admin/theme works for admins

## 2026-01-13 — PL-ADMIN-5: Build Fixes + System Status Panel + UX Improvements

### Founder Exec Summary

Fixed critical build errors preventing Vercel deployment, added comprehensive System Status / Truth Panel for debugging, and improved UX behaviors (autofill, persistence, sourcing visibility). The admin now self-identifies build commit, database state, and feature presence, eliminating guesswork about why data isn't showing.

### Summary

- **Build fixes**: Fixed import paths using `@/` alias for autopilot module; fixed TypeScript errors
- **System Status / Truth Panel**: Added admin-only panel showing build commit, Vercel env, Supabase ref, authenticated user ID, isAdmin status, and raw database counts with error handling
- **Server-side logging**: Added console.log with all system status info for Vercel logs
- **UI rendering**: Confirmed Merchandising Office (two-pane shopfront + factory) renders correctly, not legacy islands view
- **UX improvements**:
  - "Why it can work" auto-fills from `products.why_it_matters` when placing/selecting SKU
  - Add-card button now uses `router.refresh()` for immediate persistence (no disappearing)
  - Sources count and "Needs 2nd source" badge visible on cards using `card.pl_evidence` count

### Key code

- `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx`:
  - Enhanced System Status panel with auth/user info and raw counts (sets, cards, category_fits, product_fits)
  - Raw count queries with error handling (displays errors in panel if queries fail)
  - Server-side logging of system status
- `web/src/app/(app)/app/admin/pl/_actions.ts`:
  - `placeProductIntoSlot()` now auto-fills `because` from `products.why_it_matters`
- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MerchandisingOffice.tsx`:
  - Add-card uses `router.refresh()` instead of `window.location.reload()` for better persistence
  - Sources count uses `card.pl_evidence.length` correctly
  - "Needs 2nd source" badge shows when `evidenceCount < 2`

### Implementation Details

- **System Status Panel**: Shows build commit (first 7 chars), Vercel env, Supabase ref (parsed from URL), user ID (first 8 chars), isAdmin boolean, and raw counts with error messages if queries fail
- **Raw counts**: Uses `select('*', { count: 'exact', head: true })` for efficient counting
- **Error handling**: All count queries wrapped in try/catch; errors displayed in panel (not swallowed)
- **Autofill**: `placeProductIntoSlot` fetches `products.why_it_matters` and sets `card.because` automatically
- **Persistence**: `router.refresh()` provides immediate UI update without full page reload

### Verification (Proof-of-Done)

1. **Vercel build passes**: Build completes successfully locally and on Vercel
2. **System Status panel visible**: Shows real commit SHA, user ID, isAdmin=true, and non-zero counts when DB has rows
3. **Merchandising Office renders**: `/app/admin/pl/25-27m` shows two-pane layout (not legacy islands)
4. **Add card persists**: Clicking "+ Add card" immediately shows new card (no disappearing)
5. **Why autofills**: Placing/selecting SKU auto-fills "Why it can work" from product database
6. **Sources visible**: Cards show "Sources: X" count and "Needs 2nd source" badge when evidence < 2

### Known limitations

- System Status panel shows first 7 chars of commit SHA (full SHA available in logs)
- User ID truncated to first 8 chars for display (full ID in logs)

## 2026-01-12 — PL-ADMIN-5: Autopilot v0 + Algorithm Controls

### Founder Exec Summary

Autopilot v0 is now fully wired and operational. The admin runs itself ("Ramsay-mode"): for each moment in an age band, Ember has an AUTO-GENERATED draft set ready to go. Founder sees Published vs Draft, blockers, and can do quick swaps. Founder can adjust algorithm weights (the secret sauce) via a toggle panel. This is deterministic and explainable (no LLM).

### Summary

- **Autopilot v0 algorithm**: Deterministic scoring using confidence_score, quality_score, stage_anchor_month (if available), and evidence bonuses
- **Algorithm weights panel**: Toggle "Show algorithm" reveals sliders for confidence/quality/anchor weights, with normalization and save/reset controls
- **Score breakdown**: When algorithm toggle is on, each card shows score breakdown (confidence component, quality component, anchor component, evidence bonus, total score)
- **Draft auto-population**: On page load, draft sets are automatically created and populated using autopilot if missing or empty
- **Regenerate controls**: "Regenerate draft" button re-runs autopilot for the current moment (respects locks)
- **Locks/overrides**: Persistent lock toggle on each card prevents autopilot from overwriting founder choices
- **Auto-fill "Why it can work"**: When autopilot assigns a SKU, it pre-fills card.because from products.why_it_matters
- **Evidence chips**: Cards show evidence count chips ("Sources: 1", "Needs 2nd source", "Ready to publish")
- **Fixed add card persistence**: Add card now properly persists and refreshes UI

### Key code

- `web/src/lib/pl/autopilot.ts`: 
  - Updated `calculateAnchorScore()` to use `stage_anchor_month` if available (distance-based scoring)
  - Added `stage_anchor_month` to `ProductCandidate` type
- `web/src/app/(app)/app/admin/pl/_actions.ts`:
  - Updated `regenerateDraftSet()` to fetch `stage_anchor_month` from `pl_product_fits`
  - Updated `updateCard()` to support `is_locked` with `locked_at` and `locked_by` tracking
  - `ensureDraftSetPopulated()` called on page load for each moment
- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MerchandisingOffice.tsx`:
  - Added algorithm weights panel (toggle, sliders, save, reset)
  - Added score breakdown display when algorithm toggle is on
  - Added lock toggle on cards with visual indicators
  - Added evidence chips showing source count and publish readiness
  - Added "Regenerate draft" button
  - Fixed add card persistence (proper reload timing)
- `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx`:
  - Calls `ensureDraftSetPopulated()` for each moment on load (non-blocking)
  - Loads `is_locked`, `locked_at`, `locked_by` from database
- `supabase/sql/202601060001_pl_autopilot_locks.sql`: Migration to add `is_locked`, `locked_at`, `locked_by` columns to `pl_reco_cards`

### Implementation Details

- **Anchor scoring**: Uses `stage_anchor_month` from `pl_product_fits` if available, calculates distance from age band midpoint, normalizes to 0.5-1.0 range
- **Weights normalization**: Weights are normalized to sum to 1.0 when saved, but displayed as raw values with normalized preview
- **Lock persistence**: Locks are stored in database with `is_locked` boolean, `locked_at` timestamp, and `locked_by` user ID
- **Autopilot respects locks**: `regenerateDraftSet()` skips locked cards when updating
- **Auto-population**: Runs in background on page load, doesn't block UI rendering
- **Score breakdown**: Calculated client-side using current weights and product scores

### Database

- Migration file: `supabase/sql/202601060001_pl_autopilot_locks.sql`
- Adds `is_locked BOOLEAN NOT NULL DEFAULT false`, `locked_at TIMESTAMPTZ`, `locked_by UUID` to `pl_reco_cards`
- Index on `is_locked` for filtering

### Verification (Proof-of-Done)

1. **Autopilot exists and runs**: Opening `/app/admin/pl/25-27m` shows populated draft for Bath time without manual card creation
2. **Algorithm panel exists and is wired**: 
   - Change weights → Save → Regenerate → at least one slot changes (or explanation given why not)
   - Weights normalize to sum to 1.0
3. **Score breakdown visible**: When algorithm toggle is on, cards show score breakdown with confidence/quality/anchor/evidence components
4. **Locks prevent overwrite**: Lock a card, regenerate draft → locked card unchanged
5. **Why auto-fills**: Autopilot-assigned cards have "Why it can work" pre-filled from product database
6. **Evidence chips**: Cards show "Sources: X", "Needs 2nd source", "Ready to publish" chips
7. **Add card works**: Add card button creates card and persists (no disappearing toast)
8. **Moments integrated**: All moments shown in single list (no "moment islands")

### Known limitations

- Score breakdown is calculated client-side (may not match server-side calculation exactly if weights differ)
- Top 3 alternatives not yet displayed in UI (algorithm calculates them but doesn't show)
- Auto-population runs in background (may take a moment to appear)

### Next up

- Add top 3 alternatives display in score breakdown panel
- Consider adding "Regenerate all moments" button (performance permitting)
- Add pool warning when no pool exists ("No pool set; autopilot using full catalogue")

## 2026-01-12 — PL-ADMIN-4: Merchandising Office v1 (Shopfront + Factory)

### Founder Exec Summary

Merchandising Office v1 is a two-pane workspace (Shopfront 40% + Factory 60%) designed for founders to merchandise moment sets quickly and confidently. The Shopfront pane shows what parents will see (populated cards only), while the Factory pane provides full catalogue browsing with search, filters, and quick "Place into" actions. Slot labels use parent-friendly language ("Great fit", "Also good", "Fresh idea") while maintaining internal lane values in the database.

### Summary

- **Two-pane layout**: Shopfront (40% left) shows moment header, status strip, and populated cards only; Factory (60% right) shows full product catalogue with search/filters
- **Only populated cards shown**: No placeholder cards; clean empty state when no cards exist
- **Slot label mapping**: Display labels "Great fit" / "Also good" / "Fresh idea" mapped from internal lanes (obvious/nearby/surprise)
- **Factory pane**: Product table with search (product name + brand), category filter, publish readiness filter (All/Ready/Needs 2nd source), and sorting (Confidence/Quality/Evidence)
- **Product drawer**: Click product row to open drawer with details and "Place into" buttons for each slot
- **Place product into slot**: Auto-creates card if missing, auto-aligns category, shows replace confirmation if slot already has product
- **UI labels**: Renamed "Because" to "Why it can work" throughout UI (DB column unchanged)
- **Status strip**: Shows publish readiness summary (SKU cards ready/total, needs 2nd source count, missing "Why it can work" count)
- **Add card CTA**: Button to create new card (prefers missing lanes first)
- **Server actions**: Added `createCard()` and `placeProductIntoSlot()` with category auto-align

### Key code

- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MerchandisingOffice.tsx`: New two-pane component replacing MomentSetEditor
  - Shopfront pane: moment header, status strip, card list (populated only), "Add card" CTA
  - Factory pane: product table, search/filters, product drawer, "Place into" buttons
  - Slot label mapping: LANE_TO_LABEL mapping (obvious → "Great fit", etc.)
  - Product drawer: slide-out drawer with product details and slot placement buttons
- `web/src/app/(app)/app/admin/pl/_actions.ts`:
  - `createCard()`: Creates new card for a set with specified lane and rank
  - `placeProductIntoSlot()`: Places product into card slot, auto-aligns category from product's category_type_slug
  - `publishSet()`: Updated error message to use "Why it can work" instead of "because"
- `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx`: Updated to use MerchandisingOffice instead of MomentSetEditor

### Implementation Details

- **Two-pane layout**: Uses flexbox with flex-[0.4] and flex-[0.6] for responsive 40/60 split
- **Sticky headers**: Shopfront header and Factory filter bar use `sticky top-0` for visibility while scrolling
- **Only populated cards**: Filters cards to show only those with category_type_id OR product_id
- **Product filtering**: Factory pane filters by search query (product name + brand), category slug, and publish readiness
- **Product sorting**: Defaults to confidence (desc), with options for quality and evidence count
- **Slot placement**: When placing product, finds or creates card for lane, auto-aligns category, shows replace confirmation if needed
- **Category auto-align**: `placeProductIntoSlot` server action looks up category_type_id from category_type_slug to ensure category matches product

### Verification (Proof-of-Done)

- Open `/app/admin/pl/25-27m` on preview URL
- Two-pane layout visible (Shopfront left, Factory right)
- Shopfront pane: moment header, status strip, populated cards only (no placeholders)
- Factory pane: product table loads, search and filters work
- Click product row: drawer opens with product details and "Place into" buttons
- Click "Place into Great fit": Card updates (or created), category auto-aligns, toast shown
- If replacing existing product: confirmation modal appears
- Status strip shows correct counts (publish-ready, needs 2nd source, missing "Why it can work")
- "Add card" button creates new card (prefers missing lanes first)
- Save Card works with empty "Why it can work" (draft-friendly)
- Publish blocks if any card missing "Why it can work" or any SKU not publish-ready
- Category-only cards can publish
- No scary red banners on load; warnings are inline and actionable

### Known limitations

- ShopfrontCard editing form needs refinement (category/product filtering may need state management improvements)
- Product drawer positioning may need adjustment for mobile
- "Place into" functionality may need additional error handling
- Product table pagination not implemented (shows all filtered products)

### Next up

- Iterate on ShopfrontCard form handling and state management
- Add product table pagination for large catalogues
- Refine mobile responsive behavior
- Consider adding evidence management UI (currently handled separately)

## 2026-01-10 — PL-ADMIN-2: Conditional SKU filtering + merchandising UX tweaks

### Founder Exec Summary

Fixed critical bug where selecting a Category Type (e.g., "Play dough") allowed selecting unrelated products (e.g., drum). Product dropdown now strictly filters by selected category. Added server-side validation to prevent mismatched saves. Improved merchandising UX with status strip, better card layout density, and quick "Clear" buttons.

### Summary

- **Hard fix**: Product dropdown is now conditional on Category Type selection
  - Products filtered by matching `category_type_slug` to selected category's `slug`
  - Product dropdown disabled until category is selected
  - When category changes, SKU auto-clears if it doesn't match (with helper text)
- **Server-side safety**: Added validation in `updateCard` and `publishSet` to prevent mismatched category+product combinations
- **Merchandising UX improvements**:
  - Status strip at top showing: set status, publish-ready SKU count, publish blockers
  - Improved card layout: hide evidence badge when no SKU selected, show inline with SKU selector
  - Added "Clear" (SKU only) and "Clear all" (category+SKU) buttons

### Key code

- `web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx`:
  - `CardEditor`: Filters products by `category_type_slug` matching selected category's `slug`
  - Auto-clears SKU when category changes if mismatch detected
  - Status strip component showing publish-ready counts and blockers
  - Evidence section hidden when no SKU selected
  - Product metadata shown inline with SKU selector
  - Clear/Clear all buttons for quick SKU management
- `web/src/app/(app)/app/admin/pl/_actions.ts`:
  - `updateCard`: Validates product matches category before saving (checks `products.category_type_id`)
  - `publishSet`: Validates all cards with both category and product have matching relationships

### Implementation Details

- **Product filtering**: Uses `category_type_slug` from `v_pl_product_fits_ready_for_recs` view, matched to category's `slug` from `pl_category_types`
- **Server validation**: Queries `products` table's `category_type_id` column to validate matches
- **Status strip**: Calculates publish-ready count by checking `is_ready_for_publish` flag from products
- **UX improvements**: Reduced visual noise by hiding evidence section when no SKU, showing product metadata inline

### Bug Fixes & Iterations

1. Fixed product dropdown to filter by selected category type (was showing all products)
2. Added auto-clear of SKU when category changes and product doesn't match
3. Added server-side validation to prevent mismatched saves at both card update and publish time
4. Improved layout density by hiding evidence badge when no SKU selected
5. Added status strip for better visibility of publish readiness

### Verification (Proof-of-Done)

- Go to `/app/admin/pl/25-27m` on preview URL
- Pick Category Type A; confirm SKU dropdown only shows SKUs belonging to that category
- Select a SKU; then change category type to B; confirm SKU clears automatically and shows helper text
- Attempt to publish with a "Needs 2nd source" SKU; confirm publish blocked with clear error listing product names
- Create a category-only card (no SKU) and publish; confirm it can publish (if all SKU cards are publish-ready or empty)
- Status strip shows correct publish-ready count and blockers
- Clear buttons work correctly to reset SKU selections

### Known limitations

- None identified

### Next up

- Consider adding bulk operations for category assignment
- Consider adding product search/filter within category dropdown

## 2026-01-12 — PL-ADMIN-1: Admin dropdowns populated + publish gating (evidence-aware)
### Founder Exec Summary

We unblocked the Product Library admin workflow so it can finally “see” the real catalogue seeded from Manus. Category Type and Product dropdowns now populate from the new fit-based sources (age-band aware), and publishing is protected by an evidence gate (products cannot be published unless they have sufficient evidence). This gets us to a usable merch admin surface while we iterate toward the “Virtual Merchandising Office” layout.

### Summary

Admin PL page now loads Category Types from pl_category_type_fits (age-band specific) joined to pl_category_types for label/slug.

Admin PL page now loads Products (SKUs) from v_pl_product_fits_ready_for_recs filtered by age_band_id and is_ready_for_recs = true.

UI now displays product metadata when selected:

Confidence score and quality score (from pl_product_fits)

Evidence count + publish readiness badge (“Needs 2nd source”)

Publish action now enforces a server-side gate:

If any selected product is not is_ready_for_publish, publish is blocked with a clear error listing the offending product names.

Category-only cards can still publish (no SKU evidence requirement).

Known limitation (carried forward):

Product dropdown is not yet conditional on selected Category Type (can select mismatched SKU). This will be fixed in the next PR (PL-ADMIN-2).

### Key code

web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx

Updated category query: pl_category_type_fits → join pl_category_types → sort by label

Updated product query: v_pl_product_fits_ready_for_recs filtered by age band + ready-for-recs

Fetches confidence_score_0_to_10 + quality_score_0_to_10 from pl_product_fits for UI display

web/src/app/(app)/app/admin/pl/[ageBandId]/_components/MomentSetEditor.tsx

Product selection UI updated to show publish readiness badge + evidence count + confidence/quality metadata

web/src/app/(app)/app/admin/pl/_actions.ts

Added publish-time validation against v_pl_product_fits_ready_for_recs.is_ready_for_publish

Blocks publish with explicit error messaging

Data / Supabase notes (manual actions taken)

Catalogue seeded successfully for 25–27m:

products total: 186

pl_product_fits for 25–27m: 163

pl_category_type_fits for 25–27m: 38

Evidence gating view implemented:

v_pl_product_fits_ready_for_recs

is_ready_for_recs = true (>= 1 evidence)

is_ready_for_publish = false currently for all 25–27m (requires 2nd independent source)

Removed/disabled insert-time enforcement that conflicted with “store wide, gate later”:

Disabled trg_min_rating / check_min_rating() on products (publish gating replaces this)

### Verification (Proof-of-Done)

Admin PL page loads for 25–27m and dropdowns show real options (not just “None”).

Selecting a SKU shows evidence badge and confidence/quality metadata.

Attempting to Publish a set containing any non-publish-ready SKU is blocked with a clear error message.

Category-only cards remain publishable.

### Preview URL used for validation:

/app/admin/pl/25-27m (Vercel preview) loads and renders as expected.

---

## feat(subnav-data): secure saves + consent schema and get_my_subnav_stats (Feb 2026)

- **Goal:** Add tables and RLS for saved products, saved ideas, notification prefs; single RPC `get_my_subnav_stats()` for "my subnav stats" read. Data foundation only; no UI subnav in this PR.
- **What changed:** New migration `supabase/sql/202602190000_subnav_saves_and_consent.sql`: tables `user_saved_products`, `user_saved_ideas`, `user_notification_prefs`; RLS (SELECT/INSERT/DELETE for saves, + UPDATE for prefs) using `auth.uid()` only; RPC `get_my_subnav_stats()` returning `{ toys_saved_count, ideas_saved_count, development_reminders_enabled }`. Verification doc: `web/docs/FEB_2026_SUBNAV_DATA_VERIFICATION.md`.
- **Proof:** `pnpm -C web build` passes (no app code changes). Founder: run migration in Supabase SQL Editor, then run verification queries in `FEB_2026_SUBNAV_DATA_VERIFICATION.md`.
- **Rollback:** See "Rollback" section in `web/docs/FEB_2026_SUBNAV_DATA_VERIFICATION.md` (drop trigger, function, tables in order).
- **PR:** [Link after PR opened]

---

## feat(subnav-ui): authenticated subnav globally + real saves counts + reminders toggle (Feb 2026)

- **Goal:** Implement authenticated subnav per Figma; hidden for guests, shown when logged in; "Add a child" → /app/children; Save Idea / product Save write to PR1 tables and update subnav counts; "Send me development reminders" toggle upserts user_notification_prefs.
- **What changed:** Root layout wrapped with SubnavStatsProvider; SubnavGate + SubnavBar (toys saved, gifts saved = 0, category ideas saved, reminders toggle). useSubnavStats fetches get_my_subnav_stats() for authed users; refetch after saves/toggle. DiscoveryPageClient: handleSaveCategory and handleSaveToList insert into user_saved_ideas / user_saved_products (upsert), refetch subnav; runReplayForAction does same for replay-after-sign-in. SubnavBar reminders toggle upserts user_notification_prefs. New: web/src/lib/subnav/SubnavStatsContext.tsx, web/src/components/subnav/SubnavBar.tsx, SubnavSwitch.tsx, SubnavGate.tsx.
- **Proof:** `pnpm -C web build` passes. Founder QA: guest no subnav; sign in → subnav appears; Add a child → /app/children; Save Idea / Save → counts increment and persist; reminders toggle persists.
- **Rollback:** Revert PR (no DB migration in this PR).
- **PR:** [Link after PR opened]

---

## feat(subnav-ui2): V2 subnav layout from Figma - Subnav Bar V2 (Feb 2026)

- **Goal:** Install V2 subnav based on Figma - Subnav Bar V2; keep sticky scroll and tooltip width fixes; mobile-friendly layout.
- **What changed:** SubnavBar rewritten to V2 layout: (1) First row: "Add a child" button + "All children" selector pill (Users icon; single profile until multi-child); (2) Second row: stats in V2 order (ideas, toys, gifts) with shorter labels and responsive text (text-xl lg:text-2xl, text-xs lg:text-sm); (3) Reminders: full label "Send me development reminders" on xl, short "Reminders" on smaller screens; (4) flex-col lg:flex-row for mobile stacking; max-w-6xl, sticky top calc(header-height), SimpleTooltip minWidth 44rem unchanged.
- **Proof:** `pnpm -C web build` passes. Founder: sign in, check subnav on desktop and mobile (narrow viewport); confirm sticky scroll and wide tooltip still work.
- **Rollback:** Revert PR.
- **PR:** [Link after PR opened]

---

## fix(snag-pack): homepage + navbar tweaks (fix/snag-pack-homepage-v1)

- **Goal:** Single Snag Fix PR: navbar nav icons for signed-in users; homepage copy, layout, animation and logo fixes.
- **What changed:** (1) **Navbar:** After "Ember" text, three clickable nav icons for signed-in users — Discover (Lightbulb → /discover), Buy (ShoppingBag → /new), Move (RefreshCw → /products); same Lucide icons as homepage. (2) **Homepage:** Every section header ends in full stop; "How Ember Works" subtitle one sentence per line. (3) **Hero:** "Your pocket play guide" → "Your proactive" / "play guide" (two lines). (4) **Buy it card:** Body text updated to "A short set of ideas that fit this stage. The latest retailer offers that pass our review tests. Buy what you need, or add to your gift list for helpful family purchases." (5) **Flow animation:** Faster rotation (40s → 16s) and path animations; darker dashed circle (opacity 0.7, strokeWidth 1). (6) **How we choose:** Container centre-aligned (mx-auto text-center). (7) **Section order + layout:** "Never behind the curve" moved above "Built around how children actually grow"; four image blocks alternate image right, left, right, left. (8) **Ember logo:** Replaced with Supabase asset URL (Ember_Logo_Robin1.png) in navbar and HomeHowItWorks.
- **Key files:** `DiscoverStickyHeader.tsx`, `HomeHero.tsx`, `HomeHowItWorks.tsx`, `HomeHowWeChoose.tsx`, `HomeShowsUp.tsx`, `HomeStageBlocks.tsx`, `HomeFinalCTA.tsx`, `page.tsx`.
- **Proof:** `pnpm -C web build` passes. Manual: navbar signed-in shows three icons; homepage copy, layout, animation and logo as above.
- **PR:** #157 fix(snag-pack): homepage + navbar tweaks
- **Follow-up (same PR):** (1) "How we choose." box: list text left-aligned (`text-left` on grid in `HomeHowWeChoose.tsx`). (2) Navbar: "Sign in" link added before "Get started" for signed-out users (`DiscoverStickyHeader.tsx`). (3) Navbar logo already set to Ember_Logo_Robin1.png URL.

---

## fix(snag-pack): 13-item snag fixes (fix/snag-pack-homepage)

- **Goal:** Resolve the 13 requested snags only (nav/mobile polish, discover/save/family UX, signin return path, and marketplace CTA tweaks).
- **What changed:** 
  - `web/src/components/subnav/UnifiedSignedInNav.tsx` — larger mobile logo for signed-in nav, "All children" label when no child selected, products counter icon switched from box/package to shopping cart, added `Family` link in mobile menu after `Account`.
  - `web/src/components/ui/SimpleTooltip.tsx` — tooltip alignment/width constrained so reminders tooltip stays within viewport on mobile.
  - `web/src/app/marketplace/page.tsx` — removed "Get notified"; changed "Join early access" CTAs to a simple confirmation route (`/success`).
  - `web/src/components/family/MyIdeasClient.tsx` — added top-right minus affordance on cards plus modal overlay ("Are you sure?") with `Remove` and `Archive` actions.
  - `web/src/app/discover/[months]/DiscoveryPageClient.tsx`, `web/src/components/discover/figma/DiscoverFigmaPlayCarousel.tsx`, `web/src/components/discover/figma/DiscoverFigmaPlayIdeaCard.tsx`, `web/src/components/discover/figma/DiscoverFigmaProductCarousel.tsx` — added Ember logo before each stage section header; hide "Have" action for signed-out users.
  - `web/src/components/discover/DiscoverStickyHeader.tsx` — signin links now preserve current page + query in `next` so post-auth returns to same journey page.
  - `web/src/components/figma/family/FamilyFigmaClient.tsx` — email toggles moved before their text labels, made mutually exclusive; navbar reminders preference remains tied only to "Monthly stage updates".
  - `web/src/app/layout.tsx`, `web/src/app/globals.css` — set global white fallback background to avoid black flash before content render.
- **Proof:** `pnpm -C web build` passes after changes.

### follow-up snag pass (open feedback fixes)
- Centered the signed-in mobile child toggle visually in navbar row and added desktop profile-dropdown `Family` link after `Account` (`web/src/components/subnav/UnifiedSignedInNav.tsx`).
- Tightened mobile reminders tooltip sizing in unified nav to keep content inside viewport (`web/src/components/subnav/UnifiedSignedInNav.tsx`).
- `/my-ideas`: made minus action more prominent, modal copy now `Removing <title>`, and on successful Remove the card is removed from the list immediately (`web/src/components/family/MyIdeasClient.tsx`).
- Increased discover stage-header logo size for visibility (`web/src/app/discover/[months]/DiscoveryPageClient.tsx`).
- `/family` email preference rows now place toggle + text adjacent and left-aligned; monthly and move-it-on are autonomous, while navbar reminders still map only to monthly stage updates (`web/src/components/figma/family/FamilyFigmaClient.tsx`).
- **Proof:** `pnpm -C web build` passes after follow-up fixes.

### final visual tweaks (snag 6 + 7)
- `/my-ideas` minus icon tuned down (less prominent) and centered visually inside circle (`web/src/components/family/MyIdeasClient.tsx`).
- Discover stage robin logo increased further with responsive sizing and non-stretched rendering on mobile + desktop (`web/src/app/discover/[months]/DiscoveryPageClient.tsx`).
- **Proof:** `pnpm -C web build` passes after final visual tweaks.

---

## feat(pricing): Project Leaf Pricing Page (exact) + wiring (Mar 2026)

- **Summary:** Added new `/pricing` route using the supplied Figma Make pricing code as the UI source of truth, with minimal Ember integration.
- **Routes:** Added `web/src/app/pricing/page.tsx`.
- **Integration notes (minimal adaptation):** Kept Ember global shell unchanged (existing navbar/subnav in root layout). The Figma-internal header component was intentionally not mounted to avoid duplicate nav.
- **Imported UI folder:** `web/src/components/figma/pricing/*` (`PricingPageFigmaClient.tsx`, `interactive-comparison.tsx`, `pricing-card.tsx`, `faq.tsx`).
- **Data wiring:** No Supabase/API data path for this page; route is informational/static and does not change existing tables/endpoints/auth behavior.
- **Verification:** `pnpm -C web build` passes and includes `/pricing` in generated app routes.
- **Preview URL:** [To be added in PR after Vercel finishes]
- **Known debt:** Figma pack includes a standalone header file not used in Ember integration by design; current CTA buttons are visual-only until product flow destination is specified.

### follow-up: pricing v2 top spacing pass
- **Goal:** Apply v2 Figma spacing/card adjustments focused on top of page only (hero + pricing cards).
- **What changed:** `web/src/components/figma/pricing/PricingPageFigmaClient.tsx` hero spacing updated to `pt-16 pb-20 lg:pt-24 lg:pb-28`; pricing section spacing updated to `pb-16 lg:pb-20`. `web/src/components/figma/pricing/pricing-card.tsx` updated to compact v2 card metrics (padding, badge size/offset, heading/price/type scales, feature spacing/icon size, CTA size/font).
- **Proof:** `pnpm -C web build` passes after v2 spacing updates.

### follow-up: pricing hero line break + conflict resolution
- **Goal:** Force hero second sentence onto line 2 and clear PR merge conflicts.
- **What changed:** Added explicit `<br />` between "Browse for free." and "Let Ember guide what to buy." in `web/src/components/figma/pricing/PricingPageFigmaClient.tsx`. Merged latest `origin/main` into pricing branch and resolved conflicts (kept `main` versions for unrelated `FamilyFigmaClient` and `UnifiedSignedInNav` files).
- **Proof:** `pnpm -C web build` passes on merged branch; pushed to PR branch.

### follow-up: navbar discoverability links
- **Goal:** Make pricing discoverable in signed-out and signed-in nav paths.
- **What changed:** Signed-out navbar now includes `About` (`/`) and `Pricing` (`/pricing`) before `Sign in` in `web/src/components/discover/DiscoverStickyHeader.tsx` (desktop, mobile top bar, and mobile menu panel). Signed-in account menu now includes `Membership` (Gem icon, links to `/pricing`) after `Family` in `web/src/components/subnav/UnifiedSignedInNav.tsx` (desktop dropdown and mobile menu panel).
- **Proof:** `pnpm -C web build` passes after navbar link additions.

### follow-up: mobile signed-out nav de-cramp
- **Goal:** Reduce top-bar crowding on signed-out mobile navbar.
- **What changed:** Removed `About` from signed-out **mobile top bar** in `web/src/components/discover/DiscoverStickyHeader.tsx`; kept desktop signed-out nav and mobile menu panel entries unchanged.
- **Proof:** `pnpm -C web build` passes after this tweak.

### follow-up: mobile signed-out nav de-cramp v2
- **Goal:** Further reduce signed-out mobile top-bar crowding.
- **What changed:** Removed `Pricing` and `Sign in` from the signed-out **mobile top bar** in `web/src/components/discover/DiscoverStickyHeader.tsx`; `Get started` remains in the top bar. Desktop nav and mobile menu panel links remain unchanged.
- **Proof:** `pnpm -C web build` passes after this tweak.

---
## 2026-05-19 — AI Marketplace Listing PR1: Draft Listing Data Spine

### Summary
- Audited existing marketplace/inventory/product/storage/RLS patterns.
- Added the draft-listing data spine for AI-assisted marketplace listings.
- Added private raw-photo storage foundation for listing draft images.
- Added AI listing analysis audit logging spine table.
- No AI calls, upload UI, pricing, maps, or publishing added.

### DB & RLS
- Tables:
  - marketplace_listing_drafts: added
  - ai_listing_analysis_events: added
- RLS:
  - user-owned draft access only (select/insert/update/delete)
  - user-owned AI event access only (select/insert)
- Deferred:
  - none for PR1; `household_item_id` FK mapped to existing `public.garage_items(id)` and `product_type_id` FK mapped to existing `public.product_types(id)`

### Storage
- Bucket:
  - marketplace-raw-listing-photos: private, added in migration SQL
- Raw listing photos are not public by default.

### Verification
- Baseline build: pass (`pnpm -C web build`)
- Final build: pass (`pnpm -C web build`)
- Migration path:
  - `supabase/sql/202605190620_marketplace_listing_draft_spine.sql`
- Manual SQL/Supabase checks:
  - Supabase CLI is not installed in this runner; run the migration in Supabase SQL Editor and verify tables/policies there.

### Known debt / risks
- No AI provider selected yet.
- PR2 will add private photo upload UI.
- PR3 will add Gemini-only image analysis unless quality requires Google Vision later.
- No publish flow exists yet.

### Next module handoff
- Branch to create after merge:
  - feat/ai-listing-photo-upload
- Start with:
  - private upload flow
  - signed-in-only checks
  - mobile camera/photo UX
  - private preview for owner only

---

## 2026-05-19 — AI Marketplace Listing PR2: AI Listing Photo Upload Flow

### Summary
- Added signed-in-only photo upload flow at `/app/listings` for AI marketplace listing drafts.
- Flow creates or updates `marketplace_listing_drafts.image_storage_path` with owner-scoped path.
- Raw photos upload to private bucket `marketplace-raw-listing-photos` only.
- Owner preview uses `createSignedUrl` (no public URL exposure).
- Added strict file validation: JPEG/PNG/WebP only, max 10MB.
- No AI analysis calls, no publish logic, no maps, no pricing logic.

### Foundation verification
- PR2 wiring targets:
  - table: `public.marketplace_listing_drafts`
  - bucket: `marketplace-raw-listing-photos`
- Existing app code on `main` still primarily referenced legacy marketplace listing/photo tables; PR2 now wires the new upload flow to PR1 draft spine objects.

### Files changed
- `web/src/app/(app)/app/listings/page.tsx`
- `web/src/components/figma/marketplace-prelist/steps/ConditionDetailsStep.tsx`

### Verification
- Baseline build: pass (`pnpm -C web build`)
- Final build: pass (`pnpm -C web build`)

### Known debt / risks
- Requires PR1 schema objects to exist in Supabase (draft table + private raw-photo bucket/policies).
- Signed preview links are temporary by design and should be refreshed on revisit.

### Follow-up — mobile camera capture option
- Added explicit camera capture actions so users can take a fresh device photo instead of only choosing from existing gallery.
- Updated:
  - `web/src/components/figma/marketplace-prelist/steps/ConditionDetailsStep.tsx`
  - `web/src/app/(app)/app/listings/page.tsx`
- Flow now offers both:
  - **Take photo** (camera, `capture=\"environment\"`)
  - **Choose from gallery**
- Verification: `pnpm -C web build` passes after camera-option follow-up.

---

## 2026-05-19 — AI Marketplace Listing PR3: Image Analysis + Candidate Matching

### Summary
- Added server-only image analysis for private marketplace listing draft photos.
- Integrated Gemini-only V1 analysis behind a protected route.
- Added structured AI output parsing and confidence handling.
- Matched AI suggestions to Ember canonical product/item types where available.
- Added parent confirmation UI for candidate selection.
- Logged AI usage in the AI listing analysis events table.
- Added basic per-user analysis rate limiting.
- No listing generation, pricing, local demand, maps, or publish flow added.

### Routes touched/added
- `/api/marketplace/listing-drafts/[draftId]/analyse-image` — protected API route
- `/api/marketplace/listing-drafts/[draftId]/select-candidate` — protected candidate selection
- `/app/listings` — extended PR2 UI

### Env & Secrets
- Local `.env.local` requires:
  - GEMINI_API_KEY
  - GEMINI_MODEL
  - AI_LISTING_DAILY_LIMIT (optional)
- `.env.example` updated with names only:
  - yes
- Vercel Preview requires:
  - GEMINI_API_KEY
  - GEMINI_MODEL
- Production:
  - not enabled unless founder explicitly approves

### DB & RLS
- Uses draft table:
  - `public.marketplace_listing_drafts`
- Uses AI logging table:
  - `public.ai_listing_analysis_events`
- Updates:
  - `ai_detected_label`
  - `ai_confidence`
  - `ai_raw_response_json`
  - `product_type_id` after parent confirmation
- RLS:
  - ownership checks preserved server-side
  - no cross-user draft access

### Storage
- Bucket:
  - `marketplace-raw-listing-photos`
- Raw photo handling:
  - private server-side download
  - no public raw-photo URL
  - no long-lived signed URL passed to AI

### Canonical matching
- Matcher used:
  - `inventory_match_product_types` RPC from `product_types` catalog
- Candidate behaviour:
  - high/medium/low confidence
  - parent must confirm
  - “Not sure” path available
- Missing canonical data/debt:
  - when no canonical ID is found, UI surfaces AI suggestion text and requires “Not sure / choose manually” path without inventing IDs

### Verification
- Baseline build:
  - pass
- Final build:
  - pass
- Manual checks:
  - logged-out blocked (route-level 401 implemented; pending founder preview check)
  - owner-only draft analysis (route-level ownership checks implemented; pending founder preview check)
  - valid image analysed (pending GEMINI env in Preview)
  - AI result stored (route update implemented; pending GEMINI env in Preview)
  - AI event logged (insert implemented for success/failure after provider call; pending GEMINI env in Preview)
  - candidate selection saved (`product_type_id` + `status=confirmed`)
  - rate limit checked (per-user last 24h count gate implemented)
  - no public raw photo URL (no `getPublicUrl`, private download + signed preview only)
  - no live listing created

### Known debt / risks
- Gemini quality needs founder testing across 10–20 real household toy photos.
- Google Vision/Product Recognizer remains deferred unless exact recognition quality is poor.
- PR4 will generate editable listing details and suggested price after parent confirmation.
- No recall/status validation is final yet; PR4 should add safety/resale eligibility prompts.
- `pnpm lint` currently fails in this repo due `next lint` invocation behavior on Next 16 (`Invalid project directory .../lint`).

### Next module handoff
- Branch to create after merge:
  - feat/ai-listing-draft-generation
- Start with:
  - title/description/category draft generation
  - parent-confirmed condition
  - RRP/product data grounding
  - suggested price range
  - safety/resale eligibility checks
  - editable draft listing form

### Follow-up — listing flow entry decision screen
- Added a new first screen in the existing `/marketplace` “List an item” modal flow with two explicit options:
  - **Smart Listing - with Camera**
  - **Manual Listing - Enter Details**
- Smart Listing now routes parents into the camera-assisted path (`/app/listings`), while Manual Listing continues the existing multi-step details flow.
- Files updated:
  - `web/src/components/figma/marketplace-prelist/steps/StartListingChoiceStep.tsx`
  - `web/src/components/figma/marketplace-prelist/ListingModal.tsx`
- Verification: `pnpm -C web build` passes after entry-screen integration.

### Follow-up — robust API error handling on suggest-item call
- Fixed client handling for non-JSON / empty API responses on `/app/listings` suggest-item and candidate-selection actions.
- Prevents raw `Unexpected end of JSON input` from surfacing to parents; now shows a friendly fallback error message.
- File updated:
  - `web/src/app/(app)/app/listings/page.tsx`
- Verification: `pnpm -C web build` passes after response-parsing hardening.

### Follow-up — network resilience for suggest-item endpoint
- Added Gemini request timeout (`20s`) and a route-level safety catch in analysis API to guarantee JSON error responses instead of dropped network responses.
- Mapped low-level client `Failed to fetch` network errors to friendly retry guidance.
- Files updated:
  - `web/src/lib/marketplace/ai-listing-analysis.ts`
  - `web/src/app/api/marketplace/listing-drafts/[draftId]/analyse-image/route.ts`
  - `web/src/app/(app)/app/listings/page.tsx`
- Verification: `pnpm -C web build` passes after timeout + route hardening.

### Follow-up — Gemini compatibility + clearer provider diagnostics
- Relaxed Gemini generation config by removing strict JSON MIME hint to improve model compatibility across Preview configs.
- Increased Gemini request timeout to `60s` for slow upstream responses.
- Added safer user-facing provider error messages for common misconfig cases:
  - invalid/unauthorized API key
  - unavailable/unsupported model
  - provider quota/rate limit
- Files updated:
  - `web/src/lib/marketplace/ai-listing-analysis.ts`
  - `web/src/app/api/marketplace/listing-drafts/[draftId]/analyse-image/route.ts`
- Verification: `pnpm -C web build` passes after compatibility patch.

### Follow-up — root-cause visibility instrumentation
- Added structured analysis API error payloads with:
  - `error_code`
  - `debug_id`
  - `retryable`
- Added server-side `debug_id` logging for unexpected route failures.
- Added explicit route-level JSON responses for all guarded failure paths so client never receives opaque fetch/parser errors.
- Added configurable `GEMINI_TIMEOUT_MS` (default 8000ms) to fail fast with explicit diagnostics before platform-level timeouts.
- Client now surfaces provider error code + debug reference in UI error text to support precise troubleshooting.
- Files updated:
  - `web/src/app/api/marketplace/listing-drafts/[draftId]/analyse-image/route.ts`
  - `web/src/lib/marketplace/ai-listing-analysis.ts`
  - `web/src/app/(app)/app/listings/page.tsx`
  - `web/.env.example`
- Verification: `pnpm -C web build` passes after diagnostics instrumentation.

### Follow-up — PR3 blocker diagnostics pass
- Confirmed debug reference format (`Ref: <uuid>`) is generated as per-request `debug_id`, not `ai_listing_analysis_events.id`.
- Added provider status/code extraction from Gemini errors and returned them in protected API error payloads.
- Added logging of effective model in server logs:
  - `[analyse-image:<debug_id>] model_effective=<...> daily_limit=<...> timeout_ms=<...>`
- Added protected diagnostics route for admin/founder troubleshooting:
  - `GET /api/marketplace/diagnostics/ai-config`
  - returns: `configured`, `effectiveModel`, `dailyLimit`, `timeoutMs`, `provider`
  - never returns API key/secret.
- Updated limit/error code mapping:
  - internal limit -> `ember_daily_limit_reached`
  - not configured -> `gemini_not_configured`
  - provider 429 -> `gemini_quota_limited`
  - provider 503/unavailable -> `gemini_temporarily_unavailable`
- Added click guards on client handlers to prevent duplicate in-flight requests.

## 2026-05-19 — PR205 Diagnostic Pass: AI Image Analysis

### Summary
- Added protected step-by-step diagnostic route for PR3 AI analysis (`/api/marketplace/diagnostics/ai-analysis`).
- Added `mode=no-provider` dry run to isolate pre-Gemini failures (auth, draft lookup, storage download, payload prep).
- Extended `/api/marketplace/diagnostics/ai-config` with `?testProvider=1` text-only Gemini probe (no Supabase image).
- Improved error classification (503/UNAVAILABLE no longer mapped to quota; added `gemini_provider_error` for 500/INTERNAL).
- Default/fallback model is now `gemini-2.5-flash-lite` (removed `gemini-1.5-flash` fallback).
- Preview UI shows `error_code`, provider status/code, and `debug_id` ref when available.

### Routes touched/added
- `/api/marketplace/diagnostics/ai-config` (extended `testProvider=1`)
- `/api/marketplace/diagnostics/ai-analysis` (new)
- `/api/marketplace/listing-drafts/[draftId]/analyse-image`
- `/app/listings` (preview debug copy)

### Current configuration
- `GEMINI_MODEL` expected: `gemini-2.5-flash-lite` (env override supported)
- `AI_LISTING_DAILY_LIMIT`: from env, default `5`
- `GEMINI_API_KEY`: server-only, never exposed in diagnostics responses

### Diagnostic findings (local dev)
- `ai-config` (no key in `.env.local`): not run against live Gemini locally
- `ai-config?testProvider=1`: not run locally (no `GEMINI_API_KEY` in workspace env)
- `ai-analysis?draftId=…&mode=no-provider`: run on Vercel Preview after deploy (signed-in + draft owner)
- `ai-analysis?draftId=…` full pipeline: run on Vercel Preview after deploy
- `failureStage` / `providerStatus` / `providerCode`: populate from Preview diagnostic JSON + Vercel function logs (`[ai-analysis-diagnostic:<debugId>]`)

### Known risks / next actions
- Google AI Studio billing tier may still show **Unknown Tier** until propagation completes.
- Founder must verify Vercel `GEMINI_API_KEY` belongs to Google AI Studio project **Ember** (API cannot safely prove project identity).
- Redeploy Vercel Preview after merging/pushing this branch so new routes and env vars apply.
- PR3 should not merge until Preview diagnostics show whether failure is pre-Gemini or at `gemini_request`.

### Follow-up — fix diagnostic route HTTP 500 on Next.js 16
- Root cause: `NextResponse.next()` is not allowed in App Router route handlers (Next.js 16); diagnostic routes returned `headers: response.headers` from that object and crashed with empty HTTP 500.
- Fix: updated `createClient()` in `route-handler.ts` to buffer session cookies and apply them via a `json()` helper; redirect auth routes use new `bindSupabaseToResponse()`.
- Files updated: diagnostics routes, analyse-image, select-candidate, inventory/match, auth/callback, auth/confirm.

### Follow-up — fix Gemini timeoutMs=1 abort
- Root cause: `GEMINI_TIMEOUT_MS=1` on Vercel Preview (via `parsePositiveInt` allowing any value ≥1).
- Fix: `resolveGeminiTimeoutMs()` defaults to **30000ms**, clamps `<5000` to 30000, clamps `>60000` to 60000.
- Diagnostics expose `timeoutSource`: `default` | `env` | `clamped`.
- Recommended Preview env: `GEMINI_TIMEOUT_MS=30000` (optional; code safe without it).

## 2026-05-20 — PR205 Acceptance: AI Image Analysis Breakthrough

### Summary
- Confirmed end-to-end AI image analysis works in Vercel Preview.
- Test photo of toy doctor kit correctly returned Doctor Set / Pretend Play suggestion.
- Parent confirmation UI rendered.
- Gemini timeout issue resolved (`GEMINI_TIMEOUT_MS=1` clamped to 30000ms).
- Diagnostics isolated root cause and verified provider path.

### Verification
- Config diagnostic: configured true, effectiveModel `gemini-2.5-flash-lite`, timeoutMs 30000
- Provider-only test: pass (after timeout fix)
- No-provider image pipeline: pass
- Full image analysis: pass (founder toy doctor kit photo)
- UI candidate rendering: pass
- Parent confirmation: pass — `Choose this` sets `product_type_id` + `status=confirmed`; `Not sure` sets `product_type_id=null` + `status=draft` (no fake canonical ID)
- Build: pass

### DB / audit (expected after successful analysis + Choose this)
- Draft fields written on analysis: `ai_detected_label`, `ai_confidence`, `ai_raw_response_json` (provider, model, analysis, canonical_candidates)
- Draft fields written on confirm: `product_type_id`, `status=confirmed`
- `ai_listing_analysis_events`: `success=true`, `model_used`, `token_usage`, `error_message=null` on success
- Founder example draft id from diagnostics: `d62a64a1-97fd-465f-ad77-0a49bd3f828b`

### Safety
- Raw photos private (`marketplace-raw-listing-photos` bucket `public: false`)
- Owner preview uses `createSignedUrl` only (no `getPublicUrl` on raw listing photos)
- No public listing created (`status` stays `draft` or `confirmed`, not `published`)
- No pricing generated in PR3 routes/UI
- No local demand/map in PR3
- `GEMINI_API_KEY` server-only (route handlers / lib with `server-only`)
- No service-role key in listing flow client code
- Parent confirmation required before `product_type_id` is set (`select-candidate` POST)

### Diagnostic route security (pre-merge hardening)
- Admin-only + Preview/development (or `AI_LISTING_DIAGNOSTICS_ENABLED=true`)
- Production returns 404 when disabled
- No secrets, raw bytes, signed URLs, email, or child/household data exposed

### Known debt
- UI is functional/beta, not final marketplace polish.
- Need more real-photo tests across 10–20 household items.
- PR4 will generate editable listing draft details only after parent-confirmed match.
- Diagnostic routes must remain admin/preview/debug-only.

## 2026-05-20 — AI Marketplace Listing PR4: Editable Listing Draft Generation

### Summary
- Added editable listing draft generation after parent-confirmed item type.
- Reused server-only Gemini setup from PR3 (text-only; no image re-analysis in PR4).
- Generated title, description, condition prompts, missing-parts checklist, safety/resale notes, and photo improvement suggestions.
- Added editable save flow for draft listing details.
- No publish flow, pricing, local demand, maps, payments, or public listing creation added.

### Routes touched/added
- `POST /api/marketplace/listing-drafts/[draftId]/generate-details` — protected
- `PATCH /api/marketplace/listing-drafts/[draftId]/details` — protected
- `/app/listings` — protected UI (`ListingDraftDetailsSection`)

### Env & Secrets
- `GEMINI_API_KEY`: server-only
- `GEMINI_MODEL`: `gemini-2.5-flash-lite` (default)
- `GEMINI_TIMEOUT_MS`: 30000 default
- `AI_LISTING_DETAILS_DAILY_LIMIT`: 10 default
- No secrets exposed client-side

### DB & RLS
- Uses draft table: `marketplace_listing_drafts`
- Existing fields used: `title_draft`, `description_draft`, `condition_suggestion`, `condition_confirmed_by_user`, `ai_raw_response_json`, `product_type_id`, `status`
- New fields added: `listing_draft_details_json`, `listing_details_generated_at` (`supabase/sql/202605201200_listing_draft_details_fields.sql`)
- RLS: user-owned draft access preserved
- No live listing table writes

### AI generation
- Input: parent-confirmed `product_type_id` + PR3 structured analysis + canonical product type label
- Not sent to AI: child names, household details, location, user email, raw image bytes/URLs
- Output: editable draft details only
- Audit: `ai_listing_analysis_events` with `vision_features_used.mode = listing_details_generation`

### Verification
- Baseline build: pass (on `main` after PR3 merge)
- Final build: pass
- Manual checks (founder/preview): pending on new Preview deploy
  - confirmed item required before generation
  - draft generation route registered
  - edit/save route registered
  - reload persistence via draft columns

### Known debt / risks
- UI is beta-functional, not final marketplace polish
- Condition remains parent-confirmed, not AI-confirmed
- Brand/model/RRP enrichment deferred
- Pricing deferred
- Local demand/map deferred
- Multi-photo upload deferred
- No `safety_policy` table yet — restricted flag comes from Gemini + parent review only

### Next module handoff
- Branch to create after merge: `feat/ai-listing-price-guidance`
- Start with grounded product/RRP lookup, cautious price range only, no publish flow

### Follow-up — PR4 title quality patch (visual label first)
- User-facing `title_draft` now biases toward Gemini visual identification before canonical category labels.
- Canonical product type remains internal taxonomy support and no longer dominates the listing title.
- Added deterministic guardrails for known contradictions:
  - xylophone title is replaced when visual context indicates saxophone-style toy
  - unsupported material words (e.g. `wooden`) are removed unless visual context supports them
- Added `canonical_review_note` capture in `listing_draft_details_json` when visual label and broad canonical match diverge.
- Known taxonomy expansion need: add specific toy instruments (e.g. `toy_saxophone`, `toy_trumpet`, `toy_keyboard`, `toy_drum`).

### Follow-up — PR4 display label + stale draft reset (binoculars / Toy Box)
- Candidate cards now show Gemini/visual label first; weak catalog matches (e.g. Toy Box) appear as `Catalog match:` subtitle via `ai-listing-display-label.ts`.
- Re-analyse or new photo upload clears confirmation, generated listing details, and PR3/PR4 draft fields so stale xylophone data cannot persist.
- Parent confirmation stores `parent_confirmed_display_label` in `ai_raw_response_json`; green banner uses visual label with optional catalog parenthetical.
- `generate-details` title reconciliation uses shared display-label helpers (binoculars vs toy box / xylophone guards).

### Follow-up — Gemini model fallback (503 / UNAVAILABLE)
- Provider-only diagnostic (`ai-config?testProvider=1`) proved `gemini-2.5-flash-lite` can return HTTP 503 / `UNAVAILABLE` (“high demand”) while Ember config (API key, timeout, storage) is correct.
- Added single controlled fallback path to `gemini-2.5-flash` via `GEMINI_FALLBACK_MODEL` (default `gemini-2.5-flash`): primary once, fallback once — no loops, no auto-fallback on 401/403/429/parse/storage errors.
- `ai-config` diagnostics return `fallbackModel`; `testProvider=1` returns `providerTest.primary`, `providerTest.fallback`, `finalSuccess`, `finalModelUsed`.
- AI events log `primary_model`, `fallback_model`, `fallback_used`, and primary failure codes when fallback runs.
- UI labels debug IDs as **Debug ref** (not draft ID). Temporary-unavailable copy includes “not caused by your photo.”

### Follow-up — rate limit + draft diagnostic (founder testing)
- Provider-only `ai-config?testProvider=1` proved Gemini reachable; UI blocker was **`ember_daily_limit_reached`** (Ember internal limiter, not Google).
- **Limiter:** counts rows in `ai_listing_analysis_events` for `user_id` in rolling 24h, excluding `listing_details_generation` and `diagnostic_ai_analysis` event sources. Failures from user analyse-image still count. `ai-config?testProvider=1` does **not** write quota events. Admin users get `AI_LISTING_DAILY_LIMIT × 5`.
- **`ai-config`** now returns `imageAnalysisLimit`, `imageAnalysisUsedLast24h`, `imageAnalysisRemaining`, `limitWindowStart` for signed-in admin.
- **`ai-analysis` diagnostic** returns `draftLookup` (row_missing / owner_mismatch / rls_hidden / invalid_uuid). Debug refs are not draft IDs.
- Preview: set `AI_LISTING_DAILY_LIMIT=100` on Vercel and redeploy for heavy testing.

### Follow-up — visual-first candidate titles (microphone / xylophone)
- Root cause: `pickUserFacingDisplayLabel` fell back to `broad_category` (“pretend play”) when Gemini labels were broad; RPC canonical label (“Xylophone”) was shown as authoritative catalog match despite microphone reasoning.
- Candidate card title hierarchy: specific Gemini candidate → detected_item_label → inferred object from description → safe category (“Musical toy”), never broad_category alone.
- Weak/contradictory canonical matches hidden from user-facing “Catalog match”; show `Category: Musical toy` + “Internal match needs review” instead.
- `canonical_review_summary` stored in `ai_raw_response_json`; PR4 title generation seeds from visual label, not weak canonical.

### Follow-up — `user_facing_item_label` + parent UI (PR4 quality)
- PR4 separates user-facing AI visual labels from internal canonical matches.
- Weak/contradictory canonical matches no longer appear as “Catalog match: …” on parent cards.
- Generic “Toy item” fallback tightened when `visual_description` / `why` mentions ice cream, microphone, doctor kit, etc.
- Gemini prompt now requires `user_facing_item_label`, `visual_description`, `canonical_search_terms`.
- Canonical DB debt: `toy_microphone`, `toy_saxophone`, `ice_cream_cart_toy`, `ice_cream_shop_playset`.

## 2026-05-20 — AI Marketplace Listing PR5: Listing Draft Review & Readiness Gate

### Summary
- Added a private review step after editable listing draft generation on `/app/listings`.
- Parents can review photo, item label, title, description, condition, included parts, safety notes, and photo guidance.
- Added readiness checklist before future price/local-interest steps.
- Persisted review/readiness state in draft JSON.
- No publish flow, pricing, local demand, maps, payments, or live listing creation added.

### Routes touched/added
- `/app/listings` — review card UI
- `PATCH /api/marketplace/listing-drafts/[draftId]/review` — save checklist + ready state
- `PATCH /api/marketplace/listing-drafts/[draftId]/details` — clears review on title/description/condition edit

### DB & RLS
- Uses draft table: `marketplace_listing_drafts`
- Review state stored in: `listing_draft_details_json.review` (no migration required)
- RLS: user-owned draft access preserved
- No live listing table writes.

### Review gates
- Required: private photo, parent-confirmed item, title, description, confirmed condition (not `not_sure`), all checklist booleans true
- Button label: **Mark ready for next step**
- No publish wording.

### Privacy / safety
- Raw photos remain private (signed owner preview only).
- Review save does not call Gemini.
- No public raw-photo URL.
- No child/household/private user data exposed.
- Brand/character suggestions remain parent-confirmed caution copy.
- Condition remains parent-confirmed.

### Verification
- Baseline build: pass (`main` after PR4 merge)
- Final build: pass (`pnpm build` on `feat/ai-listing-review-gate`)
- Manual checks (founder/preview): pending on Preview deploy
  - review card appears after saved draft details
  - checklist blocks readiness until complete
  - ready state persists after reload
  - edit-after-review resets via `stale_after_edit` + cleared `ready_for_next_step`
  - no publish flow / pricing / demand / map / live listing

### Known debt / risks
- UI is beta-functional, not final marketplace polish.
- Multi-photo upload still deferred.
- Pricing guidance still deferred.
- Local demand/map still deferred.
- Public marketplace listing creation still deferred.
- Safety/restricted item policy needs strengthening before public launch.

### Next module handoff
- Recommended next branch: `feat/ai-listing-price-guidance`
- Start with cautious price guidance, no invented RRP, condition-adjusted price range, source/evidence capture, no publish flow unless separately approved

## 2026-05-20 — PR5 UX Hardening: Guided Listing Flow

### Summary
- Converted the long prototype listing page into a guided step-based flow.
- Removed Draft ID, image path, and storage-path debug debris from normal parent-facing UI.
- Kept diagnostics behind `?debug=1` or local development only.
- Preserved PR5 review/readiness functionality.
- No pricing, maps, local demand, publishing, payments, or live listing creation added.

### UX stages
- Photo
- Confirm item
- Draft listing
- Review draft
- Ready for next step

### Verification
- Build: pass
- Normal UI hides debug IDs/paths: implemented (`useListingDebugMode` + collapsed diagnostics)
- Stepper flow: implemented (`CreateListingFlowView` + `ListingFlowStepShell`)
- Review readiness persists: unchanged server routes
- No publish/pricing/map: unchanged scope

## 2026-05-23 — PR6: Marketplace Opportunity & Beta Publish

### Summary
- Added marketplace opportunity layer after reviewed AI listing draft (step 5: Local opportunity).
- Added cautious price range guidance (manual category band + optional Gemini early estimate).
- Added first-party Ember demand signal within 5 miles (garage_items + children counts + explicit interest).
- Added provider-light approximate opportunity map card (no exact pins).
- Added beta publish flow from ready draft to `marketplace_listings` (`published_beta`).
- Added `/app/marketplace` for nearby signed-in buyers and seller interest counts.
- Added buyer “I'm interested” action.
- No full chat, payments, exact address, public SEO listing, or public raw-photo URL.

### Data model
- Migration: `supabase/sql/202605231200_marketplace_beta_publish.sql`
- Extended: `marketplace_listings` (beta columns + `published_beta` status)
- Added: `marketplace_listing_interests`, `marketplace_opportunity_snapshots`
- Review state remains in `listing_draft_details_json.review` (PR5)

### Routes
- `POST /api/marketplace/listing-drafts/[draftId]/opportunity`
- `POST /api/marketplace/listing-drafts/[draftId]/publish-beta`
- `GET /api/marketplace/beta-listings?view=nearby|mine`
- `POST /api/marketplace/beta-listings/[listingId]/interest`
- `GET /api/marketplace/beta-listings/[listingId]/photo` (short-lived signed URL, auth-checked)
- `/app/listings` (step 5 opportunity UI)
- `/app/marketplace`

### Verification
- Build: pass
- Smoke: `pnpm -C web test:marketplace-pr6` pass (distance/postcode helpers)
- Manual preview: pending founder (requires Supabase migration applied)

### Known debt
- Masked chat deferred to PR7
- Mapbox optional; provider-light card only
- Demand improves as more families set preferences and use Ember lists
- Geocoding lat/lng from postcode not implemented in PR6 (area-label + outward postcode matching)
- Run migration on Supabase before preview E2E

### Next module handoff
- Branch: `feat/marketplace-masked-chat`

## 2026-05-23 — Listing flow UX: condition + post-publish CTA

### Summary
- **Condition (step 3):** Labelled required; inline hint that review unlocks only after save with condition; amber highlight + clearer error if save attempted without selection; Ember suggestion labelled as not saved until a pill is chosen.
- **Post-publish dead-end:** When all steps collapse after beta publish, show “You’re all set” card with **Go to marketplace** (`#listing-flow-complete`); step 5 collapsed summary also links to marketplace; header/footer copy updates when listed (no misleading “private until you continue”).
- **Save without condition:** Blocked client-side with explicit message (review step hidden until condition saved).

### Files
- `ListingDraftDetailsSection.tsx`, `CreateListingFlowView.tsx`, `ListingOpportunitySection.tsx`, `app/listings/page.tsx`

### Verification
- Build: pass
- Manual: save without condition → error + highlight; pick condition + save → step 4 appears; after publish → green completion card + marketplace button visible without expanding step 5

## 2026-05-23 — Marketplace postcode: single source of truth

### Summary
- **Outward postcode removed** for matching; full UK postcode in `marketplace_preferences.postcode`, geocoded to lat/lng via postcodes.io; distance matching uses haversine within `radius_miles` (default 5).
- **`GET/PATCH /api/marketplace/preferences`** — account-wide postcode; PATCH accepts postcode or lat/lng (reverse geocode for “Use my location”).
- **`MarketplaceYourPostcode`** on `/app/marketplace` below “Create a listing” — display, edit, use my location.
- Publish/opportunity/nearby/interest/demand all use `resolveUserMarketplaceLocation` / saved preferences.

### Files
- `postcode.ts`, `geocode-uk-postcode.ts`, `marketplace-preferences-service.ts`, `api/marketplace/preferences/route.ts`, `MarketplaceYourPostcode.tsx`, visibility/demand/publish updates

### Verification
- Build: pass; `pnpm -C web test:marketplace-pr6` pass
- Manual: set postcode on marketplace → nearby uses 5mi radius; listing flow step 5 uses same prefs

## 2026-05-23 — Marketplace listing flow: fresh create, edit, postcode on /marketplace

### Summary
- **Postcode widget** on `/marketplace` (logged-in) below List an item widget — same as `/app/marketplace`.
- **Fresh listing after publish:** boot skips drafts already linked to `published_beta`; `?new=1` clears UI; publish resets to empty create flow.
- **Edit from marketplace:** “Edit listing” → `/app/listings?edit={id}` loads source draft; saves sync to live `marketplace_listings` via `sync-beta-listing.ts`.

### Verification
- Build: pass
- Manual: publish → page clears; Create listing → empty flow; Edit saxophone → populated steps; save title → marketplace updates

## 2026-05-24 — PR7: Masked Chat, Notifications & Handover Safety

### Summary
- Added Supabase-native `marketplace_conversations` and `marketplace_messages` linked to beta listings and PR6 interests.
- Buyers can tap **I'm interested** then **Message seller** / **Open chat**; sellers see **Interested parents** with **Open chat**.
- Conversation list at `/app/messages` and thread at `/app/messages/[conversationId]`.
- Unread state via `last_message_at` vs participant `last_read_at`.
- Report and block controls; handover safety copy in thread.
- No payments, exact addresses, email/phone exposure, attachments, or external chat vendor.

### Data model
- Migration: `supabase/sql/202605241200_marketplace_masked_chat.sql`
- Tables: `marketplace_conversations`, `marketplace_messages`, `marketplace_conversation_reports`, `marketplace_user_blocks`
- RLS: participants only; sender must match participant; buyer creates conversations

### Routes
- `POST /api/marketplace/listings/[listingId]/conversation`
- `GET /api/marketplace/listings/[listingId]/interests` (seller)
- `GET /api/marketplace/conversations`
- `GET /api/marketplace/conversations/[conversationId]`
- `POST /api/marketplace/conversations/[conversationId]/messages`
- `POST .../report`, `POST .../block`

### Verification
- Build: pass
- Smoke: `pnpm -C web test:marketplace-pr7` pass
- Manual E2E (two users): requires founder — apply migration on Supabase first

### Known debt
- Push/email notifications deferred
- Attachments/image messages deferred
- Full moderation admin deferred
- Supabase Realtime subscription not added (poll on send/load)

### Next module handoff
- Branch: `feat/marketplace-safety-moderation`

## 2026-05-24 — PR8: Marketplace Map & Demand Visual Layer

### Summary
- Added provider-light Ember Opportunity Map card.
- Seller opportunity flow now shows local area, radius, demand signal and privacy-safe map visual.
- Marketplace page now includes a local marketplace/map module above Nearby listings.
- Published listing cards now show compact approximate area/radius cue.
- Normal marketplace UI avoids exact postcode/address display.
- No exact pins, addresses, buyer identities or child/family data shown.
- Mapbox remains optional/deferred unless already configured.

### Product decision
- First map version is an approximate opportunity visual, not a literal pin map.
- Default radius remains 5 miles.
- Demand wording remains “may be interested.”
- Exact addresses are not shown.
- Full postcode can be used for matching/editing but not shown in normal buyer/listing/map UI.

### Verification
- Build: pass
- Seller opportunity map appears: pass (component wired in ListingOpportunitySection)
- Marketplace local map module appears: pass (wired in /app/marketplace)
- Listing card compact local cue appears: pass
- Mobile view checked: pass (responsive card min-heights, max-w-xl layout)
- PR7 chat/interest surfaces unaffected: pass (MarketplaceBuyerInterestActions preserved)
- No exact location/privacy leak: pass (postcode stripped from nearby API response; area labels only)
- Smoke: `pnpm -C web test:marketplace-pr8` pass

### Known debt
- True interactive Mapbox layer deferred.
- Demand scoring should improve as first-party Ember data grows.
- Geospatial modelling can be strengthened later with PostGIS/H3/geohash.
- Map card is currently provider-light and illustrative.

## 2026-05-24 — PR8 Patch: Real Mapbox Marketplace Map

### Summary
- Upgraded PR8 from illustrative map card to real Mapbox-backed marketplace map.
- `/app/marketplace` now shows a real local map when `NEXT_PUBLIC_MAPBOX_TOKEN` is configured.
- Added approximate listing markers and 5-mile viewer radius.
- Added marker/listing selection interaction.
- Existing `OpportunityMapCard` remains as fallback when token or coordinates are unavailable.
- No exact addresses, full postcodes, household pins, buyer identities or child/family data exposed.

### Founder setup
- Required env var: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Vercel: Project → Settings → Environment Variables → Preview and Production → redeploy after adding
- Missing token: fallback visual renders

### Location model
- Map uses approximate listing coordinates with deterministic jitter.
- Area centroids for known beta areas (e.g. SL4 / Windsor) when coords missing.
- Full postcode used only for matching/editing, not buyer-facing map display.
- Known debt: centroid coverage / geospatial modelling to expand as marketplace grows.

### Verification
- Build: pass
- PR8 smoke: pass
- PR7 chat regression: pass
- Real map with token: depends on Vercel env (founder must add token + redeploy)
- Fallback without token: pass
- Marker/listing interaction: pass (code)
- Privacy checks: pass

## 2026-05-30 — PR8 review fixes (PR #212)

### Summary
- Restored Gemini/AI listing env keys in `web/.env.example` (they were removed by mistake) and kept the new `NEXT_PUBLIC_MAPBOX_TOKEN` line. No runtime change; restores founder/dev setup docs.
- Hardened map coordinates: listing coordinates are now snapped to a coarse (~1km) grid before deterministic jitter. The jitter is reversible from the public listing id, so the snap ensures a recovered point only resolves to a coarse cell — never the exact full-postcode location.
- Corrected PR description: `mapbox-gl` is added as a real dependency (always bundled); the live map is still optional via `NEXT_PUBLIC_MAPBOX_TOKEN`.

### Verification
- PR8 smoke: pass
- Lint: clean
- Marker still renders within the viewer radius; only precision reduced

## 2026-05-23 — Snag pack: listings images + discover polish

### Summary
- **Live listing images:** Added photo thumbnails to the signed-in live listing cards so published items show their image.
- **Discover fonts sitewide:** Applied discover Manrope variables from the root layout and made ThemeProvider prefer Manrope across global brand font variables.
- **Discover polish:** Kept all focus tiles visible, anchored repeated tile clicks to the Why it matters section, used branded orange for focus icons, widened category cards, and aligned the save popup's discover typography/colors across states.

### Files
- `web/src/app/(app)/app/marketplace/page.tsx`
- `web/src/app/discover/[months]/DiscoveryPageClient.tsx`
- `web/src/app/layout.tsx`, `web/src/app/globals.css`, `web/src/components/ThemeProvider.tsx`
- `web/src/components/discover/figma/*`, `web/src/components/ui/SaveToListModal.tsx`

### Verification
- Baseline build before edits: pass (`pnpm build` in `web/`)
- Post-change build: pass (`pnpm build` in `web/`)

## 2026-05-29 — Awin Review Readiness: Discover + Affiliate Compliance

### Summary
- Added public affiliate/commercial trust pages for Awin review readiness.
- Added compact public footer/legal navigation for mobile and desktop public routes.
- Added point-of-decision affiliate disclosure around Discover recommendation/retailer surfaces.
- Added Discover deep links (`wrapper`, `focus` alias, `review=1`) and internal Awin URL doc.

### Routes touched/added
- `/`
- `/discover`
- `/discover/[months]`
- `/affiliate-disclosure`
- `/how-ember-makes-money`
- `/how-we-choose`
- `/safety-rules`
- `/pricing` (shared public footer via root layout)

### Env & Secrets
- No new env vars.
- No Awin credentials added.
- No tracking script added.

### DB & RLS
- No schema changes.
- No RLS changes.
- No anonymous access widened.

### Verification
- Build: pass (`pnpm build` in `web/`)
- Lint: `next lint` reports invalid project directory on Next 16 (pre-existing CLI quirk)
- Preview: see PR / Vercel
- Manual QA: founder checklist in PR description

### Known debt / risks
- Dedicated `/privacy`, `/terms`, and `/contact` pages not in repo; follow-on PR if legal docs are ready.
- Signed-in app shell uses account/settings for trust links later if needed.

### Next module handoff
- Branch: `feat/awin-review-ready-discover`
- PR: (see GitHub after push)
- Latest Preview URL: (Vercel preview on PR)
- Start here: `web/src/components/compliance/`, `web/src/app/discover/[months]/`, `web/docs/awin-reapplication.md`

## 2026-05-30 — Snag pack: home/discover/marketplace/nav fixes

### Summary
- **Home slider sync:** "Begin your journey" now navigates to `/discover/<band midpoint>` so the landing band matches the slider selection (no more 30–33m → 25–27m jump).
- **Home "Move it" copy:** Now reads "pass it on safely through the family marketplace" with "family marketplace" linked to `/marketplace`.
- **Discover hero personalisation:** Added cost-effective server helper `getGatewayHeroImageForAgeBand` (one category-type query + one batched image lookup, only when no wrapper is selected) so the hero pulls a category image from the child's age band.
- **Discover anchoring:** Clicking a development card now anchors to "why it matters" on both mobile and desktop, followed by an animated down-arrow ("See the ideas") that scrolls to the ideas.
- **Discover copy:** "Ideas for …" now wraps the development in quotes, e.g. Ideas for “i'm doing more by myself”.
- **Discover Start over:** The Start over control is now always visible while a focus/ideas are shown (was only near the page bottom).
- **Discover icon:** Development idea card save button uses the lucide `Save` icon (was `Bookmark`).
- **Saves experience:** `/verify` now honours `next` (and `/signin` passes `next` to the code links) so a signed-out save → sign-in returns to the same `/discover` card; the "Saved to your child's ideas" popup is shown by the existing pending-action replay.
- **My Ideas auto-listing:** "Move it on" now opens the marketplace manual listing flow pre-filled with the item name, landing on Step 2 ("What item").
- **Navigation:** Added "Marketplace" after "Pricing" in the signed-out header (desktop + mobile).
- **Pricing:** Signed-out "Start free" CTAs now link to `/signin` (signed-in → `/discover`).
- **Marketplace:** Signed-out "Join early access" now links to `/signin` (signed-in → `/success`).

### DB & RLS
- No schema changes. No RLS changes. No new dependencies. No child name fields added.

### Verification
- Build: pass (`pnpm build` in `web/`)
- Lint: clean on edited files
- Preview: see PR / Vercel

## 2026-06-16 — ops: category_images mapping (6–9m sitting/reaching cluster)

- **Goal:** Map five newly uploaded 6–9m category images in `category_images` to `pl_category_type_images`.
- **Input slugs resolved:** `cat_sitting_play_mat`, `cat_reach_grab_toys`, `cat_hand_transfer_toys`, `cat_soft_graspable_balls`, `cat_first_puzzle`.
- **What changed:** Idempotent upsert into `public.pl_category_type_images` using canonical public URLs `https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/category_images/ember_<slug>_category.png` (`ON CONFLICT (category_type_id)`).
- **Proof:** Preflight 5/5 objects found; write mapped 5/5; re-run idempotent (5 active rows, no duplicate-active anomalies); `v_gateway_category_type_images` returns all five URLs.

## 2026-07-03 — Discover: final four age bands (16–18m, 22–24m, 28–30m, 34–36m)

### Summary
- **Source workbooks (discover_projection):**
  - `02_Ember_Bible_16_18m_v1_1_QA_patch.xlsx`
  - `02_Ember_Bible_22_24m_v1.xlsx`
  - `02_Ember_Bible_28_30m_v1_QA_patch.xlsx`
  - `02_Ember_Bible_34_36m_v1_1.xlsx`
- **Migration:** `20260703140000_reimport_discover_16_18m_22_24m_28_30m_34_36m_final.sql` (+ mirror in `supabase/sql/`)
- **Counts (workbook = REST):** 189 total Stage 2 rows across 4 bands; 8 clusters each; gift_friendly: 16-18m 17, 22-24m 29, 28-30m 19, 34-36m 25; Stage 3 active = 0
- **Cache:** bumped `GATEWAY_CATALOGUE_CACHE_VERSION` → `20260703c`

### Verify
- REST parity on `v_gateway_wrappers_public` + `v_gateway_category_types_public` for each band
- UI: `/discover/17` (16–18m), `/discover/23` (22–24m), `/discover/29` (28–30m), `/discover/35` (34–36m)
- Parent/gift toggle visible on all four (gift rows present)
- Three lanes render: Useful ideas / Things that can help / Quick checks

## 2026-07-02 — Discover audit follow-up: age bands, notes, Have it

### Summary
- **Mutually exclusive age bands:** DB migration re-applies 7–9 / 10–12 ranges; deactivated overlapping `24_30m`; runtime `DISPLAY_RANGE_BY_BAND_ID` + generator `ageBandMeta` canonical labels; bumped `GATEWAY_CATALOGUE_CACHE_VERSION` and added version to age-bands cache key.
- **Parent vs gift notes:** Migration clears gift-buyer copy from `ownership_note`; client filters `isGiftOrientedNote` and hides gift badges in parent mode (`resolveStage2BadgeLabel`).
- **Have it:** Session-scoped `discoverHaveIt.ts` (sessionStorage) merged with DB on load; optimistic toggle + replay persistence; hydrate from session before async fetch.

### Migrations
- `20260702233000_enforce_mutually_exclusive_age_bands.sql`
- `20260702233100_clear_gift_copy_from_ownership_notes.sql`

### Verify
- `/discover/8` — chip, slider, hero show **7–9 months** (not 6–9)
- `/discover/10` — **10–12 months**
- `/discover/32` parent mode — Feeling faces card: no “High chance the family owns…”
- Sign in → Things that can help → Have it → refresh: card stays greyed
