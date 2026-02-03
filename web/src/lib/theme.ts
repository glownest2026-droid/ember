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

// Helper to slightly lighten a color for gradient (10% lighter)
function lightenColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 0.1;
  return `#${Math.round(Math.min(255, rgb.r + (255 - rgb.r) * factor)).toString(16).padStart(2, '0')}${Math.round(Math.min(255, rgb.g + (255 - rgb.g) * factor)).toString(16).padStart(2, '0')}${Math.round(Math.min(255, rgb.b + (255 - rgb.b) * factor)).toString(16).padStart(2, '0')}`;
}

export type ThemeSettings = {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string; // Legacy: will be migrated to background1/2
    background1?: string;
    background2?: string;
    surface?: string;
    section?: string; // Legacy: will be migrated to section1/2
    section1?: string;
    section2?: string;
    text?: string;
    muted?: string;
    border?: string;
    primaryForeground?: string;
    accentForeground?: string;
    scrollbarThumb?: string;
  };
  typography?: {
    fontHeading?: string; // Legacy: maps to fontHeading in v1
    fontSubheading?: string;
    fontBody?: string; // Legacy: maps to fontBody in v1
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
    background1: string;
    background2: string;
    surface: string;
    section1: string;
    section2: string;
    text: string;
    muted: string;
    border: string;
    primaryForeground: string;
    accentForeground: string;
    scrollbarThumb: string;
  };
  typography: {
    fontHeading: string;
    fontSubheading: string;
    fontBody: string;
    baseFontSize: number;
  };
  components: {
    radius: number;
  };
};

/* Brandbook: Ember Modernist palette — deeper premium orange, Deep Slate text */
export const DEFAULT_THEME: RequiredThemeSettings = {
  colors: {
    primary: '#FF6347', // ember-accent-base (Ember Orange CTAs)
    accent: '#B8432B',  // ember-accent-hover (interaction feedback)
    background1: '#FAFAFA', // ember-bg-canvas (Paper White)
    background2: '#FFFFFF', // ember-surface-primary
    surface: '#FFFFFF',
    section1: '#F1F3F2', // ember-surface-soft
    section2: '#FAFAFA',
    text: '#1A1E23', // ember-text-high (Deep Slate)
    muted: '#5C646D', // ember-text-low
    border: '#E5E7EB', // ember-border-subtle
    primaryForeground: '#FFFFFF',
    accentForeground: '#FFFFFF',
    scrollbarThumb: '#E5E7EB',
  },
  typography: {
    fontHeading: 'sourceserif4_inter', // Brandbook: Serif for headlines
    fontSubheading: 'sourceserif4_inter', // H2 Serif
    fontBody: 'inter_inter', // Inter for body, nav, buttons
    baseFontSize: 16,
  },
  components: {
    radius: 8, // Brandbook: radius-8 chips/buttons
  },
};

export function mergeTheme(partial?: ThemeSettings | null): RequiredThemeSettings {
  if (!partial) return DEFAULT_THEME;

  const mergedPrimary = partial.colors?.primary || DEFAULT_THEME.colors.primary;
  const mergedAccent = partial.colors?.accent || DEFAULT_THEME.colors.accent;

  // Backwards compatibility: migrate old single background to gradient pair
  let background1 = partial.colors?.background1;
  let background2 = partial.colors?.background2;
  if (!background1 && partial.colors?.background) {
    background1 = partial.colors.background;
    background2 = lightenColor(partial.colors.background);
  }
  if (!background1) background1 = DEFAULT_THEME.colors.background1;
  if (!background2) background2 = DEFAULT_THEME.colors.background2;

  // Backwards compatibility: migrate old single section to gradient pair
  let section1 = partial.colors?.section1;
  let section2 = partial.colors?.section2;
  if (!section1 && partial.colors?.section) {
    section1 = partial.colors.section;
    section2 = lightenColor(partial.colors.section);
  }
  if (!section1) section1 = DEFAULT_THEME.colors.section1;
  if (!section2) section2 = DEFAULT_THEME.colors.section2;

  // Backwards compatibility: migrate old typography to 3-tier
  let fontHeading = partial.typography?.fontHeading || DEFAULT_THEME.typography.fontHeading;
  let fontSubheading = partial.typography?.fontSubheading;
  let fontBody = partial.typography?.fontBody || DEFAULT_THEME.typography.fontBody;
  
  // If old schema had fontHeading but no fontSubheading, use fontHeading for both
  if (!fontSubheading) {
    fontSubheading = fontHeading;
  }

  return {
    colors: {
      primary: mergedPrimary,
      accent: mergedAccent,
      background1,
      background2,
      surface: partial.colors?.surface || DEFAULT_THEME.colors.surface,
      section1,
      section2,
      text: partial.colors?.text || DEFAULT_THEME.colors.text,
      muted: partial.colors?.muted || DEFAULT_THEME.colors.muted,
      border: partial.colors?.border || DEFAULT_THEME.colors.border,
      primaryForeground: partial.colors?.primaryForeground || pickForeground(mergedPrimary),
      accentForeground: partial.colors?.accentForeground || pickForeground(mergedAccent),
      scrollbarThumb: partial.colors?.scrollbarThumb || partial.colors?.border || DEFAULT_THEME.colors.scrollbarThumb,
    },
    typography: {
      fontHeading,
      fontSubheading,
      fontBody,
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

    // If error (e.g., RLS blocks anonymous access) or no data, use default
    // This ensures branding works for logged-out users
    if (error || !data?.theme) {
      return DEFAULT_THEME;
    }

    return mergeTheme(data.theme as ThemeSettings);
  } catch (err) {
    // Safe fallback on any error (network, RLS, etc.)
    // Always return DEFAULT_THEME so CSS variables are set
    return DEFAULT_THEME;
  }
}

