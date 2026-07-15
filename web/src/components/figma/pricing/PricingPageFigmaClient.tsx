'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { FAQItem } from './faq';
import { PricingCard } from './pricing-card';
import { PipJourneyExplainer } from './PipJourneyExplainer';
import { MeetPipSection } from './MeetPipSection';
import { WaitlistJoinModal } from './WaitlistJoinModal';

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
  const [waitlistOpen, setWaitlistOpen] = useState(false);

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
      <section className="pt-12 pb-8 lg:pt-16 lg:pb-10">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto max-w-2xl text-center">
            <h1
              className="mb-4 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.875rem, 4.5vw, 3rem)', lineHeight: 1.15 }}
            >
              Browse for free.
              <br />
              <span className="text-[#FF5C34]">
                Ember Plus
                <br />
                guides your way.
              </span>
            </h1>
            <p className="mx-auto max-w-lg text-[1rem] leading-relaxed text-[#66717D] sm:text-[1.0625rem]">
              600+ free play ideas and a <MarketplaceLink>Smart Marketplace</MarketplaceLink>. Get
              more with Ember Plus including Pip — your play coach.
            </p>
          </div>
        </div>
      </section>

      <MeetPipSection />

      <section id="plans" className="pb-14 pt-10 lg:pb-20 lg:pt-14">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <PricingCard
              name="Free"
              label="The full play library and Smart Marketplace — browse in your own time"
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
              annualPrice="or £29 for 12 months"
              label="Pip brings Ember to you — so you stay one step ahead"
              recommended={true}
              badge="Recommended"
              features={[
                'Pip’s Pathway — nudges on what’s next, so you stay one step ahead',
                'Pip’s Picks — a shortlist we’ve already weighed up, and why',
                'Pip’s Patch Finds — local matches for this age, when they fit',
                'Pip’s Seasons & Chapters — Christmas, birthdays, nursery and more',
                'Pip’s Pass-On — when toys are done, help them find a new home',
                'More than one child',
              ]}
              ctaText="Join the waitlist"
              onCtaClick={() => setWaitlistOpen(true)}
              ctaHint="No payment yet — we’ll email when Ember Plus is ready"
              learnMoreHref="#ember-plus-features"
            />
          </div>
        </div>
      </section>

      <WaitlistJoinModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} source="pricing" />

      <section id="compare" className="pb-20 pt-12 lg:pb-28 lg:pt-16">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-12 text-center lg:mb-14">
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.15 }}
            >
              Know it. Find it. Move it on.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-[#66717D]">
              That’s Ember in three steps.
              <br />
              With <strong className="font-semibold text-[#253044]">Ember Plus</strong>, Pip helps
              you stay ahead through six exclusive features.
            </p>
            <p
              id="ember-plus-features"
              className="mx-auto mt-10 scroll-mt-24 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', lineHeight: 1.2 }}
            >
              Ember Plus features:
            </p>
          </div>
          <PipJourneyExplainer />
        </div>
      </section>

      <section id="faq" className="border-t border-[#E7E2DC] bg-white py-20 lg:py-24">
        <div className={EMBER_MARKETING_CONTAINER}>
          <h2
            className="mb-10 text-center font-semibold tracking-[-0.01em] text-[#253044]"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}
          >
            Questions
          </h2>
          <div className="mx-auto max-w-2xl">
            <FAQItem
              question="Do I need a card for Free?"
              answer="No. Start Free with no card. The play library and Smart Marketplace are yours to browse whenever you want."
            />
            <FAQItem
              question="Can I join Ember Plus now?"
              answer="Not yet — join the waitlist and we’ll email you when it’s ready. There’s no payment to join the list. Free remains available with no card."
            />
            <FAQItem
              question="What’s the difference between Free and Ember Plus?"
              answer={
                <>
                  Free is a full product: 600+ play ideas, saves, gift lists and the{' '}
                  <MarketplaceLink>Smart Marketplace</MarketplaceLink> — browse in your own time.
                  Ember Plus will add your assistant Pip: Pathway, Picks, Patch Finds, Seasons,
                  Chapters and Pass-On — so Ember works for you between visits.
                </>
              }
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="Free covers one child. Ember Plus is planned to cover more than one, so siblings can sit at different ages without juggling accounts."
            />
            <FAQItem
              question="What will Ember Plus cost?"
              answer="We’re planning £3.99 a month or £29 for 12 months when it launches. Join the waitlist for an email when paid membership opens — cancel anytime once you’re a member."
            />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[#66717D]">
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
