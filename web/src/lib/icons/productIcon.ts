/**
 * Deterministic icon key for product album tiles (no DB backfill).
 * Maps focus doorway / wrapper to a Lucide icon name for image-less products.
 */
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Hand,
  MessageCircle,
  Sparkles,
  Users,
  Heart,
  CheckCircle2,
  Puzzle,
  Blocks,
  Shapes,
  CalendarCheck2,
  Pencil,
} from 'lucide-react';

export const DOORWAY_ICON_MAP: Record<string, LucideIcon> = {
  'burn-energy': Activity,
  'little-hands': Hand,
  'talk-understand': MessageCircle,
  'pretend-stories': Sparkles,
  'playing-with-others': Users,
  'big-feelings': Heart,
  'let-me-help': CheckCircle2,
  'do-it-myself': CheckCircle2,
  'figuring-things-out': Puzzle,
  'figure-it-out': Puzzle,
  'build-puzzles': Blocks,
  'shapes-colours': Shapes,
  'transitions': CalendarCheck2,
  'drawing-making': Pencil,
};

const SLUG_ALIASES: Record<string, string> = {
  'gross-motor-skills-and-physical-confidence': 'burn-energy',
  'fine-motor-control-and-hand-coordination': 'little-hands',
  'language-development-and-communication': 'talk-understand',
  'pretend-play-and-imagination': 'pretend-stories',
  'social-skills-and-peer-interaction': 'playing-with-others',
  'emotional-regulation-and-self-awareness': 'big-feelings',
  'independence-and-practical-life-skills': 'let-me-help',
  'problem-solving-and-cognitive-skills': 'figuring-things-out',
  'spatial-reasoning-and-construction-play': 'build-puzzles',
  'color-and-shape-recognition': 'shapes-colours',
  'routine-understanding-and-cooperation': 'transitions',
  'creative-expression-and-mark-making': 'drawing-making',
};

function normaliseSlug(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
}

export type ProductIconInput = {
  id?: string;
  /** Future: product.icon_key from DB */
  iconKey?: string | null;
};

/** Icon key type (primary slug keys used in map). */
export type ProductIconKey =
  | 'burn-energy'
  | 'little-hands'
  | 'talk-understand'
  | 'pretend-stories'
  | 'playing-with-others'
  | 'big-feelings'
  | 'let-me-help'
  | 'figuring-things-out'
  | 'build-puzzles'
  | 'shapes-colours'
  | 'transitions'
  | 'drawing-making';

/**
 * Returns the Lucide icon key for the given product and focus doorway.
 * Used for album tiles when product has no image. Pass wrapper slug or label.
 */
export function getProductIconKey(
  product: ProductIconInput,
  focusDoorwayLabelOrSlug?: string | null
): ProductIconKey {
  if (product.iconKey && product.iconKey in DOORWAY_ICON_MAP) {
    return product.iconKey as ProductIconKey;
  }
  const slug = focusDoorwayLabelOrSlug
    ? normaliseSlug(String(focusDoorwayLabelOrSlug).replace(/&/g, 'and'))
    : '';
  const resolved = SLUG_ALIASES[slug] ?? slug;
  if (!(resolved in DOORWAY_ICON_MAP)) return 'drawing-making';
  const primary: ProductIconKey =
    resolved === 'do-it-myself' ? 'let-me-help' : resolved === 'figure-it-out' ? 'figuring-things-out' : (resolved as ProductIconKey);
  return primary;
}

export function getProductIconComponent(key: ProductIconKey | string): LucideIcon {
  return DOORWAY_ICON_MAP[key] ?? DOORWAY_ICON_MAP['drawing-making'];
}
