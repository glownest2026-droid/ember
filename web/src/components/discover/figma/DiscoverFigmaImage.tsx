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

/** Intrinsic 16:9 dimensions for card slots (width capped via sizes + max-height in CSS). */
const CARD_INTRINSIC_WIDTH = 640;
const CARD_INTRINSIC_HEIGHT = 360;

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

  if (!optimizedSrc || failed) {
    return (
      <div
        className={variant === 'card' ? `w-full max-h-[150px] md:max-h-[165px] aspect-[16/9] ${className}` : `absolute inset-0 ${className}`}
        style={{ background: PLACEHOLDER_BG }}
        aria-hidden={!alt}
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  const opacityClass = `transition-opacity duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`;
  const imageSizes = sizes ?? SIZE_PRESETS[variant];

  // Play-idea cards: intrinsic width + h-auto + max-h preserves 16:9 (matches pre–next/image <img>).
  // fill + object-cover inside aspect/max-h fought each other and cropped faces to a strip.
  if (variant === 'card') {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        width={CARD_INTRINSIC_WIDTH}
        height={CARD_INTRINSIC_HEIGHT}
        sizes={imageSizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={75}
        className={`w-full h-auto max-h-[150px] md:max-h-[165px] object-cover ${opacityClass} ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: PLACEHOLDER_BG }}
        aria-hidden
      />
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
