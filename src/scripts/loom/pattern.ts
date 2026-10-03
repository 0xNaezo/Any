import { GHOST_BODY, GHOST_BOX, GHOST_EYE_SPOTS, GHOST_PATH } from '../../lib/ghost';

export interface Layout {
  /** Ghost centre, in cells (x from the left, y from the top). */
  cx: number;
  top: number;
  /** Ghost height, in cells. */
  height: number;
}

export interface Pattern {
  cols: number;
  rows: number;
  /** Canvases ready to be uploaded as textures (y down, flip on upload). */
  open: HTMLCanvasElement;
  closed: HTMLCanvasElement;
  glow: HTMLCanvasElement;
  /** 1 where the ghost is woven, row 0 = bottom row (the first one woven). */
  bits: Uint8Array;
  /** Columns spanned by the ghost. */
  x0: number;
  x1: number;
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function draw(c: HTMLCanvasElement, layout: Layout, eyes: 'open' | 'closed') {
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, c.width, c.height);
  const scale = layout.height / GHOST_BOX.h;
  ctx.save();
  // The axis of symmetry sits exactly on a cell boundary, so both halves
  // (and both eyes) rasterize as mirror images.
  ctx.translate(Math.round(layout.cx), Math.round(layout.top));
  ctx.scale(scale, scale);
  ctx.translate(-(GHOST_BOX.x + GHOST_BOX.w / 2), -GHOST_BOX.y);
  ctx.fillStyle = '#fff';
  if (eyes === 'open') {
    ctx.fill(new Path2D(GHOST_PATH), 'evenodd');
  } else {
    ctx.fill(new Path2D(GHOST_BODY));
    // closed eyes: two soft downward arcs
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.6, 1.15 / scale);
    for (const e of GHOST_EYE_SPOTS) {
      ctx.beginPath();
      ctx.moveTo(e.cx - e.rx * 1.25, e.cy + 0.6);
      ctx.quadraticCurveTo(e.cx, e.cy + 2.4, e.cx + e.rx * 1.25, e.cy + 0.6);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function threshold(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d')!;
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = d[i] > 110 ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return img;
}

function blur(src: ImageData, cols: number, rows: number) {
  let a = new Float32Array(cols * rows);
  let b = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) a[i] = src.data[i * 4] / 255;
  const R = 3;
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let s = 0;
        let n = 0;
        for (let k = -R; k <= R; k++) {
          const xx = x + k;
          if (xx >= 0 && xx < cols) {
            s += a[y * cols + xx];
            n++;
          }
        }
        b[y * cols + x] = s / n;
      }
    }
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let s = 0;
        let n = 0;
        for (let k = -R; k <= R; k++) {
          const yy = y + k;
          if (yy >= 0 && yy < rows) {
            s += b[yy * cols + x];
            n++;
          }
        }
        a[y * cols + x] = s / n;
      }
    }
  }
  const out = canvas(cols, rows);
  const ctx = out.getContext('2d')!;
  const img = ctx.createImageData(cols, rows);
  for (let i = 0; i < cols * rows; i++) {
    const v = Math.min(255, a[i] * 255 * 1.6);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

export function buildPattern(cols: number, rows: number, layout: Layout): Pattern {
  const open = canvas(cols, rows);
  const closed = canvas(cols, rows);
  draw(open, layout, 'open');
  draw(closed, layout, 'closed');
  const openData = threshold(open);
  threshold(closed);

  const bits = new Uint8Array(cols * rows);
  let x0 = cols;
  let x1 = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const on = openData.data[(y * cols + x) * 4] > 127 ? 1 : 0;
      // flip: bits row 0 is the bottom row of the canvas
      bits[(rows - 1 - y) * cols + x] = on;
      if (on) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
      }
    }
  }

  return { cols, rows, open, closed, glow: blur(openData, cols, rows), bits, x0, x1 };
}
