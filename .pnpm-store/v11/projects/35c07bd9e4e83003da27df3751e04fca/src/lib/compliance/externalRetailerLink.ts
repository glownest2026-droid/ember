/** rel values for outbound retailer links that may be affiliate or paid. */
export const RETAILER_LINK_REL = 'noopener noreferrer sponsored' as const;

export function retailerLinkRel(url: string | null | undefined): string {
  if (!url || url === '#') return 'noopener noreferrer';
  return RETAILER_LINK_REL;
}

/**
 * Open a retailer / Google Shopping URL in a new tab or window.
 * Prefer this for Stage 3 "Browse offers" — some mobile WebViews ignore target="_blank"
 * on plain anchors and replace the Discover page instead.
 */
export function openOutboundRetailerUrl(
  url: string | null | undefined,
  event?: { preventDefault(): void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; button?: number }
): void {
  if (!url || url === '#') return;
  // Let the browser handle modified clicks (new tab / new window shortcuts).
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (event.button ?? 0) !== 0)) {
    return;
  }
  event?.preventDefault();
  const opened = window.open(url, '_blank', 'noopener,noreferrer');
  if (opened) {
    try {
      opened.opener = null;
    } catch {
      /* ignore cross-origin opener assignment failures */
    }
    return;
  }
  // Popup blocked despite a user gesture — keep Discover intact by using a named tab retry.
  window.open(url, '_blank');
}

export function hasOutboundRetailerUrl(
  product: {
    canonical_url?: string | null;
    amazon_uk_url?: string | null;
    affiliate_url?: string | null;
    affiliate_deeplink?: string | null;
  } | null | undefined
): boolean {
  if (!product) return false;
  const url =
    product.canonical_url ||
    product.amazon_uk_url ||
    product.affiliate_url ||
    product.affiliate_deeplink;
  return Boolean(url && url !== '#');
}
