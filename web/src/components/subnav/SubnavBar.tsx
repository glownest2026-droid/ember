'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Plus, Info, Users } from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavSwitch } from './SubnavSwitch';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { createClient } from '@/utils/supabase/client';
import { useState, useCallback, useEffect } from 'react';

type SubnavChild = {
  id: string;
  child_name?: string | null;
  display_name?: string | null;
  age_band?: string | null;
  gender?: string | null;
};

/** Normalize row from API (snake_case from Postgres) into SubnavChild. Reads child_name/display_name so "Geraldine"/"Alex" show when set. */
function toSubnavChild(r: Record<string, unknown>): SubnavChild {
  const raw = r as Record<string, unknown>;
  const id = (raw.id as string) ?? '';
  const child_name = (raw.child_name ?? raw.childName) as string | null | undefined;
  const display_name = (raw.display_name ?? raw.displayName) as string | null | undefined;
  const age_band = (raw.age_band ?? raw.ageBand) as string | null | undefined;
  const gender = (raw.gender) as string | null | undefined;
  return {
    id,
    child_name: (child_name && String(child_name).trim()) || null,
    display_name: (display_name && String(display_name).trim()) || null,
    age_band: age_band ?? null,
    gender: gender ?? null,
  };
}

/** Map stored gender to display label: Boy / Girl (not "male"/"female"). */
function genderToLabel(gender: string): string {
  const g = gender.trim().toLowerCase();
  if (g === 'male') return 'Boy';
  if (g === 'female') return 'Girl';
  return 'Child'; // other, prefer_not_to_say, or unknown
}

/** Option label: "Name - Aged X" or "Boy/Girl - Aged X" or "Child N". Prefer real name (child_name/display_name). */
function childOptionLabel(c: SubnavChild, index: number): string {
  const name = (c.child_name || c.display_name)?.trim();
  const age = c.age_band?.trim();
  const genderRaw = c.gender?.trim();
  const sep = ' - ';
  if (name) return age ? `${name}${sep}Aged ${age}` : name;
  if (genderRaw) return age ? `${genderToLabel(genderRaw)}${sep}Aged ${age}` : genderToLabel(genderRaw);
  return `Child ${index + 1}`;
}

const REMINDERS_TOOLTIP =
  "We'll automatically send you proactive play ideas at just the right time for your child's next developmental needs.";

export function SubnavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, stats, refetch } = useSubnavStats();
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [children, setChildren] = useState<SubnavChild[]>([]);

  const remindersEnabled = stats?.remindersEnabled ?? false;
  const selectedChildId = searchParams.get('child') ?? '';

  const fetchChildren = useCallback(() => {
    if (!user?.id) return;
    const supabase = createClient();
    // 1) Prefer child_name only (no display_name) so DBs without display_name column still show names
    supabase
      .from('children')
      .select('id, child_name, age_band, gender')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          setChildren(data.map((r) => toSubnavChild(r as Record<string, unknown>)));
          return;
        }
        // 2) Try with display_name (for DBs that have it)
        supabase
          .from('children')
          .select('id, display_name, age_band, gender')
          .order('created_at', { ascending: false })
          .then(({ data: data2, error: err2 }) => {
            if (!err2 && Array.isArray(data2)) {
              setChildren(data2.map((r) => toSubnavChild({ ...(r as object), child_name: (r as Record<string, unknown>).display_name } as Record<string, unknown>)));
              return;
            }
            // 3) Core only: gender + age
            supabase
              .from('children')
              .select('id, gender, age_band')
              .order('created_at', { ascending: false })
              .then(({ data: fallbackData }) => {
                if (Array.isArray(fallbackData)) {
                  setChildren(fallbackData.map((r) => toSubnavChild({ ...(r as object), child_name: null, display_name: null } as Record<string, unknown>)));
                }
              });
          });
      });
  }, [user?.id]);

  // Refetch when pathname changes (e.g. after redirect from add-children) so new/edited names appear in toggle.
  useEffect(() => {
    fetchChildren();
    const isSubnav = pathname?.startsWith('/discover') || pathname?.startsWith('/my-ideas') || pathname?.startsWith('/family');
    if (isSubnav) {
      const t = setTimeout(fetchChildren, 300);
      return () => clearTimeout(t);
    }
  }, [pathname, fetchChildren]);

  // Refetch when tab becomes visible so returning from add-children or another tab shows latest list.
  useEffect(() => {
    if (!user?.id) return;
    const onVisible = () => {
      const isSubnav = pathname?.startsWith('/discover') || pathname?.startsWith('/my-ideas') || pathname?.startsWith('/family');
      if (isSubnav && document.visibilityState === 'visible') fetchChildren();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user?.id, pathname, fetchChildren]);

  // Refetch stats when pathname or selected child changes so counts match (e.g. 0 for a new child when selected)
  const subnavPage = pathname?.startsWith('/discover') || pathname?.startsWith('/my-ideas') || pathname?.startsWith('/family');
  useEffect(() => {
    if (!user?.id || !subnavPage) return;
    refetch(selectedChildId || undefined);
  }, [pathname, selectedChildId, user?.id, refetch, subnavPage]);

  const handleRemindersChange = useCallback(
    async (checked: boolean) => {
      if (!user) return;
      setRemindersBusy(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from('user_notification_prefs').upsert(
          { user_id: user.id, development_reminders_enabled: checked },
          { onConflict: 'user_id' }
        );
        if (error) throw error;
        await refetch(selectedChildId || undefined);
      } catch {
        setRemindersBusy(false);
        return;
      }
      setRemindersBusy(false);
    },
    [user, refetch, selectedChildId]
  );

  if (!user || !stats) return null;

  const basePath = pathname || '/family';
  const isDiscover = basePath.startsWith('/discover');
  const isMyIdeas = basePath.startsWith('/my-ideas');
  const isFamily = basePath.startsWith('/family');
  const childToggleApplies = isDiscover || isMyIdeas || isFamily;

  const buildUrlWithChild = (path: string, childId: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (childId) params.set('child', childId);
    else params.delete('child');
    const q = params.toString();
    return q ? `${path}?${q}` : path;
  };

  const myIdeasUrl = (tab: 'ideas' | 'products' | 'gifts') => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('tab', tab);
    return `/my-ideas?${params.toString()}`;
  };

  return (
    <div
      className="sticky left-0 right-0 z-40 border-b w-full min-w-0 overflow-hidden"
      style={{
        top: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))',
        borderColor: 'var(--ember-border-subtle, #E5E7EB)',
        backgroundColor: 'var(--ember-surface-secondary, #F9FAFB)',
      }}
    >
      <div className="mx-auto max-w-6xl w-full min-w-0 px-4 sm:px-6">
        {/* First row: Child toggle (amber CTA) first, then + Add a child as secondary */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3 min-w-0">
          <div className="flex items-center gap-3 lg:gap-6">
            {/* Child selector = first (amber) CTA */}
            <div className="flex items-center gap-2 min-w-0 max-w-[12rem] sm:max-w-[14rem]">
              <Users className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--ember-text-low)' }} aria-hidden />
              <select
                value={selectedChildId}
                onChange={(e) => {
                  const id = e.target.value;
                  if (childToggleApplies) {
                    router.push(buildUrlWithChild(basePath, id || null));
                  } else {
                    router.push(id ? `/family?child=${encodeURIComponent(id)}` : '/family');
                  }
                }}
                className="flex-1 min-w-0 h-9 pl-2 pr-8 rounded-md border-0 text-sm truncate appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ember-accent-base)] focus:ring-offset-0"
                style={{
                  backgroundColor: 'var(--ember-cta-primary, #FF6347)',
                  color: 'white',
                }}
                aria-label="Switch child profile"
              >
                <option value="">All children</option>
                {children.map((c, i) => (
                  <option key={c.id} value={c.id}>
                    {childOptionLabel(c, i)}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href="/add-children"
              className="inline-flex items-center justify-center gap-2 h-9 rounded-md px-3 text-sm font-medium transition-colors shrink-0 border border-[var(--ember-border-subtle)]"
              style={{ backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)' }}
            >
              <Plus className="w-4 h-4" aria-hidden />
              <span>Add a child</span>
            </Link>
          </div>

          {/* Second row on mobile: Stats (clickable) + Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6 flex-wrap">
            <div className="flex items-center gap-3 lg:gap-6">
              <Link
                href={myIdeasUrl('ideas')}
                className="flex items-center gap-1.5 rounded-md px-1 py-0.5 -mx-1 hover:bg-black/5 transition-colors"
              >
                <div className="text-xl lg:text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {stats.categoryIdeasSaved}
                </div>
                <div className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--ember-text-low)' }}>
                  ideas
                </div>
              </Link>
              <div className="h-6 w-px bg-gray-300" aria-hidden />
              <Link
                href={myIdeasUrl('products')}
                className="flex items-center gap-1.5 rounded-md px-1 py-0.5 -mx-1 hover:bg-black/5 transition-colors"
              >
                <div className="text-xl lg:text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {stats.toysSaved}
                </div>
                <div className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--ember-text-low)' }}>
                  toys
                </div>
              </Link>
              <div className="h-6 w-px bg-gray-300" aria-hidden />
              <Link
                href={myIdeasUrl('gifts')}
                className="flex items-center gap-1.5 rounded-md px-1 py-0.5 -mx-1 hover:bg-black/5 transition-colors"
              >
                <div className="text-xl lg:text-2xl font-semibold" style={{ color: 'var(--ember-text-high)' }}>
                  {typeof stats.giftsSaved === 'number' ? stats.giftsSaved : 0}
                </div>
                <div className="text-xs lg:text-sm whitespace-nowrap" style={{ color: 'var(--ember-text-low)' }}>
                  gifts
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs lg:text-sm hidden xl:inline" style={{ color: 'var(--ember-text-high)' }}>
                Send me development reminders
              </span>
              <span className="text-xs xl:hidden" style={{ color: 'var(--ember-text-high)' }}>
                Reminders
              </span>
              <SubnavSwitch
                checked={remindersEnabled}
                onCheckedChange={handleRemindersChange}
                disabled={remindersBusy}
              />
              <SimpleTooltip content={REMINDERS_TOOLTIP} minWidth="44rem" maxWidth="min(44rem, 95vw)">
                <button
                  type="button"
                  className="rounded-full p-0.5 transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] cursor-pointer pointer-events-auto"
                  style={{ color: 'var(--ember-text-low)' }}
                  aria-label="Development reminders info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
