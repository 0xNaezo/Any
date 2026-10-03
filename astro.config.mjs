// @ts-check
import { defineConfig } from 'astro/config';

// `site` is used for canonical URLs, hreflang links, Open Graph and the sitemap.
// Replace it with your production domain before deploying.
export default defineConfig({
  site: 'https://nightloom.dev',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
