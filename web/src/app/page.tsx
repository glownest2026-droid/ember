// web/src/app/page.tsx
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const val = email.trim();
    if (!val || !/.+@.+\..+/.test(val)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      // Lazy import Supabase factory
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod: any = await import("../lib/supabase");
      const supabase =
        mod.getSupabase ? await mod.getSupabase() : await mod.default();

      const { error: insertError } = await supabase
        .from("waitlist")
        .insert({ email: val });

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
    }
  }

  return (
    <main className="min-h-screen p-6">
      <Header />
      <section className="max-w-xl mx-auto text-center space-y-6 mt-12">
        <p className="text-lg">Simple, trusted guidance from bump to big steps.</p>

          {/* Waitlist form */}
          <div className="mt-6 card p-4 sm:p-5 max-w-[36rem]">
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input sm:flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                aria-live="polite"
              >
                {submitting ? "Joining..." : "Join waitlist"}
              </button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {ok && <p className="mt-2 text-sm text-stone-700">Success! Redirecting…</p>}
          </div>

          {/* Value props */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="card p-4">
              <div className="text-2xl">🧠</div>
              <h3 className="mt-2 font-semibold">Guidance you can trust</h3>
              <p className="mt-1 text-sm text-stone-700">
                Clear, research-backed tips for every stage.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-2xl">🎈</div>
              <h3 className="mt-2 font-semibold">Play ideas that click</h3>
              <p className="mt-1 text-sm text-stone-700">
                Tailored activities matched to your child’s age & interests.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-2xl">🛒</div>
              <h3 className="mt-2 font-semibold">Buy smart, reduce clutter</h3>
              <p className="mt-1 text-sm text-stone-700">
                What’s worth it now—and how to pass it on later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
