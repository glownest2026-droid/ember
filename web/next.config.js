/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : null;

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      ...(supabaseHost ? [{ protocol: 'https', hostname: supabaseHost }] : []),
    ],
  },
  async headers() {
    return [
      // keep these noindex headers you use
      { source: '/go/:path*',  headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      { source: '/_ds/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },

      // allow Builder editor to embed preview + cms pages
      {
        source: '/cms/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://*.builder.io https://builder.io https://app.builder.io" },
        ],
      },
      {
        source: '/api/preview',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://*.builder.io https://builder.io https://app.builder.io" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
