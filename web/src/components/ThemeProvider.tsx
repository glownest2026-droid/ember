import { Inter, Plus_Jakarta_Sans, DM_Sans, Space_Grotesk, Nunito, Source_Sans_3 } from 'next/font/google';
import { loadTheme } from '../lib/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plusjakarta' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dmsans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-spacegrotesk' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-nunito' });
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sourcesans' });

export const dynamic = 'force-dynamic';

export async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = await loadTheme();

  // Map font pairs to CSS variable names
  const fontPairMap: Record<string, { body: string; head: string }> = {
    inter_plusjakarta: {
      body: 'var(--font-inter)',
      head: 'var(--font-plusjakarta)',
    },
    dmSans_spaceGrotesk: {
      body: 'var(--font-dmsans)',
      head: 'var(--font-spacegrotesk)',
    },
    nunito_sourceSans: {
      body: 'var(--font-nunito)',
      head: 'var(--font-sourcesans)',
    },
  };

  const bodyFont = fontPairMap[theme.typography.fontBody] || fontPairMap.inter_plusjakarta;
  const headFont = fontPairMap[theme.typography.fontHeading] || fontPairMap.inter_plusjakarta;

  // Escape CSS values safely
  const escapeCss = (value: string | number) => String(value).replace(/[<>"']/g, '');

  const fontClasses = `${inter.variable} ${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${nunito.variable} ${sourceSans.variable}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --brand-primary: ${escapeCss(theme.colors.primary)};
            --brand-accent: ${escapeCss(theme.colors.accent)};
            --brand-bg: ${escapeCss(theme.colors.background)};
            --brand-surface: ${escapeCss(theme.colors.surface)};
            --brand-text: ${escapeCss(theme.colors.text)};
            --brand-muted: ${escapeCss(theme.colors.muted)};
            --brand-border: ${escapeCss(theme.colors.border)};
            --brand-font-body: ${bodyFont.body};
            --brand-font-head: ${headFont.head};
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

