import { NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/runtime-guards";

export const runtime = "nodejs";

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE!;

type ProductRow = { id: string; deep_link_url: string | null };

async function fetchBatch(limit = 100): Promise<ProductRow[]> {
  const url = `${supabaseUrl}/rest/v1/products?select=id,deep_link_url&limit=${limit}`;
  const res = await fetch(url, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function check(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const r = await fetch(url, { method: "HEAD", redirect: "manual" });
    if (r.ok) return { ok: true, status: r.status };
    const g = await fetch(url, { method: "GET", redirect: "follow" });
    return { ok: g.ok, status: g.status };
  } catch { return { ok: false, status: 0 }; }
}

async function insertCheck(product_id: string, ok: boolean, status: number) {
  await fetch(`${supabaseUrl}/rest/v1/link_checks`, {
    method: "POST",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, ok, status_code: status }),
  }).catch(() => {});
}

async function setFlag(product_id: string, status: "healthy" | "unhealthy") {
  await fetch(`${supabaseUrl}/rest/v1/product_flags`, {
    method: "POST",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      product_id,
      status,
      unhealthy_since: status === "unhealthy" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }),
  }).catch(() => {});
}

export async function GET(req: Request) {
  const denied = requireCronSecret(req);
  if (denied) return denied;

  const batch = await fetchBatch(100);
  for (const p of batch) {
    if (!p.deep_link_url) continue;
    const res = await check(p.deep_link_url);
    await insertCheck(p.id, res.ok, res.status);
    await setFlag(p.id, res.ok ? "healthy" : "unhealthy");
  }
  return NextResponse.json({ ok: true, checked: batch.length });
}
