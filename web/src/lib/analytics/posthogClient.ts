import posthog from 'posthog-js';

let initAttempted = false;
let enabled = false;
let debugLoggedNoEnv = false;

function debugLog(message: string, extra?: Record<string, unknown>): void {
  try {
    if (extra) {
      console.info(`[ember-analytics] ${message}`, extra);
    } else {
      console.info(`[ember-analytics] ${message}`);
    }
  } catch {
    // no-op
  }
}

function getPosthogKey(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_KEY;
}

function getPosthogHost(): string | undefined {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST;
}

export function initPosthogIfNeeded(): void {
  if (initAttempted) return;
  initAttempted = true;

  const key = getPosthogKey();
  const host = getPosthogHost();
  debugLog('init:start', {
    keyPresent: Boolean(key),
    hostPresent: Boolean(host),
  });

  if (!key || !host) {
    enabled = false;
    if (!debugLoggedNoEnv) {
      debugLoggedNoEnv = true;
      debugLog('init:disabled_missing_env', {
        keyPresent: Boolean(key),
        hostPresent: Boolean(host),
      });
    }
    return;
  }

  enabled = true;
  posthog.init(key, {
    api_host: host,
    autocapture: false,
    capture_pageview: false,
    // No automatic page/click capture besides our own event calls.
    loaded: () => {
      debugLog('init:loaded');
    },
  });
  debugLog('init:enabled');

  // Privacy-first: ensure session recording is not running.
  try {
    posthog.stopSessionRecording();
    debugLog('session_recording:stopped');
  } catch {
    // Fail closed
  }
}

export function isPosthogEnabled(): boolean {
  return enabled;
}

export function identifyUser(userId: string): void {
  initPosthogIfNeeded();
  if (!enabled) return;
  try {
    posthog.identify(userId);
    debugLog('identify:attempted', { userIdPresent: Boolean(userId) });
  } catch (error) {
    debugLog('identify:error', { message: error instanceof Error ? error.message : String(error) });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  initPosthogIfNeeded();
  debugLog('capture:attempted', { eventName, enabled });
  if (!enabled) return;
  try {
    posthog.capture(eventName, properties ?? undefined);
  } catch (error) {
    debugLog('capture:error', { eventName, message: error instanceof Error ? error.message : String(error) });
  }
}

