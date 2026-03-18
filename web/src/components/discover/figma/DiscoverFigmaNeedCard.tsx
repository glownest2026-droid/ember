'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

export function DiscoverFigmaNeedCard({
  icon: Icon,
  title,
  description,
  science,
  isSelected,
  onClick,
  disabled,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  science: string;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        relative w-full text-left p-5 lg:p-8 rounded-2xl lg:rounded-3xl border-2 transition-all duration-300
        ${disabled ? 'opacity-60 cursor-not-allowed border-[var(--ember-border-subtle)] bg-[var(--ember-surface-soft)]' : ''}
        ${!disabled && isSelected
          ? 'border-[var(--ember-accent-base)] bg-white shadow-xl ring-2 ring-[var(--ember-accent-base)]/10'
          : !disabled
            ? 'border-[var(--ember-border-subtle)] bg-white hover:border-[var(--ember-accent-base)]/50 hover:shadow-md'
            : ''
        }
      `}
      whileHover={disabled ? undefined : { y: -4 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
    >
      <div
        className={`
          w-11 h-11 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl mb-3 lg:mb-4 flex items-center justify-center transition-colors
          ${isSelected && !disabled ? 'bg-[var(--ember-accent-base)]' : 'bg-[#FF634710]'}
        `}
      >
        <Icon
          className={`w-5 h-5 lg:w-8 lg:h-8 ${isSelected && !disabled ? 'text-white' : 'text-[var(--ember-accent-hover)]'}`}
          strokeWidth={1.75}
        />
      </div>
      <h3 className="text-sm lg:text-lg font-medium text-[var(--ember-text-high)] mb-1 lg:mb-2 leading-tight">{title}</h3>
      <p className="text-xs lg:text-sm text-[var(--ember-text-low)] line-clamp-2 mb-2 lg:mb-3 leading-snug">{description}</p>
      <p className="text-[10px] lg:text-xs text-[var(--ember-accent-hover)] font-medium line-clamp-2">{science}</p>
    </motion.button>
  );
}
