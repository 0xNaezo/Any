// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fonts are pre-subset into src/assets/fonts (see scripts/subset-fonts.py).
// Astro generates the @font-face rules, metric-matched fallbacks and preloads.
const font = (/** @type {string} */ file) => `./src/assets/fonts/${file}`;

export default defineConfig({
  site: 'https://nightloom.dev',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  devToolbar: {
    enabled: false,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { src: [font('newsreader-roman.woff2')], weight: '400', style: 'normal' },
          { src: [font('newsreader-italic.woff2')], weight: '400', style: 'italic' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-schibsted',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [{ src: [font('schibsted-grotesk.woff2')], weight: '400 600', style: 'normal' }],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-plex-mono',
      fallbacks: ['Courier New', 'monospace'],
      options: {
        variants: [
          { src: [font('ibm-plex-mono-400.woff2')], weight: '400', style: 'normal' },
          { src: [font('ibm-plex-mono-500.woff2')], weight: '500', style: 'normal' },
        ],
      },
    },
  ],
});
