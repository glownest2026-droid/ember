"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { getSupabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();
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
      setMessage(/duplicate|unique/i.test(error.message)
        ? "You're already on the list — thank you!"
        : "Something went wrong. Please try again.");
    } else {
      setStatus("ok");
      setEmail("");
      router.push("/success");
      return;
    }
  }

  return (
    <main className="min-h-screen p-6">
      <Header />
      <section className="max-w-xl mx-auto text-center space-y-6 mt-12">
        <p className="text-lg">Simple, trusted guidance from bump to big steps.</p>

        <form onSubmit={joinWaitlist} className="flex gap-2 justify-center" noValidate>
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
      </section>
    </main>
  );
}
