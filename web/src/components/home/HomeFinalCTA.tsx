'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';
import { HOME_STAGE2_IMAGES } from './homeStage2Images';
import { HomeStage2Media } from './HomeStage2Media';

export function HomeFinalCTA() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ember-blush)] to-white" aria-hidden />
      <div className="relative max-w-[90rem] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            <h2 className="font-sans text-5xl lg:text-6xl mb-6 text-[var(--ember-text-high)] leading-[1.05] font-bold tracking-[-0.02em]">
              Never behind the curve.
            </h2>
            <p className="font-sans text-2xl text-[var(--ember-text-low)] mb-10 leading-relaxed font-normal">
              Over 600 free ideas. Know what&apos;s next. Buy smart. Move it on.
            </p>
            <Link href="/discover" passHref legacyBehavior>
              <motion.a
                href="/discover"
                whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="inline-block px-10 py-5 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_48px_rgba(255,92,52,0.3)] font-medium"
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
            className="relative rounded-3xl overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.12)] h-[400px] lg:h-[500px]"
          >
            <HomeStage2Media
              src={HOME_STAGE2_IMAGES.finalCta}
              alt="Animal books Stage 2 play idea"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
