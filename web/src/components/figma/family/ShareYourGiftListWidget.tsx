'use client';

import { useState, useCallback } from 'react';
import { Copy, ExternalLink, Gift } from 'lucide-react';
import { getOrCreateGiftShareSlug } from '@/lib/gift/actions';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';

/** Share your gift list: Copy link + Preview. Slug is created on first use. */
export function ShareYourGiftListWidget({ compact = false }: { compact?: boolean } = {}) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const ensureSlug = useCallback(async (): Promise<string | null> => {
    const result = await getOrCreateGiftShareSlug();
    if (!result) return null;
    if ('error' in result) {
      setPreviewError(result.error);
      return null;
    }
    return result.slug;
  }, []);

  const handleCopyLink = useCallback(async () => {
    setCopyStatus('idle');
    setPreviewError(null);
    const slug = await ensureSlug();
    if (!slug) {
      setCopyStatus('error');
      return;
    }
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/gift/${slug}`;
    try {
      await navigator.clipboard.writeText(url);

      // PostHog FOUNDATION: gift list share copied.
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user?.id) {
          trackEvent(EVENTS.GIFT_PAGE_SHARED, {
            user_id: data.user.id,
            gift_share_slug: slug,
            share_surface: compact ? 'family' : 'my_ideas',
          });
        }
      } catch {
        // Fail closed
      }

      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
    }
  }, [ensureSlug, compact]);

  const handlePreview = useCallback(async () => {
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const slug = await ensureSlug();
      if (!slug) return;
      window.open(`/gift/${slug}`, '_blank', 'noopener,noreferrer');
    } finally {
      setPreviewLoading(false);
    }
  }, [ensureSlug]);

  return (
    <div
      className={`rounded-2xl border-2 border-[#E5E7EB] bg-[#F9FAFB] shadow-sm ${compact ? 'p-4' : 'p-5'}`}
      style={{ borderColor: 'var(--ember-border-subtle, #E5E7EB)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF6347]/10">
          <Gift className="w-4 h-4 text-[#FF6347]" />
        </span>
        <h3 className={`${compact ? 'text-base' : 'text-lg'} font-medium text-[#1A1E23]`}>
          Share your gift list
        </h3>
      </div>
      <p className={`text-sm text-[#5C646D] ${compact ? 'mb-3' : 'mb-4'} leading-relaxed`}>
        Send this link to family. They&apos;ll only see items marked Gift.
      </p>
      {previewError && (
        <p className="text-sm text-red-600 mb-2">{previewError}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#FF6347] text-white hover:bg-[#B8432B] transition-colors"
        >
          <Copy className="w-4 h-4" aria-hidden />
          {copyStatus === 'copied' ? 'Link copied' : 'Copy link'}
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={previewLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border-2 border-[#E5E7EB] text-[#1A1E23] hover:bg-[#F5F5F5] transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
          {previewLoading ? 'Loading...' : 'Preview'}
        </button>
      </div>
    </div>
  );
}
