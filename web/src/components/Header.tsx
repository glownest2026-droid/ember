// web/src/components/Header.tsx
"use client";

import * as React from "react";
import Link from "next/link";

/** Shared theme tokens for quick inline styling */
export const THEME = {
  ink: "#1C1C1E",
  primary: "#FFC7AE",
  primaryLight: "#FFE5D7",
  cloud: "#FAFAFB",
  sky: "#EAF3FF",
  sprout: "#5EC57E",
  pebble: "#E6E6EA",
};

export function BrandIcon({ size = 20 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} role="img" aria-label="Ember icon">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={THEME.primary} />
          <stop offset="100%" stopColor={THEME.primaryLight} />
        </linearGradient>
      </defs>
      <g stroke="url(#g)" strokeWidth={s * 0.12} strokeLinecap="round">
        <path d={`M ${s*0.15} ${s*0.7} Q ${s*0.5} ${s*0.95}, ${s*0.85} ${s*0.7}`} fill="none" />
        <line x1={s*0.5} y1={s*0.28} x2={s*0.5} y2={s*0.42} />
        <line x1={s*0.44} y1={s*0.35} x2={s*0.56} y2={s*0.35} />
        <line x1={s*0.47} y1={s*0.3} x2={s*0.53} y2={s*0.4} />
        <line x1={s*0.53} y1={s*0.3} x2={s*0.47} y2={s*0.4} />
      </g>
    </svg>
  );
}

export function Wordmark() {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div
        className="w-7 h-7 rounded-full grid place-items-center"
        style={{ background: `linear-gradient(160deg, ${THEME.primary}, ${THEME.primaryLight})` }}
      >
        <BrandIcon size={18} />
      </div>
      <span className="text-xl font-semibold tracking-tight" style={{ color: THEME.ink }}>
        Ember
      </span>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const base = "px-5 py-3 rounded-xl transition font-semibold";
  if (variant === "primary") {
    return (
      <button
        className={`${base} shadow border ${className}`}
        style={{ background: THEME.primary, color: THEME.ink, borderColor: THEME.pebble }}
        {...props}
      >
        {children}
      </button>
    );
  }
  if (variant === "ghost") {
    return (
      <button
        className={`${base} border ${className}`}
        style={{ background: THEME.cloud, color: THEME.ink, borderColor: THEME.pebble }}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}

/** Anchor-based button (keeps styling). NOTE: top-level const, not export. */
const ButtonLink = ({
  children,
  variant = "primary",
  href,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  href: string;
  className?: string;
}) => {
  const base = "px-5 py-3 rounded-xl transition font-semibold inline-flex items-center justify-center";
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={`${base} shadow border ${className}`}
        style={{ background: THEME.primary, color: THEME.ink, borderColor: THEME.pebble }}
      >
        {children}
      </Link>
    );
  }
  if (variant === "ghost") {
    return (
      <Link
        href={href}
        className={`${base} border ${className}`}
        style={{ background: THEME.cloud, color: THEME.ink, borderColor: THEME.pebble }}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
};

export default function Header() {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b"
      style={{ borderColor: THEME.pebble }}
    >
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: THEME.ink }}>
          <a className="opacity-80 hover:opacity-100" href="#how">How it works</a>
          <a className="opacity-80 hover:opacity-100" href="#features">Features</a>
          <a className="opacity-80 hover:opacity-100" href="#trust">Trust</a>
          <a className="opacity-80 hover:opacity-100" href="#faq">FAQ</a>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <ButtonLink variant="ghost" href="/signin">Sign in</ButtonLink>
          <a href="#waitlist"><Button>Join free</Button></a>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-xl border px-3 py-2"
          style={{ borderColor: THEME.pebble, color: THEME.ink }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t bg-white/90 backdrop-blur" style={{ borderColor: THEME.pebble }}>
          <div className="mx-auto max-w-6xl px-6 py-3 flex flex-col gap-3">
            <a href="#how" className="py-1" onClick={() => setOpen(false)}>How it works</a>
            <a href="#features" className="py-1" onClick={() => setOpen(false)}>Features</a>
            <a href="#trust" className="py-1" onClick={() => setOpen(false)}>Trust</a>
            <a href="#faq" className="py-1" onClick={() => setOpen(false)}>FAQ</a>
            <Link href="/signin" onClick={() => setOpen(false)} className="w-full">
              <Button variant="ghost" className="w-full">Sign in</Button>
            </Link>
            <a href="#waitlist" onClick={() => setOpen(false)} className="w-full">
              <Button className="w-full">Join free</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
