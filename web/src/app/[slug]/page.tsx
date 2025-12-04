import { redirect } from "next/navigation";
import type { BuilderContent } from "@builder.io/sdk-react";
import { BuilderPageClient } from "../cms/BuilderPageClient";

const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await props.params;
  const search = await props.searchParams;

  // Detect Builder preview (they always send ?builder.preview=true)
  const previewVal = search["builder.preview"];
  const isBuilderPreview = Array.isArray(previewVal)
    ? previewVal.includes("true")
    : previewVal === "true";

  // If it's a Builder preview, bounce to /cms/<slug>?builder.preview=true (plus any other params)
  if (isBuilderPreview) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
      if (Array.isArray(value)) {
        for (const v of value) qs.append(key, v);
      } else if (typeof value === "string") {
        qs.append(key, value);
      }
    }
    const queryString = qs.toString();
    const dest = `/cms/${slug}${queryString ? `?${queryString}` : ""}`;
    redirect(dest);
  }

  // Real visitors: render the CMS page directly at /<slug> (no redirect)
  const urlPath = `/${slug}`;

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
