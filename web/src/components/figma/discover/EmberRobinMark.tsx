'use client';

import Image from 'next/image';

const ROBIN_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const SIZES = {
  sm: { box: 28, img: 22 },
  md: { box: 36, img: 28 },
  lg: { box: 48, img: 38 },
} as const;

/** Ember robin mark at a readable size (avoids stretched tiny logos in chips/panels). */
export function EmberRobinMark({ size = 'md' }: { size?: keyof typeof SIZES }) {
  const dim = SIZES[size];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
      style={{ width: dim.box, height: dim.box }}
    >
      <Image
        src={ROBIN_LOGO_SRC}
        alt=""
        width={dim.img}
        height={dim.img}
        className="object-contain"
        style={{ width: dim.img, height: dim.img }}
      />
    </span>
  );
}
