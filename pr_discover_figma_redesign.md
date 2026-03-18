## Summary

Replace `/discover/[months]` UI with the local Figma Discover redesign (stages 1–4): doorway cards, science block, play-ideas carousel, product carousel. **Same data plumbing** (wrappers, categories, picks, save/have, auth). **Personalization:** first name from `children.display_name` / `child_name` when `?child=` + signed in; otherwise **your child** / **your family** fallbacks. **Gender** loaded for future copy; hero uses name-first fallbacks.

## Verification

1. `cd web && pnpm run build`
2. Signed in with `?child=` → hero “Curated for {FirstName}”, stages use real gateway data
3. Pick doorway → science → category carousel → See examples → products; Save / Have / Visit work
4. Start over + second tap on same doorway deselects

## Auth fix for Vercel Preview (same PR)

**Root cause:** `getAuthCallbackOrigin()` preferred `NEXT_PUBLIC_SITE_URL` for any non-localhost browser. Preview builds that included `https://emberplay.app` sent OAuth to production while PKCE lived on the preview origin → PKCE error.

**Change:** Browser always uses `window.location.origin` for `/auth/callback`. Server fallback: Preview → `VERCEL_URL`, Production → `NEXT_PUBLIC_SITE_URL`, else localhost.

**Founder — Supabase Redirect URLs:** `https://emberplay.app/auth/callback`, `http://localhost:3000/auth/callback`, plus preview allowlist (e.g. `https://*.vercel.app/auth/callback` if Supabase accepts it). See `web/docs/FEB_2026_AUTH_SETUP.md` §2c.

## Rollback

Revert branch `feat/discover-figma-redesign`.
