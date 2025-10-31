// web/src/app/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export default function HomePage(): JSX.Element {
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
      {/* Hero */}
      <section className="bg-gradient-to-b from-ember-50 to-cream-50 border-b border-stone-200">
        <div className="container-wrap py-10 sm:py-14">
          <span className="kicker">
            Simple, trusted guidance from bump to big steps.
          </span>

          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold leading-tight max-w-[36rem]">
            Never behind the curve{" "}
            <span className="bg-gradient-to-r from-ember-400 via-apricot-400 to-blush-400 bg-clip-text text-transparent">
              - Know what's next. Buy smart. Move it on.
            </span>
          </h1>

          <p className="mt-3 text-stone-700 max-w-[36rem]">
            Ember helps you support your child's development with research-backed
            play ideas and clutter-free shopping tips.
          </p>

          {/* Waitlist form */}
          <div className="mt-6 card p-4 sm:p-5 max-w-[36rem]">
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label htmlFor="email" className="sr-only">
                Email
              </label>
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
                Tailored activities matched to your child's age and interests.
              </p>
            </div>
            <div className="card p-4">
              <div className="text-2xl">🛒</div>
              <h3 className="mt-2 font-semibold">Buy smart, reduce clutter</h3>
              <p className="mt-1 text-sm text-stone-700">
                What's worth it now, and how to pass it on later.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
