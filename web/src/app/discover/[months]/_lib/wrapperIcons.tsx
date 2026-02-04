/**
 * Deterministic icon for wrapper tiles. Fallback for "More" section.
 */
import {
  Pencil,
  HeartHandshake,
  Hand,
  Activity,
  CheckCircle2,
  MessageCircle,
  Theater,
  Puzzle,
  CalendarCheck2,
  Users,
  Blocks,
  Shapes,
  type LucideIcon,
} from 'lucide-react';

const SLUG_TO_ICON: Record<string, LucideIcon> = {
  'creative-expression-and-mark-making': Pencil,
  'emotional-regulation-and-self-awareness': HeartHandshake,
  'fine-motor-control-and-hand-coordination': Hand,
  'gross-motor-skills-and-physical-confidence': Activity,
  'independence-and-practical-skills': CheckCircle2,
  'language-development-and-communication': MessageCircle,
  'pretend-play-and-imagination': Theater,
  'problem-solving-and-cognitive-skills': Puzzle,
  'routine-understanding-and-cooperation': CalendarCheck2,
  'social-skills-and-peer-interaction': Users,
  'spatial-reasoning-and-construction-play': Blocks,
  'shapes-and-colours': Shapes,
  'shapes-and-colors': Shapes,
};

export function getWrapperIcon(uxSlug: string, uxLabel: string): LucideIcon {
  const slugNorm = (uxSlug ?? '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
  if (SLUG_TO_ICON[slugNorm]) return SLUG_TO_ICON[slugNorm];
  return Shapes;
}
