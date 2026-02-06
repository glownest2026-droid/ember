/**
 * Deterministic icon resolver for idea cards. ALWAYS returns an icon (never null).
 * Priority: category type → keyword on title → Sparkles fallback.
 * Never exclude products for missing images; use this icon for all products.
 */
import {
  BookOpen,
  Paintbrush,
  Pencil,
  Blocks,
  Music,
  Activity,
  Toilet,
  Brush,
  SprayCan,
  CookingPot,
  PawPrint,
  Puzzle,
  Package,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  BookOpen,
  Paintbrush,
  Pencil,
  Blocks,
  Music,
  Activity,
  Toilet,
  Brush,
  SprayCan,
  CookingPot,
  PawPrint,
  Puzzle,
  Package,
  Sparkles,
} as const;

export type IconKey = keyof typeof ICONS;
const DEFAULT_ICON: IconKey = 'Sparkles';

/** Manual overrides by product id for obvious mis-hits (25–27m band). Add UUIDs as needed. */
const ICON_OVERRIDES: Record<string, IconKey> = {
  // Add product UUIDs here, e.g. "uuid-here": "BookOpen",
};

export function iconForIdea(input: {
  title: string;
  categoryTypeLabel?: string | null;
  categoryTypeSlug?: string | null;
  productId?: string;
}): LucideIcon {
  const { title, categoryTypeLabel, categoryTypeSlug, productId } = input;
  if (productId && ICON_OVERRIDES[productId]) {
    return ICONS[ICON_OVERRIDES[productId]];
  }
  const text = [title, categoryTypeLabel, categoryTypeSlug].filter(Boolean).join(' ').toLowerCase();
  if (/\b(book|story|reading)\b/.test(text)) return BookOpen;
  if (/\b(paint|crayon|crayons|drawing|marker|finger.?paint|washable|jumbo)\b/.test(text)) return Paintbrush;
  if (/\b(pencil|pen)\b/.test(text)) return Pencil;
  if (/\b(block|construction|build|lego)\b/.test(text)) return Blocks;
  if (/\b(music|drum|piano|xylophone|band|guitar)\b/.test(text)) return Music;
  if (/\b(ball|throw|kick)\b/.test(text)) return Activity;
  if (/\b(potty|toilet|bathroom)\b/.test(text)) return Toilet;
  if (/\b(clean|vacuum|cleaning)\b/.test(text)) return SprayCan;
  if (/\b(pretend|kitchen|tea|cook)\b/.test(text)) return CookingPot;
  if (/\b(animals|farm|pet)\b/.test(text)) return PawPrint;
  if (/\b(puzzle|shape|sort)\b/.test(text)) return Puzzle;
  return ICONS[DEFAULT_ICON];
}

/** Product + optional category/need for icon. ALWAYS returns a LucideIcon (for cards with or without image). */
export function getProductIcon(
  product: { name: string; id?: string },
  categoryType?: { name?: string | null; label?: string | null; slug?: string | null } | null,
  _developmentNeed?: string | null
): LucideIcon {
  return iconForIdea({
    title: product.name,
    categoryTypeLabel: categoryType?.label ?? categoryType?.name ?? undefined,
    categoryTypeSlug: categoryType?.slug ?? undefined,
    productId: product.id,
  });
}
