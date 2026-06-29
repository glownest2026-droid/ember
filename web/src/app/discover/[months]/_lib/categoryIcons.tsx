import {
  Activity,
  Blocks,
  BookOpen,
  CalendarCheck2,
  Eye,
  Hand,
  HeartHandshake,
  Layers,
  MessageCircle,
  Moon,
  Puzzle,
  Shield,
  Theater,
  type LucideIcon,
  Users,
  UtensilsCrossed,
} from 'lucide-react';

type CategoryIconRule = { test: RegExp; icon: LucideIcon };

const RULES: CategoryIconRule[] = [
  { test: /(book|story|read|word|naming|picture)/i, icon: BookOpen },
  { test: /(song|music|rhyme|dance)/i, icon: MessageCircle },
  { test: /(pretend|doll|teddy|kitchen|doctor|role)/i, icon: Theater },
  { test: /(puzzle|shape|sort|match|posting|latch|stack|peg|block)/i, icon: Puzzle },
  { test: /(ball|climb|crawl|push|pull|swing|walk|move)/i, icon: Activity },
  { test: /(grasp|hand|fine motor|thread|bead|scissor|screw)/i, icon: Hand },
  { test: /(food|feed|cup|spoon|taste|wean|snack|toothbrush)/i, icon: UtensilsCrossed },
  { test: /(potty|toilet|routine|handwashing|bathroom|training pants)/i, icon: CalendarCheck2 },
  { test: /(safe|safety|proof|monitor|sleep)/i, icon: Shield },
  { test: /(feel|emotion|social|turn|share|co.?op)/i, icon: HeartHandshake },
  { test: /(face|watch|tracking|hide|peek)/i, icon: Eye },
  { test: /(contain|in and out|nest|layer)/i, icon: Layers },
  { test: /(calm|settle|night|sleep)/i, icon: Moon },
  { test: /(question|talk|language|communication)/i, icon: MessageCircle },
  { test: /(play with others|peer|friend)/i, icon: Users },
];

export function getCategoryIcon(categorySlug: string, title: string, description: string): LucideIcon {
  const text = `${categorySlug} ${title} ${description}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.test.test(text)) return rule.icon;
  }
  return Blocks;
}
