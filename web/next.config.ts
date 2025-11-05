import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ebayimg.com' },
      { protocol: 'https', hostname: 'shjccflwlayacppuyskl.supabase.co' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },                // inert while Amazon disabled
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' }    // inert while Amazon disabled
    ]
  }
};

export default nextConfig;
