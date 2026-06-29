'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, Save, X } from 'lucide-react';
import { DiscoverFigmaImage } from './DiscoverFigmaImage';

export type ExpandedPlayIdea = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export function DiscoverFigmaPlayIdeaExpanded({
  idea,
  isDimmed,
  onClose,
  onSeeExamples,
  onSaveIdea,
}: {
  idea: ExpandedPlayIdea;
  isDimmed?: boolean;
  onClose: () => void;
  onSeeExamples: () => void;
  onSaveIdea: (e: React.MouseEvent, el: HTMLButtonElement | null) => void;
}) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-[#FBFAF7]"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="expanded-idea-title"
    >
      <div className="flex md:hidden items-center justify-end px-4 pt-4 pb-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-[#253044] shadow-sm hover:bg-[#FBFAF7] transition-colors"
          aria-label="Close expanded card"
        >
          <X size={22} strokeWidth={2.5} />
        </button>
      </div>

      <motion.div
        className={`flex-1 overflow-y-auto px-4 pb-8 md:flex md:items-center md:justify-center md:py-8 ${isDimmed ? 'opacity-60 grayscale' : ''}`}
        initial={shouldReduceMotion ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <article className="relative max-w-2xl mx-auto w-full bg-white border border-[#E7E2DC] rounded-[24px] overflow-hidden shadow-lg flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="hidden md:flex absolute top-4 right-4 z-10 w-11 h-11 items-center justify-center rounded-full border border-[#E7E2DC] bg-white/95 text-[#253044] shadow-sm hover:bg-white transition-colors"
            aria-label="Close expanded card"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
          <div className="relative aspect-[16/9] max-h-[280px] overflow-hidden bg-[#FBFAF7]">
            <DiscoverFigmaImage src={idea.imageUrl} alt={idea.title} variant="product" className="object-cover" />
          </div>
          <div className="p-5 md:p-7 flex flex-col gap-4">
            <h2 id="expanded-idea-title" className="font-bold text-[22px] md:text-[26px] text-[#253044] leading-tight m-0">
              {idea.title}
            </h2>
            {idea.description ? (
              <p className="text-[16px] md:text-[17px] text-[#66717D] leading-relaxed m-0 whitespace-pre-wrap">
                {idea.description}
              </p>
            ) : null}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSeeExamples();
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FF5C34] hover:bg-[#E04B28] text-white py-3.5 px-4 rounded-full font-bold text-[15px] transition-colors shadow-sm"
              >
                Ember Picks
                <ChevronRight size={18} strokeWidth={2.5} aria-hidden />
              </button>
              <button
                type="button"
                onClick={(e) => onSaveIdea(e, e.currentTarget)}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full border border-[#E7E2DC] text-[#66717D] hover:bg-[#FBFAF7] transition-colors shadow-sm"
                aria-label="Save idea"
              >
                <Save size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </article>
      </motion.div>
    </motion.div>
  );
}
