# Staging foundation — current truth (as of PR)

_One-page snapshot of repo and deployment wiring. No staging backend or seed data in this PR._

## Repo and app roots

| Concept | Path / value |
|--------|---------------|
| **Repo root** | Repository root (e.g. `ember/`). No `package.json` at repo root. |
| **App root** | `web/` — contains `package.json`, `next.config.js`, `vercel.json`, `middleware.ts`. |
| **Vercel build root** | Must be `web` when project is connected to the repo root. Configure in Vercel: **Settings → General → Root Directory** = `web`. |

## Package manager and build

| Item | Value |
|------|--------|
| **Package manager** | pnpm (see `web/package.json` → `"packageManager": "pnpm@10.13.1"`) |
| **Install** | `pnpm install` (run from `web/`) |
| **Build** | `pnpm run build` (runs `prebuild` then `next build`) |
| **Prebuild** | `node scripts/check-no-conflict-markers.js` |

## Production branch and deployment flow

| Item | Value |
|------|--------|
| **Production branch** | `main` — deploys to production when Vercel is linked to this repo. |
| **Preview deployments** | Each PR and non-main branch gets a Vercel preview URL (e.g. `ember-git-<branch>-<team>.vercel.app`). |
| **Vercel config** | `web/vercel.json` — crons only (`/api/cron/link-health`). No root directory override in repo; set in Vercel dashboard. |

## Environment variables (referenced in code)

See **Environment matrix** in `docs/staging/environment-matrix.md` for the full list and which env each key is used in. Summary:

- **Supabase (app):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by browser and server Supabase clients.
- **Supabase (server-only, admin/cron):** `SUPABASE_SERVICE_ROLE_KEY` (admin API routes); `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` (affiliate `/go/[id]` and cron `/api/cron/link-health`).
- **Auth flags:** `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE`, `NEXT_PUBLIC_AUTH_ENABLE_APPLE`, `NEXT_PUBLIC_AUTH_ENABLE_EMAIL_OTP`.
- **Admin:** `EMBER_ADMIN_EMAILS` (comma-separated).
- **Builder.io:** `NEXT_PUBLIC_BUILDER_API_KEY`, `BUILDER_PREVIEW_SECRET`.
- **Other:** `AFFILIATE_DEFAULT_UTM`, `CRON_SECRET`.
- **Vercel (read-only):** `VERCEL_GIT_COMMIT_SHA`, `VERCEL_ENV` (used in admin PL page for display).

## Supabase wiring (file paths)

| Context | File | Notes |
|---------|------|--------|
| **Browser client** | `web/src/utils/supabase/client.ts` | `createBrowserClient` with `NEXT_PUBLIC_SUPABASE_*`. |
| **Server client** | `web/src/utils/supabase/server.ts` | `createServerClient` with cookies; no-op cookie setters (middleware handles refresh). |
| **Route handler (auth)** | `web/src/utils/supabase/route-handler.ts` | `createClient(request, response)` for `/auth/callback`, `/auth/confirm`. |
| **Middleware** | `web/src/utils/supabase/middleware.ts` | Session refresh for all routes; uses `NEXT_PUBLIC_SUPABASE_*`. |

## Auth and middleware

- **Middleware entry:** `web/middleware.ts` — delegates to `updateSession` in `web/src/utils/supabase/middleware.ts`; protects `/app/*`, `/add-children`, `/account`; handles `/cms` and `/api/preview` CSP and redirects.

## Staging in this repo (before this PR)

- No `staging` branch in the repo at the time of this PR.
- No staging-specific env or feature flags in code.
- No environment badge/banner logic in the app.
- Vercel project: one production deployment from `main`; previews from other branches. Staging will be a **branch-based** lane (`staging` → stable staging URL) per topology decision.
