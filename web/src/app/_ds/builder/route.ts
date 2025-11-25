import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { fetchOneEntry } from "@builder.io/sdk-react";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "/cms/hello2";
  const secret = url.searchParams.get("secret") || "";
  if (process.env.BUILDER_PREVIEW_SECRET && secret === process.env.BUILDER_PREVIEW_SECRET) {
    const dm = await draftMode(); dm.enable();
  }
  try {
    const { isEnabled } = await draftMode();
    const entry = await (fetchOneEntry as any)({
      model: "page",
      apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY!,
      userAttributes: { urlPath: path },
      options: { includeUnpublished: !!isEnabled, cacheSeconds: isEnabled ? 0 : 60 },
    });
    return NextResponse.json({
      ok: true,
      path,
      preview: !!isEnabled,
      hasContent: !!entry,
      id: entry?.id || null,
      lastUpdated: entry?.lastUpdated || null,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
