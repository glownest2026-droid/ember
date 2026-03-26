# OneSignal Web Push Foundation Runbook

## What web push is (plain English)

Web push lets Ember send a notification to a browser or installed web app after a parent has opted in.
For this foundation PR, we only support a manual founder test path:

- parent signs in
- parent taps a single "Turn on reminders" button
- browser asks for permission
- founder sends a manual OneSignal test push

No automated journeys are included in this PR.

## What this PR adds

- OneSignal Web SDK initialization in Ember (client-side only).
- OneSignal service worker files at the site root:
  - `/OneSignalSDKWorker.js`
  - `/OneSignalSDKUpdaterWorker.js`
- Signed-in user linking to OneSignal via stable Ember user ID (`user.id`) as external ID.
- One founder-testable UI entry point on the signed-in Account page: **Turn on reminders**.

## Privacy boundary (important)

This foundation only sends the stable Ember signed-in user ID to OneSignal as external ID.
It does **not** send child names, exact DOB, due dates, postcode, message history, free text, or sensitive family context.

## What should work first

Best first test targets:

- Chrome on Android
- Chrome/Edge/Firefox on desktop

iPhone/iPad web push is trickier because Apple requires users to add the web app to Home Screen first before web push can work.

## OneSignal setup (click-by-click)

1. Open OneSignal dashboard.
2. Create (or open) the Ember web app.
3. Go to **Settings -> Push & In-App -> Web**.
4. Ensure integration is set to **Custom Code**.
5. Set **Site URL** to your preview domain (for initial founder test), for example:
   - `https://<your-preview-domain>`
6. In **Service workers** settings:
   - Path should match root `/`
   - Main filename: `OneSignalSDKWorker.js`
   - Updater filename: `OneSignalSDKUpdaterWorker.js`
7. Go to **Settings -> Keys & IDs**.
8. Copy the **OneSignal App ID** value.

## Vercel setup (click-by-click)

Set Preview first.

1. Open Vercel project for Ember web.
2. Go to **Settings -> Environment Variables**.
3. Add:
   - `NEXT_PUBLIC_ONESIGNAL_APP_ID` = `<OneSignal App ID>`
4. Select **Preview** environment first.
5. Save.
6. Redeploy the current preview deployment (or push a commit to trigger a new preview).

If founder test passes, repeat for **Production**.

## Founder test steps (manual proof)

1. Open the Vercel preview URL on a supported browser (Chrome desktop or Android Chrome recommended).
2. Sign in to Ember.
3. Go to `/account`.
4. In **Push notifications**, click **Turn on reminders**.
5. Accept the browser permission prompt.
6. In OneSignal dashboard, go to **Audience -> Subscriptions**.
7. Confirm a new subscribed browser appears.
8. Open OneSignal **Messages** and create a push message manually.
9. Send to your test subscription.
10. Confirm notification is received on that subscribed browser/PWA.

## Rollback steps

If you need to disable this quickly:

1. Remove `NEXT_PUBLIC_ONESIGNAL_APP_ID` from Vercel Preview/Production.
2. Redeploy.
3. (Optional) Revert this PR to remove OneSignal code and worker files entirely.

Without the env var, Ember will not initialize OneSignal and the account page will show "Push is not configured in this environment yet."
