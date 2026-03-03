'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Plus, Info, Users } from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavSwitch } from './SubnavSwitch';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { createClient } from '@/utils/supabase/client';
import { useState, useCallback, useEffect } from 'react';

type SubnavChild = { id: string; child_name?: string | null; display_name?: string | null; age_band?: string | null };

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

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('children')
      .select('id, child_name, display_name, age_band')
      .order('created_at', { ascending: false })
      .then(({ data }) => setChildren((data as SubnavChild[]) ?? []));
  }, [user]);

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
        await refetch();
      } catch {
        setRemindersBusy(false);
        return;
      }
      setRemindersBusy(false);
    },
    [user, refetch]
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
      className="sticky left-0 right-0 z-40 border-b"
      style={{
        top: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))',
        borderColor: 'var(--ember-border-subtle, #E5E7EB)',
        backgroundColor: 'var(--ember-surface-secondary, #F9FAFB)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        {/* First row: Child toggle (amber CTA) first, then + Add a child as secondary */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
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
                    {(c.child_name || c.display_name)?.trim() || `Child ${i + 1}`}
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
