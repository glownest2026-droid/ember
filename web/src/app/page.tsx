// web/src/app/play/page.tsx
import { createClient } from "@supabase/supabase-js";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { getSupabase } from "../lib/supabase";

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key);
}

export default async function Play() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("play_idea")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">Play Ideas</h1>
        <p className="mt-4 text-red-600">Error: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <header className="max-w-3xl mx-auto flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold">Ember</h1>
        <nav className="text-sm">
          <Link href="/play" className="underline">Play ideas</Link>
        </nav>
      </header>

      <section className="max-w-xl mx-auto text-center space-y-6 mt-12">
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
      </section>
    </main>
  );
}
