'use client';

import Image from 'next/image';

/**
 * Stage 2 Storage art sits on clean product-style canvases.
 * Soft Discover canvas + contain keeps framing honest (no heavy crop).
 */
export function HomeStage2Media({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative h-full w-full bg-[#FBFAF7] ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain p-4 sm:p-6 lg:p-8"
      />
    </div>
  );
}
