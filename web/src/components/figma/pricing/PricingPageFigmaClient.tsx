'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { FAQItem } from './faq';
import { PricingCard } from './pricing-card';
import { PipJourneyExplainer } from './PipJourneyExplainer';
import { MeetPipSection } from './MeetPipSection';

export default function PricingPageFigmaClient() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setSignedIn(!!user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const startFreeHref = signedIn ? '/discover' : '/signin?next=/discover';

  return (
    <main
      id="ember-pricing-prototype"
      className="homepage-discover-brand min-h-screen bg-[var(--ember-bg-canvas)]"
    >
      {/* 1. Hero — outcome, not product tour */}
      <section className="pt-16 pb-10 lg:pt-20 lg:pb-12">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto max-w-3xl text-center">
            <h1
              className="mb-3 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', lineHeight: 1.15 }}
            >
              Browse for free.
              <br />
              <span className="text-[#FF5C34]">Get Pip to help with what to buy.</span>
            </h1>
            <p className="mx-auto max-w-xl text-[1.125rem] leading-relaxed text-[#66717D]">
              Free Ember shows what fits this age. Plus adds Pip — so you&apos;re not left to figure
              every purchase out on your own.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Plans — the conversion core */}
      <section id="plans" className="pb-4 lg:pb-6">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
            <PricingCard
              name="Free"
              price="£0"
              label="Have a look round yourself"
              features={[
                'Ideas for what they’re into at this age',
                'Save things and share a gift list',
                'Browse local listings',
                '1 child profile',
              ]}
              ctaText="Start free"
              ctaHref={startFreeHref}
            />
            <PricingCard
              name="Ember Plus"
              price="£3.99"
              period="/month"
              annualPrice="or £29 for your first year"
              label="Pip helps with what to do next"
              recommended={true}
              badge="Recommended"
              features={[
                'Pip’s Trail — what’s changing next',
                'Pip Picks — a few options, not 40 tabs',
                'Local finds, and when to pass stuff on',
                'More than one child',
              ]}
              ctaText="Start Plus"
              ctaHref="#plans"
            />
          </div>
        </div>
      </section>

      {/* 3. Meet Pip — who Plus is */}
      <MeetPipSection />

      {/* 4. Journey — what Plus does (one differentiator) */}
      <section id="compare" className="pb-16 pt-4 lg:pb-20 lg:pt-6">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-8 text-center">
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.15 }}
            >
              Know it. Buy it. Move it on.
            </h2>
          </div>
          <PipJourneyExplainer />
        </div>
      </section>

      {/* 5. Short FAQ — objections only */}
      <section id="faq" className="border-t border-[#E7E2DC] bg-white py-14 lg:py-16">
        <div className={EMBER_MARKETING_CONTAINER}>
          <h2
            className="mb-8 text-center font-semibold tracking-[-0.01em] text-[#253044]"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}
          >
            Questions
          </h2>
          <div className="mx-auto max-w-2xl">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes. Plus is £3.99 a month. Cancel whenever you like — you keep it until the end of the month you’ve paid for."
            />
            <FAQItem
              question="What’s the difference between Free and Plus?"
              answer="Free is for browsing: ideas for their age, saves, gift lists, and local listings. Plus adds Pip — a nudge when something’s changing, a few buying options when you need them, and a heads-up when kit might be ready to pass on."
            />
            <FAQItem
              question="How does Ember make money?"
              answer="Some shop links may earn Ember a commission, and Plus is £3.99 a month. That doesn’t change what we recommend."
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="Free covers one child. Plus covers more than one, so you can keep siblings on different stages without juggling accounts."
            />
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[#66717D]">
            <Link
              href="/how-ember-makes-money"
              className="font-medium text-[#FF5C34] underline-offset-2 hover:underline"
            >
              How Ember makes money
            </Link>
            {' · '}
            <Link
              href="/affiliate-disclosure"
              className="font-medium text-[#FF5C34] underline-offset-2 hover:underline"
            >
              Affiliate disclosure
            </Link>
            {' · '}
            <Link
              href="/safety-rules"
              className="font-medium text-[#FF5C34] underline-offset-2 hover:underline"
            >
              Safety
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
