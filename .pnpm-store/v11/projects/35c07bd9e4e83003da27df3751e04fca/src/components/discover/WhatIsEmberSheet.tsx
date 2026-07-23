'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface WhatIsEmberSheetProps {
  open: boolean;
  onClose: () => void;
  /** Optional path for /signin?next= (e.g. /discover/26) */
  signinNextPath?: string;
}

/** Shared content: same copy and CTA for mobile sheet and desktop modal */
function WhatIsEmberContent({ joinHref, onClose }: { joinHref: string; onClose: () => void }) {
  return (
    <>
      <h2 id="what-is-ember-title" className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
        What is Ember?
      </h2>

      <section className="mb-6">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ember-text-high)' }}>What it does</h3>
        <p className="text-base leading-relaxed" style={{ color: 'var(--ember-text-low)' }}>
          Ember guides you to the next right toy ideas for your child&apos;s age — and explains why.
        </p>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ember-text-high)' }}>How it works</h3>
        <ul className="list-disc list-inside text-base leading-relaxed space-y-1" style={{ color: 'var(--ember-text-low)' }}>
          <li>Pick your child&apos;s age</li>
          <li>Choose what they&apos;re practising right now</li>
          <li>See next steps, then examples you can save</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--ember-text-high)' }}>Privacy</h3>
        <p className="text-base leading-relaxed" style={{ color: 'var(--ember-text-low)' }}>
          We only use age to tailor ideas.
        </p>
      </section>

      <Link
        href={joinHref}
        className="block w-full py-3 px-5 rounded-lg font-semibold text-center text-white transition-colors"
        style={{
          background: '#FF6347',
          borderRadius: 'var(--ember-radius-button, 8px)',
        }}
        onClick={onClose}
      >
        Join free
      </Link>
    </>
  );
}

/**
 * "What is Ember?" — mobile: bottom sheet (swipe down, X, outside).
 * Desktop: centered modal card (max 720px, 92vw; X + outside). Same content.
 */
export function WhatIsEmberSheet({ open, onClose, signinNextPath = '/discover' }: WhatIsEmberSheetProps) {
  const joinHref = signinNextPath ? `/signin?next=${encodeURIComponent(signinNextPath)}` : '/signin';
  const panelRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

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

  const closeButton = (
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
  );

  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col justify-end"
        aria-modal="true"
        role="dialog"
        aria-labelledby="what-is-ember-title"
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
          <div className="flex justify-end pt-3 pr-3">{closeButton}</div>
          <div className="px-5 pb-8 pt-0">
            <WhatIsEmberContent joinHref={joinHref} onClose={onClose} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="what-is-ember-title"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleOverlayClick}
      />
      <div
        ref={panelRef}
        className="relative z-10 bg-white rounded-2xl shadow-xl w-[92vw] max-w-[720px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-end pt-4 pr-4">{closeButton}</div>
        <div className="px-6 pb-8 pt-0">
          <WhatIsEmberContent joinHref={joinHref} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
