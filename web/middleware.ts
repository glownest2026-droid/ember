import { NextResponse } from "next/server";
export function middleware(req: Request) {
  const url = new URL(req.url);
  if (!url.pathname.startsWith("/cms")) return NextResponse.next();

  const secret = url.searchParams.get("secret");
  const pathParam = url.searchParams.get("path");

  if (secret) {
    const needsFallback = !pathParam || /[{]/.test(pathParam);
    const effectivePath = needsFallback ? url.pathname : pathParam!;
    const normalizedPath = effectivePath.startsWith("/") ? effectivePath : `/${effectivePath}`;
    const dest = new URL("/api/preview", url.origin);
    dest.searchParams.set("secret", secret);
    dest.searchParams.set("path", normalizedPath);
    return NextResponse.redirect(dest, 307);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/cms/:path*"] };
