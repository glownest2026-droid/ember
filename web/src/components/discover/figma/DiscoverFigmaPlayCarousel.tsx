'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, type PanInfo } from 'motion/react';
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
}: {
  items: PlayIdeaItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSeeExamples: (id: string) => void;
  onSaveIdea: (categoryId: string, el: HTMLButtonElement | null) => void;
  onHaveThem: (categoryId: string) => void;
  showHaveAction?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(380);
  const [mobileW, setMobileW] = useState(320);

  useEffect(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 400;
    setCardWidth(Math.min(380, w * 0.85));
    setMobileW(Math.min(320, w * 0.85));
  }, []);

  if (!items.length) return null;

  const gap = 24;
  const gapM = 16;

  const handleNext = () => {
    if (currentIndex < items.length - 1) setCurrentIndex((p) => p + 1);
  };
  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold && currentIndex > 0) handlePrevious();
    else if (info.offset.x < -swipeThreshold && currentIndex < items.length - 1) handleNext();
  };

  const renderCard = (idea: PlayIdeaItem) => (
    <DiscoverFigmaPlayIdeaCard
      key={idea.id}
      id={idea.id}
      title={idea.title}
      description={idea.description}
      scienceConnection={idea.scienceConnection}
      imageUrl={idea.imageUrl}
      isSelected={selectedId === idea.id}
      onClick={() => onSelect(idea.id)}
      onSeeExamples={() => onSeeExamples(idea.id)}
      onSaveIdea={(e, el) => onSaveIdea(idea.id, el)}
      onHaveThem={showHaveAction ? () => onHaveThem(idea.id) : undefined}
    />
  );

  return (
    <div className="relative">
      <div className="hidden lg:block relative">
        <div className="overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={{ left: -(items.length - 1) * (cardWidth + gap), right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={{ x: -currentIndex * (cardWidth + gap) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex gap-6"
            style={{ width: 'max-content' }}
          >
            {items.map((idea) => (
              <div key={idea.id} className="flex-shrink-0" style={{ width: cardWidth }}>
                {renderCard(idea)}
              </div>
            ))}
          </motion.div>
        </div>
        {currentIndex > 0 && (
          <motion.button
            type="button"
            onClick={handlePrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border-2 border-[var(--ember-border-subtle)] hover:border-[var(--ember-accent-base)] transition-all"
            aria-label="Previous play idea"
          >
            <ChevronLeft className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
          </motion.button>
        )}
        {currentIndex < items.length - 1 && (
          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border-2 border-[var(--ember-border-subtle)] hover:border-[var(--ember-accent-base)] transition-all"
            aria-label="Next play idea"
          >
            <ChevronRight className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
          </motion.button>
        )}
        <div className="flex justify-center items-center gap-2 mt-8">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[var(--ember-accent-base)] shadow-sm' : 'w-2 bg-[var(--ember-border-subtle)] hover:w-3'
              }`}
              aria-label={`Go to play idea ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="lg:hidden relative">
        <div className="overflow-hidden -mx-6 px-6">
          <motion.div
            drag="x"
            dragConstraints={{ left: -(items.length - 1) * (mobileW + gapM), right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={{ x: -currentIndex * (mobileW + gapM) }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex gap-4"
            style={{ width: 'max-content' }}
          >
            {items.map((idea) => (
              <div key={idea.id} className="flex-shrink-0" style={{ width: mobileW }}>
                {renderCard(idea)}
              </div>
            ))}
          </motion.div>
        </div>
        {currentIndex > 0 && (
          <motion.button
            type="button"
            onClick={handlePrevious}
            whileTap={{ scale: 0.9 }}
            className="absolute left-2 top-[34%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center z-20 border border-[var(--ember-border-subtle)]"
            aria-label="Previous play idea"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
          </motion.button>
        )}
        {currentIndex < items.length - 1 && (
          <motion.button
            type="button"
            onClick={handleNext}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 top-[34%] -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-xl flex items-center justify-center z-20 border border-[var(--ember-border-subtle)]"
            aria-label="Next play idea"
          >
            <ChevronRight className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
          </motion.button>
        )}
        <div className="flex justify-center items-center gap-2 mt-6">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[var(--ember-accent-base)]' : 'w-2 bg-[var(--ember-border-subtle)]'
              }`}
              aria-label={`Go to play idea ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
