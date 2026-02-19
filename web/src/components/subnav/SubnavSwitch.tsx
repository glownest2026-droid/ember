'use client';

interface SubnavSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

/** Minimal toggle switch for subnav reminders. No external deps. */
export function SubnavSwitch({ checked, onCheckedChange, disabled, 'aria-label': ariaLabel }: SubnavSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle development reminders'}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className="inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        backgroundColor: checked ? '#B8432B' : 'var(--ember-border-subtle, #E5E7EB)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        className="block size-4 rounded-full bg-white shadow-sm transition-transform pointer-events-none"
        style={{
          transform: checked ? 'translateX(calc(100% - 2px))' : 'translateX(2px)',
        }}
      />
    </button>
  );
}
