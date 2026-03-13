# Environment variable matrix (from code references)

All keys below are **actually referenced** in the repo. Use this to configure Vercel **Production** and **Preview** and to separate staging backend from production.

**Vercel Hobby:** There is no custom “Staging” environment. Set the five Supabase keys in **Preview** and scope them to the **staging** branch only (so only deployments of the `staging` branch use the staging Supabase project). Production stays on production values.

## Supabase (backend isolation)

| Variable | Production | Preview (branch `staging` only) | Where used |
|----------|------------|---------------------------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Prod project URL | Staging project URL | client.ts, server.ts, route-handler.ts, middleware.ts, next.config.js, play/page.tsx, products/page.tsx, admin APIs, admin pl page |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod anon key | Staging anon key | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod service role | Staging service role | api/admin/products, category-types, theme |
| `SUPABASE_URL` | Prod project URL | Staging project URL | go/[id]/route.ts, api/cron/link-health |
| `SUPABASE_SERVICE_ROLE` | Prod service role | Staging service role | Same two files |

Add these five in Vercel → **Preview**, then restrict to branch **staging** so only the staging deployment gets them.

## Auth (Supabase Auth — tied to Supabase project above)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` | `'true'` to show Google sign-in |
| `NEXT_PUBLIC_AUTH_ENABLE_APPLE` | `'true'` to show Apple sign-in |
| `NEXT_PUBLIC_AUTH_ENABLE_EMAIL_OTP` | Not `'false'` to enable email OTP |

Auth runs against whichever Supabase project is in `NEXT_PUBLIC_SUPABASE_*`. No separate auth provider keys.

## Admin

| Variable | Purpose |
|----------|---------|
| `EMBER_ADMIN_EMAILS` | Comma-separated emails for admin access |

Can be same or different per environment. Staging can use a smaller allowlist.

## Builder.io (CMS)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BUILDER_API_KEY` | Builder.io CMS |
| `BUILDER_PREVIEW_SECRET` | Draft preview secret; rotate if leaked |

**Third-party safety:** Staging can use the same Builder space as prod (read-only CMS) or a separate space. No live side effect to prod. Safe as-is for staging smoke tests.

## Other

| Variable | Purpose |
|----------|---------|
| `AFFILIATE_DEFAULT_UTM` | Default UTM for /go links |
| `CRON_SECRET` | If set, cron must send `Authorization: Bearer <value>` |
| `VERCEL_GIT_COMMIT_SHA` | Display only (admin panel) |
| `VERCEL_ENV` | Display only |

Cron and /go use `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE`. When those are set for Preview + branch `staging`, the staging deployment’s cron and /go hit the staging DB only.

**Check:** After redeploy, sign in on the staging URL; the user should appear in the staging Supabase project (Authentication → Users), not in production.
