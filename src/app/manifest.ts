import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'مشوار - مواصلات غزة',
    short_name: 'مشوار',
    description: 'منصة نقل وتشارك المشاوير في قطاع غزة - تعمل بدون إنترنت أولاً',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#059669',
    lang: 'ar',
    dir: 'rtl',
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
  };
}
