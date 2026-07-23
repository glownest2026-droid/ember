import type { ReactNode } from "react";
import { layout, space } from "./tokens";

type BlockShellProps = {
  children: ReactNode;
  background?: "default" | "alt";
  id?: string;
};

export function BlockShell({ children, background = "default", id }: BlockShellProps) {
  const bgClass =
    background === "alt"
      ? "bg-slate-50"
      : "bg-white";

  return (
    <section id={id} className={bgClass}>
      <div
        className="mx-auto px-4 md:px-6"
        style={{ maxWidth: layout.maxWidth, paddingTop: space.xl, paddingBottom: space.xl }}
      >
        {children}
      </div>
    </section>
  );
}
