export const dynamic = "force-dynamic";
import { redirect } from 'next/navigation';
import { getServerUser } from '../../../../../lib/auth';
import { isAdminEmail } from '../../../../../lib/admin';
import { loadTheme } from '../../../../../lib/theme';
import ThemeEditor from './_components/ThemeEditor';

export default async function ThemeAdminPage() {
  const { user, email } = await getServerUser();
  
  if (!user) {
    redirect('/signin?next=/app/admin/theme');
  }

  const admin = isAdminEmail(email);
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
            Signed in as: {email}
          </p>
        </div>
      </div>
    );
  }

  const theme = await loadTheme();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--brand-font-head, inherit)' }}>Theme Settings</h1>
      <ThemeEditor initial={theme} />
    </div>
  );
}

