'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { DiscoverFigmaPlayIdeaCard } from './DiscoverFigmaPlayIdeaCard';

export type PlayIdeaItem = {
  id: string;
  title: string;
  description: string;
  scienceConnection: string;
  imageUrl: string;
};

export function DiscoverFigmaPlayCarousel({
  items,
  selectedId,
  onSelect,
  onSeeExamples,
  onSaveIdea,
  onHaveThem,
  showHaveAction = true,
  sectionTitle,
}: {
  items: PlayIdeaItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSeeExamples: (id: string) => void;
  onSaveIdea: (categoryId: string, el: HTMLButtonElement | null) => void;
  onHaveThem: (categoryId: string) => void;
  showHaveAction?: boolean;
  sectionTitle: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
  }, [items, emblaApi]);

  if (!items.length) return null;

  return (
    <section className="flex flex-col gap-5 relative">
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
          {items.map((idea) => (
            <div key={idea.id} className="flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_32%] min-w-0">
              <DiscoverFigmaPlayIdeaCard
                id={idea.id}
                title={idea.title}
                description={idea.description}
                imageUrl={idea.imageUrl}
                isSelected={selectedId === idea.id}
                onClick={() => onSelect(idea.id)}
                onSeeExamples={() => onSeeExamples(idea.id)}
                onSaveIdea={(e, el) => onSaveIdea(idea.id, el)}
                onHaveThem={showHaveAction ? () => onHaveThem(idea.id) : undefined}
              />
            </div>
          ))}
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
  );
}
