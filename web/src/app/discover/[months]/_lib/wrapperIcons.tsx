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
  Footprints,
  Eye,
  Layers,
  Apple,
  UtensilsCrossed,
  Shield,
  BookOpen,
  CalendarDays,
  Smile,
  Mic,
  HandMetal,
  CloudMoon,
  Milk,
  Moon,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

const SLUG_TO_ICON: Record<string, LucideIcon> = {
  'burn-energy': Activity,
  'little-hands': Hand,
  'talk-understand': MessageCircle,
  'pretend-stories': Theater,
  'playing-with-others': Users,
  'big-feelings': HeartHandshake,
  'let-me-help': CheckCircle2,
  'figuring-things-out': Puzzle,
  'build-puzzles': Blocks,
  'shapes-colours': Shapes,
  transitions: CalendarCheck2,
  social_emotional: Users,
  'social-emotional': Users,
  self_care_independence: CheckCircle2,
  'self-care-independence': CheckCircle2,
  fine_motor: Hand,
  'fine-motor': Hand,
  gross_motor: Activity,
  'gross-motor': Activity,
  language_communication: MessageCircle,
  'language-communication': MessageCircle,
  cognitive_problem_solving: Puzzle,
  'cognitive-problem-solving': Puzzle,
  toileting: CalendarCheck2,
  'creative-expression-and-mark-making': Pencil,
  'emotional-regulation-and-self-awareness': HeartHandshake,
  'emotions-and-feelings': HeartHandshake,
  'fine-motor-control-and-hand-coordination': Hand,
  'gross-motor-skills-and-physical-confidence': Activity,
  'gross-motor-and-active-play': Activity,
  'independence-and-practical-skills': CheckCircle2,
  'toilet-training': CalendarCheck2,
  'toilet-training-and-independence': CalendarCheck2,
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
  // 6–9m pilot clusters
  cluster_sitting_reaching: Hand,
  cluster_crawling_floor: Footprints,
  cluster_object_permanence: Eye,
  cluster_stacking_containment: Layers,
  cluster_mouth_sensory: Apple,
  cluster_first_foods: UtensilsCrossed,
  cluster_home_safety: Shield,
  cluster_books_sounds: BookOpen,
  // 9–12m pilot clusters
  ent_cluster_move: Footprints,
  ent_cluster_hands: Hand,
  ent_cluster_solve: Puzzle,
  ent_cluster_words: MessageCircle,
  ent_cluster_feeding: UtensilsCrossed,
  ent_cluster_safety: Shield,
  ent_cluster_stories: BookOpen,
  ent_cluster_days: CalendarDays,
  // 1–3m pilot clusters
  ent_cluster_faces_smiles_chats: Smile,
  ent_cluster_listen_and_coo: Mic,
  ent_cluster_watching_tracking: Eye,
  ent_cluster_tummy_head_control: Activity,
  ent_cluster_kicks_wriggles: Footprints,
  ent_cluster_first_grasps: HandMetal,
  ent_cluster_calm_crying_settling: CloudMoon,
  ent_cluster_feeding_clean_kit: Milk,
  ent_cluster_safe_sleep_setup: Moon,
  ent_cluster_health_first_trips: Stethoscope,
};

const LABEL_PATTERNS: { test: RegExp; icon: LucideIcon }[] = [
  // Brand voice (1–3m pilot)
  { test: /finding your face|i.?m finding your face/i, icon: Smile },
  { test: /listening to your voice|listening to familiar/i, icon: Mic },
  { test: /watching the world|i.?m watching/i, icon: Eye },
  { test: /stronger on my tummy|getting stronger on my tummy/i, icon: Activity },
  { test: /starting to wriggle|i.?m starting to wriggle/i, icon: Footprints },
  { test: /hands are waking up|hands waking up/i, icon: HandMetal },
  { test: /settle and reconnect|crying, comfort/i, icon: CloudMoon },
  { test: /feeds calm and clean|calm feeds and clean/i, icon: Milk },
  { test: /sleep feel safe|safer sleep made simple/i, icon: Moon },
  { test: /first trips|keep first trips simpler/i, icon: Stethoscope },
  // Brand voice (6–9m / 9–12m pilot)
  { test: /i can sit and reach/i, icon: Hand },
  { test: /getting ready to move/i, icon: Footprints },
  { test: /hide and come back|things can hide/i, icon: Eye },
  { test: /putting things in, out and together/i, icon: Layers },
  { test: /everything goes in my mouth/i, icon: Apple },
  { test: /getting ready for first tastes|first tastes/i, icon: UtensilsCrossed },
  { test: /starting to get everywhere|suddenly into everything/i, icon: Shield },
  { test: /listening, copying|joining in/i, icon: BookOpen },
  { test: /hands can do more/i, icon: Hand },
  { test: /finding things out/i, icon: Puzzle },
  { test: /learning to tell you/i, icon: MessageCircle },
  { test: /noticing faces and feelings/i, icon: Users },
  { test: /good little moment/i, icon: CalendarDays },
  // Legacy labels (other bands)
  { test: /sitting up|reaching for toys/i, icon: Hand },
  { test: /ready to crawl|crawling|on the move/i, icon: Footprints },
  { test: /hidden things|making things happen|figuring out/i, icon: Eye },
  { test: /putting things in|stacking|nesting/i, icon: Layers },
  { test: /chew|mouth|sensory/i, icon: Apple },
  { test: /solids|feeding themselves|feed themselves/i, icon: UtensilsCrossed },
  { test: /home safer|babyproofing|safer for a moving/i, icon: Shield },
  { test: /books|songs|back-and-forth|stories, faces/i, icon: BookOpen },
  { test: /busy little hands/i, icon: Hand },
  { test: /chats|claps|signs/i, icon: MessageCircle },
  { test: /fill the day/i, icon: CalendarDays },
  // Spine v2 toddler bands (19-33m) refreshed voice
  { test: /finding my words|words everywhere|talk|pointing/i, icon: MessageCircle },
  { test: /copying everyday life|pretend|role.?play/i, icon: Theater },
  { test: /busy little hands|hands are busy|hands can do more/i, icon: Hand },
  { test: /moving with purpose|bigger moves|move|climb/i, icon: Activity },
  { test: /playing with others|play with others|turn.?taking|sharing/i, icon: Users },
  { test: /potty|toilet|bathroom|teeth|body routines/i, icon: CalendarCheck2 },
  { test: /figuring things out|problem solving/i, icon: Puzzle },
  { test: /doing it myself|do it myself|independence/i, icon: CheckCircle2 },
  { test: /settle|calm|big feelings|emotions/i, icon: HeartHandshake },
  { test: /play with other|social emotional|big feelings|feelings/i, icon: Users },
  { test: /doing more by myself|independence|myself|let me help/i, icon: CheckCircle2 },
  { test: /hands can|fine motor|little hands/i, icon: Hand },
  { test: /bigger moves|gross motor|physical|burn energy/i, icon: Activity },
  { test: /more to say|talk|language|understand/i, icon: MessageCircle },
  { test: /make.believe|pretend|stories/i, icon: Theater },
  { test: /figuring things|cognitive|problem/i, icon: Puzzle },
  { test: /build|puzzle|blocks/i, icon: Blocks },
  { test: /shapes|colou?rs/i, icon: Shapes },
  { test: /routine|transition|daily/i, icon: CalendarCheck2 },
  { test: /draw|making|mark/i, icon: Pencil },
];

function slugLookupKeys(uxSlug: string): string[] {
  const raw = (uxSlug ?? '').toLowerCase().trim();
  if (!raw) return [];
  const hyphen = raw.replace(/\s+/g, '-').replace(/_/g, '-');
  const underscore = raw.replace(/\s+/g, '_').replace(/-/g, '_');
  return [...new Set([raw, hyphen, underscore])];
}

export function getWrapperIcon(uxSlug: string, uxLabel: string): LucideIcon {
  for (const key of slugLookupKeys(uxSlug)) {
    const icon = SLUG_TO_ICON[key];
    if (icon) return icon;
  }
  const label = (uxLabel ?? '').toLowerCase();
  const slug = (uxSlug ?? '').toLowerCase().replace(/[_-]+/g, ' ');
  const combined = `${slug} ${label}`;
  for (const { test, icon } of LABEL_PATTERNS) {
    if (test.test(combined)) return icon;
  }
  return Shapes;
}
