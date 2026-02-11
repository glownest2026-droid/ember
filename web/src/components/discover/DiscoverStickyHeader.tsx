'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'motion/react';
import { WhatIsEmberSheet } from './WhatIsEmberSheet';
import { useState } from 'react';

const EMBER_LOGO_URL = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

/**
 * Sticky header for /discover only: app-like, minimal, trust-led.
 * Left: logo + "Ember" (scroll to top). Right: "What is Ember?" + "Join free".
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
        <div className="h-full mx-auto max-w-6xl px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 min-w-0"
            aria-label="Scroll to top"
          >
            <img
              src={EMBER_LOGO_URL}
              alt=""
              className="w-8 h-8 object-contain flex-shrink-0"
              width={32}
              height={32}
            />
            <span
              className="text-lg font-semibold tracking-tight truncate"
              style={{ color: 'var(--ember-text-high)' }}
            >
              Ember
            </span>
          </button>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setWhatIsOpen(true)}
              className="text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--ember-text-high)' }}
            >
              What is Ember?
            </button>
            <Link
              href={joinHref}
              className="px-4 py-2 rounded-lg font-semibold text-sm text-white transition-colors bg-[#FF6347] hover:bg-[#B8432B]"
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
