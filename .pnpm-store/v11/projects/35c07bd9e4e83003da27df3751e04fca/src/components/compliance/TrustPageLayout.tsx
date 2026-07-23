import Link from 'next/link';
import type { ReactNode } from 'react';

type TrustPageLayoutProps = {
  title: string;
  intro?: string;
  children: ReactNode;
};

export function TrustPageLayout({ title, intro, children }: TrustPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#FBFAF7]">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
        <p className="text-sm mb-4">
          <Link href="/" className="text-[#66717D] hover:text-[#253044] underline">
            Home
          </Link>
          <span className="text-[#66717D] mx-2">/</span>
          <span className="text-[#253044]">{title}</span>
        </p>
        <h1 className="text-3xl lg:text-4xl font-bold text-[#253044] mb-4">{title}</h1>
        {intro ? <p className="text-base text-[#66717D] leading-relaxed mb-8">{intro}</p> : null}
        <div className="prose-trust space-y-6 text-[#253044] text-base leading-relaxed">{children}</div>
      </div>
    </main>
  );
}
