# Staging backend — current truth (backend isolation PR)

_Read-only snapshot of Supabase and backend wiring as discovered from the repo. No fabrication._

## Supabase client wiring (exact paths)

| Context | File | Function / usage |
|---------|------|-------------------|
| **Browser** | `web/src/utils/supabase/client.ts` | `createClient()` → `createBrowserClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)` |
| **Server (App Router)** | `web/src/utils/supabase/server.ts` | `createClient()` → `createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, { cookies })` |
| **Route handler (auth)** | `web/src/utils/supabase/route-handler.ts` | `createClient(request, response)` → `createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, { cookies })` |
| **Middleware** | `web/src/utils/supabase/middleware.ts` | `updateSession(req)` uses `createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, …)` |

All app-facing Supabase usage goes through these helpers. **There is no other env key for the main app** — only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` control which Supabase project the app talks to.

## Server-only Supabase (admin / cron / affiliate)

| Context | File | Env keys |
|---------|------|----------|
| **Admin API routes** | `web/src/app/api/admin/products/route.ts`, `[id]/route.ts`; `api/admin/category-types/route.ts`, `[id]/route.ts`; `api/admin/theme/route.ts` | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| **Affiliate redirect** | `web/src/app/go/[id]/route.ts` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` |
| **Cron (link health)** | `web/src/app/api/cron/link-health/route.ts` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` |

Note: Admin routes use `SUPABASE_SERVICE_ROLE_KEY`; `/go` and cron use `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE`. For staging, all must point at the **staging** Supabase instance when the deployment is the staging branch (on Vercel Hobby: set these in **Preview** scoped to branch **staging**).

## Schema source of truth

- **Repo:** `supabase/sql/` — migration files only. No `supabase/config.toml` or Supabase CLI project config in repo.
- **Application:** Migrations are applied manually (e.g. Supabase SQL Editor or CLI) to each project. There is no GitHub-linked Supabase pipeline in repo.
- **Migrations (order):** See `docs/staging/founder-runbook-pr2.md` for the ordered list. Schema is reproduced by running these migrations in sequence on the staging database.

## Public read path

- **Discover / PL:** `web/src/lib/pl/public.ts` — reads from **curated gateway views**: `v_gateway_age_bands_public`, `v_gateway_products_public`, `v_gateway_wrappers_public`, `v_gateway_category_type_images`, `v_gateway_wrapper_detail_public`, `v_gateway_category_types_public`.
- **My ideas / family:** `web/src/components/family/MyIdeasClient.tsx` — uses `v_gateway_category_type_images`, `v_gateway_products_public` (and user tables behind RLS).
- No anon access to canonical product/PL tables; public reads go through these views.

## Write paths (for smoke testing)

- Auth: Supabase Auth (session, sign-in, callback) — same project as `NEXT_PUBLIC_SUPABASE_*`.
- User data: `user_list_items`, `children`, `gift_shares`, `marketplace_listings`, etc. — all via Supabase client (RLS).
- Admin: service role in API routes above.
- Cron: `link_checks`, `product_flags` via `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE`.

## External providers (from code)

- **Email:** Supabase Auth only (magic link, OTP). No SendGrid/Resend/etc. in code. Email is tied to the Supabase project pointed to by `NEXT_PUBLIC_SUPABASE_*`.
- **Builder.io:** `NEXT_PUBLIC_BUILDER_API_KEY`, `BUILDER_PREVIEW_SECRET` — CMS/preview. Can share prod Builder space for staging or use a separate space; no code change needed.
- **Analytics / payments / push / messaging:** No env keys or integrations found in code.

## Current Supabase deployment reality

- **Repo:** No Supabase branching config, no `config.toml`, no seed files in repo. No staging project or branch name in code.
- **Production:** One Supabase project (URL/keys in Vercel Production env). Confirmed from `.env.example` and code: only env vars, no hardcoded project refs.
- **Staging:** Not yet created. This PR documents how to create it (persistent branch or separate project) and wire the `staging` branch on Vercel to it.
