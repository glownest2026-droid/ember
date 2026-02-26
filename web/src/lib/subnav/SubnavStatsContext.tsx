'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface SubnavStats {
  toysSaved: number;
  /** From get_my_subnav_stats gifts_saved_count (user_list_items where gift = true). */
  giftsSaved: number;
  categoryIdeasSaved: number;
  remindersEnabled: boolean;
}

interface SubnavStatsContextValue {
  user: User | null;
  stats: SubnavStats | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const defaultStats: SubnavStats = {
  toysSaved: 0,
  giftsSaved: 0,
  categoryIdeasSaved: 0,
  remindersEnabled: false,
};

const SubnavStatsContext = createContext<SubnavStatsContextValue>({
  user: null,
  stats: null,
  loading: true,
  refetch: async () => {},
});

export function SubnavStatsProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<SubnavStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) {
      setStats(null);
      return;
    }
    const { data, error } = await supabase.rpc('get_my_subnav_stats');
    if (error) {
      setStats({ ...defaultStats });
      return;
    }
    const raw = data as { toys_saved_count?: number; ideas_saved_count?: number; gifts_saved_count?: number; development_reminders_enabled?: boolean } | null;
    let giftsSaved = typeof raw?.gifts_saved_count === 'number' ? raw.gifts_saved_count : 0;
    // If RPC doesn't return gifts_saved_count (migration not applied), fetch from user_list_items
    // so subnav matches the /family My list count (same source of truth).
    if (typeof raw?.gifts_saved_count !== 'number') {
      const { count } = await supabase
        .from('user_list_items')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', u.id)
        .eq('gift', true);
      giftsSaved = typeof count === 'number' ? count : 0;
    }
    setStats({
      toysSaved: typeof raw?.toys_saved_count === 'number' ? raw.toys_saved_count : 0,
      giftsSaved,
      categoryIdeasSaved: typeof raw?.ideas_saved_count === 'number' ? raw.ideas_saved_count : 0,
      remindersEnabled: Boolean(raw?.development_reminders_enabled),
    });
  }, []);

  const refetch = useCallback(async () => {
    if (!user) return;
    await fetchStats();
  }, [user, fetchStats]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setStats(null);
      return;
    }
    fetchStats();
  }, [user, fetchStats]);

  const value: SubnavStatsContextValue = {
    user,
    stats,
    loading,
    refetch,
  };

  return (
    <SubnavStatsContext.Provider value={value}>
      {children}
    </SubnavStatsContext.Provider>
  );
}

export function useSubnavStats(): SubnavStatsContextValue {
  return useContext(SubnavStatsContext);
}
