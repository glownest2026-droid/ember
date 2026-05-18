'use client';

import Image from 'next/image';
const ROBIN_LOGO_SRC =
  'https://shjccflwlayacppuyskl.supabase.co/storage/v1/object/public/brand-assets/logos/Ember_Logo_Robin1.png';

export function DiscoverFigmaScienceSection({
  title,
  description,
  onExplain,
}: {
  title: string;
  description: string;
  onExplain?: () => void;
}) {
  if (!description.trim()) return null;
  return (
    <section className="bg-[#FFF9F5] border border-[#F2E8E1] rounded-[20px] p-5 md:p-6 flex flex-col md:flex-row gap-4 md:items-start shadow-sm">
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#F2E8E1] overflow-hidden">
        <Image src={ROBIN_LOGO_SRC} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
      </div>
      <div className="flex flex-col gap-2.5 min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-[18px] text-[#253044] m-0">{title || 'Why this matters now'}</h3>
          {onExplain ? (
            <button
              type="button"
              onClick={onExplain}
              className="text-[#FF5C34] font-semibold text-[14px] hover:underline underline-offset-2"
            >
              Explained <span aria-hidden>ⓘ</span>
            </button>
          ) : null}
        </div>
        <p className="text-[15px] md:text-[16px] text-[#253044] leading-relaxed max-w-3xl whitespace-pre-wrap m-0">
          {description}
        </p>
        {onExplain ? (
          <button
            type="button"
            onClick={onExplain}
            className="text-[#FF5C34] font-semibold text-[14px] hover:underline underline-offset-2 self-start transition-all"
          >
            Read more
          </button>
        ) : null}
      </div>
    </section>
  );
}
