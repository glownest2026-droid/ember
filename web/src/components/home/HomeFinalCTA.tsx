'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import { HOME_STAGE2_IMAGES } from './homeStage2Images';
import { HomeStage2Media } from './HomeStage2Media';
import { EMBER_MARKETING_CONTAINER } from '@/lib/marketing/layout';

export function HomeFinalCTA() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ember-blush)] to-white" aria-hidden />
      <div className={`relative ${EMBER_MARKETING_CONTAINER}`}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            <h2 className="home-section-title mb-4 text-[var(--ember-text-high)]">
              Never behind the curve.
            </h2>
            <p className="home-section-lead mb-8">
              Over 600 free ideas. Know what&apos;s next. Find what fits. Move it on.
            </p>
            <Link href="/discover" passHref legacyBehavior>
              <motion.a
                href="/discover"
                whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="home-cta inline-block px-8 py-4 bg-[var(--ember-accent-base)] text-white rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_40px_rgba(255,92,52,0.25)]"
              >
                See what&apos;s next
              </motion.a>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6 }}
            className="home-media relative h-[360px] lg:h-[440px]"
          >
            <HomeStage2Media
              src={HOME_STAGE2_IMAGES.finalCta}
              alt="Choking-aware meal setup Stage 2 idea"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
