'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';
import { FAQItem } from './faq';
import { PricingCard } from './pricing-card';
import { PipJourneyExplainer } from './PipJourneyExplainer';
import { MeetPipSection } from './MeetPipSection';
import { PIP_LOGO_URL } from './pricingImages';

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
      {/* 1. Hero — Pip visible above the fold so “puts Pip on the path” lands */}
      <section className="pt-10 pb-10 lg:pt-16 lg:pb-12">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <div className="relative">
                <div className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-2 border-[#F1DED3] bg-[#FFF6F3] shadow-[0_12px_28px_-8px_rgba(255,92,52,0.28)] sm:h-[5.5rem] sm:w-[5.5rem]">
                  <Image
                    src={PIP_LOGO_URL}
                    alt="Pip"
                    width={88}
                    height={88}
                    className="h-14 w-auto sm:h-[4.25rem]"
                    unoptimized
                    priority
                  />
                </div>
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF5C34] px-2.5 py-0.5 text-[0.6875rem] font-semibold text-white shadow-sm">
                  Pip
                </span>
              </div>
            </div>
            <h1
              className="mb-3 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.15 }}
            >
              Browse for free.
              <br />
              <span className="text-[#FF5C34]">
                Ember Plus
                <br />
                guides your pathway
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-[1.0625rem] leading-relaxed text-[#66717D] sm:text-[1.125rem]">
              Free Ember: 600+ stage ideas and a Smart Marketplace you can use forever. Ember Plus
              adds your assistant Pip — watching what&apos;s next, landing the short list, and
              tapping you for local matches, seasons and life&apos;s big moments.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Plans */}
      <section id="plans" className="pb-4 lg:pb-6">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
            <PricingCard
              name="Free"
              label="The full catalogue and Marketplace — in your own time"
              features={[
                '600+ stage ideas, personalised by age',
                'Save ideas and share a gift list with family',
                'Smart Marketplace — list from a photo, matched to need',
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
              label="Pip brings Ember to you — so you’re ahead, not catching up"
              recommended={true}
              badge="Recommended"
              features={[
                'Pip’s Pathway — stage nudges before you feel behind',
                'Pip’s Picks — a short research-backed list, and why',
                'Pip Proximity — local matches for this age, when they fit',
                'Seasons & Moments — Christmas, birthdays, nursery and more',
                'Pip Move-On — when kit’s done, help it find a new home',
                'More than one child',
              ]}
              ctaText="Start Plus"
              ctaHref="#meet-pip"
            />
          </div>
        </div>
      </section>

      {/* 3. Meet Pip */}
      <MeetPipSection />

      {/* 4. Journey */}
      <section id="compare" className="pb-16 pt-4 lg:pb-20 lg:pt-6">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-8 text-center">
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.15 }}
            >
              Know it. Buy it. Move it on.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[1.0625rem] text-[#66717D]">
              A free play map. Ember Plus guides your smart path, with Pip.
            </p>
          </div>
          <PipJourneyExplainer />
        </div>
      </section>

      {/* 5. FAQ */}
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
              answer="Free is a full product: 600+ stage ideas, saves, gift lists and the Smart Marketplace — forever, in your own time. Ember Plus adds your assistant Pip: Pathway nudges, Picks, Proximity matches, Seasons, Moments and Move-On — so Ember works for you between visits."
            />
            <FAQItem
              question="How does Ember make money?"
              answer="Some shop links may earn Ember a commission, and Plus is £3.99 a month. That doesn’t change what we recommend."
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="Free covers one child. Plus covers more than one, so siblings can sit on different stages without juggling accounts."
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
