"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationDetail, SafeMessage } from "@/lib/marketplace/conversation-types";
import { MARKETPLACE_MESSAGE_MAX_LENGTH } from "@/lib/marketplace/conversation-validation";

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function MarketplaceConversationThread({ conversationId }: { conversationId: string }) {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/conversations/${conversationId}`);
      const payload = await parseJson<{ conversation?: ConversationDetail; error?: string }>(
        response
      );
      if (!response.ok) throw new Error(payload?.error ?? "Could not load conversation.");
      if (!payload?.conversation) throw new Error("Unexpected response.");
      setDetail(payload.conversation);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load conversation.");
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages.length]);

  const sendMessage = async () => {
    if (!draft.trim() || sending || !detail?.can_send) return;
    setSending(true);
    setError(null);
    setPrivacyWarning(null);
    try {
      const response = await fetch(`/api/marketplace/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft }),
      });
      const payload = await parseJson<{
        message?: SafeMessage;
        privacy_warning?: string | null;
        error?: string;
      }>(response);
      if (!response.ok) throw new Error(payload?.error ?? "Could not send message.");
      if (payload?.message) {
        setDetail((prev) =>
          prev ? { ...prev, messages: [...prev.messages, payload.message!] } : prev
        );
        setDraft("");
        if (payload.privacy_warning) setPrivacyWarning(payload.privacy_warning);
      }
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  const submitReport = async () => {
    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/conversations/${conversationId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reportReason }),
      });
      const payload = await parseJson<{ error?: string }>(response);
      if (!response.ok) throw new Error(payload?.error ?? "Could not submit report.");
      setReportOpen(false);
      await load();
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : "Could not submit report.");
    } finally {
      setSending(false);
    }
  };

  const blockUser = async () => {
    if (!window.confirm("Block this user? You will not be able to message each other in this chat.")) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/marketplace/conversations/${conversationId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const payload = await parseJson<{ error?: string }>(response);
      if (!response.ok) throw new Error(payload?.error ?? "Could not block user.");
      await load();
    } catch (blockError) {
      setError(blockError instanceof Error ? blockError.message : "Could not block user.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-[#5C646D]">Loading conversation…</div>;
  }

  if (!detail) {
    return (
      <div className="p-6 space-y-2">
        <p className="text-red-600">{error ?? "Conversation not found."}</p>
        <Link href="/app/messages" className="text-sm text-primary underline">
          Back to messages
        </Link>
      </div>
    );
  }

  const roleLabel = detail.participant.role === "buyer" ? "You're interested" : "You're selling";

  return (
    <div className="mx-auto flex max-w-xl flex-col min-h-[70vh] p-4 pb-6 sm:p-6">
      <header className="mb-4 space-y-2">
        <Link href="/app/messages" className="text-sm text-primary underline">
          ← Messages
        </Link>
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 space-y-1">
          <p className="font-medium text-[#1A1E23]">{detail.listing.title}</p>
          <p className="text-sm text-[#5C646D]">
            {roleLabel} · {detail.other_participant.display_label}
            {detail.listing.approximate_area_label
              ? ` · ${detail.listing.approximate_area_label}`
              : ""}
          </p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white p-4 min-h-[280px] max-h-[50vh]">
        {detail.messages.length === 0 ? (
          <p className="text-sm text-[#5C646D]">No messages yet. Say hello to get started.</p>
        ) : (
          detail.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.is_mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.is_mine
                    ? "bg-primary text-white"
                    : message.message_type === "system"
                      ? "bg-[#F3F4F6] text-[#5C646D] italic"
                      : "bg-[#F3F4F6] text-[#1A1E23]"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.body}</p>
                <p
                  className={`mt-1 text-[10px] ${message.is_mine ? "text-white/80" : "text-[#5C646D]"}`}
                >
                  {new Date(message.created_at).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 space-y-3">
        <ul className="text-xs text-[#5C646D] space-y-1 list-disc ml-4">
          {detail.safety_guidance.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        {detail.can_send ? (
          <div className="space-y-2">
            <label className="sr-only" htmlFor="message-body">
              Message
            </label>
            <textarea
              id="message-body"
              rows={3}
              maxLength={MARKETPLACE_MESSAGE_MAX_LENGTH}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message…"
              className="w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm"
            />
            {privacyWarning && <p className="text-xs text-amber-800">{privacyWarning}</p>}
            <button
              type="button"
              disabled={sending || !draft.trim()}
              onClick={() => void sendMessage()}
              className="inline-flex min-h-[44px] items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[#5C646D]">
            Messaging is closed for this conversation.
            {detail.status === "reported" ? " It has been reported." : ""}
            {detail.status === "blocked" ? " A user was blocked." : ""}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs">
          <button
            type="button"
            onClick={() => setReportOpen((v) => !v)}
            className="text-[#5C646D] underline"
          >
            Report this conversation
          </button>
          <button type="button" onClick={() => void blockUser()} className="text-[#5C646D] underline">
            Block this user
          </button>
        </div>

        {reportOpen && (
          <div className="rounded-xl border border-[#E5E7EB] p-3 space-y-2">
            <p className="text-sm font-medium text-[#1A1E23]">Report conversation</p>
            <input
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm"
            />
            <button
              type="button"
              disabled={sending}
              onClick={() => void submitReport()}
              className="text-sm text-primary underline"
            >
              Submit report
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
