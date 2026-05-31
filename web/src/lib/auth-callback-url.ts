/**
 * Base URL for Supabase OAuth and magic-link redirects to `/auth/callback`.
 *
 * **Browser (sign-in tab):** Uses `window.location.origin`, normalized to the canonical
 * production host when on emberplay.app (apex vs www must match for PKCE cookies).
 * Preview deployments keep their `*.vercel.app` origin.
 *
 * **Server (no `window`):** Preview → `https://${VERCEL_URL}`; Production →
 * `NEXT_PUBLIC_SITE_URL` (canonical `https://www.emberplay.app`); else localhost.
 *
 * Supabase Redirect URLs must allow each origin you use (production www + apex, localhost,
 * Vercel preview pattern — see `web/docs/FEB_2026_AUTH_SETUP.md`).
 */

const EMBERPLAY_HOSTS = new Set(['emberplay.app', 'www.emberplay.app']);

/** Production canonical origin from env, or www fallback when env is unset. */
export function getCanonicalSiteOrigin(): string | null {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (trimmed) return trimmed;
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://www.emberplay.app';
  }
  return null;
}

/**
 * Map apex ↔ www (and env canonical) so OAuth PKCE cookies and session cookies stay on one host.
 * Non-production origins (localhost, vercel.app) pass through unchanged.
 */
export function normalizeAuthOrigin(origin: string): string {
  const canonical = getCanonicalSiteOrigin();
  if (!canonical) return origin;
  try {
    const current = new URL(origin);
    if (!EMBERPLAY_HOSTS.has(current.hostname)) return origin;
    return new URL(canonical).origin;
  } catch {
    return origin;
  }
}

export function getAuthCallbackOrigin(): string {
  if (typeof window !== 'undefined') {
    return normalizeAuthOrigin(window.location.origin);
  }
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, '').split('/')[0];
    return `https://${host}`;
  }
  const canonical = getCanonicalSiteOrigin();
  if (process.env.VERCEL_ENV === 'production' && canonical) {
    return canonical;
  }
  return 'http://localhost:3000';
}

/** Full callback URL with `next` path/query (e.g. `/discover` or `/discover/26?child=x`). */
export function buildAuthCallbackUrl(nextPath: string): string {
  const origin = getAuthCallbackOrigin();
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/auth/callback?next=${encodeURIComponent(safeNextPath(nextPath))}`;
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
