import { ReactNode } from 'react';

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: 'linear-gradient(180deg, var(--brand-bg-1, #FFFCF8) 0%, var(--brand-bg-2, #FFFFFF) 100%)', minHeight: '100vh' }}>
      <main className="container-wrap py-6">{children}</main>
    </div>
  );
}
