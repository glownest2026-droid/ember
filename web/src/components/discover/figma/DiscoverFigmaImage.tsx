'use client';

import { useState } from 'react';

export function DiscoverFigmaImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          background: 'linear-gradient(135deg, var(--ember-surface-soft) 0%, var(--ember-border-subtle) 100%)',
        }}
        aria-hidden
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element -- remote category/product URLs
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
