'use client';

import Image from 'next/image';

/**
 * Edge-to-edge Stage 2 art (matches live homepage hero media framing).
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
    <div className={`relative h-full w-full ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
