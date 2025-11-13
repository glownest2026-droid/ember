import * as React from "react";
type Level = 1 | 2 | 3 | 4;
export function Heading({ level=2, children, className="" }: { level?: Level; children: React.ReactNode; className?: string }) {
  const Tag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
  const sizes: Record<Level,string> = { 1:"text-2xl md:text-3xl font-semibold", 2:"text-xl md:text-2xl font-semibold", 3:"text-lg md:text-xl font-semibold", 4:"text-base md:text-lg font-semibold" };
  return <Tag className={[sizes[level], className].join(" ")}>{children}</Tag>;
}
