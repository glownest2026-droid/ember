import { createClient } from '../utils/supabase/server';

export type ThemeSettings = {
  primary?: string;
  accent?: string;
  fontPair?: string;
};

const DEFAULT_THEME: ThemeSettings = {
  primary: '#FFBEAB', // ember-400 from globals.css
  accent: '#FFC26E',  // apricot-400 from globals.css
  fontPair: 'inter_plusjakarta',
};

export async function loadTheme(): Promise<ThemeSettings> {
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

    const theme = data.theme as ThemeSettings;
    return {
      primary: theme.primary || DEFAULT_THEME.primary,
      accent: theme.accent || DEFAULT_THEME.accent,
      fontPair: theme.fontPair || DEFAULT_THEME.fontPair,
    };
  } catch (err) {
    // Safe fallback on any error
    return DEFAULT_THEME;
  }
}

