'use client';

import { useEffect, useRef } from 'react';

/** Exact copy for "How Ember chooses" — single source of truth */
export const HOW_WE_CHOOSE_TITLE = 'How Ember chooses';

export const HOW_WE_CHOOSE_BODY = `We keep it simple: we only use your child's age and today's focus.

First, we map what's typically developing at this stage into a small set of 'next steps' — the kinds of toys that tend to help (like picture books, animal playsets, or interactive toys).

Then we pick examples you can browse: products that are widely available in the UK and consistently backed up by more than one independent signal (expert guidance, clear retailer detail and feedback, and what parents say over time).

If we can't verify a product properly, it doesn't make the cut.

You're always in charge: use what you've got, save what you like, and buy wherever you prefer.`;

interface HowWeChooseSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Bottom sheet: "How Ember chooses" — close by swipe down, X, or tap outside.
 * Reused from Next steps "Explained ⓘ" and Examples "Why these?".
 */
export function HowWeChooseSheet({ open, onClose }: HowWeChooseSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const delta = endY - touchStartY.current;
    if (delta > 60) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="how-we-choose-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleOverlayClick}
      />
      <div
        ref={panelRef}
        className="relative z-10 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-end pt-3 pr-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#E5E7EB] transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 pb-8 pt-0">
          <h2 id="how-we-choose-title" className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
            {HOW_WE_CHOOSE_TITLE}
          </h2>
          <p className="text-base leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
            {HOW_WE_CHOOSE_BODY}
          </p>
        </div>
      </div>
    </div>
  );
}
