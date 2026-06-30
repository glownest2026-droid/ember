import type { GatewayCategoryTypePublic } from '@/lib/pl/public';
import { GATEWAY_PUBLIC_REVALIDATE_SECONDS } from '@/lib/pl/gateway-cache';
import { unstable_cache } from 'next/cache';

/** Workbook/repo age band id → Storage filename token (e.g. 4-6m → 4_6m). */
export function ageBandIdToFileToken(ageBandId: string): string {
  return ageBandId.replace(/^age_/, '').replace(/-/g, '_');
}

/** Deterministic category image filenames in bucket `category_images`. */
export function categoryImageFilenames(slug: string, ageBandId: string): {
  ageScoped: string;
  global: string;
} {
  const token = ageBandIdToFileToken(ageBandId);
  return {
    ageScoped: `ember_${slug}_${token}_category.png`,
    global: `ember_${slug}_category.png`,
  };
}

export function getCategoryImagesPublicBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  return url ? `${url}/storage/v1/object/public/category_images` : null;
}

function hasManagedCategoryImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('/category_images/ember_') && url.endsWith('_category.png');
}

function isStockPhotoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return /unsplash|pexels|images\.unsplash/i.test(url);
}

/**
 * HEAD-probe Storage for age-scoped then global filenames when DB has no ember mapping.
 */
export async function resolveStorageCategoryImages(
  categories: Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'age_band_id' | 'image_url'>[]
): Promise<Map<string, string>> {
  const base = getCategoryImagesPublicBaseUrl();
  if (!base) return new Map();

  const out = new Map<string, string>();
  for (const category of categories) {
    if (hasManagedCategoryImage(category.image_url)) continue;
    if (category.image_url && !isStockPhotoUrl(category.image_url)) continue;

    const { ageScoped, global } = categoryImageFilenames(category.slug, category.age_band_id);
    for (const filename of [ageScoped, global]) {
      const publicUrl = `${base}/${encodeURIComponent(filename)}`;
      try {
        const res = await fetch(publicUrl, { method: 'HEAD', next: { revalidate: 3600 } });
        if (!res.ok) continue;
        out.set(category.id, publicUrl);
        break;
      } catch {
        continue;
      }
    }
  }
  return out;
}

export function applyStorageCategoryImages(
  categories: GatewayCategoryTypePublic[],
  storageUrls: Map<string, string>
): GatewayCategoryTypePublic[] {
  if (!storageUrls.size) return categories;
  return categories.map((c) => {
    const override = storageUrls.get(c.id);
    return override ? { ...c, image_url: override } : c;
  });
}

/**
 * Build deterministic Storage URLs for category cards (no HEAD probes).
 * DiscoverFigmaImage shows a placeholder when the asset is missing.
 */
export function applyDeterministicStorageCategoryImages(
  categories: GatewayCategoryTypePublic[]
): GatewayCategoryTypePublic[] {
  const base = getCategoryImagesPublicBaseUrl();
  if (!base) return categories;

  return categories.map((category) => {
    if (hasManagedCategoryImage(category.image_url)) return category;
    if (category.image_url && !isStockPhotoUrl(category.image_url)) return category;

    const { ageScoped } = categoryImageFilenames(category.slug, category.age_band_id);
    return { ...category, image_url: `${base}/${encodeURIComponent(ageScoped)}` };
  });
}

/** Cached Storage HEAD probes for deterministic filenames. */
export function resolveStorageCategoryImagesCached(
  categories: Pick<GatewayCategoryTypePublic, 'id' | 'slug' | 'age_band_id' | 'image_url'>[]
) {
  const key = categories
    .map((c) => `${c.id}:${c.slug}:${c.age_band_id}:${c.image_url ?? ''}`)
    .sort()
    .join('|');
  return unstable_cache(
    () => resolveStorageCategoryImages(categories),
    ['discover-storage-category-images', key],
    { revalidate: GATEWAY_PUBLIC_REVALIDATE_SECONDS, tags: ['gateway-public'] }
  )();
}
