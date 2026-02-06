'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { getProductIconComponent } from '@/lib/icons/productIcon';
import type { ProductIconKey } from '@/lib/icons/productIcon';

const ICON_STROKE_COLOR = '#B8432B';

/** Stable rotation -10..10 from id hash so same item always same angle */
function hashToRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return (Math.abs(h) % 21) - 10;
}

/** Very subtle neutral tint for behind cards (porcelain) from id */
function subtleTintStyle(id: string): React.CSSProperties {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  const t = 0.02 + (Math.abs(h) % 100) / 100 * 0.03;
  return { backgroundColor: `rgba(140, 130, 120, ${t})` };
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
  /** CTAs for the active item, rendered in right column outside the card */
  renderActions?: (item: AlbumItem, index: number) => React.ReactNode;
};

/** Self-contained card: icon/image + Idea N chip + title + why (blur inside when motion on) */
function ProductAlbumCard({
  item,
  index,
  prefersReducedMotion,
  isBehind,
}: {
  item: AlbumItem;
  index: number;
  prefersReducedMotion: boolean;
  isBehind: boolean;
}) {
  const Icon = getProductIconComponent((item.iconKey as ProductIconKey) || 'drawing-making');
  const tintStyle = isBehind ? subtleTintStyle(item.id) : undefined;

  return (
    <div
      className={cn(
        'h-full w-full rounded-3xl overflow-hidden flex flex-col',
        'border border-[var(--ember-border-subtle)] shadow-lg',
        'bg-[var(--ember-surface-primary)]'
      )}
      style={tintStyle}
    >
      {/* Top: image or icon tile */}
      <div className="relative h-24 sm:h-28 flex-shrink-0 overflow-hidden bg-[var(--ember-surface-soft)]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
            }}
          >
            <Icon
              size={36}
              strokeWidth={1.5}
              style={{ color: ICON_STROKE_COLOR }}
              className="opacity-90"
            />
          </div>
        )}
      </div>

      {/* Content: chip + title + why */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--ember-surface-soft)',
              color: 'var(--ember-text-low)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Idea {index + 1}
          </span>
        </div>
        <h3
          className="text-sm font-medium line-clamp-2 leading-snug flex-shrink-0"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
        >
          {item.title}
        </h3>
        <div
          className="text-xs leading-relaxed line-clamp-3 min-h-0 overflow-hidden"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          {prefersReducedMotion ? (
            item.quote
          ) : (
            item.quote.split(/\s+/).map((word, i) => (
              <motion.span
                key={`${item.id}-w-${i}`}
                initial={{ filter: 'blur(6px)', opacity: 0.5 }}
                animate={{ filter: 'blur(0px)', opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.025,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="inline"
              >
                {word}&nbsp;
              </motion.span>
            ))
          )}
        </div>
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

  const rotations = useMemo(
    () => items.map((it) => hashToRotation(it.id)),
    [items]
  );

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
  const BEHIND_Y = 14;
  const BEHIND_SCALE = 0.95;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0', className)}>
      {/* Left: stacked cards — Aceternity-style tease */}
      <div className="relative h-80 md:h-[360px] w-full min-w-0">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const isActiveItem = index === active;
            const z = isActiveItem ? items.length + 10 : Math.max(0, items.length - index);
            const rotateY = isActiveItem ? 0 : rotations[index] ?? 0;
            const scale = isActiveItem ? 1 : BEHIND_SCALE;
            const yOffset = prefersReducedMotion ? 0 : isActiveItem ? 0 : (index - active) * BEHIND_Y;
            const opacity = index <= active ? (isActiveItem ? 1 : 0.7) : 0.4;

            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 origin-bottom"
                style={{ zIndex: z }}
                initial={false}
                animate={{
                  y: yOffset,
                  scale,
                  opacity: prefersReducedMotion ? (isActiveItem ? 1 : 0.6) : opacity,
                  rotateY: prefersReducedMotion ? 0 : rotateY,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <ProductAlbumCard
                  item={item}
                  index={index}
                  prefersReducedMotion={prefersReducedMotion}
                  isBehind={!isActiveItem}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Right: nav + CTAs only (title/why are inside the card) */}
      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-between gap-2">
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
          <div className="flex flex-wrap gap-2 mt-1">
            {renderActions(current, active)}
          </div>
        )}
      </div>
    </div>
  );
}
