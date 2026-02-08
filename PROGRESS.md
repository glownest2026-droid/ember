# CTO Snapshot (Source of Truth)
_Last updated: 2026-01-04_

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
- /app/children
- /app/recs
- /ping
- /cms/lego-kit-demo
- (optional) /cms/diag
- /discover (canonical; redirects to first band)
- /discover/[months] (V1.0 doorways experience)
- /new, /new/[months] (308 redirect to /discover)

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

# Decision Log (dated)
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
