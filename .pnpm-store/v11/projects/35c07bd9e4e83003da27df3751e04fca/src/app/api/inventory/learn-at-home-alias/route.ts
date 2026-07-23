import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

/** POST /api/inventory/learn-at-home-alias — parent confirmed match; teach catalogue. */
export async function POST(request: NextRequest) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { query?: string; productTypeId?: string };
  try {
    body = (await request.json()) as { query?: string; productTypeId?: string };
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = (body.query ?? "").trim();
  const productTypeId = (body.productTypeId ?? "").trim();

  if (!query || !productTypeId) {
    return json({ error: "query and productTypeId are required." }, { status: 400 });
  }

  const { data: productType } = await supabase
    .from("product_types")
    .select("id")
    .eq("id", productTypeId)
    .eq("is_active", true)
    .maybeSingle();

  if (!productType?.id) {
    return json({ error: "Product type not found." }, { status: 404 });
  }

  const { error } = await supabase.from("product_type_aliases").insert({
    product_type_id: productTypeId,
    alias: query,
  });

  if (error) {
    if (error.code === "23505") {
      return json({ learned: true, duplicate: true }, { status: 200 });
    }
    return json({ error: error.message }, { status: 500 });
  }

  return json({ learned: true, duplicate: false }, { status: 200 });
}
