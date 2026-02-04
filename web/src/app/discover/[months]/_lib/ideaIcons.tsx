/**
 * Deterministic idea card icon by product title. ALWAYS returns an icon component (never null).
 */
import {
  Paintbrush,
  Pencil,
  Blocks,
  Music,
  BookOpen,
  Package,
  Brush,
  type LucideIcon,
} from 'lucide-react';

const ICON_COLOR = '#5C646D';
const ICON_SIZE = 16;
const ICON_STROKE = 1.5;

export function ideaIconForTitle(title: string): LucideIcon {
  const lower = (title ?? '').toLowerCase();
  if (/\b(potty|toilet|bathroom)\b/.test(lower)) return Brush;
  if (/\b(vacuum|clean|cleaning)\b/.test(lower)) return Brush;
  if (/\b(paint|crayon|drawing|marker)\b/.test(lower)) return Paintbrush;
  if (/\b(pencil|pen)\b/.test(lower)) return Pencil;
  if (/\b(block|construction|build|lego)\b/.test(lower)) return Blocks;
  if (/\b(music|drum|band|guitar|piano)\b/.test(lower)) return Music;
  if (/\b(book|story|reading)\b/.test(lower)) return BookOpen;
  return Package;
}

export const ideaIconProps = { size: ICON_SIZE, strokeWidth: ICON_STROKE, color: ICON_COLOR };
