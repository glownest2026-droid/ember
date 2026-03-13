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

**Critical:** For the **staging** branch deployment, set the five keys above to the **staging** Supabase project in Vercel under the **Staging** environment only. Production and Preview keep production values. Then staging app and cron/admin routes use staging backend only.

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

## Proof that staging uses staging backend

1. Vercel **Staging** environment is assigned only to the `staging` branch (Settings → Environments).
2. In **Staging**, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set to the staging Supabase project URL and anon key.
3. No code path reads Supabase URL/keys from anywhere else (see `current-truth-backend.md`).
4. After redeploying the staging branch, open staging URL → e.g. sign in or load discover. Staging Supabase Auth and data are used. Optional: in staging Supabase dashboard, create a test user and confirm sign-in on staging URL uses that project.

## Local development

Copy `web/.env.example` to `web/.env.local` and set at least `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never commit `.env.local`.
