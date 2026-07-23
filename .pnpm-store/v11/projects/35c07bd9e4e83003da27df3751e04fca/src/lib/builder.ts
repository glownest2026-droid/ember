import { fetchOneEntry } from "@builder.io/sdk-react-nextjs";
import { draftMode } from "next/headers";

export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

/** Fetch a "page" entry matching the URL path. Includes drafts if preview is on. */
export async function getBuilderPage(urlPath: string) {
  if (!BUILDER_API_KEY) return null;

  const { isEnabled } = await draftMode();
  const isPreview = !!isEnabled;

  try {
    const entry = await (fetchOneEntry as any)({
      model: "page",
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath },
      options: { includeUnpublished: isPreview, cacheSeconds: isPreview ? 0 : 60 },
    });
    return entry;
  } catch {
    return null;
  }
}
