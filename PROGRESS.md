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
