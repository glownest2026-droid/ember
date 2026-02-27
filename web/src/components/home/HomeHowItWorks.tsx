'use client';

import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { Lightbulb, ShoppingBag, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';

const EMBER_LOGO = 'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const CARDS = [
  {
    icon: Lightbulb,
    title: 'Know it',
    body: 'We show what your child is practising right now — and what matters next. Clear explanations. No overwhelm.',
  },
  {
    icon: ShoppingBag,
    title: 'Buy it',
    body: 'A short set of ideas that fit this stage. The latest retailer offers that pass our review tests. Buy what you need, or add to your gift list for helpful family purchases.',
  },
  {
    icon: RefreshCw,
    title: 'Move it',
    body: "When it's outgrown, pass it on safely. We help match it with the next family who needs it.",
  },
];

export function HomeHowItWorks() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section id="how-ember-works" className="relative overflow-hidden bg-[var(--ember-surface-primary)]">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl lg:text-5xl xl:text-6xl mb-6 text-[var(--ember-text-high)] leading-[1.1]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.02em' }}
          >
            How Ember Works.
          </h2>
          <p className="text-xl lg:text-2xl text-[var(--ember-text-low)] max-w-3xl mx-auto">
            We help you know what matters now.
            <br />
            Choose what fits this stage, then pass it on when the time comes.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reducedMotion ? 0 : 0.8 }}
            className="relative lg:h-[600px] flex items-center justify-center py-12 lg:py-0"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[500px] aspect-square">
              {!reducedMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#gradient-how)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <defs>
                      <linearGradient id="gradient-how" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--ember-accent-base)" />
                        <stop offset="100%" stopColor="var(--ember-accent-base)" stopOpacity="0.5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </motion.div>
              )}

              <NodeBox icon={Lightbulb} label="Know it" delay={0.2} reducedMotion={!!reducedMotion} position="top" />
              <NodeBox icon={ShoppingBag} label="Buy it" delay={0.4} reducedMotion={!!reducedMotion} position="bottomRight" />
              <NodeBox icon={RefreshCw} label="Move it" delay={0.6} reducedMotion={!!reducedMotion} position="bottomLeft" />

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
                <defs>
                  <marker id="arrowhead-how" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="var(--ember-accent-base)" opacity="0.5" />
                  </marker>
                </defs>
                {!reducedMotion && (
                  <>
                    <motion.path
                      d="M 280 120 Q 350 200 380 330"
                      fill="none"
                      stroke="var(--ember-accent-base)"
                      strokeWidth="2"
                      opacity="0.3"
                      markerEnd="url(#arrowhead-how)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 1.2, repeat: Infinity, repeatDelay: 8 }}
                    />
                    <motion.path
                      d="M 320 380 Q 250 420 180 380"
                      fill="none"
                      stroke="var(--ember-accent-base)"
                      strokeWidth="2"
                      opacity="0.3"
                      markerEnd="url(#arrowhead-how)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 4.8, repeat: Infinity, repeatDelay: 8 }}
                    />
                    <motion.path
                      d="M 150 320 Q 120 200 220 120"
                      fill="none"
                      stroke="var(--ember-accent-base)"
                      strokeWidth="2"
                      opacity="0.3"
                      markerEnd="url(#arrowhead-how)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 8.4, repeat: Infinity, repeatDelay: 8 }}
                    />
                  </>
                )}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Image src={EMBER_LOGO} alt="" className="h-14 sm:h-20 lg:h-24 w-auto mx-auto mb-1 sm:mb-2 opacity-30" width={96} height={96} />
                  <p className="text-xs sm:text-sm text-[var(--ember-text-low)]" style={{ fontWeight: 500 }}>
                    One calm loop
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: reducedMotion ? 0 : 0.6, delay: 0.1 + i * 0.1 }}
                className="bg-[var(--ember-bg-canvas)] rounded-3xl p-8 lg:p-10 border border-[var(--ember-border-subtle)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center">
                    <card.icon className="w-7 h-7 text-[var(--ember-accent-base)]" strokeWidth={2} />
                  </div>
                  <h3
                    className="text-2xl lg:text-3xl text-[var(--ember-text-high)]"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}
                  >
                    {card.title}
                  </h3>
                </div>
                <p className="text-lg lg:text-xl leading-relaxed text-[var(--ember-text-low)]">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeBox({
  icon: Icon,
  label,
  delay,
  reducedMotion,
  position,
}: {
  icon: LucideIcon;
  label: string;
  delay: number;
  reducedMotion: boolean;
  position: 'top' | 'bottomLeft' | 'bottomRight';
}) {
  const posClass =
    position === 'top'
      ? 'top-[2%] sm:top-[5%] left-1/2 -translate-x-1/2'
      : position === 'bottomRight'
        ? 'bottom-[12%] sm:bottom-[15%] right-[2%] sm:right-[8%]'
        : 'bottom-[12%] sm:bottom-[15%] left-[2%] sm:left-[8%]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reducedMotion ? 0 : 0.5, delay }}
      className={`absolute ${posClass}`}
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-2xl sm:rounded-3xl bg-white border-2 border-[var(--ember-border-subtle)] flex flex-col items-center justify-center gap-2 sm:gap-3 shadow-[0px_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0px_12px_48px_rgba(255,99,71,0.2)] hover:scale-105">
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--ember-accent-base)]" strokeWidth={2} />
        </div>
        <span className="text-sm sm:text-base text-[var(--ember-text-high)]" style={{ fontWeight: 500 }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
