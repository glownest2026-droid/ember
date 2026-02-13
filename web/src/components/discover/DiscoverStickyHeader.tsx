'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { WhatIsEmberSheet } from './WhatIsEmberSheet';
import { useState } from 'react';

const EMBER_LOGO_URL = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/**
 * Sticky header for /discover only: single left-aligned cluster.
 * [Logo] [Ember] [What is Ember?] [Join free] — nothing right-aligned.
 */
export default function DiscoverStickyHeader() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [whatIsOpen, setWhatIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  const signinNext = pathname && pathname.startsWith('/discover') ? pathname : '/discover';
  const joinHref = `/signin?next=${encodeURIComponent(signinNext)}`;

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--ember-surface-primary)',
          borderBottom: '1px solid #E5E7EB',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          height: 'var(--header-height)',
          minHeight: '56px',
        }}
      >
        <div className="h-full mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <div className="flex items-center justify-start gap-3 py-2 sm:gap-6">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 min-w-0 shrink-0 leading-none"
              aria-label="Scroll to top"
            >
              <img
                src={EMBER_LOGO_URL}
                alt=""
                className="h-10 sm:h-12 md:h-12 w-auto object-contain flex-shrink-0"
                width={48}
                height={48}
              />
              <span
                className="text-base sm:text-lg font-semibold tracking-tight truncate whitespace-nowrap"
                style={{ color: 'var(--ember-text-high)' }}
              >
                Ember
              </span>
            </button>
            <button
              type="button"
              onClick={() => setWhatIsOpen(true)}
              className="text-sm font-medium transition-opacity hover:opacity-80 shrink-0 whitespace-nowrap"
              style={{ color: 'var(--ember-text-high)' }}
            >
              About
            </button>
            <Link
              href={joinHref}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors bg-[#FF6347] hover:bg-[#B8432B] shrink-0 whitespace-nowrap"
              style={{ borderRadius: 'var(--ember-radius-button, 8px)' }}
            >
              Join free
            </Link>
          </div>
        </div>
      </header>

      <WhatIsEmberSheet
        open={whatIsOpen}
        onClose={() => setWhatIsOpen(false)}
        signinNextPath={signinNext}
      />
    </>
  );
}
