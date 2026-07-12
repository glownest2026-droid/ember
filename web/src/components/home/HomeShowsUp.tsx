'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Eye, Bookmark, Store, ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const CARDS = [
  {
    icon: Eye,
    title: 'Discover',
    body: 'Over 600 free ideas across the first three years. Built around their stage, not a product catalogue.',
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
    href: '/marketplace',
  },
];

export function HomeShowsUp() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="bg-[var(--ember-surface-primary)] py-20 lg:py-28">
      <div className="max-w-[90rem] mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="max-w-6xl mb-12"
        >
          <h2 className="home-section-title mb-3 text-[var(--ember-text-high)]">
            How it shows up.
          </h2>
          <p className="home-section-lead max-w-xl">
            Three simple places built around your family&apos;s journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: 0.1 + i * 0.1 }}
              className="group"
            >
              <div className="bg-[var(--ember-bg-canvas)] rounded-[20px] border border-[var(--ember-border-subtle)] p-7 lg:p-8 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--ember-border-subtle)] flex items-center justify-center mb-5 shadow-sm">
                  <card.icon className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
                </div>
                <h3 className="home-card-title mb-2 text-[var(--ember-text-high)]">{card.title}</h3>
                <p className="home-body mb-5">{card.body}</p>
                <Link
                  href={card.href}
                  className="home-link text-[var(--ember-accent-base)] transition-all duration-300 hover:text-[var(--ember-accent-hover)] inline-flex items-center gap-2 group-hover:gap-3"
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
