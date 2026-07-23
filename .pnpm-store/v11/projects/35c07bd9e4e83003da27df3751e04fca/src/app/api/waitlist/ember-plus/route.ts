import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const { supabase, json } = createClient(request);

  let body: { email?: string; source?: string } = {};
  try {
    const raw = await request.text();
    if (raw) body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const source =
    typeof body.source === "string" && body.source.trim()
      ? body.source.trim().slice(0, 64)
      : "pricing";

  let email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!email && user?.email) email = normalizeEmail(user.email);

  if (!email || !EMAIL_RE.test(email)) {
    return json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Own-row select (authenticated) or insert attempt for everyone.
  if (user) {
    const { data: own } = await supabase
      .from("ember_plus_waitlist")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (own) {
      return json({ ok: true, already: true }, { status: 200 });
    }
  }

  const { error: insertError } = await supabase.from("ember_plus_waitlist").insert({
    email,
    user_id: user?.id ?? null,
    source,
  });

  if (insertError) {
    // Unique on lower(email) — treat as already joined (also covers race).
    if (insertError.code === "23505") {
      return json({ ok: true, already: true }, { status: 200 });
    }
    console.error("[waitlist/ember-plus] insert", insertError);
    return json(
      { error: "Could not join the waitlist. Please try again." },
      { status: 500 }
    );
  }

  return json({ ok: true, already: false }, { status: 201 });
}
