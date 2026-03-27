'use client';

import OneSignal from 'react-onesignal';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

let initPromise: Promise<void> | null = null;
let isInitialized = false;

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
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('SDK already initialized')) {
        isInitialized = true;
        window.__emberOneSignalInitialized = true;
        console.log('onesignal:init:skipped_already_initialized');
        return;
      }
      // Allow retry if initialization fails due to transient runtime state.
      initPromise = null;
      window.__emberOneSignalInitPromise = undefined;
      throw error;
    });
  window.__emberOneSignalInitPromise = initPromise;

  return initPromise;
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
  const permission =
    OneSignal.Notifications.permissionNative ?? (isBrowser() ? window.Notification?.permission ?? 'default' : null);
  const subscriptionIdPresent = Boolean(OneSignal.User.PushSubscription.id);
  const tokenPresent = Boolean(OneSignal.User.PushSubscription.token);
  const optedIn = Boolean(OneSignal.User.PushSubscription.optedIn);
  const fullySubscribed =
    permission === 'granted' && subscriptionIdPresent && tokenPresent && optedIn;

  console.log(`onesignal:permission:${permission ?? 'null'}`);
  console.log(`onesignal:subscription:${subscriptionIdPresent ? 'yes' : 'no'}`);
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
    await OneSignal.Notifications.requestPermission();
    diagnostics = readPushDiagnosticsFromSdk();
  }
  if (diagnostics.permission === 'granted' && !diagnostics.optedIn) {
    await OneSignal.User.PushSubscription.optIn();
    diagnostics = readPushDiagnosticsFromSdk();
  }

  return diagnostics;
}
