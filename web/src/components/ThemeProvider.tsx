import { Inter, Plus_Jakarta_Sans, DM_Sans, Space_Grotesk, Nunito, Source_Sans_3 } from 'next/font/google';
import { loadTheme } from '../lib/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plusjakarta' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dmsans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-spacegrotesk' });
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-nunito' });
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-sourcesans' });

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

  const fonts = fontPairMap[theme.fontPair || 'inter_plusjakarta'] || fontPairMap.inter_plusjakarta;

  // Escape CSS values safely
  const escapeCss = (value: string) => value.replace(/[<>"']/g, '');

  const fontClasses = `${inter.variable} ${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${nunito.variable} ${sourceSans.variable}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --brand-primary: ${escapeCss(theme.primary || '#FFBEAB')};
            --brand-accent: ${escapeCss(theme.accent || '#FFC26E')};
            --brand-font-body: ${fonts.body};
            --brand-font-head: ${fonts.head};
          }
        `
      }} />
      <div className={fontClasses}>
        {children}
      </div>
    </>
  );
}

