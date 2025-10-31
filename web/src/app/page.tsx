// web/src/app/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const val = email.trim();
    if (!val || !/.+@.+\..+/.test(val)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      // Lazy import for the Supabase client factory
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod: any = await import("../lib/supabase");
      const supabase =
        mod.getSupabase ? await mod.getSupabase() : await mod.default();

      const { error: insertError } = await supabase
        .from("waitlist")
        .insert({ email: val });

      if (insertError) {
        setError("Sorry, something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/success");
    } catch {
      setError("Network hiccup. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-stone-200">
        {/* Ambient blobs */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-20 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-ember-200), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -top-28 right-[-6rem] h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-blush-200), transparent 70%)",
          }}
        />

        <div className="container-wrap relative py-12 sm:py-20">
          <span className="kicker">
            Simple, trusted guidance from bump to big steps.
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold leading-tight max-w-[42rem] tracking-tight">
            Never behind the curve{" "}
            <span className="bg-gradient-to-r from-ember-400 via-apricot-400 to-blush-400 bg-clip-text text-transparent">
              — know what’s next. Buy smart. Move it on.
            </span>
          </h1>

          <p className="mt-4 text-[1.05rem] text-stone-700 max-w-[44rem]">
            Ember helps you support your child’s development with clear, research-backed
            play ideas and clutter-smart shopping tips.
          </p>

          {/* Waitlist form */}
          <div id="waitlist" className="mt-8 card p-5 sm:p-6 max-w-[36rem]">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
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
                className="btn btn-primary"
                disabled={submitting}
                aria-live="polite"
              >
                {submitting ? "Joining…" : "Join waitlist"}
              </button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Value props */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <div className="text-2xl">🧠</div>
              <h3 className="mt-2 font-semibold">Guidance you can trust</h3>
              <p className="mt-1 text-sm text-stone-700">
                Clear, research-backed tips for every stage.
              </p>
            </div>
            <div className="card p-5">
              <div className="text-2xl">🎈</div>
              <h3 className="mt-2 font-semibold">Play ideas that click</h3>
              <p className="mt-1 text-sm text-stone-700">
                Tailored activities matched to your child’s age & interests.
              </p>
            </div>
            <div className="card p-5">
              <div className="text-2xl">🛒</div>
              <h3 className="mt-2 font-semibold">Buy smart, reduce clutter</h3>
              <p className="mt-1 text-sm text-stone-700">
                What’s worth it now — and how to pass it on later.
              </p>
            </div>
          </div>

          {/* Anchor section for About (optional stub) */}
          <div id="about" className="sr-only">About section coming soon</div>
        </div>
      </section>
    </main>
  );
}
