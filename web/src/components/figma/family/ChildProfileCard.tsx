'use client';

import Link from 'next/link';
import { GenderIcon } from './GenderIcon';
import { formatBirthMonthYear, formatAge, getAvatarInitial } from './utils';

/** Ember child from DB (no name field – privacy). */
export interface FamilyChild {
  id: string;
  birthdate: string | null;
  gender: string | null;
  age_band: string | null;
}

/** Per-child stats from get_my_subnav_stats(p_child_id). */
export interface ChildStats {
  ideas: number;
  toys: number;
  gifts: number;
}

type ChildProfileCardProps = {
  child: FamilyChild;
  stats?: ChildStats | null;
  onEdit?: (id: string) => void;
};

/** Single child card – exact Figma layout. Privacy: no name; display "Little One" and initial from id. */
export function ChildProfileCard({ child, stats }: ChildProfileCardProps) {
  const initial = getAvatarInitial(child.id);
  const savedIdeas = stats?.ideas ?? 0;
  const savedToys = stats?.toys ?? 0;
  const savedGifts = stats?.gifts ?? 0;
  const totalSaved = savedIdeas + savedToys + savedGifts;

  return (
    <div
      id={`child-profile-${child.id}`}
      className="group relative bg-white border-2 border-[#E5E7EB] rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-[#FF6347] focus-within:outline focus-within:outline-2 focus-within:outline-[#FF6347] focus-within:outline-offset-2"
      tabIndex={0}
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#FF8870] to-[#FF6347] flex items-center justify-center shadow-sm">
            <span className="text-white text-xl sm:text-2xl font-medium">
              {initial}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-medium text-[#1A1E23] mb-0.5">
                Little One
              </h3>
              <p className="text-xs sm:text-sm text-[#5C646D]">
                Born {formatBirthMonthYear(child.birthdate)}
              </p>
            </div>
            <GenderIcon
              gender={child.gender as 'female' | 'male' | 'other' | null}
            />
          </div>

          <div className="mb-3">
            <p className="text-sm text-[#5C646D]">
              Age: <span className="font-medium text-[#1A1E23]">{formatAge(child.birthdate)}</span>
            </p>
          </div>

          {totalSaved > 0 && (
            <div className="mb-3 pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-4 text-xs text-[#5C646D]">
                {savedIdeas > 0 && (
                  <span>
                    <strong className="text-[#1A1E23]">{savedIdeas}</strong> ideas
                  </span>
                )}
                {savedToys > 0 && (
                  <span>
                    <strong className="text-[#1A1E23]">{savedToys}</strong> toys
                  </span>
                )}
                {savedGifts > 0 && (
                  <span>
                    <strong className="text-[#1A1E23]">{savedGifts}</strong> gifts
                  </span>
                )}
              </div>
            </div>
          )}

          <Link
            href={`/add-children/${child.id}`}
            className="inline-flex items-center justify-center text-[#FF6347] border border-[#FF6347] hover:bg-[#FFF5F3] hover:text-[#B8432B] hover:border-[#B8432B] transition-all rounded-xl font-medium text-xs sm:text-sm h-8 px-3 w-full sm:w-auto"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
