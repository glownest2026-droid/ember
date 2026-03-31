'use client';

import { Shield, Lock, Bell, ArrowRight } from 'lucide-react';
import { FAQItem } from './faq';
import { InteractiveComparison } from './interactive-comparison';
import { PricingCard } from './pricing-card';

export default function PricingPageFigmaClient() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--ember-gray-100)' }}>
      <section className="pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="mb-0"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.15 }}
            >
              <span style={{ color: 'var(--ember-gray-900)' }}>Browse for free. </span>
              <br />
              <span style={{ color: '#B8432B' }}>Let Ember guide what to buy.</span>
            </h1>
          </div>
        </div>
      </section>

      <section id="pricing" className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="£0"
              label="Understand the stage and browse for yourself"
              features={[
                'See what children this age are learning and why it matters',
                'Browse products from different brands',
                'Save ideas and share a simple gift list',
                'Browse local listings and list items yourself',
                '1 child profile',
              ]}
              ctaText="Start free"
            />
            <PricingCard
              name="Ember Plus"
              price="£3.99"
              period="/month"
              annualPrice="or £29 for your first year"
              label="Help buying the right things, at the right time"
              recommended={true}
              badge="Best for ongoing help"
              features={[
                'Unlock Ember Picks — research-backed product recommendations',
                'Get reminders when a new wave is worth a look',
                'Get smart gift suggestions for family',
                'Get prompts for what to pass on, when to list it, and who nearby may want it',
                'Support more than one child',
              ]}
              ctaText="Start Plus"
            />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="mb-12 text-center">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ember-gray-900)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Know it. Buy it. Move it on.
            </h2>
          </div>
          <InteractiveComparison />
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="rounded-3xl p-8 lg:p-10 mb-12" style={{ backgroundColor: 'white', border: '1px solid var(--ember-gray-300)' }}>
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="mb-4" style={{ fontSize: '1.5rem', color: 'var(--ember-gray-900)', fontWeight: 500 }}>
                Why Free stays free
              </h3>
              <p style={{ fontSize: '1.0625rem', color: 'var(--ember-gray-600)', lineHeight: 1.625 }}>
                Some retailer links may earn Ember a commission. That never changes Ember Picks or the stage guidance behind what we show.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Lock, title: 'Privacy first', description: 'Your data stays yours. We never sell personal information.' },
              { icon: Bell, title: 'Calm reminders, not spam', description: 'Parent-controlled notifications. You decide when Ember reaches out.' },
              { icon: Shield, title: 'Transparent guidance', description: 'Research standards never influenced by commercial partnerships.' },
              { icon: Shield, title: 'Safety-conscious', description: 'Some items remain new-only for safety. Your child comes first.' },
            ].map((trust, index) => (
              <div key={index} className="rounded-2xl p-6" style={{ backgroundColor: 'white' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(255, 99, 71, 0.1)' }}>
                  <trust.icon size={22} style={{ color: 'var(--ember-primary)' }} strokeWidth={2} />
                </div>
                <h4 className="mb-2" style={{ fontSize: '1.0625rem', color: 'var(--ember-gray-900)', fontWeight: 500 }}>{trust.title}</h4>
                <p className="text-sm" style={{ color: 'var(--ember-gray-600)', lineHeight: 1.625 }}>{trust.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="mb-12 text-center">
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ember-gray-900)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Frequently asked questions
            </h2>
          </div>
          <div className="max-w-4xl mx-auto rounded-3xl p-8 lg:p-10" style={{ backgroundColor: 'white' }}>
            <FAQItem question="Why is Ember free to start?" answer="We want every parent to access stage guidance and browse products without barriers. Free gives you the tools to understand what children this age are learning and explore options on your own. Plus adds the smart engine that saves you time and mental load." />
            <FAQItem question="What do I get with Ember Plus?" answer="Plus unlocks Ember Picks (research-backed product recommendations), reminders when new recommendations are worth looking at, smart gift suggestions for family, and automated decluttering help with local move-it-on prompts. You also get support for multiple children." />
            <FAQItem question="What are Ember Picks?" answer="Ember Picks are research-backed product recommendations tailored to your child's age and stage. Instead of browsing hundreds of options, you get a credible shortlist with clear reasoning about why each item is a good fit now. It saves you doing the research yourself." />
            <FAQItem question="How do reminders work?" answer="When your child moves into a new developmental wave, Ember sends you a calm reminder that new recommendations are worth looking at. You stay one step ahead without checking the app constantly. All reminders are parent-controlled." />
            <FAQItem question="How does smart gifting help?" answer="Ember suggests age-appropriate items that your child actually needs, making it easier for grandparents and friends to buy useful gifts instead of duplicates. You can share these suggestions with family when birthdays or holidays come around." />
            <FAQItem question="How does Marketplace work?" answer="On Free, you can browse local listings and list items yourself. With Plus, Ember gives you automated decluttering help: it tells you what your child may be ready to pass on, when to list it, and which nearby families are looking for those items." />
            <FAQItem question="How does Ember make money?" answer="Ember earns a commission from some retailer links and offers the Plus subscription at £3.99/month. Our research standards and age-stage guidance are never influenced by commercial partnerships." />
            <FAQItem question="Can I cancel anytime?" answer="Yes. Plus is a monthly subscription you can cancel anytime. There is no lock-in, no hidden fees, and no pressure. If you cancel, you will keep access until the end of your billing period." />
            <FAQItem question="Can I use Ember for more than one child?" answer="On Free, you can manage one child profile. Plus includes support for multiple children, so Ember can guide you across siblings and stages simultaneously." />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="rounded-3xl p-12 lg:p-16 text-center" style={{ backgroundColor: 'white' }}>
            <h2 className="mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: 'var(--ember-gray-900)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              Start free, upgrade when you want Ember to take more off your plate
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                className="rounded-xl px-10 py-5 flex items-center gap-2 transition-all duration-300"
                style={{ backgroundColor: 'var(--ember-primary)', color: 'white', fontWeight: 600, fontSize: '1.125rem' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ember-primary-dark)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0px 8px 32px rgba(255,99,71,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--ember-primary)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start free
                <ArrowRight size={20} />
              </button>
              <button
                className="rounded-xl px-10 py-5 transition-all duration-300"
                style={{ backgroundColor: 'transparent', color: 'var(--ember-gray-900)', border: '2px solid var(--ember-gray-300)', fontWeight: 600, fontSize: '1.125rem' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ember-primary)';
                  e.currentTarget.style.color = 'var(--ember-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--ember-gray-300)';
                  e.currentTarget.style.color = 'var(--ember-gray-900)';
                }}
              >
                Start Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12" style={{ borderColor: 'var(--ember-gray-300)' }}>
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
          <div className="text-center">
            <div className="mb-4" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--ember-gray-900)', fontWeight: 400 }}>
              Ember
            </div>
            <p className="text-sm" style={{ color: 'var(--ember-gray-600)' }}>
              © 2026 Ember. Built with care for parents.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
