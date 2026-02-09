'use client';

import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const SWIPE_THRESHOLD_PX = 40;
import { getProductIconComponent } from '@/lib/icons/productIcon';
import type { ProductIconKey } from '@/lib/icons/productIcon';

const ICON_STROKE_COLOR = '#B8432B';
const MAX_VISIBLE = 12;

/** Deterministic rotation -10..10 from id hash (no random per render). */
function hashToRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return (Math.abs(h) % 21) - 10;
}

export type AlbumItem = {
  id: string;
  title: string;
  subtitle?: string;
  /** One-line why-it-fits for the face (skimmable) */
  quote: string;
  /** Optional long text for "More details" drawer */
  longDescription?: string;
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

/** Card face: image or premium icon tile (white surface, subtle border, deep ember stroke). */
function StackCard({
  item,
  index,
  isActive,
}: {
  item: AlbumItem;
  index: number;
  isActive: boolean;
}) {
  const Icon = getProductIconComponent((item.iconKey as ProductIconKey) || 'drawing-making');
  const iconColor = ICON_STROKE_COLOR;
  const chipBg = 'var(--ember-surface-soft)';
  const chipColor = 'var(--ember-text-low)';

  return (
    <div
      className={cn(
        'h-full w-full rounded-3xl overflow-hidden flex flex-col',
        'border shadow-md border-[var(--ember-border-subtle)]'
      )}
      style={{
        backgroundColor: 'var(--ember-surface-primary)',
      }}
    >
      <div
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: 'var(--ember-surface-soft)' }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center"
            style={{
              background:
                'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
            }}
          >
            <Icon
              size={40}
              strokeWidth={1.5}
              style={{ color: iconColor }}
              className="opacity-90"
            />
          </div>
        )}
      </div>
      <div className="flex-shrink-0 p-2.5 flex justify-center">
        <span
          className="text-[10px] font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: chipBg,
            color: chipColor,
            fontFamily: 'var(--font-sans)',
          }}
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const rotations = useMemo(
    () => items.map((it) => hashToRotation(it.id)),
    [items]
  );

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % Math.max(1, items.length));
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
  }, [items.length]);

  const isActive = (index: number) => index === active;

  const swipeStart = useRef<{ x: number; isTouch: boolean } | null>(null);
  const handleSwipeStart = useCallback((x: number, isTouch: boolean) => {
    swipeStart.current = { x, isTouch };
  }, []);
  const handleSwipeEnd = useCallback(
    (x: number, isTouch: boolean) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start || start.isTouch !== isTouch || items.length <= 1) return;
      const delta = x - start.x;
      if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
        if (delta > 0) handlePrev();
        else handleNext();
      }
    },
    [items.length, handlePrev, handleNext]
  );
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) handleSwipeStart(e.touches[0].clientX, true);
    },
    [handleSwipeStart]
  );
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length === 1) handleSwipeEnd(e.changedTouches[0].clientX, true);
    },
    [handleSwipeEnd]
  );
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 0) handleSwipeStart(e.clientX, false);
    },
    [handleSwipeStart]
  );
  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.button === 0) handleSwipeEnd(e.clientX, false);
    },
    [handleSwipeEnd]
  );

  useEffect(() => {
    if (autoplay && items.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, items.length]);

  useEffect(() => {
    setDetailsOpen(false);
  }, [active]);

  if (!items.length) return null;

  const current = items[active];
  const n = items.length;
  const titleHref =
    current.href && current.href !== '#' ? current.href : undefined;

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-4xl min-w-0 font-sans antialiased',
        'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20',
        className
      )}
    >
      {/* Left: Aceternity-style stacked cards, one active with bounce; swipe/drag to change */}
      <div className="relative min-w-0">
        <div
          className="relative h-80 w-full min-w-0 touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={() => { swipeStart.current = null; }}
        >
          <AnimatePresence initial={false}>
            {items.slice(0, MAX_VISIBLE).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: shouldReduceMotion ? 0 : rotations[index] ?? 0,
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) || shouldReduceMotion ? 0 : rotations[index] ?? 0,
                  zIndex: isActive(index) ? 40 : Math.max(0, n + 2 - index),
                  y: isActive(index) && !shouldReduceMotion ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: shouldReduceMotion ? 0 : rotations[index] ?? 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.4,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 origin-bottom"
              >
                <StackCard
                  item={item}
                  index={index}
                  isActive={isActive(index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: title, snippet, nav, CTAs — stable, no jump */}
      <div className="flex flex-col justify-between py-4 min-w-0">
        <motion.div
          key={current.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.05 : 0.2,
            ease: 'easeInOut',
          }}
        >
          <h3
            className="text-xl md:text-2xl font-bold leading-snug"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--ember-text-high)',
            }}
          >
            {current.title}
          </h3>
          {current.subtitle && (
            <p
              className="text-sm mt-0.5"
              style={{
                fontFamily: 'var(--font-sans)',
                color: 'var(--ember-text-low)',
              }}
            >
              {current.subtitle}
            </p>
          )}
          <p
            className="mt-4 text-sm leading-relaxed break-words line-clamp-1"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--ember-text-low)',
            }}
          >
            {current.quote}
          </p>
          {current.longDescription && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setDetailsOpen((o) => !o)}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
              >
                {detailsOpen ? (
                  <>
                    <ChevronUp size={14} strokeWidth={2} />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} strokeWidth={2} />
                    More details
                  </>
                )}
              </button>
              {detailsOpen && (
                <p
                  className="mt-2 text-sm leading-relaxed break-words"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                >
                  {current.longDescription}
                </p>
              )}
            </div>
          )}
        </motion.div>

        <div className="flex items-center gap-4 pt-8 md:pt-6">
          <button
            type="button"
            onClick={handlePrev}
            className="group/button flex h-9 w-9 items-center justify-center rounded-full border shrink-0"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
            aria-label="Previous idea"
          >
            <ChevronLeft
              className="h-5 w-5 transition-transform duration-300 group-hover/button:-rotate-12"
              strokeWidth={2}
            />
          </button>
          <span
            className="text-sm tabular-nums"
            style={{
              fontFamily: 'var(--font-sans)',
              color: 'var(--ember-text-low)',
            }}
          >
            {active + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="group/button flex h-9 w-9 items-center justify-center rounded-full border shrink-0"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
            aria-label="Next idea"
          >
            <ChevronRight
              className="h-5 w-5 transition-transform duration-300 group-hover/button:rotate-12"
              strokeWidth={2}
            />
          </button>
        </div>

        {renderActions && (
          <div className="flex flex-wrap gap-2 pt-4">
            {renderActions(current, active)}
          </div>
        )}
      </div>
    </div>
  );
}
