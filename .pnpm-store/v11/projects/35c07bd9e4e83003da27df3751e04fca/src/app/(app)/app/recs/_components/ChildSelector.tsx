'use client';

import { useRouter } from 'next/navigation';

type Child = {
  id: string;
  birthdate: string | null;
  age_band: string | null;
  updated_at: string;
};

export default function ChildSelector({ 
  children, 
  selectedChildId 
}: { 
  children: Child[];
  selectedChildId: string;
}) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const childId = e.target.value;
    router.push(`/app/recs?child=${childId}`);
  }

  return (
    <div className="mb-4">
      <label htmlFor="child-select" className="block text-sm font-medium mb-2">
        Select profile:
      </label>
      <select
        id="child-select"
        value={selectedChildId}
        onChange={handleChange}
        className="border rounded px-3 py-2 text-sm"
      >
        {children.map((child) => (
          <option key={child.id} value={child.id}>
            {child.birthdate 
              ? `Birthdate: ${new Date(child.birthdate).toLocaleDateString()}`
              : 'No birthdate'
            }
            {child.age_band ? ` (${child.age_band})` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}


