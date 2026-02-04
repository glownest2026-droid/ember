/**
 * Heuristic icon mapping for pick cards based on product name.
 * lucide-react, deterministic keyword matching.
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

function getPickIcon(productName: string): LucideIcon {
  const lower = (productName ?? '').toLowerCase();
  if (/\b(potty|toilet|bathroom)\b/.test(lower)) return Brush; // no Toilet in lucide
  if (/\b(vacuum|clean|cleaning)\b/.test(lower)) return Brush;
  if (/\b(paint|crayon|drawing|marker)\b/.test(lower)) return Paintbrush;
  if (/\b(pencil|pen)\b/.test(lower)) return Pencil;
  if (/\b(block|construction|build|lego)\b/.test(lower)) return Blocks;
  if (/\b(music|drum|band|guitar|piano)\b/.test(lower)) return Music;
  if (/\b(book|reading)\b/.test(lower)) return BookOpen;
  return Package;
}

export { getPickIcon };
