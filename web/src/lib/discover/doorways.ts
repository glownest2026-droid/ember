/**
 * Doorways: 12 development needs, 6 shown by default + "See all" for the rest.
 * 1:1 mapping to existing gateway wrapper slugs (pl_need_ux_labels / gateway views).
 */
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Hand,
  MessageCircle,
  Theater,
  Users,
  HeartHandshake,
  CheckCircle2,
  Puzzle,
  Blocks,
  Shapes,
  CalendarCheck2,
  Pencil,
} from 'lucide-react';

export type DoorwayDef = {
  key: string;
  label: string;
  /** Helper text shown under label (line-clamp-2) */
  helper: string;
  icon: LucideIcon;
  /** Primary gateway wrapper slug (pl_need_ux_labels style) */
  wrapperSlug: string;
  /** Alternate slugs for matching (e.g. pl_development_needs.slug when gateway uses that) */
  alternateSlugs?: string[];
};

/** All 12 doorways in order. First 6 = default visible; 7–12 = behind "See all". */
export const ALL_DOORWAYS: DoorwayDef[] = [
  {
    key: 'burn-energy',
    label: 'Burn energy',
    helper: 'Running, climbing, jumping — getting steadier on their feet.',
    icon: Activity,
    wrapperSlug: 'burn-energy',
    alternateSlugs: ['gross-motor-skills-and-physical-confidence'],
  },
  {
    key: 'little-hands',
    label: 'Little hands',
    helper: 'Twisting, turning, posting, stacking — using both hands together.',
    icon: Hand,
    wrapperSlug: 'little-hands',
    alternateSlugs: ['fine-motor-control-and-hand-coordination'],
  },
  {
    key: 'talk-understand',
    label: 'Talk & understand',
    helper: 'New words, little sentences — telling you what they want.',
    icon: MessageCircle,
    wrapperSlug: 'talk-understand',
    alternateSlugs: ['language-development-and-communication'],
  },
  {
    key: 'make-believe',
    label: 'Make-believe',
    helper: 'Copying you, role-play, little stories.',
    icon: Theater,
    wrapperSlug: 'pretend-stories',
    alternateSlugs: ['pretend-play-and-imagination'],
  },
  {
    key: 'play-with-others',
    label: 'Play with others',
    helper: 'Taking turns, watching other kids, learning to share.',
    icon: Users,
    wrapperSlug: 'playing-with-others',
    alternateSlugs: ['social-skills-and-peer-interaction'],
  },
  {
    key: 'big-feelings',
    label: 'Big feelings',
    helper: 'Learning to cope with frustration, excitement, disappointment.',
    icon: HeartHandshake,
    wrapperSlug: 'big-feelings',
    alternateSlugs: ['emotional-regulation-and-self-awareness'],
  },
  {
    key: 'do-it-myself',
    label: 'Do it myself',
    helper: 'Helping out, feeding themselves, trying to do it solo.',
    icon: CheckCircle2,
    wrapperSlug: 'let-me-help',
    alternateSlugs: ['independence-and-practical-life-skills'],
  },
  {
    key: 'figure-it-out',
    label: 'Figure it out',
    helper: 'Working things out, following simple instructions, trying again.',
    icon: Puzzle,
    wrapperSlug: 'figuring-things-out',
    alternateSlugs: ['problem-solving-and-cognitive-skills'],
  },
  {
    key: 'build-puzzles',
    label: 'Build & puzzles',
    helper: 'Blocks, fitting pieces, building simple structures.',
    icon: Blocks,
    wrapperSlug: 'build-puzzles',
    alternateSlugs: ['spatial-reasoning-and-construction-play'],
  },
  {
    key: 'shapes-colours',
    label: 'Shapes & colours',
    helper: 'Spotting and naming colours, matching simple shapes.',
    icon: Shapes,
    wrapperSlug: 'shapes-colours',
    alternateSlugs: ['color-and-shape-recognition'],
  },
  {
    key: 'daily-routines',
    label: 'Daily routines',
    helper: 'Knowing what comes next, helping with tidy-up and transitions.',
    icon: CalendarCheck2,
    wrapperSlug: 'transitions',
    alternateSlugs: ['routine-understanding-and-cooperation'],
  },
  {
    key: 'drawing-making',
    label: 'Drawing & making',
    helper: 'Scribbles, paint, messy play — expressing themselves.',
    icon: Pencil,
    wrapperSlug: 'drawing-making',
    alternateSlugs: ['creative-expression-and-mark-making'],
  },
];

/** First 6 doorways (shown by default). */
export const DEFAULT_DOORWAYS = ALL_DOORWAYS.slice(0, 6);

/** Doorways 7–12 (behind "See all"). */
export const MORE_DOORWAYS = ALL_DOORWAYS.slice(6, 12);

/** Keys that get a "Suggested" pill for age band 25–27m. */
export const SUGGESTED_DOORWAY_KEYS_25_27 = ['do-it-myself', 'big-feelings', 'little-hands'];

/** Default selected doorway slug for 25–27m (Do it myself). */
export const DEFAULT_WRAPPER_SLUG_25_27 = 'let-me-help';

/** Slug normalisation for matching gateway wrappers */
export function normaliseSlug(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
}

/** Resolve doorway to wrapper for age band. Matches primary or alternate slugs (gateway may use UX or need slugs). */
export function resolveDoorwayToWrapper(
  doorway: DoorwayDef,
  wrappers: { ux_slug: string }[]
): { ux_slug: string; ux_label: string } | null {
  const candidates = [doorway.wrapperSlug, ...(doorway.alternateSlugs ?? [])].map(normaliseSlug);
  const w = wrappers.find((x) => candidates.includes(normaliseSlug(x.ux_slug)));
  return w ? { ux_slug: w.ux_slug, ux_label: (w as { ux_slug: string; ux_label?: string }).ux_label ?? doorway.label } : null;
}

/** @deprecated Use DEFAULT_DOORWAYS for first 6; ALL_DOORWAYS for full list. */
export const TODAY_DOORWAYS = DEFAULT_DOORWAYS;
