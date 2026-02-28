'use client';

import { useEffect, useRef, useState } from 'react';
import { DiscoverCardStack } from '@/components/discover/DiscoverCardStack';
import type { GatewayPick } from '@/lib/pl/public';

const SURFACE_STYLE = {
  backgroundColor: 'var(--ember-surface-primary)',
  borderRadius: '12px',
  boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
};

export interface FamilyExamplesModalProps {
  open: boolean;
  onClose: () => void;
  ideaTitle: string;
  categoryTypeId: string;
  ageBandId: string | null;
  /** When set (e.g. for idea kind), API is called with wrapperSlug instead of categoryTypeId. */
  wrapperSlug?: string | null;
  onSave: (productId: string, triggerEl: HTMLButtonElement | null) => void;
  onHave: (productId: string) => void;
  getProductUrl: (pick: GatewayPick) => string;
  ageRangeLabel?: string;
}

export function FamilyExamplesModal({
  open,
  onClose,
  ideaTitle,
  categoryTypeId,
  ageBandId,
  wrapperSlug = null,
  onSave,
  onHave,
  getProductUrl,
  ageRangeLabel = 'My child',
}: FamilyExamplesModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [picks, setPicks] = useState<GatewayPick[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const useWrapper = wrapperSlug && typeof wrapperSlug === 'string';
    const useCategory = categoryTypeId && typeof categoryTypeId === 'string';
    if (!open || (!useWrapper && !useCategory)) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (ageBandId) params.set('ageBandId', ageBandId);
    if (useWrapper) params.set('wrapperSlug', wrapperSlug);
    else if (useCategory) params.set('categoryTypeId', categoryTypeId);
    fetch(`/api/discover/picks?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { picks?: GatewayPick[] }) => {
        setPicks(Array.isArray(data.picks) ? data.picks : []);
      })
      .catch(() => setPicks([]))
      .finally(() => setLoading(false));
  }, [open, categoryTypeId, ageBandId, wrapperSlug]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-center sm:justify-start sm:pt-12 px-4 pb-8"
      aria-modal="true"
      role="dialog"
      aria-labelledby="family-examples-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={handleOverlayClick} aria-hidden />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-lg mx-auto rounded-xl overflow-y-auto max-h-[90vh] flex flex-col"
        style={{ ...SURFACE_STYLE, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-between gap-4 p-4 pb-2 shrink-0">
          <h2
            id="family-examples-modal-title"
            className="text-lg font-medium m-0 truncate"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
          >
            Examples for {ideaTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#E5E7EB] transition-colors shrink-0"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-6 pt-0 flex-1 min-h-0">
          {loading ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--ember-text-low)' }}>
              Loading examples…
            </p>
          ) : picks.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--ember-text-low)' }}>
              No examples for this idea right now.
            </p>
          ) : (
            <DiscoverCardStack
              picks={picks}
              ageRangeLabel={ageRangeLabel}
              wrapperLabel={ideaTitle}
              onSave={onSave}
              onHave={onHave}
              getProductUrl={getProductUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}
