'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getProductIconComponent } from '@/lib/icons/productIcon';
import type { ProductIconKey } from '@/lib/icons/productIcon';

const ICON_STROKE_COLOR = '#B8432B';
const FRONT_CARD_BG = '#FF6347';
const MAX_VISIBLE_CARDS = 3;

/** Stable rotation -10..10 from id hash */
function hashToRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return (Math.abs(h) % 21) - 10;
}

export type AlbumItem = {
  id: string;
  title: string;
  subtitle?: string;
  quote: string;
  href?: string;
  imageUrl?: string | null;
  iconKey?: ProductIconKey | string;
};

type AnimatedTestimonialsProps = {
  items: AlbumItem[];
  autoplay?: boolean;
  className?: string;
  renderActions?: (item: AlbumItem, index: number) => React.ReactNode;
};

/** Minimal card for stack: image/icon + Idea N chip only (Aceternity-style: content lives in right column) */
function StackCard({
  item,
  index,
  isFront,
}: {
  item: AlbumItem;
  index: number;
  isFront: boolean;
}) {
  const Icon = getProductIconComponent((item.iconKey as ProductIconKey) || 'drawing-making');
  const iconColor = isFront ? '#ffffff' : ICON_STROKE_COLOR;
  const chipBg = isFront ? 'rgba(255,255,255,0.3)' : 'var(--ember-surface-soft)';
  const chipColor = isFront ? '#ffffff' : 'var(--ember-text-low)';

  return (
    <div
      className={cn(
        'h-full w-full rounded-3xl overflow-hidden flex flex-col',
        'border shadow-md',
        isFront ? 'border-transparent' : 'border-[var(--ember-border-subtle)]'
      )}
      style={{
        backgroundColor: isFront ? FRONT_CARD_BG : 'var(--ember-surface-primary)',
      }}
    >
      <div
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: isFront ? 'rgba(0,0,0,0.06)' : 'var(--ember-surface-soft)',
        }}
      >
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{
              background:
                isFront
                  ? 'linear-gradient(145deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)'
                  : 'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
            }}
          >
            <Icon size={40} strokeWidth={1.5} style={{ color: iconColor }} className="opacity-90" />
          </div>
        )}
      </div>
      <div className="flex-shrink-0 p-2.5 flex justify-center">
        <span
          className="text-[10px] font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: chipBg, color: chipColor, fontFamily: 'var(--font-sans)' }}
        >
          Idea {index + 1}
        </span>
      </div>
    </div>
  );
}

export function AnimatedTestimonials({
  items,
  autoplay = false,
  className,
  renderActions,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const rotations = useMemo(() => items.map((it) => hashToRotation(it.id)), [items]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % Math.max(1, items.length));
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
  };

  useEffect(() => {
    if (autoplay && items.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, items.length]);

  if (!items.length) return null;

  const current = items[active];
  const n = items.length;

  const visibleIndices = Array.from(
    { length: Math.min(MAX_VISIBLE_CARDS, n) },
    (_, i) => (active + i) % n
  );

  const SPREAD_X = 14;
  const SPREAD_Y = 10;
  const SCALE_STEP = 0.06;
  const ROTATE_STEP = 4;

  const titleHref = current.href && current.href !== '#' ? current.href : undefined;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0', className)}>
      {/* Left: contained stack only — max 3 cards, image + chip per card */}
      <div className="min-w-0 overflow-hidden">
        <div className="relative h-72 md:h-[340px] w-full min-w-0 overflow-hidden pl-8 md:pl-10">
          <AnimatePresence initial={false}>
            {visibleIndices.map((index, slot) => {
              const item = items[index];
              const stackOffset = slot;
              const isFront = stackOffset === 0;
              const z = MAX_VISIBLE_CARDS - stackOffset;
              const x = prefersReducedMotion ? 0 : -stackOffset * SPREAD_X;
              const y = prefersReducedMotion ? 0 : -stackOffset * SPREAD_Y;
              const scale = 1 - stackOffset * SCALE_STEP;
              const rotate = prefersReducedMotion ? 0 : -stackOffset * ROTATE_STEP + (rotations[index] ?? 0) * 0.35;
              const opacity = isFront ? 1 : (stackOffset === 1 ? 0.82 : 0.65);

              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 origin-bottom"
                  style={{ zIndex: z }}
                  initial={false}
                  animate={{
                    x,
                    y,
                    scale,
                    opacity: prefersReducedMotion ? (isFront ? 1 : 0.75) : opacity,
                    rotate,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0.1 : 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <StackCard item={item} index={index} isFront={isFront} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: title, quote (full), nav, CTAs — Aceternity-style separation */}
      <div className="flex flex-col gap-3 min-w-0">
        <div className="min-w-0">
          {titleHref ? (
            <a
              href={titleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium leading-snug hover:underline block"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              {current.title}
            </a>
          ) : (
            <h3
              className="text-base font-medium leading-snug"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              {current.title}
            </h3>
          )}
        </div>
        <div
          className="text-sm leading-relaxed min-h-0"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          {prefersReducedMotion ? (
            current.quote
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="break-words"
              >
                {current.quote.split(/\s+/).map((word, i) => (
                  <motion.span
                    key={`${current.id}-w-${i}`}
                    initial={{ filter: 'blur(6px)', opacity: 0.5 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.02,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            className="rounded-full p-2 border shrink-0"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <span className="text-xs text-[var(--ember-text-low)]">
            {active + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full p-2 border shrink-0"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {renderActions && (
          <div className="flex flex-wrap gap-2">
            {renderActions(current, active)}
          </div>
        )}
      </div>
    </div>
  );
}
