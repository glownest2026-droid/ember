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
