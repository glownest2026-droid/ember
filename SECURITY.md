# SECURITY.md — Ember

_Last reviewed: 2025-10-31 (Europe/London)_

## Scope & Surfaces

- **Frontend**: Next.js App Router (TypeScript) in `/web`
  - Public routes (examples): `/`, `/play`
  - Private/protected routes (future modules): `/app/*` (requires auth)
- **Hosting**: Vercel
  - **Production branch**: `main`
  - **Root Directory**: `web`
- **Database**: Supabase (Postgres + RLS)
  - **Anon key** used by client for public operations gated by RLS
  - **Service key** never used in client; rotation via Supabase dashboard

## Environment Variables

- **Client-exposed** (must exist in Vercel **Preview** and **Production**, and in local `.env`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Storage locations**
  - **Vercel** → Project → **Settings** → **Environment Variables**
    - Scopes: **Preview** and **Production** (both required)
  - **Local/dev**: `/web/.env` (never commit). Template at `/web/.env.example`.

## Database Tables & RLS (current intent)

- `waitlist`
  - **Anon INSERT: allowed**
  - **Anon SELECT: NOT allowed**
  - RLS enabled with:
    - Policy (INSERT to anon): `USING (true) WITH CHECK (true)`
    - **No SELECT policy** (so anonymous reads are blocked)
- `play_idea`
  - **Public SELECT: allowed (anon)**
  - RLS enabled with:
    - Policy (SELECT to anon): `USING (true)`

> These policies ensure the landing form can write to `waitlist` without exposing entries, while `/play` can safely display `play_idea` content.

## Tailwind & PostCSS Guardrails

- We **must** align files to the installed Tailwind major version:
  - **Tailwind v4**:
    - `/web/src/app/globals.css`: `@import "tailwindcss";`
    - `/web/postcss.config.js`: `module.exports = { plugins: { "@tailwindcss/postcss": {} } }`
  - **Tailwind v3**:
    - `/web/src/app/globals.css`: `@tailwind base; @tailwind components; @tailwind utilities;`
    - `/web/postcss.config.js`: `module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } }`

If build errors mention **PostCSS config undefined** or **unknown at-rule**, fix the pair accordingly.

## Key Rotation (Supabase)

1. Supabase → **Project Settings** → **API** → under **Project API keys**, click **Generate new** for **anon** (and **service** if needed).
2. Copy new **anon** key → Vercel → Project → **Settings** → **Environment Variables**:
   - Update **Preview** and **Production** values for `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Trigger redeploys (Vercel will rebuild on env change).
4. Invalidate old keys if appropriate; audit client error logs for expired sessions.

## Incident Response (quick)

- Suspected public data leak: revoke anon key, disable affected policies, rotate keys, redeploy, and audit access logs.

## Auth surfaces (Module 2)
- `/signin` — public magic-link entry point
- `/auth/callback` — exchanges PKCE code for session (cookies)
- `/app/*` — protected by middleware; unauthenticated users → `/signin`
- Sessions: cookie-based via `@supabase/ssr`; refreshed in `middleware.ts`

- Production build misconfig: revert last PR, redeploy previous build from Vercel **Deployments** tab.

