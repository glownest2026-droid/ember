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
              <span className="text-[#FF5C34]">Let Pip guide what to buy.</span>
            </h1>
            <p className="mx-auto max-w-xl text-[1.125rem] leading-relaxed text-[#66717D]">
              Free Ember is the stage catalogue. Ember Plus adds Pip — timely help when it&apos;s
              actually useful.
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
              label="Browse Ember yourself"
              features={[
                'Stage-aware ideas for your child’s age',
                'Save ideas and share a gift list',
                'Browse local marketplace listings',
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
              label="Pip guides what to do next"
              recommended={true}
              badge="Recommended"
              features={[
                'Pip’s Trail — calm stage cues',
                'Pip Picks — shortlists, not research holes',
                'Nearby finds and Move-On prompts',
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
              answer="Yes. Plus is £3.99/month with no lock-in. Cancel anytime and keep access until the end of your billing period."
            />
            <FAQItem
              question="What’s the difference between Free and Plus?"
              answer="Free lets you browse the catalogue, save ideas, and use the marketplace yourself. Plus adds Pip — calm cues when a stage shifts, product shortlists, and help spotting local finds or things ready to pass on."
            />
            <FAQItem
              question="How does Ember make money?"
              answer="Some retailer links may earn a commission, and Plus is £3.99/month. That never changes stage guidance or Pip Picks."
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="Free includes one child profile. Plus supports more than one, so Pip can guide you across siblings and stages."
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
