"use client";

import * as React from "react";
import { useState } from "react";
import { getSupabase } from "../lib/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function joinWaitlist(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setMessage("Setup issue: missing site configuration. Please try again later.");
      return;
    }

    setStatus("saving");
    setMessage(null);

    const { error } = await supabase.from("waitlist").insert({ email, source: "homepage" });
    if (error) {
      setStatus("error");
      setMessage(
        /duplicate|unique/i.test(error.message)
          ? "You're already on the list — thank you!"
          : "Something went wrong. Please try again."
      );
    } else {
      setStatus("ok");
      setMessage("You're on the list! 🎉");
      setEmail("");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Ember</h1>
        <p className="text-lg">Simple, trusted guidance from bump to big steps.</p>

        <form onSubmit={joinWaitlist} className="flex gap-2 justify-center">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 max-w-xs border rounded-md p-2"
            required
          />
          <button type="submit" disabled={status === "saving"} className="rounded-md border px-4 py-2">
            {status === "saving" ? "Adding…" : "Join waitlist"}
          </button>
        </form>

        {message && (
          <p className={status === "error" ? "text-red-600 text-sm" : "text-green-700 text-sm"}>{message}</p>
        )}

        <a href="/play" className="inline-block rounded-xl border px-4 py-2">
          Explore play ideas
        </a>
      </div>
    </main>
  );
}
