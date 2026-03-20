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
  Package,
  ShoppingCart,
  Info,
} from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { SubnavSwitch } from './SubnavSwitch';
import { SimpleTooltip } from '@/components/ui/SimpleTooltip';
import { createClient } from '@/utils/supabase/client';

const EMBER_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const CHILD_AVATAR_COLORS = ['#FF8870', '#B8432B', '#FFB347', '#E67A9E', '#7B68B6', '#4ECDC4'];

const REMINDERS_TOOLTIP =
  "We'll automatically send you proactive play ideas at just the right time for your child's next developmental needs.";

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
 * child switcher, stats (ideas/products/gifts), reminders toggle, and profile dropdown.
 * Replaces the previous separate header + subnav for signed-in users.
 */
export function UnifiedSignedInNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, stats, refetch } = useSubnavStats();
  const [children, setChildren] = useState<SubnavChild[]>([]);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [remindersBusy, setRemindersBusy] = useState(false);
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
  const remindersEnabled = stats?.remindersEnabled ?? false;
  const basePath = pathname || '/discover';
  const isDiscover = basePath.startsWith('/discover');
  const isMyIdeas = basePath.startsWith('/my-ideas');
  const isMarketplace = basePath.startsWith('/marketplace');
  const childToggleApplies = isDiscover || isMyIdeas || basePath.startsWith('/family') || isMarketplace;

  const selectedChild = selectedChildId ? children.find((c) => c.id === selectedChildId) : null;
  const selectedChildName =
    selectedChildId === ''
      ? 'All children'
      : selectedChild
        ? childDisplayName(selectedChild, children.findIndex((c) => c.id === selectedChild.id))
        : 'All children';

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

  const handleRemindersChange = useCallback(
    async (checked: boolean) => {
      if (!user) return;
      setRemindersBusy(true);
      try {
        const supabase = createClient();
        await supabase.from('user_notification_prefs').upsert(
          { user_id: user.id, development_reminders_enabled: checked },
          { onConflict: 'user_id' }
        );
        await refetch(selectedChildId || undefined);
      } finally {
        setRemindersBusy(false);
      }
    },
    [user, refetch, selectedChildId]
  );

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

  const navLinkClass =
    'px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium';
  const navLinkActive = 'text-[var(--ember-text-high)] bg-[var(--ember-surface-soft)]';
  const navLinkInactive = 'text-[var(--ember-text-low)] hover:bg-[var(--ember-surface-soft)]';

  return (
    <header
      className="top-0 left-0 right-0 z-[100] w-full min-w-0 bg-[var(--ember-surface-primary)] border-b border-[var(--ember-border-subtle)] lg:sticky"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        minHeight: 'var(--header-height)',
      }}
      data-unified-signed-in-nav
    >
      <div className="mx-auto w-full min-w-0 max-w-[90rem] px-4 md:px-6 lg:px-12">
        {/* Main row */}
        <div className="flex h-16 items-center justify-between gap-4 lg:gap-6">
          {/* Left: Logo + desktop nav + child selector */}
          <div className="flex flex-1 items-center gap-4 lg:gap-6 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0"
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
              <span
                className="hidden sm:block text-xl truncate"
                style={{ fontWeight: 600, color: 'var(--ember-text-high)' }}
              >
                Ember
              </span>
            </Link>

            {/* Desktop nav tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href={buildUrlWithChild('/discover', selectedChildId || null)}
                className={`${navLinkClass} ${isDiscover ? navLinkActive : navLinkInactive}`}
              >
                Discover
              </Link>
              <Link
                href={buildUrlWithChild('/my-ideas', selectedChildId || null)}
                className={`${navLinkClass} ${isMyIdeas ? navLinkActive : navLinkInactive}`}
              >
                Saves
              </Link>
              <Link
                href={buildUrlWithChild('/marketplace', selectedChildId || null)}
                className={`${navLinkClass} ${isMarketplace ? navLinkActive : navLinkInactive}`}
              >
                Marketplace
              </Link>
            </nav>

            {/* Child profile switcher */}
            <div className="relative hidden lg:block" ref={childDropdownDesktopRef}>
              <button
                type="button"
                onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[var(--ember-text-high)] transition-all duration-300 ${
                  childToggleAffirm
                    ? 'border-[var(--ember-accent-base)] bg-[rgba(255,99,71,0.12)] ring-2 ring-[var(--ember-accent-base)] ring-offset-2'
                    : 'border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)] hover:bg-[var(--ember-surface-soft)]'
                }`}
                aria-expanded={isChildDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select child"
              >
                <span className="text-xs font-medium text-[var(--ember-text-low)]">Child:</span>
                {selectedChild ? (
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: childColor(
                        children.findIndex((c) => c.id === selectedChild.id)
                      ),
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {childInitial(selectedChild, children.findIndex((c) => c.id === selectedChild.id))}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {children.slice(0, 2).map((c, idx) => (
                      <div
                        key={c.id}
                        className="h-5 w-5 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: childColor(children.indexOf(c)),
                          marginLeft: idx > 0 ? '-6px' : 0,
                        }}
                      >
                        <span className="text-white text-[10px] font-semibold">
                          {childInitial(c, children.indexOf(c))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-sm font-medium truncate max-w-[8rem]">{selectedChildName}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform text-[var(--ember-text-low)] ${isChildDropdownOpen ? 'rotate-180' : ''}`}
                  strokeWidth={2}
                />
              </button>

              {isChildDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-[110] bg-[var(--ember-surface-primary)] border border-[var(--ember-border-subtle)] shadow-lg"
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
                      className="w-full text-left px-4 py-3.5 rounded-xl transition-colors mb-1.5 hover:bg-[var(--ember-surface-soft)]"
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
                            className="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--ember-accent-base)]"
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
                        className="w-full text-left px-4 py-3.5 rounded-xl transition-colors mb-1.5 hover:bg-[var(--ember-surface-soft)]"
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
                      className="flex w-full items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors mb-1.5 hover:bg-[var(--ember-surface-soft)] text-left"
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
                      className="flex w-full items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors hover:bg-[var(--ember-surface-soft)] text-left"
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

            {/* Mobile child selector */}
            <div className="lg:hidden relative flex-1 min-w-0 max-w-[180px]" ref={childDropdownMobileRef}>
              <button
                type="button"
                onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl w-full border text-[var(--ember-text-high)] transition-all duration-300 ${
                  childToggleAffirm
                    ? 'border-[var(--ember-accent-base)] bg-[rgba(255,99,71,0.12)] ring-2 ring-[var(--ember-accent-base)]'
                    : 'border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)]'
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
          </div>

          {/* Right: Stats + reminders (desktop) + profile + mobile menu */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Stats - desktop xl */}
            <div className="hidden xl:flex items-center gap-2 mr-2">
              <Link
                href={myIdeasUrl('ideas')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors bg-[var(--ember-surface-soft)] hover:opacity-90"
              >
                <Lightbulb
                  className="w-3.5 h-3.5 text-[var(--ember-accent-base)]"
                  strokeWidth={2}
                />
                <span className="text-sm font-semibold text-[var(--ember-accent-base)]">
                  {stats.categoryIdeasSaved}
                </span>
              </Link>
              <Link
                href={myIdeasUrl('products')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors bg-[var(--ember-surface-soft)] hover:opacity-90"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-[var(--ember-text-high)]" strokeWidth={2} />
                <span className="text-sm font-semibold text-[var(--ember-text-high)]">
                  {stats.toysSaved}
                </span>
              </Link>
              <Link
                href={myIdeasUrl('gifts')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors bg-[var(--ember-surface-soft)] hover:opacity-90"
              >
                <Gift
                  className="w-3.5 h-3.5 text-[var(--ember-accent-base)]"
                  strokeWidth={2}
                />
                <span className="text-sm font-semibold text-[var(--ember-accent-base)]">
                  {typeof stats.giftsSaved === 'number' ? stats.giftsSaved : 0}
                </span>
              </Link>
            </div>

            {/* Reminders - desktop xl */}
            <div className="hidden xl:flex items-center gap-2 mr-2">
              <span className="text-xs text-[var(--ember-text-high)] hidden 2xl:inline">
                Reminders
              </span>
              <SubnavSwitch
                checked={remindersEnabled}
                onCheckedChange={handleRemindersChange}
                disabled={remindersBusy}
                aria-label="Send me development reminders"
              />
              <SimpleTooltip content={REMINDERS_TOOLTIP} minWidth="44rem" maxWidth="min(44rem, 95vw)">
                <button
                  type="button"
                  className="rounded-full p-0.5 text-[var(--ember-text-low)] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ember-accent-hover)] cursor-pointer"
                  aria-label="Development reminders info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            </div>

            {/* Profile dropdown - desktop */}
            <div className="hidden lg:block relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--ember-surface-soft)] hover:bg-[var(--ember-border-subtle)] transition-colors text-[var(--ember-text-low)] font-semibold text-sm"
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
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-[110] bg-[var(--ember-surface-primary)] border border-[var(--ember-border-subtle)] shadow-lg"
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
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl mt-1 text-left text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[var(--ember-text-low)]" strokeWidth={2} />
                      <span className="text-sm font-medium">Account</span>
                    </Link>
                    <Link
                      href="/signout"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-left text-[var(--ember-text-high)] hover:bg-[var(--ember-surface-soft)] transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-[var(--ember-text-low)]" strokeWidth={2} />
                      <span className="text-sm font-medium">Sign out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
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
          </div>
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden border-t border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
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
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[var(--ember-text-high)]">Reminders</span>
              <SubnavSwitch
                checked={remindersEnabled}
                onCheckedChange={handleRemindersChange}
                disabled={remindersBusy}
                aria-label="Send me development reminders"
              />
              <SimpleTooltip content={REMINDERS_TOOLTIP} minWidth="44rem" maxWidth="min(44rem, 95vw)">
                <button
                  type="button"
                  className="rounded-full p-0.5 text-[var(--ember-text-low)] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ember-accent-hover)] cursor-pointer"
                  aria-label="Development reminders info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
