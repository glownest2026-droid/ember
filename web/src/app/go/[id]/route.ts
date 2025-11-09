import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE!;
const defaultUtm  = process.env.AFFILIATE_DEFAULT_UTM || "utm_source=ember&utm_medium=affiliate&utm_campaign=default";

type Product = { id: string; name: string; deep_link_url: string | null };

async function fetchProduct(id: string): Promise<Product | null> {
  const url = `${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(id)}&select=id,name,deep_link_url&limit=1`;
  const res = await fetch(url, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }, cache: "no-store" });
  if (!res.ok) return null;
  const rows = await res.json();
  return rows?.[0] || null;
}

function mergeUtms(req: NextRequest): URLSearchParams {
  const merged = new URLSearchParams(defaultUtm);
  const incoming = req.nextUrl.searchParams;
  ["utm_source","utm_medium","utm_campaign"].forEach((k) => {
    const v = incoming.get(k);
    if (v) merged.set(k, v);
  });
  const src = incoming.get("src");
  if (src) merged.set("src", src);
  return merged;
}

function decorateUrl(deep: string, utms: URLSearchParams): string {
  const u = new URL(deep);
  utms.forEach((v, k) => u.searchParams.set(k, v));
  return u.toString();
}

function hashIp(ip?: string) {
  if (!ip) return "na";
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

async function insertClick(params: {
  product_id: string;
  decorated_url: string;
  referer: string | null;
  user_agent: string | null;
  ip_hash: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  src: string | null;
}) {
  await fetch(`${supabaseUrl}/rest/v1/click_events`, {
    method: "POST",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(params),
  }).catch(() => {});
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);
  if (!product?.deep_link_url) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const utms = mergeUtms(req);
  const finalUrl = decorateUrl(product.deep_link_url, utms);

  const referer = req.headers.get("referer");
  const ua = req.headers.get("user-agent");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || (req as any).ip || undefined;

  insertClick({
    product_id: product.id,
    decorated_url: finalUrl,
    referer,
    user_agent: ua,
    ip_hash: hashIp(ip),
    utm_source: utms.get("utm_source"),
    utm_medium: utms.get("utm_medium"),
    utm_campaign: utms.get("utm_campaign"),
    src: utms.get("src"),
  });

  return NextResponse.redirect(finalUrl, { status: 302 });
}
