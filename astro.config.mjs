// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  // Production URL — used for canonical links, Open Graph and the sitemap.
  // Change it in src/config/site.ts.
  site: site.url,
  // When hosting in a sub-folder (e.g. GitHub Pages project site) set base: '/repo-name'.
  // base: '/',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru-RU', en: 'en-US' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
