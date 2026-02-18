# Feb 2026 Auth — Founder setup guide

This doc is for configuring auth providers and troubleshooting. No secrets in the repo.

---

## 1. Feature flags (env vars)

Set these in **Vercel** (or `.env.local` for local). Only **keys** are listed; add values in the dashboard.

| Env var | Default | Purpose |
|--------|--------|--------|
| `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` | (unset = off) | Set to `true` to show “Continue with Google” in the auth modal. |
| `NEXT_PUBLIC_AUTH_ENABLE_APPLE` | (unset = off) | Set to `true` to show “Continue with Apple” in the auth modal. |
| `NEXT_PUBLIC_AUTH_ENABLE_EMAIL_OTP` | `true` | Set to `false` to hide “Continue with Email” (6-digit code) in the auth modal. |

**Safe for merge:** All provider flags default off except Email OTP (on). Turn on Google/Apple when Supabase and redirect URLs are configured.

---

## 2. Supabase dashboard — click paths

### Google provider

1. In Supabase: **Authentication** → **Providers**.
2. Find **Google** and turn it **On**.
3. Enter **Client ID** and **Client Secret** from your Google Cloud Console OAuth 2.0 credentials (APIs & Services → Credentials).
4. Save.

### Apple provider

1. In Supabase: **Authentication** → **Providers**.
2. Find **Apple** and turn it **On**.
3. Configure **Services ID**, **Secret Key**, **Key ID**, **Team ID**, **Bundle ID** as per Supabase/Apple docs.
4. Save.

### Redirect URL allowlist

1. In Supabase: **Authentication** → **URL Configuration** (or **Redirect URLs**).
2. Add every URL where users can land after sign-in. Examples:
   - `https://your-production-domain.com/auth/callback`
   - `https://*.vercel.app/auth/callback` (if supported)
   - `http://localhost:3000/auth/callback` (local)
3. The app uses **one** callback route: `/auth/callback`. The `next` query param sends users back to the page they were on (e.g. `/discover/26`).

---

## 3. Email OTP: show a 6-digit code in the email

The in-app auth modal uses a **6-digit OTP** flow. Supabase sends that code using the **Magic link** email template. For the code to appear in the email (so users can type it into the modal), the template **must include** the token placeholder.

**Required:** Add `{{ .Token }}` to the Magic link template. That placeholder is replaced with the 6-digit code (or link token, depending on flow). Without it, the email may only contain a link and the modal’s “Enter your code” step won’t have a code to show.

**Founder click path:**

- Supabase Dashboard → **Authentication** → **Email** → **Templates** → **Magic link**
- Edit the template body (and subject if you want the code there too) and include **`{{ .Token }}`** where the code should appear (e.g. “Your code is: {{ .Token }}”).
- **Save.**

**Note:** If custom SMTP is OFF, Supabase uses its default sender and rate limits may apply. That’s OK for prototype; for production you may want to configure custom SMTP and a custom domain.

---

## 4. Return-to mechanism (non-technical)

When a guest clicks “Save to my list” (or similar), a modal asks them to sign in. If they choose **Email**, they get a 6-digit code and stay on the same page. If they choose **Google** or **Apple**, they are sent to Google/Apple and then back to our site. We always send them back to **the same page they were on** (e.g. the discover page), not to a generic dashboard, so they can continue where they left off.

---

## 5. Troubleshooting

| Symptom | What to check |
|--------|----------------|
| **Provider button hidden** | Env var for that provider must be `true` (e.g. `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE=true`). Redeploy after changing env. |
| **OAuth redirect loops or “redirect_uri mismatch”** | Add the exact callback URL to Supabase **Redirect URLs**. Use `https://your-domain.com/auth/callback` (and same for preview URLs if testing on Vercel). |
| **OTP email not received** | In Supabase: **Authentication** → **Email Templates** and **SMTP** (or project **Settings**). Confirm email is sent; check spam. Invite-only mode means only existing users receive the code. |

---

## 6. Callback URL summary

- **Single route:** `/auth/callback`
- **Query param:** `next` = where to send the user after sign-in (e.g. `/discover/26`).
- **Allowlist:** Every origin that hosts the app (production, preview, local) must have `https://<origin>/auth/callback` (or `http://...` for local) in Supabase redirect URLs.

---

## 7. Set a password (optional)

After sign-in (e.g. via OTP), users can set a password from **Account** (`/account`).

- **Flow:** User opens **Account** from the discover header (or goes to `/account`). The “Set a password (optional)” form has password + confirm; submit calls `supabase.auth.updateUser({ password })`.
- **Success:** In-app message: “Password set. You can now sign in with password or email code.”
- **No server config:** Uses the same anon Supabase client; no extra env or keys.

---

## 8. Account linking (Link Google / Link Apple)

Users can **explicitly** link OAuth providers to their account while signed in. No automatic account merging.

- **Where:** `/account` page shows “Link Google” and “Link Apple” when `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` / `NEXT_PUBLIC_AUTH_ENABLE_APPLE` are `true`. If flags are off, those buttons are hidden (no “coming soon”).
- **Flow:** Click “Link Google” (or Apple) → `supabase.auth.linkIdentity({ provider, options: { redirectTo } })` with `redirectTo = origin + '/auth/callback?next=/account'`. User completes OAuth and returns to `/account` with the new identity linked.
- **Supabase:** Manual linking must be enabled (e.g. **Authentication** → **Settings** or `GOTRUE_SECURITY_MANUAL_LINKING_ENABLED: true`). Add `https://<origin>/auth/callback` (and preview URLs) to **Redirect URLs** so linking return works.
- **Errors:** If linking fails (e.g. provider not configured or redirect not allowlisted), the app shows an actionable error and points to this doc. No client secrets; anon key only.
