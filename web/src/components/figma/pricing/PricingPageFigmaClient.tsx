'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Lock, Bell, ArrowRight } from 'lucide-react';
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
      <section className="pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="relative mx-auto mb-8 inline-block">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#E7E2DC] bg-white shadow-[0_16px_32px_-8px_rgba(37,48,68,0.08)] sm:h-36 sm:w-36">
                <Image
                  src={PIP_LOGO_URL}
                  alt="Pip"
                  width={100}
                  height={100}
                  className="h-[76px] w-auto sm:h-[96px]"
                  unoptimized
                  priority
                />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#FF5C34] px-3 py-1 text-xs font-semibold text-white">
                Meet Pip
              </span>
            </div>
            <h1
              className="mb-4 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', lineHeight: 1.15 }}
            >
              Browse for free.
              <br />
              <span className="text-[#FF5C34]">Let Pip guide what to buy.</span>
            </h1>
            <p
              className="mx-auto max-w-2xl font-normal text-[#66717D]"
              style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', lineHeight: 1.55 }}
            >
              Pip is Ember&apos;s Plus guide — the same mark you see in our logo. Free Ember is the
              catalogue. Pip helps you act at the right time: shortlists, local finds, seasons, and
              when something&apos;s ready to move on.
            </p>
            <p className="mt-3 text-sm font-medium text-[#66717D]">£3.99/month</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="#meet-pip"
                data-cta="start-plus"
                className="inline-flex items-center justify-center rounded-xl bg-[#FF5C34] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#E04B28]"
              >
                Meet Pip
              </a>
              <Link
                href={startFreeHref}
                className="inline-flex items-center justify-center rounded-xl border-2 border-[#E7E2DC] bg-transparent px-8 py-4 text-base font-semibold text-[#253044] transition-colors hover:border-[#FF5C34] hover:text-[#FF5C34]"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="pb-8 lg:pb-12">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
            <PricingCard
              name="Free"
              price="£0"
              label="Browse Ember yourself"
              features={[
                'See what your child is practising now',
                'Browse stage-aware ideas and categories',
                'Save ideas to your child’s list',
                'Share a simple gift list',
                'Browse marketplace listings near you',
                'Access core safety guidance',
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
              label="Smart buying with Pip by your side"
              recommended={true}
              badge="Pip included"
              features={[
                'Pip’s Trail — what’s useful next',
                'Pip Picks — shortlists instead of research holes',
                'Pip Nearby and Move-On for local pass-ons',
                'Seasons, gifts, and big life moments',
                'Support more than one child',
              ]}
              ctaText="Start Plus"
              ctaHref="#meet-pip"
            />
          </div>
        </div>
      </section>

      <MeetPipSection />

      <section id="compare" className="py-16 lg:py-20">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-10 text-center lg:mb-12">
            <div className="mb-4 flex justify-center">
              <Image
                src={PIP_LOGO_URL}
                alt=""
                width={48}
                height={48}
                className="h-12 w-auto"
                unoptimized
              />
            </div>
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}
            >
              Know it. Buy it. Move it on.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[1.0625rem] text-[#66717D]">
              Watch Pip wake up on the trail — that&apos;s what Plus adds on top of free browsing.
            </p>
          </div>
          <PipJourneyExplainer />
        </div>
      </section>

      <section id="trust" className="py-16 lg:py-20">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-12 rounded-3xl border border-[#E7E2DC] bg-white p-8 text-center lg:p-10">
            <div className="mx-auto max-w-3xl">
              <h3 className="mb-4 text-xl font-medium text-[#253044] sm:text-2xl">
                Why Free stays free
              </h3>
              <p className="text-[1.0625rem] leading-relaxed text-[#66717D]">
                Some retailer links may earn Ember a commission. That never changes Pip Picks or the
                stage guidance behind what we show.{' '}
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
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Lock,
                title: 'Privacy first',
                description: 'Your data stays yours. We never sell personal information.',
              },
              {
                icon: Bell,
                title: 'Calm reminders, not spam',
                description: 'Parent-controlled notifications. You decide when Ember reaches out.',
              },
              {
                icon: Shield,
                title: 'Transparent guidance',
                description: 'Research standards never steered by commercial partnerships.',
              },
              {
                icon: Shield,
                title: 'Safety-conscious',
                description: 'Some items remain new-only for safety. Your child comes first.',
              },
            ].map((trust) => (
              <div key={trust.title} className="rounded-2xl bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(255,92,52,0.1)]">
                  <trust.icon size={22} className="text-[#FF5C34]" strokeWidth={2} />
                </div>
                <h4 className="mb-2 text-[1.0625rem] font-medium text-[#253044]">{trust.title}</h4>
                <p className="text-sm leading-relaxed text-[#66717D]">{trust.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 lg:py-20">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="mb-12 text-center">
            <h2
              className="font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}
            >
              Frequently asked questions
            </h2>
          </div>
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 lg:p-10">
            <FAQItem
              question="Who is Pip?"
              answer="Pip is Ember’s Plus guide — the same mark as our logo. Free Ember lets you browse the stage catalogue yourself. With Plus, Pip helps you act at the right time: what’s useful next, what might be worth buying, local finds, seasons and gifts, and when something may be ready to pass on."
            />
            <FAQItem
              question="Why is Ember free to start?"
              answer="Every parent can use stage guidance and browse ideas without paying. Free helps you understand what your child is practising now. Plus adds Pip — calm help when it’s time to buy, plan, or pass things on."
            />
            <FAQItem
              question="What do I get with Ember Plus?"
              answer="You get Pip: Trail cues for stage shifts, Picks shortlists, Nearby and Move-On for local pass-ons, plus help with seasons, gifts and big moments like nursery. Support for more than one child is included."
            />
            <FAQItem
              question="What are Pip Picks?"
              answer="Pip Picks are curated product shortlists for your child’s age and stage. Instead of browsing hundreds of options, you get a clear shortlist with why each item may be a good fit now."
            />
            <FAQItem
              question="How do Pip’s Trail reminders work?"
              answer="When your child moves into a new stage, Ember can send a calm reminder that new ideas are worth a look. Reminders are parent-controlled — not daily noise."
            />
            <FAQItem
              question="How does Marketplace work?"
              answer="On Free, you can browse local listings and list items yourself. With Plus, Pip helps with Move-On: what may be ready to pass on, when to list it, and who nearby may want it."
            />
            <FAQItem
              question="How does Ember make money?"
              answer="Ember earns a commission from some retailer links and offers Plus at £3.99/month. Research standards and age-stage guidance are never steered by commercial partnerships."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes. Plus is a monthly subscription you can cancel anytime. No lock-in, no hidden fees. If you cancel, you keep access until the end of your billing period."
            />
            <FAQItem
              question="Can I use Ember for more than one child?"
              answer="On Free, you can manage one child profile. Plus includes support for multiple children, so Pip can guide you across siblings and stages."
            />
          </div>
        </div>
      </section>

      <section id="final-cta" className="py-16 lg:py-24">
        <div className={EMBER_MARKETING_CONTAINER}>
          <div className="rounded-3xl bg-white p-12 text-center lg:p-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#E7E2DC] bg-[#FFF6F3]">
              <Image
                src={PIP_LOGO_URL}
                alt="Pip"
                width={56}
                height={56}
                className="h-14 w-auto"
                unoptimized
              />
            </div>
            <h2
              className="mb-4 font-semibold tracking-[-0.01em] text-[#253044]"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Start free, upgrade when you want Pip beside you
            </h2>
            <p className="mx-auto mb-2 max-w-lg text-[#66717D]">£3.99/month · cancel anytime</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={startFreeHref}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FF5C34] px-10 py-5 text-lg font-semibold text-white transition-colors hover:bg-[#E04B28]"
              >
                Start free
                <ArrowRight size={20} />
              </Link>
              <a
                href="#meet-pip"
                data-cta="start-plus"
                className="rounded-xl border-2 border-[#E7E2DC] bg-transparent px-10 py-5 text-lg font-semibold text-[#253044] transition-colors hover:border-[#FF5C34] hover:text-[#FF5C34]"
              >
                Meet Pip
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
