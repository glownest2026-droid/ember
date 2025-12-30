import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ember',
    short_name: 'Ember',
    description: 'Simple, trusted guidance from bump to big steps.',
    start_url: '/app',
    display: 'standalone',
    background_color: '#FFFCF8',
    theme_color: '#FFBEAB',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
