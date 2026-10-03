/**
 * Favicons & app icons generated from the ghost sprite at build time,
 * so changing GHOST in sprites.ts updates every icon automatically.
 */
import { Resvg } from '@resvg/resvg-js';
import { bitmapSize, bitmapToPath } from './pixel';
import { GHOST } from './sprites';

const BG = '#08080a';
const FG = '#ecece6';

/** SVG with the ghost drawn at an integer `scale`, centred on a square canvas. */
export function iconSvg(size: number, scale: number, opts: { radius?: number } = {}) {
  const { w, h } = bitmapSize(GHOST);
  const ox = Math.floor((size - w * scale) / 2);
  const oy = Math.floor((size - h * scale) / 2);
  const r = opts.radius ?? 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" rx="${r}" fill="${BG}"/><path transform="translate(${ox} ${oy}) scale(${scale})" fill="${FG}" d="${bitmapToPath(GHOST)}"/></svg>`;
}

export function iconPng(size: number, scale: number) {
  return new Resvg(iconSvg(size, scale), { fitTo: { mode: 'original' } }).render().asPng();
}

/** Wraps PNG images into a .ico container (PNG-compressed entries). */
export function toIco(images: { size: number; png: Buffer }[]) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, png }, i) => {
    const o = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, o);
    header.writeUInt8(size >= 256 ? 0 : size, o + 1);
    header.writeUInt8(0, o + 2);
    header.writeUInt8(0, o + 3);
    header.writeUInt16LE(1, o + 4);
    header.writeUInt16LE(32, o + 6);
    header.writeUInt32LE(png.length, o + 8);
    header.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.png)]);
}
