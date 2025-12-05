export const dynamic = "force-dynamic";
export const revalidate = 0;

import { headers } from "next/headers";

export default async function WhoAmIPage() {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "unknown";

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>whoami debug</h1>
      <pre
        style={{
          fontSize: 12,
          whiteSpace: "pre-wrap",
          background: "#0f172a",
          color: "#e5e7eb",
          padding: 12,
          borderRadius: 8,
        }}
      >
        {JSON.stringify(
          {
            now: new Date().toISOString(),
            userAgent,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}
