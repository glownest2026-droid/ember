'use client';

import Link from 'next/link';
import { Gem, LogOut, Settings, Users } from 'lucide-react';
import { useAppShellNav } from './AppShellNavContext';

/** Account menu anchored above the fixed bottom tab bar (Figma app shell). */
export function AppShellMobileMenuSheet() {
  const appShellNav = useAppShellNav();
  if (!appShellNav?.mobileMenuOpen) return null;

  const close = () => appShellNav.setMobileMenuOpen(false);

  return (
    <>
      <button
        type="button"
        className="md:hidden fixed inset-0 z-[55] bg-black/25"
        aria-label="Close menu"
        onClick={close}
      />
      <div
        className="md:hidden fixed left-4 right-4 z-[60] rounded-2xl border border-[#E7E2DC] bg-white shadow-xl overflow-hidden"
        style={{ bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))' }}
        role="menu"
      >
        <nav className="flex flex-col p-2">
          <Link
            href="/account"
            onClick={close}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#253044] hover:bg-[#FBFAF7] text-sm font-medium"
          >
            <Settings className="w-4 h-4 text-[#66717D]" strokeWidth={2} />
            Account
          </Link>
          <Link
            href="/family"
            onClick={close}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#253044] hover:bg-[#FBFAF7] text-sm font-medium"
          >
            <Users className="w-4 h-4 text-[#66717D]" strokeWidth={2} />
            Family
          </Link>
          <Link
            href="/pricing"
            onClick={close}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#253044] hover:bg-[#FBFAF7] text-sm font-medium"
          >
            <Gem className="w-4 h-4 text-[#66717D]" strokeWidth={2} />
            Membership
          </Link>
          <Link
            href="/signout"
            onClick={close}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#253044] hover:bg-[#FBFAF7] text-sm font-medium"
          >
            <LogOut className="w-4 h-4 text-[#66717D]" strokeWidth={2} />
            Sign out
          </Link>
        </nav>
      </div>
    </>
  );
}
