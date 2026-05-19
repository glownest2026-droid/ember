import { discoverManrope } from '@/lib/discover/manrope';

/** Figma May 2026 discover app shell — header surface (matches live /discover). */
export const FIGMA_NAV_HEADER_CLASS = `bg-[#FBFAF7] border-[#E7E2DC] ${discoverManrope.className}`;

export function figmaDesktopNavLinkClass(active: boolean): string {
  return `text-base font-medium transition-colors py-1 ${
    active
      ? 'text-[#253044] border-b-2 border-[#FF5C34]'
      : 'text-[#66717D] hover:text-[#253044]'
  }`;
}

export function figmaMutedNavLinkClass(active = false): string {
  return `text-base font-medium transition-colors whitespace-nowrap ${
    active ? 'text-[#253044]' : 'text-[#66717D] hover:text-[#253044]'
  }`;
}

export const FIGMA_LOGO_WORDMARK_CLASS = 'font-bold text-xl text-[#253044]';

export const FIGMA_CHILD_PILL_CLASS =
  'flex items-center gap-2 bg-white border border-[#E7E2DC] px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors';

export const FIGMA_CHILD_PILL_LABEL_CLASS = 'text-sm font-semibold text-[#253044] truncate max-w-[12rem]';

export const FIGMA_DROPDOWN_PANEL_CLASS =
  'rounded-2xl border border-[#E7E2DC] bg-white shadow-lg overflow-hidden';

export const FIGMA_DROPDOWN_ITEM_CLASS =
  'w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-[#253044] hover:bg-[#FBFAF7] transition-colors';

export const FIGMA_CTA_PRIMARY_CLASS =
  'px-6 py-2.5 bg-[#FF5C34] text-white rounded-xl hover:bg-[#E54A2E] transition-colors font-semibold text-base whitespace-nowrap';

export const FIGMA_CTA_TEXT_CLASS = 'text-sm font-semibold text-[#FF5C34] hover:text-[#E54A2E] transition-colors';
