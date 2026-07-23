import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { requireBuilderPreviewSecret } from "@/lib/runtime-guards";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret") || "";
  const path = url.searchParams.get("path") || "/";

  const denied = requireBuilderPreviewSecret(secret);
  if (denied) return denied;

  const dm = await draftMode();
  dm.enable();

  const dest = new URL(path, url.origin);
  dest.searchParams.set("builder.preview", "true");
  return NextResponse.redirect(dest, { status: 307 });
}
