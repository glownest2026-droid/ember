'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bookmark, Compass, Menu, Store } from 'lucide-react';
import { useSubnavStats } from '@/lib/subnav/SubnavStatsContext';
import { EMBER_FIGMA_APP_CONTAINER } from '@/lib/discover/figmaTokens';
import { useAppShellNav } from './AppShellNavContext';

function mobileTabClass(active: boolean): string {
  return `flex flex-col items-center gap-1 min-w-[60px] ${active ? 'text-[#FF5C34]' : 'text-[#66717D]'}`;
}

/** Fixed bottom tabs on Figma app-shell routes (Discover / Saves / Marketplace / Menu). */
export function EmberFigmaMobileNav() {
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { user } = useSubnavStats();
  const appShellNav = useAppShellNav();

  const selectedChildId = searchParams?.get('child') ?? '';
  const isDiscover = pathname.startsWith('/discover');
  const isMyIdeas = pathname.startsWith('/my-ideas');
  const isMarketplace = pathname.startsWith('/marketplace');

  const buildUrlWithChild = (path: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (selectedChildId) params.set('child', selectedChildId);
    else params.delete('child');
    const q = params.toString();
    return q ? `${path}?${q}` : path;
  };

  if (!user) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E2DC] z-50"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-label="App navigation"
    >
      <div className={`${EMBER_FIGMA_APP_CONTAINER} flex justify-between py-3`}>
      <Link href={buildUrlWithChild('/discover')} className={mobileTabClass(isDiscover)}>
        <Compass size={24} strokeWidth={isDiscover ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Discover</span>
      </Link>
      <Link href={buildUrlWithChild('/my-ideas')} className={mobileTabClass(isMyIdeas)}>
        <Bookmark size={24} strokeWidth={isMyIdeas ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Saves</span>
      </Link>
      <Link href={buildUrlWithChild('/marketplace')} className={mobileTabClass(isMarketplace)}>
        <Store size={24} strokeWidth={isMarketplace ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Marketplace</span>
      </Link>
      <button
        type="button"
        onClick={() => appShellNav?.toggleMobileMenu()}
        className={mobileTabClass(!!appShellNav?.mobileMenuOpen)}
        aria-label="Open menu"
        aria-expanded={appShellNav?.mobileMenuOpen}
      >
        <Menu size={24} strokeWidth={appShellNav?.mobileMenuOpen ? 2.5 : 2} />
        <span className="text-[11px] font-medium">Menu</span>
      </button>
      </div>
    </nav>
  );
}
