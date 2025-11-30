import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Start with a base response
  const res = NextResponse.next();

  // 1) Always add CSP for /cms and /api/preview (for Builder iframe)
  if (pathname === "/api/preview" || pathname === "/cms" || pathname.startsWith("/cms/")) {
    res.headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.builder.io https://builder.io https://app.builder.io"
    );
  }

  // 2) Only run preview redirect logic for /cms...
  if (!pathname.startsWith("/cms")) {
    return res;
  }

  const secret = url.searchParams.get("secret");
  const pathParam = url.searchParams.get("path");

  if (secret) {
    const needsFallback = !pathParam || /[{]/.test(pathParam);
    const effectivePath = needsFallback ? pathname : pathParam!;
    const normalizedPath = effectivePath.startsWith("/") ? effectivePath : `/${effectivePath}`;

    const dest = new URL("/api/preview", url);
    dest.searchParams.set("secret", secret);
    dest.searchParams.set("path", normalizedPath);

    return NextResponse.redirect(dest, 307);
  }

  return res;
}

export const config = {
  matcher: ["/cms/:path*", "/api/preview"],
};
