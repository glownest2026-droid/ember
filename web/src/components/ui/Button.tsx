import * as React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center font-medium transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-md)]";

const sizes: Record<Size,string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

const variants: Record<Variant,string> = {
  primary: "bg-[var(--brand-primary)] text-[var(--brand-text)] hover:opacity-90 shadow-sm hover:shadow-md",
  secondary: "bg-[var(--brand-surface)] text-[var(--brand-text)] border border-[var(--brand-border)] hover:bg-[var(--brand-bg)]",
  ghost: "bg-transparent text-[var(--brand-text)] hover:bg-[var(--brand-bg)]",
};

export function Button({ variant="primary", size="md", className="", ...props }: Props) {
  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(" ").trim()}
      {...props}
    />
  );
}
