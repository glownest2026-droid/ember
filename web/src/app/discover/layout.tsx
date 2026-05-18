import { discoverManrope } from '@/lib/discover/manrope';

/** Discover routes use Figma Manrope typography (see useFigmaAppShellTypography + discoverManrope). */
export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${discoverManrope.className} min-h-full`}>{children}</div>;
}
