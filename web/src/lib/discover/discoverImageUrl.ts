import type { DiscoverFigmaImageVariant } from '@/components/discover/figma/DiscoverFigmaImage';

const VARIANT_WIDTH: Record<DiscoverFigmaImageVariant, number> = {
  hero: 800,
  card: 640,
  product: 800,
  'product-side': 384,
};

const SUPABASE_OBJECT_PATH =
  /^https:\/\/([^/]+)\/storage\/v1\/object\/public\/(.+)$/i;

const SUPABASE_RENDER_PATH =
  /^https:\/\/([^/]+)\/storage\/v1\/render\/image\/public\/(.+?)(\?.*)?$/i;

/**
 * Serve Supabase category assets via Storage image transforms (WebP, capped width)
 * so cold loads pull ~30–40 KB instead of ~1.5 MB PNG originals.
 */
export function optimizeDiscoverImageUrl(
  url: string | null | undefined,
  variant: DiscoverFigmaImageVariant = 'card'
): string {
  if (!url?.trim()) return '';

  const trimmed = url.trim();
  const width = VARIANT_WIDTH[variant];

  const objectMatch = trimmed.match(SUPABASE_OBJECT_PATH);
  if (objectMatch) {
    const [, host, path] = objectMatch;
    return `https://${host}/storage/v1/render/image/public/${path}?width=${width}&quality=75&format=webp`;
  }

  const renderMatch = trimmed.match(SUPABASE_RENDER_PATH);
  if (renderMatch) {
    const [, host, path, query = ''] = renderMatch;
    const params = new URLSearchParams(query.replace(/^\?/, ''));
    if (!params.has('width')) params.set('width', String(width));
    if (!params.has('quality')) params.set('quality', '75');
    if (!params.has('format')) params.set('format', 'webp');
    return `https://${host}/storage/v1/render/image/public/${path}?${params.toString()}`;
  }

  if (/images\.unsplash\.com/i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      u.searchParams.set('w', String(width));
      u.searchParams.set('q', '75');
      u.searchParams.set('auto', 'format');
      return u.toString();
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

/** Warm browser cache for upcoming carousel images (hover / cache hit). */
export function prefetchDiscoverImageUrls(
  urls: string[],
  variant: DiscoverFigmaImageVariant = 'card'
): void {
  if (typeof document === 'undefined') return;
  for (const raw of urls.slice(0, 4)) {
    const href = optimizeDiscoverImageUrl(raw, variant);
    if (!href) continue;
    if (document.querySelector(`link[rel="prefetch"][href="${href}"]`)) continue;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = href;
    document.head.appendChild(link);
  }
}
