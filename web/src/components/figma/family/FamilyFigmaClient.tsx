'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Settings as SettingsIcon, Plus, Sparkles, Eye, RefreshCw, ArrowRight, Gift } from 'lucide-react';
import { ChildProfilesSection } from './ChildProfilesSection';
import { ImageWithFallback } from './ImageWithFallback';
import { ShareYourGiftListWidget } from './ShareYourGiftListWidget';
import { suppressChild } from '@/lib/children/actions';
import type { FamilyChild } from './ChildProfileCard';
import type { ChildStats } from './ChildProfileCard';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavSwitch } from '@/components/subnav/SubnavSwitch';

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
  const searchParams = useSearchParams();

  // Child selection is driven by the existing global subnav switcher (`?child=<uuid>`).
  // We also keep `initialChildId` for server-first loads.
  const urlChildId = (searchParams.get('child') ?? '').trim();
  const selectedChildId = urlChildId || (initialChildId ?? '');

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

  const selectedChild = selectedChildId
    ? children.find((c) => c.id === selectedChildId) ?? null
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

  const primaryChild = selectedChild ?? children[0] ?? null;
  const primaryChildId = primaryChild?.id ?? null;

  const discoverHref = primaryChildId ? `/discover?child=${encodeURIComponent(primaryChildId)}` : '/discover';
  const myIdeasIdeasHref = primaryChildId
    ? `/my-ideas?tab=ideas&child=${encodeURIComponent(primaryChildId)}`
    : '/my-ideas?tab=ideas';
  const myIdeasProductsHref = primaryChildId
    ? `/my-ideas?tab=products&child=${encodeURIComponent(primaryChildId)}`
    : '/my-ideas?tab=products';
  const marketplaceHref = primaryChildId ? `/marketplace?child=${encodeURIComponent(primaryChildId)}` : '/marketplace';

  const childLabel = (() => {
    if (!primaryChild) return 'your household';
    const idx = children.findIndex((c) => c.id === primaryChild.id);
    const fallback = `Child ${Math.max(1, idx + 1)}`;
    const name = (primaryChild.child_name || primaryChild.display_name)?.trim();
    return name || fallback;
  })();

  const { user, stats: subnavStats, refetch } = useSubnavStats();
  const remindersEnabled = subnavStats?.remindersEnabled ?? false;
  const [remindersBusy, setRemindersBusy] = useState(false);

  const handleRemindersChange = useCallback(
    async (checked: boolean) => {
      if (!user) return;
      setRemindersBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('user_notification_prefs')
          .upsert(
            { user_id: user.id, development_reminders_enabled: checked },
            { onConflict: 'user_id' }
          );
        if (!error) await refetch();
      } finally {
        setRemindersBusy(false);
      }
    },
    [user, refetch]
  );

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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 sm:gap-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-2">
                  Your family
                </h1>
                <p className="text-sm sm:text-base text-[#5C646D]">
                  Keep your household one step ahead.{' '}
                  {primaryChild ? `Focused on ${childLabel}.` : 'Add a child to get tailored next steps.'}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <Link
                  href="/add-children"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-[#FFF5F3] text-[#FF6347] hover:bg-[#FF6347] hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add child
                </Link>
                <Link
                  href="/account"
                  className="inline-flex items-center gap-2 text-[#5C646D] hover:text-[#1A1E23] px-2 py-1.5 rounded-md hover:bg-black/5"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </Link>
              </div>
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

            <div className="flex flex-wrap items-center gap-3 mb-6">
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

            <section className="mb-8">
              <div className="flex items-end justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-medium text-[#1A1E23] mb-0.5">
                    What to do next
                  </h2>
                  <p className="text-sm text-[#5C646D]">
                    Action-led next steps for {primaryChild ? childLabel : 'your household'}.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href={discoverHref}
                  className="group text-left rounded-2xl p-5 bg-gradient-to-br from-[#FF6347] to-[#FF8870] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0">Add what you already have</h3>
                      <p className="text-sm text-white/90 mt-0.5">
                        Browse Discover and save to your home list.
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium mt-1">
                    Quick add
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href={myIdeasIdeasHref}
                  className="group text-left rounded-2xl p-5 bg-white border border-[#E5E7EB] hover:border-[#FF6347] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF6347]/10">
                      <Eye className="w-5 h-5 text-[#FF6347]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0">Continue exploring</h3>
                      <p className="text-sm text-[#5C646D] mt-0.5">
                        Keep going with your saved ideas.
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium" style={{ color: '#FF6347' }}>
                    My list
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  href={myIdeasProductsHref}
                  className="group text-left rounded-2xl p-5 bg-white border border-[#E5E7EB] hover:border-[#FF6347] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FF6347]/10">
                      <RefreshCw className="w-5 h-5 text-[#FF6347]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-medium m-0">Review move-on items</h3>
                      <p className="text-sm text-[#5C646D] mt-0.5">
                        Decide what to pass on next.
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 font-medium" style={{ color: '#FF6347' }}>
                    Open products
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>

            <section className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="text-sm text-[#5C646D]">Stage-aware next steps</p>
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
                  <p className="text-sm text-[#5C646D]">Products that match your interests</p>
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
                  <p className="text-sm text-[#5C646D]">Your saved + owned items</p>
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
                  <p className="text-sm text-[#5C646D]">Pass on what&apos;s outgrown</p>
                </Link>
              </div>

              <div className="mt-6 lg:hidden">
                <div
                  className="rounded-2xl border p-5 bg-white"
                  style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-[#1A1E23]">Remind me</h3>
                    <SubnavSwitch
                      checked={remindersEnabled}
                      onCheckedChange={handleRemindersChange}
                      disabled={remindersBusy || !user}
                      aria-label="Toggle development reminders"
                    />
                  </div>
                  <p className="text-xs text-[#5C646D]">A gentle reminder email when your child hits the next stage.</p>
                </div>
              </div>
            </section>

            <div className="mt-6 lg:hidden">
              <ShareYourGiftListWidget />
            </div>

            <ChildProfilesSection
              familyChildren={children}
              onRemove={async (id) => {
                const result = await suppressChild(id);
                if (!result?.error) fetchChildren();
              }}
            />
          </div>

          <aside className="hidden lg:block space-y-6 self-start">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771185716712-489c544632f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Child playing at home"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E23]/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-medium mb-1">Keep the home in sync</p>
                <p className="text-sm opacity-90">Your next steps update automatically when you switch children.</p>
              </div>
            </div>

            <div className="rounded-3xl border p-6 bg-white" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-[#1A1E23]">Remind me</h3>
                <SubnavSwitch
                  checked={remindersEnabled}
                  onCheckedChange={handleRemindersChange}
                  disabled={remindersBusy || !user}
                  aria-label="Toggle development reminders"
                />
              </div>
              <p className="text-xs text-[#5C646D]">A gentle email when your child hits the next stage.</p>
            </div>

            <ShareYourGiftListWidget />
          </aside>
        </div>
      </main>
    </div>
  );
}
