export const dynamic = "force-dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";

type Params = { path?: string[] };
type Search = { [key: string]: string | string[] | undefined };

function isPreview(sp?: Search): boolean {
  if (!sp) return false;
  const keys = Object.keys(sp);
  const norm = keys.map(k => k.toLowerCase().replace(/[^a-z]/g, ""));
  return norm.includes("builderpreview");
}

export default async function CmsPage(props: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { path } = await props.params;
  const search = await props.searchParams;

  // Ensure URLs like /cms/hello2 map to Builder urlPath "/cms/hello2"
  const suffix = path?.length ? `/${path.join("/")}` : "";
  const urlPath = `/cms${suffix}`;

  const dm = await draftMode();
  const includeDrafts = dm.isEnabled || isPreview(search);

  const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";

  let entry: any = null;
  if (apiKey) {
    try {
      entry = await fetchOneEntry({
        model: "page",
        apiKey,
        userAttributes: { urlPath },
        options: { includeUnpublished: includeDrafts, cacheSeconds: includeDrafts ? 0 : 60 },
      });
    } catch {
      // ignore fetch errors so preview never crashes
    }
  }

  // Preview ALWAYS returns 200 so the editor can load
  if (includeDrafts) {
    return (
      <div style={{ minHeight: "50vh", padding: 16 }}>
        <Content model="page" apiKey={apiKey} content={entry || undefined} />
        {!apiKey && <div style={{opacity:0.7, marginTop:12}}>Missing NEXT_PUBLIC_BUILDER_API_KEY</div>}
        {apiKey && !entry && <div style={{opacity:0.7, marginTop:12}}>No entry yet for {urlPath}</div>}
      </div>
    );
  }

  // Published mode: only show when Builder has content
  if (entry) {
    return <Content model="page" apiKey={apiKey} content={entry} />;
  }

  return notFound();
}
