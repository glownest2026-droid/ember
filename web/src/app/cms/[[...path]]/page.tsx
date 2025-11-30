export const dynamic = "force-dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";

type Params = { path?: string[] };
type Search = { [key: string]: string | string[] | undefined };

function isBuilderPreview(sp?: Search): boolean {
  if (!sp) return false;
  const keys = Object.keys(sp);
  if (!keys.length) return false;
  // Normalise keys so we match builder.preview / builder_preview / builderPreview, etc.
  const norm = keys.map(k => k.toLowerCase().replace(/[^a-z]/g, "")); // drop dots/underscores/hyphens
  return norm.includes("builderpreview");
}

export default async function CmsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Search;
}) {
  // Keep the /cms prefix so it matches Builder entry URLs like /cms/hello2
  const suffix = params.path?.length ? `/${params.path.join("/")}` : "";
  const urlPath = `/cms${suffix}`;

  const dm = await draftMode();
  const includeDrafts = dm.isEnabled || isBuilderPreview(searchParams);

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
    // ignore; we'll still mount <Content/> so the editor can load
  }

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
