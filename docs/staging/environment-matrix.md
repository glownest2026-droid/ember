# Environment variable matrix (from code references)

All keys below are **actually referenced** in the repo. Use this to configure Vercel **Production**, **Preview**, and **Staging** and to separate staging backend from production.

## Supabase (backend isolation)

| Variable | Production | Staging | Preview | Where used |
|----------|------------|---------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Prod project URL | **Staging project URL** | Usually prod or leave unset | client.ts, server.ts, route-handler.ts, middleware.ts, next.config.js, play/page.tsx, products/page.tsx, admin APIs, admin pl page |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Prod anon key | **Staging anon key** | Usually prod or leave unset | Same as above |
| `SUPABASE_SERVICE_ROLE_KEY` | Prod service role | **Staging service role** (if admin used on staging) | — | api/admin/products, category-types, theme |
| `SUPABASE_URL` | Prod project URL | **Staging project URL** | — | go/[id]/route.ts, api/cron/link-health |
| `SUPABASE_SERVICE_ROLE` | Prod service role | **Staging service role** (if go/cron used on staging) | — | Same two files |

Set the five Supabase keys to the **staging** project in Vercel → **Staging** environment only. Production and Preview stay on production values.

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

Cron and /go use `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE`. When those are set to staging in Vercel Staging env, staging deployment’s cron and /go hit staging DB only.

**Check:** After redeploy, sign in on the staging URL; the user should appear in the staging Supabase project (Authentication → Users), not in production.
