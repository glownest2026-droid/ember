'use client';

import Image from 'next/image';
import { useState } from 'react';

const PLACEHOLDER_BG =
  'linear-gradient(135deg, var(--ember-surface-soft) 0%, var(--ember-border-subtle) 100%)';

const SIZE_PRESETS = {
  hero: '(max-width: 768px) 100vw, 50vw',
  card: '(max-width: 768px) 94vw, (max-width: 1024px) 58vw, 42vw',
  product: '(max-width: 1024px) 100vw, 672px',
  'product-side': '192px',
} as const;

export type DiscoverFigmaImageVariant = keyof typeof SIZE_PRESETS;

export function DiscoverFigmaImage({
  src,
  alt,
  className = '',
  variant = 'card',
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  variant?: DiscoverFigmaImageVariant;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src?.trim() || failed) {
    return (
      <div
        className={className}
        style={{ background: PLACEHOLDER_BG }}
        aria-hidden={!alt}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: PLACEHOLDER_BG }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? SIZE_PRESETS[variant]}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        quality={variant === 'hero' ? 80 : 75}
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
