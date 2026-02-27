'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Eye, Bookmark, Store, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const CARDS = [
  {
    icon: Eye,
    title: 'Discover',
    body: 'See what your child is practising now. Built around their stage, not products.',
    cta: 'See what\'s next',
    href: '/discover',
  },
  {
    icon: Bookmark,
    title: 'My List',
    body: "Ideas you've saved. Everything in one place, ready when you are.",
    cta: 'View list',
    href: '/family',
  },
  {
    icon: Store,
    title: 'Marketplace',
    body: 'Pass items on locally and safely. Match with the next family who needs them.',
    cta: 'Explore marketplace',
    href: '/products',
  },
];

export function HomeShowsUp() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="bg-[var(--ember-surface-primary)] py-24 lg:py-32">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="max-w-6xl mb-16"
        >
          <h2
            className="text-4xl lg:text-5xl mb-6 text-[var(--ember-text-high)]"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            How it shows up.
          </h2>
          <p className="text-xl lg:text-2xl text-[var(--ember-text-low)] max-w-2xl">
            Three simple places built around your family&apos;s journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.1 + i * 0.1 }}
              className="group"
            >
              <div className="bg-[var(--ember-bg-canvas)] rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:shadow-[0px_8px_32px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[var(--ember-border-subtle)] flex items-center justify-center mb-6 shadow-sm">
                  <card.icon className="w-7 h-7 text-[var(--ember-accent-base)]" strokeWidth={2} />
                </div>
                <h3
                  className="text-2xl mb-3 text-[var(--ember-text-high)]"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 400 }}
                >
                  {card.title}
                </h3>
                <p className="text-lg text-[var(--ember-text-low)] leading-relaxed mb-6">{card.body}</p>
                <Link
                  href={card.href}
                  className="text-[var(--ember-accent-base)] transition-all duration-300 hover:text-[var(--ember-accent-hover)] flex items-center gap-2 group-hover:gap-3 font-semibold"
                >
                  {card.cta}
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
