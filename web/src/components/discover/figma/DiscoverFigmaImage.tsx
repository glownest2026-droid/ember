'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { optimizeDiscoverImageUrl } from '@/lib/discover/discoverImageUrl';

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
  const optimizedSrc = optimizeDiscoverImageUrl(src, variant);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [optimizedSrc]);

  const opacityClass = `transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`;

  if (!optimizedSrc || failed) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{ background: PLACEHOLDER_BG }}
        aria-hidden={!alt}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  // Play-idea cards: raw <img> inside aspect-[16/9] max-h parent (matches live production).
  // next/image fill/intrinsic both altered object-cover framing vs production.
  // Src is already WebP + width-capped via Supabase render — no Vercel re-encode needed.
  if (variant === 'card') {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- must match production cover behaviour
      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover ${opacityClass} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    );
  }

  const imageSizes = sizes ?? SIZE_PRESETS[variant];

  return (
    <>
      <div className="absolute inset-0" style={{ background: PLACEHOLDER_BG }} aria-hidden />
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes={imageSizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={variant === 'hero' ? 80 : 75}
        className={`object-cover ${opacityClass} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
