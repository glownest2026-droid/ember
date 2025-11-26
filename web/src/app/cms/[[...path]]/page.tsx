export const dynamic = "force-dynamic";

import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";

type Params = { path?: string[] };
type Search = { [key: string]: string | string[] | undefined };

export default async function CmsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Search;
}) {
  const urlPath = "/" + (params.path?.join("/") ?? "");

  // Preview is true if either the Next draft cookie is set OR the URL includes ?builder.preview
  const dm = await draftMode();
  const isCookiePreview = dm.isEnabled;
  const isQueryPreview = typeof searchParams?.["builder.preview"] !== "undefined";
  const includeDrafts = isCookiePreview || isQueryPreview;

  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;
  let entry: any = null;

  try {
    entry = await fetchOneEntry({
      model: "page",
      apiKey,
      userAttributes: { urlPath },
      options: { includeUnpublished: includeDrafts, cacheSeconds: includeDrafts ? 0 : 60 },
    });
  } catch {
    // swallow; we'll still mount <Content/> so the editor can load
  }

  // If not previewing and we truly have no entry, return 404
  if (!entry && !includeDrafts) return notFound();

  return (
    <div style={{ minHeight: "50vh" }}>
      <Content model="page" apiKey={apiKey} content={entry || undefined} />
      {!entry && includeDrafts && (
        <div style={{ padding: 16, opacity: 0.6 }}>
          Builder preview mode — no content yet. Drop a block in the editor.
        </div>
      )}
    </div>
  );
}
