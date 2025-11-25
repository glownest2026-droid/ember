import type { BuilderContent } from "@builder.io/sdk-react";
import { BuilderPageClient } from "../BuilderPageClient";

const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";

export default async function Page(props: { params: Promise<{ path?: string[] }> }) {
  const { path } = await props.params;

  // rawPath is whatever comes after /cms, e.g. "/lego-kit-demo"
  const urlPath = "/" + (path?.join("/") ?? "");

  let content: BuilderContent | null = null;
  let builderError: string | null = null;

  if (apiKey) {
    try {
      const sdk = await import("@builder.io/sdk-react");
      const fetchOneEntry: any = (sdk as any).fetchOneEntry;

      if (typeof fetchOneEntry === "function") {
        content = await fetchOneEntry({
          model: "page",
          apiKey,
          userAttributes: { urlPath },
        });
      } else {
        builderError = "fetchOneEntry not found in @builder.io/sdk-react exports";
      }
    } catch (err: unknown) {
      builderError =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : (() => {
              try {
                return JSON.stringify(err);
              } catch {
                return String(err);
              }
            })();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <BuilderPageClient
        apiKey={apiKey}
        content={content}
        urlPath={urlPath}
        builderError={builderError}
      />
    </main>
  );
}
