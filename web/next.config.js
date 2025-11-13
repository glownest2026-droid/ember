/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ebayimg.com', pathname: '/**' },
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL
        ? [{ protocol: 'https', hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host, pathname: '/**' }]
        : []),
    ],
  },
  async headers() {
    return [
      { source: '/go/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      { source: '/_ds/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
    ];
  },
};
module.exports = nextConfig;
