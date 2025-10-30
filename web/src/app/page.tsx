// web/src/app/play/page.tsx
import { createClient } from "@supabase/supabase-js";

// Always fetch fresh on server
export const revalidate = 0;

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
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Play Ideas</h1>
      <ul className="space-y-3">
        {(data ?? []).map((p) => (
          <li key={p.id} className="rounded-xl border p-4">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm opacity-80">{p.age_band}</div>
            {p.why && <p className="text-sm mt-1">{p.why}</p>}
            {Array.isArray(p.steps) && p.steps.length > 0 && (
              <ul className="list-disc ml-5 mt-2 text-sm">
                {p.steps.map((s: string) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
