import { Inter, Plus_Jakarta_Sans, DM_Sans, Space_Grotesk, Nunito, Source_Sans_3, Manrope, Work_Sans, Lexend, Outfit, Fraunces, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import { loadTheme } from '../lib/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSerif4 = Source_Serif_4({ subsets: ['latin'], variable: '--font-sourceserif4' });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-ibmplexmono' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plusjakarta' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dmsans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-spacegrotesk' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-nunito' });
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sourcesans' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-manrope' });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-worksans' });
const lexend = Lexend({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-lexend' });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-outfit' });
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-fraunces' });

export const dynamic = 'force-dynamic';

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always load theme, fallback to DEFAULT_THEME if database query fails
  // This ensures branding works for logged-out users (RLS may block anonymous access)
  let theme;
  try {
    theme = await loadTheme();
  } catch (err) {
    // If loadTheme throws (shouldn't happen due to internal try-catch, but be defensive)
    // Import DEFAULT_THEME directly as fallback
    const { DEFAULT_THEME: fallbackTheme } = await import('../lib/theme');
    theme = fallbackTheme;
  }

  // Map font pairs to CSS variable names
  const fontPairMap: Record<string, { body: string; head: string }> = {
    sourceserif4_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-sourceserif4)',
    },
    inter_plusjakarta: {
      body: 'var(--font-inter)',
      head: 'var(--font-plusjakarta)',
    },
    dmsans_inter: {
      body: 'var(--font-dmsans)',
      head: 'var(--font-inter)',
    },
    manrope_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-manrope)',
    },
    worksans_inter: {
      body: 'var(--font-worksans)',
      head: 'var(--font-inter)',
    },
    nunito_sourcesans3: {
      body: 'var(--font-sourcesans)',
      head: 'var(--font-nunito)',
    },
    lexend_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-lexend)',
    },
    outfit_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-outfit)',
    },
    sourcesans3_sourcesans3: {
      body: 'var(--font-sourcesans)',
      head: 'var(--font-sourcesans)',
    },
    inter_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-inter)',
    },
    fraunces_inter: {
      body: 'var(--font-inter)',
      head: 'var(--font-fraunces)',
    },
    inter_outfit: {
      body: 'var(--font-outfit)',
      head: 'var(--font-inter)',
    },
    inter_fraunces: {
      body: 'var(--font-fraunces)',
      head: 'var(--font-inter)',
    },
    // Legacy support
    dmSans_spaceGrotesk: {
      body: 'var(--font-dmsans)',
      head: 'var(--font-spacegrotesk)',
    },
  };

  const bodyFont = fontPairMap[theme.typography.fontBody] || fontPairMap.inter_inter;
  const headingFont = fontPairMap[theme.typography.fontHeading] || fontPairMap.sourceserif4_inter;
  const subheadingFont = fontPairMap[theme.typography.fontSubheading] || fontPairMap.sourceserif4_inter;

  // Escape CSS values safely
  const escapeCss = (value: string | number) => String(value).replace(/[<>"']/g, '');

  const fontClasses = `${inter.variable} ${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${nunito.variable} ${sourceSans.variable} ${manrope.variable} ${workSans.variable} ${lexend.variable} ${outfit.variable} ${fraunces.variable} ${sourceSerif4.variable} ${ibmPlexMono.variable}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --brand-primary: ${escapeCss(theme.colors.primary)};
            --brand-accent: ${escapeCss(theme.colors.accent)};
            --brand-bg-1: ${escapeCss(theme.colors.background1)};
            --brand-bg-2: ${escapeCss(theme.colors.background2)};
            --brand-surface: ${escapeCss(theme.colors.surface)};
            --brand-section-1: ${escapeCss(theme.colors.section1)};
            --brand-section-2: ${escapeCss(theme.colors.section2)};
            --brand-text: ${escapeCss(theme.colors.text)};
            --brand-muted: ${escapeCss(theme.colors.muted)};
            --brand-border: ${escapeCss(theme.colors.border)};
            --brand-primary-foreground: ${escapeCss(theme.colors.primaryForeground)};
            --brand-accent-foreground: ${escapeCss(theme.colors.accentForeground)};
            --brand-scrollbar-thumb: ${escapeCss(theme.colors.scrollbarThumb)};
            --brand-font-heading: ${headingFont.head};
            --brand-font-subheading: ${subheadingFont.head};
            --brand-font-body: ${bodyFont.body};
            --brand-font-size-base: ${escapeCss(theme.typography.baseFontSize)}px;
            --brand-radius: ${escapeCss(theme.components.radius)}px;
          }
        `
      }} />
      <div className={fontClasses}>
        {children}
      </div>
    </>
  );
}

