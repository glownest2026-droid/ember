'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_STAGE2_IMAGES } from './homeStage2Images';
import { HomeStage2Media } from './HomeStage2Media';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';

export function HomeHero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-6rem)] items-center overflow-hidden bg-gradient-to-b from-[var(--ember-surface-primary)] to-[var(--ember-bg-canvas)] md:min-h-[calc(100dvh-7rem)]">
      <div className={`${EMBER_MARKETING_CONTAINER} w-full py-16 lg:py-20`}>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="home-display mb-6 text-[var(--ember-text-high)]">
              Your proactive
              <br />
              play guide
            </h1>
            <p className="home-lead mb-10 max-w-xl lg:mb-12">
              From bump to big steps. Over 600 free ideas for what they&apos;re practising next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/discover"
                className="home-cta home-cta-hero inline-flex items-center justify-center px-9 py-4.5 lg:px-10 lg:py-5 bg-[var(--ember-accent-base)] text-white rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,92,52,0.25)]"
              >
                Start exploring
              </Link>
              <Link
                href="#how-ember-works"
                className="home-link home-link-hero inline-flex items-center gap-2.5 px-8 py-4.5 lg:py-5 text-[var(--ember-text-high)] transition-all duration-300 hover:text-[var(--ember-accent-base)] justify-center font-normal"
              >
                How it works
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="home-media relative h-[420px] sm:h-[480px] lg:h-[560px] xl:h-[620px]"
          >
            <HomeStage2Media
              src={HOME_STAGE2_IMAGES.hero}
              alt="Copy-me play idea from Ember Discover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
