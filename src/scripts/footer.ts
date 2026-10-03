/** Footer details: the studio's local time and tonight's moon. */
export function initFooter() {
  clock();
  moon();
}

function clock() {
  const el = document.querySelector<HTMLTimeElement>('[data-clock]');
  if (!el) return;
  let fmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat(el.dataset.locale || 'en', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: el.dataset.tz,
    });
  } catch {
    return;
  }
  const tick = () => {
    const now = new Date();
    el.textContent = fmt.format(now);
    el.dateTime = now.toISOString();
  };
  tick();
  window.setInterval(tick, 20_000);
}

const SYNODIC = 29.530588853;
const NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

function moon() {
  const wrap = document.querySelector<HTMLElement>('[data-moon]');
  if (!wrap) return;
  const lit = wrap.querySelector<SVGPathElement>('[data-moon-lit]');
  const name = wrap.querySelector<HTMLElement>('[data-moon-name]');
  const phases: string[] = JSON.parse(wrap.dataset.phases || '[]');

  const days = (Date.now() - NEW_MOON) / 86_400_000;
  const p = (((days / SYNODIC) % 1) + 1) % 1; // 0 new · 0.5 full
  if (name) name.textContent = phases[Math.floor(p * 8 + 0.5) % 8] ?? '';

  if (lit) {
    const r = 8.5;
    const rx = Math.abs(Math.cos(2 * Math.PI * p)) * r;
    const top = 10 - r;
    const bottom = 10 + r;
    const d =
      p <= 0.5
        ? `M10 ${top}A${r} ${r} 0 0 1 10 ${bottom}A${rx.toFixed(2)} ${r} 0 0 ${p < 0.25 ? 0 : 1} 10 ${top}Z`
        : `M10 ${top}A${r} ${r} 0 0 0 10 ${bottom}A${rx.toFixed(2)} ${r} 0 0 ${p < 0.75 ? 0 : 1} 10 ${top}Z`;
    lit.setAttribute('d', d);
  }
}
