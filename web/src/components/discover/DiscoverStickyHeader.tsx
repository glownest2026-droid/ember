'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Lightbulb, ShoppingBag, RefreshCw } from 'lucide-react';

const EMBER_LOGO_SRC = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/**
 * Figma-style sticky navbar: logo + wordmark; signed-in: Manage Family, Account, Sign out; signed-out: Get started.
 * No "How it works" or "About". Subnav (SubnavGate) remains in layout for signed-in users.
 */
export default function DiscoverStickyHeader() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  const signinNext = pathname && pathname.startsWith('/discover') ? pathname : '/discover';
  const getStartedHref =
    pathname && pathname.startsWith('/discover')
      ? `${pathname}${pathname.includes('?') ? '&' : '?'}openAuth=1`
      : `/signin?next=${encodeURIComponent(signinNext)}`;

  return (
    <header
      className="sticky top-0 left-0 right-0 z-50 bg-[var(--ember-surface-primary)] border-b border-[var(--ember-border-subtle)]"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'var(--header-height)',
      }}
    >
      <div className="h-full max-w-[90rem] mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                scrollToTop();
              }
            }}
            className="flex items-center gap-3 min-w-0 shrink-0 leading-none"
            aria-label="Ember home"
          >
            <Image
              src={EMBER_LOGO_SRC}
              alt=""
              className="h-12 w-auto object-contain flex-shrink-0"
              width={48}
              height={48}
              priority
            />
            <span
              className="text-2xl text-[var(--ember-text-high)] truncate whitespace-nowrap"
              style={{ fontWeight: 500 }}
            >
              Ember
            </span>
          </Link>

          {user ? (
            <div className="flex items-center gap-4 shrink-0" aria-label="Discover, Buy, Move">
              <Link
                href="/discover"
                className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                aria-label="Discover"
              >
                <Lightbulb className="w-5 h-5" strokeWidth={2} />
              </Link>
              <Link
                href="/new"
                className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                aria-label="Buy"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              </Link>
              <Link
                href="/products"
                className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                aria-label="Move"
              >
                <RefreshCw className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          ) : null}

          <nav className="flex items-center gap-6 shrink-0">
            {user ? (
              <>
                <Link
                  href="/family"
                  className="text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap"
                >
                  Manage Family
                </Link>
                <Link
                  href="/account"
                  className="text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap"
                >
                  Account
                </Link>
                <Link
                  href="/signout"
                  className="text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap opacity-80 hover:opacity-100"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <Link
                href={getStartedHref}
                className="px-6 py-2.5 bg-[var(--ember-accent-base)] text-white rounded-xl hover:bg-[var(--ember-accent-hover)] transition-all font-medium text-base whitespace-nowrap"
              >
                Get started
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
