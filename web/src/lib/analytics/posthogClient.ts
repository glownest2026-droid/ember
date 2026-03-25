import posthog from 'posthog-js';

let initAttempted = false;
let enabled = false;

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
  if (!key || !host) {
    enabled = false;
    return;
  }

  enabled = true;
  posthog.init(key, {
    api_host: host,
    autocapture: false,
    capture_pageview: false,
    // No automatic page/click capture besides our own event calls.
    loaded: () => {
      // Intentionally empty: we only need a reliable queue/loaded state.
    },
  });

  // Privacy-first: ensure session recording is not running.
  try {
    posthog.stopSessionRecording();
  } catch {
    // Fail closed
  }
}

export function isPosthogEnabled(): boolean {
  return enabled;
}

export function identifyUser(userId: string): void {
  if (!enabled) return;
  posthog.identify(userId);
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (!enabled) return;
  posthog.capture(eventName, properties ?? undefined);
}

