import { ReactNode } from 'react';
import HeaderServer from '../../components/HeaderServer';

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)', minHeight: '100vh', paddingTop: 'calc(var(--header-height) + env(safe-area-inset-top, 0px))' }}>
      <HeaderServer homeHref="/app" />
      <main className="container-wrap py-6">{children}</main>
    </div>
  );
}
