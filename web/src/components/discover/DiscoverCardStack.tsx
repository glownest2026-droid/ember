'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiscoverProductCard } from './DiscoverProductCard';
import type { GatewayPick } from '@/lib/pl/public';
import { RotateCcw, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

const ACCENT = '#FF6347';
const BORDER = '#E5E7EB';
const TEXT_HIGH = '#1A1E23';
const TEXT_LOW = '#5C646D';

const VISIBLE_CARDS = 4;

export interface DiscoverCardStackProps {
  picks: GatewayPick[];
  ageRangeLabel: string;
  wrapperLabel?: string | null;
  onSave: (productId: string, triggerEl: HTMLButtonElement | null) => void;
  onHave: (productId: string) => void;
  getProductUrl: (pick: GatewayPick) => string;
  /** Optional id for the progress bar container (e.g. for scroll-into-view anchor). */
  progressBarId?: string;
}

export function DiscoverCardStack({
  picks,
  ageRangeLabel,
  wrapperLabel,
  onSave,
  onHave,
  getProductUrl,
  progressBarId,
}: DiscoverCardStackProps) {
  const [order, setOrder] = useState<GatewayPick[]>(picks);
  const [viewIndex, setViewIndex] = useState(0);
  const displayed = order.slice(0, VISIBLE_CARDS);

  // When picks change (e.g. user switched category), reset stack and counter so bottom layer matches middle layer
  const picksKey = picks.length + (picks[0]?.product.id ?? '');
  useEffect(() => {
    setOrder(picks);
    setViewIndex(0);
  }, [picksKey, picks]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setOrder((prev) => {
        const next = [...prev];
        const top = next.shift();
        if (top) next.push(top);
        return next;
      });
      setViewIndex((i) => (i + 1) % picks.length);
    } else {
      setOrder((prev) => {
        const next = [...prev];
        const last = next.pop();
        if (last) next.unshift(last);
        return next;
      });
      setViewIndex((i) => (i - 1 + picks.length) % picks.length);
    }
  };

  const handlePrevious = () => {
    setOrder((prev) => {
      const next = [...prev];
      const last = next.pop();
      if (last) next.unshift(last);
      return next;
    });
    setViewIndex((i) => (i - 1 + picks.length) % picks.length);
  };

  const handleNext = () => {
    setOrder((prev) => {
      const next = [...prev];
      const top = next.shift();
      if (top) next.push(top);
      return next;
    });
    setViewIndex((i) => (i + 1) % picks.length);
  };

  const handleShuffle = () => {
    setOrder((prev) => [...prev].sort(() => Math.random() - 0.5));
    setViewIndex(0);
  };

  const handleReset = () => {
    setOrder(picks);
    setViewIndex(0);
  };

  // Cap to avoid "Card 6 of 5" when viewIndex and picks get out of sync
  const safeViewIndex = Math.min(viewIndex, Math.max(0, picks.length - 1));
  const oneBased = Math.min(safeViewIndex + 1, Math.max(1, picks.length));
  const progress = picks.length > 0 ? (oneBased / picks.length) * 100 : 0;

  if (picks.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col">
      <div id={progressBarId} className="mb-6 scroll-mt-24">
        <div className="max-w-xs mx-auto">
          <div className="h-2 bg-[#F1F3F2] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%`, background: `linear-gradient(to right, ${ACCENT}, #FF8B6D)` }}
            />
          </div>
          <div className="mt-2 text-sm font-bold" style={{ color: TEXT_LOW }}>
            Card {oneBased} of {picks.length}
          </div>
        </div>
      </div>

      <div className="relative h-[580px] mb-6">
        <AnimatePresence mode="popLayout">
          {displayed.map((pick, idx) => (
            <DiscoverProductCard
              key={pick.product.id}
              pick={pick}
              ageRangeLabel={ageRangeLabel}
              index={idx}
              totalCards={displayed.length}
              isTop={idx === 0}
              onSwipe={handleSwipe}
              onPrev={handlePrevious}
              onNext={handleNext}
              onSave={onSave}
              onHave={onHave}
              productUrl={getProductUrl(pick)}
              wrapperLabel={wrapperLabel}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <motion.button
          type="button"
          onClick={handlePrevious}
          className="w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center hover:bg-[#FAFAFA] shadow-md hover:shadow-lg"
          style={{ borderColor: BORDER }}
          aria-label="Previous card"
          whileHover={{ scale: 1.1, rotate: -10 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" style={{ color: TEXT_HIGH }} strokeWidth={2.5} />
        </motion.button>
        <motion.button
          type="button"
          onClick={handleShuffle}
          className="px-5 py-3 rounded-full bg-white border-2 flex items-center justify-center gap-2 hover:bg-[#FAFAFA] shadow-md hover:shadow-lg"
          style={{ borderColor: BORDER }}
          aria-label="Shuffle cards"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shuffle className="w-4 h-4" style={{ color: TEXT_LOW }} strokeWidth={2.5} />
          <span className="text-sm font-bold" style={{ color: TEXT_HIGH }}>Shuffle</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={handleReset}
          className="px-5 py-3 rounded-full bg-white border-2 flex items-center justify-center gap-2 hover:bg-[#FAFAFA] shadow-md hover:shadow-lg"
          style={{ borderColor: BORDER }}
          aria-label="Reset to first card"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" style={{ color: TEXT_LOW }} strokeWidth={2.5} />
          <span className="text-sm font-bold" style={{ color: TEXT_HIGH }}>Reset</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={handleNext}
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg hover:shadow-xl"
          style={{ backgroundColor: ACCENT, borderColor: ACCENT }}
          aria-label="Next card"
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
