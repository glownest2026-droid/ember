"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ConversationSummary } from "@/lib/marketplace/conversation-types";

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function AppMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/marketplace/conversations");
      const payload = await parseJson<{ conversations?: ConversationSummary[]; error?: string }>(
        response
      );
      if (!response.ok) throw new Error(payload?.error ?? "Could not load messages.");
      setConversations(payload?.conversations ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <div className="p-6 text-[#5C646D]">Loading messages…</div>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-4 pb-10 sm:p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-normal text-[#1A1E23]">Messages</h1>
        <p className="text-sm text-[#5C646D]">
          Marketplace chats with nearby families. Your email and exact address are never shown.
        </p>
        <Link href="/app/marketplace" className="text-sm text-primary underline">
          Back to marketplace
        </Link>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {conversations.length === 0 ? (
        <p className="text-sm text-[#5C646D]">No marketplace messages yet.</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/app/messages/${conversation.id}`}
                className="block rounded-xl border border-[#E5E7EB] bg-white p-4 hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-[#1A1E23] truncate">
                      {conversation.listing_title}
                    </p>
                    <p className="text-xs text-[#5C646D]">
                      {conversation.role === "buyer" ? "You're interested" : "You're selling"} ·{" "}
                      {conversation.other_participant_label}
                      {conversation.approximate_area_label
                        ? ` · ${conversation.approximate_area_label}`
                        : ""}
                    </p>
                    {conversation.last_message_snippet && (
                      <p className="text-sm text-[#5C646D] line-clamp-2">
                        {conversation.last_message_snippet}
                      </p>
                    )}
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                      New
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
