/**
 * Base URL for Supabase OAuth and magic-link redirects to `/auth/callback`.
 *
 * **Browser (sign-in tab):** Always `window.location.origin` so the callback matches
 * where PKCE started — required for Google OAuth on Vercel Preview (same deployment
 * origin). Production users on `https://emberplay.app` get that origin; Preview gets
 * `https://…vercel.app`; localhost stays local.
 *
 * **Server (no `window`):** Preview → `https://${VERCEL_URL}`; Production →
 * `NEXT_PUBLIC_SITE_URL` (canonical `https://emberplay.app`); else `http://localhost:3000`.
 *
 * Supabase Redirect URLs must allow each origin you use (production, localhost, and a
 * Vercel preview pattern — see docs).
 */
export function getAuthCallbackOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, '').split('/')[0];
    return `https://${host}`;
  }
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (process.env.VERCEL_ENV === 'production' && trimmed) {
    return trimmed;
  }
  return 'http://localhost:3000';
}

/** Full callback URL with `next` path/query (e.g. `/discover` or `/discover/26?child=x`). */
export function buildAuthCallbackUrl(nextPath: string): string {
  const origin = getAuthCallbackOrigin();
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

/**
 * Resolve a safe post-sign-in destination. Prevents the "sign in → land back on
 * sign-in" loop by rejecting auth routes (and protecting against open redirects).
 * Defaults to `/discover`.
 */
export function safeNextPath(next: string | null | undefined): string {
  const fallback = '/discover';
  if (!next) return fallback;
  const value = next.trim();
  // Same-origin absolute paths only (block protocol-relative / external URLs).
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  const pathOnly = value.split(/[?#]/)[0];
  // Land signed-in users in the app (/discover), not the marketing homepage.
  if (pathOnly === '/') return fallback;
  const blocked = ['/signin', '/signout', '/auth'];
  if (blocked.some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`))) return fallback;
  return value;
}
