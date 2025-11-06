'use client';
import { useRouter, useSearchParams } from 'next/navigation';

const AGE_OPTIONS = ['0-6m','6-12m','12-18m','18-24m','2-3y','3-4y','4-5y'];
const TAG_SUGGESTIONS = ['sensory','stacking','outdoor','bath','musical'];

export default function Filters() {
  const router = useRouter();
  const sp = useSearchParams();
  const age = sp.get('age') || '';
  const tag = sp.get('tag') || '';

  function update(params: Record<string,string>) {
    const next = new URL(window.location.href);
    for (const [k,v] of Object.entries(params)) {
      if (!v) next.searchParams.delete(k);
      else next.searchParams.set(k, v);
    }
    router.push(next.pathname + (next.search ? next.search : ''));
  }

  return (
    <div className="mb-4 flex flex-wrap gap-3 items-center">
      <label className="text-sm">Age:&nbsp;
        <select
          value={age}
          onChange={e => update({ age: e.target.value })}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          {AGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>

      <div className="flex items-center gap-2">
        <span className="text-sm">Tags:</span>
        {TAG_SUGGESTIONS.map(t => {
          const active = tag === t;
          return (
            <button
              key={t}
              onClick={() => update({ tag: active ? '' : t })}
              className={`px-2 py-1 rounded text-sm border ${active ? 'bg-black text-white' : 'bg-white'}`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {(age || tag) && (
        <button onClick={() => update({ age:'', tag:'' })}
          className="ml-auto text-sm underline">Clear</button>
      )}
    </div>
  );
}
