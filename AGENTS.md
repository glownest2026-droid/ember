# AGENTS.md

## Cursor Cloud specific instructions

Ember is a single Next.js 16 (App Router, React 19) web app living in `web/`. `web/` is
the pnpm workspace root; run all app commands from there. Scripts are defined in
`web/package.json` (`dev`, `build`, `start`, smoke tests). Package manager is
`pnpm@10.13.1` (pinned via `packageManager`; the startup update script activates it).

The backend is a **hosted Supabase project** (Postgres + Auth + Storage). There is no
committed `supabase/config.toml`; the intended dev setup points `web/.env.local` at the
shared hosted project.

### Run / build / lint

- Dev server: `pnpm -C web dev` (Next dev on http://localhost:3000).
- Build: `pnpm -C web build` — this **succeeds without any env vars** (Supabase clients
  are created lazily), so it's a good compile check on its own.
- Lint: **`pnpm lint` is broken.** `next lint` was removed in Next 16, so the script just
  errors with `Invalid project directory ... /lint`. Run ESLint directly instead:
  `pnpm -C web exec eslint .` (the repo currently has pre-existing lint findings).

### Supabase env is required to render core pages

- `web/.env.local` must define `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (plus `SUPABASE_SERVICE_ROLE_KEY` for admin /
  marketplace-write / cron routes). These are not in the repo — get them from the hosted
  Supabase project (see `web/docs/FEB_2026_AUTH_SETUP.md`).
- Without them, `/`, `/discover`, and other catalogue pages return HTTP 500 with
  `supabaseUrl is required` (thrown in `web/src/utils/supabase/public-catalogue.ts`).
  Purely client-auth pages like `/signin`, `/verify`, and `/account` still render.

### The repo SQL history does NOT fully rebuild the schema

`supabase/sql/` and `supabase/migrations/` cannot recreate a working catalogue DB from
scratch: several base objects were created out-of-band on the hosted project and are
never defined in-repo (e.g. `user_roles`, `pl_development_needs`, `products.is_archived`),
and some files include guard checks that abort against a partial schema. For Discover /
catalogue work, use the hosted Supabase project rather than a from-scratch local DB.

### Optional: local Supabase for auth-only flows

You can exercise the **auth** flow fully offline with the Supabase CLI + Docker
(`supabase start`) — GoTrue + Mailpit work without the catalogue tables. Point
`.env.local` at the local API/anon key, then sign in via email OTP: request a code on
`/signin`, read it from Mailpit (http://127.0.0.1:54324), and verify on `/verify`.
For the 6-digit code to appear in the email, the magic-link template must include
`{{ .Token }}` (same requirement as production, per `docs/FEB_2026_AUTH_SETUP.md` §4);
locally set `[auth.email.template.magic_link]` in `supabase/config.toml`.

### next/image logo gotcha (local Supabase only)

The Ember logo is served from the hosted Supabase storage host, and `web/next.config.js`
only allowlists the host derived from `NEXT_PUBLIC_SUPABASE_URL`. If you point at a
**local** Supabase URL, any page that renders the logo throws
`Invalid src prop ... is not configured under images`. Using the hosted
`NEXT_PUBLIC_SUPABASE_URL` avoids this.
