'use client';

import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1509781827353-fb95c262fc40?w=1080&q=80';

function curatedLabel(displayLabel: string | null, gender: string | null): string {
  const name = displayLabel?.trim() || null;
  if (name) return `Curated for ${name}`;
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'Curated for your son';
  if (g === 'female' || g === 'girl' || g === 'f') return 'Curated for your daughter';
  return 'Curated for your family';
}

function supportTail(gender: string | null | undefined): string {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'male' || g === 'boy' || g === 'm') return 'him';
  if (g === 'female' || g === 'girl' || g === 'f') return 'her';
  return 'them';
}

export function DiscoverFigmaChildHero({
  childDisplayLabel,
  childGender,
  monthAge,
  heroImageUrl,
}: {
  childDisplayLabel: string | null;
  childGender?: string | null;
  monthAge: number;
  heroImageUrl?: string | null;
}) {
  const name = childDisplayLabel?.trim() || null;
  const curated = curatedLabel(childDisplayLabel, childGender ?? null);
  const tail = supportTail(childGender ?? null);
  const headline = name ? `What ${name} is learning right now` : 'What your child is learning right now';
  const sub =
    name ?
      `At ${monthAge} months, ${name} is building skills that match this stage. Here's what matters most—and how to support ${tail}.`
    : `At ${monthAge} months, your child is building skills that match this stage. Here's what matters most—and how to support ${tail}.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8 lg:mb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 lg:gap-12 items-center">
        <div>
          <div
            className="inline-block px-3 py-1 rounded-full mb-3 lg:mb-4"
            style={{ backgroundColor: 'rgba(255, 99, 71, 0.12)' }}
          >
            <span className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)]">{curated}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-medium text-[var(--ember-text-high)] mb-2 lg:mb-4 leading-tight">{headline}</h1>
          <p className="text-[var(--ember-text-low)] text-base lg:text-lg mb-3 lg:mb-4 leading-relaxed">{sub}</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm lg:text-base text-[var(--ember-accent-base)] hover:text-[var(--ember-accent-hover)] transition-colors font-medium"
          >
            <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5" aria-hidden />
            How Ember works
          </Link>
        </div>
        <div className="relative h-40 lg:h-72 rounded-3xl overflow-hidden shadow-xl order-first lg:order-last ring-1 ring-black/5">
          <DiscoverFigmaImage
            src={heroImageUrl || HERO_FALLBACK}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ember-accent-base)]/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}
