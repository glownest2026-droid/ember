export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import { createClient } from '../../../../../utils/supabase/server';
import { isAdminEmail } from '../../../../../lib/admin';
import { loadTheme } from '../../../../../lib/theme';
import ThemeEditor from './_components/ThemeEditor';

export default async function ThemeAdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/signin?next=/app/admin/theme');
  }

  const admin = isAdminEmail(user.email);
  if (!admin) {
    // Show clear "Not authorized" screen instead of silent redirect
    return (
      <div className="container-wrap py-8">
        <div className="card p-6 space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--brand-text, #1C1C1E)' }}>Not authorized</h1>
          <p className="text-sm" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            You don't have permission to access this page. Theme settings are only available to administrators.
          </p>
          <p className="text-xs" style={{ color: 'var(--brand-muted, #6b7280)' }}>
            Signed in as: {user.email}
          </p>
        </div>
      </div>
    );
  }

  const theme = await loadTheme();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold px-6 pt-6" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>Theme Settings</h1>
      <div className="px-6 pb-6">
        <ThemeEditor initial={theme} />
      </div>
    </div>
  );
}

