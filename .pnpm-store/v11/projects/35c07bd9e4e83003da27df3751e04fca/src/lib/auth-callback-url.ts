/**
 * Base URL for Supabase OAuth and magic-link redirects to `/auth/callback`.
 *
 * **Browser (sign-in tab):** Uses `window.location.origin`, normalized to www on
 * production emberplay.app (apex → www for PKCE cookies). Preview stays on `*.vercel.app`.
 *
 * **Server (no `window`):** Preview → `https://${VERCEL_URL}`; Production auth →
 * always `https://www.emberplay.app` (Vercel serves www; apex 307s to www).
 *
 * **Critical:** Never redirect www → apex. Vercel already redirects apex → www, so
 * bouncing www back to apex causes ERR_TOO_MANY_REDIRECTS on /auth/callback.
 */

export const PRODUCTION_AUTH_ORIGIN = 'https://www.emberplay.app';

const EMBERPLAY_HOSTS = new Set(['emberplay.app', 'www.emberplay.app']);

export function isEmberplayProductionHost(hostname: string): boolean {
  return EMBERPLAY_HOSTS.has(hostname);
}

/**
 * Auth/session origin for production emberplay (always www).
 * Pass-through for localhost and vercel.app previews.
 */
export function getProductionAuthOrigin(requestOrigin: string): string {
  try {
    const host = new URL(requestOrigin).hostname;
    if (isEmberplayProductionHost(host)) return PRODUCTION_AUTH_ORIGIN;
  } catch {
    /* ignore */
  }
  return requestOrigin;
}

/**
 * One-hop apex → www before code exchange. Never redirects www away from itself.
 */
export function shouldRedirectAuthToWww(requestOrigin: string): boolean {
  try {
    return new URL(requestOrigin).hostname === 'emberplay.app';
  } catch {
    return false;
  }
}

/** Production canonical origin for server-side auth URL building. */
export function getCanonicalSiteOrigin(): string | null {
  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_AUTH_ORIGIN;
  }
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (!trimmed) return null;
  try {
    if (isEmberplayProductionHost(new URL(trimmed).hostname)) {
      return PRODUCTION_AUTH_ORIGIN;
    }
  } catch {
    /* ignore */
  }
  return trimmed;
}

/** Browser OAuth redirectTo base; maps production emberplay to www. */
export function normalizeAuthOrigin(origin: string): string {
  return getProductionAuthOrigin(origin);
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
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  const pathOnly = value.split(/[?#]/)[0];
  if (pathOnly === '/') return fallback;
  const blocked = ['/signin', '/signout', '/auth'];
  if (blocked.some((p) => pathOnly === p || pathOnly.startsWith(`${p}/`))) return fallback;
  return value;
}
