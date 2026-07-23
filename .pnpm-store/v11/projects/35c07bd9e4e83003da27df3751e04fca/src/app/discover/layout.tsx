import { discoverManrope } from '@/lib/discover/manrope';
import { discoverPlayful } from '@/lib/discover/playful';

/** Discover routes use Figma Manrope typography (see useFigmaAppShellTypography + discoverManrope). */
export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${discoverManrope.className} ${discoverPlayful.variable} min-h-full`}>{children}</div>
  );
}
