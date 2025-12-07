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

### 3rd-party wiring
- Builder **Model:** `page`
- Builder **Preview URL:** `/api/preview?secret=Olivia2027&path={{content.data.url}}`
- Page target example: `/cms/hello2`

### DB & RLS
- N/A for this module (no schema changes)

### Verification (Proof-of-Done)
- `/ping` → **200**
- `/api/preview?secret=Olivia2027&path=/cms/hello2` → **307** to `/cms/hello2?builder.preview=true`
- `/cms/hello2?builder.preview=true` (in dev/preview) → **200** (renders draft)
- `/api/probe/builder?path=/cms/hello2&secret=Olivia2027` → `{ ok: true, preview: true, hasContent: true }` when draft exists
- Published content: `/cms/hello2` → **200** (if published), **404** (if not)

### Known debt / risks (carried forward)
- Ensure `NEXT_PUBLIC_BUILDER_API_KEY` is a **real key** in all envs (not a placeholder).
- Re-apply CSP headers any time `next.config.*` is replaced.
- Keep `BUILDER_PREVIEW_SECRET` private (rotate if leaked).
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
- `/_ds/builder` — private (diagnostic probe for the `page` model)
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
- Visit `/_ds/builder` → probe confirms `page` model entries and URL attributes.
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
MD

sed -n '1,220p' PROGRESS.md
