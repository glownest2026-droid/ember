'use client';

import Link from 'next/link';
import { Plus, Sparkles, Heart } from 'lucide-react';

type EmptyChildProfilesProps = {
  onAddChild?: () => void;
};

/** Empty state – exact Figma layout. Wired to /add-children. */
export function EmptyChildProfiles({ onAddChild }: EmptyChildProfilesProps) {
  return (
    <div className="relative bg-[#FFF5F3] border-2 border-dashed border-[#FF634760] rounded-3xl p-12 text-center overflow-hidden">
      <div className="absolute top-6 left-6 w-16 h-16 rounded-full bg-[#FF634710] blur-xl" />
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-[#FF634715] blur-xl" />
      <div className="absolute bottom-6 left-8 w-12 h-12 rounded-full bg-[#FF634708] blur-xl" />
      <div className="absolute bottom-8 right-6 w-16 h-16 rounded-full bg-[#FF634712] blur-xl" />

      <div className="max-w-md mx-auto relative z-10">
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8870] to-[#FF6347] flex items-center justify-center mx-auto shadow-lg">
            <Heart
              className="w-10 h-10 text-white"
              strokeWidth={2}
              fill="currentColor"
            />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#FF6347] fill-[#FF6347] opacity-80" />
        </div>

        <h3 className="text-2xl font-medium text-[#1A1E23] mb-2">
          Start your family journey
        </h3>
        <p className="text-base text-[#5C646D] mb-6 leading-relaxed">
          Add your first child to see personalized content for their stage.
        </p>
        <Link
          href="/add-children"
          className="inline-flex items-center justify-center bg-[#FF6347] text-white hover:bg-[#B8432B] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] hover:scale-105 transition-all px-6 py-5 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add your first child
        </Link>
      </div>
    </div>
  );
}
