'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useRef, useEffect, useCallback, useState } from 'react';
import {
  ChevronDown,
  Plus,
  User,
  Menu,
  X,
  Lightbulb,
  Gift,
  Settings,
  LogOut,
  Users,
  Gem,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { createClient } from '@/utils/supabase/client';
import { useAppShellNav } from '@/components/figma/discover/AppShellNavContext';
import { EMBER_FIGMA_APP_CONTAINER } from '@/lib/discover/figmaTokens';
import {
  FIGMA_CHILD_PILL_CLASS,
  FIGMA_CHILD_PILL_LABEL_CLASS,
  FIGMA_DROPDOWN_ITEM_CLASS,
  FIGMA_DROPDOWN_PANEL_CLASS,
  FIGMA_LOGO_WORDMARK_CLASS,
  FIGMA_NAV_HEADER_CLASS,
  FIGMA_PROFILE_BUTTON_CLASS,
  figmaDesktopNavLinkClass,
} from '@/lib/discover/navStyles';

const EMBER_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const CHILD_AVATAR_COLORS = ['#FF8870', '#B8432B', '#FFB347', '#E67A9E', '#7B68B6', '#4ECDC4'];

/** Figma EmberFigmaAppNav / Root.tsx child pill avatar colours */
const FIGMA_CHILD_AVATAR_COLORS = ['#D9EEF4', '#FF8870', '#B8432B', '#FFB347', '#7B68B6'];

const CHILD_TOGGLE_AFFIRM_KEY = 'ember_child_toggle_affirm';

type SubnavChild = {
  id: string;
  child_name?: string | null;
  display_name?: string | null;
  age_band?: string | null;
  gender?: string | null;
};

function toSubnavChild(r: Record<string, unknown>): SubnavChild {
  const raw = r as Record<string, unknown>;
  const id = (raw.id as string) ?? '';
  const child_name = (raw.child_name ?? raw.childName) as string | null | undefined;
  const display_name = (raw.display_name ?? raw.displayName) as string | null | undefined;
  const age_band = (raw.age_band ?? raw.ageBand) as string | null | undefined;
  const gender = (raw.gender as string) ?? null;
  return {
    id,
    child_name: (child_name && String(child_name).trim()) || null,
    display_name: (display_name && String(display_name).trim()) || null,
    age_band: age_band ?? null,
    gender: gender ?? null,
  };
}

function genderToLabel(gender: string): string {
  const g = gender.trim().toLowerCase();
  if (g === 'male') return 'Boy';
  if (g === 'female') return 'Girl';
  return 'Child';
}

function childDisplayName(c: SubnavChild, index: number): string {
  const name = (c.child_name || c.display_name)?.trim();
  if (name) return name;
  if (c.gender?.trim()) return genderToLabel(c.gender);
  return `Child ${index + 1}`;
}

function childInitial(c: SubnavChild, index: number): string {
  const name = (c.child_name || c.display_name)?.trim();
  if (name) return name.charAt(0).toUpperCase();
  if (c.gender?.trim()) return genderToLabel(c.gender).charAt(0);
  return String(index + 1);
}

function childColor(index: number): string {
  return CHILD_AVATAR_COLORS[index % CHILD_AVATAR_COLORS.length];
}

/**
 * Unified signed-in navigation (Figma Subnav Bar V3): one sticky bar with logo, Discover/Saves/Marketplace,
 * child switcher, stats (ideas/products/gifts), reminders link, and profile dropdown.
 * Replaces the previous separate header + subnav for signed-in users.
 */
export function UnifiedSignedInNav({
  hideLegacyMobileTabs = false,
  hideHeaderMobileMenu = false,
}: {
  hideLegacyMobileTabs?: boolean;
  hideHeaderMobileMenu?: boolean;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, stats, refetch } = useSubnavStats();
  const appShellNav = useAppShellNav();
  const [children, setChildren] = useState<SubnavChild[]>([]);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [localMobileMenuOpen, setLocalMobileMenuOpen] = useState(false);
  const isMobileMenuOpen = appShellNav ? appShellNav.mobileMenuOpen : localMobileMenuOpen;
  const setIsMobileMenuOpen = useCallback(
    (open: boolean) => {
      if (appShellNav) appShellNav.setMobileMenuOpen(open);
      else setLocalMobileMenuOpen(open);
    },
    [appShellNav]
  );
  const toggleMobileMenu = useCallback(() => {
    if (appShellNav) appShellNav.toggleMobileMenu();
    else setLocalMobileMenuOpen((o) => !o);
  }, [appShellNav]);
  /** Must be separate: one ref on both desktop+mobile would point to only the last node, so click-outside closed the desktop menu before child buttons received clicks. */
  const childDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const childDropdownMobileRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  /** Mobile: 1px sentinel directly above tab row — when it scrolls above viewport, dock tabs as fixed (sticky fails inside tall header). */
  const mobileTabsSentinelRef = useRef<HTMLDivElement>(null);
  const mobileTabsBarRef = useRef<HTMLDivElement>(null);
  const [mobileTabsDocked, setMobileTabsDocked] = useState(false);
  const [mobileTabsSpacerPx, setMobileTabsSpacerPx] = useState(48);
  /** Brief accent on child toggle after selection (replaces toast). */
  const [childToggleAffirm, setChildToggleAffirm] = useState(false);

  const selectedChildId = searchParams?.get('child') ?? '';
  const basePath = pathname || '/discover';
  const isDiscover = basePath.startsWith('/discover');
  const isMyIdeas = basePath.startsWith('/my-ideas');
  const isMarketplace = basePath.startsWith('/marketplace') || basePath.startsWith('/app/marketplace');
  const isAppMessages = basePath.startsWith('/app/messages');
  const isFamilyReminders = basePath.startsWith('/family');
  const childToggleApplies = isDiscover || isMyIdeas || basePath.startsWith('/family') || isMarketplace;

  const selectedChild = selectedChildId ? children.find((c) => c.id === selectedChildId) : null;
  const selectedChildName =
    selectedChildId === ''
      ? 'All children'
      : selectedChild
        ? childDisplayName(selectedChild, children.findIndex((c) => c.id === selectedChild.id))
        : 'All children';
  const selectedChildIndex = selectedChild
    ? children.findIndex((c) => c.id === selectedChild.id)
    : 0;

  const buildUrlWithChild = useCallback(
    (path: string, childId: string | null) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      if (childId) params.set('child', childId);
      else params.delete('child');
      const q = params.toString();
      return q ? `${path}?${q}` : path;
    },
    [searchParams]
  );

  const myIdeasUrl = useCallback(
    (tab: 'ideas' | 'products' | 'gifts') => {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.set('tab', tab);
      return `/my-ideas?${params.toString()}`;
    },
    [searchParams]
  );

  const fetchChildren = useCallback(() => {
    if (!user?.id) return;
    const supabase = createClient();
    supabase
      .from('children')
      .select('id, child_name, age_band, gender')
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && Array.isArray(data)) {
          setChildren(data.map((r) => toSubnavChild(r as Record<string, unknown>)));
          return;
        }
        supabase
          .from('children')
          .select('id, display_name, age_band, gender')
          .eq('is_suppressed', false)
          .order('created_at', { ascending: false })
          .then(({ data: data2, error: err2 }) => {
            if (!err2 && Array.isArray(data2)) {
              setChildren(
                data2.map((r) =>
                  toSubnavChild({
                    ...(r as object),
                    child_name: (r as Record<string, unknown>).display_name,
                  } as Record<string, unknown>)
                )
              );
              return;
            }
            supabase
              .from('children')
              .select('id, gender, age_band')
              .eq('is_suppressed', false)
              .order('created_at', { ascending: false })
              .then(({ data: fallbackData }) => {
                if (Array.isArray(fallbackData)) {
                  setChildren(
                    fallbackData.map((r) =>
                      toSubnavChild({
                        ...(r as object),
                        child_name: null,
                        display_name: null,
                      } as Record<string, unknown>)
                    )
                  );
                }
              });
          });
      });
  }, [user?.id]);

  useEffect(() => {
    fetchChildren();
  }, [pathname, fetchChildren]);

  useEffect(() => {
    if (!user?.id) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchChildren();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user?.id, fetchChildren]);

  useEffect(() => {
    if (!user?.id || !(isDiscover || isMyIdeas || basePath.startsWith('/family'))) return;
    refetch(selectedChildId || undefined);
  }, [pathname, selectedChildId, user?.id, refetch, isDiscover, isMyIdeas, basePath]);

  useEffect(() => {
    if (!childToggleAffirm) return;
    const t = window.setTimeout(() => setChildToggleAffirm(false), 850);
    return () => window.clearTimeout(t);
  }, [childToggleAffirm]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CHILD_TOGGLE_AFFIRM_KEY) === '1') {
        sessionStorage.removeItem(CHILD_TOGGLE_AFFIRM_KEY);
        setChildToggleAffirm(true);
      }
    } catch {
      /* ignore */
    }
  }, [pathname, selectedChildId]);

  useEffect(() => {
    const measureSpacer = () => {
      const bar = mobileTabsBarRef.current;
      if (bar && window.innerWidth < 1024) {
        setMobileTabsSpacerPx(bar.offsetHeight || 48);
      }
    };
    const updateDocked = () => {
      if (window.innerWidth >= 1024) {
        setMobileTabsDocked(false);
        return;
      }
      const sentinel = mobileTabsSentinelRef.current;
      if (!sentinel) return;
      setMobileTabsDocked(sentinel.getBoundingClientRect().top < 0);
    };
    const onResize = () => {
      measureSpacer();
      updateDocked();
    };
    measureSpacer();
    updateDocked();
    window.addEventListener('scroll', updateDocked, { passive: true });
    window.addEventListener('resize', onResize);
    const barEl = mobileTabsBarRef.current;
    const ro = barEl ? new ResizeObserver(measureSpacer) : null;
    if (barEl && ro) ro.observe(barEl);
    return () => {
      window.removeEventListener('scroll', updateDocked);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [pathname, isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      const inChildDropdown =
        childDropdownDesktopRef.current?.contains(t) || childDropdownMobileRef.current?.contains(t);
      if (isChildDropdownOpen && !inChildDropdown) {
        setIsChildDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(t)) {
        setIsProfileDropdownOpen(false);
      }
    };
    if (isChildDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isChildDropdownOpen, isProfileDropdownOpen]);

  const handleChildSelect = useCallback(
    (childId: string | null) => {
      setIsChildDropdownOpen(false);
      if (typeof window !== 'undefined' && isDiscover) {
        try {
          sessionStorage.setItem(CHILD_TOGGLE_AFFIRM_KEY, '1');
        } catch {
          /* ignore */
        }
        const o = window.location.origin;
        if (childId) {
          window.location.assign(`${o}/discover?child=${encodeURIComponent(childId)}`);
        } else {
          window.location.assign(`${o}/discover`);
        }
        return;
      }
      setChildToggleAffirm(true);
      if (childToggleApplies) {
        router.push(buildUrlWithChild(basePath, childId));
        router.refresh();
      } else {
        router.push(childId ? `/family?child=${encodeURIComponent(childId)}` : '/family');
        router.refresh();
      }
    },
    [childToggleApplies, basePath, buildUrlWithChild, isDiscover, router]
  );

  if (!user || !stats) return null;

  return (
    <header
      className={`top-0 left-0 right-0 z-[100] w-full min-w-0 border-b lg:sticky ${FIGMA_NAV_HEADER_CLASS}`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'var(--header-height)',
      }}
      data-unified-signed-in-nav
    >
      <div
        className={`min-w-0 ${EMBER_FIGMA_APP_CONTAINER}`}
      >
        {/* Main row: Figma Root.tsx — logo | centred nav | child pill + profile */}
        <div className="relative flex h-16 w-full items-center md:h-20">
          {/* Left: logo */}
          <div className="z-10 flex shrink-0 items-center">
            <Link
              href="/"
              className="flex shrink-0 cursor-pointer items-center gap-2.5"
              aria-label="Ember home"
            >
              <Image
                src={EMBER_LOGO_SRC}
                alt=""
                className="h-12 w-12 md:h-11 md:w-11 object-contain"
                width={48}
                height={48}
                priority
              />
              <span className={`hidden sm:block truncate ${FIGMA_LOGO_WORDMARK_CLASS}`}>Ember</span>
            </Link>
          </div>

          {/* Mobile child selector — centred in header */}
          <div
            className="absolute left-1/2 top-1/2 z-20 w-[190px] max-w-[52vw] -translate-x-1/2 -translate-y-1/2 lg:hidden"
            ref={childDropdownMobileRef}
          >
              <button
                type="button"
                onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                className={`${FIGMA_CHILD_PILL_CLASS} w-full ${
                  childToggleAffirm
                    ? 'border-[#FF5C34] bg-[rgba(255,92,52,0.12)] ring-2 ring-[#FF5C34]'
                    : ''
                }`}
                aria-expanded={isChildDropdownOpen}
                aria-label="Select child"
              >
                <span className="text-xs font-medium text-[var(--ember-text-low)]">Child:</span>
                {selectedChild ? (
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: childColor(
                        children.findIndex((c) => c.id === selectedChild.id)
                      ),
                    }}
                  >
                    <span className="text-white text-[10px] font-semibold">
                      {childInitial(selectedChild, children.findIndex((c) => c.id === selectedChild.id))}
                    </span>
                  </div>
                ) : (
                  <User className="w-4 h-4 flex-shrink-0 text-[var(--ember-text-low)]" strokeWidth={2} />
                )}
                <span className="text-xs font-medium truncate flex-1 min-w-0">
                  {selectedChildName}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 flex-shrink-0 text-[var(--ember-text-low)] transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>
              {isChildDropdownOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 max-h-[400px] overflow-y-auto rounded-2xl bg-[var(--ember-surface-primary)] border border-[var(--ember-border-subtle)] shadow-lg z-[110]"
                  role="listbox"
                >
                  <div className="p-3">
                    <div className="px-4 py-2 mb-2">
                      <div className="text-xs font-medium text-[var(--ember-text-low)] uppercase tracking-wide">
                        Select child
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChildSelect(null)}
                      className="w-full text-left px-4 py-3.5 rounded-xl mb-1.5 hover:bg-[var(--ember-surface-soft)]"
                      style={{
                        backgroundColor:
                          selectedChildId === '' ? 'var(--ember-surface-soft)' : 'transparent',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="flex items-center">
                            {children.slice(0, 2).map((c, idx) => (
                              <div
                                key={c.id}
                                className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-white"
                                style={{
                                  backgroundColor: childColor(children.indexOf(c)),
                                  marginLeft: idx > 0 ? '-12px' : 0,
                                  zIndex: children.length - idx,
                                }}
                              >
                                <span className="text-white text-base font-semibold">
                                  {childInitial(c, children.indexOf(c))}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--ember-text-high)]">
                              All children
                            </div>
                            <div className="text-xs text-[var(--ember-text-low)]">All children</div>
                          </div>
                        </div>
                        {selectedChildId === '' && (
                          <div
                            className="w-2 h-2 rounded-full bg-[var(--ember-accent-base)]"
                            aria-hidden
                          />
                        )}
                      </div>
                    </button>
                    {children.map((c, i) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleChildSelect(c.id)}
                        className="w-full text-left px-4 py-3.5 rounded-xl mb-1.5 hover:bg-[var(--ember-surface-soft)]"
                        style={{
                          backgroundColor:
                            selectedChildId === c.id ? 'var(--ember-surface-soft)' : 'transparent',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: childColor(i) }}
                            >
                              <span className="text-white text-base font-semibold">
                                {childInitial(c, i)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-[var(--ember-text-high)] truncate">
                                {childDisplayName(c, i)}
                              </div>
                              <div className="text-xs text-[var(--ember-text-low)] truncate">
                                {c.age_band ?? ''}
                              </div>
                            </div>
                          </div>
                          {selectedChildId === c.id && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--ember-accent-base)]"
                              aria-hidden
                            />
                          )}
                        </div>
                      </button>
                    ))}
                    <div className="h-px my-3 bg-[var(--ember-border-subtle)]" aria-hidden />
                    <Link
                      href="/add-children"
                      onClick={() => setIsChildDropdownOpen(false)}
                      className="flex w-full items-center gap-3.5 px-4 py-3.5 rounded-xl mb-1.5 hover:bg-[var(--ember-surface-soft)] text-left"
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-dashed border-[var(--ember-200,#FFDCD2)]"
                        style={{ backgroundColor: 'var(--ember-50,#FFF8F5)' }}
                      >
                        <Plus className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--ember-text-high)]">
                          Add a child
                        </div>
                        <div className="text-xs text-[var(--ember-text-low)]">Create new profile</div>
                      </div>
                    </Link>
                    <Link
                      href="/family"
                      onClick={() => setIsChildDropdownOpen(false)}
                      className="flex w-full items-center gap-3.5 px-4 py-3.5 rounded-xl hover:bg-[var(--ember-surface-soft)] text-left"
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--ember-surface-soft)]">
                        <Users className="w-5 h-5 text-[var(--ember-text-low)]" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--ember-text-high)]">
                          Manage my family
                        </div>
                        <div className="text-xs text-[var(--ember-text-low)]">
                          Edit profiles & settings
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
          </div>

          {/* Centre: nav only — centred in space between logo and right cluster */}
          <nav
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:pointer-events-auto md:static md:flex md:flex-1 md:translate-x-0 md:translate-y-0 md:justify-center [&_a]:pointer-events-auto"
            aria-label="Main"
          >
            <Link
              href={buildUrlWithChild('/discover', selectedChildId || null)}
              className={figmaDesktopNavLinkClass(isDiscover)}
            >
              Discover
            </Link>
            <Link
              href={buildUrlWithChild('/my-ideas', selectedChildId || null)}
              className={figmaDesktopNavLinkClass(isMyIdeas)}
            >
              Saves
            </Link>
            <Link
              href={buildUrlWithChild('/marketplace', selectedChildId || null)}
              className={figmaDesktopNavLinkClass(isMarketplace)}
            >
              Marketplace
            </Link>
            <Link href="/app/messages" className={figmaDesktopNavLinkClass(isAppMessages)}>
              Messages
            </Link>
          </nav>

          {/* Right: child pill + profile */}
          <div className="z-10 ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            <div className="relative hidden md:block" ref={childDropdownDesktopRef}>
              <button
                type="button"
                onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                className={`${FIGMA_CHILD_PILL_CLASS} ${
                  childToggleAffirm ? 'border-[#FF5C34] ring-2 ring-[#FF5C34] ring-offset-2' : ''
                }`}
                aria-expanded={isChildDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select child"
              >
                <FigmaChildAvatar
                  initial={selectedChild ? childInitial(selectedChild, selectedChildIndex) : '·'}
                  colorIndex={selectedChildIndex >= 0 ? selectedChildIndex : 0}
                />
                <span className={FIGMA_CHILD_PILL_LABEL_CLASS}>{selectedChildName}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-[#66717D] transition-transform ${isChildDropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {isChildDropdownOpen && (
                <div
                  className={`absolute right-0 top-full z-[120] mt-2 w-72 ${FIGMA_DROPDOWN_PANEL_CLASS}`}
                  role="listbox"
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[#66717D]">
                      Select child
                    </p>
                    <button
                      type="button"
                      onClick={() => handleChildSelect(null)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center justify-between gap-2 ${
                        selectedChildId === '' ? 'bg-[#FBFAF7]' : ''
                      }`}
                    >
                        <span className="truncate">All children</span>
                        {selectedChildId === '' && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF5C34]" aria-hidden />
                        )}
                    </button>
                    {children.map((c, i) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleChildSelect(c.id)}
                        className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-2 ${
                          selectedChildId === c.id ? 'bg-[#FBFAF7]' : ''
                        }`}
                      >
                        <FigmaChildAvatar initial={childInitial(c, i)} colorIndex={i} />
                        <span className="min-w-0 flex-1 truncate">{childDisplayName(c, i)}</span>
                        {selectedChildId === c.id && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-[#FF5C34]" aria-hidden />
                        )}
                      </button>
                    ))}
                    <div className="h-px my-3 bg-[var(--ember-border-subtle)]" aria-hidden />
                    <Link
                      href="/add-children"
                      onClick={() => setIsChildDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-dashed border-[var(--ember-200,#FFDCD2)]"
                        style={{ backgroundColor: 'var(--ember-50,#FFF8F5)' }}
                      >
                        <Plus className="w-5 h-5 text-[var(--ember-accent-base)]" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--ember-text-high)]">
                          Add a child
                        </div>
                        <div className="text-xs text-[var(--ember-text-low)]">Create new profile</div>
                      </div>
                    </Link>
                    <Link
                      href="/family"
                      onClick={() => setIsChildDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--ember-surface-soft)]">
                        <Users className="w-5 h-5 text-[var(--ember-text-low)]" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--ember-text-high)]">
                          Manage my family
                        </div>
                        <div className="text-xs text-[var(--ember-text-low)]">
                          Edit profiles & settings
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown - desktop */}
            <div className="relative hidden md:block" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={FIGMA_PROFILE_BUTTON_CLASS}
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
              >
                {(user?.user_metadata?.name as string)?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  '?'}
              </button>
              {isProfileDropdownOpen && (
                <div
                  className={`absolute right-0 top-full z-[120] mt-2 w-56 ${FIGMA_DROPDOWN_PANEL_CLASS}`}
                  role="menu"
                >
                  <div className="p-3">
                    <div className="px-4 py-3 mb-1">
                      <div className="text-sm font-medium text-[var(--ember-text-high)] truncate">
                        {(user?.user_metadata?.name as string) || 'Account'}
                      </div>
                      <div className="text-xs text-[var(--ember-text-low)] truncate">
                        {user?.email ?? ''}
                      </div>
                    </div>
                    <div className="h-px bg-[var(--ember-border-subtle)]" aria-hidden />
                    <Link
                      href="/account"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <Settings className="h-4 w-4 text-[#66717D]" strokeWidth={2} />
                      Account
                    </Link>
                    <Link
                      href="/family"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <Users className="h-4 w-4 text-[#66717D]" strokeWidth={2} />
                      Family
                    </Link>
                    <Link
                      href="/pricing"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <Gem className="h-4 w-4 text-[#66717D]" strokeWidth={2} />
                      Membership
                    </Link>
                    <Link
                      href="/signout"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className={`${FIGMA_DROPDOWN_ITEM_CLASS} flex items-center gap-3`}
                    >
                      <LogOut className="h-4 w-4 text-[#66717D]" strokeWidth={2} />
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle (hidden when bottom tab bar owns Menu) */}
            {!hideHeaderMobileMenu ? (
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile menu panel (top header; bottom sheet used on Figma app shell) */}
        {isMobileMenuOpen && !hideHeaderMobileMenu && (
          <div
            className={`lg:hidden border-t border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)] ${
              hideLegacyMobileTabs ? 'pb-20' : ''
            }`}
            style={{ paddingBottom: hideLegacyMobileTabs ? undefined : 'env(safe-area-inset-bottom, 0px)' }}
          >
            <nav className="flex flex-col p-4 gap-1">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]"
              >
                <Settings className="w-4 h-4" strokeWidth={2} />
                Account
              </Link>
              <Link
                href="/family"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]"
              >
                <Users className="w-4 h-4" strokeWidth={2} />
                Family
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]"
              >
                <Gem className="w-4 h-4" strokeWidth={2} />
                Membership
              </Link>
              <Link
                href="/signout"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]"
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Sign out
              </Link>
            </nav>
          </div>
        )}

        {!hideLegacyMobileTabs ? (
        <>
        {/* Mobile: sentinel marks where tab row starts; scroll past → dock row as fixed (CSS sticky fails inside tall header) */}
        <div
          ref={mobileTabsSentinelRef}
          className="lg:hidden h-px w-full shrink-0 bg-transparent pointer-events-none"
          aria-hidden
        />
        {mobileTabsDocked && (
          <div
            className="lg:hidden w-full shrink-0"
            style={{ height: mobileTabsSpacerPx }}
            aria-hidden
          />
        )}
        <div
          ref={mobileTabsBarRef}
          className={`lg:hidden border-t border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)] ${
            mobileTabsDocked
              ? 'fixed left-0 right-0 z-[100] border-b shadow-sm'
              : 'relative z-[1]'
          }`}
          style={
            mobileTabsDocked
              ? {
                  top: 0,
                  paddingTop: 'env(safe-area-inset-top, 0px)',
                }
              : undefined
          }
          data-unified-nav-mobile-tabs
        >
          <div className="grid grid-cols-3 max-w-[90rem] mx-auto px-4 md:px-6">
            <Link
              href={buildUrlWithChild('/discover', selectedChildId || null)}
              className={`py-3 text-center text-sm font-medium transition-colors ${
                isDiscover
                  ? 'text-[var(--ember-accent-base)] border-b-2 border-[var(--ember-accent-base)]'
                  : 'text-[var(--ember-text-low)] border-b-2 border-transparent'
              }`}
            >
              Discover
            </Link>
            <Link
              href={buildUrlWithChild('/my-ideas', selectedChildId || null)}
              className={`py-3 text-center text-sm font-medium transition-colors ${
                isMyIdeas
                  ? 'text-[var(--ember-accent-base)] border-b-2 border-[var(--ember-accent-base)]'
                  : 'text-[var(--ember-text-low)] border-b-2 border-transparent'
              }`}
            >
              Saves
            </Link>
            <Link
              href={buildUrlWithChild('/marketplace', selectedChildId || null)}
              className={`py-3 text-center text-sm font-medium transition-colors ${
                isMarketplace
                  ? 'text-[var(--ember-accent-base)] border-b-2 border-[var(--ember-accent-base)]'
                  : 'text-[var(--ember-text-low)] border-b-2 border-transparent'
              }`}
            >
              Marketplace
            </Link>
          </div>
        </div>

        {/* Stats + reminders - mobile/tablet (below tabs) */}
        <div className="xl:hidden py-3 border-t border-[var(--ember-border-subtle)]">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href={myIdeasUrl('ideas')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ember-surface-soft)] transition-colors"
            >
              <Lightbulb
                className="w-4 h-4 text-[var(--ember-accent-base)]"
                strokeWidth={2}
              />
              <span className="text-sm font-semibold text-[var(--ember-accent-base)]">
                {stats.categoryIdeasSaved} ideas
              </span>
            </Link>
            <Link
              href={myIdeasUrl('products')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ember-surface-soft)] transition-colors"
            >
              <ShoppingCart className="w-4 h-4 text-[var(--ember-text-high)]" strokeWidth={2} />
              <span className="text-sm font-semibold text-[var(--ember-text-high)]">
                {stats.toysSaved} products
              </span>
            </Link>
            <Link
              href={myIdeasUrl('gifts')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ember-surface-soft)] transition-colors"
            >
              <Gift className="w-4 h-4 text-[var(--ember-accent-base)]" strokeWidth={2} />
              <span className="text-sm font-semibold text-[var(--ember-accent-base)]">
                {typeof stats.giftsSaved === 'number' ? stats.giftsSaved : 0} gifts
              </span>
            </Link>
            <Link
              href="/family#reminders"
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isFamilyReminders
                  ? 'text-[var(--ember-text-high)] bg-[var(--ember-surface-soft)]'
                  : 'text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]'
              }`}
            >
              Reminders
            </Link>
          </div>
        </div>
        </>
        ) : null}
      </div>
    </header>
  );
}

function FigmaChildAvatar({ initial, colorIndex }: { initial: string; colorIndex: number }) {
  const bg = FIGMA_CHILD_AVATAR_COLORS[colorIndex % FIGMA_CHILD_AVATAR_COLORS.length];
  const fg = bg === '#D9EEF4' ? '#2F5F7C' : '#fff';
  return (
    <span
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color: fg }}
      aria-hidden
    >
      {initial}
    </span>
  );
}
