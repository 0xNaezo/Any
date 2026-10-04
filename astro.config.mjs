// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change `site` to your production domain — it is used for canonical URLs,
// Open Graph tags and the generated sitemap.
export default defineConfig({
  site: 'https://nightloom.dev',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: { enabled: false },
});
