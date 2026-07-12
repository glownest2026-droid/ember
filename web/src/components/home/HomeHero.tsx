'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_STAGE2_IMAGES } from './homeStage2Images';
import { HomeStage2Media } from './HomeStage2Media';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--ember-surface-primary)] to-[var(--ember-bg-canvas)]">
      <div className={`${EMBER_MARKETING_CONTAINER} pt-10 pb-20 lg:pt-14 lg:pb-28`}>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="home-display mb-5 text-[var(--ember-text-high)]">
              Your proactive
              <br />
              play guide
            </h1>
            <p className="home-lead mb-10 max-w-xl">
              From bump to big steps. Over 600 free ideas for what they&apos;re practising next.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/discover"
                className="home-cta inline-flex items-center justify-center px-7 py-3.5 bg-[var(--ember-accent-base)] text-white rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,92,52,0.25)]"
              >
                Start exploring
              </Link>
              <Link
                href="#how-ember-works"
                className="home-link inline-flex items-center gap-2 px-7 py-3.5 text-[var(--ember-text-high)] transition-all duration-300 hover:text-[var(--ember-accent-base)] justify-center font-normal"
              >
                How it works
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="home-media relative h-[360px] lg:h-[480px]"
          >
            <HomeStage2Media
              src={HOME_STAGE2_IMAGES.hero}
              alt="Soft dough and simple tools Stage 2 play idea"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
