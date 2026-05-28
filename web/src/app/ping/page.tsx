export const dynamic = "force-static";

/** Static health check — no Supabase, no per-request work. Prefer /__ping for route handlers. */
export default function Ping() {
  return <pre style={{ padding: 16 }}>pong</pre>;
}
