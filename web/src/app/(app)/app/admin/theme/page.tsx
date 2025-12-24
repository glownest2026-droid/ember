export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import { createClient } from '../../../../../utils/supabase/server';
import { isAdmin } from '../../../../../lib/admin';
import { loadTheme } from '../../../../../lib/theme';
import ThemeForm from './_components/ThemeForm';

export default async function ThemeAdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/admin/theme');
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect('/app');
  }

  const theme = await loadTheme();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Theme Settings</h1>
      <ThemeForm initial={theme} />
    </div>
  );
}

