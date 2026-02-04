'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Circle,
  Blocks,
  Puzzle,
  Car,
  Music,
  Pencil,
  Shapes,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const ICON_ACCENT = '#B8432B';
const CANVAS = '#FAFAFA';
const SURFACE = '#FFFFFF';
const SOFT = '#F1F3F2';
const BORDER = '#E5E7EB';
const TEXT_HIGH = '#1A1E23';
const TEXT_LOW = '#5C646D';
const SHADOW = '0px 4px 24px rgba(0,0,0,0.04)';

export interface AnimatedProductAlbumItem {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  focusLabel?: string | null;
  ageBandLabel?: string | null;
  brand?: string | null;
  url?: string | null;
}

function pickIconForProductTitle(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (/\b(book|story|noisy|picture)\b/.test(t)) return BookOpen;
  if (/\bball\b/.test(t)) return Circle;
  if (/\b(blocks|stack|bricks)\b/.test(t)) return Blocks;
  if (/\bpuzzle\b/.test(t)) return Puzzle;
  if (/\b(train|car)\b/.test(t)) return Car;
  if (/\b(music|xylophone|drum)\b/.test(t)) return Music;
  if (/\b(paint|crayon|marker)\b/.test(t)) return Pencil;
  return Shapes;
}

interface AnimatedProductAlbumProps {
  items: AnimatedProductAlbumItem[];
  autoplay?: boolean;
  signinUrl?: (productId?: string) => string;
}

export default function AnimatedProductAlbum({
  items,
  autoplay = false,
  signinUrl,
}: AnimatedProductAlbumProps) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const safeIndex = items.length > 0 ? index % items.length : 0;
  const current = items[safeIndex];

  const onPrev = useCallback(() => {
    setIndex((i) => (items.length > 0 ? (i - 1 + items.length) % items.length : 0));
  }, [items.length]);

  const onNext = useCallback(() => {
    setIndex((i) => (items.length > 0 ? (i + 1) % items.length : 0));
  }, [items.length]);

  useEffect(() => {
    if (!autoplay || items.length <= 1 || reducedMotion) return;
    const id = setInterval(onNext, 4000);
    return () => clearInterval(id);
  }, [autoplay, items.length, onNext, reducedMotion]);

  if (items.length === 0) {
    return (
      <section
        className="rounded-2xl border p-6 text-center"
        style={{
          backgroundColor: SURFACE,
          borderColor: BORDER,
          boxShadow: SHADOW,
        }}
        aria-label="Product album"
      >
        <p className="text-sm m-0" style={{ fontFamily: 'var(--font-sans)', color: TEXT_LOW }}>
          No ideas in this set yet. Try another focus or age band.
        </p>
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-4"
      aria-label="Product album"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="relative flex items-center justify-center min-h-[320px]">
        {/* Stack: back cards (inactive) */}
        {!reducedMotion && items.length > 1 && (
          <>
            {[1, 2].map((offset) => {
              const stackIndex = (safeIndex - offset + items.length) % items.length;
              const item = items[stackIndex];
              if (!item) return null;
              const Icon = pickIconForProductTitle(item.title);
              return (
                <motion.div
                  key={`stack-${item.id}-${stackIndex}`}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={false}
                  style={{ zIndex: 1 }}
                >
                  <motion.div
                    className="w-full max-w-[340px] rounded-2xl border p-4 opacity-90"
                    style={{
                      backgroundColor: SURFACE,
                      borderColor: BORDER,
                      boxShadow: SHADOW,
                      transform: `translateY(${offset * 8}px) rotate(${offset === 1 ? -2 : -4}deg) scale(0.96)`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} strokeWidth={1.5} style={{ color: ICON_ACCENT }} />
                      <span className="text-xs" style={{ color: TEXT_LOW }}>Idea {stackIndex + 1}</span>
                    </div>
                    <p className="text-sm font-medium line-clamp-2 leading-snug" style={{ color: TEXT_HIGH }}>
                      {item.title}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </>
        )}

        {/* Active card */}
        <AnimatePresence mode="wait" initial={false}>
          {current && (
            <motion.div
              key={current.id}
              className="relative w-full max-w-[340px] z-10"
              initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.96, y: -8 }}
              transition={{
                duration: reducedMotion ? 0 : 0.35,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <article
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor: SURFACE,
                  borderColor: BORDER,
                  boxShadow: SHADOW,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {(() => {
                    const Icon = pickIconForProductTitle(current.title);
                    return (
                      <>
                        <Icon size={18} strokeWidth={1.5} style={{ color: ICON_ACCENT }} />
                        <span className="text-xs" style={{ color: TEXT_LOW }}>
                          Idea {safeIndex + 1}
                        </span>
                      </>
                    );
                  })()}
                </div>
                <h3
                  className="text-sm font-medium line-clamp-2 leading-snug mb-2"
                  style={{ color: TEXT_HIGH }}
                  title={current.title}
                >
                  {current.title}
                </h3>
                <div className="min-h-[2.5rem] mb-3">
                  {current.subtitle ? (
                    reducedMotion ? (
                      <p className="text-xs line-clamp-2 leading-snug" style={{ color: TEXT_LOW }}>
                        {current.subtitle}
                      </p>
                    ) : (
                      <WordBlurReveal text={current.subtitle} />
                    )
                  ) : (
                    <p className="text-xs line-clamp-2 leading-snug" style={{ color: TEXT_LOW }}>
                      Chosen for this age and focus.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {current.ageBandLabel && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: SOFT, color: TEXT_LOW }}
                    >
                      Best for: {current.ageBandLabel}
                    </span>
                  )}
                  {current.focusLabel && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: SOFT, color: TEXT_LOW }}
                    >
                      Focus: {current.focusLabel}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {signinUrl && (
                    <Link
                      href={signinUrl(current.id)}
                      className="flex-1 min-h-[36px] rounded-lg border font-medium text-xs flex items-center justify-center"
                      style={{
                        borderColor: BORDER,
                        backgroundColor: SURFACE,
                        color: TEXT_HIGH,
                      }}
                    >
                      Save to my list
                    </Link>
                  )}
                  {current.url && current.url !== '#' && (
                    <a
                      href={current.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] px-3 rounded-lg border font-medium text-xs flex items-center justify-center"
                      style={{
                        borderColor: BORDER,
                        backgroundColor: SURFACE,
                        color: TEXT_HIGH,
                      }}
                    >
                      View
                    </a>
                  )}
                </div>
              </article>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-lg border p-2 flex items-center justify-center transition-colors hover:bg-[var(--ember-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D44D31]"
            style={{ borderColor: BORDER }}
            aria-label="Previous idea"
          >
            <ChevronLeft size={20} strokeWidth={1.5} style={{ color: ICON_ACCENT }} />
          </button>
          <span className="text-xs" style={{ color: TEXT_LOW }}>
            {safeIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg border p-2 flex items-center justify-center transition-colors hover:bg-[var(--ember-surface-soft)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D44D31]"
            style={{ borderColor: BORDER }}
            aria-label="Next idea"
          >
            <ChevronRight size={20} strokeWidth={1.5} style={{ color: ICON_ACCENT }} />
          </button>
        </div>
      )}
    </section>
  );
}

function WordBlurReveal({ text }: { text: string }) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <p className="text-xs line-clamp-2 leading-snug flex flex-wrap gap-x-1" style={{ color: TEXT_LOW }}>
      {words.map((word, i) => (
        <motion.span
          key={`${i}-${word}`}
          initial={{ filter: 'blur(6px)', opacity: 0.4 }}
          animate={{ filter: 'blur(0px)', opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
