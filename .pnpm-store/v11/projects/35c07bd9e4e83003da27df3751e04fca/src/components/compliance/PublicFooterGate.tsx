'use client';

import { usePathname } from 'next/navigation';
import { PublicFooter } from './PublicFooter';

const EXACT_PATHS = new Set([
  '/',
  '/pricing',
  '/affiliate-disclosure',
  '/how-ember-makes-money',
  '/how-we-choose',
  '/safety-rules',
]);

const HIDE_PREFIXES = [
  '/app',
  '/my-ideas',
  '/family',
  '/account',
  '/add-children',
  '/signin',
  '/admin',
  '/gift/',
  '/marketplace/listings',
];

function shouldShowPublicFooter(pathname: string | null): boolean {
  if (!pathname) return false;
  if (HIDE_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  if (EXACT_PATHS.has(pathname)) return true;
  if (pathname === '/discover' || /^\/discover\/\d+$/.test(pathname)) return true;
  return false;
}

/** Compact legal footer for public marketing and Discover routes only. */
export function PublicFooterGate() {
  const pathname = usePathname();
  if (!shouldShowPublicFooter(pathname)) return null;
  return <PublicFooter />;
}
