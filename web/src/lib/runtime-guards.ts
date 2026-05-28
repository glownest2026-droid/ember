import { NextResponse } from "next/server";

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/** Cheap 404 for disabled diagnostic/cron surfaces (safe to cache at the edge). */
export function productionNotFoundResponse(): NextResponse {
  return new NextResponse(null, {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}

/** Block debug pages/routes in production (no env vars required). */
export function denyInProduction(): NextResponse | null {
  if (isProduction()) return productionNotFoundResponse();
  return null;
}

/**
 * Cron must never run without CRON_SECRET — fail closed when unset (any env).
 * When set, require `Authorization: Bearer <CRON_SECRET>`.
 */
export function requireCronSecret(req: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return productionNotFoundResponse();
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null;
}

/**
 * Builder preview/probe — fail closed in production when BUILDER_PREVIEW_SECRET is unset.
 * When set, require exact secret match.
 */
export function requireBuilderPreviewSecret(
  provided: string | null | undefined
): NextResponse | null {
  const expected = process.env.BUILDER_PREVIEW_SECRET;
  if (!expected) {
    return isProduction()
      ? productionNotFoundResponse()
      : new NextResponse("Preview disabled", { status: 401 });
  }
  if ((provided ?? "") !== expected) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return null;
}
