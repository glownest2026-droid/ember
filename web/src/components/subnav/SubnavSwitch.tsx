'use client';

interface SubnavSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Larger hit target for reminder topic matrix on /family. */
  size?: 'default' | 'comfortable';
  'aria-label'?: string;
}

/** Minimal toggle switch for subnav reminders. No external deps. */
export function SubnavSwitch({
  checked,
  onCheckedChange,
  disabled,
  size = 'default',
  'aria-label': ariaLabel,
}: SubnavSwitchProps) {
  const comfortable = size === 'comfortable';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? 'Toggle development reminders'}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      data-subnav-reminders-switch
      data-subnav-switch-size={size}
      className={
        comfortable
          ? 'inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-2 pointer-events-auto disabled:opacity-45'
          : 'inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#B8432B] focus-visible:ring-offset-1 pointer-events-auto disabled:opacity-50'
      }
      style={{
        backgroundColor: checked ? '#B8432B' : 'var(--ember-border-subtle, #E5E7EB)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        className={
          comfortable
            ? 'block size-[1.125rem] rounded-full bg-white shadow-sm transition-transform pointer-events-none'
            : 'block size-4 rounded-full bg-white shadow-sm transition-transform pointer-events-none'
        }
        style={{
          transform: comfortable
            ? checked
              ? 'translateX(26px)'
              : 'translateX(4px)'
            : checked
              ? 'translateX(calc(100% - 2px))'
              : 'translateX(2px)',
        }}
      />
    </button>
  );
}
