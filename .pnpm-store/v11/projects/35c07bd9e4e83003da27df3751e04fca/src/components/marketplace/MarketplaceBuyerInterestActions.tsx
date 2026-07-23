"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  listingId: string;
  buyerInterested: boolean;
  initialConversationId?: string | null;
  onInterestSent?: () => void;
};

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function MarketplaceBuyerInterestActions({
  listingId,
  buyerInterested,
  initialConversationId = null,
  onInterestSent,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interested, setInterested] = useState(buyerInterested);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId);

  const expressInterest = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/beta-listings/${listingId}/interest`, {
        method: "POST",
      });
      const payload = await parseJson<{ error?: string; conversation_id?: string }>(response);
      if (!response.ok) throw new Error(payload?.error ?? "Could not send interest.");
      setInterested(true);
      if (payload?.conversation_id) setConversationId(payload.conversation_id);
      onInterestSent?.();
    } catch (interestError) {
      setError(interestError instanceof Error ? interestError.message : "Could not send interest.");
    } finally {
      setBusy(false);
    }
  };

  const openChat = async () => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/conversation`, {
        method: "POST",
      });
      const payload = await parseJson<{ error?: string; conversation_id?: string }>(response);
      if (!response.ok) throw new Error(payload?.error ?? "Could not open chat.");
      if (!payload?.conversation_id) throw new Error("Unexpected response.");
      setConversationId(payload.conversation_id);
      window.location.href = `/app/messages/${payload.conversation_id}`;
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : "Could not open chat.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      {interested ? (
        <p className="text-sm text-emerald-700">Interest sent</p>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => void expressInterest()}
          className="inline-flex min-h-[40px] items-center rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm disabled:opacity-60"
        >
          {busy ? "Sending…" : "I'm interested"}
        </button>
      )}

      {interested && (
        <div className="space-y-2">
          {conversationId ? (
            <Link
              href={`/app/messages/${conversationId}`}
              className="inline-flex min-h-[40px] items-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white"
            >
              Open chat
            </Link>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void openChat()}
              className="inline-flex min-h-[40px] items-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {busy ? "Opening…" : "Message seller"}
            </button>
          )}
          <p className="text-xs text-[#5C646D]">
            Chat inside Ember. Your email and exact address are not shared.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
