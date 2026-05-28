export const dynamic = "force-static";

/** Minimal edge-friendly liveness probe (no DB, no auth). */
export async function GET() {
  return new Response("ok", {
    status: 200,
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
