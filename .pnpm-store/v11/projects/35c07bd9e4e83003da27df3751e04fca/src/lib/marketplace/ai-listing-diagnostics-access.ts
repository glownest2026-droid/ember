import "server-only";

export type DiagnosticsAccessDeniedReason = "disabled" | "unauthorized" | "forbidden";

/** Preview/development, or explicit AI_LISTING_DIAGNOSTICS_ENABLED=true. */
export function isAiListingDiagnosticsEnabled(): boolean {
  const flag = process.env.AI_LISTING_DIAGNOSTICS_ENABLED?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (process.env.NODE_ENV === "development") return true;
  const vercelEnv = process.env.VERCEL_ENV?.trim().toLowerCase();
  return vercelEnv === "preview" || vercelEnv === "development";
}

export function getDiagnosticsAccessDeniedReason(args: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}): DiagnosticsAccessDeniedReason | null {
  if (!isAiListingDiagnosticsEnabled()) return "disabled";
  if (!args.isAuthenticated) return "unauthorized";
  if (!args.isAdmin) return "forbidden";
  return null;
}
