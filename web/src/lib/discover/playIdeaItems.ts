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
    title: ((ct.product_family_label || ct.label || ct.name || 'Play idea') as string)
      .replace(/\s*\(e\.g\.[^)]+\)\s*/gi, ' ')
      .trim(),
    description: (ct.rationale || ct.description || '').trim(),
    audienceLens: ct.audience_lens,
    scienceConnection: bandLabel,
    imageUrl: ct.image_url?.trim() || '',
    uiLane: ct.ui_lane,
    contentType: ct.content_type,
    showEmberPicks: ct.show_ember_picks,
    showGiftAction: ct.show_gift_action,
    giftFriendly: ct.gift_friendly,
    buyerModeLabel: ct.buyer_mode_label,
    giftNote: ct.gift_note,
    ownershipNote: ct.ownership_note,
    cardCtaLabel: ct.card_cta_label,
    renderRule: ct.render_rule,
    laneRank: ct.lane_rank,
    categoryRank: ct.rank,
  }));
}
