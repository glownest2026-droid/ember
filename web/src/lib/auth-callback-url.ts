/**
 * Base URL for Supabase OAuth and magic-link redirects to `/auth/callback`.
 *
 * Production (Vercel): set `NEXT_PUBLIC_SITE_URL=https://emberplay.app` so Google OAuth
 * completes on Ember’s domain (Supabase then redirects here with ?code=).
 *
 * Local: leave unset — localhost/127.0.0.1 always uses `window.location.origin` so
 * `.env.local` mistakes cannot break local auth.
 *
 * Previews: unset — uses the preview host’s origin.
 */
export function getAuthCallbackOrigin(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return window.location.origin;
    }
  }
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/** Full callback URL with `next` path/query (e.g. `/discover` or `/discover/26?child=x`). */
export function buildAuthCallbackUrl(nextPath: string): string {
  const origin = getAuthCallbackOrigin();
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}
