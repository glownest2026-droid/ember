'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

const FINAL_IMAGE =
  'https://images.unsplash.com/photo-1758598738003-3c2ea5c8b166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export function HomeFinalCTA() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden py-32 lg:py-40">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F3] to-white" aria-hidden />
      <div className="relative max-w-[90rem] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.2 }}
          >
            <h2
              className="text-5xl lg:text-6xl mb-6 text-[var(--ember-text-high)] leading-[1.05]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              Never behind the curve.
            </h2>
            <p className="text-2xl text-[var(--ember-text-low)] mb-10 leading-relaxed">
              Know what&apos;s next. Buy smart. Move it on.
            </p>
            <Link href="/discover" passHref legacyBehavior>
              <motion.a
                href="/discover"
                whileHover={reducedMotion ? {} : { scale: 1.02, y: -2 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="inline-block px-10 py-5 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_48px_rgba(255,99,71,0.3)] font-semibold"
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
            <Image src={FINAL_IMAGE} alt="Parent reading with child" className="w-full h-full object-cover" width={1080} height={500} sizes="(max-width: 1024px) 100vw, 50vw" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
