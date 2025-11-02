import { createClient } from '../../../utils/supabase/server';

export default async function AppHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <section className="card p-6 space-y-2">
      <h1 className="text-xl font-semibold">Welcome back</h1>
      <p>You are signed in as <strong>{user?.email}</strong>.</p>
    </section>
  );
}
