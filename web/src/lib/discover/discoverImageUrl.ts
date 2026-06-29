import type { DiscoverFigmaImageVariant } from '@/components/discover/figma/DiscoverFigmaImage';

/** Target dimensions — must preserve source aspect ratio via resize=contain (width-only breaks to portrait). */
const VARIANT_DIMENSIONS: Record<DiscoverFigmaImageVariant, { width: number; height: number }> = {
  hero: { width: 800, height: 600 },
  card: { width: 640, height: 360 },
  product: { width: 800, height: 450 },
  'product-side': { width: 384, height: 216 },
};

const SUPABASE_OBJECT_PATH =
  /^https:\/\/([^/]+)\/storage\/v1\/object\/public\/(.+)$/i;

const SUPABASE_RENDER_PATH =
  /^https:\/\/([^/]+)\/storage\/v1\/render\/image\/public\/(.+?)(\?.*)?$/i;

function supabaseRenderUrl(host: string, path: string, variant: DiscoverFigmaImageVariant): string {
  const { width, height } = VARIANT_DIMENSIONS[variant];
  // width-only resize returns wrong aspect (e.g. 640×768 for 16:9 sources) and object-cover crops like a zoom.
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    resize: 'contain',
    quality: '75',
    format: 'webp',
  });
  return `https://${host}/storage/v1/render/image/public/${path}?${params.toString()}`;
}

/**
 * Serve Supabase category assets via Storage image transforms (WebP, aspect-preserving).
 * Category masters are 1376×768; width-only transforms distort aspect and break object-cover framing.
 */
export function optimizeDiscoverImageUrl(
  url: string | null | undefined,
  variant: DiscoverFigmaImageVariant = 'card'
): string {
  if (!url?.trim()) return '';

  const trimmed = url.trim();

  const objectMatch = trimmed.match(SUPABASE_OBJECT_PATH);
  if (objectMatch) {
    const [, host, path] = objectMatch;
    return supabaseRenderUrl(host, path, variant);
  }

  const renderMatch = trimmed.match(SUPABASE_RENDER_PATH);
  if (renderMatch) {
    const [, host, path] = renderMatch;
    return supabaseRenderUrl(host, path, variant);
  }

  const { width } = VARIANT_DIMENSIONS[variant];
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
