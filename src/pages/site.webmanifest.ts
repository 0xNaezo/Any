import type { APIRoute } from 'astro';
import { site } from '../site.config';
import { getContent, defaultLocale } from '../i18n';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.name,
        short_name: site.name,
        description: getContent(defaultLocale).meta.description,
        start_url: '/',
        display: 'standalone',
        background_color: '#08090c',
        theme_color: '#08090c',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
