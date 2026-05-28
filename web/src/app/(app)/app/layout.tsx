import type { ReactNode } from 'react';

/** Authenticated /app/* shell: session-dependent pages and middleware auth gate. */
export const dynamic = 'force-dynamic';

export default function AppSectionLayout({ children }: { children: ReactNode }) {
  return children;
}
