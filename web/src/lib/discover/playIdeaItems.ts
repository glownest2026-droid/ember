import type { PlayIdeaItem } from '@/components/discover/figma/DiscoverFigmaPlayCarousel';
import type { GatewayCategoryTypePublic } from '@/lib/pl/public';

export function wrapperPlayIdeasCacheKey(ageBandId: string | undefined, wrapperSlug: string): string {
  return `${ageBandId ?? 'none'}|${wrapperSlug}`;
}

export function categoryTypesToPlayIdeaItems(
  categoryTypes: GatewayCategoryTypePublic[],
  bandLabel: string
): PlayIdeaItem[] {
  return categoryTypes.map((ct) => ({
    id: ct.id,
    title: (ct.label || ct.name || 'Play idea').replace(/\s*\(e\.g\.[^)]+\)\s*/gi, ' ').trim(),
    description: (ct.rationale || ct.description || '').trim(),
    audienceLens: ct.audience_lens,
    scienceConnection: bandLabel,
    imageUrl: ct.image_url?.trim() || '',
  }));
}
