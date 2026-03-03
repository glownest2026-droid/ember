'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Settings as SettingsIcon } from 'lucide-react';
import { ChildProfilesSection } from './ChildProfilesSection';
import { ImageWithFallback } from './ImageWithFallback';
import { Heart } from 'lucide-react';
import type { FamilyChild } from './ChildProfileCard';
import type { ChildStats } from './ChildProfileCard';

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
  saved = false,
  deleted = false,
  initialChildId,
}: {
  saved?: boolean;
  deleted?: boolean;
  initialChildId?: string;
} = {}) {
  const [children, setChildren] = useState<ChildWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as FamilyChild[];
    setChildren(list.map((c) => ({ ...c, stats: null })));
  }, []);

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
    let cancelled = false;
    (async () => {
      await fetchChildren();
      if (cancelled) return;
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchChildren]);

  const childIds = children.map((c) => c.id).join(',');
  useEffect(() => {
    if (children.length === 0) return;
    let cancelled = false;
    const run = async () => {
      const results = await Promise.all(
        children.map(async (c) => ({ id: c.id, stats: await fetchStatsForChild(c.id) }))
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
  }, [childIds, fetchStatsForChild]);

  useEffect(() => {
    if (!initialChildId || !children.some((c) => c.id === initialChildId)) return;
    const el = document.getElementById(`child-profile-${initialChildId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [initialChildId, children]);

  const handleEditChild = (id: string) => {
    window.location.href = `/add-children/${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-[#5C646D]">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="max-w-[90rem] mx-auto px-6 lg:px-12 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 sm:gap-8">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-normal text-[#1A1E23] mb-2">
                  Manage My Family
                </h1>
                <p className="text-sm sm:text-base text-[#5C646D]">
                  Your children and their stages in one place.
                </p>
              </div>
              <Link
                href="/account"
                className="inline-flex items-center gap-2 text-[#5C646D] hover:text-[#1A1E23] self-start px-2 py-1.5 rounded-md hover:bg-black/5"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Link>
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

            <ChildProfilesSection children={children} />

            <div className="mt-6">
              <Link
                href="/my-ideas"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium bg-[#FF6347] text-white hover:bg-[#B8432B] transition-colors"
              >
                Go to My ideas
              </Link>
            </div>
          </div>

          <div className="hidden lg:block space-y-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771185716712-489c544632f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Child playing at home"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E23]/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-lg font-medium mb-1">Every stage is special</p>
                <p className="text-sm opacity-90">Capture the moments that matter</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1691624546911-61cad4c17760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Baby in nursery"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1769720200206-40ea493dbc95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Child learning and playing"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-[#E5E7EB] shadow-sm">
              <Heart className="w-8 h-8 text-[#FF6347] fill-[#FF6347] mb-3" />
              <h3 className="text-lg font-medium text-[#1A1E23] mb-2">
                Growing together
              </h3>
              <p className="text-sm text-[#5C646D] leading-relaxed">
                From first smiles to big milestones, Ember helps you find exactly what you need for each precious stage.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
