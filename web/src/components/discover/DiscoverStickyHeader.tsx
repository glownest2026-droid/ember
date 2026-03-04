'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';
import { Compass, Bookmark, ShoppingBag, Users, User, LogOut, Menu, X } from 'lucide-react';

const EMBER_LOGO_SRC = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/**
 * Figma-style sticky navbar: logo + wordmark; signed-in: Manage Family, Account, Sign out; signed-out: Get started.
 * No "How it works" or "About". Subnav (SubnavGate) remains in layout for signed-in users.
 */
export default function DiscoverStickyHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const childParam = searchParams?.get('child') ?? '';
  const withChild = (path: string) => (childParam ? `${path}${path.includes('?') ? '&' : '?'}child=${encodeURIComponent(childParam)}` : path);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      className="sticky top-0 left-0 right-0 z-50 bg-[var(--ember-surface-primary)] border-b border-[var(--ember-border-subtle)] w-full min-w-0 overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'var(--header-height)',
      }}
    >
      <div className={`h-full w-full min-w-0 mx-auto px-4 sm:px-6 lg:px-12 py-5 ${pathname?.startsWith('/gift') ? 'max-w-3xl' : 'max-w-[90rem]'}`}>
        <div className="flex items-center justify-between gap-2 sm:gap-6 min-w-0">
          {/* Mobile: hamburger first (top-left), then logo, then nav */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors shrink-0 order-first"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={2} /> : <Menu className="w-6 h-6" strokeWidth={2} />}
          </button>
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                scrollToTop();
              }
            }}
            className="flex items-center gap-2 sm:gap-3 min-w-0 shrink leading-none overflow-hidden"
            aria-label="Ember home"
          >
            <Image
              src={EMBER_LOGO_SRC}
              alt=""
              className="h-10 w-auto min-w-0 shrink-0 object-contain sm:h-12"
              width={96}
              height={96}
              priority
            />
            <span
              className="text-xl sm:text-2xl text-[var(--ember-text-high)] truncate whitespace-nowrap"
              style={{ fontWeight: 500 }}
            >
              Ember
            </span>
          </Link>

          {/* Mobile: signed out = Sign in + Get started in bar; signed in = 4 nav icons in bar (one less click) */}
          <nav className="md:hidden flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
            {user ? (
              <>
                <Link
                  href={withChild('/discover')}
                  className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                  aria-label="Discover"
                >
                  <Compass className="w-5 h-5" strokeWidth={2} />
                </Link>
                <Link
                  href={withChild('/my-ideas')}
                  className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                  aria-label="My Saves"
                >
                  <Bookmark className="w-5 h-5" strokeWidth={2} />
                </Link>
                <Link
                  href="/products"
                  className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                  aria-label="Marketplace"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                </Link>
                <Link
                  href={withChild('/family')}
                  className="p-2 rounded-lg text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                  aria-label="Family"
                >
                  <Users className="w-5 h-5" strokeWidth={2} />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/signin${pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
                  className="text-sm font-medium text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link
                  href={getStartedHref}
                  className="px-3 py-1.5 text-sm font-medium bg-[var(--ember-accent-base)] text-white rounded-lg hover:bg-[var(--ember-accent-hover)] transition-colors whitespace-nowrap"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>

          {/* Desktop nav: 4 main links (icon + text) + 2 footer links */}
          <nav className="hidden md:flex items-center gap-6 shrink-0">
            {user ? (
              <>
                <Link
                  href={withChild('/discover')}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors text-base font-medium whitespace-nowrap"
                  aria-label="Discover"
                >
                  <Compass className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Discover
                </Link>
                <Link
                  href={withChild('/my-ideas')}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors text-base font-medium whitespace-nowrap"
                  aria-label="My Saves"
                >
                  <Bookmark className="w-5 h-5 shrink-0" strokeWidth={2} />
                  My Saves
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors text-base font-medium whitespace-nowrap"
                  aria-label="Marketplace"
                >
                  <ShoppingBag className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Marketplace
                </Link>
                <Link
                  href={withChild('/family')}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors text-base font-medium whitespace-nowrap"
                  aria-label="Family"
                >
                  <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Family
                </Link>
                <span className="text-[var(--ember-border-subtle)]" aria-hidden>|</span>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Account
                </Link>
                <Link
                  href="/signout"
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap opacity-80 hover:opacity-100"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/signin${pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
                  className="text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)] transition-colors text-base font-medium whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link
                  href={getStartedHref}
                  className="px-6 py-2.5 bg-[var(--ember-accent-base)] text-white rounded-xl hover:bg-[var(--ember-accent-hover)] transition-all font-medium text-base whitespace-nowrap"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="max-w-[90rem] mx-auto px-6 py-4 flex flex-col gap-1">
            {user ? (
              <>
                <Link
                  href={withChild('/discover')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 inline-flex items-center gap-2 text-[var(--ember-text-high)] font-medium"
                >
                  <Compass className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Discover
                </Link>
                <Link
                  href={withChild('/my-ideas')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 inline-flex items-center gap-2 text-[var(--ember-text-high)] font-medium"
                >
                  <Bookmark className="w-5 h-5 shrink-0" strokeWidth={2} />
                  My Saves
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 inline-flex items-center gap-2 text-[var(--ember-text-high)] font-medium"
                >
                  <ShoppingBag className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Marketplace
                </Link>
                <Link
                  href={withChild('/family')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 inline-flex items-center gap-2 text-[var(--ember-text-high)] font-medium"
                >
                  <Users className="w-5 h-5 shrink-0" strokeWidth={2} />
                  Family
                </Link>
                <div className="h-px bg-[var(--ember-border-subtle)] my-2" aria-hidden />
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-[var(--ember-text-high)] font-medium"
                >
                  Account
                </Link>
                <Link
                  href="/signout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-[var(--ember-text-low)] font-medium opacity-80"
                >
                  Sign out
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={`/signin${pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-[var(--ember-text-high)] font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href={getStartedHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 font-medium text-[var(--ember-accent-base)]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
