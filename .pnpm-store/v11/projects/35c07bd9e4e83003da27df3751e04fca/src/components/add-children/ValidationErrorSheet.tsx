'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ValidationErrorSheet({ open, onOpenChange }: ValidationErrorSheetProps) {
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
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="validation-sheet-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
        onKeyDown={() => {}}
      />
      <div
        className="relative z-10 bg-white rounded-t-3xl shadow-lg p-6"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#d4183d]/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-[#d4183d]" strokeWidth={2} />
        </div>
        <h2 id="validation-sheet-title" className="text-2xl font-medium text-[var(--ember-text-high)]">
          Almost there
        </h2>
        <p className="text-base text-[var(--ember-text-low)] leading-relaxed mt-1">
          We just need your little one&apos;s birthday to get started with personalised recommendations.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full py-4 bg-[var(--ember-accent-base)] text-white rounded-xl font-medium text-base hover:bg-[var(--ember-accent-hover)] active:scale-[0.98] transition-all"
          >
            Continue editing
          </button>
        </div>
      </div>
    </div>
  );
}
