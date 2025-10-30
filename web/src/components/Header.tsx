// web/src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const link = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm px-3 py-1.5 rounded-lg border transition ${
          active
            ? "bg-ember-300/70 border-stone-200 text-ink"
            : "bg-white/60 hover:bg-white border-stone-200 text-stone-700"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-stone-200">
      <div className="container-wrap flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold bg-gradient-to-r from-ember-400 via-apricot-400 to-blush-400 bg-clip-text text-transparent">
            Ember
          </span>
          <span className="sr-only">Home</span>
        </Link>
        <nav className="flex items-center gap-1">
          {link("/", "Home")}
          {link("/play", "Play")}
        </nav>
      </div>
    </header>
  );
}
