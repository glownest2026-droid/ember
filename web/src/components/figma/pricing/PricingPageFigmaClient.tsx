'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { FAQItem } from './faq';
import { PricingCard } from './pricing-card';
import { PipJourneyExplainer } from './PipJourneyExplainer';
import { MeetPipSection } from './MeetPipSection';

function MarketplaceLink({ children = 'Marketplace' }: { children?: ReactNode }) {
  return (
    <Link
      href="/marketplace"
      className="font-medium text-[#FF5C34] underline-offset-2 hover:underline"
    >
      {children}
    </Link>
  );
}

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
      {/*
        Flow: short hero → Meet Pip (who is Pip?) → plans → journey → FAQ
      */}
      <section className="pt-8 pb-4 lg:pt-12 lg:pb-2">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="mb-3 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
            >
              Browse for free.
              <br />
              <span className="text-[#FF5C34]">Ember Plus guides your way.</span>
            </h1>
            <p className="mx-auto max-w-lg text-[1rem] leading-relaxed text-[#66717D] sm:text-[1.0625rem]">
              600+ free play ideas and a <MarketplaceLink>Smart Marketplace</MarketplaceLink>. Plus
              brings Pip.
            </p>
          </div>
        </div>
      </section>

      <MeetPipSection />

      <section id="plans" className="pb-4 pt-2 lg:pb-6 lg:pt-4">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
            <PricingCard
              name="Free"
              label={
                <>
                  The full play library and <MarketplaceLink>Smart Marketplace</MarketplaceLink> — in
                  your own time
                </>
              }
              features={[
                '600+ play ideas, personalised by age',
                'Save favourites, and share a gift list with family — for age-appropriate buying',
                <>
                  <MarketplaceLink>Smart Marketplace</MarketplaceLink> — list from a photo, match to
                  the right local families
                </>,
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
              label="Pip brings Ember to you — so you stay one step ahead"
              recommended={true}
              badge="Recommended"
              features={[
                'Pip’s Pathway — nudges on what’s next, so you stay one step ahead',
                'Pip’s Picks — a short list we’ve already weighed up, and why',
                'Pip Proximity — local matches for this age, when they fit',
                'Seasons & Moments — Christmas, birthdays, nursery and more',
                'Pip Move-On — when toys are done, help them find a new home',
                'More than one child',
              ]}
              ctaText="Start Plus"
              ctaHref="#compare"
            />
          </div>
        </div>
      </section>

      <section id="compare" className="pb-16 pt-6 lg:pb-20 lg:pt-10">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-8 text-center">
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.15 }}
            >
              Know it. Buy it. Move it on.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[1.0625rem] text-[#66717D]">
              That’s Ember in three steps.
              <br />
              With <strong className="font-semibold text-[#253044]">Plus</strong>, Pip helps you stay
              ahead.
            </p>
          </div>
          <PipJourneyExplainer />
        </div>
      </section>

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
              answer={
                <>
                  Free is a full product: 600+ play ideas, saves, gift lists and the{' '}
                  <MarketplaceLink>Smart Marketplace</MarketplaceLink> — in your own time. Ember Plus
                  adds your assistant Pip: Pathway nudges, Picks, Proximity matches, Seasons, Moments
                  and Move-On — so Ember works for you between visits.
                </>
              }
            />
            <FAQItem
              question="How does Ember make money?"
              answer="Some shop links may earn Ember a commission, and Plus is £3.99 a month. That doesn’t change what we recommend."
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="Free covers one child. Plus covers more than one, so siblings can sit at different ages without juggling accounts."
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
