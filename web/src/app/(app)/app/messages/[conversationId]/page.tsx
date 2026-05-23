"use client";

import { MarketplaceConversationThread } from "@/components/marketplace/MarketplaceConversationThread";
import { use } from "react";

export default function AppConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  return <MarketplaceConversationThread conversationId={conversationId} />;
}
