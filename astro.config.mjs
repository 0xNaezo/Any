// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

/**
 * Self-hosted font files from @fontsource packages — no third-party requests at runtime or build time.
 * @param {string} pkg
 * @param {string} file
 */
const fontFile = (pkg, file) => `@fontsource${pkg}/files/${file}`;

export default defineConfig({
  // Replace with your production domain — used for canonical URLs, Open Graph and the sitemap.
  site: 'https://nightloom.dev',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  // One-page site: inlining the CSS removes two render-blocking requests from the critical path.
  build: { inlineStylesheets: 'always' },
  vite: {
    build: {
      // Astro builds for `esnext`, which tells the CSS minifier that no vendor prefixes are needed.
      // Give it real browser targets so it emits the ones Safari still requires (e.g. -webkit-backdrop-filter).
      cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-sans',
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: [fontFile('-variable/geist', 'geist-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN],
          },
          {
            src: [fontFile('-variable/geist', 'geist-latin-ext-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN_EXT],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      options: {
        variants: [
          {
            src: [fontFile('-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN],
          },
          {
            src: [fontFile('-variable/geist-mono', 'geist-mono-latin-ext-wght-normal.woff2')],
            weight: '100 900',
            style: 'normal',
            unicodeRange: [LATIN_EXT],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      fallbacks: ['ui-serif', 'Georgia', 'serif'],
      options: {
        variants: [
          {
            src: [fontFile('/instrument-serif', 'instrument-serif-latin-400-italic.woff2')],
            weight: '400',
            style: 'italic',
            unicodeRange: [LATIN],
          },
          {
            src: [fontFile('/instrument-serif', 'instrument-serif-latin-ext-400-italic.woff2')],
            weight: '400',
            style: 'italic',
            unicodeRange: [LATIN_EXT],
          },
          {
            src: [fontFile('/instrument-serif', 'instrument-serif-latin-400-normal.woff2')],
            weight: '400',
            style: 'normal',
            unicodeRange: [LATIN],
          },
          {
            src: [fontFile('/instrument-serif', 'instrument-serif-latin-ext-400-normal.woff2')],
            weight: '400',
            style: 'normal',
            unicodeRange: [LATIN_EXT],
          },
        ],
      },
    },
  ],
});
