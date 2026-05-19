'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bookmark, ChevronDown, Compass, Store, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { discoverManrope } from '@/lib/discover/manrope';
import { EMBER_FIGMA_APP_CONTAINER } from '@/lib/discover/figmaTokens';
import { figmaDesktopNavLinkClass } from '@/lib/discover/navStyles';

const EMBER_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const CHILD_AVATAR_COLORS = ['#D9EEF4', '#FF8870', '#B8432B', '#FFB347', '#7B68B6'];

type SubnavChild = {
  id: string;
  child_name?: string | null;
  display_name?: string | null;
};

function toSubnavChild(r: Record<string, unknown>): SubnavChild {
  return {
    id: (r.id as string) ?? '',
    child_name: ((r.child_name ?? r.childName) as string | null) ?? null,
    display_name: ((r.display_name ?? r.displayName) as string | null) ?? null,
  };
}

function childDisplayName(c: SubnavChild, index: number): string {
  const name = (c.child_name || c.display_name)?.trim();
  return name || `Child ${index + 1}`;
}

function childInitial(c: SubnavChild, index: number): string {
  const name = (c.child_name || c.display_name)?.trim();
  if (name) return name.charAt(0).toUpperCase();
  return String(index + 1);
}

function mobileTabClass(active: boolean): string {
  return `flex flex-col items-center gap-1 min-w-[60px] ${active ? 'text-[#FF5C34]' : 'text-[#66717D]'}`;
}

/**
 * Figma Root.tsx app navigation — desktop header + mobile child bar + bottom tabs.
 * Used on discover / my-ideas / marketplace / family routes.
 */
export function EmberFigmaAppNav() {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSubnavStats();
  const [children, setChildren] = useState<SubnavChild[]>([]);
  const [childMenuOpen, setChildMenuOpen] = useState(false);
  const childMenuRef = useRef<HTMLDivElement>(null);

  const selectedChildId = searchParams?.get('child') ?? '';
  const selectedChild = children.find((c) => c.id === selectedChildId) ?? null;
  const selectedIndex = selectedChild ? children.findIndex((c) => c.id === selectedChild.id) : 0;
  const selectedLabel = selectedChild
    ? childDisplayName(selectedChild, selectedIndex)
    : user
      ? 'All children'
      : 'Your family';

  const isDiscover = pathname.startsWith('/discover');
  const isMyIdeas = pathname.startsWith('/my-ideas');
  const isMarketplace = pathname.startsWith('/marketplace');
  const isFamily = pathname.startsWith('/family');

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

  useEffect(() => {
    document.documentElement.classList.add(discoverManrope.variable, 'ember-figma-app');
    document.documentElement.style.setProperty('--brand-font-body', 'var(--font-discover-manrope)');
    document.documentElement.style.setProperty('--brand-font-heading', 'var(--font-discover-manrope)');
    document.documentElement.style.setProperty('--brand-font-subheading', 'var(--font-discover-manrope)');
    return () => {
      document.documentElement.classList.remove(discoverManrope.variable, 'ember-figma-app');
      document.documentElement.style.removeProperty('--brand-font-body');
      document.documentElement.style.removeProperty('--brand-font-heading');
      document.documentElement.style.removeProperty('--brand-font-subheading');
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setChildren([]);
      return;
    }
    const supabase = createClient();
    supabase
      .from('children')
      .select('id, child_name, display_name')
      .eq('is_suppressed', false)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setChildren(data.map((r) => toSubnavChild(r as Record<string, unknown>)));
        }
      });
  }, [user?.id]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (childMenuRef.current && !childMenuRef.current.contains(e.target as Node)) {
        setChildMenuOpen(false);
      }
    };
    if (childMenuOpen) document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [childMenuOpen]);

  const handleChildSelect = (childId: string | null) => {
    setChildMenuOpen(false);
    if (isDiscover) {
      const o = window.location.origin;
      if (childId) window.location.assign(`${o}/discover?child=${encodeURIComponent(childId)}`);
      else window.location.assign(`${o}/discover`);
      return;
    }
    router.push(buildUrlWithChild(pathname || '/discover', childId));
    router.refresh();
  };

  const childPill = (
    <div className="relative" ref={childMenuRef}>
      <button
        type="button"
        onClick={() => {
          if (!user) {
            const next = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
            router.push(`/signin?next=${encodeURIComponent(next)}`);
            return;
          }
          setChildMenuOpen((o) => !o);
        }}
        className="flex items-center gap-2 cursor-pointer bg-white border border-[#E7E2DC] px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
        aria-expanded={childMenuOpen}
        aria-haspopup="listbox"
      >
        <ChildAvatar
          initial={selectedChild ? childInitial(selectedChild, selectedIndex) : '·'}
          color={CHILD_AVATAR_COLORS[selectedIndex % CHILD_AVATAR_COLORS.length]}
        />
        <span className="text-sm font-semibold text-[#253044] max-w-[8rem] truncate">{selectedLabel}</span>
        <ChevronDown size={14} className="text-[#66717D] shrink-0" />
      </button>
      {user && childMenuOpen ? (
        <div
          className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#E7E2DC] bg-white shadow-lg z-[120] p-2"
          role="listbox"
        >
          <button
            type="button"
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#253044] hover:bg-[#FBFAF7]"
            onClick={() => handleChildSelect(null)}
          >
            All children
          </button>
          {children.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-[#253044] hover:bg-[#FBFAF7] flex items-center gap-2"
              onClick={() => handleChildSelect(c.id)}
            >
              <ChildAvatar initial={childInitial(c, idx)} color={CHILD_AVATAR_COLORS[idx % CHILD_AVATAR_COLORS.length]} />
              {childDisplayName(c, idx)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <header className="hidden md:block bg-[#FBFAF7] border-b border-[#E7E2DC] sticky top-0 z-50">
        <div className={`${EMBER_FIGMA_APP_CONTAINER} h-20 flex items-center justify-between`}>
          <Link href="/discover" className="flex items-center gap-2 shrink-0">
            <Image src={EMBER_LOGO_SRC} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-bold text-xl text-[#253044]">Ember</span>
          </Link>
          <nav className="flex gap-8 items-center">
            <Link href={buildUrlWithChild('/discover', selectedChildId || null)} className={figmaDesktopNavLinkClass(isDiscover)}>
              What&apos;s next
            </Link>
            <Link href={buildUrlWithChild('/my-ideas', selectedChildId || null)} className={figmaDesktopNavLinkClass(isMyIdeas)}>
              My ideas
            </Link>
            <Link
              href={buildUrlWithChild('/marketplace', selectedChildId || null)}
              className={figmaDesktopNavLinkClass(isMarketplace)}
            >
              Marketplace
            </Link>
            <Link href={buildUrlWithChild('/family', selectedChildId || null)} className={figmaDesktopNavLinkClass(isFamily)}>
              Family
            </Link>
          </nav>
          {childPill}
        </div>
      </header>

      <header className="md:hidden bg-[#FBFAF7] sticky top-0 z-50 py-3 px-4 flex items-center justify-between border-b border-[#E7E2DC]">
        {childPill}
        {!user ? (
          <Link
            href={`/signin?next=${encodeURIComponent(pathname)}`}
            className="text-sm font-semibold text-[#FF5C34]"
          >
            Sign in
          </Link>
        ) : null}
      </header>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E2DC] flex justify-between px-6 py-3 z-50"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        aria-label="App navigation"
      >
        <Link href={buildUrlWithChild('/discover', selectedChildId || null)} className={mobileTabClass(isDiscover)}>
          <Compass size={24} strokeWidth={isDiscover ? 2.5 : 2} />
          <span className="text-[11px] font-medium">What&apos;s next</span>
        </Link>
        <Link href={buildUrlWithChild('/my-ideas', selectedChildId || null)} className={mobileTabClass(isMyIdeas)}>
          <Bookmark size={24} strokeWidth={isMyIdeas ? 2.5 : 2} />
          <span className="text-[11px] font-medium">My ideas</span>
        </Link>
        <Link
          href={buildUrlWithChild('/marketplace', selectedChildId || null)}
          className={mobileTabClass(isMarketplace)}
        >
          <Store size={24} strokeWidth={isMarketplace ? 2.5 : 2} />
          <span className="text-[11px] font-medium">Marketplace</span>
        </Link>
        <Link href={buildUrlWithChild('/family', selectedChildId || null)} className={mobileTabClass(isFamily)}>
          <Users size={24} strokeWidth={isFamily ? 2.5 : 2} />
          <span className="text-[11px] font-medium">Family</span>
        </Link>
      </nav>
    </>
  );
}

function ChildAvatar({ initial, color }: { initial: string; color: string }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
      style={{ backgroundColor: color, color: color === '#D9EEF4' ? '#2F5F7C' : '#fff' }}
    >
      {initial}
    </div>
  );
}
