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
- /new (public landing page, redirects to /new/26)
- /new/[months] (public landing page with age preload, e.g. /new/25)

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
## 2025-12-30
- Decision: Defer “forgot password email reliability” work until Ember has a custom domain and deliberate email sender setup. For now, unblock admin access by creating admin user with password directly in Supabase Auth Users.
- Decision: Maintain invite-only access (no auto-create users; friends must be pre-created in Supabase Auth).
- Decision: Keep PR hygiene strict: one open feature PR at a time; close stale PRs promptly.


------

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
7. Fixed ProductForm.tsx: properly handles empty ratings as null

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