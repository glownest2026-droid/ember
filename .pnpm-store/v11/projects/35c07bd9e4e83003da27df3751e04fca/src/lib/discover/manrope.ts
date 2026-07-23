import { Manrope } from 'next/font/google';

/** Figma May 2026 discover: Manrope 400/500/600/700 (fonts.css + Root.tsx). */
export const discoverManrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-discover-manrope',
  display: 'swap',
});
