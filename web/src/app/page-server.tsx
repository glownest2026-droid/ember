import { createClient } from '../utils/supabase/server';
import HomePageClient from './page-client';

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <HomePageClient isSignedIn={!!user} />;
}

