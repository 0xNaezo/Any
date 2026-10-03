/**
 * Open Graph images (1200×630) rendered at build time with Satori + resvg.
 * They reuse the hero's night-scene geometry, so previews always match the site.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { bitmapToPath, bitmapSize, type Bitmap } from './pixel';
import { GHOST, WORDMARK } from './sprites';
import { bayer, clamp, ghostEyes, ghostTone, makeGhost, moonAlpha, rng, threadPath } from './ghost-geometry';
import { splitUnit } from './text';
import type { CaseStudy, Dictionary } from '@/i18n/types';

const W = 1200;
const H = 630;
const C = {
  bg: '#08080a',
  fg: '#ecece6',
  fg2: '#a3a39d',
  fg3: '#807f78',
  line: 'rgba(255,255,255,0.1)',
  accent: '#b6f36a',
};

/* ---------------- helpers ---------------- */

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});
const img = (src: string, width: number, height: number, style: Record<string, unknown> = {}): Node => ({
  type: 'img',
  props: { src, width, height, style },
});
const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

function bitmapSvg(rows: Bitmap, fill: string) {
  const { w, h: hh } = bitmapSize(rows);
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${hh}" shape-rendering="crispEdges"><path fill="${fill}" d="${bitmapToPath(rows)}"/></svg>`,
  );
}

/** Static frame of the hero night scene as an SVG. */
function sceneSvg(width: number, height: number, cell = 7) {
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const g = 1;
  const out: string[] = [];
  const r = (x: number, y: number, fill: string, a = 1) =>
    out.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell - g}" height="${cell - g}" fill="${fill}"${a < 1 ? ` fill-opacity="${a.toFixed(3)}"` : ''}/>`);

  for (let y = 1; y < rows; y += 2) for (let x = 1; x < cols; x += 2) out.push(`<rect x="${x * cell + 3}" y="${y * cell + 3}" width="1" height="1" fill="#fff" fill-opacity="0.08"/>`);

  const mr = Math.max(5, Math.round(Math.min(cols, rows) * 0.14));
  const mx = Math.round(cols * 0.77);
  const my = Math.round(rows * 0.2);
  for (let y = my - mr * 2; y <= my + mr * 2; y++)
    for (let x = mx - mr * 2; x <= mx + mr * 2; x++) {
      if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
      const a = moonAlpha(x, y, mx, my, mr);
      if (a) r(x, y, C.fg, a);
    }

  const mistTop = Math.floor(rows * 0.84);
  for (let y = mistTop; y < rows; y++) {
    const k = (y - mistTop + 1) / Math.max(1, rows - mistTop);
    for (let x = 0; x < cols; x++) {
      const n = 0.5 + 0.5 * Math.sin(x * 0.19 + Math.cos(x * 0.05) * 2);
      if (k * 0.5 * (0.6 + 0.4 * n) > bayer(x, y)) r(x, y, C.fg, 0.05);
    }
  }

  const rand = rng(7);
  const count = Math.round((cols * rows) / 95);
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * cols);
    const y = Math.floor(rand() * rows * 0.72);
    const base = 0.18 + rand() * 0.5;
    rand();
    rand();
    const big = rand() > 0.93;
    if (Math.hypot(x - mx, y - my) < mr * 2.1) continue;
    r(x, y, C.fg, base);
    if (big) [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => r(x + dx!, y + dy!, C.fg, base * 0.35));
  }

  const ghost = makeGhost(clamp(Math.round(cols * 0.155), 7, 13), Math.round(cols * 0.47), Math.round(rows * 0.34));
  ghost.phase = 1.1;
  ghost.sway = 0.8;
  for (const p of threadPath(ghost, 0)) if (p.y >= 0 && p.y < rows) r(p.x, p.y, C.accent, p.a);
  const eyes = ghostEyes(ghost, 1, 0);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const tone = ghostTone(ghost, x, y, eyes);
      if (tone === 'light') r(x, y, C.fg);
      else if (tone === 'shade') r(x, y, '#9a9a94');
      else if (tone === 'aura') r(x, y, C.fg, 0.12);
    }

  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols * cell}" height="${rows * cell}"><rect width="100%" height="100%" fill="#0b0b0e"/>${out.join('')}</svg>`);
}

/* ---------------- fonts ---------------- */

let fontsCache: Promise<Parameters<typeof satori>[1]['fonts']> | null = null;
function loadFonts() {
  const read = (p: string) => fs.readFile(path.resolve(process.cwd(), p));
  fontsCache ??= Promise.all([
    read('node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf'),
    read('node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf'),
    read('node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf'),
    read('node_modules/@fontsource/geist-pixel/files/geist-pixel-latin-400-normal.woff'),
  ]).then(([regular, medium, mono, pixel]) => [
    { name: 'Geist', data: regular!, weight: 400 as const, style: 'normal' as const },
    { name: 'Geist', data: medium!, weight: 500 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: mono!, weight: 400 as const, style: 'normal' as const },
    { name: 'Geist Pixel', data: pixel!, weight: 400 as const, style: 'normal' as const },
  ]);
  return fontsCache;
}

/* ---------------- layouts ---------------- */

function frame(left: Node, label: string, domain: string, status: string) {
  const ghostSrc = bitmapSvg(GHOST, C.fg);
  const wordSrc = bitmapSvg(WORDMARK, C.fg);
  const wm = bitmapSize(WORDMARK);
  return h(
    'div',
    {
      width: W,
      height: H,
      display: 'flex',
      position: 'relative',
      backgroundColor: C.bg,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1.5px)',
      backgroundSize: '24px 24px',
      fontFamily: 'Geist',
      color: C.fg,
    },
    h('div', { position: 'absolute', left: 32, top: 32, right: 32, bottom: 32, border: `1px solid ${C.line}`, display: 'flex' }),
    h(
      'div',
      { position: 'absolute', left: 64, top: 64, bottom: 64, width: 660, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 16 },
        img(ghostSrc, 30, 30),
        img(wordSrc, wm.w * 3, wm.h * 3),
        h('div', { display: 'flex', fontFamily: 'Geist Mono', fontSize: 16, color: C.fg3, marginLeft: 8, letterSpacing: 1.5 }, label),
      ),
      left,
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 28, fontFamily: 'Geist Mono', fontSize: 17, color: C.fg2, letterSpacing: 1 },
        h('div', { display: 'flex', alignItems: 'center', gap: 12 }, h('div', { width: 10, height: 10, backgroundColor: C.accent, display: 'flex' }), status),
        h('div', { display: 'flex', color: C.fg3 }, domain),
      ),
    ),
    h(
      'div',
      { position: 'absolute', right: 64, top: 64, bottom: 64, width: 380, display: 'flex', border: `1px solid ${C.line}` },
      img(sceneSvg(378, 500), 378, 500),
    ),
  );
}

async function render(node: Node): Promise<Buffer> {
  const svg = await satori(node as unknown as Parameters<typeof satori>[0], { width: W, height: H, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
}

function titleLines(lines: string[]): Node {
  return h(
    'div',
    { display: 'flex', flexDirection: 'column', fontSize: 66, fontWeight: 500, lineHeight: 1, letterSpacing: -2.6 },
    ...lines.map((line) => {
      // Lines can contain *dimmed* fragments.
      const parts = line.split(/(\*[^*]+\*)/).filter(Boolean);
      return h(
        'div',
        { display: 'flex', flexWrap: 'wrap' },
        ...parts.map((p) => {
          // Flex items trim edge whitespace — keep it as non-breaking spaces.
          const text = (p.startsWith('*') ? p.slice(1, -1) : p).replace(/^ | $/g, '\u00A0');
          return h('span', p.startsWith('*') ? { color: C.fg3 } : {}, text);
        }),
      );
    }),
  );
}

export function renderHomeOg(dict: Dictionary, domain: string) {
  const left = h(
    'div',
    { display: 'flex', flexDirection: 'column', gap: 26 },
    titleLines(dict.hero.title),
    h('div', { display: 'flex', fontSize: 22, color: C.fg2, lineHeight: 1.4, maxWidth: 600 }, dict.hero.eyebrow),
  );
  return render(frame(left, '', domain, dict.status.available));
}

export function renderCaseOg(dict: Dictionary, item: CaseStudy, index: number, domain: string) {
  const left = h(
    'div',
    { display: 'flex', flexDirection: 'column', gap: 20 },
    h('div', { display: 'flex', fontSize: 104, fontWeight: 500, lineHeight: 1, letterSpacing: -5 }, item.name),
    h('div', { display: 'flex', fontSize: 26, color: C.fg2, lineHeight: 1.3 }, item.kind),
    h(
      'div',
      { display: 'flex', gap: 0, marginTop: 18, borderTop: `1px solid ${C.line}` },
      ...item.metrics.map((m, i) => {
        // The pixel face has no Cyrillic or ₽ — units go in the regular font.
        const { num, unit } = splitUnit(m.value);
        return h(
          'div',
          {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: 210,
            paddingTop: 18,
            paddingLeft: i ? 16 : 0,
            borderLeft: i ? `1px solid ${C.line}` : 'none',
          },
          h(
            'div',
            { display: 'flex', alignItems: 'baseline', gap: 8 },
            h('div', { display: 'flex', fontFamily: 'Geist Pixel', fontSize: 40, color: C.fg }, num),
            ...(unit ? [h('div', { display: 'flex', fontSize: 18, fontWeight: 500, color: C.fg3 }, unit)] : []),
          ),
          h('div', { display: 'flex', fontSize: 15, color: C.fg3, lineHeight: 1.3 }, m.label),
        );
      }),
    ),
  );
  const label = `· ${String(index + 1).padStart(2, '0')}/${String(dict.work.items.length).padStart(2, '0')} · ${item.industry.toUpperCase()}`;
  return render(frame(left, label, domain, `${item.year} · ${item.duration}`));
}
