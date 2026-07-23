import { NextRequest } from "next/server";
import { blockConversation } from "@/lib/marketplace/marketplace-conversation-service";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { supabase, json } = createClient(request);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { conversationId } = await params;
  if (!conversationId) return json({ error: "Conversation id is required." }, { status: 400 });

  let body: { reason?: string } = {};
  try {
    const raw = await request.text();
    if (raw) body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await blockConversation(supabase, conversationId, user.id, body.reason);
  if ("error" in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json({ ok: true, message: "User blocked for this conversation." }, { status: 200 });
}
