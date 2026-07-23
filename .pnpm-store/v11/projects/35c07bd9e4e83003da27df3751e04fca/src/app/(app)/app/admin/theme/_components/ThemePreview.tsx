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

export default function ThemePreview({ theme }: { theme: RequiredThemeSettings }) {
  const bodyFont = fontPairMap[theme.typography.fontBody] || fontPairMap.inter_plusjakarta;
  const headingFont = fontPairMap[theme.typography.fontHeading] || fontPairMap.inter_plusjakarta;
  const subheadingFont = fontPairMap[theme.typography.fontSubheading] || fontPairMap.inter_plusjakarta;

  const escapeCss = (value: string | number) => String(value).replace(/[<>"']/g, '');

  const previewStyles = {
    '--brand-primary': escapeCss(theme.colors.primary),
    '--brand-accent': escapeCss(theme.colors.accent),
    '--brand-bg-1': escapeCss(theme.colors.background1),
    '--brand-bg-2': escapeCss(theme.colors.background2),
    '--brand-surface': escapeCss(theme.colors.surface),
    '--brand-section-1': escapeCss(theme.colors.section1),
    '--brand-section-2': escapeCss(theme.colors.section2),
    '--brand-text': escapeCss(theme.colors.text),
    '--brand-muted': escapeCss(theme.colors.muted),
    '--brand-border': escapeCss(theme.colors.border),
    '--brand-primary-foreground': escapeCss(theme.colors.primaryForeground),
    '--brand-accent-foreground': escapeCss(theme.colors.accentForeground),
    '--brand-scrollbar-thumb': escapeCss(theme.colors.scrollbarThumb),
    '--brand-font-heading': headingFont.head,
    '--brand-font-subheading': subheadingFont.head,
    '--brand-font-body': bodyFont.body,
    '--brand-font-size-base': `${escapeCss(theme.typography.baseFontSize)}px`,
    '--brand-radius': `${escapeCss(theme.components.radius)}px`,
  } as React.CSSProperties;

  const fontClasses = `${inter.variable} ${plusJakarta.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${nunito.variable} ${sourceSans.variable} ${manrope.variable} ${workSans.variable} ${lexend.variable} ${outfit.variable} ${fraunces.variable}`;

  return (
    <div className={`${fontClasses} border rounded-lg overflow-hidden`} style={previewStyles}>
      {/* Header bar */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          backgroundColor: 'var(--brand-surface)',
          borderColor: 'var(--brand-border)',
        }}
      >
        <div className="font-semibold" style={{ fontFamily: 'var(--brand-font-heading)', color: 'var(--brand-text)' }}>
          Site Header
        </div>
        <div className="flex gap-3 text-sm">
          <span style={{ color: 'var(--brand-text)' }}>Home</span>
          <span style={{ color: 'var(--brand-muted)' }}>About</span>
        </div>
      </div>

      {/* Hero block with background gradient */}
      <div
        className="px-6 py-8"
        style={{
          background: 'linear-gradient(180deg, var(--brand-bg-1) 0%, var(--brand-bg-2) 100%)',
          color: 'var(--brand-text)',
          fontFamily: 'var(--brand-font-body)',
          fontSize: 'var(--brand-font-size-base)',
        }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--brand-font-heading)' }}
        >
          Main Heading
        </h1>
        <h2
          className="text-lg font-semibold mb-3"
          style={{ fontFamily: 'var(--brand-font-subheading)', color: 'var(--brand-muted)' }}
        >
          Subheading Text
        </h2>
        <p className="mb-4" style={{ color: 'var(--brand-text)' }}>
          Body text demonstrating the body font family and readability.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className="px-4 py-2 rounded font-semibold"
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--brand-primary-foreground)',
              border: `1px solid var(--brand-border)`,
              borderRadius: 'var(--brand-radius)',
            }}
          >
            Primary
          </button>
          <button
            className="px-4 py-2 rounded font-semibold"
            style={{
              backgroundColor: 'var(--brand-accent)',
              color: 'var(--brand-accent-foreground)',
              border: `1px solid var(--brand-border)`,
              borderRadius: 'var(--brand-radius)',
            }}
          >
            Accent
          </button>
        </div>

        {/* Badge/Pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: 'var(--brand-surface)',
            border: `1px solid var(--brand-border)`,
            color: 'var(--brand-muted)',
          }}
        >
          <span style={{ color: 'var(--brand-accent)' }}>•</span>
          Badge Example
        </div>
      </div>

      {/* Section block with section gradient */}
      <div
        className="px-6 py-6"
        style={{
          background: 'linear-gradient(180deg, var(--brand-section-1) 0%, var(--brand-section-2) 100%)',
        }}
      >
        <h2
          className="text-xl font-semibold mb-3"
          style={{ fontFamily: 'var(--brand-font-subheading)', color: 'var(--brand-text)' }}
        >
          Section Block
        </h2>
        <div
          className="p-4 rounded"
          style={{
            backgroundColor: 'var(--brand-surface)',
            border: `1px solid var(--brand-border)`,
            borderRadius: 'var(--brand-radius)',
            color: 'var(--brand-text)',
          }}
        >
          <p className="text-sm">Card content with surface background and border.</p>
        </div>
      </div>
    </div>
  );
}

