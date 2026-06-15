'use client';

import { EmberRobinMark } from '@/components/figma/discover/EmberRobinMark';

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
    <section className="bg-[#FFF9F5] border border-[#F2E8E1] rounded-[20px] p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-start shadow-sm">
      <EmberRobinMark size="xl" />
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
        <blockquote
          className="text-[17px] md:text-[18px] text-[#253044] leading-relaxed max-w-3xl whitespace-pre-wrap m-0 border-0 p-0 not-italic"
          style={{ fontFamily: 'var(--font-discover-playful), cursive' }}
        >
          &ldquo;{description}&rdquo;
        </blockquote>
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
