import { NextRequest } from "next/server";
import { getConversationDetail } from "@/lib/marketplace/marketplace-conversation-service";
import { createClient } from "@/utils/supabase/route-handler";

export const dynamic = "force-dynamic";

export async function GET(
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

  const markRead = request.nextUrl.searchParams.get("mark_read") !== "0";
  const result = await getConversationDetail(supabase, conversationId, user.id, markRead);
  if ("error" in result) {
    return json({ error: result.error }, { status: result.status });
  }

  return json({ conversation: result }, { status: 200 });
}
