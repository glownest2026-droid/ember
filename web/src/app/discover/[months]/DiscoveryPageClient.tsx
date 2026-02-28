'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { createClient } from '@/utils/supabase/client';
import type { GatewayPick, GatewayWrapperPublic } from '@/lib/pl/public';
import {
  ALL_DOORWAYS,
  DEFAULT_DOORWAYS,
  MORE_DOORWAYS,
  SUGGESTED_DOORWAY_KEYS_25_27,
  resolveDoorwayToWrapper,
} from '@/lib/discover/doorways';
import { CategoryCarousel } from '@/components/discover/CategoryCarousel';
import { DiscoverCardStack } from '@/components/discover/DiscoverCardStack';
import { HowWeChooseSheet } from '@/components/discover/HowWeChooseSheet';
import { DiscoverHeroPocketPlayGuide } from '@/components/discover/DiscoverHeroPocketPlayGuide';
import { SaveToListModal } from '@/components/ui/SaveToListModal';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';
import {
  requireAuthThen,
  replayPendingAuthAction,
  REPLAY_FAILURE_MESSAGE,
  type PendingAuthAction,
} from '@/lib/auth/requireAuthThen';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';

/** A→B→C journey state: NoFocus | FocusSelected (Layer B visible) | CategorySelected | ShowingExamples (Layer C visible) */
type DiscoverState = 'NoFocusSelected' | 'FocusSelected' | 'CategorySelected' | 'ShowingExamples';

/* Hero: calm gradient + subtle ember glow; no competing effects */

const SURFACE_STYLE = {
  backgroundColor: 'var(--ember-surface-primary)',
  borderRadius: '12px',
  boxShadow: '0px 4px 24px rgba(0,0,0,0.04)',
};


interface AgeBand {
  id: string;
  label?: string | null;
  min_months: number | null;
  max_months: number | null;
}

type Wrapper = Pick<GatewayWrapperPublic, 'ux_wrapper_id' | 'ux_label' | 'ux_slug' | 'ux_description' | 'rank'>;
type PickItem = GatewayPick;

interface DiscoveryPageClientProps {
  ageBands: AgeBand[];
  ageBand: AgeBand | null;
  selectedBandHasPicks: boolean;
  monthParam: number | null;
  resolutionDebug?: string | null;
  wrappers: Wrapper[];
  selectedWrapperSlug: string | null;
  showPicks: boolean;
  picks: PickItem[];
  exampleProducts: PickItem[];
  categoryTypes: GatewayCategoryTypePublic[];
  showDebug?: boolean;
}

export default function DiscoveryPageClient({
  ageBands,
  ageBand,
  selectedBandHasPicks,
  monthParam,
  resolutionDebug,
  wrappers,
  selectedWrapperSlug,
  showPicks,
  picks,
  exampleProducts,
  categoryTypes,
  showDebug = false,
}: DiscoveryPageClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [howWeChooseOpen, setHowWeChooseOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [actionToast, setActionToast] = useState<{ productId: string; message: string } | null>(null);
  const [showingExamples, setShowingExamples] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [saveModal, setSaveModal] = useState<{
    open: boolean;
    signedIn: boolean;
    signinUrl: string;
  }>({ open: false, signedIn: false, signinUrl: '' });
  const saveModalFocusRef = useRef<HTMLButtonElement | null>(null);
  const nextStepsSectionRef = useRef<HTMLElement | null>(null);
  const [pendingScrollToNextSteps, setPendingScrollToNextSteps] = useState(false);
  const replayAttemptedRef = useRef(false);
  const basePath = '/discover';
  const { user, refetch: refetchSubnavStats } = useSubnavStats();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
    },
    [shouldReduceMotion]
  );

  useEffect(() => {
    if (showPicks) {
      setShowingExamples(true);
      const timer = setTimeout(() => {
        const el = document.getElementById('examplesProgressBar') ?? document.getElementById('examplesSection');
        if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showPicks, shouldReduceMotion]);

  useEffect(() => {
    if (!actionToast) return;
    const t = setTimeout(() => setActionToast(null), 3000);
    return () => clearTimeout(t);
  }, [actionToast]);

  // Open auth modal when URL has openAuth=1 (e.g. "Join free" on discover)
  useEffect(() => {
    if (searchParams?.get('openAuth') !== '1') return;
    const next = pathname && pathname.startsWith('/discover') ? pathname : `${basePath}/${monthParam ?? 26}`;
    const signinUrl = `/signin?next=${encodeURIComponent(next)}`;
    setSaveModal({ open: true, signedIn: false, signinUrl });
    const target = pathname || '/discover';
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('openAuth');
    const query = params.toString();
    router.replace(query ? `${target}?${query}` : target, { scroll: false });
  }, [searchParams, pathname, monthParam, basePath, router]);

  const getBandRange = (band: AgeBand | null): { min: number; max: number } | null => {
    if (!band) return null;
    const min = typeof band.min_months === 'number' ? band.min_months : NaN;
    const max = typeof band.max_months === 'number' ? band.max_months : NaN;
    if (!isNaN(min) && !isNaN(max)) return { min, max };
    const match = band.id.match(/^(\d+)-(\d+)m$/);
    if (!match) return null;
    return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  };

  const formatBandLabel = (band: AgeBand | null): string => {
    if (!band) return 'Age range';
    const range = getBandRange(band);
    if (!range) return band.label || band.id;
    return `${range.min}–${range.max} months`;
  };

  const getRepresentativeMonthForBand = (band: AgeBand | null): number | null => {
    const range = getBandRange(band);
    if (!range) return null;
    return range.min;
  };

  const getBandIndexById = (id: string | null): number => {
    if (!id) return 0;
    const idx = ageBands.findIndex((b) => b.id === id);
    return idx >= 0 ? idx : 0;
  };

  const propBandIndex = getBandIndexById(ageBand?.id ?? null);
  const [selectedBandIndex, setSelectedBandIndex] = useState(propBandIndex);
  const [selectedWrapper, setSelectedWrapper] = useState<string | null>(selectedWrapperSlug);

  useEffect(() => {
    setSelectedBandIndex(propBandIndex);
    setSelectedWrapper(selectedWrapperSlug);
  }, [propBandIndex, selectedWrapperSlug]);

  const selectedBand = ageBands[selectedBandIndex] ?? ageBand;
  const currentMonth = monthParam ?? 25;
  const is25to27 = currentMonth >= 25 && currentMonth <= 27;

  const discoverState: DiscoverState = !selectedWrapper
    ? 'NoFocusSelected'
    : showingExamples
      ? 'ShowingExamples'
      : selectedCategoryId
        ? 'CategorySelected'
        : 'FocusSelected';

  useEffect(() => {
    if (selectedBandIndex !== propBandIndex) {
      const nextBand = ageBands[selectedBandIndex] ?? null;
      const repMonth = getRepresentativeMonthForBand(nextBand) ?? currentMonth;
      router.push(`${basePath}/${repMonth}`, { scroll: false });
    }
  }, [selectedBandIndex, basePath, currentMonth, ageBands, propBandIndex, router]);

  const layerBReady = selectedWrapper && categoryTypes.length > 0;
  useEffect(() => {
    if (!layerBReady || !pendingScrollToNextSteps) return;
    const el = nextStepsSectionRef.current;
    if (!el) return;
    const behavior = shouldReduceMotion ? ('auto' as const) : ('smooth' as const);
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY < top - 40) {
        el.scrollIntoView({ behavior, block: 'start' });
      }
      setPendingScrollToNextSteps(false);
    });
  }, [layerBReady, pendingScrollToNextSteps, shouldReduceMotion]);

  const handleWrapperSelect = (wrapperSlug: string) => {
    setSelectedWrapper(wrapperSlug);
    setSelectedCategoryId(null);
    setShowingExamples(false);
    setPendingScrollToNextSteps(true);
    router.push(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(wrapperSlug)}`, { scroll: false });
  };

  const handleShowExamples = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowingExamples(true);
    router.push(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper!)}&show=1&category=${encodeURIComponent(categoryId)}`, { scroll: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToSection('examplesProgressBar'));
    });
  };

  const getSigninUrl = (productId?: string) => {
    const params = new URLSearchParams();
    const next = selectedWrapper
      ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
      : `${basePath}/${currentMonth}`;
    params.set('next', next);
    if (productId) params.set('productId', productId);
    return `/signin?${params.toString()}`;
  };

  const getSigninUrlForCategory = (categoryId: string) => {
    const params = new URLSearchParams();
    const next = selectedWrapper
      ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
      : `${basePath}/${currentMonth}`;
    params.set('next', next);
    return `/signin?${params.toString()}`;
  };

  const runReplayForAction = useCallback(
    async (action: PendingAuthAction) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      switch (action.actionId) {
        case 'save_category': {
          const categoryId = action.payload.categoryId as string | undefined;
          if (!categoryId) return;
          let ok = false;
          const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: false,
            p_gift: false,
          });
          if (!rpcError) ok = true;
          else if (rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function')) {
            const { error: legacyError } = await supabase.from('user_saved_ideas').upsert(
              { user_id: user.id, idea_id: categoryId },
              { onConflict: 'user_id,idea_id' }
            );
            if (!legacyError) ok = true;
          }
          if (ok) await refetchSubnavStats();
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrlForCategory(categoryId),
          });
          break;
        }
        case 'save_product': {
          const productId = action.payload.productId as string | undefined;
          if (!productId) return;
          let ok = false;
          const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'product',
            p_product_id: productId,
            p_want: true,
            p_have: false,
            p_gift: false,
          });
          if (!rpcError) ok = true;
          else if (rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function')) {
            const { error: legacyError } = await supabase.from('user_saved_products').upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            );
            if (!legacyError) ok = true;
          }
          if (ok) await refetchSubnavStats();
          await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              age_band: selectedBand?.id ?? undefined,
              source: 'discover_save',
            }),
          });
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrl(productId),
          });
          break;
        }
        case 'have_category': {
          const categoryId = (action.payload.categoryId as string) || 'category';
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: true,
            p_gift: false,
          });
          if (!error) await refetchSubnavStats();
          setActionToast({ productId: categoryId, message: "We've noted it." });
          break;
        }
        case 'have_product': {
          const productId = action.payload.productId as string | undefined;
          if (!productId) return;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'product',
            p_product_id: productId,
            p_want: true,
            p_have: true,
            p_gift: false,
          });
          if (!error) await refetchSubnavStats();
          await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              age_band: selectedBand?.id ?? undefined,
              source: 'discover_owned',
            }),
          });
          setActionToast({ productId, message: 'Marked as have it already.' });
          break;
        }
        default:
          break;
      }
    },
    [selectedBand?.id, selectedWrapper, currentMonth, basePath, refetchSubnavStats]
  );

  // Replay pending action once after sign-in (Option B: single place in DiscoveryPageClient)
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    const tryReplay = () => {
      if (cancelled || replayAttemptedRef.current) return;
      replayAttemptedRef.current = true;
      replayPendingAuthAction({
        currentPath: pathname || '/discover',
        runReplay: runReplayForAction,
        onReplayFailure: () =>
          setActionToast({ productId: 'replay', message: REPLAY_FAILURE_MESSAGE }),
      });
    };
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled && user) tryReplay();
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!cancelled && session?.user) tryReplay();
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [pathname, runReplayForAction]);

  const handleHaveThemCategory = (categoryId: string) => {
    requireAuthThen({
      actionId: 'have_category',
      payload: { categoryId },
      run: async () => {
        const supabase = createClient();
        const { error } = await supabase.rpc('upsert_user_list_item', {
          p_kind: 'category',
          p_category_type_id: categoryId,
          p_want: true,
          p_have: true,
          p_gift: false,
        });
        if (!error) await refetchSubnavStats();
        setActionToast({ productId: categoryId, message: "We've noted it." });
      },
      openAuthModal: ({ signinUrl }) => {
        saveModalFocusRef.current = null;
        setSaveModal({ open: true, signedIn: false, signinUrl });
        setActionToast({ productId: categoryId, message: 'Sign in to record what you have.' });
      },
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        selectedWrapper
          ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
          : `${basePath}/${currentMonth}`,
    });
  };

  const getProductUrl = (p: PickItem) =>
    p.product.canonical_url || p.product.amazon_uk_url || p.product.affiliate_url || p.product.affiliate_deeplink || '#';

  const visibleDoorwayList = showMore ? ALL_DOORWAYS : DEFAULT_DOORWAYS;
  const selectedDoorway = visibleDoorwayList.find((d) => {
    const r = resolveDoorwayToWrapper(d, wrappers);
    return r && r.ux_slug === selectedWrapper;
  });
  const selectedWrapperLabel = selectedDoorway?.label ?? wrappers.find((w) => w.ux_slug === selectedWrapper)?.ux_label ?? selectedWrapper ?? '';

  const doorwaysWithResolved = visibleDoorwayList.map((d) => ({
    type: 'doorway' as const,
    ...d,
    resolved: resolveDoorwayToWrapper(d, wrappers),
  }));
  const allTiles = doorwaysWithResolved;

  const debugText =
    showDebug && monthParam !== null && ageBand !== null
      ? `path → band: ${ageBand.id}${resolutionDebug ? ` | ${resolutionDebug}` : ''}`
      : null;

  const sliderProgress = ageBands.length > 0 ? (selectedBandIndex / Math.max(1, ageBands.length - 1)) * 100 : 0;

  const displayIdeas = showPicks && picks.length > 0 ? picks : exampleProducts;

  const handleHaveItAlready = (productId: string) => {
    requireAuthThen({
      actionId: 'have_product',
      payload: { productId },
      run: async () => {
        const supabase = createClient();
        const { error } = await supabase.rpc('upsert_user_list_item', {
          p_kind: 'product',
          p_product_id: productId,
          p_want: true,
          p_have: true,
          p_gift: false,
        });
        if (!error) await refetchSubnavStats();
        try {
          await fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              age_band: selectedBand?.id ?? undefined,
              source: 'discover_owned',
            }),
          });
        } catch {
          // Best-effort
        }
        setActionToast({ productId, message: 'Marked as have it already.' });
      },
      openAuthModal: ({ signinUrl }) => {
        saveModalFocusRef.current = null;
        setSaveModal({ open: true, signedIn: false, signinUrl });
        setActionToast({ productId, message: 'Sign in to record that you have this.' });
      },
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        selectedWrapper
          ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
          : `${basePath}/${currentMonth}`,
    });
  };

  const handleSaveCategory = (categoryId: string, triggerEl: HTMLButtonElement | null) => {
    saveModalFocusRef.current = triggerEl;
    requireAuthThen({
      actionId: 'save_category',
      payload: { categoryId },
      run: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        let ok = false;
        const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
          p_kind: 'category',
          p_category_type_id: categoryId,
          p_want: true,
          p_have: false,
          p_gift: false,
        });
        if (!rpcError) {
          ok = true;
        } else {
          const fallback = rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function');
          if (fallback) {
            const { error: legacyError } = await supabase.from('user_saved_ideas').upsert(
              { user_id: user.id, idea_id: categoryId },
              { onConflict: 'user_id,idea_id' }
            );
            if (!legacyError) ok = true;
          }
        }
        if (!ok) {
          setActionToast({ productId: categoryId, message: 'Could not save idea. Please try again.' });
          return;
        }
        await refetchSubnavStats();
        setActionToast({ productId: categoryId, message: 'Saved.' });
        setSaveModal({
          open: true,
          signedIn: true,
          signinUrl: getSigninUrlForCategory(categoryId),
        });
      },
      openAuthModal: ({ signinUrl }) =>
        setSaveModal({ open: true, signedIn: false, signinUrl }),
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        selectedWrapper
          ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
          : `${basePath}/${currentMonth}`,
    });
  };

  const handleSaveToList = (productId: string, triggerEl: HTMLButtonElement | null) => {
    saveModalFocusRef.current = triggerEl;
    requireAuthThen({
      actionId: 'save_product',
      payload: { productId },
      run: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        let ok = false;
        const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
          p_kind: 'product',
          p_product_id: productId,
          p_want: true,
          p_have: false,
          p_gift: false,
        });
        if (!rpcError) {
          ok = true;
        } else {
          const fallback = rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function');
          if (fallback) {
            const { error: legacyError } = await supabase.from('user_saved_products').upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            );
            if (!legacyError) ok = true;
          }
        }
        if (!ok) {
          setActionToast({ productId, message: 'Could not save. Please try again.' });
          return;
        }
        setActionToast({ productId, message: 'Saved.' });
        await fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: productId,
            age_band: selectedBand?.id ?? undefined,
            source: 'discover_save',
          }),
        });
        await refetchSubnavStats();
        setSaveModal({
          open: true,
          signedIn: true,
          signinUrl: getSigninUrl(productId),
        });
      },
      openAuthModal: ({ signinUrl }) =>
        setSaveModal({ open: true, signedIn: false, signinUrl }),
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        selectedWrapper
          ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
          : `${basePath}/${currentMonth}`,
    });
  };

  const handleAuthSuccess = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setSaveModal((prev) => ({ ...prev, signedIn: !!user }));
    } catch {
      setSaveModal((prev) => ({ ...prev, signedIn: false }));
    }
  }, []);

  const btnStyle = {
    borderColor: 'var(--ember-border-subtle)',
    backgroundColor: 'var(--ember-surface-primary)',
    color: 'var(--ember-text-high)',
    fontFamily: 'var(--font-sans)',
  };

  const heroSection = !user ? (
    <DiscoverHeroPocketPlayGuide
      onGetStarted={() => scrollToSection('discover-start')}
      hideGetStarted={false}
    />
  ) : null;

  const leftSurface = (
    <div className="w-full min-w-0 flex-1" style={SURFACE_STYLE}>
      <div className="py-6 px-4 sm:px-6 sm:py-8">
        <div className="relative">
          <div className="mb-5">
            <span
              className="block text-sm mb-2"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember-text-high)', fontSize: '14px' }}
            >
              {formatBandLabel(selectedBand)}
            </span>
            <div
              className="discovery-slider-wrap relative w-full"
              style={{ '--slider-progress': `${sliderProgress}%` } as React.CSSProperties}
            >
              <input
                type="range"
                min={0}
                max={Math.max(0, ageBands.length - 1)}
                step={1}
                value={selectedBandIndex}
                onChange={(e) => setSelectedBandIndex(Number(e.target.value))}
                className="discovery-age-slider w-full"
                aria-label="Age range"
              />
            </div>
            {debugText && (
              <div className="mt-2 text-[11px] px-2 py-1 rounded bg-amber-50" style={{ color: 'var(--ember-text-low)' }}>
                {debugText}
              </div>
            )}
          </div>

          {selectedBandHasPicks ? (
            <>
              <div className="mb-6">
                <h2 className="text-base font-medium mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
                  What they&apos;re learning right now
                </h2>
                <p
                  className="mb-3 text-sm"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                >
                  At this age, these are especially common. Pick one to start.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                  {allTiles.map((tile) => {
                    if (tile.type === 'doorway' && !tile.resolved) {
                      return (
                        <div
                          key={tile.key}
                          className="min-h-[120px] rounded-xl p-3 flex flex-col gap-1 overflow-hidden opacity-60 cursor-not-allowed border border-[var(--ember-border-subtle)]"
                          style={{ fontFamily: 'var(--font-sans)' }}
                        >
                          <tile.icon size={18} strokeWidth={1.5} style={{ color: '#B8432B', flexShrink: 0 }} />
                          <span className="block font-medium line-clamp-2 text-sm leading-snug" style={{ color: 'var(--ember-text-high)' }} title={tile.label}>{tile.label}</span>
                          <span className="block text-xs line-clamp-2 leading-snug" style={{ color: 'var(--ember-text-low)' }}>Coming soon</span>
                        </div>
                      );
                    }
                    const slug = tile.resolved!.ux_slug;
                    const label = tile.label;
                    const helper = tile.helper;
                    const isSelected = selectedWrapper === slug;
                    const showSuggested = is25to27 && SUGGESTED_DOORWAY_KEYS_25_27.includes(tile.key);
                    const Icon = tile.icon;
                    return (
                      <button
                        key={slug}
                        type="button"
                        onClick={() => handleWrapperSelect(slug)}
                        className={`min-h-[120px] rounded-xl p-3 text-left cursor-pointer flex flex-col gap-1 overflow-hidden border transition-[box-shadow,transform] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none motion-reduce:translate-y-0 ${isSelected ? '-translate-y-px' : ''}`}
                        style={{
                          fontFamily: 'var(--font-sans)',
                          backgroundColor: 'var(--ember-surface-primary)',
                          borderColor: isSelected ? 'transparent' : 'var(--ember-border-subtle)',
                          boxShadow: isSelected ? '0px 0px 28px rgba(255, 99, 71, 0.35), 0px 10px 30px rgba(0,0,0,0.06)' : 'none',
                          outline: 'none',
                        }}
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Icon size={18} strokeWidth={1.5} style={{ color: '#B8432B', flexShrink: 0 }} />
                          {showSuggested && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'rgba(184,67,43,0.12)', color: '#B8432B' }}>
                              Suggested
                            </span>
                          )}
                        </div>
                        <span
                          className="block font-medium line-clamp-2 text-sm leading-snug"
                          style={{ color: 'var(--ember-text-high)' }}
                          title={label}
                        >
                          {label}
                        </span>
                        <span
                          className="block text-xs line-clamp-2 leading-snug"
                          style={{ color: 'var(--ember-text-low)' }}
                          title={helper}
                        >
                          {helper}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {!showMore && MORE_DOORWAYS.length > 0 && (
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium"
                    style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
                    onClick={() => setShowMore(true)}
                  >
                    See all
                  </button>
                )}
              </div>

            </>
          ) : (
            <div
              className="rounded-xl border p-6 text-center"
              style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-soft)' }}
            >
              <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
                Catalogue coming soon for {formatBandLabel(ageBand)}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const nextStepsSection = discoverState !== 'NoFocusSelected' && selectedBandHasPicks && (
    <section
      ref={nextStepsSectionRef}
      id="nextStepsSection"
      className="w-full scroll-mt-6"
      style={SURFACE_STYLE}
    >
      <div className="py-6 px-4 sm:px-6 sm:py-8">
        <button
          type="button"
          onClick={() => scrollToSection('discover-start')}
          className="mb-4 text-sm font-medium"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          ← Back to choices
        </button>
        <h2 className="text-lg font-medium mb-1" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
          Next steps for {selectedWrapperLabel}
        </h2>
        <p className="text-sm mb-4 flex flex-wrap items-center gap-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
          Chosen for {formatBandLabel(selectedBand)} •{' '}
          <button
            type="button"
            onClick={() => setHowWeChooseOpen(true)}
            className="inline-flex items-center gap-0.5 cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1 rounded px-1"
            style={{ color: 'var(--ember-text-low)' }}
          >
            Explained <span aria-hidden>ⓘ</span>
          </button>
        </p>
        {categoryTypes.length > 0 ? (
          <CategoryCarousel
            resetKey={selectedWrapper ?? ''}
            categories={categoryTypes.map((ct) => ({
              id: ct.id,
              slug: ct.slug,
              label: ct.label,
              name: ct.name,
              rationale: ct.rationale,
              image_url: ct.image_url,
            }))}
            onShowExamples={handleShowExamples}
            onSaveIdea={handleSaveCategory}
            onHaveThem={handleHaveThemCategory}
          />
        ) : (
          <div className="rounded-xl border p-6 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-soft)' }}>
            <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
              We&apos;re adding more ideas here.
            </p>
          </div>
        )}
      </div>
    </section>
  );

  const examplesSection = discoverState === 'ShowingExamples' && (
    <section
      id="examplesSection"
      className="w-full scroll-mt-6"
      style={SURFACE_STYLE}
    >
      <div className="py-6 px-4 sm:px-6 sm:py-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h2 className="text-lg font-medium m-0" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}>
            Examples you might like
          </h2>
          {displayIdeas.length > 0 && (
            <button
              type="button"
              className="rounded-lg border-0 bg-transparent py-2 px-0 text-sm cursor-pointer hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)', fontSize: '14px' }}
              onClick={() => setHowWeChooseOpen(true)}
            >
              Why these?
            </button>
          )}
        </div>
        {!selectedBandHasPicks || (displayIdeas.length === 0) ? (
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-primary)' }}>
            <p className="text-sm m-0" style={{ color: 'var(--ember-text-low)' }}>
              We&apos;re still building ideas for this focus. Try another.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-2" style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}>
              Chosen for {formatBandLabel(selectedBand)}
            </p>
            <DiscoverCardStack
              picks={displayIdeas.slice(0, 12)}
              ageRangeLabel={formatBandLabel(selectedBand)}
              wrapperLabel={selectedWrapperLabel}
              onSave={handleSaveToList}
              onHave={handleHaveItAlready}
              getProductUrl={getProductUrl}
              progressBarId="examplesProgressBar"
            />
          </>
        )}
      </div>
    </section>
  );

  const selectorWithId = (
    <div id="discover-start" className="scroll-mt-6">
      {leftSurface}
    </div>
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: 'var(--ember-bg-canvas)' }}
      data-discover-version="acq-v2-vertical"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        {actionToast && (
          <div
            className="rounded-lg border py-2 px-3 text-sm mb-4"
            style={{ borderColor: 'var(--ember-border-subtle)', backgroundColor: 'var(--ember-surface-soft)', color: 'var(--ember-text-high)', fontFamily: 'var(--font-sans)' }}
          >
            {actionToast.message}
          </div>
        )}
        <SaveToListModal
          open={saveModal.open}
          onClose={() => setSaveModal((s) => ({ ...s, open: false }))}
          signedIn={saveModal.signedIn}
          signinUrl={saveModal.signinUrl}
          onCloseFocusRef={saveModalFocusRef}
          onAuthSuccess={handleAuthSuccess}
        />
        <HowWeChooseSheet open={howWeChooseOpen} onClose={() => setHowWeChooseOpen(false)} />
        {heroSection}
        <div className={`w-full flex flex-col gap-8 ${!user ? 'py-6 sm:py-8' : 'pt-2 pb-6 sm:pt-2 sm:pb-8'}`}>
          {selectorWithId}
          {nextStepsSection}
          {examplesSection}
        </div>
      </div>
    </div>
  );
}
