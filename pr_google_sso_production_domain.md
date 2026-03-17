## Summary

Production Google (and Apple) OAuth plus magic-link emails now target **`https://emberplay.app/auth/callback`** when **`NEXT_PUBLIC_SITE_URL=https://emberplay.app`** is set on **Vercel Production**. Local dev always uses **`http://localhost:3000/auth/callback`** (even if `NEXT_PUBLIC_SITE_URL` is accidentally in `.env.local`). Vercel previews without that var keep using the preview host.

Single helper: `web/src/lib/auth-callback-url.ts`. No new callback route; existing `GET /auth/callback` unchanged.

## Founder checklist (manual)

See **PROGRESS.md → “Founder follow-up: Google Cloud + Supabase settings”** for numbered steps.

**TL;DR must-do:** Supabase Redirect URLs + Site URL; Vercel `NEXT_PUBLIC_SITE_URL`; Google OAuth client keeps **Supabase’s** `…/auth/v1/callback` as authorized redirect URI (not emberplay.app).

## How to verify

1. **Build:** `cd web && pnpm run build && pnpm run lint`
2. **Code:** With `NEXT_PUBLIC_SITE_URL=https://emberplay.app`, client calls build `https://emberplay.app/auth/callback?next=…`
3. **Local:** Omit `NEXT_PUBLIC_SITE_URL` → callbacks stay on `localhost:3000`
4. **E2E Google:** After Vercel + Supabase steps, sign in with Google on emberplay.app

## Rollback

Revert this PR; remove `NEXT_PUBLIC_SITE_URL` from Vercel Production if you need the old behavior.
