import { trackEvent as trackEventImpl } from './posthogClient';

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  trackEventImpl(eventName, properties);
}

