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