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
  social_emotional: Users,
  self_care_independence: CheckCircle2,
  fine_motor: Hand,
  gross_motor: Activity,
  language_communication: MessageCircle,
  cognitive_problem_solving: Puzzle,
  toileting: CalendarCheck2,
  'creative-expression-and-mark-making': Pencil,
  'emotional-regulation-and-self-awareness': HeartHandshake,
  'emotions-and-feelings': HeartHandshake,
  'fine-motor-control-and-hand-coordination': Hand,
  'gross-motor-skills-and-physical-confidence': Activity,
  'gross-motor-and-active-play': Activity,
  'independence-and-practical-skills': CheckCircle2,
  'toilet-training': CheckCircle2,
  'toilet-training-and-independence': CheckCircle2,
  'language-development-and-communication': MessageCircle,
  'language-and-questions': MessageCircle,
  'language-and-curiosity': MessageCircle,
  'pretend-play-and-imagination': Theater,
  'pretend-and-social-play': Theater,
  'pretend-and-peer-play': Theater,
  'problem-solving-and-cognitive-skills': Puzzle,
  'early-stem-and-spatial': Puzzle,
  'early-stem-and-matching': Puzzle,
  'routine-understanding-and-cooperation': CalendarCheck2,
  'transitions-and-emotions': CalendarCheck2,
  'visual-timers-and-transition-tools': CalendarCheck2,
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
