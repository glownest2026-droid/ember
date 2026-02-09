'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

interface SaveToListModalProps {
  open: boolean;
  onClose: () => void;
  signedIn: boolean;
  signinUrl: string;
  /** Called on close to restore focus */
  onCloseFocusRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Accessible modal for "Save to my list" CTA.
 * - Signed out: Sign in + Join free links, Not now button
 * - Signed in: "Saved" confirmation + View my list link
 * Uses native <dialog> for focus trap and ESC.
 */
export function SaveToListModal({
  open,
  onClose,
  signedIn,
  signinUrl,
  onCloseFocusRef,
}: SaveToListModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    onCloseFocusRef?.current?.focus?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 w-full max-w-lg mx-auto max-h-[90vh] my-auto p-0 rounded-xl border shadow-lg backdrop:bg-black/40"
      style={{
        borderColor: 'var(--ember-border-subtle)',
        backgroundColor: 'var(--ember-surface-primary)',
      }}
      aria-labelledby="save-modal-title"
      aria-describedby="save-modal-desc"
    >
      <div className="p-6">
        <h2
          id="save-modal-title"
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--ember-text-high)' }}
        >
          {signedIn ? 'Saved to your list' : 'Save to your list'}
        </h2>
        <p
          id="save-modal-desc"
          className="text-sm mb-4"
          style={{ fontFamily: 'var(--font-sans)', color: 'var(--ember-text-low)' }}
        >
          {signedIn
            ? 'You can find this in your recommendations.'
            : 'Sign in to save ideas and build your list.'}
        </p>
        <div className="flex flex-col gap-2">
          {signedIn ? (
            <Link
              href="/app/recs"
              onClick={handleClose}
              className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
              style={{
                borderColor: 'var(--ember-border-subtle)',
                backgroundColor: 'var(--ember-accent-base)',
                color: 'white',
              }}
            >
              View my list
            </Link>
          ) : (
            <>
              <Link
                href={signinUrl}
                onClick={handleClose}
                className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-accent-base)',
                  color: 'white',
                }}
              >
                Sign in
              </Link>
              <Link
                href={signinUrl}
                onClick={handleClose}
                className="min-h-[40px] rounded-lg border font-medium text-sm flex items-center justify-center"
                style={{
                  borderColor: 'var(--ember-border-subtle)',
                  backgroundColor: 'var(--ember-surface-primary)',
                  color: 'var(--ember-text-high)',
                }}
              >
                Join free
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[40px] rounded-lg border font-medium text-sm"
            style={{
              borderColor: 'var(--ember-border-subtle)',
              backgroundColor: 'var(--ember-surface-primary)',
              color: 'var(--ember-text-low)',
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </dialog>
  );
}
