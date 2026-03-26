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
- OneSignal service worker files in a dedicated subdirectory:
  - `/push/onesignal/OneSignalSDKWorker.js`
  - `/push/onesignal/OneSignalSDKUpdaterWorker.js`
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
5. Set **Site URL** exactly to:
   - `https://www.emberplay.app`
6. In **Service workers** settings:
   - Path: `/push/onesignal/`
   - Main filename: `OneSignalSDKWorker.js`
   - Updater filename: `OneSignalSDKUpdaterWorker.js`
7. Go to **Settings -> Keys & IDs**.
8. Copy the **OneSignal App ID** value.

## Deploy setup (click-by-click)

1. Open Vercel project for Ember web.
2. Go to **Settings -> Environment Variables**.
3. Add:
   - `NEXT_PUBLIC_ONESIGNAL_APP_ID` = `<OneSignal App ID>`
4. Select **Production** environment.
5. Save.
6. Redeploy production after this PR merges.

## Founder test steps (manual proof)

1. Open `https://www.emberplay.app/push/onesignal/OneSignalSDKWorker.js` and confirm it loads.
2. Open `https://www.emberplay.app/account` on a supported browser (Chrome desktop or Android Chrome recommended).
3. Sign in to Ember.
4. In **Push notifications**, click **Turn on reminders**.
5. Confirm the native browser permission prompt appears, then accept it.
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
