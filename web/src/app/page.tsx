// web/src/app/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, BrandIcon, Wordmark } from "../components/Header";
import { Button as UiButton } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--brand-bg, #FAFAFB)' }}>
      <Hero />
      <FeaturedStrip />
      <HowItWorks />
      <Demo />
      <FeatureSection />
      <Trust />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
}

/* -------------------- Sections -------------------- */

function Hero() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

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
      const supabase = mod.getSupabase ? await mod.getSupabase() : await mod.default();

      const { error: insertError } = await supabase.from("waitlist").insert({ email: val, source: "homepage" });

      if (insertError) {
        setError("Sorry, something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      router.push("/success");
    } catch {
      setError("Network hiccup. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, var(--brand-primary, #FFC7AE) 0%, var(--brand-accent, #FFE5D7) 60%, #FFFFFF 100%)` }}
    >
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight" style={{ color: 'var(--brand-text, #1C1C1E)' }}>
            Simple, trusted guidance from bump to big steps.
          </h1>
          <p className="mt-4 text-base md:text-lg max-w-xl text-neutral-800">
            Daily, hand-held recommendations for play, weekends, and the things you didn’t know you needed—so you feel confident at every step.
          </p>
          
          <div className="mt-6">
          <UiButton onClick={() => (window.location.href = "/products")}>
          Browse picks
          </UiButton>
          </div>

          
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#waitlist"><Button>Start your confidence journey</Button></a>
            <a href="#how"><Button variant="ghost">See how it works</Button></a>
          </div>
          <div className="mt-6 text-sm text-neutral-700">Evidence-based • Parent-tested • Privacy-first</div>

          {/* Waitlist form */}
          <form
            id="waitlist"
            onSubmit={onSubmit}
            className="mt-8 bg-white/80 backdrop-blur border rounded-2xl p-3 sm:p-4 max-w-xl"
            style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--brand-text, #1C1C1E)' }}>
              Join the early access list
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring"
                style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}
                disabled={submitting}
                type="email"
                autoComplete="email"
                required
              />
              <Button type="submit">{submitting ? "Adding…" : submitted ? "Added ✓" : "Notify me"}</Button>
            </div>
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <p className="mt-2 text-xs text-neutral-600">No spam. Unsubscribe anytime.</p>
          </form>
        </div>

        {/* App icon showcase */}
        <div className="relative">
          <div className="absolute -top-24 -right-28 w-80 h-80 rounded-full opacity-40 blur-2xl" style={{ background: 'var(--brand-accent, #FFE5D7)' }} />
          <div className="flex items-end gap-6 justify-center md:justify-end">
            <AppIcon size={180} />
            <div className="flex flex-col gap-4">
              <AppIcon size={128} />
              <AppIcon size={128} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 justify-items-center">
            <AppIcon size={96} />
            <AppIcon size={64} />
            <AppIcon size={48} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AppIcon({ size = 128 }: { size?: number }) {
  const s = size;
  return (
    <div
      className="rounded-2xl shadow-lg relative border"
      style={{ width: s, height: s, background: `linear-gradient(160deg, var(--brand-primary, #FFC7AE), var(--brand-accent, #FFE5D7))`, borderColor: 'var(--brand-border, #E6E6EA)' }}
    >
      <div className="absolute inset-0 grid place-items-center">
        <BrandIcon size={Math.floor(s * 0.62)} />
      </div>
      <div
        className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wide font-medium px-2 py-1 rounded-md"
        style={{ background: "rgba(28,28,30,0.06)", color: 'var(--brand-text, #1C1C1E)', border: '1px solid var(--brand-border, #E6E6EA)' }}
      >
        {size} px
      </div>
    </div>
  );
}

function FeaturedStrip() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">Never behind the curve</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-80">
          <Badge>Evidence-based</Badge>
          <Badge>Parent-tested</Badge>
          <Badge>Privacy-first</Badge>
          <Badge>UK &amp; Global-ready</Badge>
        </div>
      </div>
    </section>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm px-3 py-2 rounded-xl border bg-white" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
      {children}
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>How Ember helps</h2>
        <p className="mt-2 text-neutral-700 max-w-2xl">Small, clear steps that build confidence—without overwhelm.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <StepCard index={1} title="Create your family" body="Add due date or birthdate, and optional interests. We tailor recommendations to your stage." />
          <StepCard index={2} title="Get gentle guidance" body="Two nudges a week with 2–3 quick wins—play ideas, checklists, plans." />
          <StepCard index={3} title="Explore weekends & trends" body="Simple local plans and rising picks parents love this month." />
        </div>
      </div>
    </section>
  );
}
function StepCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
      <div className="w-8 h-8 rounded-lg grid place-items-center font-semibold" style={{ background: 'var(--brand-accent, #FFE5D7)', color: 'var(--brand-text, #1C1C1E)' }}>
        {index}
      </div>
      <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>{title}</h3>
      <p className="mt-2 text-sm text-neutral-700">{body}</p>
    </div>
  );
}

function Demo() {
  const stages = [
    { key: "expecting", label: "Expecting" },
    { key: "0-6m", label: "0–6m" },
    { key: "6-12m", label: "6–12m" },
    { key: "1-2y", label: "1–2y" },
    { key: "2-3y", label: "2–3y" },
    { key: "3-5y", label: "3–5y" },
  ];
  const [stage, setStage] = React.useState("1-2y");
  const ideas = getSampleIdeas(stage);
  return (
    <section className="py-16" style={{ background: 'var(--brand-bg, #FAFAFB)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Try a quick sample</h2>
        <p className="mt-2 text-neutral-700 max-w-2xl">Pick your stage to see three bite-size ideas you could use this week.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {stages.map((s) => (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={`px-4 py-2 rounded-xl text-sm border ${stage === s.key ? "shadow" : ""}`}
              style={{ background: stage === s.key ? 'var(--brand-primary, #FFC7AE)' : "white", color: 'var(--brand-text, #1C1C1E)', borderColor: 'var(--brand-border, #E6E6EA)' }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {ideas.map((it, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 flex flex-col" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
              <div className="text-sm uppercase tracking-wide text-neutral-500">{it.type}</div>
              <h4 className="mt-2 text-lg font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>{it.title}</h4>
              <p className="mt-2 text-sm text-neutral-700 flex-1">{it.desc}</p>
              <div className="mt-4 text-xs text-neutral-500">Est. {it.time} min • Confidence +{it.confidence}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function getSampleIdeas(stage: string) {
  const base: Record<string, { type: string; title: string; desc: string; time: number; confidence: number; }[]> = {
    expecting: [
      { type: "Expecting Mode", title: "Hospital bag lite", desc: "Three essentials to pack today—no shopping trip needed.", time: 8, confidence: 1 },
      { type: "Prep", title: "Five-minute swaddle", desc: "Practice with a towel to build muscle memory before baby arrives.", time: 5, confidence: 1 },
      { type: "Calm", title: "Breathing reset", desc: "Box-breath for 2 minutes before bed for steadier sleep.", time: 2, confidence: 1 },
    ],
    "0-6m": [
      { type: "Play", title: "Tummy time lift", desc: "Roll a towel under chest; 2×1 minute with smiles and talk.", time: 3, confidence: 1 },
      { type: "Play", title: "High-contrast peek", desc: "Face cards/stripes; 60 seconds per side, twice today.", time: 2, confidence: 1 },
      { type: "You", title: "One-cup prep", desc: "Set a water + snack station for feeds tonight.", time: 4, confidence: 1 },
    ],
    "6-12m": [
      { type: "Play", title: "Treasure basket", desc: "Safe household objects for grasp & explore; swap items each day.", time: 6, confidence: 2 },
      { type: "Outing", title: "Animal peek", desc: "Quick visit to a local farm; name sounds together.", time: 30, confidence: 1 },
      { type: "You", title: "Two-minute stretch", desc: "Gentle neck/shoulder loosen while baby watches.", time: 2, confidence: 1 },
    ],
    "1-2y": [
      { type: "Play", title: "Cup transfer", desc: "Scoop dry pasta between bowls—grip & focus boost.", time: 5, confidence: 2 },
      { type: "Weekend", title: "Cafe + ducks", desc: "Short walk, count steps to pond, feed ducks safely.", time: 45, confidence: 2 },
      { type: "You", title: "Reset shelf", desc: "Rotate 3 toys out, 3 in—fresh interest without buying.", time: 7, confidence: 1 },
    ],
    "2-3y": [
      { type: "Play", title: "Masking tape roads", desc: "Build a route on the floor; drive, tidy, celebrate.", time: 8, confidence: 2 },
      { type: "Weekend", title: "Library quest", desc: "Pick 2 animal books; act sounds on the walk home.", time: 30, confidence: 2 },
      { type: "You", title: "Batch snack", desc: "Cut fruit into tubs—tomorrow-you says thanks.", time: 10, confidence: 1 },
    ],
    "3-5y": [
      { type: "Play", title: "Balance path", desc: "Cushions as stepping stones—count and swap patterns.", time: 10, confidence: 2 },
      { type: "Weekend", title: "Nature bingo", desc: "Leaf, stick, bird song—tick 5 with a warm drink after.", time: 50, confidence: 2 },
      { type: "You", title: "Plan-ahead 2", desc: "Two events for the week: 1 playdate, 1 outing.", time: 12, confidence: 2 },
    ],
  };
  return base[stage] || base["1-2y"];
}

function FeatureSection() {
  const features = [
    { tag: "Expecting Mode", title: "Day-one ready, calmly", body: "Prenatal checklists and tiny rehearsals that build confidence for the first 48 hours.", bullets: ["Hospital bag: essentials, not overwhelm", "Tiny skills: swaddle, latch positions", "Partner prompts"] },
    { tag: "Daily Play", title: "Five-minute ideas, matched to stage", body: "Quick activities that support motor, language, and focus—no shopping required.", bullets: ["Scientifically informed", "Home-ready items", "Celebrate small wins"] },
    { tag: "Weekends", title: "Gentle local plans", body: "Animals, gardens, National Trust spots and cozy cafes—curated and family-friendly.", bullets: ["Within 30–60 mins", "Weather-friendly options", "Map + cost hints"] },
    { tag: "Trends", title: "What parents love this month", body: "Rising products and setups—filter for age, budget, and sustainability.", bullets: ["Signals, not hype", "Peer favorites", "Buy smart, avoid clutter"] },
    { tag: "Marketplace (soon)", title: "Buy smart. Move it on.", body: "Quality first; pass things forward locally when you’re done.", bullets: ["Trusted listings", "Sustainability filters", "Pickup-friendly"] },
  ];
  return (
    <section id="features" className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>What you get</h2>
        <p className="mt-2 text-neutral-700 max-w-2xl">Know what’s next. Buy smart. Move it on.</p>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
              <div className="text-xs uppercase tracking-wide text-neutral-500">{f.tag}</div>
              <h3 className="mt-1 text-xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-700">{f.body}</p>
              <ul className="mt-3 text-sm text-neutral-700 list-disc ml-5 space-y-1">
                {f.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section id="trust" className="py-16" style={{ background: 'var(--brand-bg, #FAFAFB)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Why parents trust Ember</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <TrustCard title="Clear, not noisy" body="We simplify the next step. No doom-scrolling, no guilt trips." />
          <TrustCard title="Private by default" body="We ask for only what helps, store it safely, and never sell your data." />
          <TrustCard title="Built with parents" body="Tested weekly with real families to stay practical and kind." />
        </div>
      </div>
    </section>
  );
}
function TrustCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>{title}</h3>
      <p className="mt-2 text-sm text-neutral-700">{body}</p>
    </div>
  );
}

function Testimonials() {
  const quotes = [
    { name: "Jade, first-time mum", body: "The tiny nudges are gold—two minutes and I feel on top of things again." },
    { name: "Ravi, dad of two", body: "Weekend picks mean we just go—no endless scrolling or second guessing." },
    { name: "Amelia, expecting", body: "I sleep better knowing I’ve ticked the simple essentials for the hospital." },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>What parents say</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
              <p className="text-sm text-neutral-800">“{q.body}”</p>
              <div className="mt-3 text-xs text-neutral-500">{q.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Is Ember free?", a: "You can start free. We plan a simple Plus plan for extras like saved weekend plans and deeper trend filters." },
    { q: "How often will you notify me?", a: "By default, two gentle nudges a week—Sunday planning and a mid-week check-in. You can change this anytime." },
    { q: "Do I need to buy anything?", a: "No. Most play ideas use what you already have. If you do buy, we help you choose wisely—and move it on later." },
    { q: "Can I add multiple children?", a: "Yes. Create profiles for each child and we’ll tailor suggestions per stage." },
    { q: "What data do you collect?", a: "Just essentials to personalise guidance. We never sell your data and you can export/delete anytime." },
    { q: "Where does Ember work?", a: "We’re building for the UK first with global expansion in mind. Weekends will localise to your area." },
  ];
  return (
    <section id="faq" className="py-16" style={{ background: 'var(--brand-bg, #FAFAFB)' }}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>FAQs</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>{it.q}</h3>
              <p className="mt-2 text-sm text-neutral-700">{it.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-14 pb-10 bg-white border-t" style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}>
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-4 gap-8">
        <div>
          <Wordmark />
          <p className="mt-3 text-sm text-neutral-700 max-w-xs">
            Small, clear steps to help you feel ready—every day.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Product</div>
          <ul className="mt-2 text-sm text-neutral-700 space-y-1">
            <li><a href="#how">How it works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Company</div>
          <ul className="mt-2 text-sm text-neutral-700 space-y-1">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Get updates</div>
          <div className="mt-2 flex gap-2">
            <input
              placeholder="you@example.com"
              className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring"
              style={{ borderColor: 'var(--brand-border, #E6E6EA)' }}
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 mt-10 text-xs text-neutral-500">
        © {new Date().getFullYear()} Ember. All rights reserved.
      </div>
    </footer>
  );
}
