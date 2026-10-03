# Nightloom — studio website

Landing page and portfolio for **Nightloom**, a four-person product studio. One page with work, services, process, team, pricing, FAQ and a contact form, plus `404` and `/privacy` pages.

> ⚠️ **All copy is placeholder.** Client names and logos, stats, case studies, testimonials, prices and team bios were invented for the layout. Replace them with real ones before going live — made-up social proof destroys the trust the site is meant to build.

## Stack

- [Astro 7](https://astro.build): static output, zero framework runtime, scoped component styles
- [GSAP 3](https://gsap.com) with ScrollTrigger, SplitText and ScrambleText (all GSAP plugins are free) and [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- Hero animation: hand-written Canvas 2D "woven threads" and an animated SVG ghost
- Fonts are self-hosted through the Astro Fonts API from `@fontsource` packages (Geist, Geist Mono, Instrument Serif). The site makes no third-party requests.
- TypeScript (strict), `@astrojs/sitemap`, `astro:assets` for responsive WebP images

## Getting started

Requires **Node.js 22.12+**.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run check     # type-check .astro and .ts files
```

## Project structure

```
src/
├── content/site.ts          ← ALL text, numbers, links, projects, team, pricing, FAQ
├── assets/
│   ├── work/                ← project screenshots (optimised at build time)
│   └── team/                ← team portraits
├── components/
│   ├── sections/            ← one component per page section (Hero, Work, Pricing…)
│   ├── bento/               ← the animated "Why us" cards
│   └── ui/                  ← Button, Icon, Logo, SectionHeader…
├── layouts/Base.astro       ← <head>: SEO, Open Graph, JSON-LD, fonts
├── pages/                   ← index, 404, privacy
├── scripts/                 ← GSAP/Lenis setup, one module per feature
├── lib/                     ← ghost shape + timezone helpers
└── styles/global.css        ← design tokens, typography, shared UI
public/                      ← favicon, og.png, robots.txt
```

## Editing content

Almost everything is in **`src/content/site.ts`**. The components only render what they find there.

- **Text:** headings marked as HTML accept `<em>…</em>`, which gives a word the serif-italic gradient accent (e.g. `We weave software <em>that won’t haunt you.</em>`).
- **Projects:** replace the images in `src/assets/work/` with your own (jpg, png, webp or avif, around 3:2, at least 2000px wide) and update the imports at the top of `site.ts` if the file names change.
- **Team:** portraits go in `src/assets/team/` (4:5 ratio, at least 800×1000).
- **Client logos:** the names are in the `clients` block. The logos are placeholder icon-plus-wordmark marks drawn in `src/components/ui/ClientLogo.astro`; replace them with your clients' real SVG logos (white or monochrome versions look best).
- **Sections:** the order lives in `src/pages/index.astro`. To remove a section, delete its line there and its link from `nav` in `site.ts`.

## Before going live

- [ ] Replace all placeholder content in `src/content/site.ts` (see the warning above)
- [ ] Set your domain in `astro.config.mjs` (`site`), in `src/content/site.ts` (`site.url`) and in `public/robots.txt`
- [ ] Set the real email, booking link (Cal.com/Calendly) and social links in `site`
- [ ] Replace `public/og.png` (1200×630 social preview) and, if needed, the favicons
- [ ] Review the privacy policy text in `src/pages/privacy.astro`
- [ ] Configure the contact form (below)

## Contact form

The form validates input in the browser, then:

1. **If `PUBLIC_FORM_ENDPOINT` is set**, it POSTs the submission there as `FormData` and shows a success or error state inline.
2. **Otherwise** it opens the visitor's email client with a pre-filled message to `site.email`. This works with no setup, but a real endpoint gives a better experience.

Copy `.env.example` to `.env` (or set the variables in your hosting dashboard):

```bash
# Formspree
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/your-form-id

# …or Web3Forms
PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_FORM_ACCESS_KEY=your-access-key
```

Variables are baked in at build time, so rebuild after changing them. These services treat the keys as public, so shipping them to the browser is expected. A hidden honeypot field filters out simple spam bots.

## Deployment

The build output is plain static files in `dist/`, so the site can go on any static host:

| Host             | Build command   | Output directory |
| ---------------- | --------------- | ---------------- |
| Vercel           | `npm run build` | `dist`           |
| Netlify          | `npm run build` | `dist`           |
| Cloudflare Pages | `npm run build` | `dist`           |

For GitHub Pages, use the [official Astro action](https://docs.astro.build/en/guides/deploy/github/). Without a custom domain you'll also need to set `base` in `astro.config.mjs`.

## Accessibility & performance

- Respects `prefers-reduced-motion`: animations are switched off and every element renders in its final state.
- Fully readable without JavaScript. If the scripts fail to load, a fallback reveals all content after 3.5 s.
- Semantic landmarks, skip link, visible focus states, keyboard-operable menu and FAQ, and labelled form fields with inline errors.
- Lighthouse (local production build): **97 / 100 / 100 / 100** on mobile and **100 / 100 / 100 / 100** on desktop (Performance / Accessibility / Best Practices / SEO).
