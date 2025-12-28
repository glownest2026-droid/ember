import { createClient } from '../utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

// Helper to determine if a hex color is light
function isLight(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Pick appropriate foreground color based on background
function pickForeground(backgroundColor: string): string {
  return isLight(backgroundColor) ? '#111111' : '#FFFFFF';
}

export type ThemeSettings = {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    section?: string;
    text?: string;
    muted?: string;
    border?: string;
    primaryForeground?: string;
    accentForeground?: string;
    scrollbarThumb?: string;
  };
  typography?: {
    fontHeading?: string;
    fontBody?: string;
    baseFontSize?: number;
  };
  components?: {
    radius?: number;
  };
};

export type RequiredThemeSettings = {
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    section: string;
    text: string;
    muted: string;
    border: string;
    primaryForeground: string;
    accentForeground: string;
    scrollbarThumb: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    baseFontSize: number;
  };
  components: {
    radius: number;
  };
};

export const DEFAULT_THEME: RequiredThemeSettings = {
  colors: {
    primary: '#FFBEAB', // ember-400
    accent: '#FFC26E',  // apricot-400
    background: '#FFFCF8', // cream-50
    surface: '#FFFFFF',
    section: '#FFF8F0', // slightly tinted variant of background
    text: '#27303F', // ink
    muted: '#57534E', // stone-600
    border: '#D6D3D1', // stone-300
    primaryForeground: pickForeground('#FFBEAB'),
    accentForeground: pickForeground('#FFC26E'),
    scrollbarThumb: '#D6D3D1', // same as border for subtlety
  },
  typography: {
    fontHeading: 'inter_plusjakarta',
    fontBody: 'inter_plusjakarta',
    baseFontSize: 16,
  },
  components: {
    radius: 12,
  },
};

export function mergeTheme(partial?: ThemeSettings | null): RequiredThemeSettings {
  if (!partial) return DEFAULT_THEME;

  const mergedPrimary = partial.colors?.primary || DEFAULT_THEME.colors.primary;
  const mergedAccent = partial.colors?.accent || DEFAULT_THEME.colors.accent;

  return {
    colors: {
      primary: mergedPrimary,
      accent: mergedAccent,
      background: partial.colors?.background || DEFAULT_THEME.colors.background,
      surface: partial.colors?.surface || DEFAULT_THEME.colors.surface,
      section: partial.colors?.section || partial.colors?.background || DEFAULT_THEME.colors.section,
      text: partial.colors?.text || DEFAULT_THEME.colors.text,
      muted: partial.colors?.muted || DEFAULT_THEME.colors.muted,
      border: partial.colors?.border || DEFAULT_THEME.colors.border,
      primaryForeground: partial.colors?.primaryForeground || pickForeground(mergedPrimary),
      accentForeground: partial.colors?.accentForeground || pickForeground(mergedAccent),
      scrollbarThumb: partial.colors?.scrollbarThumb || partial.colors?.border || DEFAULT_THEME.colors.scrollbarThumb,
    },
    typography: {
      fontHeading: partial.typography?.fontHeading || DEFAULT_THEME.typography.fontHeading,
      fontBody: partial.typography?.fontBody || DEFAULT_THEME.typography.fontBody,
      baseFontSize: partial.typography?.baseFontSize || DEFAULT_THEME.typography.baseFontSize,
    },
    components: {
      radius: partial.components?.radius || DEFAULT_THEME.components.radius,
    },
  };
}

export async function loadTheme(): Promise<RequiredThemeSettings> {
  noStore(); // Prevent caching to ensure fresh theme data
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('theme')
      .eq('id', 'global')
      .single();

    if (error || !data?.theme) {
      return DEFAULT_THEME;
    }

    return mergeTheme(data.theme as ThemeSettings);
  } catch (err) {
    // Safe fallback on any error
    return DEFAULT_THEME;
  }
}

