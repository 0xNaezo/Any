// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * SITE_URL  — production URL, used for canonical links, sitemap and Open Graph.
 * BASE_PATH — set only when the site lives in a sub-folder (e.g. GitHub Pages: "/repo-name").
 */
const site = process.env.SITE_URL || 'https://nightloom.dev';
const base = process.env.BASE_PATH || '/';

/** @param {string} pkg @param {string} file */
const fontFile = (pkg, file) => `./node_modules/${pkg}/files/${file}`;

export default defineConfig({
  site,
  base,
  // Keep HTML whitespace semantics (Astro 7 defaults to JSX-style whitespace stripping).
  compressHTML: true,
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-sans',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      fallbacks: ['serif'],
      options: {
        variants: [
          {
            src: [fontFile('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2')],
            weight: 400,
            style: 'normal',
          },
          {
            src: [fontFile('@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff2')],
            weight: 400,
            style: 'italic',
          },
        ],
      },
    },
  ],
});
