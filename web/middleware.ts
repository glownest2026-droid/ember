import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const p = req.nextUrl.pathname;

  if (p === "/api/preview" || p === "/cms" || p.startsWith("/cms/")) {
    res.headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.builder.io https://builder.io https://app.builder.io"
    );
  }

  return res;
}

export const config = {
  matcher: ["/cms/:path*", "/api/preview"],
};
