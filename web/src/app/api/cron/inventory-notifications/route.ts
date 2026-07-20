import { NextResponse } from "next/server";
import { runPassOnPromptScan } from "@/lib/inventory/inventory-notification-dispatch";
import { createMarketplaceServiceClient } from "@/lib/marketplace/marketplace-service-client";
import { requireCronSecret } from "@/lib/runtime-guards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Cron: queue + dispatch Pass-On prompts for ready_to_move_on inventory. */
export async function POST(req: Request) {
  const denied = requireCronSecret(req);
  if (denied) return denied;

  const service = createMarketplaceServiceClient();
  if (!service) {
    return NextResponse.json({ error: "Service client unavailable." }, { status: 503 });
  }

  const result = await runPassOnPromptScan(service, 40);
  return NextResponse.json({ ok: true, ...result });
}
