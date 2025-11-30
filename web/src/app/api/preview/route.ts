import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || "";
  const path = url.searchParams.get("path") || "/";

  if (process.env.BUILDER_PREVIEW_SECRET && secret !== process.env.BUILDER_PREVIEW_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  const dest = new URL(path, url.origin);
  dest.searchParams.set("builder.preview", "true");
  return NextResponse.redirect(dest, { status: 307 });
}
