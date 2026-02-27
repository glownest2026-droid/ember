'use client';

import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const BULLETS = [
  'We explain why something matters at this stage.',
  'We compare new and pre-loved options.',
  'We only use the data we need.',
  'Safety rules are built in.',
];

export function HomeHowWeChoose() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="max-w-[90rem] mx-auto px-6 lg:px-12 py-24 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: reducedMotion ? 0 : 0.7 }}
        className="max-w-5xl mx-auto text-center"
      >
        <div className="bg-[var(--ember-surface-soft)] rounded-[3rem] p-12 lg:p-20 border-2 border-[var(--ember-border-subtle)]">
          <h2
            className="text-4xl lg:text-5xl mb-12 text-[var(--ember-text-high)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            How we choose.
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mb-10">
            {BULLETS.map((text) => (
              <div key={text} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--ember-accent-base)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
                </div>
                <p className="text-lg text-[var(--ember-text-high)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <a
            href="/discover#safety"
            className="text-[var(--ember-text-low)] hover:text-[var(--ember-accent-base)] transition-colors underline"
          >
            See our safety rules
          </a>
        </div>
      </motion.div>
    </section>
  );
}
