import { unstable_cache } from 'next/cache';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';
import { GATEWAY_PUBLIC_REVALIDATE_SECONDS } from '@/lib/pl/gateway-cache';

/** Known v2 filenames in bucket `category_images` (discovered via public HEAD probes). */
export const DISCOVER_V2_IMAGE_FILENAMES = [
  'ember_visual_countdown_timer_category-v2.png.png',
  'ember_emotion_matching_tiles_category-v2.png.png',
  'ember_social_scripts_books_category-v2.png.png',
] as const;

export type DiscoverV2ImageMapping = {
  filename: string;
  publicUrl: string;
  matchedCategorySlug: string | null;
  matchedCategoryName: string | null;
  confidence: 'high' | 'medium' | 'low';
};

function stripExtensions(filename: string): string {
  let base = filename.split('/').pop() ?? filename;
  while (/\.(png|jpg|jpeg|webp)$/i.test(base)) {
    base = base.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  }
  return base;
}

/** Normalise filename stem for category matching. */
export function normaliseCategoryImageStem(filename: string): string {
  let stem = stripExtensions(filename).toLowerCase();
  if (stem.endsWith('-v2')) stem = stem.slice(0, -3);
  stem = stem.replace(/^ember_/, '');
  stem = stem.replace(/_category$/, '');
  const tokens = stem.split(/[_\s-]+/).filter(Boolean);
  const generic = new Set(['ember', 'category', 'image']);
  const filtered = tokens.filter((t) => !generic.has(t));
  if (filtered.length > 0 && filtered[0] === 'visual' && filtered.length > 1) {
    return filtered.join(' ');
  }
  return filtered.join(' ');
}

export function normaliseCategoryField(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugAliases(slug: string): string[] {
  const norm = slug.toLowerCase();
  const aliases = [norm];
  if (norm === 'visual_timer') aliases.push('visual_countdown_timer');
  if (norm === 'visual_countdown_timer') aliases.push('visual_timer');
  return aliases;
}

function matchConfidence(
  stem: string,
  category: Pick<GatewayCategoryTypePublic, 'slug' | 'name' | 'label'>
): 'high' | 'medium' | 'low' {
  const stemNorm = normaliseCategoryField(stem);
  const slugNorms = slugAliases(category.slug ?? '').map((s) => normaliseCategoryField(s.replace(/_/g, ' ')));
  const nameNorm = normaliseCategoryField(category.name || category.label);

  for (const slugNorm of slugNorms) {
    if (slugNorm && stemNorm === slugNorm) return 'high';
    if (slugNorm && stemNorm.replace(/\s/g, '') === slugNorm.replace(/\s/g, '')) return 'high';
  }
  if (nameNorm && stemNorm === nameNorm) return 'high';

  const stemTokens = stemNorm.split(/\s+/).filter((t) => t.length > 2);
  if (stemTokens.length > 0) {
    const hay = `${nameNorm} ${slugNorms.join(' ')}`;
    if (stemTokens.every((t) => hay.includes(t))) return 'high';
  }

  return 'low';
}

export function matchV2FilenameToCategory(
  filename: string,
  categories: GatewayCategoryTypePublic[]
): DiscoverV2ImageMapping & { categoryId: string | null } {
  const stem = normaliseCategoryImageStem(filename);
  let best: { category: GatewayCategoryTypePublic; confidence: 'high' | 'medium' | 'low' } | null = null;

  for (const category of categories) {
    const confidence = matchConfidence(stem, category);
    if (confidence === 'low') continue;
    if (!best || confidence === 'high') {
      best = { category, confidence };
      if (confidence === 'high') break;
    }
  }

  return {
    filename,
    publicUrl: '',
    matchedCategorySlug: best?.category.slug ?? null,
    matchedCategoryName: best?.category.name ?? best?.category.label ?? null,
    confidence: best?.confidence ?? 'low',
    categoryId: best?.category.id ?? null,
  };
}

export function getCategoryImagesPublicBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  return url ? `${url}/storage/v1/object/public/category_images` : null;
}

export async function fetchDiscoverV2ImageMappings(
  categories: GatewayCategoryTypePublic[]
): Promise<DiscoverV2ImageMapping[]> {
  const base = getCategoryImagesPublicBaseUrl();
  if (!base) return [];

  const mappings: DiscoverV2ImageMapping[] = [];
  for (const filename of DISCOVER_V2_IMAGE_FILENAMES) {
    const publicUrl = `${base}/${encodeURIComponent(filename)}`;
    try {
      const res = await fetch(publicUrl, { method: 'HEAD', next: { revalidate: 3600 } });
      if (!res.ok) continue;
    } catch {
      continue;
    }
    const match = matchV2FilenameToCategory(filename, categories);
    if (match.confidence !== 'high' || !match.categoryId) continue;
    mappings.push({
      filename,
      publicUrl,
      matchedCategorySlug: match.matchedCategorySlug,
      matchedCategoryName: match.matchedCategoryName,
      confidence: match.confidence,
    });
  }
  return mappings;
}

/** Cached v2 HEAD probes + mapping (public catalogue only). */
export function fetchDiscoverV2ImageMappingsCached(categories: GatewayCategoryTypePublic[]) {
  const idsKey = categories
    .map((c) => c.id)
    .sort()
    .join(',');
  return unstable_cache(
    () => fetchDiscoverV2ImageMappings(categories),
    ['discover-v2-image-mappings', idsKey],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: ['gateway-public'] }
  )();
}

export function applyCategoryImageOverrides(
  categories: GatewayCategoryTypePublic[],
  mappings: DiscoverV2ImageMapping[]
): GatewayCategoryTypePublic[] {
  if (!mappings.length) return categories;
  const byId = new Map<string, string>();
  for (const m of mappings) {
    const category = categories.find(
      (c) =>
        m.matchedCategorySlug &&
        (c.slug === m.matchedCategorySlug ||
          slugAliases(c.slug ?? '').includes(m.matchedCategorySlug))
    );
    if (category) byId.set(category.id, m.publicUrl);
  }
  return categories.map((c) => {
    const override = byId.get(c.id);
    return override ? { ...c, image_url: override } : c;
  });
}
