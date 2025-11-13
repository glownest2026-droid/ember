import * as React from "react";
type Variant = "primary" | "secondary" | "ghost"; type Size = "sm" | "md" | "lg";
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; }
const base = "inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-md)]";
const sizes: Record<Size,string> = { sm:"text-sm px-3 py-1.5", md:"text-sm px-4 py-2", lg:"text-base px-5 py-2.5" };
const variants: Record<Variant,string> = {
  primary:"bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] shadow-[var(--shadow-sm)]",
  secondary:"bg-white text-[var(--color-fg)] border border-[var(--color-border)] hover:bg-[var(--color-brand-50)]",
  ghost:"bg-transparent text-[var(--color-fg)] hover:bg-[var(--color-brand-50)]",
};
export function Button({ variant="primary", size="md", className="", ...props }: Props) {
  return <button className={[base, sizes[size], variants[variant], className].join(" ").trim()} {...props} />;
}
