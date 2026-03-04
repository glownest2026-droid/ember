'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatBirthMonthYear, formatAge, getAvatarInitial } from './utils';

/** Ember child from DB. child_name/display_name optional (what parent calls them). */
export interface FamilyChild {
  id: string;
  birthdate: string | null;
  gender: string | null;
  age_band: string | null;
  child_name?: string | null;
  display_name?: string | null;
}

/** Per-child stats from get_my_subnav_stats(p_child_id). */
export interface ChildStats {
  ideas: number;
  toys: number;
  gifts: number;
}

const buttonClass =
  'inline-flex items-center justify-center text-[#FF6347] border border-[#FF6347] hover:bg-[#FFF5F3] hover:text-[#B8432B] hover:border-[#B8432B] transition-all rounded-xl font-medium text-xs sm:text-sm h-8 px-3';

type ChildProfileCardProps = {
  child: FamilyChild;
  stats?: ChildStats | null;
  onRemove?: (id: string) => void | Promise<void>;
};

/** Single child card. No top-right icon. Edit + Remove (with confirm modal). */
export function ChildProfileCard({ child, stats, onRemove }: ChildProfileCardProps) {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removing, setRemoving] = useState(false);
  const displayName = (child.child_name || child.display_name)?.trim() || 'Little One';
  const initial = displayName !== 'Little One'
    ? displayName.charAt(0).toUpperCase()
    : getAvatarInitial(child.id);
  const savedIdeas = stats?.ideas ?? 0;
  const savedToys = stats?.toys ?? 0;
  const savedGifts = stats?.gifts ?? 0;
  const totalSaved = savedIdeas + savedToys + savedGifts;

  const handleRemoveConfirm = async () => {
    if (!onRemove) return;
    setRemoving(true);
    try {
      await onRemove(child.id);
      setShowRemoveModal(false);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
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
            <div className="mb-3">
              <h3 className="text-lg sm:text-xl font-medium text-[#1A1E23] mb-0.5">
                {displayName}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C646D]">
                Born {formatBirthMonthYear(child.birthdate)}
              </p>
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

            <div className="flex flex-wrap gap-2">
              <Link href={`/add-children/${child.id}`} className={buttonClass}>
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setShowRemoveModal(true)}
                className={buttonClass}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRemoveModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-modal-title"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-[#E5E7EB]">
            <h2 id="remove-modal-title" className="text-lg font-medium text-[#1A1E23] mb-3">
              Are you sure?
            </h2>
            <p className="text-sm text-[#5C646D] mb-4">
              This child will be removed from your account.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowRemoveModal(false)}
                disabled={removing}
                className="px-4 py-2 rounded-xl font-medium text-sm border border-[#E5E7EB] text-[#1A1E23] hover:bg-gray-50"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleRemoveConfirm}
                disabled={removing}
                className={buttonClass + ' min-w-[4rem]'}
              >
                {removing ? '…' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
