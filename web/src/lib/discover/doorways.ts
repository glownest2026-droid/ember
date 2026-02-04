/**
 * Today doorways: 6 primary focus tiles + mapping to gateway wrapper slugs.
 * Maps parent-first labels to existing gateway wrappers (development needs).
 */
import type { LucideIcon } from 'lucide-react';
import { Activity, Hand, HeartHandshake, CheckCircle2, MessageCircle, Users } from 'lucide-react';

export type DoorwayDef = {
  key: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  /** Preferred wrapper slug from gateway; if missing for age band, tile shows "Coming soon" */
  wrapperSlug: string;
};

/** First 6 "Today" doorways (shown by default) */
export const TODAY_DOORWAYS: DoorwayDef[] = [
  { key: 'burn-energy', label: 'Burn energy', subtitle: 'Active play', icon: Activity, wrapperSlug: 'gross-motor-skills-and-physical-confidence' },
  { key: 'quiet-focus', label: 'Quiet focus', subtitle: 'Calm concentration', icon: Hand, wrapperSlug: 'fine-motor-control-and-hand-coordination' },
  { key: 'big-feelings', label: 'Big feelings', subtitle: 'Emotions & confidence', icon: HeartHandshake, wrapperSlug: 'emotional-regulation-and-self-awareness' },
  { key: 'let-me-help', label: 'Let me help', subtitle: 'Independence', icon: CheckCircle2, wrapperSlug: 'independence-and-practical-skills' },
  { key: 'talk-stories', label: 'Talk & stories', subtitle: 'Language & reading', icon: MessageCircle, wrapperSlug: 'language-development-and-communication' },
  { key: 'play-together', label: 'Play together', subtitle: 'Social fun', icon: Users, wrapperSlug: 'social-skills-and-peer-interaction' },
];

/** Slug normalisation for matching gateway wrappers */
export function normaliseSlug(s: string): string {
  return (s ?? '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
}

/** Resolve doorway to wrapper for age band. Returns wrapper if available, else null (Coming soon). */
export function resolveDoorwayToWrapper(
  doorway: DoorwayDef,
  wrappers: { ux_slug: string }[]
): { ux_slug: string; ux_label: string } | null {
  const want = normaliseSlug(doorway.wrapperSlug);
  const w = wrappers.find((x) => normaliseSlug(x.ux_slug) === want);
  return w ? { ux_slug: w.ux_slug, ux_label: (w as { ux_slug: string; ux_label?: string }).ux_label ?? doorway.label } : null;
}
