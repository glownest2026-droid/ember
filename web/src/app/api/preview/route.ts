import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/** /api/preview?secret=...&path=/cms/hello2 -> 307 to /cms/hello2?builder.preview=true */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || "";
  const path = url.searchParams.get("path") || "/cms";

  if (!process.env.BUILDER_PREVIEW_SECRET || secret !== process.env.BUILDER_PREVIEW_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  const dest = new URL(path, url.origin);
  dest.searchParams.set("builder.preview", "true");
  return NextResponse.redirect(dest, { status: 307 });
}
