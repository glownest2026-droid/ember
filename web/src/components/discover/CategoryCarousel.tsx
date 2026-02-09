'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Bookmark, Check, Sparkles } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';

const ICON_STROKE = '#B8432B';

// Peek carousel: fixed card width so neighbors are partially visible. Desktop 380px, mobile 320px.
const CARD_WIDTH_DESKTOP = 380;
const CARD_WIDTH_MOBILE = 320;
const GAP = 16;
const PEEK_DESKTOP = 80;  // ~21% of card
const PEEK_MOBILE = 40;   // ~12% of card
// Media: 4:3 aspect ratio gives better vertical space for overlay text and works well for category/product imagery (16:9 can feel too wide).
const MEDIA_ASPECT = '4/3';

/** Hide scrollbar visually but keep scroll (touch + pointer drag). */
const SCROLLBAR_HIDE = {
  scrollbarWidth: 'none' as const,
  msOverflowStyle: 'none' as const,
};

export interface CategoryTileData extends Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'label' | 'name' | 'rationale' | 'image_url'> {}

interface CategoryCarouselProps {
  categories: CategoryTileData[];
  onShowExamples: (categoryId: string) => void;
  onSaveIdea?: (categoryId: string, triggerEl: HTMLButtonElement | null) => void;
  onHaveThem?: (categoryId: string) => void;
}

function CategoryTypeCard({
  category,
  isSelected,
  onSelect,
  onShowExamples,
  onSaveIdea,
  onHaveThem,
  cardWidth,
}: {
  category: CategoryTileData;
  isSelected: boolean;
  onSelect: () => void;
  onShowExamples: (categoryId: string) => void;
  onSaveIdea?: (categoryId: string, triggerEl: HTMLButtonElement | null) => void;
  onHaveThem?: (categoryId: string) => void;
  cardWidth: number;
}) {
  const [rationaleExpanded, setRationaleExpanded] = useState(false);
  const label = category.label ?? category.name ?? category.slug ?? 'Category';
  const reason = category.rationale?.trim() ?? null;
  const imgUrl = category.image_url ?? null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        'flex-shrink-0 rounded-xl overflow-hidden cursor-pointer',
        'border-2 transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2',
        isSelected
          ? 'border-[#B8432B] shadow-[0px_0px_24px_rgba(184,67,43,0.25)]'
          : 'border-[#E5E7EB] hover:border-[var(--ember-text-low)]'
      )}
      style={{
        width: cardWidth,
        backgroundColor: 'var(--ember-surface-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Media container: fixed aspect ratio (4:3), image fills with object-cover */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: MEDIA_ASPECT, backgroundColor: 'var(--ember-surface-soft)' }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, var(--ember-surface-soft) 0%, var(--ember-surface-primary) 100%)',
              borderBottom: '1px solid var(--ember-border-subtle)',
            }}
          >
            <Sparkles size={32} strokeWidth={1.5} style={{ color: ICON_STROKE }} className="opacity-80" />
          </div>
        )}
        {/* Scrim: subtle at top, stronger toward bottom for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent"
          aria-hidden
        />
        {/* Text over media: title + why + More pill */}
        <div className="absolute inset-0 flex flex-col justify-end p-3">
          <h3 className="text-base font-semibold leading-tight line-clamp-2 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" title={label}>
            {label}
          </h3>
          {reason && (
            <p
              className={cn(
                'text-xs mt-0.5 leading-snug text-white/95',
                rationaleExpanded ? '' : 'line-clamp-2'
              )}
              title={reason}
            >
              {reason}
            </p>
          )}
          {reason && reason.length > 80 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRationaleExpanded((v) => !v);
              }}
              className="mt-1.5 self-start min-h-[28px] px-2.5 rounded-full text-[11px] font-medium border border-white/40 bg-white/15 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1"
            >
              {rationaleExpanded ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>
      {/* Actions: primary Save idea, secondary Have them, tertiary Show examples */}
      <div className="p-3 flex flex-col gap-2 bg-[var(--ember-surface-primary)]">
        <div className="flex flex-wrap gap-1.5">
          {onSaveIdea ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSaveIdea(category.id, e.currentTarget);
              }}
              className="min-h-[32px] px-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1"
              style={{
                backgroundColor: 'var(--ember-accent-base)',
                color: 'white',
                border: 'none',
              }}
            >
              <Bookmark size={12} strokeWidth={2} />
              Save idea
            </button>
          ) : (
            <span
              className="min-h-[32px] px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 opacity-50 cursor-not-allowed"
              style={{
                borderColor: '#E5E7EB',
                backgroundColor: 'var(--ember-surface-primary)',
                color: '#5C646D',
              }}
            >
              <Bookmark size={12} strokeWidth={2} />
              Save idea
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onHaveThem) onHaveThem(category.id);
            }}
            disabled={!onHaveThem}
            className="min-h-[32px] px-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1"
            style={{
              borderColor: '#E5E7EB',
              backgroundColor: 'var(--ember-surface-primary)',
              color: '#1A1E23',
            }}
          >
            <Check size={12} strokeWidth={2} />
            Have them
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShowExamples(category.id);
            }}
            className="min-h-[32px] px-2.5 rounded-lg border border-transparent text-xs font-medium flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1 hover:bg-[var(--ember-surface-soft)]"
            style={{
              backgroundColor: 'transparent',
              color: '#5C646D',
            }}
          >
            <Sparkles size={12} strokeWidth={2} />
            Show examples
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryCarousel({
  categories,
  onShowExamples,
  onSaveIdea,
  onHaveThem,
}: CategoryCarouselProps) {
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_DESKTOP);
  const step = cardWidth + GAP;
  const scrollBehavior = reduceMotion ? ('auto' as const) : ('smooth' as const);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 640px)');
    const update = () => setCardWidth(mq.matches ? CARD_WIDTH_DESKTOP : CARD_WIDTH_MOBILE);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const updateCurrentFromScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || !categories.length) return;
    const scrollLeft = el.scrollLeft;
    const index = Math.round(scrollLeft / step);
    const clamped = Math.max(0, Math.min(index, categories.length - 1));
    setCurrent(clamped);
  }, [categories.length, step]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateCurrentFromScroll, { passive: true });
    return () => el.removeEventListener('scroll', updateCurrentFromScroll);
  }, [updateCurrentFromScroll]);

  const handlePrevious = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: -step, behavior: scrollBehavior });
  };

  const handleNext = () => {
    const el = containerRef.current;
    if (el) el.scrollBy({ left: step, behavior: scrollBehavior });
  };

  if (!categories.length) return null;

  return (
    <div className="relative w-full" role="region" aria-label="Category ideas carousel">
      <div
        ref={containerRef}
        className="flex overflow-x-auto overflow-y-hidden w-full snap-x snap-mandatory scroll-smooth touch-pan-x [&::-webkit-scrollbar]:hidden"
        style={{
          ...SCROLLBAR_HIDE,
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            className="flex-shrink-0 snap-center"
            style={{ scrollSnapAlign: 'center', marginLeft: index === 0 ? 0 : GAP, width: cardWidth }}
          >
            <CategoryTypeCard
              category={cat}
              isSelected={current === index}
              onSelect={() => {
                const el = containerRef.current;
                if (el) el.scrollTo({ left: index * step, behavior: scrollBehavior });
                setCurrent(index);
              }}
              onShowExamples={onShowExamples}
              onSaveIdea={onSaveIdea}
              onHaveThem={onHaveThem}
              cardWidth={cardWidth}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          type="button"
          onClick={handlePrevious}
          className="w-10 h-10 flex items-center justify-center rounded-full border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
          style={{
            borderColor: '#E5E7EB',
            backgroundColor: 'var(--ember-surface-primary)',
            color: '#1A1E23',
          }}
          aria-label="Previous category"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        <span
          className="text-sm tabular-nums"
          style={{ fontFamily: 'var(--font-sans)', color: '#5C646D' }}
        >
          {current + 1} / {categories.length}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center rounded-full border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2"
          style={{
            borderColor: '#E5E7EB',
            backgroundColor: 'var(--ember-surface-primary)',
            color: '#1A1E23',
          }}
          aria-label="Next category"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
