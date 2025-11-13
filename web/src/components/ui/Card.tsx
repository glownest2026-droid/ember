import * as React from "react";
export function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]", className].join(" ")}>{children}</div>;
}
export function CardBody({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4", className].join(" ")}>{children}</div>;
}
export function CardHeader({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={["p-4 border-b border-[var(--color-border)]", className].join(" ")}>{children}</div>;
}
