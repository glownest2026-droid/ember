// web/src/components/Header.tsx
"use client";

import * as React from "react";
import Link from "next/link";

/** Shared theme tokens (Brandbook: ember palette) */
export const THEME = {
  ink: "#1A1E23",
  primary: "#FF6347",
  primaryLight: "#B8432B",
  cloud: "#FAFAFA",
  sky: "#EAF3FF",
  sprout: "#5EC57E",
  pebble: "#E5E7EB",
};

export function BrandIcon({ size = 20 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} role="img" aria-label="Ember icon">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand-primary, var(--ember-accent-base))" />
          <stop offset="100%" stopColor="var(--ember-accent-hover)" />
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
        style={{ background: `linear-gradient(160deg, var(--brand-primary, var(--ember-accent-base)), var(--ember-accent-hover))` }}
      >
        <BrandIcon size={18} />
      </div>
      <span className="text-xl font-semibold tracking-tight" style={{ color: 'var(--brand-text, var(--ember-text-high))' }}>
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
  const base = "px-5 py-3 rounded-lg transition font-semibold";
  if (variant === "primary") {
    return (
      <button
        className={`${base} shadow ${className}`}
        style={{ 
          background: 'var(--brand-primary, var(--ember-accent-base))', 
          color: 'var(--brand-primary-foreground, var(--ember-surface-primary))', 
          borderRadius: 'var(--ember-radius-button, 8px)'
        }}
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
        style={{ 
          background: 'var(--brand-bg-1, var(--ember-bg-canvas))', 
          color: 'var(--brand-text, var(--ember-text-high))', 
          borderColor: 'var(--brand-border, var(--ember-border-subtle))',
          borderRadius: 'var(--ember-radius-button, 8px)'
        }}
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
  const base = "px-5 py-3 rounded-lg transition font-semibold inline-flex items-center justify-center";
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={`${base} shadow ${className}`}
        style={{ 
          background: 'var(--brand-primary, var(--ember-accent-base))', 
          color: 'var(--brand-primary-foreground, var(--ember-surface-primary))', 
          borderRadius: 'var(--ember-radius-button, 8px)'
        }}
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
        style={{ 
          background: 'var(--brand-bg-1, var(--ember-bg-canvas))', 
          color: 'var(--brand-text, var(--ember-text-high))', 
          borderColor: 'var(--brand-border, var(--ember-border-subtle))',
          borderRadius: 'var(--ember-radius-button, 8px)'
        }}
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

export interface HeaderProps {
  userEmail?: string;
  isAdmin?: boolean;
  signOutButton?: React.ReactNode;
  homeHref?: string;
}

export default function Header({ userEmail, isAdmin, signOutButton, homeHref = '/' }: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b"
      style={{ 
        backgroundColor: 'var(--ember-surface-primary)',
        borderColor: 'var(--brand-border, var(--ember-border-subtle))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          <Wordmark />
        </Link>

        {/* Desktop nav */}
        {userEmail ? (
          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--brand-text, var(--ember-text-high))' }}>
            <Link href="/app" className="opacity-80 hover:opacity-100">Dashboard</Link>
            <Link href="/add-children" className="opacity-80 hover:opacity-100">Child Profiles</Link>
            <Link href="/app/recs" className="opacity-80 hover:opacity-100">Recommendations</Link>
            {isAdmin && (
              <Link href="/app/admin/theme" className="opacity-80 hover:opacity-100" style={{ color: 'var(--brand-primary, var(--ember-accent-base))' }}>Theme</Link>
            )}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: 'var(--brand-text, var(--ember-text-high))' }}>
            <a className="opacity-80 hover:opacity-100" href="#how">How it works</a>
            <a className="opacity-80 hover:opacity-100" href="#features">Features</a>
            <a className="opacity-80 hover:opacity-100" href="#trust">Trust</a>
            <a className="opacity-80 hover:opacity-100" href="#faq">FAQ</a>
          </nav>
        )}

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {userEmail ? (
            <>
              <span className="text-sm" style={{ color: 'var(--brand-muted, var(--ember-text-low))' }}>Signed in as {userEmail}</span>
              {signOutButton}
            </>
          ) : (
            <>
              <ButtonLink variant="ghost" href="/signin">Sign in</ButtonLink>
              <a href="#waitlist"><Button>Join free</Button></a>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--brand-border, var(--ember-border-subtle))', color: 'var(--brand-text, var(--ember-text-high))', borderRadius: 'var(--ember-radius-button, 8px)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t backdrop-blur" style={{ backgroundColor: 'var(--ember-surface-primary)', borderColor: 'var(--brand-border, var(--ember-border-subtle))' }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex flex-col gap-3">
            {userEmail ? (
              <>
                <Link href="/app" className="py-1" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/add-children" className="py-1" onClick={() => setOpen(false)}>Child Profiles</Link>
                <Link href="/app/recs" className="py-1" onClick={() => setOpen(false)}>Recommendations</Link>
                {isAdmin && (
                  <Link href="/app/admin/theme" className="py-1" onClick={() => setOpen(false)} style={{ color: 'var(--brand-primary, var(--ember-accent-base))' }}>Theme</Link>
                )}
                <span className="py-1 text-sm" style={{ color: 'var(--brand-muted, var(--ember-text-low))' }}>Signed in as {userEmail}</span>
                {signOutButton && (
                  <div onClick={() => setOpen(false)}>{signOutButton}</div>
                )}
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
