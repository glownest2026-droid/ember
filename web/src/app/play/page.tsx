type PlayIdea = { title: string; ageBand: string; why: string };
const seed: PlayIdea[] = [
  { title: "Tummy Time Treasure", ageBand: "0–6 months", why: "Builds neck & core strength." },
  { title: "Peekaboo Plus", ageBand: "6–12 months", why: "Object permanence & turn-taking." },
  { title: "Stack & Knock", ageBand: "12–18 months", why: "Fine motor control + cause & effect." },
];

export default function Play() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Play Ideas</h1>
      <ul className="space-y-3">
        {seed.map((p) => (
          <li key={p.title} className="rounded-xl border p-4">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm opacity-80">{p.ageBand}</div>
            <p className="text-sm mt-1">{p.why}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
