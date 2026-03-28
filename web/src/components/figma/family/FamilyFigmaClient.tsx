'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Plus, Sparkles, Eye, RefreshCw, ArrowRight, Gift, Search, Camera, Check } from 'lucide-react';
import { ShareYourGiftListWidget } from './ShareYourGiftListWidget';
import type { FamilyChild } from './ChildProfileCard';
import type { ChildStats } from './ChildProfileCard';
import { FamilyRemindersTopicCard } from './FamilyRemindersTopicCard';

/** Per-child stats from get_my_subnav_stats RPC. */
interface SubnavStatsRaw {
  toys_saved_count?: number;
  ideas_saved_count?: number;
  gifts_saved_count?: number;
}

interface ChildWithStats extends FamilyChild {
  stats?: ChildStats | null;
}

/** Manage My Family page – Figma Make layout exact. Data: children table + get_my_subnav_stats(p_child_id). */
export function FamilyFigmaClient({
  serverUserId,
  saved = false,
  deleted = false,
  initialChildId,
}: {
  /** User id from server auth – used to fetch children immediately without waiting for client context. */
  serverUserId?: string;
  saved?: boolean;
  deleted?: boolean;
  initialChildId?: string;
} = {}) {
  const [children, setChildren] = useState<ChildWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Child selection is driven by the existing global subnav switcher (`?child=<uuid>`).
  // We also keep `initialChildId` for server-first loads.
  const urlChildId = (searchParams.get('child') ?? '').trim();
  const selectedChildId = urlChildId || (initialChildId ?? '');
  const [selectedView, setSelectedView] = useState<string>(selectedChildId || 'all');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddQuery, setQuickAddQuery] = useState('');
  const [quickAddMatch, setQuickAddMatch] = useState<string | null>(null);
  const [quickAddAssignTo, setQuickAddAssignTo] = useState<string>('unsure');

  const fetchChildren = useCallback(async () => {
    const userId = serverUserId;
    if (!userId) {
      setChildren([]);
      return;
    }
    const supabase = createClient();

    const { data: fullData, error: fullError } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band, child_name, display_name')
      .eq('user_id', userId)
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false });
    if (!fullError && fullData != null) {
      const list = fullData as FamilyChild[];
      setChildren(list.map((c) => ({ ...c, stats: null })));
      return;
    }

    const { data: dataWithChildName, error: err1 } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band, child_name')
      .eq('user_id', userId)
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false });
    if (!err1 && dataWithChildName != null) {
      const list = dataWithChildName as FamilyChild[];
      setChildren(list.map((c) => ({ ...c, stats: null })));
      return;
    }

    const { data: dataWithDisplayName, error: err2 } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band, display_name')
      .eq('user_id', userId)
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false });
    if (!err2 && dataWithDisplayName != null) {
      const list = dataWithDisplayName.map((r) => ({
        ...r,
        child_name: (r as { display_name?: string | null }).display_name ?? null,
      })) as FamilyChild[];
      setChildren(list.map((c) => ({ ...c, stats: null })));
      return;
    }

    const { data: minimalData, error: err3 } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band')
      .eq('user_id', userId)
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false });
    if (err3 || !minimalData) {
      setChildren([]);
      return;
    }
    const list = (minimalData ?? []) as FamilyChild[];
    setChildren(list.map((c) => ({ ...c, stats: null })));
  }, [serverUserId]);

  const fetchStatsForChild = useCallback(async (childId: string): Promise<ChildStats> => {
    const supabase = createClient();
    const { data } = await supabase.rpc('get_my_subnav_stats', {
      p_child_id: childId,
    });
    const raw = data as SubnavStatsRaw | null;
    return {
      ideas: typeof raw?.ideas_saved_count === 'number' ? raw.ideas_saved_count : 0,
      toys: typeof raw?.toys_saved_count === 'number' ? raw.toys_saved_count : 0,
      gifts: typeof raw?.gifts_saved_count === 'number' ? raw.gifts_saved_count : 0,
    };
  }, []);

  useEffect(() => {
    if (!serverUserId) {
      setChildren([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    let cancelled = false;
    (async () => {
      await fetchChildren();
      if (cancelled) return;
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [serverUserId, fetchChildren]);

  const childIdsKey = children.map((c) => c.id).join(',');
  useEffect(() => {
    if (!childIdsKey) return;
    let cancelled = false;
    const run = async () => {
      const ids = childIdsKey.split(',').filter(Boolean);
      const results = await Promise.all(
        ids.map(async (id) => ({ id, stats: await fetchStatsForChild(id) }))
      );
      if (cancelled) return;
      setChildren((prev) =>
        prev.map((c) => {
          const r = results.find((x) => x.id === c.id);
          return r ? { ...c, stats: r.stats } : c;
        })
      );
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [childIdsKey, fetchStatsForChild]);

  useEffect(() => {
    if (!selectedChildId || !children.some((c) => c.id === selectedChildId)) return;
    const el = document.getElementById(`child-profile-${selectedChildId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedChildId, children]);

  useEffect(() => {
    if (!selectedChildId) return;
    setSelectedView(selectedChildId);
  }, [selectedChildId]);

  const selectedChild = selectedView !== 'all'
    ? children.find((c) => c.id === selectedView) ?? null
    : null;

  const totals = children.reduce(
    (acc, c) => {
      acc.ideas += c.stats?.ideas ?? 0;
      acc.toys += c.stats?.toys ?? 0;
      acc.gifts += c.stats?.gifts ?? 0;
      return acc;
    },
    { ideas: 0, toys: 0, gifts: 0 }
  );

  const counters = selectedChild?.stats ?? totals;
  const scopedChild = selectedChild;
  const scopedChildId = scopedChild?.id ?? null;

  const discoverHref = scopedChildId ? `/discover?child=${encodeURIComponent(scopedChildId)}` : '/discover';
  const myIdeasIdeasHref = scopedChildId
    ? `/my-ideas?tab=ideas&child=${encodeURIComponent(scopedChildId)}`
    : '/my-ideas?tab=ideas';
  const myIdeasProductsHref = scopedChildId
    ? `/my-ideas?tab=products&child=${encodeURIComponent(scopedChildId)}`
    : '/my-ideas?tab=products';
  const marketplaceHref = scopedChildId ? `/marketplace?child=${encodeURIComponent(scopedChildId)}` : '/marketplace';

  const childLabel = (() => {
    if (!scopedChild) return 'your household';
    const idx = children.findIndex((c) => c.id === scopedChild.id);
    const fallback = `Child ${Math.max(1, idx + 1)}`;
    const name = (scopedChild.child_name || scopedChild.display_name)?.trim();
    return name || fallback;
  })();

  const pulseText = (() => {
    if (selectedChild) return `${childLabel} is in an active learning stage right now.`;
    const names = children
      .map((c, idx) => (c.child_name || c.display_name)?.trim() || `Child ${idx + 1}`)
      .slice(0, 3);
    if (names.length >= 3) return `${names[0]}, ${names[1]} and ${names[2]} are in active learning stages.`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are in active learning stages.`;
    if (names.length === 1) return `${names[0]} is in an active learning stage right now.`;
    return 'Your household is in an active learning stage right now.';
  })();

  const actionSubtitle = selectedView === 'all'
    ? 'Top actions for your household right now'
    : `Top actions for ${childLabel} right now`;

  const suggestedMatches = quickAddQuery.length > 2
    ? [
        { id: '1', name: 'Shopping Till Playset', brand: 'Melissa & Doug', age: '3+ years', emoji: '🛒' },
        { id: '2', name: 'Wooden Shopping Cart', brand: 'Le Toy Van', age: '2+ years', emoji: '🛍️' },
        { id: '3', name: 'Cash Register Toy', brand: 'Fisher-Price', age: '2+ years', emoji: '💰' },
      ]
    : [];

  const quickAddOptions = [
    ...(children.map((c, idx) => ({
      value: c.id,
      label: (c.child_name || c.display_name)?.trim() || `Child ${idx + 1}`,
      age: c.age_band || 'Child',
    }))),
    { value: 'shared', label: 'Shared', age: 'Both' },
    { value: 'unsure', label: 'Not sure', age: 'Decide later' },
  ];

  const handleQuickAdd = useCallback(() => {
    const childParam = quickAddAssignTo !== 'shared' && quickAddAssignTo !== 'unsure'
      ? `?child=${encodeURIComponent(quickAddAssignTo)}`
      : '';
    setQuickAddOpen(false);
    setQuickAddQuery('');
    setQuickAddMatch(null);
    setQuickAddAssignTo('unsure');
    router.push(`/discover${childParam}`);
  }, [quickAddAssignTo, router]);

  const handleSelectView = useCallback((view: string) => {
    setSelectedView(view);
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'all') {
      params.delete('child');
    } else {
      params.set('child', view);
    }
    const query = params.toString();
    router.replace(query ? `/family?${query}` : '/family', { scroll: false });
  }, [router, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#5C646D]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="w-full py-6 sm:py-8">
        <div className="grid grid-cols-1">
          <div className="max-w-[90rem]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-2">Family</h1>
                <p className="text-sm sm:text-base text-[#5C646D]">{pulseText}</p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <Link
                  href="/add-children"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-[#FFF5F3] text-[#FF6347] hover:bg-[#FF6347] hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add child
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => handleSelectView('all')}
                className={`rounded-lg h-9 px-4 text-sm transition-colors ${
                  selectedView === 'all'
                    ? 'bg-[#FF6347] text-white hover:bg-[#B8432B]'
                    : 'text-[#5C646D] hover:text-[#1A1E23] hover:bg-[#F1F3F2]'
                }`}
              >
                All
              </button>
              {children.map((c, idx) => {
                const label = (c.child_name || c.display_name)?.trim() || `Child ${idx + 1}`;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectView(c.id)}
                    className={`rounded-lg h-9 px-4 text-sm transition-colors ${
                      selectedView === c.id
                        ? 'bg-[#FF6347] text-white hover:bg-[#B8432B]'
                        : 'text-[#5C646D] hover:text-[#1A1E23] hover:bg-[#F1F3F2]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {saved && (
              <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">
                Profile saved
              </div>
            )}
            {deleted && (
              <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">
                Profile deleted
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB]">
                <Sparkles className="w-4 h-4 text-[#FF6347]" />
                <span className="text-sm font-medium text-[#1A1E23]">{counters.ideas}</span>
                <span className="text-sm text-[#5C646D]">ideas</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB]">
                <RefreshCw className="w-4 h-4 text-[#FF6347]" />
                <span className="text-sm font-medium text-[#1A1E23]">{counters.toys}</span>
                <span className="text-sm text-[#5C646D]">products</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5E7EB]">
                <Gift className="w-4 h-4 text-[#FF6347]" />
                <span className="text-sm font-medium text-[#1A1E23]">{counters.gifts}</span>
                <span className="text-sm text-[#5C646D]">gifts</span>
              </div>
            </div>

            <section className="mb-6">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#1A1E23] mb-0.5">
                    What to do next
                  </h2>
                  <p className="text-sm text-[#5C646D]">{actionSubtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuickAddOpen(true);
                  }}
                  className="group text-left rounded-2xl px-5 py-5 lg:px-6 lg:py-6 min-h-[168px] bg-gradient-to-br from-[#FF6347] to-[#FF8870] text-white shadow-[0_8px_24px_rgba(255,99,71,0.22)] hover:shadow-[0_10px_28px_rgba(255,99,71,0.26)] transition-all block"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0 leading-tight">Add what&apos;s in your house</h3>
                      <p className="text-sm text-white/90 mt-1 leading-snug">Type or snap - we&apos;ll match it.</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-medium mt-1">
                    Quick add
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href={myIdeasIdeasHref}
                  className="group text-left rounded-2xl p-5 min-h-[168px] bg-white border border-[#E5E7EB] hover:border-[#FF6347]/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF6347]/10">
                      <Eye className="w-5 h-5 text-[#FF6347]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0">Continue exploring</h3>
                      <p className="text-sm text-[#5C646D] mt-0.5">
                        {selectedView === 'all' ? 'Narrow down from your saved interests.' : `Refine saved ideas for ${childLabel}.`}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium" style={{ color: '#FF6347' }}>
                    Review saves
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href={myIdeasProductsHref}
                  className="group text-left rounded-2xl p-5 min-h-[168px] bg-white border border-[#E5E7EB] hover:border-[#FF6347]/50 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF6347]/10">
                      <RefreshCw className="w-5 h-5 text-[#FF6347]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0">Review ready-to-move items</h3>
                      <p className="text-sm text-[#5C646D] mt-0.5">
                        {selectedView === 'all' ? 'Quick decisions on outgrown items.' : `See what ${childLabel} may be outgrowing.`}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium" style={{ color: '#FF6347' }}>
                    Review
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>

            <section className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href={discoverHref}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#FF6347]/60 hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6347]/10">
                      <Sparkles className="w-4 h-4 text-[#FF6347]" />
                    </div>
                    <h3 className="text-base font-medium text-[#1A1E23] m-0">Learn it</h3>
                  </div>
                  <p className="text-sm text-[#5C646D]">
                    {selectedView === 'all' ? 'Stage guidance for your children' : `What ${childLabel} is learning now`}
                  </p>
                </Link>

                <Link
                  href={myIdeasIdeasHref}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#FF6347]/60 hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6347]/10">
                      <Eye className="w-4 h-4 text-[#FF6347]" />
                    </div>
                    <h3 className="text-base font-medium text-[#1A1E23] m-0">Find it</h3>
                  </div>
                  <p className="text-sm text-[#5C646D]">
                    {counters.toys} products saved - compare and narrow down
                  </p>
                </Link>

                <Link
                  href={myIdeasProductsHref}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#FF6347]/60 hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6347]/10">
                      <RefreshCw className="w-4 h-4 text-[#FF6347]" />
                    </div>
                    <h3 className="text-base font-medium text-[#1A1E23] m-0">At home</h3>
                  </div>
                  <p className="text-sm text-[#5C646D]">
                    {counters.toys} items logged - what you already own
                  </p>
                </Link>

                <Link
                  href={marketplaceHref}
                  className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#FF6347]/60 hover:shadow-sm transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF6347]/10">
                      <Gift className="w-4 h-4 text-[#FF6347]" />
                    </div>
                    <h3 className="text-base font-medium text-[#1A1E23] m-0">Move it on</h3>
                  </div>
                  <p className="text-sm text-[#5C646D]">
                    {selectedView === 'all' ? 'Items that may be outgrown soon' : `What ${childLabel} may be ready to move on`}
                  </p>
                </Link>
              </div>

              {serverUserId && <FamilyRemindersTopicCard serverUserId={serverUserId} />}
            </section>

            <div className="mt-4 max-w-2xl">
              <ShareYourGiftListWidget compact />
            </div>
          </div>
        </div>
      </main>

      {quickAddOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setQuickAddOpen(false)}
            aria-label="Close quick add modal"
          />
          <div className="relative w-full max-w-[600px] rounded-2xl bg-white border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6347]/10 to-[#FF8870]/10">
                <Sparkles className="w-6 h-6 text-[#FF6347]" />
              </span>
              <h3 className="text-2xl text-[#1A1E23]">What&apos;s in your house?</h3>
            </div>
            <p className="text-base text-[#5C646D] mb-4">Tell us what you see - we&apos;ll help you match it</p>

            <div className="space-y-5">
              <div>
                <label htmlFor="quick-add-search" className="block text-sm font-medium text-[#1A1E23] mb-2">
                  Describe the toy or item
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C646D]" />
                  <input
                    id="quick-add-search"
                    type="text"
                    value={quickAddQuery}
                    onChange={(e) => setQuickAddQuery(e.target.value)}
                    placeholder="e.g., wooden blocks, sensory mat, toy kitchen..."
                    className="w-full h-12 rounded-xl border border-[#E5E7EB] pl-11 pr-3 text-sm outline-none focus:border-[#FF6347]"
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full h-12 rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#FF6347] hover:bg-[#FFF5F3] text-sm inline-flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5 text-[#FF6347]" />
                Or snap a photo
              </button>

              {suggestedMatches.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1A1E23]">Is it one of these?</p>
                  {suggestedMatches.map((match) => (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => setQuickAddMatch(match.id)}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                        quickAddMatch === match.id
                          ? 'border-[#FF6347] bg-gradient-to-br from-[#FFF5F3] to-white'
                          : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      <span className="w-11 h-11 rounded-xl bg-[#F1F3F2] flex items-center justify-center text-xl">{match.emoji}</span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-[#1A1E23]">{match.name}</span>
                        <span className="block text-xs text-[#5C646D]">{match.brand} - {match.age}</span>
                      </span>
                      {quickAddMatch === match.id && (
                        <span className="w-6 h-6 rounded-full bg-[#FF6347] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {(quickAddQuery || quickAddMatch) && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1A1E23]">Who&apos;s it for?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickAddOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setQuickAddAssignTo(option.value)}
                        className={`px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                          quickAddAssignTo === option.value
                            ? 'border-[#FF6347] bg-gradient-to-br from-[#FFF5F3] to-white'
                            : 'border-[#E5E7EB] bg-white'
                        }`}
                      >
                        <span className="block text-sm font-medium text-[#1A1E23]">{option.label}</span>
                        <span className="block text-xs text-[#5C646D] mt-0.5">{option.age}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setQuickAddOpen(false)}
                className="flex-1 h-12 rounded-xl border border-[#E5E7EB] text-sm text-[#1A1E23] hover:bg-[#F7F7F7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={!quickAddQuery && !quickAddMatch}
                className="flex-1 h-12 rounded-xl text-sm font-medium bg-gradient-to-br from-[#FF6347] to-[#FF8870] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
