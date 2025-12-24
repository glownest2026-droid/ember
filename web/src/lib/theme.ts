import { createClient } from '../utils/supabase/server';

export type ThemeSettings = {
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    muted?: string;
    border?: string;
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

<<<<<<< HEAD
export type RequiredThemeSettings = {
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
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

=======
>>>>>>> c8aa39b (feat(11c): theme v0 tokens with global apply and live preview)
const DEFAULT_THEME: RequiredThemeSettings = {
  colors: {
    primary: '#FFBEAB', // ember-400
    accent: '#FFC26E',  // apricot-400
    background: '#FFFCF8', // cream-50
    surface: '#FFFFFF',
    text: '#27303F', // ink
    muted: '#57534E', // stone-600
    border: '#D6D3D1', // stone-300
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

<<<<<<< HEAD
export function mergeTheme(partial?: ThemeSettings | null): RequiredThemeSettings {
=======
export function mergeTheme(partial?: ThemeSettings | null): Required<ThemeSettings> {
>>>>>>> c8aa39b (feat(11c): theme v0 tokens with global apply and live preview)
  if (!partial) return DEFAULT_THEME;

  return {
    colors: {
      primary: partial.colors?.primary || DEFAULT_THEME.colors.primary,
      accent: partial.colors?.accent || DEFAULT_THEME.colors.accent,
      background: partial.colors?.background || DEFAULT_THEME.colors.background,
      surface: partial.colors?.surface || DEFAULT_THEME.colors.surface,
      text: partial.colors?.text || DEFAULT_THEME.colors.text,
      muted: partial.colors?.muted || DEFAULT_THEME.colors.muted,
      border: partial.colors?.border || DEFAULT_THEME.colors.border,
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

