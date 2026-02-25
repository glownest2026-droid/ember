'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

/** Placeholder child for shell only. Name optional (display fallback). */
const PLACEHOLDER_CHILDREN = [
  { id: 'placeholder-1', displayName: null as string | null, ageBand: '—', currentFocus: '—', nextUp: '—' },
];

type TabId = 'ideas' | 'products' | 'gifts';

/** One row from user_list_items (joined). */
type ListItemRow = {
  id: string;
  kind: 'idea' | 'category' | 'product';
  want: boolean;
  have: boolean;
  gift: boolean;
  product_id: string | null;
  category_type_id: string | null;
  ux_wrapper_id: string | null;
  created_at: string;
  products: { name: string } | { name: string }[] | null;
  pl_category_types: { name: string; label?: string | null } | { name: string; label?: string | null }[] | null;
  pl_ux_wrappers: { ux_label?: string | null } | { ux_label?: string | null }[] | null;
};

function _first<T>(x: T | T[] | null): T | null {
  if (x == null) return null;
  return Array.isArray(x) ? (x[0] ?? null) : x;
}

function itemTitle(row: ListItemRow): string {
  const p = _first(row.products);
  const c = _first(row.pl_category_types);
  const u = _first(row.pl_ux_wrappers);
  if (p?.name) return p.name;
  if (c?.label) return c.label;
  if (c?.name) return c.name;
  if (u?.ux_label) return u.ux_label;
  return 'Saved item';
}

/** Dashboard: reads list from user_list_items; toggles call upsert_user_list_item RPC. */
export function FamilyDashboardClient() {
  const [selectedChildId, setSelectedChildId] = useState(PLACEHOLDER_CHILDREN[0].id);
  const [activeTab, setActiveTab] = useState<TabId>('ideas');
  const [remindersOn, setRemindersOn] = useState(false);
  const [items, setItems] = useState<ListItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { refetch: refetchSubnavStats } = useSubnavStats();

  const selectedChild = PLACEHOLDER_CHILDREN.find((c) => c.id === selectedChildId) ?? PLACEHOLDER_CHILDREN[0];
  const displayName = selectedChild.displayName ?? 'My child';

  const fetchList = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_list_items')
      .select('id, kind, want, have, gift, product_id, category_type_id, ux_wrapper_id, created_at, products(name), pl_category_types(name, label), pl_ux_wrappers(ux_label)')
      .order('created_at', { ascending: false });
    if (error) {
      setItems([]);
      return;
    }
    setItems((data as unknown as ListItemRow[]) ?? []);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchList().finally(() => setLoading(false));
  }, [fetchList]);

  /* Counting logic (canonical): Ideas = kind in ('idea','category') and (want OR have); Products = kind='product' and (want OR have); Gifts = gift=true (any kind). */
  const counts = {
    ideas: items.filter((r) => (r.kind === 'idea' || r.kind === 'category') && (r.want || r.have)).length,
    products: items.filter((r) => r.kind === 'product' && (r.want || r.have)).length,
    gifts: items.filter((r) => r.gift).length,
  };

  const ideasItems = items.filter((r) => (r.kind === 'idea' || r.kind === 'category') && (r.want || r.have));
  const productsItems = items.filter((r) => r.kind === 'product' && (r.want || r.have));
  const giftsItems = items.filter((r) => r.gift);

  const updateItem = useCallback(
    async (row: ListItemRow, updates: { want?: boolean; have?: boolean; gift?: boolean }): Promise<boolean> => {
      let p_want = updates.want ?? row.want;
      let p_gift = updates.gift ?? row.gift;
      if (p_gift) p_want = true;
      if (p_want === false) p_gift = false;
      const payload: Record<string, unknown> = {
        p_kind: row.kind,
        p_want: p_want,
        p_have: updates.have ?? row.have,
        p_gift: p_gift,
      };
      if (row.kind === 'product' && row.product_id) payload.p_product_id = row.product_id;
      else if (row.kind === 'category' && row.category_type_id) payload.p_category_type_id = row.category_type_id;
      else if (row.kind === 'idea' && row.ux_wrapper_id) payload.p_ux_wrapper_id = row.ux_wrapper_id;

      const supabase = createClient();
      setUpdatingId(row.id);
      setActionError(null);
      try {
        const { error } = await supabase.rpc('upsert_user_list_item', payload);
        if (!error) {
          await fetchList();
          await refetchSubnavStats();
          return true;
        }
        setActionError('Couldn’t save that right now. Try again.');
        if (typeof console !== 'undefined' && console.error) console.error('[family] upsert_user_list_item', error);
        return false;
      } catch (err) {
        setActionError('Couldn’t save that right now. Try again.');
        if (typeof console !== 'undefined' && console.error) console.error('[family] upsert_user_list_item', err);
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchList, refetchSubnavStats]
  );

  const setWant = useCallback((row: ListItemRow, want: boolean) => updateItem(row, { want }), [updateItem]);
  const setHave = useCallback((row: ListItemRow, have: boolean) => updateItem(row, { have }), [updateItem]);
  const setGift = useCallback((row: ListItemRow, gift: boolean) => updateItem(row, { gift }), [updateItem]);

  const currentItems = activeTab === 'ideas' ? ideasItems : activeTab === 'products' ? productsItems : giftsItems;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)' }}>
      {/* Header */}
      <header
        className="border-b bg-[var(--ember-surface-primary)]"
        style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl sm:text-2xl font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              Manage My Family
            </h1>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 rounded-lg opacity-70 hover:opacity-100 text-sm" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                Help
              </button>
              <Link href="/account" className="p-2 rounded-lg opacity-70 hover:opacity-100 text-sm" style={{ color: 'var(--ember-text-low)' }}>
                Settings
              </Link>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            Everything you&apos;ve saved and what&apos;s next – in one place.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Child chips */}
        <div className="mb-4 overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-min">
            {PLACEHOLDER_CHILDREN.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={
                  selectedChildId === child.id
                    ? { backgroundColor: 'var(--ember-accent-base)', color: 'white' }
                    : { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', border: '1px solid var(--ember-border-subtle)' }
                }
              >
                {child.displayName ?? '—'} · {child.ageBand}
              </button>
            ))}
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-dashed"
              style={{ borderColor: 'var(--ember-border-subtle)', color: 'var(--ember-accent-base)' }}
              title="Coming soon"
            >
              + Add child
            </button>
          </div>
        </div>

        {/* Personalization strip */}
        <div
          className="rounded-xl border p-5 mb-6"
          style={{
            background: 'linear-gradient(to bottom right, var(--ember-surface-primary), var(--ember-surface-secondary, #f5f5f5))',
            borderColor: 'var(--ember-border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
            Today for {displayName}
          </h2>
          <p className="text-sm mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
            {displayName} (aged —): {selectedChild.currentFocus}.
          </p>
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            {selectedChild.nextUp}
          </p>
        </div>

        {/* Two-column: My list (left) + Support (right) */}
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
          {/* My list */}
          <div
            className="rounded-xl border p-5 sm:p-6 mb-6 lg:mb-0"
            style={{
              backgroundColor: 'var(--ember-surface-primary)',
              borderColor: 'var(--ember-border-subtle)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                My list
              </h2>
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded opacity-70" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                  Filter
                </button>
                <button type="button" className="p-2 rounded opacity-70" title="Coming soon" style={{ color: 'var(--ember-text-low)' }}>
                  Search
                </button>
              </div>
            </div>

            {/* Tabs: Ideas, Products, Gifts — counts from user_list_items */}
            <div className="flex gap-1 p-1 rounded-lg mb-4 bg-[var(--ember-surface-secondary,#f5f5f5)] w-fit">
              {(['ideas', 'products', 'gifts'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-md text-sm font-medium capitalize"
                  style={
                    activeTab === tab
                      ? { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                      : { color: 'var(--ember-text-low)' }
                  }
                >
                  {tab} {tab === 'ideas' ? counts.ideas : tab === 'products' ? counts.products : counts.gifts}
                </button>
              ))}
            </div>

            {actionError && (
              <p className="text-sm mb-3 py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--ember-surface-soft)', color: 'var(--ember-text-high)' }}>
                {actionError}
              </p>
            )}

            {loading ? (
              <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                Loading…
              </p>
            ) : currentItems.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                No saved {activeTab} yet. Save from Discover to see them here.
              </p>
            ) : (
              <div className="space-y-4">
                {currentItems.map((row) => {
                  const disabled = updatingId === row.id;
                  return (
                    <div
                      key={row.id}
                      className="rounded-lg border p-4"
                      style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-secondary, #fafafa)' }}
                    >
                      <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                        {itemTitle(row)}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3" style={baseStyle}>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={row.want}
                            onChange={(e) => setWant(row, e.target.checked)}
                            disabled={disabled}
                            className="rounded border-gray-300"
                          />
                          <span style={{ color: 'var(--ember-text-high)' }}>Want</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={row.have}
                            onChange={(e) => setHave(row, e.target.checked)}
                            disabled={disabled}
                            className="rounded border-gray-300"
                          />
                          <span style={{ color: 'var(--ember-text-high)' }}>Have</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={row.gift}
                            onChange={(e) => setGift(row, e.target.checked)}
                            disabled={disabled || !row.want}
                            className="rounded border-gray-300 disabled:opacity-50"
                          />
                          <span style={{ color: 'var(--ember-text-high)' }}>Gift</span>
                        </label>
                      </div>
                      <Link href="/discover" className="text-xs mt-2 inline-block hover:underline" style={{ color: 'var(--ember-accent-base)' }}>
                        examples
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <button type="button" className="text-sm opacity-70 hover:opacity-100" style={{ color: 'var(--ember-text-low)' }}>
                Share my list <span className="text-xs">(Coming soon)</span>
              </button>
            </div>
          </div>

          {/* Right column: Next steps, Reminders, Settings */}
          <div className="space-y-6">
            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                Next steps for {displayName}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                — (Coming soon)
              </p>
              <Link
                href="/discover"
                className="inline-block w-full text-center py-2 rounded-lg font-medium text-sm text-white"
                style={{ backgroundColor: 'var(--ember-accent-base)' }}
              >
                Discover next steps
              </Link>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
                  Remind me
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remindersOn}
                    onChange={(e) => setRemindersOn(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm" style={{ color: 'var(--ember-text-low)' }}>(Placeholder)</span>
                </label>
              </div>
              <p className="text-xs" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                A gentle email when your child hits the next stage. <span className="opacity-70">(Coming soon)</span>
              </p>
            </div>

            <div
              className="rounded-xl border p-5"
              style={{
                backgroundColor: 'var(--ember-surface-primary)',
                borderColor: 'var(--ember-border-subtle)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <Link href="/account" className="text-sm font-medium hover:underline" style={{ color: 'var(--ember-text-high)' }}>
                Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
