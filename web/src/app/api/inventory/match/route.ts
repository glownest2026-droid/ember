import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

function parseLimit(value: string | null): number {
  const parsed = Number(value ?? "5");
  if (!Number.isFinite(parsed)) return 5;
  return Math.max(1, Math.min(20, Math.floor(parsed)));
}

/** Copy Set-Cookie headers from Supabase session refresh onto the JSON response. */
function jsonWithSessionCookies(
  supabaseResponse: NextResponse,
  body: unknown,
  init?: ResponseInit
): NextResponse {
  const out = NextResponse.json(body, init);
  for (const cookie of supabaseResponse.headers.getSetCookie()) {
    out.headers.append("Set-Cookie", cookie);
  }
  return out;
}

/** GET /api/inventory/match?q=...&limit=5 */
export async function GET(request: NextRequest) {
  // Route Handlers must not use NextResponse.next() (middleware-only). Use a JSON
  // response as the cookie jar, same idea as NextResponse.redirect in auth/callback.
  const supabaseResponse = NextResponse.json({});
  const supabase = createClient(request, supabaseResponse);

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return jsonWithSessionCookies(
        supabaseResponse,
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();
    const limit = parseLimit(searchParams.get("limit"));

    if (!query) {
      return jsonWithSessionCookies(supabaseResponse, { candidates: [] }, { status: 200 });
    }

    const { data, error } = await supabase.rpc("inventory_match_product_types", {
      query_text: query,
      p_limit: limit,
    });

    if (error) {
      return jsonWithSessionCookies(
        supabaseResponse,
        { error: error.message },
        { status: 500 }
      );
    }

    const candidates = (data ?? []).map(
      (row: {
        id: string;
        slug: string;
        label: string;
        subtitle: string | null;
        confidence_bucket: "high" | "medium" | "low";
      }) => ({
        id: row.id,
        slug: row.slug,
        label: row.label,
        subtitle: row.subtitle,
        confidence_bucket: row.confidence_bucket,
      })
    );

    const { error: insertError } = await supabase.from("inventory_search_events").insert({
      user_id: user.id,
      raw_query: query,
      selected_product_type_id: null,
      confidence_bucket: candidates[0]?.confidence_bucket ?? null,
      was_confirmed: false,
    });

    if (insertError) {
      return jsonWithSessionCookies(
        supabaseResponse,
        { error: insertError.message },
        { status: 500 }
      );
    }

    return jsonWithSessionCookies(supabaseResponse, { candidates }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/inventory/match]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
