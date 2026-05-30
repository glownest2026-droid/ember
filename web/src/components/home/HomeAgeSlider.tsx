'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

// Mirrors the /discover age-band taxonomy so the homepage slider and the core
// experience stay in sync. `month` is the band midpoint used to resolve /discover.
const AGE_BANDS = [
  { month: 24, label: '23–25 months', displayShort: '23–25m' },
  { month: 26, label: '25–27 months', displayShort: '25–27m' },
  { month: 29, label: '28–30 months', displayShort: '28–30m' },
  { month: 32, label: '31–33 months', displayShort: '31–33m' },
  { month: 35, label: '34–36 months', displayShort: '34–36m' },
];

export function HomeAgeSlider() {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const reducedMotion = useReducedMotion() ?? false;
  const lastIndex = AGE_BANDS.length - 1;
  const selectedBand = AGE_BANDS[selectedIndex] ?? AGE_BANDS[0];
  const currentAgeLabel = selectedBand.label;
  const progressPct = (selectedIndex / lastIndex) * 100;
  const discoverHref = `/discover/${selectedBand.month}`;

  return (
    <section className="bg-[var(--ember-surface-primary)] border-y border-[var(--ember-border-subtle)]">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <p className="text-lg text-[var(--ember-text-low)] mb-2">My toddler&apos;s current age</p>
            <motion.p
              key={selectedIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
              className="text-3xl lg:text-4xl text-[var(--ember-text-high)]"
              style={{ fontWeight: 600 }}
            >
              {currentAgeLabel}
            </motion.p>
          </div>

          <div className="mb-10">
            <div className="relative">
              <div className="relative h-2 bg-[var(--ember-surface-soft)] rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--ember-accent-base)] to-[#FF8870] rounded-full"
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={lastIndex}
                step={1}
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
                aria-label="Select age range"
              />
              <motion.div
                className="absolute top-1/2 w-6 h-6 bg-white border-4 border-[var(--ember-accent-base)] rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.15)] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                initial={false}
                animate={{ left: `${progressPct}%` }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
              />
            </div>

            <div className="relative mt-6 h-12">
              {AGE_BANDS.map((band, index) => {
                const pct = (index / lastIndex) * 100;
                const active = index === selectedIndex;
                return (
                  <button
                    key={band.month}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-200"
                    style={{ left: `${pct}%` }}
                    aria-label={band.label}
                  >
                    <div
                      className={`w-1 h-3 rounded-full mb-2 transition-all ${
                        active ? 'bg-[var(--ember-accent-base)] h-4' : 'bg-[var(--ember-border-subtle)]'
                      }`}
                    />
                    <span
                      className={`text-xs whitespace-nowrap transition-all ${
                        active
                          ? 'text-[var(--ember-accent-base)] font-semibold'
                          : 'text-[var(--ember-text-low)]'
                      }`}
                    >
                      {band.displayShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <Link href={discoverHref} passHref legacyBehavior>
              <motion.a
                href={discoverHref}
                whileHover={reducedMotion ? {} : { scale: 1.02 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--ember-accent-base)] text-white text-lg rounded-xl transition-all duration-300 hover:bg-[var(--ember-accent-hover)] hover:shadow-[0px_12px_40px_rgba(255,99,71,0.35)]"
                style={{ fontWeight: 600 }}
              >
                Begin your journey
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.a>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
