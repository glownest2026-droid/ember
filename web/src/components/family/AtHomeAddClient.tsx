'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Check, Home, Search, Sparkles } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  AT_HOME_HERO_IMAGES,
  confidenceLabel,
  matchStage2Categories,
  saveAtHomeFromStage2Match,
  type Stage2MatchCandidate,
} from '@/lib/inventory/atHome';

const RAW_LISTING_BUCKET = 'marketplace-raw-listing-photos';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MATCH_MIN_CHARS = 2;

function getFileExtension(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName) return fromName;
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

export function AtHomeAddClient({
  initialChildId,
}: {
  initialChildId?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<Stage2MatchCandidate[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [photoHint, setPhotoHint] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const backHref = initialChildId
    ? `/family/at-home?child=${encodeURIComponent(initialChildId)}`
    : '/family/at-home';

  const runMatch = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (q.length < MATCH_MIN_CHARS) {
        setCandidates([]);
        setMatchError(null);
        return;
      }
      setMatchLoading(true);
      setMatchError(null);
      const { candidates: next, error } = await matchStage2Categories({
        query: q,
        childId: initialChildId ?? null,
        limit: 6,
      });
      setCandidates(next);
      setMatchError(error);
      setMatchLoading(false);
    },
    [initialChildId]
  );

  useEffect(() => {
    const q = query.trim();
    if (q.length < MATCH_MIN_CHARS) {
      setCandidates([]);
      return;
    }
    const t = window.setTimeout(() => {
      void runMatch(q);
    }, 280);
    return () => window.clearTimeout(t);
  }, [query, runMatch]);

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setPhotoError(null);
    setPhotoHint(null);
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setPhotoError('Use a JPG, PNG, or WebP photo.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setPhotoError('That photo is a bit large — try under 10MB.');
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setPhotoError('Sign in to add a photo.');
        return;
      }

      let activeDraftId = draftId;
      if (!activeDraftId) {
        const { data: inserted, error: insertError } = await supabase
          .from('marketplace_listing_drafts')
          .insert({ user_id: user.id, status: 'draft' })
          .select('id')
          .single();
        if (insertError || !inserted?.id) {
          throw new Error(insertError?.message ?? 'Could not start photo check.');
        }
        activeDraftId = inserted.id;
        setDraftId(activeDraftId);
      }

      const path = `${user.id}/${activeDraftId}/${Date.now()}-${crypto.randomUUID()}.${getFileExtension(file)}`;
      const { error: uploadError } = await supabase.storage
        .from(RAW_LISTING_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { error: updateError } = await supabase
        .from('marketplace_listing_drafts')
        .update({ image_storage_path: path, status: 'draft' })
        .eq('id', activeDraftId)
        .eq('user_id', user.id);
      if (updateError) throw new Error(updateError.message);

      const { data: signed } = await supabase.storage
        .from(RAW_LISTING_BUCKET)
        .createSignedUrl(path, 60 * 30);
      setPreviewUrl(signed?.signedUrl ?? URL.createObjectURL(file));

      setAnalysing(true);
      const analysisRes = await fetch(
        `/api/marketplace/listing-drafts/${activeDraftId}/analyse-image`,
        { method: 'POST' }
      );
      const analysisJson = (await analysisRes.json()) as {
        detected_item_label?: string;
        candidate_cards?: Array<{ user_facing_item_label?: string; label?: string }>;
        error?: string;
      };
      if (!analysisRes.ok) {
        throw new Error(analysisJson.error ?? 'Could not read that photo. Try typing the name instead.');
      }

      const hinted =
        analysisJson.detected_item_label?.trim() ||
        analysisJson.candidate_cards?.[0]?.user_facing_item_label?.trim() ||
        analysisJson.candidate_cards?.[0]?.label?.trim() ||
        null;

      if (hinted) {
        setPhotoHint(hinted);
        setQuery((prev) => (prev.trim() ? prev : hinted));
        await runMatch(hinted);
      }
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Photo upload failed.');
    } finally {
      setUploading(false);
      setAnalysing(false);
    }
  };

  const handleConfirm = async (candidate: Stage2MatchCandidate) => {
    setSavingId(candidate.category_type_id);
    setSaveError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSaveError('Sign in to save At home.');
        return;
      }

      const saved = await saveAtHomeFromStage2Match({
        userId: user.id,
        categoryTypeId: candidate.category_type_id,
        childId: initialChildId ?? null,
        rawQuery: query.trim() || candidate.label,
        hasPhoto: Boolean(draftId && previewUrl),
        draftId,
      });

      if (saved.error || !saved.itemId) {
        throw new Error(saved.error ?? 'Could not save.');
      }

      const params = new URLSearchParams({ added: '1' });
      if (initialChildId) params.set('child', initialChildId);
      router.replace(`/family/at-home?${params.toString()}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save to At home.');
    } finally {
      setSavingId(null);
    }
  };

  const heroStrip = useMemo(
    () => (
      <div className="grid grid-cols-3 gap-2 mb-5">
        {AT_HOME_HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E7E2DC] bg-[#FBFAF7]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className={`w-full h-full object-cover ${i === 1 ? 'scale-105' : ''}`}
            />
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FF5C34] hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to At home
      </Link>

      {heroStrip}

      <div className="flex items-start gap-3 mb-1">
        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FF5C34]/10 shrink-0">
          <Home className="w-5 h-5 text-[#FF5C34]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#253044] m-0">
            Add to At home
          </h1>
          <p className="text-sm text-[#66717D] mt-1 mb-0">
            Log what is already in the playroom. Ember will guess the closest Discover idea — you confirm.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E7E2DC] bg-white p-4 sm:p-5 space-y-4 shadow-[0_8px_24px_rgba(37,48,68,0.04)]">
        <label className="block">
          <span className="text-sm font-medium text-[#253044]">What is it?</span>
          <div className="mt-1.5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#66717D]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Helmet, white noise machine, kitchen stool…"
              className="w-full min-h-[48px] rounded-xl border border-[#E7E2DC] bg-[#FBFAF7] pl-10 pr-3 text-[0.9375rem] text-[#253044] outline-none focus:ring-2 focus:ring-[#FF5C34]/35"
              autoComplete="off"
              autoFocus
            />
          </div>
        </label>

        <div className="rounded-xl border border-dashed border-[#E7E2DC] bg-[#FBFAF7] p-3.5 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#FF5C34] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#253044] m-0">Add a photo (optional)</p>
              <p className="text-xs text-[#66717D] mt-0.5 mb-0">
                Often sharper — Ember reads the item for you. Also handy if you pass it on later.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl bg-[#FF5C34] px-3.5 py-2 text-sm font-medium text-white">
              <Camera className="w-4 h-4" />
              {uploading || analysing ? 'Checking…' : 'Take photo'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                className="hidden"
                disabled={uploading || analysing}
                onChange={handleFileSelected}
              />
            </label>
            <label className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-[#E7E2DC] bg-white px-3.5 py-2 text-sm font-medium text-[#253044]">
              From gallery
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading || analysing}
                onChange={handleFileSelected}
              />
            </label>
          </div>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Your private photo"
              className="max-h-40 w-full rounded-xl border border-[#E7E2DC] object-contain bg-white"
            />
          )}
          {photoHint && (
            <p className="text-xs text-emerald-800 m-0">
              Ember spotted: <span className="font-medium">{photoHint}</span>
            </p>
          )}
          {photoError && (
            <p className="text-xs text-[#B42318] m-0" role="alert">
              {photoError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-medium text-[#253044] m-0">Closest Discover ideas</h2>
          {matchLoading && <span className="text-xs text-[#66717D]">Guessing…</span>}
        </div>

        {query.trim().length < MATCH_MIN_CHARS && (
          <p className="text-sm text-[#66717D]">
            Type a couple of letters — or add a photo — and Ember will suggest where this sits in the catalogue.
          </p>
        )}

        {matchError && (
          <p className="text-sm text-[#B42318]" role="alert">
            {matchError}
          </p>
        )}

        {!matchLoading &&
          query.trim().length >= MATCH_MIN_CHARS &&
          !matchError &&
          candidates.length === 0 && (
            <p className="text-sm text-[#66717D]">
              No close match yet. Try a plainer name (e.g. “dress up”, “scooter”, “white noise”) or add a photo.
            </p>
          )}

        <ul className="space-y-3 list-none p-0 m-0">
          {candidates.map((c) => (
            <li
              key={c.category_type_id}
              className="rounded-2xl border border-[#E7E2DC] bg-white p-3.5 flex gap-3 items-center"
            >
              <div className="w-16 h-16 rounded-xl bg-[#FBFAF7] border border-[#E7E2DC] overflow-hidden shrink-0 flex items-center justify-center">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Home className="w-5 h-5 text-[#66717D]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-medium text-[#253044] m-0 leading-snug">
                  {c.label}
                </p>
                <p className="text-xs text-[#66717D] mt-1 mb-0">
                  {confidenceLabel(c.confidence_bucket)}
                  {c.age_band_id ? ` · ${c.age_band_id}` : ''}
                </p>
              </div>
              <button
                type="button"
                disabled={Boolean(savingId)}
                onClick={() => void handleConfirm(c)}
                className="shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl text-sm font-medium text-white bg-[#FF5C34] hover:opacity-95 disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                {savingId === c.category_type_id ? 'Saving…' : 'This one'}
              </button>
            </li>
          ))}
        </ul>

        {saveError && (
          <p className="text-sm text-[#B42318] mt-3" role="alert">
            {saveError}
          </p>
        )}
      </div>
    </div>
  );
}
