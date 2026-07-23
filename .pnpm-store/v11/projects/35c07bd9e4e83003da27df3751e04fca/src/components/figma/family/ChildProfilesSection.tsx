'use client';

import Link from 'next/link';
import { Plus, Heart } from 'lucide-react';
import { ChildProfileCard, type FamilyChild, type ChildStats } from './ChildProfileCard';
import { EmptyChildProfiles } from './EmptyChildProfiles';
import { AddChildCard } from './AddChildCard';

type ChildWithStats = FamilyChild & { stats?: ChildStats | null };

type ChildProfilesSectionProps = {
  familyChildren: ChildWithStats[];
  onEditChild?: (id: string) => void;
  onRemove?: (id: string) => void | Promise<void>;
};

/** Child profiles grid + empty state + add card – exact Figma layout. */
export function ChildProfilesSection({
  familyChildren,
  onRemove,
}: ChildProfilesSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1E23]">
              Child profiles
            </h2>
            <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6347] fill-[#FF6347]" />
          </div>
          <p className="text-sm sm:text-base text-[#5C646D]">
            Your children and their stages
          </p>
        </div>
        {familyChildren.length > 0 && (
          <Link
            href="/add-children"
            className="inline-flex items-center justify-center gap-2 bg-[#FF6347] text-white hover:bg-[#B8432B] hover:shadow-[0px_8px_32px_rgba(255,99,71,0.3)] hover:scale-105 transition-all rounded-xl font-medium w-full sm:w-auto px-4 py-2.5"
          >
            <Plus className="w-4 h-4" />
            Add a child
          </Link>
        )}
      </div>

      {familyChildren.length === 0 ? (
        <EmptyChildProfiles />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {familyChildren.map((child) => (
            <ChildProfileCard
              key={child.id}
              child={child}
              stats={child.stats}
              onRemove={onRemove}
            />
          ))}
          <AddChildCard />
        </div>
      )}
    </section>
  );
}
