'use client';

import { useState } from 'react';
import { Bookmark, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';
import type { GatewayPick } from '@/lib/pl/public';

export function DiscoverFigmaProductCarousel({
  picks,
  ageRangeLabel,
  whyWorksHeading,
  onSave,
  onHave,
  getProductUrl,
}: {
  picks: GatewayPick[];
  ageRangeLabel: string;
  whyWorksHeading: string;
  onSave: (productId: string, triggerEl: HTMLButtonElement | null) => void;
  onHave: (productId: string) => void;
  getProductUrl: (p: GatewayPick) => string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  if (!picks.length) return null;

  const products = picks.map((pick) => ({
    id: pick.product.id,
    name: pick.product.name,
    brand: pick.product.brand || '',
    ageRange: ageRangeLabel,
    why: pick.product.rationale || pick.categoryType.label || pick.categoryType.name || 'Chosen for this age and focus.',
    imageUrl: pick.product.image_url || '',
    pick,
  }));

  const current = products[currentIndex];
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const handleNext = () => {
    if (currentIndex < products.length - 1) {
      setDirection('right');
      setCurrentIndex((p) => p + 1);
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setCurrentIndex((p) => p - 1);
    }
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50 && currentIndex > 0) handlePrevious();
    else if (info.offset.x < -50 && currentIndex < products.length - 1) handleNext();
  };

  const url = getProductUrl(current.pick);
  const canVisit = url && url !== '#';

  return (
    <div className="relative">
      <div className="relative flex items-center gap-4 lg:gap-6">
        {prevProduct && (
          <motion.button
            type="button"
            onClick={handlePrevious}
            className="hidden lg:block w-48 flex-shrink-0 cursor-pointer group"
            whileHover={{ x: -8, scale: 1.02 }}
          >
            <div className="relative h-[420px] rounded-3xl overflow-hidden bg-white shadow-lg opacity-40 group-hover:opacity-60 transition-opacity">
              <div className="relative h-48 bg-[var(--ember-surface-soft)]">
                <DiscoverFigmaImage src={prevProduct.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-[var(--ember-text-high)] line-clamp-2">{prevProduct.name}</h4>
              </div>
            </div>
          </motion.button>
        )}

        <div className="flex-1 relative max-w-2xl mx-auto w-full min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction === 'right' ? 60 : -60, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction === 'right' ? -60 : 60, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.5}
              onDragEnd={handleDragEnd}
            >
              <div className="relative h-56 lg:h-80 bg-[var(--ember-surface-soft)]">
                <DiscoverFigmaImage src={current.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 lg:top-4 lg:left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md">
                  <span className="text-xs lg:text-sm font-semibold text-[var(--ember-text-high)]">{current.ageRange}</span>
                </div>
                <div className="absolute top-3 right-3 lg:top-4 lg:right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                  <span className="text-xs font-medium text-white">
                    {currentIndex + 1} of {products.length}
                  </span>
                </div>
              </div>
              <div className="p-5 lg:p-8">
                <div className="mb-4 lg:mb-5">
                  <h4 className="text-lg lg:text-2xl font-medium text-[var(--ember-text-high)] mb-1 leading-tight">{current.name}</h4>
                  {current.brand ? (
                    <p className="text-sm lg:text-base text-[var(--ember-text-low)]">{current.brand}</p>
                  ) : null}
                </div>
                <div className="mb-5 lg:mb-6 p-4 lg:p-5 rounded-2xl" style={{ backgroundColor: 'rgba(255, 99, 71, 0.08)' }}>
                  <p className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)] mb-2">{whyWorksHeading}</p>
                  <p className="text-sm lg:text-base text-[var(--ember-text-low)] leading-relaxed">{current.why}</p>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => onSave(current.id, e.currentTarget)}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl border-2 border-[var(--ember-border-subtle)] text-[var(--ember-text-high)] hover:border-[var(--ember-accent-base)] font-medium text-xs lg:text-sm flex-1 min-w-[100px]"
                  >
                    <Bookmark className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => onHave(current.id)}
                    className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl border-2 border-[var(--ember-border-subtle)] text-[var(--ember-text-high)] hover:border-[var(--ember-accent-base)] font-medium text-xs lg:text-sm flex-1 min-w-[100px]"
                  >
                    <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    Have
                  </button>
                  {canVisit ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 lg:gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl border-2 border-[var(--ember-border-subtle)] text-[var(--ember-text-high)] hover:border-[var(--ember-accent-base)] font-medium text-xs lg:text-sm flex-1 min-w-[100px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      Visit
                    </a>
                  ) : (
                    <span className="flex-1 min-w-[100px] text-center text-xs text-[var(--ember-text-low)] py-2">Link soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="lg:hidden">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute left-3 top-[7rem] w-10 h-10 rounded-full bg-white/95 shadow-xl flex items-center justify-center z-20 border border-[var(--ember-border-subtle)]"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
              </button>
            )}
            {currentIndex < products.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-[7rem] w-10 h-10 rounded-full bg-white/95 shadow-xl flex items-center justify-center z-20 border border-[var(--ember-border-subtle)]"
                aria-label="Next product"
              >
                <ChevronRight className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="hidden lg:block">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border-2 border-[var(--ember-border-subtle)] hover:border-[var(--ember-accent-base)]"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-6 h-6 text-[var(--ember-accent-base)]" />
              </button>
            )}
            {currentIndex < products.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center z-20 border-2 border-[var(--ember-border-subtle)] hover:border-[var(--ember-accent-base)]"
                aria-label="Next product"
              >
                <ChevronRight className="w-6 h-6 text-[var(--ember-accent-base)]" />
              </button>
            )}
          </div>
        </div>

        {nextProduct && (
          <motion.button
            type="button"
            onClick={handleNext}
            className="hidden lg:block w-48 flex-shrink-0 cursor-pointer group"
            whileHover={{ x: 8, scale: 1.02 }}
          >
            <div className="relative h-[420px] rounded-3xl overflow-hidden bg-white shadow-lg opacity-40 group-hover:opacity-60 transition-opacity">
              <div className="relative h-48 bg-[var(--ember-surface-soft)]">
                <DiscoverFigmaImage src={nextProduct.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-[var(--ember-text-high)] line-clamp-2">{nextProduct.name}</h4>
              </div>
            </div>
          </motion.button>
        )}
      </div>

      {products.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-7 lg:mt-8">
          {products.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setDirection(index > currentIndex ? 'right' : 'left');
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-[var(--ember-accent-base)]' : 'w-2 bg-[var(--ember-border-subtle)] hover:w-3'
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
