'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { resolveStage2BadgeLabel, resolveStage2HelperNote } from '@/lib/discover/cardNotes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { DiscoverFigmaPlayIdeaCard } from './DiscoverFigmaPlayIdeaCard';
import { DiscoverFigmaPlayIdeaExpanded } from './DiscoverFigmaPlayIdeaExpanded';

export type PlayIdeaItem = {
  id: string;
  title: string;
  description: string;
  audienceLens?: string | null;
  scienceConnection: string;
  imageUrl: string;
  uiLane?: string | null;
  contentType?: string | null;
  showEmberPicks?: boolean | null;
  showGiftAction?: boolean | null;
  giftFriendly?: boolean | null;
  buyerModeLabel?: string | null;
  giftNote?: string | null;
  ownershipNote?: string | null;
  cardCtaLabel?: string | null;
  renderRule?: string | null;
  laneRank?: number | null;
  categoryRank?: number | null;
};

export function DiscoverFigmaPlayCarousel({
  items,
  selectedId,
  onSelect,
  onSeeExamples,
  onSaveIdea,
  onGiftAction,
  onHaveThem,
  showHaveAction = true,
  showEmberPicks = true,
  showSaveAction = true,
  showGiftAction = false,
  noteMode = 'parent',
  dimmedCategoryIds,
  sectionTitle,
}: {
  items: PlayIdeaItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSeeExamples: (id: string) => void;
  onSaveIdea: (categoryId: string, el: HTMLButtonElement | null) => void;
  onGiftAction?: (categoryId: string, el: HTMLButtonElement | null) => void;
  onHaveThem: (categoryId: string) => void;
  showHaveAction?: boolean;
  showEmberPicks?: boolean;
  showSaveAction?: boolean;
  showGiftAction?: boolean;
  noteMode?: 'parent' | 'gift';
  dimmedCategoryIds?: Set<string>;
  sectionTitle: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    // Mobile: dragFree otherwise eats taps on "See Our Picks" when the finger
    // moves a few pixels — treat interactive controls as non-draggable.
    watchDrag: (_api, evt) => {
      const target = evt.target;
      if (!(target instanceof Element)) return true;
      return !target.closest('button, a, input, textarea, [role="button"]');
    },
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelectSnap = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectSnap();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelectSnap);
    emblaApi.on('reInit', onSelectSnap);
    return () => {
      emblaApi.off('select', onSelectSnap);
      emblaApi.off('reInit', onSelectSnap);
    };
  }, [emblaApi, onSelectSnap]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
    }
    setExpandedId(null);
  }, [items, emblaApi]);

  if (!items.length) return null;

  const expandedIdea = expandedId ? items.find((i) => i.id === expandedId) ?? null : null;

  return (
    <>
      <section className="flex flex-col gap-3 md:gap-4 relative">
        <div className="flex justify-between items-end gap-3">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#253044] m-0">{sectionTitle}</h2>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="w-10 h-10 rounded-full border border-[#E7E2DC] bg-white flex items-center justify-center text-[#253044] disabled:opacity-30 hover:bg-slate-50 transition-colors"
              aria-label="Previous idea"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="w-10 h-10 rounded-full border border-[#E7E2DC] bg-white flex items-center justify-center text-[#253044] disabled:opacity-30 hover:bg-slate-50 transition-colors"
              aria-label="Next idea"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden -mx-1 px-1" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {items.map((idea, index) => {
              const isDimmed = dimmedCategoryIds?.has(idea.id) ?? false;
              return (
                <div key={idea.id} className="flex-[0_0_94%] md:flex-[0_0_58%] lg:flex-[0_0_42%] min-w-0">
                  <DiscoverFigmaPlayIdeaCard
                    id={idea.id}
                    title={idea.title}
                    description={idea.description}
                    audienceLens={idea.audienceLens}
                    imageUrl={idea.imageUrl}
                    imagePriority={index < 2}
                    isSelected={selectedId === idea.id}
                    onClick={() => onSelect(idea.id)}
                    onSeeExamples={() => onSeeExamples(idea.id)}
                    onSaveIdea={(e, el) => onSaveIdea(idea.id, el)}
                    onGiftAction={onGiftAction ? (e, el) => onGiftAction(idea.id, el) : undefined}
                    onHaveThem={showHaveAction ? () => onHaveThem(idea.id) : undefined}
                    onExpand={() => setExpandedId(idea.id)}
                    isDimmed={isDimmed}
                    isHaveActive={isDimmed}
                    showEmberPicks={showEmberPicks && idea.showEmberPicks !== false}
                    showSaveAction={showSaveAction}
                    showGiftAction={showGiftAction && idea.showGiftAction === true}
                    ctaLabel={idea.cardCtaLabel || 'See Ember Picks'}
                    helperNote={resolveStage2HelperNote(noteMode, idea.ownershipNote, idea.giftNote)}
                    badgeLabel={resolveStage2BadgeLabel(noteMode, idea.buyerModeLabel)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex md:hidden justify-center gap-2 mt-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`h-2 rounded-full transition-all ${index === selectedIndex ? 'bg-[#FF5C34] w-4' : 'bg-[#E7E2DC] w-2'}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to idea ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {expandedIdea ? (
          <DiscoverFigmaPlayIdeaExpanded
            key={expandedIdea.id}
            idea={expandedIdea}
            isDimmed={dimmedCategoryIds?.has(expandedIdea.id)}
            onClose={() => setExpandedId(null)}
            onSeeExamples={() => onSeeExamples(expandedIdea.id)}
            onSaveIdea={(e, el) => onSaveIdea(expandedIdea.id, el)}
            onGiftAction={onGiftAction ? (e, el) => onGiftAction(expandedIdea.id, el) : undefined}
            showEmberPicks={showEmberPicks && expandedIdea.showEmberPicks !== false}
            showGiftAction={showGiftAction && expandedIdea.showGiftAction === true}
            ctaLabel={expandedIdea.cardCtaLabel || 'See Ember Picks'}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
