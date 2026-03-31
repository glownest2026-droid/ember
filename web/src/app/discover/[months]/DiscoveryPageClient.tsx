'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useReducedMotion } from 'motion/react';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { GatewayPick, GatewayWrapperPublic } from '@/lib/pl/public';
import {
  ALL_DOORWAYS,
  DEFAULT_DOORWAYS,
  MORE_DOORWAYS,
  SUGGESTED_DOORWAY_KEYS_25_27,
  resolveDoorwayToWrapper,
} from '@/lib/discover/doorways';
import { HowWeChooseSheet } from '@/components/discover/HowWeChooseSheet';
import { DiscoverFigmaChildHero } from '@/components/discover/figma/DiscoverFigmaChildHero';
import { DiscoverFigmaNeedCard } from '@/components/discover/figma/DiscoverFigmaNeedCard';
import { DiscoverFigmaScienceSection } from '@/components/discover/figma/DiscoverFigmaScienceSection';
import { DiscoverFigmaPlayCarousel } from '@/components/discover/figma/DiscoverFigmaPlayCarousel';
import { DiscoverFigmaProductCarousel } from '@/components/discover/figma/DiscoverFigmaProductCarousel';
import {
  displayChildName,
  personalizationFromChildrenRow,
  type DiscoverChildPersonalization,
} from '@/lib/discover/personalization';
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
  initialChildId?: string;
  /** From server (reliable session); fixes hero when client searchParams/user timing is wrong */
  serverPersonalization?: DiscoverChildPersonalization | null;
}

const EMBER_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

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
  initialChildId,
  serverPersonalization = null,
}: DiscoveryPageClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const [childProfile, setChildProfile] = useState<{
    displayLabel: string | null;
    gender: string | null;
    monthsOld: number | null;
  }>({
    displayLabel: serverPersonalization?.displayLabel ?? null,
    gender: serverPersonalization?.gender ?? null,
    monthsOld: serverPersonalization?.monthsOld ?? null,
  });
  const [howWeChooseOpen, setHowWeChooseOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [actionToast, setActionToast] = useState<{ productId: string; message: string } | null>(null);
  const [showingExamples, setShowingExamples] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [saveModal, setSaveModal] = useState<{
    open: boolean;
    signedIn: boolean;
    signinUrl: string;
    viewMyListHref?: string;
  }>({ open: false, signedIn: false, signinUrl: '' });
  const saveModalFocusRef = useRef<HTMLButtonElement | null>(null);
  const nextStepsSectionRef = useRef<HTMLElement | null>(null);
  const [pendingScrollToNextSteps, setPendingScrollToNextSteps] = useState(false);
  const replayAttemptedRef = useRef(false);
  const basePath = '/discover';
  const { user, refetch: refetchSubnavStats } = useSubnavStats();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedChildId = searchParams.get('child') ?? initialChildId ?? undefined;
  const withChildParam = (url: string) =>
    selectedChildId ? `${url}${url.includes('?') ? '&' : '?'}child=${encodeURIComponent(selectedChildId)}` : url;

  const childIdForPersonalization = selectedChildId?.trim() || initialChildId?.trim() || undefined;

  useEffect(() => {
    if (!childIdForPersonalization) {
      setChildProfile({ displayLabel: null, gender: null, monthsOld: null });
      return;
    }
    if (serverPersonalization) {
      setChildProfile({
        displayLabel: serverPersonalization.displayLabel,
        gender: serverPersonalization.gender,
        monthsOld: serverPersonalization.monthsOld,
      });
    }
  }, [childIdForPersonalization, serverPersonalization]);

  /**
   * Client load: select('*') avoids hard-coded columns failing on older schemas.
   * Uses getUser() here (not SubnavStats user) so we don't race context hydration.
   */
  useEffect(() => {
    if (!childIdForPersonalization) return;
    let cancelled = false;
    const supabase = createClient();
    const id = childIdForPersonalization.trim();

    async function pull() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u || cancelled) return;
      const { data, error } = await supabase.from('children').select('*').eq('id', id).maybeSingle();
      if (cancelled || error || !data) return;
      setChildProfile(personalizationFromChildrenRow(data as Record<string, unknown>));
    }

    void pull();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled || !session?.user) return;
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') void pull();
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [childIdForPersonalization]);

  const categoryFromUrl = searchParams.get('category');
  useEffect(() => {
    if (showPicks && categoryFromUrl && categoryTypes.some((c) => c.id === categoryFromUrl)) {
      setSelectedCategoryId(categoryFromUrl);
    }
  }, [showPicks, categoryFromUrl, categoryTypes]);

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

  // Open auth modal when URL has openAuth=1 (e.g. "Join free" on discover). Preserve child param.
  useEffect(() => {
    if (searchParams?.get('openAuth') !== '1') return;
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.delete('openAuth');
    const nextPath = pathname && pathname.startsWith('/discover') ? pathname : `${basePath}/${monthParam ?? 26}`;
    const nextWithChild = selectedChildId ? `${nextPath}${nextPath.includes('?') ? '&' : '?'}child=${encodeURIComponent(selectedChildId)}` : nextPath;
    const signinUrl = `/signin?next=${encodeURIComponent(nextWithChild)}`;
    setSaveModal({ open: true, signedIn: false, signinUrl });
    const target = pathname || '/discover';
    const query = params.toString();
    router.replace(query ? `${target}?${query}` : target, { scroll: false });
  }, [searchParams, pathname, monthParam, basePath, router, selectedChildId]);

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

  function safeHostFromUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    try {
      const u = new URL(url);
      return u.host;
    } catch {
      return null;
    }
  }

  function getRetailerHostFromProductId(productId: string): string | null {
    const all = [...picks, ...exampleProducts];
    const pick = all.find((p) => p.product.id === productId);
    const url =
      pick?.product.canonical_url ||
      pick?.product.amazon_uk_url ||
      pick?.product.affiliate_url ||
      pick?.product.affiliate_deeplink ||
      null;
    return safeHostFromUrl(url);
  }

  useEffect(() => {
    if (selectedBandIndex !== propBandIndex) {
      const nextBand = ageBands[selectedBandIndex] ?? null;
      const repMonth = getRepresentativeMonthForBand(nextBand) ?? currentMonth;
      router.push(withChildParam(`${basePath}/${repMonth}`), { scroll: false });
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
    if (selectedWrapper === wrapperSlug) {
      setSelectedWrapper(null);
      setSelectedCategoryId(null);
      setShowingExamples(false);
      router.push(withChildParam(`${basePath}/${currentMonth}`), { scroll: false });
      return;
    }
    setSelectedWrapper(wrapperSlug);
    setSelectedCategoryId(null);
    setShowingExamples(false);
    setPendingScrollToNextSteps(true);
    router.push(withChildParam(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(wrapperSlug)}`), { scroll: false });
  };

  const handleDiscoverStartOver = useCallback(() => {
    setSelectedWrapper(null);
    setSelectedCategoryId(null);
    setShowingExamples(false);
    router.push(withChildParam(`${basePath}/${currentMonth}`), { scroll: false });
    const top = document.getElementById('discover-figma-stage1');
    top?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [basePath, currentMonth, router, shouldReduceMotion, withChildParam]);

  const handleShowExamples = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowingExamples(true);
    router.push(withChildParam(`${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper!)}&show=1&category=${encodeURIComponent(categoryId)}`), { scroll: false });
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
          const childId = action.payload.childId as string | undefined;
          if (!categoryId) return;
          let ok = false;
          const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: false,
            p_gift: false,
            ...(childId ? { p_child_id: childId } : {}),
          });
          if (!rpcError) ok = true;
          else if (rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function')) {
            const { error: legacyError } = await supabase.from('user_saved_ideas').upsert(
              { user_id: user.id, idea_id: categoryId },
              { onConflict: 'user_id,idea_id' }
            );
            if (!legacyError) ok = true;
          }
          if (ok) await refetchSubnavStats(selectedChildId);
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrlForCategory(categoryId),
            viewMyListHref: withChildParam('/my-ideas?tab=ideas'),
          });
          break;
        }
        case 'save_product': {
          const productId = action.payload.productId as string | undefined;
          const childId = action.payload.childId as string | undefined;
          if (!productId) return;
          let ok = false;
          const { error: rpcError } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'product',
            p_product_id: productId,
            p_want: true,
            p_have: false,
            p_gift: false,
            ...(childId ? { p_child_id: childId } : {}),
          });
          if (!rpcError) ok = true;
          else if (rpcError.code === '42883' || rpcError.message?.includes('does not exist') || rpcError.message?.includes('function')) {
            const { error: legacyError } = await supabase.from('user_saved_products').upsert(
              { user_id: user.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            );
            if (!legacyError) ok = true;
          }
          if (ok) {
            trackEvent(EVENTS.PRODUCT_SAVED, {
              user_id: user.id,
              kind: 'product',
              product_id: productId,
              source_surface: 'discover_save',
              child_id: childId ?? null,
            });
            await refetchSubnavStats(selectedChildId);
          }

          trackEvent(EVENTS.RETAILER_OUTBOUND_CLICKED, {
            user_id: user.id,
            product_id: productId,
            source_surface: 'discover',
            source: 'discover_save',
            click_path_type: 'api_click',
            retailer_host: getRetailerHostFromProductId(productId),
            child_id: childId ?? null,
          });

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
            viewMyListHref: withChildParam('/my-ideas?tab=products'),
          });
          break;
        }
        case 'have_category': {
          const categoryId = (action.payload.categoryId as string) || 'category';
          const childId = action.payload.childId as string | undefined;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: true,
            p_gift: false,
            ...(childId ? { p_child_id: childId } : {}),
          });
          if (!error) await refetchSubnavStats(selectedChildId);
          setActionToast({ productId: categoryId, message: "We've noted it." });
          break;
        }
        case 'have_product': {
          const productId = action.payload.productId as string | undefined;
          const childId = action.payload.childId as string | undefined;
          if (!productId) return;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'product',
            p_product_id: productId,
            p_want: true,
            p_have: true,
            p_gift: false,
            ...(childId ? { p_child_id: childId } : {}),
          });
          if (!error) await refetchSubnavStats(selectedChildId);

          trackEvent(EVENTS.RETAILER_OUTBOUND_CLICKED, {
            user_id: user.id,
            product_id: productId,
            source_surface: 'discover',
            source: 'discover_owned',
            click_path_type: 'api_click',
            retailer_host: getRetailerHostFromProductId(productId),
            child_id: childId ?? null,
          });

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
    [selectedBand?.id, selectedWrapper, currentMonth, basePath, refetchSubnavStats, selectedChildId]
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
      payload: { categoryId, childId: selectedChildId },
      run: async () => {
        try {
          const supabase = createClient();
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: true,
            p_gift: false,
            ...(selectedChildId ? { p_child_id: selectedChildId } : {}),
          });
          if (error) throw error;
          await refetchSubnavStats(selectedChildId);
          setActionToast({ productId: categoryId, message: "We've noted it." });
        } catch {
          setActionToast({ productId: categoryId, message: "Couldn't update. Please try again." });
        }
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
        withChildParam(
          selectedWrapper
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
            : `${basePath}/${currentMonth}`,
        ),
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

  const shortlistTrackKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (discoverState !== 'ShowingExamples') return;
    if (displayIdeas.length <= 0) return;
    const key = `${ageBand?.id ?? 'none'}|${selectedWrapper ?? 'none'}|${selectedChildId ?? 'none'}`;
    if (shortlistTrackKeyRef.current === key) return;
    shortlistTrackKeyRef.current = key;

    trackEvent(EVENTS.SHORTLIST_VIEWED, {
      pathname: pathname ?? null,
      user_id: user?.id ?? null,
      child_id: selectedChildId ?? null,
      age_band_id: ageBand?.id ?? null,
      wrapper_slug: selectedWrapper ?? null,
      result_count: displayIdeas.length,
    });
  }, [discoverState, displayIdeas.length, ageBand?.id, selectedWrapper, selectedChildId, user?.id, pathname]);

  const handleHaveItAlready = (productId: string) => {
    requireAuthThen({
      actionId: 'have_product',
      payload: { productId, childId: selectedChildId },
      run: async () => {
        const supabase = createClient();
        const { error } = await supabase.rpc('upsert_user_list_item', {
          p_kind: 'product',
          p_product_id: productId,
          p_want: true,
          p_have: true,
          p_gift: false,
          ...(selectedChildId ? { p_child_id: selectedChildId } : {}),
        });
        if (!error) await refetchSubnavStats(selectedChildId);
        try {
          trackEvent(EVENTS.RETAILER_OUTBOUND_CLICKED, {
            product_id: productId,
            source_surface: 'discover',
            source: 'discover_owned',
            click_path_type: 'api_click',
            retailer_host: getRetailerHostFromProductId(productId),
            child_id: selectedChildId ?? null,
          });
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
        withChildParam(
          selectedWrapper
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
            : `${basePath}/${currentMonth}`,
        ),
    });
  };

  const handleSaveCategory = (categoryId: string, triggerEl: HTMLButtonElement | null) => {
    saveModalFocusRef.current = triggerEl;
    requireAuthThen({
      actionId: 'save_category',
      payload: { categoryId, childId: selectedChildId },
      run: async () => {
        try {
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
            ...(selectedChildId ? { p_child_id: selectedChildId } : {}),
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
          await refetchSubnavStats(selectedChildId);
          setActionToast({ productId: categoryId, message: 'Saved.' });
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrlForCategory(categoryId),
            viewMyListHref: withChildParam('/my-ideas?tab=ideas'),
          });
        } catch {
          setActionToast({ productId: categoryId, message: 'Could not save idea. Please try again.' });
        }
      },
      openAuthModal: ({ signinUrl }) =>
        setSaveModal({ open: true, signedIn: false, signinUrl }),
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        withChildParam(
          selectedWrapper
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
            : `${basePath}/${currentMonth}`,
        ),
    });
  };

  const handleSaveToList = (productId: string, triggerEl: HTMLButtonElement | null) => {
    saveModalFocusRef.current = triggerEl;
    requireAuthThen({
      actionId: 'save_product',
      payload: { productId, childId: selectedChildId },
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
          ...(selectedChildId ? { p_child_id: selectedChildId } : {}),
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

        trackEvent(EVENTS.PRODUCT_SAVED, {
          user_id: user.id,
          kind: 'product',
          product_id: productId,
          source_surface: 'discover_save',
          child_id: selectedChildId ?? null,
        });

        trackEvent(EVENTS.RETAILER_OUTBOUND_CLICKED, {
          user_id: user.id,
          product_id: productId,
          source_surface: 'discover',
          source: 'discover_save',
          click_path_type: 'api_click',
          retailer_host: getRetailerHostFromProductId(productId),
          child_id: selectedChildId ?? null,
        });

        await fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: productId,
            age_band: selectedBand?.id ?? undefined,
            source: 'discover_save',
          }),
        });
        await refetchSubnavStats(selectedChildId);
        setSaveModal({
          open: true,
          signedIn: true,
          signinUrl: getSigninUrl(productId),
          viewMyListHref: withChildParam('/my-ideas?tab=products'),
        });
      },
      openAuthModal: ({ signinUrl }) =>
        setSaveModal({ open: true, signedIn: false, signinUrl }),
      isAuthenticated: async () => {
        const { data: { user } } = await createClient().auth.getUser();
        return !!user;
      },
      getReturnUrl: () =>
        withChildParam(
          selectedWrapper
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1`
            : `${basePath}/${currentMonth}`,
        ),
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

  const chosenForLabel = childProfile.displayLabel
    ? `${childProfile.displayLabel} • ${formatBandLabel(selectedBand)}`
    : formatBandLabel(selectedBand);

  const selectedWrapperRecord = wrappers.find((w) => w.ux_slug === selectedWrapper) ?? null;
  const scienceBody = (selectedWrapperRecord?.ux_description || '').trim();
  const playIdeaItems = useMemo(
    () =>
      categoryTypes.map((ct) => ({
        id: ct.id,
        title: (ct.label || ct.name || 'Play idea').trim(),
        description: (ct.rationale || ct.description || '').trim(),
        scienceConnection: formatBandLabel(selectedBand),
        imageUrl: ct.image_url?.trim() || '',
      })),
    [categoryTypes, selectedBand]
  );

  const whyWorksHeading = `Why this works for ${displayChildName(childProfile.displayLabel)}`;
  const scienceTitle = `Why this matters for ${displayChildName(childProfile.displayLabel)}`;
  const startOverVisible = Boolean(selectedWrapper || (showPicks && displayIdeas.length > 0));
  const possessiveChild = childProfile.displayLabel ? `${childProfile.displayLabel}'s` : "your child's";

  const heroSection = !user ? (
    <DiscoverHeroPocketPlayGuide
      onGetStarted={() => scrollToSection('discover-figma-stage1')}
      hideGetStarted={false}
    />
  ) : null;

  return (
    <div
      className="min-h-screen w-full bg-[var(--ember-surface-soft)]"
      data-discover-version="figma-redesign-v1"
    >
      {actionToast && (
        <div className="max-w-[90rem] mx-auto px-6 lg:px-12 pt-4">
          <div
            className="rounded-lg border py-2 px-3 text-sm"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-high)',
            }}
          >
            {actionToast.message}
          </div>
        </div>
      )}
      <SaveToListModal
        open={saveModal.open}
        onClose={() => setSaveModal((s) => ({ ...s, open: false }))}
        signedIn={saveModal.signedIn}
        signinUrl={saveModal.signinUrl}
        viewMyListHref={saveModal.viewMyListHref}
        onCloseFocusRef={saveModalFocusRef}
        onAuthSuccess={handleAuthSuccess}
      />
      <HowWeChooseSheet open={howWeChooseOpen} onClose={() => setHowWeChooseOpen(false)} />

      {heroSection}

      <main className="max-w-[90rem] mx-auto px-6 lg:px-12 py-6 lg:py-10">
        {user ? (
          <DiscoverFigmaChildHero
            childDisplayLabel={childProfile.displayLabel}
            childGender={childProfile.gender}
            monthAge={
              childIdForPersonalization && childProfile.monthsOld != null
                ? childProfile.monthsOld
                : (monthParam ?? 26)
            }
            heroImageUrl={selectedBandHasPicks ? categoryTypes[0]?.image_url : null}
          />
        ) : null}

        {/* Age slider always visible (prod parity) so users can leave bands with no catalogue */}
        <div id="discover-figma-stage1" className="scroll-mt-6 mb-8">
          <span
            className="block text-sm mb-2"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--ember-text-high)', fontSize: '14px' }}
          >
            {chosenForLabel}
          </span>
          <div
            className="discovery-slider-wrap relative w-full max-w-xl mb-2"
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
          <p className="text-sm text-[var(--ember-text-low)] mb-2 max-w-xl">
            Slide to a different age band if you don&apos;t see recommendations here.
          </p>
          {debugText ? (
            <div className="mb-4 text-[11px] px-2 py-1 rounded bg-amber-50 text-[var(--ember-text-low)]">{debugText}</div>
          ) : null}
        </div>

        {selectedBandHasPicks ? (
          <>
            <div className="mb-5 lg:mb-8">
              <p className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)] mb-2 uppercase tracking-wide">
                Stage 1: Understanding development
              </p>
              <h2 className="text-xl lg:text-2xl text-[var(--ember-text-high)] font-medium">
                <span className="inline-flex items-center gap-2">
                  <Image
                    src={EMBER_LOGO_SRC}
                    alt=""
                    width={64}
                    height={64}
                    className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] lg:h-[52px] lg:w-[52px] object-contain"
                  />
                  Choose what you&apos;d like to explore
                </span>
              </h2>
              {!user ? (
                <p className="text-sm text-[var(--ember-text-low)] mt-2">Pick a focus for this age. Sign in to personalize with your child.</p>
              ) : null}
            </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {allTiles.map((tile) => {
                  if (tile.type === 'doorway' && !tile.resolved) {
                    return (
                      <DiscoverFigmaNeedCard
                        key={tile.key}
                        icon={tile.icon}
                        title={tile.label}
                        description={tile.helper}
                        science="Coming soon"
                        isSelected={false}
                        onClick={() => {}}
                        disabled
                      />
                    );
                  }
                  const slug = tile.resolved!.ux_slug;
                  const isSelected = selectedWrapper === slug;
                  const showSuggested = is25to27 && SUGGESTED_DOORWAY_KEYS_25_27.includes(tile.key);
                  return (
                    <div key={slug} className="relative">
                      {showSuggested ? (
                        <span className="absolute -top-2 left-2 z-10 text-[10px] px-2 py-0.5 rounded-full font-medium bg-[rgba(184,67,43,0.12)] text-[#B8432B]">
                          Suggested
                        </span>
                      ) : null}
                      <DiscoverFigmaNeedCard
                        icon={tile.icon}
                        title={tile.label}
                        description={tile.helper}
                        science={showSuggested ? 'Great fit for this age' : 'Tap to explore'}
                        isSelected={isSelected}
                        onClick={() => handleWrapperSelect(slug)}
                      />
                    </div>
                  );
                })}
              </div>
              {!showMore && MORE_DOORWAYS.length > 0 ? (
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-[var(--ember-text-low)] hover:text-[var(--ember-text-high)]"
                  onClick={() => setShowMore(true)}
                >
                  See all
                </button>
              ) : null}

            {selectedWrapper ? (
              <section className="mb-10 lg:mb-20 scroll-mt-6">
                <button
                  type="button"
                  onClick={() => handleWrapperSelect(selectedWrapper)}
                  className="mb-4 text-sm font-medium text-[var(--ember-text-low)] hover:underline"
                >
                  ← Back to choices
                </button>
                <div className="mb-5 lg:mb-8">
                  <p className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)] mb-2 uppercase tracking-wide">
                    Stage 2: Why this matters
                  </p>
                  <h2 className="text-xl lg:text-2xl text-[var(--ember-text-high)] font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Image
                        src={EMBER_LOGO_SRC}
                        alt=""
                        width={64}
                        height={64}
                        className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] lg:h-[52px] lg:w-[52px] object-contain"
                      />
                      {selectedWrapperLabel}
                    </span>
                  </h2>
                  <p className="text-sm text-[var(--ember-text-low)] mt-2 flex flex-wrap items-center gap-1">
                    Chosen for {chosenForLabel} •{' '}
                    <button
                      type="button"
                      onClick={() => setHowWeChooseOpen(true)}
                      className="inline-flex items-center gap-0.5 hover:underline focus:outline-none focus-visible:ring-2 rounded"
                    >
                      Explained <span aria-hidden>ⓘ</span>
                    </button>
                  </p>
                </div>
                {scienceBody ? (
                  <DiscoverFigmaScienceSection title={scienceTitle} description={scienceBody} />
                ) : (
                  <p className="text-[var(--ember-text-low)] text-sm mb-8">
                    We&apos;re adding more detail for this focus soon.
                  </p>
                )}
              </section>
            ) : null}

            {selectedWrapper ? (
              <section ref={nextStepsSectionRef} id="discover-figma-stage3" className="mb-10 lg:mb-20 scroll-mt-6">
                <div className="mb-5 lg:mb-8">
                  <p className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)] mb-2 uppercase tracking-wide">
                    Stage 3: Play ideas
                  </p>
                  <h2 className="text-xl lg:text-2xl text-[var(--ember-text-high)] font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Image
                        src={EMBER_LOGO_SRC}
                        alt=""
                        width={64}
                        height={64}
                        className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] lg:h-[52px] lg:w-[52px] object-contain"
                      />
                      Try these ideas to support {selectedWrapperLabel.toLowerCase()}
                    </span>
                  </h2>
                </div>
                {playIdeaItems.length > 0 ? (
                  <DiscoverFigmaPlayCarousel
                    items={playIdeaItems}
                    selectedId={selectedCategoryId}
                    onSelect={setSelectedCategoryId}
                    onSeeExamples={handleShowExamples}
                    onSaveIdea={(categoryId, el) => handleSaveCategory(categoryId, el)}
                    onHaveThem={handleHaveThemCategory}
                    showHaveAction={!!user}
                  />
                ) : (
                  <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-8 text-center text-[var(--ember-text-low)] text-sm">
                    We&apos;re adding more ideas here.
                  </div>
                )}
              </section>
            ) : null}

            {discoverState === 'ShowingExamples' ? (
              <section id="discover-figma-products" className="mb-10 lg:mb-24 pb-8 scroll-mt-6">
                <div id="examplesProgressBar" className="mb-5 lg:mb-8">
                  <p className="text-xs lg:text-sm font-semibold text-[var(--ember-accent-base)] mb-2 uppercase tracking-wide">
                    Stage 4: Product examples
                  </p>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-xl lg:text-2xl text-[var(--ember-text-high)] font-medium m-0">
                      <span className="inline-flex items-center gap-2">
                        <Image
                          src={EMBER_LOGO_SRC}
                          alt=""
                          width={64}
                          height={64}
                          className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] lg:h-[52px] lg:w-[52px] object-contain"
                        />
                        Examples you might like
                      </span>
                    </h2>
                    {displayIdeas.length > 0 ? (
                      <button
                        type="button"
                        className="text-sm text-[var(--ember-text-low)] hover:underline"
                        onClick={() => setHowWeChooseOpen(true)}
                      >
                        Why these?
                      </button>
                    ) : null}
                  </div>
                  <p className="text-xs text-[var(--ember-text-low)] mt-2">Chosen for {chosenForLabel}</p>
                </div>
                {!selectedBandHasPicks || displayIdeas.length === 0 ? (
                  <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-8 text-center text-sm text-[var(--ember-text-low)]">
                    We&apos;re still building ideas for this focus. Try another category or focus.
                  </div>
                ) : (
                  <DiscoverFigmaProductCarousel
                    key={`${selectedWrapper}-${categoryFromUrl ?? ''}-${displayIdeas.length}`}
                    picks={displayIdeas.slice(0, 12)}
                    ageRangeLabel={formatBandLabel(selectedBand)}
                    whyWorksHeading={whyWorksHeading}
                    onSave={handleSaveToList}
                    onHave={handleHaveItAlready}
                    getProductUrl={getProductUrl}
                    showHaveAction={!!user}
                  />
                )}
              </section>
            ) : null}

            {startOverVisible && displayIdeas.length > 0 && discoverState === 'ShowingExamples' ? (
              <div className="max-w-2xl mx-auto text-center mb-16">
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[var(--ember-border-subtle)]">
                  <h3 className="text-xl lg:text-2xl mb-3 text-[var(--ember-text-high)] font-medium">Want to explore another area?</h3>
                  <p className="text-base lg:text-lg text-[var(--ember-text-low)] mb-6">
                    Start over to discover more ways to support {possessiveChild} development
                  </p>
                  <button
                    type="button"
                    onClick={handleDiscoverStartOver}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--ember-accent-base)] text-white rounded-full font-medium text-base lg:text-lg hover:opacity-95 shadow-lg transition-opacity"
                  >
                    Start over
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-10 text-center max-w-2xl mx-auto">
            <p className="text-[var(--ember-text-high)] font-medium m-0 mb-2">
              Catalogue coming soon for {formatBandLabel(selectedBand)}.
            </p>
            <p className="text-sm text-[var(--ember-text-low)] m-0">
              Use the age slider above to switch to another stage — picks may be available there.
            </p>
          </div>
        )}
      </main>

      {startOverVisible ? (
        <div className="fixed bottom-20 lg:bottom-6 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-[90rem] mx-auto px-6 lg:px-12 flex justify-center">
            <button
              type="button"
              onClick={handleDiscoverStartOver}
              className="pointer-events-auto inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm text-[var(--ember-text-high)] rounded-full font-medium text-sm lg:text-base shadow-xl border border-[var(--ember-border-subtle)] hover:border-[var(--ember-accent-base)] transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
