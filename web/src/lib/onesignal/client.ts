'use client';

import OneSignal from 'react-onesignal';

const ONESIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

let initPromise: Promise<void> | null = null;

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
  if (initPromise) return initPromise;

  initPromise = OneSignal.init({
    appId: ONESIGNAL_APP_ID!,
    allowLocalhostAsSecureOrigin: true,
    serviceWorkerPath: '/push/onesignal/OneSignalSDKWorker.js',
    serviceWorkerUpdaterPath: '/push/onesignal/OneSignalSDKUpdaterWorker.js',
    serviceWorkerParam: { scope: '/push/onesignal/' },
  }).catch((error) => {
    // Allow retry if initialization fails due to transient runtime state.
    initPromise = null;
    throw error;
  });

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
