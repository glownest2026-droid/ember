export const dynamic = 'force-dynamic';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AddChildForm } from '@/components/add-children/AddChildForm';

export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin?next=/add-children');
  }

  const { data: child, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !child) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-red-600">
        {error ? `Error: ${error.message}` : 'Child profile not found'}
      </div>
    );
  }

  return (
    <AddChildForm
      initial={{
        id: child.id,
        birthdate: child.birthdate ?? null,
        gender: child.gender ?? null,
      }}
      backHref="/add-children"
    />
  );
}
