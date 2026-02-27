'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

const AGE_RANGES = [
  { value: 0, label: '0–3 months', displayShort: '0–3m' },
  { value: 3, label: '3–6 months', displayShort: '3–6m' },
  { value: 6, label: '6–9 months', displayShort: '6–9m' },
  { value: 9, label: '9–12 months', displayShort: '9–12m' },
  { value: 12, label: '12–15 months', displayShort: '12–15m' },
  { value: 15, label: '15–18 months', displayShort: '15–18m' },
  { value: 18, label: '18–21 months', displayShort: '18–21m' },
  { value: 21, label: '21–24 months', displayShort: '21–24m' },
  { value: 24, label: '24–27 months', displayShort: '24–27m' },
  { value: 27, label: '27–30 months', displayShort: '27–30m' },
  { value: 30, label: '30–33 months', displayShort: '30–33m' },
  { value: 33, label: '33–36 months', displayShort: '33–36m' },
];

export function HomeAgeSlider() {
  const [ageRange, setAgeRange] = useState(6);
  const reducedMotion = useReducedMotion() ?? false;
  const currentAgeLabel = AGE_RANGES.find((r) => r.value === ageRange)?.label ?? '6–9 months';

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
              key={ageRange}
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
                  initial={{ width: '0%' }}
                  animate={{ width: `${(ageRange / 33) * 100}%` }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={33}
                step={3}
                value={ageRange}
                onChange={(e) => setAgeRange(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
                aria-label="Select age range"
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-[var(--ember-accent-base)] rounded-full shadow-[0px_4px_12px_rgba(0,0,0,0.15)] pointer-events-none"
                initial={{ left: '0%' }}
                animate={{ left: `${(ageRange / 33) * 100}%` }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
                style={{ marginLeft: '-12px' }}
              />
            </div>

            <div className="relative mt-6 px-3">
              <div className="flex justify-between items-start">
                {AGE_RANGES.map((range, index) => (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() => setAgeRange(range.value)}
                    className={`flex flex-col items-center transition-all duration-200 ${
                      index % 2 === 0 ? 'block' : 'hidden sm:flex'
                    }`}
                    aria-label={range.label}
                  >
                    <div
                      className={`w-1 h-3 rounded-full mb-2 transition-all ${
                        ageRange === range.value ? 'bg-[var(--ember-accent-base)] h-4' : 'bg-[var(--ember-border-subtle)]'
                      }`}
                    />
                    <span
                      className={`text-xs transition-all ${
                        ageRange === range.value
                          ? 'text-[var(--ember-accent-base)] font-semibold'
                          : 'text-[var(--ember-text-low)]'
                      }`}
                    >
                      {range.displayShort}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/discover" passHref legacyBehavior>
              <motion.a
                href="/discover"
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
