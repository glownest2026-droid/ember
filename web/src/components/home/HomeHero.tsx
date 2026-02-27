'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGE = '/home/hero.png';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--ember-surface-primary)] to-[var(--ember-bg-canvas)]">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1
              className="text-[3.5rem] lg:text-[5rem] xl:text-[5.5rem] leading-[1.05] mb-6 text-[var(--ember-text-high)]"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.02em' }}
            >
              Your proactive
              <br />
              play guide
            </h1>
            <p
              className="text-2xl lg:text-3xl leading-relaxed text-[var(--ember-text-low)] mb-12 max-w-2xl"
              style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
            >
              From bump to big steps — researched ideas for what they&apos;re learning next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center px-8 py-4 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] font-medium"
              >
                Start exploring
              </Link>
              <Link href="#how-ember-works" className="inline-flex items-center gap-2 px-8 py-4 text-[var(--ember-text-high)] text-lg transition-all duration-300 hover:text-[var(--ember-accent-base)] justify-center">
                How it works
                <ArrowRight className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.12)] h-[400px] lg:h-[550px]"
          >
            <Image
              src={HERO_IMAGE}
              alt="Toddler playing with wooden toys"
              className="w-full h-full object-cover"
              width={800}
              height={550}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
