'use client';

import { useEffect } from 'react';
import { Info } from 'lucide-react';

interface OlderChildSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export function OlderChildSheet({ open, onOpenChange, onContinue }: OlderChildSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="older-child-sheet-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
      >
        <div className="w-12 h-12 rounded-xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center mb-4">
          <Info className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
        </div>
        <h2 id="older-child-sheet-title" className="text-2xl font-medium text-[var(--ember-text-high)]">
          Just a heads up
        </h2>
        <p className="text-base text-[var(--ember-text-low)] leading-relaxed mt-1">
          Ember is designed for little ones aged 0–5 years. You&apos;re welcome to add this child, but our activities and recommendations might not be as relevant for older kids.
        </p>
        <div className="space-y-3 pt-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-4 bg-[var(--ember-accent-base)] text-white rounded-xl font-medium text-base hover:bg-[var(--ember-accent-hover)] active:scale-[0.98] transition-all"
          >
            Save anyway
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full py-4 bg-white text-[var(--ember-text-high)] border border-[var(--ember-border-subtle)] rounded-xl font-medium text-base hover:bg-[var(--ember-surface-soft)] active:scale-[0.98] transition-all"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
