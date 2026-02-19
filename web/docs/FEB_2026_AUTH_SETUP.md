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

## 2. Supabase dashboard — overview

The app uses **one** callback route: `/auth/callback`. The `next` query param sends users back to the page they were on (e.g. `/discover/26` or `/account` for linking). Configure providers and URL allowlist in Supabase **before** enabling flags in Vercel.

---

## 2a. Enable Google SSO (Founder click-path)

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Google** → turn **On**.
2. **Google Cloud Console:** [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) → Create OAuth 2.0 Client ID (or use existing) → Application type: **Web application**.
   - **Authorized JavaScript origins:** Add your app origins (no path). Examples:
     - `https://ember-mocha-eight.vercel.app`
     - `https://your-preview-name.vercel.app` (each preview that will use Google sign-in)
     - `http://localhost:3000` (local only; remove for production)
   - **Authorized redirect URIs:** Add your **Supabase** auth callback URL (not the app URL). Get it from Supabase: **Authentication** → **Providers** → **Google** → copy the redirect URI shown there. It looks like:
     - `https://<project-ref>.supabase.co/auth/v1/callback`  
     (Replace `<project-ref>` with your Supabase project reference, e.g. from the project URL.)
3. Copy **Client ID** and **Client Secret** from Google → paste into Supabase **Google** provider → **Save**.
4. **Supabase URL Configuration:** **Authentication** → **URL Configuration** (or **Redirect URLs**). Add every URL where users land after sign-in (our app’s callback, not Google’s):
   - `https://ember-mocha-eight.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback` (if your allowlist supports wildcards for Vercel previews)
   - `http://localhost:3000/auth/callback` (local)
5. **Scopes:** Supabase needs `openid`, `userinfo.email`, `userinfo.profile`. Google’s default OAuth client usually includes these; if you created a custom OAuth consent screen, ensure these scopes are added.

---

## 2b. Enable Apple SSO (Founder click-path)

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Apple** → turn **On**.
2. **Apple Developer:** Create and configure Sign in with Apple (Services ID, Key, etc.) per [Supabase Apple docs](https://supabase.com/docs/guides/auth/social-login/auth-apple). You will need:
   - **Services ID** (e.g. `com.yourapp.service`)
   - **Team ID**, **Key ID**, **Bundle ID**
   - **Private Key** (.p8 file from Apple) — paste into Supabase; never commit to repo.
3. **Redirect / callback:** In Apple Developer config, set the redirect/callback URL that Supabase shows in **Authentication** → **Providers** → **Apple** (Supabase handles the Apple callback; our app then receives the user via `/auth/callback`).
4. **Supabase URL Configuration:** Same as Google — ensure **Redirect URLs** include:
   - `https://ember-mocha-eight.vercel.app/auth/callback`
   - `https://*.vercel.app/auth/callback` (if supported)
   - `http://localhost:3000/auth/callback` (local)

---

## 2c. Redirect URL allowlist (Supabase)

In **Authentication** → **URL Configuration** (or **Redirect URLs**), add every origin that hosts the app, with path `/auth/callback`:

- Production: `https://ember-mocha-eight.vercel.app/auth/callback`
- Previews: add each preview host or use `https://*.vercel.app/auth/callback` if allowlist supports it
- Local: `http://localhost:3000/auth/callback`

---

## 3. Vercel Environment Variables

Enable Google/Apple only **after** Supabase provider and redirect URLs are configured. If flags are `true` but Supabase is not set up, OAuth will fail.

1. **Vercel** → Project → **Settings** → **Environment Variables**.
2. Add (for **Preview** and/or **Production** as desired):

   | Name | Value | Notes |
   |-----|--------|------|
   | `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` | `true` | Show “Continue with Google” in auth modal. |
   | `NEXT_PUBLIC_AUTH_ENABLE_APPLE` | `true` | Show “Continue with Apple” in auth modal. |

3. **Do not** set to `true` until Supabase Google/Apple providers and redirect URLs are done. Redeploy after changing.

---

## 4. Email OTP: show a 6-digit code in the email

The in-app auth modal uses a **6-digit OTP** flow. Supabase sends that code using the **Magic link** email template. For the code to appear in the email (so users can type it into the modal), the template **must include** the token placeholder.

**Required:** Add `{{ .Token }}` to the Magic link template. That placeholder is replaced with the 6-digit code (or link token, depending on flow). Without it, the email may only contain a link and the modal’s “Enter your code” step won’t have a code to show.

**Founder click path:**

- Supabase Dashboard → **Authentication** → **Email** → **Templates** → **Magic link**
- Edit the template body (and subject if you want the code there too) and include **`{{ .Token }}`** where the code should appear (e.g. “Your code is: {{ .Token }}”).
- **Save.**

**Note:** If custom SMTP is OFF, Supabase uses its default sender and rate limits may apply. That’s OK for prototype; for production you may want to configure custom SMTP and a custom domain.

---

## 5. Return-to mechanism (non-technical)

When a guest clicks “Save to my list” (or similar), a modal asks them to sign in. If they choose **Email**, they get a 6-digit code and stay on the same page. If they choose **Google** or **Apple**, they are sent to Google/Apple and then back to our site. We always send them back to **the same page they were on** (e.g. the discover page), not to a generic dashboard, so they can continue where they left off.

---

## 6. Troubleshooting

| Symptom | What to check |
|--------|----------------|
| **Provider button hidden** | Env var for that provider must be `true` (e.g. `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE=true`). Redeploy after changing env. |
| **OAuth redirect loops or “redirect_uri mismatch”** | Add the exact callback URL to Supabase **Redirect URLs**. Use `https://your-domain.com/auth/callback` (and same for preview URLs if testing on Vercel). |
| **OTP email not received** | In Supabase: **Authentication** → **Email Templates** and **SMTP** (or project **Settings**). Confirm email is sent; check spam. Invite-only mode means only existing users receive the code. |

---

## 7. Callback URL summary

- **Single route:** `/auth/callback`
- **Query param:** `next` = where to send the user after sign-in (e.g. `/discover/26`).
- **Allowlist:** Every origin that hosts the app (production, preview, local) must have `https://<origin>/auth/callback` (or `http://...` for local) in Supabase redirect URLs.

---

## 8. Set a password (optional)

After sign-in (e.g. via OTP), users can set a password from **Account** (`/account`).

- **Flow:** User opens **Account** from the discover header (or goes to `/account`). The “Set a password (optional)” form has password + confirm; submit calls `supabase.auth.updateUser({ password })`.
- **Success:** In-app message: “Password set. You can now sign in with password or email code.”
- **No server config:** Uses the same anon Supabase client; no extra env or keys.

---

## 9. Account linking (Link Google / Link Apple)

Users can **explicitly** link OAuth providers to their account while signed in. No automatic account merging.

- **Where:** `/account` page shows “Link Google” and “Link Apple” when `NEXT_PUBLIC_AUTH_ENABLE_GOOGLE` / `NEXT_PUBLIC_AUTH_ENABLE_APPLE` are `true`. If flags are off, those buttons are hidden (no “coming soon”).
- **Flow:** Click “Link Google” (or Apple) → `supabase.auth.linkIdentity({ provider, options: { redirectTo } })` with `redirectTo = origin + '/auth/callback?next=/account'`. User completes OAuth and returns to `/account` with the new identity linked.
- **Supabase:** Manual linking must be enabled (e.g. **Authentication** → **Settings** or `GOTRUE_SECURITY_MANUAL_LINKING_ENABLED: true`). Add `https://<origin>/auth/callback` (and preview URLs) to **Redirect URLs** so linking return works.
- **Errors:** If linking fails (e.g. provider not configured or redirect not allowlisted), the app shows an actionable error and points to this doc. No client secrets; anon key only.

---

## 10. QA Script (Browser-only)

**Pre-requisite:** Founder has configured the provider in Supabase (Google or Apple), added redirect URLs to Supabase URL Configuration and (for Google) to Google Cloud Console, and set the corresponding Vercel env var(s) to `true` and redeployed.

**Test 1 — Google sign-in from /discover**

1. Open Production or Preview: `/discover/26` (or your discover URL).
2. Click **“Save to my list”** → auth modal opens.
3. Click **“Continue with Google”**.
4. Complete Google OAuth.
5. Confirm you return to the **exact** `/discover` URL you started on, are signed in, modal is closed, and header shows signed-in state.

**Test 2 — Apple sign-in from /discover**

Same as Test 1, but click **“Continue with Apple”** and complete Apple sign-in. Confirm return-to and signed-in state.

**Test 3 — Linking while signed in**

1. Sign in via **Email OTP** (so the account is email-first).
2. Go to **/account**.
3. Click **“Link Google”** → complete OAuth → confirm you return to **/account**.
4. Confirm **/account** shows Google linked (or identity list updated).
5. Repeat for **“Link Apple”** if enabled.

**Test 4 — Regression**

- Guest browsing (no sign-in) still works.
- **Email OTP** sign-in still works.
- **Sign out** works and clears session.
