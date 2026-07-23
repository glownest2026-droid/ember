'use client';

import { useEffect, useRef } from 'react';
import { Shield, Eye, Trash2, Lock } from 'lucide-react';

interface PrivacySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacySheet({ open, onOpenChange }: PrivacySheetProps) {
  const touchStartY = useRef(0);

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onOpenChange(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    if (endY - touchStartY.current > 60) onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="privacy-sheet-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={handleOverlayClick} />
      <div
        className="relative z-10 bg-white rounded-t-3xl shadow-lg max-h-[85vh] overflow-y-auto flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="px-6 pt-6 pb-2">
          <h2 id="privacy-sheet-title" className="text-2xl font-medium text-[var(--ember-text-high)]">
            Why we ask this
          </h2>
          <p className="text-base text-[var(--ember-text-low)] leading-relaxed mt-1">
            We use little one&apos;s birth date to explain what they&apos;re learning now — and what&apos;s likely coming next.
          </p>
        </div>
        <div className="px-6 space-y-6 pb-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--ember-text-high)] mb-1">Right toy, right time</h3>
              <p className="text-sm text-[var(--ember-text-low)] leading-relaxed">
                We use age/stage to recommend play ideas and products that fit your child&apos;s next developmental steps.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--ember-text-high)] mb-1">Proactive ideas, not guesswork</h3>
              <p className="text-sm text-[var(--ember-text-low)] leading-relaxed">
                Ember helps you stay ahead with timely suggestions, so you can feel confident about what to introduce next.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--ember-text-high)] mb-1">You&apos;re always in control</h3>
              <p className="text-sm text-[var(--ember-text-low)] leading-relaxed">
                You can edit or delete your child profile at any time.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--ember-accent-base)]/10 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6 text-[var(--ember-accent-base)]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--ember-text-high)] mb-1">Your data stays private</h3>
              <p className="text-sm text-[var(--ember-text-low)] leading-relaxed">
                We only use this information to personalise your Ember experience. We never sell personal data.
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-8">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full py-4 bg-[var(--ember-text-high)] text-white rounded-xl font-medium text-base hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
