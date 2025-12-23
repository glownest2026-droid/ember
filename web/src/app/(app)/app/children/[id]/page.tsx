export const dynamic = "force-dynamic";
import { createClient } from '../../../../../utils/supabase/server';
import ChildForm from '../_components/ChildForm';
import { redirect } from 'next/navigation';

export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/children');
  }

  const { data: child, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !child) {
    return (
      <div className="p-6 text-red-600">
        {error ? `Error: ${error.message}` : 'Child profile not found'}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Edit Child Profile</h1>
      <ChildForm initial={child} />
    </div>
  );
}

