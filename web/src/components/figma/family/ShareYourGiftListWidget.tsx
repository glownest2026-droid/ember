'use client';

import { useState, useCallback } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { getOrCreateGiftShareSlug } from '@/lib/gift/actions';

/** Share your gift list: Copy link + Preview. Slug is created on first use. */
export function ShareYourGiftListWidget() {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
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
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
    }
  }, [ensureSlug]);

  const handlePreview = useCallback(async () => {
    setPreviewError(null);
    const slug = await ensureSlug();
    if (!slug) return;
    window.open(`/gift/${slug}`, '_blank', 'noopener,noreferrer');
  }, [ensureSlug]);

  return (
    <div
      className="rounded-2xl p-5 border-2 border-[#E5E7EB] bg-[#F9FAFB] shadow-sm"
      style={{ borderColor: 'var(--ember-border-subtle, #E5E7EB)' }}
    >
      <h3 className="text-lg font-medium text-[#1A1E23] mb-2">
        Share your gift list
      </h3>
      <p className="text-sm text-[#5C646D] mb-4 leading-relaxed">
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
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white border-2 border-[#E5E7EB] text-[#1A1E23] hover:bg-[#F5F5F5] transition-colors"
        >
          <ExternalLink className="w-4 h-4" aria-hidden />
          Preview
        </button>
      </div>
    </div>
  );
}
