'use client';

import OneSignal from 'react-onesignal';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

let initPromise: Promise<void> | null = null;
let isInitialized = false;
const ONESIGNAL_SCOPE = '/push/onesignal/';

declare global {
  interface Window {
    __emberOneSignalInitPromise?: Promise<void>;
    __emberOneSignalInitialized?: boolean;
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function isOneSignalConfigured(): boolean {
  return Boolean(ONESIGNAL_APP_ID);
}

export function getOneSignalAppId(): string | null {
  return ONESIGNAL_APP_ID || null;
}

export async function initializeOneSignal(): Promise<void> {
  if (!isBrowser() || !isOneSignalConfigured()) return;
  if (isInitialized || window.__emberOneSignalInitialized) {
    isInitialized = true;
    window.__emberOneSignalInitialized = true;
    console.log('onesignal:init:skipped_already_initialized');
    return;
  }
  if (window.__emberOneSignalInitPromise) {
    initPromise = window.__emberOneSignalInitPromise;
    return initPromise;
  }
  if (initPromise) return initPromise;

  console.log('onesignal:init:start');

  initPromise = OneSignal.init({
    appId: ONESIGNAL_APP_ID!,
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: '/push/onesignal/OneSignalSDKUpdaterWorker.js',
    serviceWorkerParam: { scope: '/push/onesignal/' },
  })
    .then(() => {
      isInitialized = true;
      window.__emberOneSignalInitialized = true;
      console.log('onesignal:init:done');
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('SDK already initialized')) {
        isInitialized = true;
        window.__emberOneSignalInitialized = true;
        console.log('onesignal:init:skipped_already_initialized');
        return;
      }
      console.log(`onesignal:error:${message.slice(0, 120)}`);
      // Allow retry if initialization fails due to transient runtime state.
      initPromise = null;
      window.__emberOneSignalInitPromise = undefined;
      throw error;
    });
  window.__emberOneSignalInitPromise = initPromise;
  await initPromise;
  try {
    const registration = await window.navigator?.serviceWorker?.getRegistration(ONESIGNAL_SCOPE);
    console.log(`onesignal:service_worker:registered ${registration ? 'yes' : 'no'}`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('onesignal:service_worker:registered no');
    console.log(`onesignal:error:${message.slice(0, 120)}`);
  }

  return;
}

export async function linkOneSignalExternalUser(externalUserId: string | null): Promise<void> {
  if (!externalUserId || !isOneSignalConfigured()) return;
  await initializeOneSignal();
  await OneSignal.login(externalUserId);
}

export async function unlinkOneSignalExternalUser(): Promise<void> {
  if (!isOneSignalConfigured()) return;
  await initializeOneSignal();
  await OneSignal.logout();
}

export async function requestOneSignalPushPermission(): Promise<boolean> {
  if (!isOneSignalConfigured()) return false;
  await initializeOneSignal();
  return OneSignal.Notifications.requestPermission();
}

export async function getOneSignalPermissionState(): Promise<NotificationPermission | null> {
  if (!isBrowser() || !isOneSignalConfigured()) return null;
  await initializeOneSignal();
  return OneSignal.Notifications.permissionNative;
}

export type OneSignalPushDiagnostics = {
  initialized: boolean;
  permission: NotificationPermission | null;
  subscriptionIdPresent: boolean;
  tokenPresent: boolean;
  optedIn: boolean;
  fullySubscribed: boolean;
};

function readPushDiagnosticsFromSdk(): OneSignalPushDiagnostics {
  const pushSub = OneSignal.User?.PushSubscription;
  const permission =
    OneSignal.Notifications.permissionNative ?? (isBrowser() ? window.Notification?.permission ?? 'default' : null);
  const subscriptionIdPresent = Boolean(pushSub?.id);
  const tokenPresent = Boolean(pushSub?.token);
  const optedIn = Boolean(pushSub?.optedIn);
  const fullySubscribed =
    permission === 'granted' && subscriptionIdPresent && tokenPresent && optedIn;

  console.log(`onesignal:permission:${permission ?? 'null'}`);
  console.log(`onesignal:subscription:id ${subscriptionIdPresent ? 'yes' : 'no'}`);
  console.log(`onesignal:subscription:token ${tokenPresent ? 'yes' : 'no'}`);
  console.log(`onesignal:token:${tokenPresent ? 'yes' : 'no'}`);
  console.log(`onesignal:optedIn:${optedIn}`);

  return {
    initialized: isInitialized || Boolean(window.__emberOneSignalInitialized),
    permission,
    subscriptionIdPresent,
    tokenPresent,
    optedIn,
    fullySubscribed,
  };
}

export async function getOneSignalPushDiagnostics(): Promise<OneSignalPushDiagnostics | null> {
  if (!isBrowser() || !isOneSignalConfigured()) return null;
  await initializeOneSignal();
  return readPushDiagnosticsFromSdk();
}

export async function ensureOneSignalPushSubscription(): Promise<OneSignalPushDiagnostics | null> {
  if (!isBrowser() || !isOneSignalConfigured()) return null;
  await initializeOneSignal();

  let diagnostics = readPushDiagnosticsFromSdk();
  if (diagnostics.permission === 'default') {
    console.log('onesignal:requestPermission:start');
    const permissionResult = await OneSignal.Notifications.requestPermission();
    console.log(`onesignal:requestPermission:result:${permissionResult ? 'granted' : 'not_granted'}`);
    diagnostics = readPushDiagnosticsFromSdk();
  }
  if (diagnostics.permission === 'granted' && !diagnostics.optedIn) {
    console.log('onesignal:optIn:start');
    await OneSignal.User.PushSubscription.optIn();
    console.log('onesignal:optIn:result:attempted');
    diagnostics = await waitForSubscriptionReady(7000);
  } else if (diagnostics.permission === 'granted' && !diagnostics.fullySubscribed) {
    diagnostics = await waitForSubscriptionReady(7000);
  }

  return diagnostics;
}

async function waitForSubscriptionReady(timeoutMs: number): Promise<OneSignalPushDiagnostics> {
  const startMs = Date.now();
  let diagnostics = readPushDiagnosticsFromSdk();
  if (diagnostics.fullySubscribed) return diagnostics;

  while (Date.now() - startMs < timeoutMs) {
    await sleep(250);
    diagnostics = readPushDiagnosticsFromSdk();
    if (diagnostics.fullySubscribed) {
      console.log('onesignal:subscription_change');
      return diagnostics;
    }
  }

  return diagnostics;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
