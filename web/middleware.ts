import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "./src/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Refresh session for ALL routes (allows cookie mutation in middleware)
  // This prevents server components from trying to mutate cookies
  const { supabase, response } = await updateSession(req);
  
  // Add pathname to headers so server components can read it
  response.headers.set('x-pathname', pathname);

  // 1) Protect /app/* routes - require authentication
  if (pathname.startsWith("/app")) {
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
  // Add CSP for Builder iframe
  if (pathname === "/api/preview" || pathname === "/cms" || pathname.startsWith("/cms/")) {
    response.headers.set(
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

  // Return response with refreshed session cookies for all routes
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
