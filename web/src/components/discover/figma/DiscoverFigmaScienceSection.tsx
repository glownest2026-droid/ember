'use client';

import { Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

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
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.4 }}
      className="mb-8 lg:mb-12 overflow-hidden"
    >
      <div
        className="rounded-3xl p-5 lg:p-8 shadow-sm"
        style={{ backgroundColor: 'rgba(255, 99, 71, 0.08)' }}
      >
        <div className="flex items-start gap-3 lg:gap-4">
          <div className="w-11 h-11 lg:w-14 lg:h-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5 lg:w-7 lg:h-7 text-[var(--ember-accent-base)]" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-base lg:text-xl font-medium text-[var(--ember-text-high)] leading-tight">{title}</h3>
              {onExplain ? (
                <button
                  type="button"
                  onClick={onExplain}
                  className="text-xs lg:text-sm text-[var(--ember-text-low)] hover:underline focus:outline-none focus-visible:ring-2 rounded"
                >
                  Explained <span aria-hidden>ⓘ</span>
                </button>
              ) : null}
            </div>
            <p className="text-sm lg:text-base text-[var(--ember-text-low)] leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
