# Feb 2026 Auth Baseline Audit (PR0)

**Purpose:** Ground-truth audit of current auth + CTA gating across `/discover`, `/new`, `/new/[months]`, and other entry points. No behavior changes.

---

## Executive summary

- **Routes:** `/discover` and `/discover/[months]` are the canonical discovery entry points; `/new` and `/new/[months]` 308-redirect to them. Auth routes: `/signin`, `/signin/password`, `/auth/callback`, `/auth/confirm`, `/auth/error`; middleware protects `/app/*`.
- **CTAs:** “Save idea” (Layer B) and “Save to my list” / “Have it already” (Layer C) open `SaveToListModal` when signed out; “Join free” / header “Sign in” navigate to `/signin` (or `#waitlist` on homepage). No unauthenticated writes.
- **Supabase:** Client from `@supabase/ssr` (browser + server). Middleware refreshes session and sets cookies; server client is read-only for cookies (no-op setters). Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; admin/cron use `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE`.
- **Saves / ownership:** No dedicated “saves” or “owned” tables in repo migrations. Clicks/saves are recorded in `product_clicks` via POST `/api/click` (auth required); table/migration for `product_clicks` not found in repo.
- **Auth flows:** Magic link (OTP, invite-only `shouldCreateUser: false`), password sign-in at `/signin/password`, forgot-password flow; OAuth not audited in code.

---

## Route map

| Route | File path(s) |
|-------|---------------|
| `/discover` | `web/src/app/discover/page.tsx` (redirect to `/discover/{month}`) |
| `/discover/[months]` | `web/src/app/discover/[months]/page.tsx` (server), `web/src/app/discover/[months]/DiscoveryPageClient.tsx` (client) |
| `/new` | `web/src/app/new/page.tsx` (308 → `/discover`) |
| `/new/[months]` | `web/src/app/new/[months]/page.tsx` (308 → `/discover/[months]`) |
| `/signin` | `web/src/app/signin/page.tsx` |
| `/signin/password` | `web/src/app/signin/password/page.tsx` |
| `/auth/callback` | `web/src/app/auth/callback/route.ts` (GET; code exchange) |
| `/auth/confirm` | `web/src/app/auth/confirm/route.ts` (GET; OTP/token_hash) |
| `/auth/error` | `web/src/app/auth/error/page.tsx` |
| `/auth/signout` | `web/src/app/auth/signout/route.ts` (POST) |
| `/forgot-password` | `web/src/app/forgot-password/page.tsx` |
| `/reset-password` | `web/src/app/reset-password/page.tsx` |
| `/verify` | `web/src/app/verify/page.tsx` (6-digit code) |

---

## CTA map (current signed-out behavior)

| CTA label | Where it renders | Component / file | Click handler | Signed-out behavior |
|-----------|------------------|------------------|---------------|----------------------|
| Save idea (Layer B) | Category card on discover | `web/src/components/discover/CategoryCarousel.tsx` | `onSaveIdea(category.id, e.currentTarget)` → `handleSaveCategory` in parent | Opens `SaveToListModal` (email + magic link) |
| Save to my list (Layer C) | Product cards on discover | `web/src/app/discover/[months]/DiscoveryPageClient.tsx` (via `DiscoverCardStack` → card actions) | `handleSaveToList` | Opens `SaveToListModal`; if signed in, POSTs `/api/click` then opens modal as “saved” |
| Save to my list (album) | AnimatedProductAlbum | `web/src/components/discover/AnimatedProductAlbum.tsx` | Link with `signinUrl(current.id)` (navigate) | Navigates to signin URL (no modal) |
| Have them / Have it already | Category + product | `CategoryCarousel.tsx` → `onHaveThem`; `DiscoveryPageClient.tsx` → `handleHaveThemCategory` / `handleHaveItAlready` | `handleHaveThemCategory`, `handleHaveItAlready` | Opens `SaveToListModal`; toast “Sign in to record…” |
| Join free | Discover sticky header | `web/src/components/discover/DiscoverStickyHeader.tsx` | Link | Navigates to `/signin?next=…` |
| Join free | What is Ember sheet | `web/src/components/discover/WhatIsEmberSheet.tsx` | Button/link | Navigates to signin |
| Join free | Main header (homepage etc.) | `web/src/components/Header.tsx` | `<a href="#waitlist">` | Scrolls to #waitlist (no auth) |
| Sign in | Main header | `web/src/components/Header.tsx` | `ButtonLink href="/signin"` | Navigates to `/signin` |

**SaveToListModal:** `web/src/components/ui/SaveToListModal.tsx` — signed out: email + magic link (OTP), redirect to `auth/callback?next=…`; signed in: “Saved to your list” + “View my list” + close. Does not attempt write without auth.

---

## Supabase wiring

### Client creation

- **Browser:** `web/src/utils/supabase/client.ts` — `createBrowserClient` from `@supabase/ssr` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Server:** `web/src/utils/supabase/server.ts` — `createServerClient` from `@supabase/ssr`; uses `cookies()` from `next/headers` for `get`; `set`/`remove` are no-ops (comment: “Middleware is responsible for cookie refresh/cleanup”).

### SSR / cookie plumbing

- **Present.** Middleware: `web/middleware.ts` calls `updateSession(req)` from `web/src/utils/supabase/middleware.ts`. Middleware creates a server client with request/response cookie get/set/remove and calls `supabase.auth.getUser()` to refresh session and propagate cookies. All routes get this; `/app/*` is then protected (redirect to `/signin?next=...` if no user).

### Env var keys (no values)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (admin API routes)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE` (e.g. `web/src/app/api/cron/link-health/route.ts`, `web/src/app/go/[id]/route.ts`)

### Auth flows (from code)

- **Magic link / OTP:** `signInWithOtp` in `web/src/app/signin/page.tsx`, `web/src/components/ui/SaveToListModal.tsx`; `emailRedirectTo` → `/auth/callback?next=...`; `shouldCreateUser: false` (invite-only).
- **Password:** `web/src/app/signin/password/page.tsx` (sign in); `web/src/app/forgot-password/page.tsx` (reset request); `web/src/app/reset-password/page.tsx` (set new password); recovery redirect to `/auth/confirm`.
- **Verify (6-digit):** `web/src/app/verify/page.tsx`.

---

## Saves / ownership

### Tables and migrations

- **Repo migrations:** No table named “saves” or “owned” in `supabase/sql/`. `product_clicks` is used by `web/src/app/api/click/route.ts`; no migration for `product_clicks` found in repo (may exist in Supabase dashboard or other repo).
- **Migrations present:** e.g. `supabase/sql/2025-11-04_core_schema.sql`, `202601041654_pl0_product_library.sql`, and others for PL, theme, module 10, etc.

### Write / read call sites

- **Writes:** POST `web/src/app/api/click/route.ts` — after auth check, inserts into `product_clicks` (user_id, product_id, child_id, age_band, dest_host, source). Sources include `discover_save`, `discover_owned`. Best-effort (401 if not signed in; insert errors logged but response 204).
- **Reads:** No “my list” or “saved products” UI read path audited in this baseline; recs and admin read from other tables (e.g. `children`, `products`, `pl_*`).

---

## Known risks / ambiguities

1. **Auth callback cookies:** `/auth/callback/route.ts` uses server `createClient()` which has no-op cookie setters. After `exchangeCodeForSession`, session cookies may not be set on the response. Next request will hit middleware which can refresh; confirm in PR1 whether the callback response must set cookies for correct post-redirect auth.
2. **product_clicks schema:** Table and RLS not in repo; PR1 should confirm schema and RLS in Supabase or add migration to repo.
3. **“View my list” in SaveToListModal:** Links to `/app` or similar; no dedicated “saved list” route audited here.
