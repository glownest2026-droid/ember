/**
 * Deterministic icon mapping for wrapper tiles (lucide-react).
 * Keyed by ux_slug (preferred) or ux_label. No runtime guessing.
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

const LABEL_TO_ICON: Record<string, LucideIcon> = {
  'Drawing & making': Pencil,
  'Big feelings': HeartHandshake,
  'Little hands': Hand,
  'Burn energy': Activity,
  'Do it myself': CheckCircle2,
  'Language development and communication': MessageCircle,
  'Pretend play and imagination': Theater,
  'Problem-solving and cognitive skills': Puzzle,
  'Routine understanding and cooperation': CalendarCheck2,
  'Social skills and peer interaction': Users,
  'Spatial reasoning and construction play': Blocks,
  'Shapes & colours': Shapes,
};

export function getWrapperIcon(uxSlug: string, uxLabel: string): LucideIcon {
  const slugNorm = (uxSlug ?? '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-');
  if (SLUG_TO_ICON[slugNorm]) return SLUG_TO_ICON[slugNorm];
  if (LABEL_TO_ICON[uxLabel]) return LABEL_TO_ICON[uxLabel];
  return Shapes;
}
