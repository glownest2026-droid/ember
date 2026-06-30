'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const NAV_EVENT = 'ember-discover-nav';

/** Update the URL without triggering a Next.js RSC navigation. */
export function pushDiscoverUrl(pathname: string, search: string): void {
  if (typeof window === 'undefined') return;
  const query = search.replace(/^\?/, '');
  const url = query ? `${pathname}?${query}` : pathname;
  const current = `${window.location.pathname}${window.location.search}`;
  if (current === url) return;
  window.history.pushState({ emberDiscoverNav: true }, '', url);
  window.dispatchEvent(new Event(NAV_EVENT));
}

/**
 * Query params that stay in sync with the address bar, including pushState updates.
 * Next.js useSearchParams alone does not update on client-only navigations.
 */
export function useDiscoverClientSearchParams(pathname: string | null) {
  const nextParams = useSearchParams();
  const [params, setParams] = useState(() => new URLSearchParams(nextParams?.toString() ?? ''));

  useEffect(() => {
    setParams(new URLSearchParams(nextParams?.toString() ?? ''));
  }, [nextParams]);

  useEffect(() => {
    const sync = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', sync);
    window.addEventListener(NAV_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(NAV_EVENT, sync);
    };
  }, []);

  const replace = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      if (!pathname) return;
      const next = new URLSearchParams(params.toString());
      mutate(next);
      pushDiscoverUrl(pathname, next.toString());
      setParams(next);
    },
    [pathname, params]
  );

  return { params, replace };
}
