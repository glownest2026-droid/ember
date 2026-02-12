'use client';

import { ArrowRight } from 'lucide-react';

interface DiscoverHeroPocketPlayGuideProps {
  onGetStarted: () => void;
}

/**
 * Discover hero: "Your pocket play guide" — premium calm hero with warm morning light
 * gradients. Source Serif 4 headline, Inter subheadline + CTA. Scroll-to discovery on CTA.
 */
export function DiscoverHeroPocketPlayGuide({ onGetStarted }: DiscoverHeroPocketPlayGuideProps) {
  return (
    <section
      className="relative min-h-0 py-12 sm:py-14 md:py-16 flex items-center justify-center overflow-hidden bg-white"
      style={{ backgroundColor: 'var(--ember-surface-primary)' }}
      aria-label="Hero"
    >
      {/* Warm morning light — cream/golden white */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[500px] opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,250,245,1) 0%, rgba(255,245,235,0.9) 15%, rgba(255,240,230,0.5) 35%, rgba(255,235,220,0.2) 55%, transparent 75%)',
            filter: 'blur(100px)',
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,240,230,1) 0%, rgba(255,230,215,0.7) 25%, rgba(255,220,200,0.3) 50%, transparent 80%)',
            filter: 'blur(80px)',
          }}
          aria-hidden
        />
      </div>

      {/* Ember accent — subtle top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-15" aria-hidden>
        <div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(255,99,71,0.4) 0%, rgba(255,99,71,0.2) 35%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <h1
          className="text-[3.75rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] font-normal leading-[0.95] tracking-tight mb-5 sm:mb-6"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--ember-text-high)',
            letterSpacing: '-0.025em',
          }}
        >
          Your pocket
          <br />
          play guide
        </h1>

        <p
          className="text-[1.25rem] sm:text-[1.5rem] md:text-[1.875rem] font-light max-w-3xl mx-auto mb-8 sm:mb-10"
          style={{
            fontFamily: 'var(--font-sans)',
            color: 'var(--ember-text-low)',
            lineHeight: 1.625,
          }}
        >
          From bump to big steps — science-powered toy ideas for what they&apos;re learning next
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onGetStarted}
            className="group px-10 py-5 bg-[#FF6347] text-white rounded-2xl font-medium text-lg hover:bg-[#B8432B] transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-[0.98] inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
            style={{
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 12px 40px rgba(255,99,71,0.25)',
            }}
          >
            Get started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
