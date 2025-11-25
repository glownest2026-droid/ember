import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react-nextjs";

export const revalidate = 60;

type Params = { path?: string[] };
type Search = { [key: string]: string | string[] | undefined };

export default async function CmsPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: Search;
}) {
  const { isEnabled } = await draftMode();

  const urlPath = "/" + (params.path?.join("/") ?? "");
  const forcePreview = typeof searchParams?.["builder.preview"] !== "undefined";

  // Try to fetch the matching entry; include drafts if preview mode is on
  const entry = await fetchOneEntry({
    model: "page",
    apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
    userAttributes: { urlPath },
    options: {
      includeUnpublished: !!isEnabled,
      cacheSeconds: isEnabled ? 0 : 60,
    },
  }).catch(() => null);

  // If not previewing AND no entry exists, show a normal 404
  if (!entry && !isEnabled && !forcePreview) {
    return notFound();
  }

  // Always mount <Content> in preview/editing so the editor can handshake
  return (
    <Content
      model="page"
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY!}
      content={entry || undefined}
    />
  );
}
