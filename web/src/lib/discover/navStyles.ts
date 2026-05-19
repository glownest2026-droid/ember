import { discoverManrope } from '@/lib/discover/manrope';

/** Figma May 2026 discover app shell — header surface (matches live /discover). */
export const FIGMA_NAV_HEADER_CLASS = `bg-[#FBFAF7] border-[#E7E2DC] ${discoverManrope.className}`;

export function figmaDesktopNavLinkClass(active: boolean): string {
  return `inline-block cursor-pointer border-b-2 pb-0.5 text-base font-medium transition-colors ${
    active
      ? 'border-[#FF5C34] text-[#253044]'
      : 'border-transparent text-[#66717D] hover:border-transparent hover:text-[#253044]'
  }`;
}

export function figmaMutedNavLinkClass(active = false): string {
  return `cursor-pointer text-base font-medium transition-colors whitespace-nowrap ${
    active ? 'text-[#253044]' : 'text-[#66717D] hover:text-[#253044]'
  }`;
}

export const FIGMA_LOGO_WORDMARK_CLASS = 'font-bold text-xl text-[#253044]';

export const FIGMA_CHILD_PILL_CLASS =
  'flex cursor-pointer items-center gap-2 rounded-full border border-[#E7E2DC] bg-white px-3 py-1.5 transition-colors hover:bg-slate-50';

export const FIGMA_PROFILE_BUTTON_CLASS =
  'flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E7E2DC] bg-white text-sm font-semibold text-[#253044] transition-colors hover:bg-[#FBFAF7]';

export const FIGMA_CHILD_PILL_LABEL_CLASS = 'text-sm font-semibold text-[#253044] truncate max-w-[12rem]';

export const FIGMA_DROPDOWN_PANEL_CLASS =
  'rounded-2xl border border-[#E7E2DC] bg-white shadow-lg overflow-hidden';

export const FIGMA_DROPDOWN_ITEM_CLASS =
  'w-full cursor-pointer text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#253044] hover:bg-[#FBFAF7] transition-colors';

export const FIGMA_CTA_PRIMARY_CLASS =
  'px-6 py-2.5 bg-[#FF5C34] text-white rounded-xl hover:bg-[#E54A2E] transition-colors font-semibold text-base whitespace-nowrap';

export const FIGMA_CTA_TEXT_CLASS = 'text-sm font-semibold text-[#FF5C34] hover:text-[#E54A2E] transition-colors';
