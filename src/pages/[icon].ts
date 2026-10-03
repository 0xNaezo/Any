import type { APIRoute, GetStaticPaths } from 'astro';
import { iconPng, iconSvg, toIco } from '@/lib/icons';
import { getDictionary, defaultLocale, assetUrl } from '@/i18n';
import { site } from '@/config/site';

/**
 * Root-level generated assets: favicons, app icons, web manifest and robots.txt.
 * (Only the names listed below are built — every other route is untouched.)
 */
const files: Record<string, () => { body: BodyInit; type: string }> = {
  'favicon.svg': () => ({ body: iconSvg(16, 1), type: 'image/svg+xml' }),
  'favicon.ico': () => ({
    body: new Uint8Array(toIco([{ size: 16, png: iconPng(16, 1) }, { size: 32, png: iconPng(32, 2) }, { size: 48, png: iconPng(48, 3) }])),
    type: 'image/x-icon',
  }),
  'favicon-32.png': () => ({ body: new Uint8Array(iconPng(32, 2)), type: 'image/png' }),
  'apple-touch-icon.png': () => ({ body: new Uint8Array(iconPng(180, 12)), type: 'image/png' }),
  'icon-192.png': () => ({ body: new Uint8Array(iconPng(192, 12)), type: 'image/png' }),
  'icon-512.png': () => ({ body: new Uint8Array(iconPng(512, 32)), type: 'image/png' }),
  'icon-maskable-512.png': () => ({ body: new Uint8Array(iconPng(512, 24)), type: 'image/png' }),
  'site.webmanifest': () => {
    const dict = getDictionary(defaultLocale);
    return {
      type: 'application/manifest+json',
      body: JSON.stringify(
        {
          name: dict.meta.title,
          short_name: site.name,
          description: dict.meta.description,
          start_url: assetUrl('/'),
          display: 'browser',
          background_color: '#08080a',
          theme_color: '#08080a',
          icons: [
            { src: assetUrl('/icon-192.png'), sizes: '192x192', type: 'image/png' },
            { src: assetUrl('/icon-512.png'), sizes: '512x512', type: 'image/png' },
            { src: assetUrl('/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        null,
        2,
      ),
    };
  },
  'robots.txt': () => ({
    type: 'text/plain; charset=utf-8',
    body: `User-agent: *\nAllow: /\n\nSitemap: ${new URL(assetUrl('/sitemap-index.xml'), site.url).href}\n`,
  }),
};

export const getStaticPaths: GetStaticPaths = () => Object.keys(files).map((icon) => ({ params: { icon } }));

export const GET: APIRoute = ({ params }) => {
  const file = files[params.icon as string]!();
  return new Response(file.body, { headers: { 'Content-Type': file.type } });
};
