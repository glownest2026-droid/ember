import { NextRequest } from "next/server";
import { reportConversation } from "@/lib/marketplace/marketplace-conversation-service";
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

  let body: { reason?: string; details?: string } = {};
  try {
    const raw = await request.text();
    if (raw) body = JSON.parse(raw) as typeof body;
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await reportConversation(
    supabase,
    conversationId,
    user.id,
    body.reason,
    body.details
  );
  if ("error" in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json({ ok: true, message: "Report submitted. Thank you." }, { status: 200 });
}
