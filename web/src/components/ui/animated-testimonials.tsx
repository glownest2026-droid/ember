'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getProductIconComponent } from '@/lib/icons/productIcon';
import type { ProductIconKey } from '@/lib/icons/productIcon';

const ICON_COLOR = '#B8432B';

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
  /** Render slot for actions (Save to my list, Have it already, Visit) for the active item */
  renderActions?: (item: AlbumItem, index: number) => React.ReactNode;
};

export function AnimatedTestimonials({
  items,
  autoplay = false,
  className,
  renderActions,
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
  const getRotateY = (index: number) =>
    prefersReducedMotion ? 0 : (index % 5) * 5 - 10;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0', className)}>
      {/* Left (or top on narrow): image stack */}
      <div className="relative min-h-[200px] sm:min-h-[240px] md:min-h-[280px] w-full min-w-0">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const isActiveItem = index === active;
            const z = isActiveItem ? items.length + 10 : Math.max(0, items.length - index);
            const rotateY = index === active ? 0 : getRotateY(index);
            const scale = isActiveItem ? 1 : 1 - (items.length - index) * 0.02;
            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 origin-center"
                style={{ zIndex: z }}
                initial={false}
                animate={{
                  y: prefersReducedMotion ? 0 : isActiveItem ? 0 : (index - active) * 8,
                  scale,
                  opacity: index <= active ? 1 : 0.4,
                  rotateY: prefersReducedMotion ? 0 : rotateY,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : 0.4,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                <div className="h-full w-full rounded-3xl overflow-hidden bg-[var(--ember-surface-soft)] shadow-lg">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full flex items-center justify-center rounded-3xl"
                      style={{
                        background: 'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
                      }}
                    >
                      {(() => {
                        const Icon = getProductIconComponent(
                          (item.iconKey as ProductIconKey) || 'drawing-making'
                        );
                        return (
                          <Icon
                            size={48}
                            strokeWidth={1.5}
                            style={{ color: ICON_COLOR }}
                            className="opacity-90"
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Right: text + nav */}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.25 }}
            className="min-w-0"
          >
            <h3
              className="text-lg font-medium truncate"
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
            >
              {current.title}
            </h3>
            {current.subtitle && (
              <p
                className="text-sm mt-0.5 truncate"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
              >
                {current.subtitle}
              </p>
            )}
            <div
              className="mt-2 text-sm leading-relaxed line-clamp-3"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-high)' }}
            >
              {prefersReducedMotion ? (
                current.quote
              ) : (
                current.quote.split(/\s+/).map((word, i) => (
                  <motion.span
                    key={`${current.id}-${i}`}
                    initial={{ filter: 'blur(6px)', opacity: 0.4 }}
                    animate={{ filter: 'blur(0px)', opacity: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: i * 0.03,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {renderActions && (
          <div className="flex flex-wrap gap-2 mt-2">
            {renderActions(current, active)}
          </div>
        )}
      </div>
    </div>
  );
}
