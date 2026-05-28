import { notFound } from "next/navigation";
import { isProduction } from "@/lib/runtime-guards";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function Diag() {
  if (isProduction()) notFound();

  return <pre style={{ padding: 16 }}>cms/_diag OK</pre>;
}
