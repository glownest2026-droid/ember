// web/src/components/Header.tsx
"use client";

import * as React from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-stone-200">
      <div className="container-wrap flex items-center justify-between py-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg" style={{
              background: "linear-gradient(180deg, var(--color-ember-400), var(--color-ember-300))"
            }} />
            <span className="text-xl font-semibold tracking-tight">Ember</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-[0.95rem]">
          <Link href="/play" className="hover:opacity-80">Play</Link>
          <a href="#about" className="hover:opacity-80">About</a>
          <a href="#waitlist" className="btn btn-primary">Join waitlist</a>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="sm:hidden inline-flex items-center justify-center rounded-xl border border-stone-300 px-3 py-2"
        >
          <span className="sr-only">Toggle menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="sm:hidden border-t border-stone-200 bg-white/90 backdrop-blur">
          <div className="container-wrap py-3 flex flex-col gap-3">
            <Link href="/play" className="py-1" onClick={() => setOpen(false)}>Play</Link>
            <a href="#about" className="py-1" onClick={() => setOpen(false)}>About</a>
            <a href="#waitlist" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              Join waitlist
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
