'use client';

import { useEffect, useState } from 'react';

/** Listens for `window.dispatchEvent(new CustomEvent('ember:toast', { detail: { message } }))`. */
export function EphemeralToastHost() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const onToast = (e: Event) => {
      const m = (e as CustomEvent<{ message?: string }>).detail?.message?.trim();
      if (m) setMessage(m);
    };
    window.addEventListener('ember:toast', onToast as EventListener);
    return () => window.removeEventListener('ember:toast', onToast as EventListener);
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 3500);
    return () => window.clearTimeout(t);
  }, [message]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[200] max-w-[min(90vw,24rem)] -translate-x-1/2 rounded-xl border border-[var(--ember-border-subtle)] bg-[var(--ember-surface-primary)] px-4 py-3 text-center text-sm font-medium text-[var(--ember-text-high)] shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
