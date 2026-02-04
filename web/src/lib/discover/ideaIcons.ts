/**
 * Deterministic icon resolver for idea cards. ALWAYS returns an icon (never null).
 * Keyword mapping on title + optional category. Product ID overrides for mis-hits.
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
} as const;

export type IconKey = keyof typeof ICONS;
const DEFAULT_ICON: IconKey = 'Package';

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
  if (/\b(paint|crayon|drawing|marker)\b/.test(text)) return Paintbrush;
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
