# Nightloom — landing page & portfolio

A dark, pixel-styled landing page for a four-person dev team: taking contract work and showing the portfolio.

- **Stack:** [Astro 7](https://astro.build) (static output) · TypeScript · [GSAP 3](https://gsap.com) (ScrollTrigger, SplitText, ScrambleText) · [Lenis](https://lenis.darkroom.engineering) smooth scroll · WebGL backdrop
- **Fonts:** Tiny5 (pixel display) + IBM Plex Mono, self-hosted via Fontsource
- **Pages:** home, a generated case-study page per project (`/work/<slug>/`), privacy policy, 404
- **No trackers, no cookies, no external requests** — everything is served from your own domain

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in ./dist
npm run preview   # serve the production build
npm run check     # type-check
```

Requires Node 22.12+.

## Editing content

**All copy lives in [`src/data/site.ts`](src/data/site.ts)**: brand, contacts, hero, services, case studies, process, team, guarantees, testimonials, pricing, FAQ and footer. Change the values there and the layout adapts.

> ⚠️ Everything in that file is placeholder content: names, numbers, clients, case studies and testimonials. Replace it with real data before launch. Invented reviews or metrics undermine trust, and in many countries they are illegal in advertising.

Common edits:

| What | Where |
| --- | --- |
| Domain (canonical URLs, sitemap, OG tags) | `site` in `astro.config.mjs` and the URL in `public/robots.txt` |
| Email, Telegram, booking link, legal name | `brand` in `src/data/site.ts` |
| "1 slot open" status and capacity calendar | `availability` in `src/data/site.ts` |
| Team members, coverage map | `team` in `src/data/site.ts` |
| Prices and plans | `pricing` in `src/data/site.ts` |
| Privacy policy text | `src/pages/privacy.astro` (a template; have it reviewed) |

### Case-study images

Put screenshots in `src/assets/work/` named `<slug>-cover` and `<slug>-detail` (`.png`, `.jpg`, `.webp` or `.avif`, ideally 1600×1000). They're picked up automatically and turned into responsive WebP files. If an image is missing, a pixel placeholder is shown instead, so the build never breaks.

The current images are generated mockups of fictional products. Replace them with real screenshots, or remove the case.

### Team photos (optional)

By default every member gets a pixel-ghost avatar. To show real portraits, add square photos to `src/assets/team/`, import them at the top of `site.ts` and set `photo` on each member. Photos get the same blue duotone as the case images and show their true colours on hover.

### Contact form

The form works without a backend: by default it opens the visitor's email client with a pre-filled message to `brand.email`.

To receive submissions directly, set `contact.formEndpoint` in `site.ts` to any endpoint that accepts `multipart/form-data` POST requests, for example [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com), [Basin](https://usebasin.com) or your own API. The form includes a honeypot field against bots.

### Social preview & icons

`public/og.png` (1200×630), `public/favicon.svg`, `public/favicon-32.png`, `public/apple-touch-icon.png` and `public/icon-*.png`. Replace them with your own exports if the headline changes.

## Design system

- **Pixel grid.** Tiny5 is drawn on an 8-unit em, so pixel-font sizes are multiples of 8px (16, 24, 32 … 88) and stay crisp. Icons use 8×8 / 16×16 grids at 2px per pixel.
- **Tokens** (colours, sizes, spacing) live in `src/styles/global.css` under `:root`.
- **Sprites are ASCII art.** Icons in `src/lib/icons.ts` and the ghost in `src/lib/ghost.ts` are plain text grids (`#` = pixel, `+` = half-tone) converted to SVG at build time. Edit the grids to redraw them.
- **Frames.** Every section is a `<Frame>` (`src/components/ui/Frame.astro`): a dashed window with corner handles and a header bar.

## Motion & interaction

| Feature | File |
| --- | --- |
| Dithered night-sky backdrop (WebGL, follows scroll and cursor) | `src/scripts/backdrop.ts` |
| Hero ghost (canvas sprite: bobs, blinks, follows the cursor, reacts to clicks) | `src/scripts/ghost-canvas.ts` |
| Boot screen (first visit per session only) | `src/components/Preloader.astro`, `src/scripts/boot.ts` |
| Scroll reveals, heading wipes, label scrambles | `src/scripts/reveal.ts` |
| Image "depixelate" reveal | `src/scripts/depixelate.ts` |
| Process timeline, FAQ accordion, copy buttons, pixel fills | `src/scripts/widgets.ts` |
| Live team clocks and "online" status | `src/scripts/clocks.ts` |

Everything is progressive. Content is plain HTML, so it renders without JavaScript. Visitors with `prefers-reduced-motion` get a static page with no smooth scrolling and no boot screen.

## Deploying

The output is a static folder (`dist/`), so it can go on any static host:

- **Vercel / Netlify / Cloudflare Pages:** import the repo; build command `npm run build`, output directory `dist`.
- **GitHub Pages:** build with GitHub Actions and publish `dist/`.
- **Any server:** upload the contents of `dist/`.
