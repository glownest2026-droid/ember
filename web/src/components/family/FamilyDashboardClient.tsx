'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { calculateAgeBand } from '@/lib/ageBand';
import { SubnavSwitch } from '@/components/subnav/SubnavSwitch';
import { FamilyExamplesModal } from '@/components/family/FamilyExamplesModal';
import type { GatewayPick } from '@/lib/pl/public';
import { Plus, Gift, ImageOff, Search } from 'lucide-react';

const baseStyle = { fontFamily: 'var(--font-sans)' } as const;

type TabId = 'ideas' | 'products' | 'gifts';

/** Child profile from DB (no name field – privacy). */
interface ChildProfile {
  id: string;
  birthdate: string | null;
  gender: string | null;
  age_band: string | null;
}

/** List item from user_list_items; joined names and image (Supabase may return relation as object or single-element array). */
export interface ListItemRow {
  id: string;
  kind: 'idea' | 'category' | 'product';
  want: boolean;
  have: boolean;
  gift: boolean;
  product_id: string | null;
  category_type_id: string | null;
  ux_wrapper_id: string | null;
  created_at: string;
  products: { name: string; image_url?: string | null } | { name: string; image_url?: string | null }[] | null;
  pl_category_types: { name: string; label: string | null; image_url?: string | null } | { name: string; label: string | null; image_url?: string | null }[] | null;
  pl_ux_wrappers: { ux_label: string } | { ux_label: string }[] | null;
}

function _first<T>(v: T | T[] | null): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

/** Display title for a list item (from joined data). */
function itemTitle(row: ListItemRow): string {
  const p = _first(row.products);
  const c = _first(row.pl_category_types);
  const u = _first(row.pl_ux_wrappers);
  if (row.kind === 'product' && p?.name) return p.name;
  if (row.kind === 'category' && c) return c.name ?? c.label ?? '—';
  if (row.kind === 'idea' && u?.ux_label) return u.ux_label;
  return '—';
}

/** Image URL for list item. Category/idea: v_gateway_category_type_images; product: v_gateway_products_public first (same as /discover Examples), then products table. */
function getItemImageUrl(
  row: ListItemRow,
  categoryImageMap: Map<string, string>,
  productImageMap: Map<string, string>
): string | null {
  const p = _first(row.products);
  const c = _first(row.pl_category_types);
  if (row.kind === 'product' && row.product_id) {
    if (productImageMap.has(row.product_id)) return productImageMap.get(row.product_id)!;
    if (p?.image_url) return p.image_url;
  }
  if (row.kind === 'category' || row.kind === 'idea') {
    if (row.category_type_id && categoryImageMap.has(row.category_type_id))
      return categoryImageMap.get(row.category_type_id)!;
    if (c?.image_url) return c.image_url;
  }
  return null;
}

/** Relative time for "Saved X ago" (Figma-style). */
function formatSavedTime(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return 'Saved today';
  if (diffDays === 1) return 'Saved yesterday';
  if (diffDays < 7) return `Saved ${diffDays} days ago`;
  if (diffDays < 30) return `Saved ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  return `Saved ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) === 1 ? '' : 's'} ago`;
}

/** Dashboard: real list from user_list_items; counts = ideas (want|have), products (want|have), gifts (gift=true). */
export function FamilyDashboardClient({
  saved = false,
  deleted = false,
  initialChildId,
}: { saved?: boolean; deleted?: boolean; initialChildId?: string } = {}) {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(initialChildId ?? null);
  const [activeTab, setActiveTab] = useState<TabId>('ideas');
  const [items, setItems] = useState<ListItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [categoryImageMap, setCategoryImageMap] = useState<Map<string, string>>(new Map());
  const [productImageMap, setProductImageMap] = useState<Map<string, string>>(new Map());
  const [productUrlMap, setProductUrlMap] = useState<Map<string, string>>(new Map());
  const [giftSuccessId, setGiftSuccessId] = useState<string | null>(null);
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [optimisticHave, setOptimisticHave] = useState<Record<string, boolean>>({});
  const [optimisticGift, setOptimisticGift] = useState<Record<string, boolean>>({});
  const [examplesModal, setExamplesModal] = useState<{
    open: boolean;
    ideaTitle: string;
    categoryTypeId: string;
    ageBandId: string | null;
  }>({ open: false, ideaTitle: '', categoryTypeId: '', ageBandId: null });
  const { user, stats, refetch: refetchSubnavStats } = useSubnavStats();
  const remindersEnabled = stats?.remindersEnabled ?? false;

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0] ?? null;
  const displayName = 'My child';
  const displayAgeBand = selectedChild ? (selectedChild.age_band || (selectedChild.birthdate ? calculateAgeBand(selectedChild.birthdate) : null) || '—') : '—';
  const personalizationSubtext = selectedChild
    ? `My child (aged ${displayAgeBand}): —.`
    : 'Add a child profile to see tailored next steps.';

  const fetchChildren = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('children')
      .select('id, birthdate, gender, age_band')
      .order('created_at', { ascending: false });
    const list = (data ?? []) as ChildProfile[];
    setChildren(list);
    if (list.length > 0) {
      setSelectedChildId((prev) => {
        if (initialChildId && list.some((c) => c.id === initialChildId)) return initialChildId;
        if (prev && list.some((c) => c.id === prev)) return prev;
        return list[0].id;
      });
    }
  }, [initialChildId]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  useEffect(() => {
    if (initialChildId && children.some((c) => c.id === initialChildId)) {
      setSelectedChildId(initialChildId);
    }
  }, [initialChildId, children]);

  const fetchList = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_list_items')
      .select('id, kind, want, have, gift, product_id, category_type_id, ux_wrapper_id, created_at, products(name, image_url), pl_category_types(name, label, image_url), pl_ux_wrappers(ux_label)')
      .order('created_at', { ascending: false });
    if (!error && data != null) {
      setItems((data as unknown as ListItemRow[]) ?? []);
      return;
    }
    const useLegacy =
      error?.code === '42P01' ||
      error?.message?.includes('user_list_items') ||
      error?.message?.includes('does not exist');
    if (!useLegacy) {
      setItems([]);
      return;
    }
    const [ideasRes, productsRes] = await Promise.all([
      supabase.from('user_saved_ideas').select('id, idea_id, created_at, pl_category_types(name, label, image_url)').order('created_at', { ascending: false }),
      supabase.from('user_saved_products').select('id, product_id, created_at, products(name, image_url)').order('created_at', { ascending: false }),
    ]);
    const legacyRows: ListItemRow[] = [];
    const ideaRows = (ideasRes.data ?? []) as unknown as { id: string; idea_id: string; created_at: string; pl_category_types: { name: string; label: string | null; image_url?: string | null } | { name: string; label: string | null; image_url?: string | null }[] | null }[];
    for (const r of ideaRows) {
      const ct = Array.isArray(r.pl_category_types) ? r.pl_category_types[0] ?? null : r.pl_category_types;
      legacyRows.push({
        id: r.id,
        kind: 'category',
        want: true,
        have: false,
        gift: false,
        product_id: null,
        category_type_id: r.idea_id,
        ux_wrapper_id: null,
        created_at: r.created_at,
        products: null,
        pl_category_types: ct ?? null,
        pl_ux_wrappers: null,
      });
    }
    const productRows = (productsRes.data ?? []) as unknown as { id: string; product_id: string; created_at: string; products: { name: string; image_url?: string | null } | { name: string; image_url?: string | null }[] | null }[];
    for (const r of productRows) {
      const prod = Array.isArray(r.products) ? r.products[0] ?? null : r.products;
      legacyRows.push({
        id: r.id,
        kind: 'product',
        want: true,
        have: false,
        gift: false,
        product_id: r.product_id,
        category_type_id: null,
        ux_wrapper_id: null,
        created_at: r.created_at,
        products: prod ?? null,
        pl_category_types: null,
        pl_ux_wrappers: null,
      });
    }
    legacyRows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setItems(legacyRows);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchList().finally(() => setLoading(false));
  }, [fetchList, refetchSubnavStats]);

  useEffect(() => {
    const ids = [...new Set(items.map((r) => (r.kind === 'category' || r.kind === 'idea') && r.category_type_id ? r.category_type_id : null).filter(Boolean) as string[])];
    if (ids.length === 0) {
      setCategoryImageMap(new Map());
    } else {
      const supabase = createClient();
      supabase
        .from('v_gateway_category_type_images')
        .select('category_type_id, image_url')
        .in('category_type_id', ids)
        .then(({ data }) => {
          const map = new Map<string, string>();
          for (const row of data ?? []) {
            const r = row as { category_type_id: string; image_url: string };
            if (r.image_url) map.set(r.category_type_id, r.image_url);
          }
          setCategoryImageMap(map);
        });
    }
  }, [items]);

  // Product images + URLs: same sourcing as /discover "Examples you might like" — v_gateway_products_public first, then products table for missing.
  useEffect(() => {
    const productIds = [...new Set(items.filter((r) => r.kind === 'product' && r.product_id).map((r) => r.product_id!))];
    if (productIds.length === 0) {
      setProductImageMap(new Map());
      setProductUrlMap(new Map());
    } else {
      const supabase = createClient();
      const imageMap = new Map<string, string>();
      const urlMap = new Map<string, string>();
      const pickUrl = (r: { canonical_url?: string | null; amazon_uk_url?: string | null; affiliate_url?: string | null; affiliate_deeplink?: string | null }) =>
        r.canonical_url || r.amazon_uk_url || r.affiliate_url || r.affiliate_deeplink || '#';
      Promise.all([
        supabase
          .from('v_gateway_products_public')
          .select('id, image_url, canonical_url, amazon_uk_url, affiliate_url, affiliate_deeplink')
          .in('id', productIds)
          .order('age_band_id', { ascending: true })
          .order('category_type_id', { ascending: true })
          .order('rank', { ascending: true }),
        supabase.from('products').select('id, image_url, canonical_url, amazon_uk_url, affiliate_url, affiliate_deeplink').in('id', productIds),
      ]).then(([viewRes, tableRes]) => {
        for (const row of viewRes.data ?? []) {
          const r = row as { id: string; image_url: string | null; canonical_url?: string | null; amazon_uk_url?: string | null; affiliate_url?: string | null; affiliate_deeplink?: string | null };
          if (r.image_url && !imageMap.has(r.id)) imageMap.set(r.id, r.image_url);
          if (!urlMap.has(r.id)) urlMap.set(r.id, pickUrl(r));
        }
        for (const row of tableRes.data ?? []) {
          const r = row as { id: string; image_url: string | null; canonical_url?: string | null; amazon_uk_url?: string | null; affiliate_url?: string | null; affiliate_deeplink?: string | null };
          if (r.image_url && !imageMap.has(r.id)) imageMap.set(r.id, r.image_url);
          if (!urlMap.has(r.id)) urlMap.set(r.id, pickUrl(r));
        }
        setProductImageMap(imageMap);
        setProductUrlMap(urlMap);
      });
    }
  }, [items]);

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
      const supabase = createClient();
      setUpdatingId(row.id);
      setActionError(null);
      try {
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
        const { error } = await supabase.rpc('upsert_user_list_item', payload);
        if (!error) {
          await fetchList();
          await refetchSubnavStats();
          setOptimisticHave((prev) => {
            const next = { ...prev };
            delete next[row.id];
            return next;
          });
          setOptimisticGift((prev) => {
            const next = { ...prev };
            delete next[row.id];
            return next;
          });
          return true;
        }
        setActionError(error.message ?? 'Couldn’t update. Try again.');
        return false;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Couldn’t update. Try again.';
        setActionError(msg.includes('function') || msg.includes('does not exist') ? 'My list isn’t set up yet. Run the database migration.' : msg);
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchList, refetchSubnavStats]
  );

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
        if (!error) await refetchSubnavStats();
      } finally {
        setRemindersBusy(false);
      }
    },
    [user, refetchSubnavStats]
  );

  const getProductUrl = useCallback((p: GatewayPick) =>
    p.product.canonical_url || p.product.amazon_uk_url || p.product.affiliate_url || p.product.affiliate_deeplink || '#',
  []);

  const handleSaveProductFromExamples = useCallback(
    (productId: string, _triggerEl: HTMLButtonElement | null) => {
      if (!user) return;
      const supabase = createClient();
      supabase
        .rpc('upsert_user_list_item', {
          p_kind: 'product',
          p_product_id: productId,
          p_want: true,
          p_have: false,
          p_gift: false,
        })
        .then(({ error }) => {
          if (!error) {
            refetchSubnavStats();
            fetchList();
          }
        });
    },
    [user, refetchSubnavStats, fetchList]
  );

  const handleHaveProductFromExamples = useCallback(
    (productId: string) => {
      if (!user) return;
      const supabase = createClient();
      supabase
        .rpc('upsert_user_list_item', {
          p_kind: 'product',
          p_product_id: productId,
          p_want: true,
          p_have: true,
          p_gift: false,
        })
        .then(({ error }) => {
          if (!error) {
            refetchSubnavStats();
            fetchList();
          }
        });
    },
    [user, refetchSubnavStats, fetchList]
  );

  const openExamplesModal = useCallback((row: ListItemRow) => {
    const title = itemTitle(row);
    const categoryTypeId = row.category_type_id ?? '';
    const ageBandId = selectedChild?.age_band ?? null;
    setExamplesModal({ open: true, ideaTitle: title, categoryTypeId, ageBandId });
  }, [selectedChild?.age_band]);

  const currentItems = activeTab === 'ideas' ? ideasItems : activeTab === 'products' ? productsItems : giftsItems;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)' }}>
      <FamilyExamplesModal
        open={examplesModal.open}
        onClose={() => setExamplesModal((s) => ({ ...s, open: false }))}
        ideaTitle={examplesModal.ideaTitle}
        categoryTypeId={examplesModal.categoryTypeId}
        ageBandId={examplesModal.ageBandId}
        onSave={handleSaveProductFromExamples}
        onHave={handleHaveProductFromExamples}
        getProductUrl={getProductUrl}
        ageRangeLabel={displayAgeBand !== '—' ? `${displayAgeBand}` : 'My child'}
      />
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
        {saved && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile saved</div>
        )}
        {deleted && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700 text-sm mb-4">Profile deleted</div>
        )}

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--ember-text-high)', ...baseStyle }}>
              Child profiles
            </h2>
            <Link
              href="/add-children"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
              style={{ backgroundColor: 'var(--ember-accent-base)', color: 'white' }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add a child
            </Link>
          </div>
          {children.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border bg-white/80" style={{ borderColor: 'var(--ember-border-subtle)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>No child profiles yet.</p>
              <Link
                href="/add-children"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: 'var(--ember-accent-base)' }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add your first child
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((child) => {
                const ageBand = child.age_band || (child.birthdate ? calculateAgeBand(child.birthdate) : null) || '—';
                return (
                  <div
                    key={child.id}
                    className="rounded-2xl border p-4 bg-white flex items-start justify-between"
                    style={{ borderColor: 'var(--ember-border-subtle)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                        {child.birthdate ? `Birthdate: ${new Date(child.birthdate).toLocaleDateString()}` : 'Birthdate: —'}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                        Age band: {ageBand}
                      </p>
                      {child.gender && (
                        <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                          Gender: {child.gender}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/add-children/${child.id}`}
                      className="px-3 py-2 rounded-xl text-sm font-medium border shrink-0"
                      style={{ borderColor: 'var(--ember-border-subtle)', color: 'var(--ember-text-high)', ...baseStyle }}
                    >
                      Edit
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mb-4 overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-min">
            {children.length === 0 ? (
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
                style={{ backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', border: '1px solid var(--ember-border-subtle)' }}
                disabled
              >
                My child · —
              </button>
            ) : (
              children.map((child) => {
                const ageBand = child.age_band || (child.birthdate ? calculateAgeBand(child.birthdate) : null) || '—';
                const isSelected = selectedChildId === child.id;
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => setSelectedChildId(child.id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
                    style={
                      isSelected
                        ? { backgroundColor: 'var(--ember-accent-base)', color: 'white', boxShadow: '0 0 0 3px var(--ember-glow, rgba(184,67,43,0.2))' }
                        : { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', border: '1px solid var(--ember-border-subtle)' }
                    }
                  >
                    {displayName} · {ageBand}
                  </button>
                );
              })
            )}
            <Link
              href="/add-children"
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-dashed inline-flex items-center"
              style={{ borderColor: 'var(--ember-border-subtle)', color: 'var(--ember-accent-base)' }}
            >
              + Add child
            </Link>
          </div>
        </div>

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
            {personalizationSubtext}
          </p>
          <p className="text-sm" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
            Next steps and focus areas will appear here when we support them.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-8">
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

            <div className="flex gap-1 p-1 rounded-lg mb-6 bg-[var(--ember-surface-secondary,#f5f5f5)] w-fit">
              {(['ideas', 'products', 'gifts'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-md text-sm font-medium capitalize flex items-center gap-2"
                  style={
                    activeTab === tab
                      ? { backgroundColor: 'var(--ember-surface-primary)', color: 'var(--ember-text-high)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
                      : { color: 'var(--ember-text-low)' }
                  }
                >
                  {tab}
                  {counts[tab] > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-black/10" style={{ color: 'var(--ember-text-high)' }}>
                      {counts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {actionError && (
              <p className="text-sm mb-3 py-2 px-3 rounded-lg" style={{ backgroundColor: 'var(--ember-surface-soft)', color: 'var(--ember-accent-base)' }}>
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
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map((row) => {
                  const imgUrl = getItemImageUrl(row, categoryImageMap, productImageMap);
                  const title = itemTitle(row);
                  const savedTime = formatSavedTime(row.created_at);
                  const disabled = updatingId === row.id;
                  const have = optimisticHave[row.id] ?? row.have;
                  const gift = optimisticGift[row.id] ?? row.gift;
                  const showGiftSuccess = giftSuccessId === row.id;
                  const handleHaveChange = (checked: boolean) => {
                    if (disabled) return;
                    setOptimisticHave((prev) => ({ ...prev, [row.id]: checked }));
                    updateItem(row, { have: checked }).then((ok) => {
                      if (!ok) setOptimisticHave((prev) => ({ ...prev, [row.id]: row.have }));
                    });
                  };
                  const handleAddToGiftList = (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (disabled || gift) return;
                    setOptimisticGift((prev) => ({ ...prev, [row.id]: true }));
                    updateItem(row, { gift: true }).then((ok) => {
                      if (ok) {
                        setGiftSuccessId(row.id);
                        setTimeout(() => setGiftSuccessId(null), 3000);
                      } else {
                        setOptimisticGift((prev) => ({ ...prev, [row.id]: row.gift }));
                      }
                    });
                  };
                  return (
                    <div
                      key={row.id}
                      className="rounded-xl border overflow-hidden transition-all duration-200 hover:border-[var(--ember-text-low)]"
                      style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}
                    >
                      {imgUrl ? (
                        <div className="aspect-square bg-[var(--ember-surface-soft)] relative">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          {gift && (
                            <div className="absolute top-2 right-2 rounded-full p-1.5 shadow-sm" style={{ backgroundColor: 'var(--ember-surface-primary)' }}>
                              <Gift className="w-3.5 h-3.5" style={{ color: '#E65100' }} aria-hidden />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-[var(--ember-surface-soft)] flex items-center justify-center" style={{ color: 'var(--ember-text-low)' }}>
                          <ImageOff className="w-10 h-10" aria-hidden />
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: 'var(--ember-text-high)' }}>
                          {title}
                        </h4>
                        <p className="text-xs mb-3" style={{ color: 'var(--ember-text-low)' }}>
                          {savedTime}
                        </p>
                        <div className="flex items-center gap-2" aria-label="Want or Have">
                          <span className="text-xs font-medium" style={{ color: have ? 'var(--ember-text-low)' : 'var(--ember-text-high)' }}>
                            Want
                          </span>
                          <SubnavSwitch
                            aria-label="Want or Have"
                            checked={have}
                            onCheckedChange={handleHaveChange}
                            disabled={disabled}
                          />
                          <span className="text-xs font-medium" style={{ color: have ? '#2E7D32' : 'var(--ember-text-low)' }}>
                            Have
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
                          {!have ? (
                            <>
                              {(row.kind === 'idea' || row.kind === 'category') && row.category_type_id ? (
                                <button
                                  type="button"
                                  onClick={() => openExamplesModal(row)}
                                  className="text-xs hover:underline cursor-pointer bg-transparent border-0 p-0"
                                  style={{ color: 'var(--ember-accent-base)' }}
                                >
                                  Examples
                                </button>
                              ) : row.kind === 'product' && row.product_id ? (
                                <a
                                  href={productUrlMap.get(row.product_id) || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs hover:underline inline-flex items-center gap-1"
                                  style={{ color: 'var(--ember-accent-base)' }}
                                >
                                  <Search className="w-3 h-3" aria-hidden />
                                  Visit
                                </a>
                              ) : (
                                <Link
                                  href="/discover"
                                  className="text-xs hover:underline"
                                  style={{ color: 'var(--ember-accent-base)' }}
                                >
                                  Examples
                                </Link>
                              )}
                              {showGiftSuccess ? (
                                <span className="text-xs font-medium" style={{ color: '#2E7D32' }}>
                                  Successfully added
                                </span>
                              ) : gift ? (
                                <span className="text-xs" style={{ color: 'var(--ember-text-low)' }}>
                                  On gift list
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleAddToGiftList}
                                  disabled={disabled}
                                  className="text-xs flex items-center gap-1 hover:underline cursor-pointer"
                                  style={{ color: 'var(--ember-accent-base)' }}
                                >
                                  <Plus className="w-3 h-3" />
                                  Gift list
                                </button>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="text-xs opacity-40 cursor-not-allowed inline-flex items-center gap-1" style={{ color: 'var(--ember-text-low)' }}>
                                {row.kind === 'product' ? (
                                  <>
                                    <Search className="w-3 h-3" aria-hidden />
                                    Visit
                                  </>
                                ) : (
                                  'Examples'
                                )}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--ember-text-low)' }} title="Coming soon">
                                Move it on
                              </span>
                            </>
                          )}
                        </div>
                      </div>
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
                Next steps and focus areas will appear here when we support them.
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
                <SubnavSwitch
                  checked={remindersEnabled}
                  onCheckedChange={handleRemindersChange}
                  disabled={remindersBusy || !user}
                />
              </div>
              <p className="text-xs" style={{ color: 'var(--ember-text-low)', ...baseStyle }}>
                A gentle email when your child hits the next stage.
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
