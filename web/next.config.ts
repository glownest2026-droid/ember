import type { NextConfig } from 'next';

const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').host; }
  catch { return ''; }
})();

const domains = ['i.ebayimg.com'];
if (supabaseHost) domains.push(supabaseHost);

const nextConfig: NextConfig = {
  images: { domains }
};

export default nextConfig;
