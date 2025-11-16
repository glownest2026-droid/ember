import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = new URL(req.url);

  // Only care about /cms/* requests
  if (!url.pathname.startsWith("/cms")) {
    return NextResponse.next();
  }

  const secret = url.searchParams.get("secret");
  const pathParam = url.searchParams.get("path");

  // If the editor hit /cms/* with a ?secret=... (missing /api/preview),
  // redirect to our proper preview endpoint.
  if (secret) {
    // If path is missing or contains braces (e.g. {{content.data.url}}),
    // use the actual pathname the editor is viewing.
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

// Only run on /cms/*
export const config = {
  matcher: ["/cms/:path*"],
};
