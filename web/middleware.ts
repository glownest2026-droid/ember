import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "./src/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 1) Protect /app/* routes - require authentication
  if (pathname.startsWith("/app")) {
    const { supabase, response } = await updateSession(req);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Redirect unauthenticated users to sign in
      const signInUrl = new URL("/signin", url.origin);
      // Preserve original pathname and search params in next parameter
      signInUrl.searchParams.set("next", pathname + url.search);
      return NextResponse.redirect(signInUrl);
    }

    // User is authenticated, continue with session refresh
    return response;
  }

  // 2) Handle /cms and /api/preview routes (Builder CMS)
  const res = NextResponse.next();

  // Add CSP for Builder iframe
  if (pathname === "/api/preview" || pathname === "/cms" || pathname.startsWith("/cms/")) {
    res.headers.set(
      "Content-Security-Policy",
      "frame-ancestors 'self' https://*.builder.io https://builder.io https://app.builder.io"
    );
  }

  // Handle preview redirect logic for /cms...
  if (pathname.startsWith("/cms")) {
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
  }

  return res;
}

export const config = {
  matcher: ["/app/:path*", "/cms/:path*", "/api/preview"],
};
