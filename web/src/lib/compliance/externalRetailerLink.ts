/** rel values for outbound retailer links that may be affiliate or paid. */
export const RETAILER_LINK_REL = 'noopener noreferrer sponsored' as const;

export function retailerLinkRel(url: string | null | undefined): string {
  if (!url || url === '#') return 'noopener noreferrer';
  return RETAILER_LINK_REL;
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
