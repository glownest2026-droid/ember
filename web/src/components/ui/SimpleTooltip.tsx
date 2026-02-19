'use client';

import * as React from 'react';
import { useState } from 'react';

interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  /** Min width so text wraps in 2-3 lines; use same as width for fixed width. */
  minWidth?: string;
  maxWidth?: string;
}

/**
 * Accessible tooltip: opens on hover and focus; z-[60] for use above navbars.
 */
export function SimpleTooltip({ content, children, minWidth = '20rem', maxWidth = '24rem' }: SimpleTooltipProps) {
  const [open, setOpen] = useState(false);

  const trigger = React.cloneElement(children, {
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false),
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    'aria-describedby': open ? 'simple-tooltip-content' : undefined,
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open && (
        <span
          id="simple-tooltip-content"
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 z-[60] px-3 py-2 rounded-lg text-sm text-white whitespace-normal shadow-lg pointer-events-none"
          style={{
            backgroundColor: '#1A1E23',
            minWidth,
            maxWidth: maxWidth || '95vw',
            width: minWidth,
            boxSizing: 'border-box',
            top: 'calc(100% + 8px)',
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
