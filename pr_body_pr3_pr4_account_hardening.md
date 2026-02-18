# PR3+4 — Account hardening: password optional + link providers

## Non-negotiables

1. **Build passes:** `pnpm -C web build`
2. **Cursor owns PR end-to-end** (rebases/conflicts)
3. **PROGRESS.md** updated with what changed + proof

## What this PR does

- **Set a password (optional):** After OTP sign-in, user can go to **Account** (link in discover header or `/account`). Form: password + confirm → `supabase.auth.updateUser({ password })` → success message: “Password set. You can now sign in with password or email code.”
- **Password sign-in + Forgot password:** Existing `/signin/password` (email + password, “Back to magic link sign-in”) and `/forgot-password` → `/reset-password` flow unchanged and working.
- **Account linking:** Minimal `/account` page shows signed-in email, linked identities, and “Link Google” / “Link Apple” when `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` / `NEXT_PUBLIC_AUTH_ENABLE_APPLE` are true. Buttons call `linkIdentity` with `redirectTo` back to `/account`. If flags off, buttons hidden. No auto-merge; errors point to docs.

## Manual QA (browser)

1. **OTP sign-in:** From /discover, sign in with email code. Session persists on refresh.
2. **Account:** After OTP sign-in, go to /account. See email and “Set a password (optional).”
3. **Set password:** Enter password + confirm → submit → see “Password set. You can now sign in with password or email code.”
4. **Password sign-in:** Sign out → go to /signin/password → sign in with password. Sign out → sign in with email OTP (OTP fallback preserved).
5. **Forgot password:** /forgot-password sends email; /reset-password sets new password and user can sign in.
6. **Linking (when provider flags ON and Supabase configured):** Signed in → /account → “Link Google” → complete OAuth → return to /account, shows linked. If not configured, error is clear and docs explain Supabase settings.

## Rollback

- Revert this PR commit(s) if any auth regressions. Main remains usable via OTP.

## Escalate to CTO if

- Supabase linking cannot be implemented cleanly without hacks
- Password reset flow conflicts with existing routes or cookies/session handling
