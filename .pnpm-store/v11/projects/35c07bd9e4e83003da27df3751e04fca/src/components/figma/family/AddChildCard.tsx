'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';

type AddChildCardProps = {
  onAddChild?: () => void;
};

/** Add another child card – exact Figma layout. Wired to /add-children. */
export function AddChildCard({ onAddChild }: AddChildCardProps) {
  return (
    <Link
      href="/add-children"
      className="group relative bg-[#FFF5F3] border-2 border-dashed border-[#FF6347] rounded-3xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#B8432B] hover:bg-[#FFF5F3] focus:outline focus:outline-2 focus:outline-[#FF6347] focus:outline-offset-2 overflow-hidden text-left h-full min-h-[200px] flex items-center justify-center block"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF634710] rounded-full blur-2xl opacity-60" />

      <div className="relative z-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#FF8870] to-[#FF6347] flex items-center justify-center shadow-md mb-4 transform transition-transform group-hover:scale-110">
          <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <Sparkles className="absolute top-0 right-[calc(50%-2rem)] w-5 h-5 text-[#FF6347] fill-[#FF6347] opacity-60" />

        <h3 className="text-lg font-medium text-[#1A1E23] mb-1">
          Add another child
        </h3>
        <p className="text-sm text-[#5C646D]">Track another little one</p>
      </div>
    </Link>
  );
}
