# Environment variable matrix (from code references)

All keys below are **actually referenced** in the repo (no fabricated names). Use this when configuring Vercel **Production**, **Preview**, and **Staging** environments.

| Variable | Used in | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `web/next.config.js`, `web/src/utils/supabase/client.ts`, `server.ts`, `route-handler.ts`, `middleware.ts`; `web/src/app/play/page.tsx`, `products/page.tsx`; admin API routes; `(app)/app/admin/pl/[ageBandId]/page.tsx` | Supabase project URL (browser + server). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same Supabase client/middleware/route-handler files; `play/page.tsx` | Supabase anon key (browser + server). |
| `SUPABASE_SERVICE_ROLE_KEY` | `web/src/app/api/admin/products/route.ts`, `[id]/route.ts`; `api/admin/category-types/route.ts`, `[id]/route.ts`; `api/admin/theme/route.ts` | Server-only; admin API routes. |
| `SUPABASE_URL` | `web/src/app/go/[id]/route.ts`, `web/src/app/api/cron/link-health/route.ts` | Server-only; affiliate redirect and cron. |
| `SUPABASE_SERVICE_ROLE` | Same two files as `SUPABASE_URL` | Service role key for affiliate/cron (different name from `SUPABASE_SERVICE_ROLE_KEY`). |
| `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` | `web/src/lib/auth-flags.ts` | Show/enable Google sign-in when `'true'`. |
| `NEXT_PUBLIC_AUTH_ENABLE_APPLE` | `web/src/lib/auth-flags.ts` | Show/enable Apple sign-in when `'true'`. |
| `NEXT_PUBLIC_AUTH_ENABLE_EMAIL_OTP` | `web/src/lib/auth-flags.ts` | Email OTP enabled when not `'false'`. |
| `EMBER_ADMIN_EMAILS` | `web/src/lib/admin.ts` | Comma-separated emails for admin access. |
| `NEXT_PUBLIC_BUILDER_API_KEY` | `web/src/lib/builder.ts`; `web/src/app/api/probe/builder/route.ts`; `web/src/app/cms/[[...path]]/page.tsx`, `[slug]/page.tsx`; `BuilderPageClient.tsx` | Builder.io CMS. |
| `BUILDER_PREVIEW_SECRET` | `web/src/app/api/preview/route.ts`, `web/src/app/api/probe/builder/route.ts` | Secret for draft preview; rotate if leaked. |
| `AFFILIATE_DEFAULT_UTM` | `web/src/app/go/[id]/route.ts` | Default UTM params for affiliate links. |
| `CRON_SECRET` | `web/src/app/api/cron/link-health/route.ts` | Optional; if set, cron requests must send `Authorization: Bearer <CRON_SECRET>`. |
| `VERCEL_GIT_COMMIT_SHA` | `web/src/app/(app)/app/admin/pl/[ageBandId]/page.tsx` | Display only (admin truth panel). |
| `VERCEL_ENV` | Same file | Display only (e.g. production / preview). |

## Staging

- For a **staging** deployment, set the same keys in Vercel under the **Staging** environment. For a future staging Supabase project, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and optionally `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`) to the staging project values **only** for Staging. Do not put production secrets in the repo.

## Local development

- Copy `web/.env.example` to `web/.env.local` and fill in real values (never commit `.env.local`). Required for run: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
