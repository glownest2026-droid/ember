import { createClient } from '../../utils/supabase/server';

export default async function WhoAmI() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <pre style={{padding:16, whiteSpace:'pre-wrap'}}>
{JSON.stringify(user ? { id: user.id, email: user.email } : null, null, 2)}
    </pre>
  );
}
