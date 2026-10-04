import { gsap, ScrollTrigger, reduced, sleep } from './core';

/**
 * Images resolve from big blocks to full resolution when they scroll into view.
 * [data-depixel] wraps an <img> and a <canvas>; the canvas plays the effect,
 * then fades out to reveal the real (responsive, lazy-loaded) image.
 */
const STEPS = [56, 36, 24, 16, 11, 7, 4];

function loaded(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  img.loading = 'eager';
  return new Promise((resolve) => {
    img.addEventListener('load', () => resolve(), { once: true });
    img.addEventListener('error', () => resolve(), { once: true });
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const r = w / h;
  let sw = iw;
  let sh = ih;
  if (iw / ih > r) sw = ih * r;
  else sh = iw / r;
  ctx.drawImage(img, 0, 0, sw, sh, 0, 0, w, h);
}

async function play(wrap: HTMLElement, img: HTMLImageElement, canvas: HTMLCanvasElement) {
  await loaded(img);
  if (!img.naturalWidth) {
    wrap.classList.add('is-revealed');
    return;
  }
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  const small = document.createElement('canvas');
  const sctx = small.getContext('2d');
  if (!ctx || !sctx) {
    wrap.classList.add('is-revealed');
    return;
  }
  canvas.style.opacity = '1';
  for (const block of STEPS) {
    const sw = Math.max(1, Math.ceil(rect.width / block));
    const sh = Math.max(1, Math.ceil(rect.height / block));
    small.width = sw;
    small.height = sh;
    sctx.imageSmoothingEnabled = true;
    drawCover(sctx, img, sw, sh);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(small, 0, 0, sw, sh, 0, 0, Math.round(sw * block * dpr), Math.round(sh * block * dpr));
    await sleep(70);
  }
  wrap.classList.add('is-revealed');
  gsap.to(canvas, { opacity: 0, duration: 0.24, ease: 'steps(3)', delay: 0.05 });
}

export function initDepixelate() {
  document.querySelectorAll<HTMLElement>('[data-depixel]').forEach((wrap) => {
    const img = wrap.querySelector<HTMLImageElement>('img');
    const canvas = wrap.querySelector<HTMLCanvasElement>('canvas');
    if (!img || !canvas || reduced) {
      wrap.classList.add('is-revealed');
      return;
    }
    // start loading a little before the image is visible
    ScrollTrigger.create({ trigger: wrap, start: 'top bottom+=400', once: true, onEnter: () => void loaded(img) });
    ScrollTrigger.create({ trigger: wrap, start: 'top 82%', once: true, onEnter: () => void play(wrap, img, canvas) });
  });
}
