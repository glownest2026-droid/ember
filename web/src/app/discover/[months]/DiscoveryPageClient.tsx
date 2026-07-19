'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useReducedMotion, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { EVENTS } from '@/lib/analytics/eventNames';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { GatewayPick, GatewayWrapperPublic } from '@/lib/pl/public';
import {
  ALL_DOORWAYS,
  SUGGESTED_DOORWAY_KEYS_25_27,
  normaliseSlug,
} from '@/lib/discover/doorways';
import { getEffectiveAgeBandRange } from '@/lib/discover/pilotAgeBandRange';
import { HowWeChooseSheet } from '@/components/discover/HowWeChooseSheet';
import { AffiliateDisclosureNotice } from '@/components/compliance/AffiliateDisclosureNotice';
import { hasOutboundRetailerUrl } from '@/lib/compliance/externalRetailerLink';
import { DiscoverFigmaChildHero } from '@/components/discover/figma/DiscoverFigmaChildHero';
import { DiscoverFigmaNeedCard } from '@/components/discover/figma/DiscoverFigmaNeedCard';
import { DiscoverFigmaScienceSection } from '@/components/discover/figma/DiscoverFigmaScienceSection';
import {
  DiscoverAudienceToggle,
  type DiscoverAudienceMode,
} from '@/components/discover/figma/DiscoverAudienceToggle';
import { DiscoverFigmaPlayCarousel } from '@/components/discover/figma/DiscoverFigmaPlayCarousel';
import type { PlayIdeaItem } from '@/components/discover/figma/DiscoverFigmaPlayCarousel';
import { PipsPicksPersimmonCarousel } from '@/components/discover/figma/PipsPicksPersimmonCarousel';
import { prefetchDiscoverImageUrls } from '@/lib/discover/discoverImageUrl';
import {
  categoryTypesToPlayIdeaItems,
} from '@/lib/discover/playIdeaItems';
import { getWrapperIcon } from './_lib/wrapperIcons';
import {
  personalizationFromChildrenRow,
  personalizeDiscoverCopy,
  type DiscoverChildPersonalization,
} from '@/lib/discover/personalization';
import { EMBER_FIGMA_APP_CONTAINER } from '@/lib/discover/figmaTokens';
import { groupByAudienceLensSection, AUDIENCE_LENS_SECTION_HEADERS } from '@/lib/discover/audienceLens';
import { SaveToListModal, savedToCopy, viewListCtaCopy } from '@/components/ui/SaveToListModal';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';
import {
  requireAuthThen,
  replayPendingAuthAction,
  REPLAY_FAILURE_MESSAGE,
  type PendingAuthAction,
} from '@/lib/auth/requireAuthThen';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { mergeHaveCategoryIds, readHaveCategoryIds, writeHaveCategoryId } from '@/lib/discover/discoverHaveIt';
import { syncAtHomeFromDiscoverHave } from '@/lib/inventory/atHome';
import { saveDiscoverSession } from '@/lib/discover/discoverSession';
import { useDiscoverClientSearchParams } from '@/lib/discover/discoverClientNav';

/** A→B→C journey state: NoFocus | FocusSelected (Layer B visible) | CategorySelected | ShowingExamples (Layer C visible) */
type DiscoverState = 'NoFocusSelected' | 'FocusSelected' | 'CategorySelected' | 'ShowingExamples';

/* Hero: calm gradient + subtle ember glow; no competing effects */

interface AgeBand {
  id: string;
  label?: string | null;
  min_months: number | null;
  max_months: number | null;
}

type Wrapper = Pick<GatewayWrapperPublic, 'ux_wrapper_id' | 'ux_label' | 'ux_slug' | 'ux_description' | 'audience_lens' | 'rank'>;
type PickItem = GatewayPick;

interface DiscoveryPageClientProps {
  ageBands: AgeBand[];
  ageBand: AgeBand | null;
  selectedBandHasPicks: boolean;
  selectedBandHasStage12Data: boolean;
  monthParam: number | null;
  resolutionDebug?: string | null;
  wrappers: Wrapper[];
  exampleProducts: PickItem[];
  /** Preloaded Stage 2 cards for every wrapper (instant client-side wrapper switch). */
  categoriesByWrapper?: Record<string, GatewayCategoryTypePublic[]>;
  /** @deprecated Query params are client-driven; kept for transitional compatibility. */
  selectedWrapperSlug?: string | null;
  showPicks?: boolean;
  picks?: PickItem[];
  categoryTypes?: GatewayCategoryTypePublic[];
  /** Gift-friendly product rows per wrapper slug (for Thea audience filtering). */
  giftFriendlyCountByWrapper?: Record<string, number>;
  bandHasGiftIdeas?: boolean;
  /** Representative category image for the age band (hero fallback when no wrapper selected). */
  bandHeroImageUrl?: string | null;
  showDebug?: boolean;
  initialChildId?: string;
  /** From server (reliable session); fixes hero when client searchParams/user timing is wrong */
  serverPersonalization?: DiscoverChildPersonalization | null;
  v2ImageMappings?: { filename: string; matchedCategoryName: string | null; confidence: string }[];
}

export default function DiscoveryPageClient({
  ageBands,
  ageBand,
  selectedBandHasPicks,
  selectedBandHasStage12Data,
  monthParam,
  resolutionDebug,
  wrappers,
  exampleProducts,
  categoriesByWrapper = {},
  selectedWrapperSlug: _selectedWrapperSlug = null,
  showPicks: _showPicks = false,
  picks: _picks = [],
  categoryTypes: _categoryTypes = [],
  giftFriendlyCountByWrapper = {},
  bandHasGiftIdeas = false,
  bandHeroImageUrl = null,
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
  const [actionToast, setActionToast] = useState<{ productId: string; message: string } | null>(null);
  const [showingExamples, setShowingExamples] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [saveModal, setSaveModal] = useState<{
    open: boolean;
    signedIn: boolean;
    signinUrl: string;
    viewMyListHref?: string;
    savedToLabel?: string;
    viewListCtaLabel?: string;
  }>({ open: false, signedIn: false, signinUrl: '' });
  const [dimmedCategoryIds, setDimmedCategoryIds] = useState<Set<string>>(new Set());
  const saveModalFocusRef = useRef<HTMLButtonElement | null>(null);
  const whyMattersSectionRef = useRef<HTMLElement | null>(null);
  const nextStepsSectionRef = useRef<HTMLElement | null>(null);
  const [pendingScrollToNextSteps, setPendingScrollToNextSteps] = useState(false);
  const [ideasSectionInView, setIdeasSectionInView] = useState(false);
  const [picksSectionInView, setPicksSectionInView] = useState(false);
  const [fetchedPicks, setFetchedPicks] = useState<PickItem[]>([]);
  const [picksLoading, setPicksLoading] = useState(false);
  // Server-resolved membership from /api/discover/picks (auth + RLS), not inferred from data shape.
  const [picksAccess, setPicksAccess] = useState<{ canSeeLocked: boolean } | null>(null);
  const picksFetchKeyRef = useRef<string | null>(null);
  // Default parent view — most users are the parent; gift mode is opt-in only.
  const [audienceMode, setAudienceMode] = useState<DiscoverAudienceMode>('parent');
  const replayAttemptedRef = useRef(false);
  const fallbackHaveChildIdRef = useRef<string | null>(null);
  const basePath = '/discover';
  const { user, loading: subnavLoading, refetch: refetchSubnavStats } = useSubnavStats();
  const viewerAccessKey = user?.email?.toLowerCase() ?? 'signed-out';
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { params: clientParams, replace: replaceClientParams } = useDiscoverClientSearchParams(pathname);
  const [localCategoriesByWrapper, setLocalCategoriesByWrapper] = useState(categoriesByWrapper);
  const categoryFetchKeyRef = useRef<Set<string>>(new Set());
  const selectedChildId = clientParams.get('child') ?? searchParams.get('child') ?? initialChildId ?? undefined;
  const withChildParam = (url: string) =>
    selectedChildId ? `${url}${url.includes('?') ? '&' : '?'}child=${encodeURIComponent(selectedChildId)}` : url;

  const saveModalPersonalization = useMemo(
    () => ({
      savedToLabel: savedToCopy({ name: childProfile.displayLabel, gender: childProfile.gender }),
      viewListCtaLabel: viewListCtaCopy({ name: childProfile.displayLabel }),
    }),
    [childProfile.displayLabel, childProfile.gender]
  );

  const openSavedModal = useCallback(
    (partial: { signedIn: boolean; signinUrl: string; viewMyListHref?: string }) => {
      setSaveModal({
        open: true,
        ...partial,
        ...saveModalPersonalization,
      });
    },
    [saveModalPersonalization]
  );

  const childIdForPersonalization = selectedChildId?.trim() || initialChildId?.trim() || undefined;

  useEffect(() => {
    setLocalCategoriesByWrapper(categoriesByWrapper);
    categoryFetchKeyRef.current = new Set();
  }, [categoriesByWrapper]);

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

  // Persist discover position so /discover can resume this section after leaving the flow.
  useEffect(() => {
    if (!pathname?.startsWith('/discover')) return;
    const query = clientParams.toString();
    saveDiscoverSession(query ? `${pathname}?${query}` : pathname, selectedChildId);
  }, [pathname, clientParams, selectedChildId]);

  const fetchPicksForCategory = useCallback(
    async (categoryId: string) => {
      if (!ageBand?.id) return;
      const key = `${ageBand.id}|${categoryId}|${viewerAccessKey}`;
      if (picksFetchKeyRef.current === key) return;
      picksFetchKeyRef.current = key;
      setPicksLoading(true);
      try {
        const res = await fetch(
          `/api/discover/picks?ageBandId=${encodeURIComponent(ageBand.id)}&categoryTypeId=${encodeURIComponent(categoryId)}`
        );
        const payload = (await res.json()) as {
          picks?: PickItem[];
          access?: { canSeeLocked?: boolean };
        };
        setFetchedPicks(payload.picks ?? []);
        setPicksAccess(payload.access ? { canSeeLocked: Boolean(payload.access.canSeeLocked) } : null);
      } catch {
        setFetchedPicks([]);
        setPicksAccess(null);
      } finally {
        setPicksLoading(false);
      }
    },
    [ageBand?.id, viewerAccessKey]
  );

  // Pre-dim Stage 2 cards the user has already marked as "have".
  useEffect(() => {
    if (subnavLoading) return;
    if (!user) {
      setDimmedCategoryIds(new Set());
      return;
    }
    setDimmedCategoryIds((prev) => mergeHaveCategoryIds(user.id, selectedChildId, [], prev));
    let cancelled = false;
    const supabase = createClient();
    void (async () => {
      let query = supabase
        .from('user_list_items')
        .select('category_type_id')
        .eq('kind', 'category')
        .eq('have', true);
      if (selectedChildId) query = query.eq('child_id', selectedChildId);
      const { data, error } = await query;
      if (cancelled || error) return;
      const ids = (data ?? [])
        .map((row) => (row as { category_type_id?: string | null }).category_type_id)
        .filter((id): id is string => typeof id === 'string' && id.length > 0);
      setDimmedCategoryIds((prev) => mergeHaveCategoryIds(user.id, selectedChildId, ids, prev));
    })();
    return () => {
      cancelled = true;
    };
  }, [user, selectedChildId, subnavLoading]);

  const resolveHaveChildId = useCallback(async (): Promise<string | undefined> => {
    if (selectedChildId) return selectedChildId;
    if (fallbackHaveChildIdRef.current) return fallbackHaveChildIdRef.current;
    const supabase = createClient();
    const { data } = await supabase
      .from('children')
      .select('id')
      .or('is_suppressed.is.null,is_suppressed.eq.false')
      .order('created_at', { ascending: true })
      .limit(1);
    const id = (data?.[0] as { id?: string } | undefined)?.id;
    if (typeof id === 'string' && id.length > 0) {
      fallbackHaveChildIdRef.current = id;
      return id;
    }
    return undefined;
  }, [selectedChildId]);

  const personalizeCopy = useCallback(
    (text: string) =>
      personalizeDiscoverCopy(text, {
        displayLabel: childProfile.displayLabel,
        gender: childProfile.gender,
      }),
    [childProfile.displayLabel, childProfile.gender]
  );

  const scrollToSection = useCallback(
    (id: string, behaviorOverride?: ScrollBehavior) => {
      const el = document.getElementById(id);
      if (!el) return;
      const headerVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
      const headerOffset = (headerVar ? parseInt(headerVar, 10) : 88) + 12;
      const rect = el.getBoundingClientRect();
      const targetTop = Math.max(0, rect.top + window.scrollY - headerOffset);
      const behavior = behaviorOverride ?? (shouldReduceMotion ? 'auto' : 'smooth');
      window.scrollTo({ top: targetTop, behavior });
    },
    [shouldReduceMotion]
  );

  const scrollToStage3Picks = useCallback(
    (behaviorOverride?: ScrollBehavior) => {
      const section = document.getElementById('discover-figma-products');
      if (!section) return;
      const headerVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
      // Anchor rule (founder): the "Pip's Picks" heading is the first thing under
      // the sticky header. The carousel below is viewport-sized, so heading +
      // card + Start over FAB share one screen without measuring the card.
      const headerOffset = (headerVar ? parseInt(headerVar, 10) : 88) + 4;
      const behavior = behaviorOverride ?? (shouldReduceMotion ? 'auto' : 'smooth');
      const sectionRect = section.getBoundingClientRect();
      window.scrollTo({ top: Math.max(0, sectionRect.top + window.scrollY - headerOffset), behavior });
    },
    [shouldReduceMotion]
  );

  const scrollToWhyMatters = useCallback(() => {
    const headerOffset = 72;
    const run = () => {
      const el = whyMattersSectionRef.current ?? nextStepsSectionRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const targetTop = Math.max(0, rect.top + window.scrollY - headerOffset);
      if (window.scrollY < targetTop - 20 || window.scrollY > targetTop + 20) {
        window.scrollTo({ top: targetTop, behavior: 'auto' });
      }
      return true;
    };
    requestAnimationFrame(() => {
      if (!run()) requestAnimationFrame(run);
    });
  }, []);

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

  const getBandRange = (band: AgeBand | null) => getEffectiveAgeBandRange(band);

  // Snag: the newborn band (0–0 months) represents an unborn baby — show "Expecting".
  const isExpectingRange = (range: { min: number; max: number } | null): boolean =>
    !!range && range.min === 0 && range.max === 0;

  const formatBandLabel = (band: AgeBand | null): string => {
    if (!band) return 'Age range';
    const range = getBandRange(band);
    if (!range) return band.label || band.id;
    if (isExpectingRange(range)) return 'Expecting';
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
  const wrapperFromUrl = clientParams.get('wrapper');
  const [selectedWrapper, setSelectedWrapper] = useState<string | null>(wrapperFromUrl);

  useEffect(() => {
    setSelectedBandIndex(propBandIndex);
  }, [propBandIndex]);

  useEffect(() => {
    setSelectedWrapper(wrapperFromUrl);
  }, [wrapperFromUrl]);

  const categoryFromUrl = clientParams.get('category');
  const showFromUrl = clientParams.get('show') === '1';

  useEffect(() => {
    if (!selectedWrapper || !ageBand?.id) return;
    if ((localCategoriesByWrapper[selectedWrapper] ?? []).length > 0) return;
    const key = `${ageBand.id}|${selectedWrapper}`;
    if (categoryFetchKeyRef.current.has(key)) return;
    categoryFetchKeyRef.current.add(key);

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/discover/category-types?ageBandId=${encodeURIComponent(ageBand.id)}&wrapperSlug=${encodeURIComponent(selectedWrapper)}`,
          { cache: 'no-store' }
        );
        const payload = (await res.json()) as { categories?: GatewayCategoryTypePublic[] };
        if (cancelled) return;
        setLocalCategoriesByWrapper((prev) => ({
          ...prev,
          [selectedWrapper]: payload.categories ?? [],
        }));
      } catch {
        if (cancelled) return;
        setLocalCategoriesByWrapper((prev) => ({
          ...prev,
          [selectedWrapper]: prev[selectedWrapper] ?? [],
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ageBand?.id, selectedWrapper, localCategoriesByWrapper]);

  useEffect(() => {
    if (!showFromUrl || !categoryFromUrl || !wrapperFromUrl) return;
    const types = localCategoriesByWrapper[wrapperFromUrl] ?? [];
    if (!types.some((c) => c.id === categoryFromUrl)) return;
    setSelectedCategoryId(categoryFromUrl);
    setShowingExamples(true);
    void fetchPicksForCategory(categoryFromUrl);
  }, [showFromUrl, categoryFromUrl, wrapperFromUrl, localCategoriesByWrapper, fetchPicksForCategory]);

  useEffect(() => {
    if (!showFromUrl) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToStage3Picks('auto'));
    });
  }, [showFromUrl, scrollToStage3Picks]);

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
    const all = [...fetchedPicks, ...exampleProducts];
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

  useEffect(() => {
    if (!selectedWrapper || !pendingScrollToNextSteps) return;
    scrollToWhyMatters();
    setPendingScrollToNextSteps(false);
  }, [selectedWrapper, pendingScrollToNextSteps, scrollToWhyMatters]);

  // Snag #6: only surface the floating "Start over" while the "Ideas for…" section
  // is within the viewport. Scrolling back up (out of the ideas section) hides it.
  useEffect(() => {
    const el = nextStepsSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIdeasSectionInView(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIdeasSectionInView(entry?.isIntersecting ?? false),
      { rootMargin: '-72px 0px -10% 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [selectedWrapper]);

  // Bug bash item 6: keep "Start over" available while the Stage 3 picks section
  // is in view too (it previously vanished once ideas scrolled out of view).
  useEffect(() => {
    if (discoverState !== 'ShowingExamples' || typeof IntersectionObserver === 'undefined') {
      setPicksSectionInView(false);
      return;
    }
    const el = document.getElementById('discover-figma-products');
    if (!el) {
      setPicksSectionInView(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setPicksSectionInView(entry?.isIntersecting ?? false),
      { rootMargin: '-72px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [discoverState, selectedWrapper, selectedCategoryId]);

  const handleWrapperSelect = (wrapperSlug: string) => {
    if (selectedWrapper === wrapperSlug) {
      setPendingScrollToNextSteps(true);
      return;
    }
    setSelectedWrapper(wrapperSlug);
    setSelectedCategoryId(null);
    setShowingExamples(false);
    setFetchedPicks([]);
    picksFetchKeyRef.current = null;
    setPendingScrollToNextSteps(true);
    const types = localCategoriesByWrapper[wrapperSlug] ?? [];
    if (types.length > 0) {
      const items = categoryTypesToPlayIdeaItems(types, formatBandLabel(selectedBand));
      prefetchDiscoverImageUrls(items.map((item) => item.imageUrl), 'card');
    }
    replaceClientParams((p) => {
      p.set('wrapper', wrapperSlug);
      p.delete('show');
      p.delete('category');
      p.delete('review');
    });
  };

  const prefetchWrapper = useCallback(
    (wrapperSlug: string) => {
      const types = localCategoriesByWrapper[wrapperSlug] ?? [];
      if (types.length > 0) {
        const items = categoryTypesToPlayIdeaItems(types, formatBandLabel(selectedBand));
        prefetchDiscoverImageUrls(items.map((item) => item.imageUrl), 'card');
      }
    },
    [localCategoriesByWrapper, selectedBand]
  );

  const handleDiscoverStartOver = useCallback(() => {
    setSelectedWrapper(null);
    setSelectedCategoryId(null);
    setShowingExamples(false);
    setFetchedPicks([]);
    picksFetchKeyRef.current = null;
    replaceClientParams((p) => {
      p.delete('wrapper');
      p.delete('show');
      p.delete('category');
      p.delete('review');
      p.delete('focus');
    });
    const top = document.getElementById('discover-figma-stage1');
    top?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, [replaceClientParams, shouldReduceMotion]);

  const handleShowExamples = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setShowingExamples(true);
    replaceClientParams((p) => {
      if (selectedWrapper) p.set('wrapper', selectedWrapper);
      p.set('show', '1');
      p.set('category', categoryId);
    });
    void fetchPicksForCategory(categoryId);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToStage3Picks('auto'));
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
            ...saveModalPersonalization,
          });
          break;
        }
        case 'save_stage3_pick': {
          const stage3PickId = action.payload.stage3PickId as string | undefined;
          const childId = action.payload.childId as string | undefined;
          if (!stage3PickId) return;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'stage3_pick',
            p_stage3_pick_id: stage3PickId,
            p_want: true,
            p_have: false,
            p_gift: false,
            ...(childId ? { p_child_id: childId } : {}),
          });
          if (!error) await refetchSubnavStats(selectedChildId);
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrl(),
            viewMyListHref: withChildParam('/my-ideas?tab=products'),
            ...saveModalPersonalization,
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
            ...saveModalPersonalization,
          });
          break;
        }
        case 'have_category': {
          const categoryId = (action.payload.categoryId as string) || 'category';
          const childId = (action.payload.childId as string | undefined) ?? (await resolveHaveChildId());
          const have = action.payload.have !== false;
          if (!childId) break;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: have,
            p_gift: false,
            p_child_id: childId,
          });
          if (!error) {
            await syncAtHomeFromDiscoverHave({
              categoryTypeId: categoryId,
              childId,
              have,
            });
            await refetchSubnavStats(selectedChildId ?? childId);
            writeHaveCategoryId(user.id, selectedChildId, categoryId, have);
            setDimmedCategoryIds((prev) => {
              const next = new Set(prev);
              if (have) next.add(categoryId);
              else next.delete(categoryId);
              return next;
            });
          }
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
    [selectedBand?.id, selectedWrapper, currentMonth, basePath, refetchSubnavStats, selectedChildId, saveModalPersonalization, resolveHaveChildId]
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
    const wasDimmed = dimmedCategoryIds.has(categoryId);
    const nextHave = !wasDimmed;

    setDimmedCategoryIds((prev) => {
      const next = new Set(prev);
      if (nextHave) next.add(categoryId);
      else next.delete(categoryId);
      return next;
    });

    if (user) {
      writeHaveCategoryId(user.id, selectedChildId, categoryId, nextHave);
    }

    void requireAuthThen({
      actionId: 'have_category',
      payload: { categoryId, childId: selectedChildId, have: nextHave },
      run: async () => {
        const childId = await resolveHaveChildId();
        if (!childId) {
          setActionToast({
            productId: categoryId,
            message: 'Select a child in the header to track what you have.',
          });
          return;
        }
        try {
          const supabase = createClient();
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'category',
            p_category_type_id: categoryId,
            p_want: true,
            p_have: nextHave,
            p_gift: false,
            p_child_id: childId,
          });
          if (error) throw error;
          await syncAtHomeFromDiscoverHave({
            categoryTypeId: categoryId,
            childId,
            have: nextHave,
          });
          const authedUser = user ?? (await supabase.auth.getUser()).data.user;
          if (authedUser) writeHaveCategoryId(authedUser.id, selectedChildId, categoryId, nextHave);
          await refetchSubnavStats(selectedChildId ?? childId);
        } catch {
          if (user) writeHaveCategoryId(user.id, selectedChildId, categoryId, wasDimmed);
          setDimmedCategoryIds((prev) => {
            const next = new Set(prev);
            if (wasDimmed) next.add(categoryId);
            else next.delete(categoryId);
            return next;
          });
          setActionToast({ productId: categoryId, message: "Couldn't update. Please try again." });
        }
      },
      openAuthModal: ({ signinUrl }) => {
        if (user) writeHaveCategoryId(user.id, selectedChildId, categoryId, wasDimmed);
        setDimmedCategoryIds((prev) => {
          const next = new Set(prev);
          if (wasDimmed) next.add(categoryId);
          else next.delete(categoryId);
          return next;
        });
        saveModalFocusRef.current = null;
        openSavedModal({ signedIn: false, signinUrl });
        setActionToast({ productId: categoryId, message: 'Sign in to record what you have.' });
      },
      isAuthenticated: async () => {
        if (user) return true;
        const {
          data: { user: authedUser },
        } = await createClient().auth.getUser();
        return !!authedUser;
      },
      getReturnUrl: () =>
        withChildParam(
          selectedWrapper
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1&category=${encodeURIComponent(categoryId)}`
            : `${basePath}/${currentMonth}`,
        ),
    });
  };

  const doorwayMetaBySlug = useMemo(() => {
    const map = new Map<string, { key: string; helper: string; icon: (typeof ALL_DOORWAYS)[number]['icon'] }>();
    for (const doorway of ALL_DOORWAYS) {
      const candidates = [doorway.wrapperSlug, ...(doorway.alternateSlugs ?? [])];
      for (const slug of candidates) {
        map.set(normaliseSlug(slug), { key: doorway.key, helper: doorway.helper, icon: doorway.icon });
      }
    }
    return map;
  }, []);

  const suggestedDoorwaySlugSet = useMemo(() => {
    const set = new Set<string>();
    for (const doorway of ALL_DOORWAYS) {
      if (!SUGGESTED_DOORWAY_KEYS_25_27.includes(doorway.key)) continue;
      const candidates = [doorway.wrapperSlug, ...(doorway.alternateSlugs ?? [])];
      for (const slug of candidates) {
        set.add(normaliseSlug(slug));
      }
    }
    return set;
  }, []);

  const allTiles = useMemo(
    () =>
      wrappers.map((wrapper) => {
        const slugNorm = normaliseSlug(wrapper.ux_slug);
        const meta = doorwayMetaBySlug.get(slugNorm);
        const label = wrapper.ux_label?.trim() || wrapper.ux_slug;
        return {
          key: wrapper.ux_slug,
          slug: wrapper.ux_slug,
          label,
          helper: '',
          audienceLens: wrapper.audience_lens,
          icon: meta?.icon ?? getWrapperIcon(wrapper.ux_slug, label),
          showSuggested: is25to27 && suggestedDoorwaySlugSet.has(slugNorm),
          giftFriendlyCount: giftFriendlyCountByWrapper[wrapper.ux_slug] ?? 0,
        };
      }),
    [wrappers, doorwayMetaBySlug, is25to27, suggestedDoorwaySlugSet, giftFriendlyCountByWrapper]
  );

  const visibleTiles = useMemo(() => {
    if (audienceMode !== 'gift') return allTiles;
    return allTiles.filter((tile) => tile.giftFriendlyCount > 0);
  }, [allTiles, audienceMode]);

  const tileSections = useMemo(() => {
    const sections = groupByAudienceLensSection(visibleTiles);
    return sections.filter((section) => section.items.length > 0);
  }, [visibleTiles]);
  const showLensSections = tileSections.length > 1 || tileSections.some((s) => s.title !== 'More to explore');

  const handleAudienceModeChange = useCallback(
    (mode: DiscoverAudienceMode) => {
      if (mode === audienceMode) return;
      setAudienceMode(mode);
      if (mode === 'gift' && selectedWrapper) {
        const count = giftFriendlyCountByWrapper[selectedWrapper] ?? 0;
        if (count === 0) {
          setSelectedWrapper(null);
          setSelectedCategoryId(null);
          setShowingExamples(false);
          setFetchedPicks([]);
          picksFetchKeyRef.current = null;
          replaceClientParams((p) => {
            p.delete('wrapper');
            p.delete('show');
            p.delete('category');
          });
        }
      }
    },
    [audienceMode, selectedWrapper, giftFriendlyCountByWrapper, replaceClientParams]
  );

  const selectedWrapperLabel =
    wrappers.find((w) => w.ux_slug === selectedWrapper)?.ux_label ??
    allTiles.find((tile) => tile.slug === selectedWrapper)?.label ??
    selectedWrapper ??
    '';

  const debugText =
    showDebug && monthParam !== null && ageBand !== null
      ? `path → band: ${ageBand.id}${resolutionDebug ? ` | ${resolutionDebug}` : ''}`
      : null;

  const sliderProgress = ageBands.length > 0 ? (selectedBandIndex / Math.max(1, ageBands.length - 1)) * 100 : 0;

  const displayIdeas =
    showingExamples && fetchedPicks.length > 0 ? fetchedPicks : exampleProducts;
  const displayHasPipsPicks = displayIdeas.some((p) => p.product.is_stage3_pick);
  const isEmberPlusMember = picksAccess?.canSeeLocked ?? false;

  const shortlistTrackKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (discoverState !== 'ShowingExamples') return;
    if (displayIdeas.length <= 0) return;
    const key = `${ageBand?.id ?? 'none'}|${selectedWrapper ?? 'none'}|${selectedCategoryId ?? 'none'}|${selectedChildId ?? 'none'}`;
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
  }, [discoverState, displayIdeas.length, ageBand?.id, selectedWrapper, selectedCategoryId, selectedChildId, user?.id, pathname]);

  const stage3MobileAnchorKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (discoverState !== 'ShowingExamples' || picksLoading || displayIdeas.length <= 0) return;
    if (typeof window === 'undefined') return;
    const key = `${ageBand?.id ?? 'none'}|${selectedWrapper ?? 'none'}|${selectedCategoryId ?? 'none'}|${displayIdeas.length}`;
    if (stage3MobileAnchorKeyRef.current === key) return;
    stage3MobileAnchorKeyRef.current = key;
    requestAnimationFrame(() => scrollToStage3Picks('smooth'));
  }, [discoverState, picksLoading, displayIdeas.length, ageBand?.id, selectedWrapper, selectedCategoryId, scrollToStage3Picks]);

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
            ...saveModalPersonalization,
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

  /**
   * Save a Stage 3 pick itself (not its Stage 2 category) — lands in the
   * Products tab of /my-ideas, mirroring the Stage 2 save flow (founder
   * bug bash follow-up, item 1).
   */
  const handleSaveStage3Pick = (stage3PickId: string, triggerEl: HTMLButtonElement | null) => {
    saveModalFocusRef.current = triggerEl;
    requireAuthThen({
      actionId: 'save_stage3_pick',
      payload: { stage3PickId, childId: selectedChildId },
      run: async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { error } = await supabase.rpc('upsert_user_list_item', {
            p_kind: 'stage3_pick',
            p_stage3_pick_id: stage3PickId,
            p_want: true,
            p_have: false,
            p_gift: false,
            ...(selectedChildId ? { p_child_id: selectedChildId } : {}),
          });
          if (error) {
            setActionToast({ productId: stage3PickId, message: 'Could not save. Please try again.' });
            return;
          }
          await refetchSubnavStats(selectedChildId);
          setActionToast({ productId: stage3PickId, message: 'Saved.' });
          setSaveModal({
            open: true,
            signedIn: true,
            signinUrl: getSigninUrl(),
            viewMyListHref: withChildParam('/my-ideas?tab=products'),
            ...saveModalPersonalization,
          });
        } catch {
          setActionToast({ productId: stage3PickId, message: 'Could not save. Please try again.' });
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
            ? `${basePath}/${currentMonth}?wrapper=${encodeURIComponent(selectedWrapper)}&show=1${selectedCategoryId ? `&category=${encodeURIComponent(selectedCategoryId)}` : ''}`
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
  const scienceBody = personalizeCopy((selectedWrapperRecord?.ux_description || '').trim());
  const bandLabelForIdeas = formatBandLabel(selectedBand);

  const playIdeaItems = useMemo(() => {
    if (!selectedWrapper) return [];
    const types = localCategoriesByWrapper[selectedWrapper] ?? [];
    return categoryTypesToPlayIdeaItems(types, bandLabelForIdeas).map((item) => ({
      ...item,
      description: personalizeCopy(item.description),
      ownershipNote: item.ownershipNote ? personalizeCopy(item.ownershipNote) : item.ownershipNote,
      giftNote: item.giftNote ? personalizeCopy(item.giftNote) : item.giftNote,
    }));
  }, [selectedWrapper, localCategoriesByWrapper, bandLabelForIdeas, personalizeCopy]);

  const laneForItem = useCallback((item: PlayIdeaItem): 'useful_ideas' | 'quick_checks' | 'things_that_can_help' => {
    if (item.uiLane === 'useful_ideas' || item.uiLane === 'quick_checks' || item.uiLane === 'things_that_can_help') {
      return item.uiLane;
    }
    const isProduct = item.contentType === 'product_category';
    return isProduct ? 'things_that_can_help' : 'useful_ideas';
  }, []);

  const sortedPlayIdeas = useMemo(
    () =>
      [...playIdeaItems].sort((a, b) => {
        // Cards with Ember Picks lead their lane (founder rule, bug bash 2026-07-19).
        const picksA = a.showEmberPicks === true ? 0 : 1;
        const picksB = b.showEmberPicks === true ? 0 : 1;
        if (picksA !== picksB) return picksA - picksB;
        const laneA = a.laneRank ?? a.categoryRank ?? Number.MAX_SAFE_INTEGER;
        const laneB = b.laneRank ?? b.categoryRank ?? Number.MAX_SAFE_INTEGER;
        if (laneA !== laneB) return laneA - laneB;
        return (a.categoryRank ?? Number.MAX_SAFE_INTEGER) - (b.categoryRank ?? Number.MAX_SAFE_INTEGER);
      }),
    [playIdeaItems]
  );

  const usefulIdeas = useMemo(
    () => sortedPlayIdeas.filter((item) => laneForItem(item) === 'useful_ideas'),
    [sortedPlayIdeas, laneForItem]
  );
  const quickChecks = useMemo(
    () => sortedPlayIdeas.filter((item) => laneForItem(item) === 'quick_checks'),
    [sortedPlayIdeas, laneForItem]
  );
  const thingsThatCanHelp = useMemo(
    () => sortedPlayIdeas.filter((item) => laneForItem(item) === 'things_that_can_help'),
    [sortedPlayIdeas, laneForItem]
  );
  const giftIdeas = useMemo(
    () =>
      thingsThatCanHelp.filter(
        (item) => item.contentType === 'product_category' && item.giftFriendly === true
      ),
    [thingsThatCanHelp]
  );

  const ideasSectionLoading =
    selectedWrapper
      ? localCategoriesByWrapper[selectedWrapper]?.length === undefined && playIdeaItems.length === 0
      : false;
  const scienceTitle = 'Why this matters now';
  const ideasDevelopmentName = (() => {
    const lower = selectedWrapperLabel.trim().toLowerCase();
    return lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : lower;
  })();
  const ideasSectionTitle =
    audienceMode === 'gift'
      ? selectedWrapperLabel
        ? `Gift ideas for “${ideasDevelopmentName}”`
        : `Gift ideas for ${bandLabelForIdeas}`
      : selectedWrapperLabel
        ? `Ideas for “${ideasDevelopmentName}”`
        : 'Ideas to try';
  // Show the Start over control only while ideas are available to reset.
  const startOverVisible = Boolean(selectedWrapper || (showingExamples && displayIdeas.length > 0));
  // Snag #6 + bug bash item 6: the floating FAB stays while either the "Ideas for…"
  // section or the Stage 3 picks section is in view.
  const showStartOverFab = startOverVisible && (ideasSectionInView || picksSectionInView);
  const possessiveChild = childProfile.displayLabel ? `${childProfile.displayLabel}'s` : "your child's";
  const bandLabel = formatBandLabel(selectedBand);
  const bandRange = getBandRange(selectedBand);
  const isExpecting = isExpectingRange(bandRange);
  const examplesHaveRetailerLinks = useMemo(
    () => displayIdeas.some((p) => hasOutboundRetailerUrl(p.product)),
    [displayIdeas]
  );
  return (
    <div
      className="min-h-screen w-full bg-[#FBFAF7]"
      data-discover-version="figma-may-2026"
    >
      {actionToast && (
        <div className={`${EMBER_FIGMA_APP_CONTAINER} pt-4`}>
          <div className="rounded-lg border border-[#E7E2DC] bg-white py-2 px-3 text-sm text-[#253044]">
            {actionToast.message}
          </div>
        </div>
      )}
      <SaveToListModal
        open={saveModal.open}
        onClose={() => setSaveModal((s) => ({ ...s, open: false }))}
        signedIn={saveModal.signedIn}
        signinUrl={saveModal.signinUrl}
        savedToLabel={saveModal.savedToLabel}
        viewListCtaLabel={saveModal.viewListCtaLabel}
        viewMyListHref={saveModal.viewMyListHref}
        onCloseFocusRef={saveModalFocusRef}
        onAuthSuccess={handleAuthSuccess}
        appearance="discover"
      />
      <HowWeChooseSheet open={howWeChooseOpen} onClose={() => setHowWeChooseOpen(false)} />

      <main
        className={`${EMBER_FIGMA_APP_CONTAINER} py-6 lg:py-8 pb-28 md:pb-10 flex flex-col ${
          selectedWrapper ? 'gap-5 md:gap-6' : 'gap-10 md:gap-14'
        }`}
      >
        <section id="discover-figma-stage1" className="scroll-mt-6"><DiscoverFigmaChildHero
          childDisplayLabel={childProfile.displayLabel}
          childGender={childProfile.gender}
          monthAge={
            childIdForPersonalization && childProfile.monthsOld != null
              ? childProfile.monthsOld
              : (monthParam ?? 26)
          }
          bandLabel={bandLabel}
          bandRange={bandRange}
          isExpecting={isExpecting}
          heroImageUrl={
            (selectedWrapper ? localCategoriesByWrapper[selectedWrapper]?.[0]?.image_url : null) ??
            bandHeroImageUrl ??
            exampleProducts[0]?.product?.image_url ??
            null
          }
          selectedBandIndex={selectedBandIndex}
          bandCount={ageBands.length}
          sliderProgress={sliderProgress}
          onBandIndexChange={setSelectedBandIndex}
          audienceToggle={
            selectedBandHasStage12Data && bandHasGiftIdeas ? (
              <DiscoverAudienceToggle
                variant="inline"
                mode={audienceMode}
                onChange={handleAudienceModeChange}
                bandLabel={bandLabel}
              />
            ) : undefined
          }
          audienceToggleMobile={
            selectedBandHasStage12Data && bandHasGiftIdeas ? (
              <DiscoverAudienceToggle
                variant="card"
                mode={audienceMode}
                onChange={handleAudienceModeChange}
                bandLabel={bandLabel}
              />
            ) : undefined
          }
        />
        </section>

        {debugText ? (
          <p className="text-[11px] px-2 py-1 rounded bg-amber-50 text-[#66717D]">{debugText}</p>
        ) : null}

        {selectedBandHasStage12Data ? (
          <>
            <section id="discover-audience-developments" className="flex flex-col gap-5 scroll-mt-[calc(var(--header-height,88px)+12px)]">
              <div>
                <h2 className="text-[24px] md:text-[32px] font-bold text-[#253044] m-0">
                  {audienceMode === 'gift' ? 'Pick an area to shop for' : 'Choose a development'}
                </h2>
                {audienceMode === 'gift' ? (
                  <p className="text-sm text-[#66717D] mt-2">
                    Only areas with tangible gift ideas for this age — parent routines and safety checks are hidden.
                  </p>
                ) : !user ? (
                  <p className="text-sm text-[#66717D] mt-2">Pick a focus for this age. Sign in to personalize with your child.</p>
                ) : null}
              </div>
              {showLensSections ? (
                <div className="flex flex-col gap-6 md:gap-7">
                  {tileSections.map((section) => {
                    const sectionAccent =
                      AUDIENCE_LENS_SECTION_HEADERS[section.title] ?? 'text-[#66717D]';
                    return (
                      <div key={section.title} className="flex flex-col gap-3 md:gap-4">
                        <p className={`text-[13px] font-bold uppercase tracking-wide m-0 ${sectionAccent}`}>
                          {section.title}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                          {section.items.map((tile) => {
                            const isSelected = selectedWrapper === tile.slug;
                            return (
                              <DiscoverFigmaNeedCard
                                key={tile.slug}
                                icon={tile.icon}
                                title={tile.label}
                                description={tile.helper}
                                audienceLens={tile.audienceLens}
                                isSelected={isSelected}
                                showSuggested={tile.showSuggested}
                                onClick={() => handleWrapperSelect(tile.slug)}
                                onPrefetch={() => prefetchWrapper(tile.slug)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
                  {visibleTiles.map((tile) => {
                    const isSelected = selectedWrapper === tile.slug;
                    return (
                      <DiscoverFigmaNeedCard
                        key={tile.slug}
                        icon={tile.icon}
                        title={tile.label}
                        description={tile.helper}
                        audienceLens={tile.audienceLens}
                        isSelected={isSelected}
                        showSuggested={tile.showSuggested}
                        onClick={() => handleWrapperSelect(tile.slug)}
                        onPrefetch={() => prefetchWrapper(tile.slug)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {selectedWrapper ? (
              <section ref={whyMattersSectionRef} className="scroll-mt-16 md:scroll-mt-12">
                {scienceBody ? (
                  <DiscoverFigmaScienceSection
                    title={scienceTitle}
                    description={scienceBody}
                    onExplain={() => setHowWeChooseOpen(true)}
                  />
                ) : (
                  <p className="text-[var(--ember-text-low)] text-sm mb-4">
                    We&apos;re adding more detail for this focus soon.
                  </p>
                )}
                {(audienceMode === 'gift'
                  ? giftIdeas.length > 0
                  : usefulIdeas.length > 0 || thingsThatCanHelp.length > 0 || quickChecks.length > 0) ? (
                  <div className="flex justify-center mt-2 md:mt-3">
                    <motion.button
                      type="button"
                      onClick={() => scrollToSection('discover-figma-ideas')}
                      aria-label="Scroll down to the ideas"
                      className="flex flex-col items-center gap-1 text-[#66717D] hover:text-[#FF5C34] transition-colors"
                      animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      <span className="text-[13px] font-medium">
                        {audienceMode === 'gift' ? 'See gift ideas' : 'See the ideas'}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E2DC] bg-white shadow-sm">
                        <ChevronDown size={20} strokeWidth={2.5} aria-hidden />
                      </span>
                    </motion.button>
                  </div>
                ) : null}
              </section>
            ) : null}

            {selectedWrapper ? (
              <section
                ref={nextStepsSectionRef}
                id="discover-figma-ideas"
                className="scroll-mt-[calc(var(--header-height,88px)+12px)] mt-4 md:mt-0 md:scroll-mt-2 md:-mt-1"
              >
                {(audienceMode === 'gift' ? giftIdeas.length > 0 : usefulIdeas.length > 0 || thingsThatCanHelp.length > 0 || quickChecks.length > 0) ? (
                  <div className="flex flex-col gap-6">
                    <h2 className="text-[24px] md:text-[32px] font-bold text-[#253044] m-0">{ideasSectionTitle}</h2>
                    {audienceMode === 'gift' ? (
                      <DiscoverFigmaPlayCarousel
                        items={giftIdeas}
                        sectionTitle="Things that can help"
                        selectedId={selectedCategoryId}
                        onSelect={setSelectedCategoryId}
                        onSeeExamples={handleShowExamples}
                        onSaveIdea={(categoryId, el) => handleSaveCategory(categoryId, el)}
                        onGiftAction={(categoryId, el) => handleSaveCategory(categoryId, el)}
                        onHaveThem={handleHaveThemCategory}
                        showHaveAction={false}
                        showEmberPicks
                        showSaveAction={false}
                        showGiftAction
                        noteMode="gift"
                        dimmedCategoryIds={dimmedCategoryIds}
                      />
                    ) : (
                      <>
                        {/* Founder rule (bug bash follow-up, item 4): "Things that can
                            help" leads — the lane carrying Ember Picks comes first. */}
                        {thingsThatCanHelp.length > 0 ? (
                          <DiscoverFigmaPlayCarousel
                            items={thingsThatCanHelp}
                            sectionTitle="Things that can help"
                            selectedId={selectedCategoryId}
                            onSelect={setSelectedCategoryId}
                            onSeeExamples={handleShowExamples}
                            onSaveIdea={(categoryId, el) => handleSaveCategory(categoryId, el)}
                            onGiftAction={(categoryId, el) => handleSaveCategory(categoryId, el)}
                            onHaveThem={handleHaveThemCategory}
                            showHaveAction
                            showEmberPicks
                            showSaveAction
                            showGiftAction
                            noteMode="parent"
                            dimmedCategoryIds={dimmedCategoryIds}
                          />
                        ) : null}
                        {usefulIdeas.length > 0 ? (
                          <DiscoverFigmaPlayCarousel
                            items={usefulIdeas}
                            sectionTitle="Useful ideas"
                            selectedId={selectedCategoryId}
                            onSelect={setSelectedCategoryId}
                            onSeeExamples={handleShowExamples}
                            onSaveIdea={(categoryId, el) => handleSaveCategory(categoryId, el)}
                            onHaveThem={handleHaveThemCategory}
                            showHaveAction={false}
                            showEmberPicks={false}
                            showSaveAction
                            showGiftAction={false}
                            noteMode="parent"
                            dimmedCategoryIds={dimmedCategoryIds}
                          />
                        ) : null}
                        {quickChecks.length > 0 ? (
                          <section className="rounded-3xl border border-[#E7E2DC] bg-white p-5 md:p-6">
                            <h3 className="text-[20px] md:text-[24px] font-bold text-[#253044] m-0 mb-4">Quick checks</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {quickChecks.map((item) => (
                                <article key={item.id} className="rounded-2xl border border-[#E7E2DC] bg-[#FBFAF7] p-4">
                                  <h4 className="text-[16px] font-semibold text-[#253044] m-0">{item.title}</h4>
                                  {item.description ? (
                                    <p className="text-[14px] text-[#66717D] mt-2 mb-0">{item.description}</p>
                                  ) : null}
                                </article>
                              ))}
                            </div>
                          </section>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-8 text-center text-[var(--ember-text-low)] text-sm">
                    We&apos;re adding more ideas here.
                  </div>
                )}
              </section>
            ) : null}

            {selectedWrapper ? (
              <div className="flex flex-col items-center gap-6 mt-6 mb-10 px-4">
                <button
                  type="button"
                  onClick={() => setHowWeChooseOpen(true)}
                  className="flex items-center gap-2 text-[#66717D] hover:text-[#253044] transition-colors text-[15px] font-medium bg-[#FBFAF7] px-4 py-2 rounded-full border border-[#E7E2DC]"
                >
                  <span className="font-bold text-[#FF5C34]">?</span> Why these ideas?
                </button>
              </div>
            ) : null}

            {discoverState === 'ShowingExamples' ? (
              <section id="discover-figma-products" className="scroll-mt-[calc(var(--header-height,88px)+4px)] md:scroll-mt-6">
                <div id="examplesProgressBar" className="h-1" aria-hidden />
                {picksLoading ? (
                  <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-8 text-center text-sm text-[var(--ember-text-low)]" aria-busy="true">
                    Loading examples…
                  </div>
                ) : displayIdeas.length === 0 ? (
                  <div className="rounded-3xl border border-[var(--ember-border-subtle)] bg-white p-8 text-center text-sm text-[var(--ember-text-low)]">
                    Examples coming soon
                  </div>
                ) : (
                  <>
                    <PipsPicksPersimmonCarousel
                      key={`${selectedWrapper}-${categoryFromUrl ?? ''}-${displayIdeas.length}-${viewerAccessKey}`}
                      picks={displayIdeas.slice(0, displayHasPipsPicks ? 10 : 12)}
                      childDisplayLabel={childProfile.displayLabel}
                      isEmberPlusMember={isEmberPlusMember}
                      onSavePick={(pick, el) => handleSaveStage3Pick(pick.product.id, el)}
                      bottomNavVisible={!!user}
                    />
                    <AffiliateDisclosureNotice
                      hasRetailerLinks={examplesHaveRetailerLinks}
                      className="mt-2 text-center text-[11px] leading-snug md:mt-3 md:text-xs md:leading-relaxed"
                    />
                  </>
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

      {showStartOverFab ? (
        // Signed-in mobile: sit above the fixed bottom tab bar. Signed-out: no
        // tab bar, so drop into the reserve at the bottom of the picks card.
        <div className={`fixed ${user ? 'bottom-20' : 'bottom-6'} lg:bottom-6 left-0 right-0 z-30 pointer-events-none`}>
          <div className={`${EMBER_FIGMA_APP_CONTAINER} flex justify-center`}>
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
