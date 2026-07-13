'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User as AuthUser } from '@supabase/supabase-js';
import { Menu, X } from 'lucide-react';
import { EMBER_FIGMA_APP_CONTAINER } from '@/lib/discover/figmaTokens';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import {
  FIGMA_CTA_PRIMARY_CLASS,
  FIGMA_CTA_TEXT_CLASS,
  FIGMA_NAV_HEADER_CLASS,
  figmaDesktopNavLinkClass,
  figmaMutedNavLinkClass,
} from '@/lib/discover/navStyles';

const EMBER_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/**
 * Signed-out global header — Figma May 2026 discover styling (matches live /discover).
 */
export default function DiscoverStickyHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? '';
  const currentPathWithQuery = pathname
    ? `${pathname}${queryString ? `?${queryString}` : ''}`
    : '/discover';
  const signinHref = `/signin?next=${encodeURIComponent(currentPathWithQuery)}`;
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDiscover = pathname?.startsWith('/discover') ?? false;
  const isPricing = pathname === '/pricing';
  const isMarketplace = pathname?.startsWith('/marketplace') ?? false;
  const isHome = pathname === '/';
  const shellContainer = isHome || isPricing ? EMBER_MARKETING_CONTAINER : EMBER_FIGMA_APP_CONTAINER;

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

  if (user) return null;

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full min-w-0 overflow-hidden border-b ${FIGMA_NAV_HEADER_CLASS}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className={`${shellContainer} flex h-24 items-center justify-between gap-4 md:h-28`}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="shrink-0 rounded-lg p-2 text-[#253044] transition-colors hover:bg-white/80 md:hidden"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" strokeWidth={2} /> : <Menu className="h-6 w-6" strokeWidth={2} />}
        </button>

        <Link
          href="/"
          onClick={(e) => {
            if (pathname === '/') {
              e.preventDefault();
              scrollToTop();
            }
          }}
          className="flex min-w-0 shrink-0 items-center gap-3"
          aria-label="Ember home"
        >
          <Image
            src={EMBER_LOGO_SRC}
            alt=""
            className="h-20 w-20 object-contain md:h-[88px] md:w-[88px]"
            width={88}
            height={88}
            priority
          />
          <span className="hidden truncate sm:block font-bold text-xl text-[#253044]">Ember</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/discover" className={figmaDesktopNavLinkClass(isDiscover)}>
            Discover
          </Link>
          <Link href="/pricing" className={figmaMutedNavLinkClass(isPricing)}>
            Pricing
          </Link>
          <Link href="/marketplace" className={figmaMutedNavLinkClass(isMarketplace)}>
            Marketplace
          </Link>
          <Link href={signinHref} className={figmaMutedNavLinkClass()}>
            Sign in
          </Link>
          <Link href={getStartedHref} className={FIGMA_CTA_PRIMARY_CLASS}>
            Get started
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-3 md:hidden">
          <Link href={signinHref} className={FIGMA_CTA_TEXT_CLASS}>
            Sign in
          </Link>
          <Link
            href={getStartedHref}
            className="rounded-xl bg-[#FF5C34] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#E54A2E]"
          >
            Get started
          </Link>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`border-t border-[#E7E2DC] md:hidden ${FIGMA_NAV_HEADER_CLASS}`}>
          <nav className={`${shellContainer} flex flex-col gap-1 py-4`}>
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl px-3 py-3 ${figmaDesktopNavLinkClass(isDiscover)}`}
            >
              Discover
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl px-3 py-3 ${figmaMutedNavLinkClass(isHome)}`}
            >
              About
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl px-3 py-3 ${figmaMutedNavLinkClass(isPricing)}`}
            >
              Pricing
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl px-3 py-3 ${figmaMutedNavLinkClass(isMarketplace)}`}
            >
              Marketplace
            </Link>
            <Link
              href={signinHref}
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl px-3 py-3 ${figmaMutedNavLinkClass()}`}
            >
              Sign in
            </Link>
            <Link
              href={getStartedHref}
              onClick={() => setMobileMenuOpen(false)}
              className={`mt-2 inline-flex justify-center ${FIGMA_CTA_PRIMARY_CLASS}`}
            >
              Get started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
