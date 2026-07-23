'use client';

import Image from 'next/image';

const ROBIN_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

const SIZES = {
  sm: { box: 32, img: 26 },
  md: { box: 44, img: 36 },
  lg: { box: 56, img: 46 },
  xl: { box: 64, img: 52 },
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
