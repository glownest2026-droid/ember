# PR5 — Enable Google + Apple SSO (flags + setup + QA)

## Non-negotiables

1. **Build passes:** `pnpm -C web build`
2. **Cursor owns PR end-to-end** (rebases/conflicts)
3. **PROGRESS.md** updated with what changed + proof

## What this PR does

- **Docs only** (no code changes unless callback/linking was broken — ground truth confirmed existing flow is correct).
- **FEB_2026_AUTH_SETUP.md** updated with:
  - **2a** Enable Google SSO (Founder click-path): Supabase → Google provider, Google Cloud Console (Client ID/Secret, Authorized origins + redirect URI from Supabase), Supabase URL Configuration allowlist.
  - **2b** Enable Apple SSO (Founder click-path): Supabase → Apple provider, Apple Developer config, redirect allowlist.
  - **2c** Redirect URL allowlist (Supabase).
  - **3** Vercel Environment Variables: `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` / `NEXT_PUBLIC_AUTH_ENABLE_APPLE` = `true`; note: keep flags OFF until Supabase setup is complete.
  - **10** QA Script (Browser-only): see below.

Flags remain controlled only by Vercel env vars; no hard-enable in code. **Mergeable even if providers are not configured yet.**

## Founder QA Script (browser-only)

**Pre-req:** Provider configured in Supabase, redirect URLs added (Supabase + Google Console for Google), Vercel env flags set and redeployed.

| Test | Steps |
|------|--------|
| **1. Google sign-in** | Open /discover/26 → “Save to my list” → “Continue with Google” → complete OAuth → confirm return to same URL, signed in, modal closed, header shows signed in. |
| **2. Apple sign-in** | Same as 1 with “Continue with Apple”. |
| **3. Linking** | Sign in via Email OTP → /account → “Link Google” → OAuth → return to /account, see Google linked. Repeat for Apple. |
| **4. Regression** | Guest browsing works; Email OTP works; Sign out works. |

## Rollback

- **Fast:** Set `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` and/or `NEXT_PUBLIC_AUTH_ENABLE_APPLE` back to `false` in Vercel (no code revert).
- If any code was changed in this PR: revert commit and push.

## Escalate to CTO if

- OAuth callback cannot reliably restore returnUrl
- Supabase provider constraints block this flow
- Linking cannot work without unsafe hacks
