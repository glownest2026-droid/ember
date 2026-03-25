'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from './eventNames';
import { initPosthogIfNeeded, identifyUser } from './posthogClient';
import { trackEvent } from './trackEvent';

const COOKIE_SIGNIN = 'ember_ph_signin_completed';
const COOKIE_CHILD_EVENT = 'ember_ph_child_profile_event';
const COOKIE_CHILD_ID = 'ember_ph_child_profile_child_id';
const COOKIE_CHILD_AGE_BAND = 'ember_ph_child_profile_age_band_id';

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? '') : null;
}

function clearCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function pathToArea(pathname: string): string {
  if (
    pathname.startsWith('/signin') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')
  ) {
    return 'auth';
  }
  if (pathname.startsWith('/discover') || pathname.startsWith('/new') || pathname.startsWith('/play')) return 'discover';
  if (pathname.startsWith('/family') || pathname.startsWith('/add-children')) return 'family';
  if (pathname.startsWith('/my-ideas')) return 'my_ideas';
  if (pathname.startsWith('/gift')) return 'gift';
  if (pathname.startsWith('/marketplace')) return 'marketplace';
  if (pathname.startsWith('/products')) return 'products';
  return 'other';
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const [userId, setUserId] = useState<string | null>(null);
  const didCaptureSigninRef = useRef(false);
  const didCaptureChildRef = useRef(false);

  const area = useMemo(() => pathToArea(pathname), [pathname]);

  useEffect(() => {
    initPosthogIfNeeded();
    console.info('[ember-analytics] provider:mounted');

    // Load user id once for identify + event properties.
    const supabase = createClient();
    void supabase.auth
      .getUser()
      .then(({ data }) => {
        setUserId(data.user?.id ?? null);
      })
      .catch(() => {
        setUserId(null);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      console.info('[ember-analytics] auth:state_change', {
        event: _event,
        userPresent: Boolean(session?.user?.id),
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    identifyUser(userId);
  }, [userId]);

  useEffect(() => {
    trackEvent(EVENTS.PAGE_VIEW, { pathname, area });
  }, [pathname, area]);

  useEffect(() => {
    const signinPending = readCookie(COOKIE_SIGNIN);
    const childEvent = readCookie(COOKIE_CHILD_EVENT);
    const childId = readCookie(COOKIE_CHILD_ID);
    const childAgeBandId = readCookie(COOKIE_CHILD_AGE_BAND);

    const captureAndClear = async () => {
      // Allow future events to be captured after cookies are re-set later in the session.
      if (!signinPending) didCaptureSigninRef.current = false;
      if (!childEvent) didCaptureChildRef.current = false;

      // sign_in_completed
      if (signinPending && userId && !didCaptureSigninRef.current) {
        didCaptureSigninRef.current = true;
        trackEvent(EVENTS.SIGN_IN_COMPLETED, {
          user_id: userId,
          result: 'success',
        });
        clearCookie(COOKIE_SIGNIN);
      }

      // child_profile_created/updated
      if (
        childEvent &&
        userId &&
        childId &&
        !didCaptureChildRef.current &&
        (childEvent === 'created' || childEvent === 'updated')
      ) {
        didCaptureChildRef.current = true;
        const eventName = childEvent === 'created' ? EVENTS.CHILD_PROFILE_CREATED : EVENTS.CHILD_PROFILE_UPDATED;
        trackEvent(eventName, {
          user_id: userId,
          child_id: childId,
          age_band_id: childAgeBandId || null,
        });
        clearCookie(COOKIE_CHILD_EVENT);
        clearCookie(COOKIE_CHILD_ID);
        clearCookie(COOKIE_CHILD_AGE_BAND);
      }
    };

    void captureAndClear().catch(() => {
      // Fail closed: never block UI if analytics fails.
    });
  }, [userId, pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      // Only instrument internal go redirects.
      if (!href.includes('/go/')) return;

      try {
        const url = new URL(href, window.location.origin);
        if (!url.pathname.startsWith('/go/')) return;

        const parts = url.pathname.split('/').filter(Boolean);
        const productId = parts[1] || parts[parts.length - 1] || '';
        if (!productId) return;

        // If a caller sets `src=...` we carry it as a safe, coarse source surface.
        const sourceSurface = url.searchParams.get('src') ?? null;

        trackEvent(EVENTS.RETAILER_OUTBOUND_CLICKED, {
          user_id: userId ?? null,
          product_id: productId,
          source_surface: sourceSurface,
          click_path_type: 'go_redirect',
        });
      } catch {
        // Ignore malformed URLs.
      }
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true } as any);
  }, [userId]);

  return <>{children}</>;
}

