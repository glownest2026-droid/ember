'use client';
import type { RequiredThemeSettings } from '@/lib/theme';
import { Inter, Plus_Jakarta_Sans, DM_Sans, Space_Grotesk, Nunito, Source_Sans_3, Manrope, Work_Sans, Lexend, Outfit, Fraunces } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
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

const fontPairMap: Record<string, { body: string; head: string }> = {
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
  // Legacy support
  dmSans_spaceGrotesk: {
    body: 'var(--font-dmsans)',
    head: 'var(--font-spacegrotesk)',
  },
};

export default function ThemePreview({ theme }: { theme: RequiredThemeSettings }) {
  const bodyFont = fontPairMap[theme.typography.fontBody] || fontPairMap.inter_plusjakarta;
  const headFont = fontPairMap[theme.typography.fontHeading] || fontPairMap.inter_plusjakarta;

  const escapeCss = (value: string | number) => String(value).replace(/[<>"']/g, '');

  const previewStyles = {
    '--brand-primary': escapeCss(theme.colors.primary),
    '--brand-accent': escapeCss(theme.colors.accent),
    '--brand-bg': escapeCss(theme.colors.background),
    '--brand-surface': escapeCss(theme.colors.surface),
    '--brand-text': escapeCss(theme.colors.text),
    '--brand-muted': escapeCss(theme.colors.muted),
    '--brand-border': escapeCss(theme.colors.border),
    '--brand-font-body': bodyFont.body,
    '--brand-font-head': headFont.head,
    '--brand-font-size-base': `${escapeCss(theme.typography.baseFontSize)}px`,
    '--brand-radius': `${escapeCss(theme.components.radius)}px`,
  } as React.CSSProperties;

  const fontClasses = `${inter.variable} ${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${nunito.variable} ${sourceSans.variable} ${manrope.variable} ${workSans.variable} ${lexend.variable} ${outfit.variable} ${fraunces.variable}`;

  return (
    <div className={`${fontClasses} border rounded p-6`} style={previewStyles}>
      <div
        className="p-6 rounded"
        style={{
          backgroundColor: 'var(--brand-bg)',
          color: 'var(--brand-text)',
          fontFamily: 'var(--brand-font-body)',
          fontSize: 'var(--brand-font-size-base)',
        }}
      >
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: 'var(--brand-font-head)' }}
        >
          Heading Style
        </h1>
        <h2
          className="text-xl font-semibold mb-4"
          style={{ fontFamily: 'var(--brand-font-head)' }}
        >
          Subheading
        </h2>
        <p className="mb-4" style={{ color: 'var(--brand-text)' }}>
          This is body text showing how the theme colors and typography look together.
        </p>
        <p className="mb-4" style={{ color: 'var(--brand-muted)' }}>
          Muted text for secondary information.
        </p>
        <div
          className="p-4 rounded mb-4"
          style={{
            backgroundColor: 'var(--brand-surface)',
            border: `1px solid var(--brand-border)`,
            borderRadius: 'var(--brand-radius)',
          }}
        >
          <p>Card component preview</p>
        </div>
        <button
          className="px-4 py-2 rounded font-semibold"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--brand-text)',
            border: `1px solid var(--brand-border)`,
            borderRadius: 'var(--brand-radius)',
          }}
        >
          Primary Button
        </button>
        <button
          className="px-4 py-2 rounded font-semibold ml-2"
          style={{
            backgroundColor: 'var(--brand-accent)',
            color: 'var(--brand-text)',
            border: `1px solid var(--brand-border)`,
            borderRadius: 'var(--brand-radius)',
          }}
        >
          Accent Button
        </button>
      </div>
    </div>
  );
}

