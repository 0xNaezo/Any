# Nightloom — studio website

The marketing site and portfolio for Nightloom, a four-person engineering studio.
One long home page (studio, services, selected work, process, team, testimonials,
pricing, FAQ, contact), a page per case study, and a 404.

Built to be fast and quiet: static HTML, about 60 KB of JavaScript (gzipped) for the motion,
self-hosted subset fonts, and no client-side framework.

> **Placeholder content.** Every name, number, client, testimonial and case study in this
> repository is invented to show the layout. Replace it before launch, and only publish
> testimonials, client logos and metrics you can stand behind. They are the first thing a
> careful buyer checks.

## Stack

- [Astro 7](https://astro.build): static output, content collections for case studies, built-in font optimisation
- TypeScript (strict), checked by `astro check` on every build
- [GSAP](https://gsap.com) (ScrollTrigger, SplitText) for reveals, [Lenis](https://lenis.darkroom.engineering) for smooth scrolling
- The hero "loom": a hand-written Canvas 2D sketch in `src/scripts/loom.ts`, no dependencies
- Fonts: Newsreader, Schibsted Grotesk, IBM Plex Mono (all OFL), subset to Latin, about 170 KB in total

## Getting started

Requires Node 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # type-checks, then builds to ./dist
npm run preview   # serves ./dist
```

## Editing content

Almost everything lives in **`src/data/site.ts`**: studio details, navigation, hero copy,
services, the project archive, process, team, testimonials, pricing, FAQ and contact
settings. Look for `PLACEHOLDER` comments; they mark the content that must be real.

| What                      | Where                                                        |
| ------------------------- | ------------------------------------------------------------ |
| Email, Telegram, calendar | `studio` in `src/data/site.ts`                               |
| Availability badge        | `studio.availability`. Set `open: false` when you're booked  |
| Time zone and hours       | `studio.timeZone` / `workingHours`. These drive the live clock and the "we'll reply today" hint |
| Case studies              | `src/content/work/*.md` (see below)                          |
| Team photos               | `public/team/` (see below)                                   |
| Domain                    | `site` in `astro.config.mjs`, `studio.url`, and `public/robots.txt` |
| Share image               | `public/og.png` (1200 × 630)                                 |

### Case studies

Each Markdown file in `src/content/work/` becomes a page at `/work/<file-name>/` and a
card in the "Selected work" section. The frontmatter is validated by the schema in
`src/content.config.ts`, so a typo fails the build instead of shipping a broken page.

```yaml
client: Ledgerline
headline: Reconciliation that runs itself
summary: One or two sentences for the card and the page intro.
sector: Fintech
year: 2025
duration: 7 months
role: [Discovery, Backend, Infrastructure]
stack: [Go, PostgreSQL, Kafka]
results:            # 1–4 headline numbers
  - value: 3 days → 40 min
    label: Month-end close
cover: ledger       # built-in illustration: ledger | health | notes | orbit
image: /work/ledgerline.jpg   # optional real screenshot in /public, replaces the illustration
quote:              # optional
  text: …
  name: Daniel Weiss
  role: CTO, Ledgerline
order: 1            # position in the list
featured: true      # show on the home page
```

The body is plain Markdown. `##` headings and lists are styled.

### Team photos

Put portraits in `public/team/` (4:5, at least 800 × 1000) and set
`photo: '/team/<file>.jpg'` for each person in `team.members`. Photos are shown in
greyscale and warm up on hover. Until a photo is set, the person gets a woven silhouette.

### Contact form

Set `studio.formEndpoint` to any service that accepts a form POST and answers with JSON
([Formspree](https://formspree.io), [Web3Forms](https://web3forms.com), or your own
endpoint). While it is empty, the form opens the visitor's mail app with the message
already written, so nothing is ever lost. A hidden honeypot field (`website`) stops
simple bots before anything is sent.

## Design notes

- **Palette.** Near-black (`#0b0b0c`) and warm off-white ink. Colour is reserved for
  status (the green "booking" dot). Tokens are at the top of `src/styles/global.css`.
- **Type.** A serif for display and quotes, a grotesk for reading, a mono for labels and
  data. Headline sizes are fluid. The hero headline also yields to short screens so the
  calls to action stay above the fold.
- **The loom.** The ghost is never drawn as a shape. It is a height map that pushes and
  lights up vertical "warp threads", like a jacquard pattern. It measures the copy around
  it and keeps clear of it on every screen size. The cursor works as a lantern. Rendering
  pauses off-screen and in background tabs.
- **Motion** is there to support the content: lines rise out of masks, hairlines draw in,
  numbers count up once. Everything respects `prefers-reduced-motion`, and the content
  stays readable with JavaScript disabled.
- **Accessibility.** Semantic landmarks and headings, a skip link, visible focus styles,
  keyboard-operable tabs, accordion and menu, and labelled form fields with inline errors.

## Project structure

```
src/
  data/site.ts            all copy and studio settings
  content/work/           case studies (Markdown)
  content.config.ts       case-study schema
  pages/                  index, work/[slug], 404
  layouts/BaseLayout.astro  <head>, meta, JSON-LD, header/footer
  components/
    sections/             one file per home-page section
    ui/, visuals/         section heading, icons, case-study covers
  scripts/
    main.ts               smooth scroll, reveals, intro, clocks
    loom.ts               the hero canvas
  styles/global.css       tokens, layout, typography
  assets/fonts/           subset WOFF2 files
public/                   favicons, share image, robots.txt
scripts/subset-fonts.py   rebuilds the font files (only needed if fonts change)
```

## Deploying

`npm run build` produces a fully static `dist/` folder that runs on any static host:
Cloudflare Pages, Netlify, Vercel or GitHub Pages. Use `npm run build` as the build
command and `dist` as the output directory. Update `site` in `astro.config.mjs` first;
canonical URLs, the sitemap and social previews depend on it.
