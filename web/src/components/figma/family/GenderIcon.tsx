'use client';

import { Heart, Smile, Circle } from 'lucide-react';

type GenderIconProps = {
  gender?: 'female' | 'male' | 'other' | null;
  className?: string;
};

/** Gender indicator with native title tooltip (no Radix dependency). */
export function GenderIcon({ gender, className = '' }: GenderIconProps) {
  const iconClass = `w-4 h-4 ${className}`;

  let icon;
  let label: string;

  switch (gender) {
    case 'female':
      icon = <Heart className={iconClass} fill="currentColor" />;
      label = 'Female';
      break;
    case 'male':
      icon = <Circle className={iconClass} />;
      label = 'Male';
      break;
    default:
      icon = <Smile className={iconClass} />;
      label = 'Not specified';
  }

  return (
    <div
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FF634710] text-[#FF6347] transition-all hover:scale-110 hover:bg-[#FF634720]"
      role="img"
      aria-label={label}
      title={label}
    >
      {icon}
    </div>
  );
}
