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
      className="relative min-h-[320px] md:min-h-[420px] lg:min-h-[520px] lg:max-h-[560px] py-10 md:py-12 flex items-center justify-center overflow-hidden bg-white"
      style={{ backgroundColor: 'var(--ember-surface-primary)' }}
      aria-label="Hero"
    >
      {/* Warm morning light — cream/golden white (full-bleed, does not affect layout) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[320px] opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,250,245,1) 0%, rgba(255,245,235,0.9) 15%, rgba(255,240,230,0.5) 35%, rgba(255,235,220,0.2) 55%, transparent 75%)',
            filter: 'blur(80px)',
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[260px] opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(255,240,230,1) 0%, rgba(255,230,215,0.7) 25%, rgba(255,220,200,0.3) 50%, transparent 80%)',
            filter: 'blur(60px)',
          }}
          aria-hidden
        />
      </div>

      {/* Ember accent — subtle top right */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none opacity-15 overflow-hidden" aria-hidden>
        <div
          className="absolute top-0 right-0 w-full h-full"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(255,99,71,0.4) 0%, rgba(255,99,71,0.2) 35%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content aligned to shared page container (max-w-6xl px-4 sm:px-6) */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-tight mb-6"
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
          className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto mb-10"
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
            className="group px-8 py-4 bg-[#FF6347] text-white rounded-2xl font-medium text-lg hover:bg-[#B8432B] transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-[0.98] inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
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
