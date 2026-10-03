import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatClock, hoursNow, overlapHours, zoneSegments, type Zone } from '../../lib/time';

/** Little "live" widgets inside the Why-us bento grid. */
export function initBento(motion: boolean) {
  initTimezones(motion);
  if (!motion) return;

  const onEnter = (selector: string, play: (el: HTMLElement) => void, start = 'top 85%') => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => play(el) });
    });
  };

  // Experience bars
  document.querySelectorAll<HTMLElement>('[data-roster]').forEach((roster) => {
    const bars = roster.querySelectorAll('[data-roster-bar]');
    gsap.set(bars, { scaleX: 0 });
    ScrollTrigger.create({
      trigger: roster,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(bars, { scaleX: 1, duration: 1.4, ease: 'expo.out', stagger: 0.12 }),
    });
  });

  // Chat messages arrive one by one
  document.querySelectorAll<HTMLElement>('[data-chat]').forEach((chat) => {
    const msgs = chat.querySelectorAll('[data-msg]');
    gsap.set(msgs, { opacity: 0, y: 14 });
    ScrollTrigger.create({
      trigger: chat,
      start: 'top 80%',
      once: true,
      onEnter: () => gsap.to(msgs, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.55 }),
    });
  });

  // Git graph draws itself
  document.querySelectorAll<SVGElement>('[data-git]').forEach((git) => {
    const lines = git.querySelectorAll('[data-git-line]');
    const dots = git.querySelectorAll('[data-git-dot]');
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
    ScrollTrigger.create({
      trigger: git,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap
          .timeline()
          .to(lines, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.25 })
          .to(dots, { scale: 1, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.07 }, 0.3),
    });
  });

  // Budget bar fills up
  onEnter('[data-budget]', (el) => {
    const fill = el.querySelector('[data-budget-fill]');
    if (fill) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.out' });
  });

  // CI pipeline runs (and re-runs while visible)
  document.querySelectorAll<HTMLElement>('[data-pipeline]').forEach((pipe) => {
    const steps = Array.from(pipe.querySelectorAll<HTMLElement>('[data-pipe-step]'));
    const label = pipe.querySelector<HTMLElement>('[data-pipe-state]');
    let visible = false;
    let busy = false;

    const run = () => {
      if (busy) return;
      busy = true;
      steps.forEach((s) => s.classList.remove('is-done', 'is-running'));
      if (label) {
        label.textContent = 'Running…';
        label.style.color = 'var(--accent)';
      }
      const tl = gsap.timeline({ onComplete: () => void (busy = false) });
      steps.forEach((s, i) => {
        tl.call(() => s.classList.add('is-running'), [], i * 0.85);
        tl.call(
          () => {
            s.classList.remove('is-running');
            s.classList.add('is-done');
          },
          [],
          i * 0.85 + 0.7,
        );
      });
      tl.call(
        () => {
          if (!label) return;
          label.textContent = 'Passed';
          label.style.color = '';
        },
        [],
        steps.length * 0.85,
      );
    };

    ScrollTrigger.create({
      trigger: pipe,
      start: 'top 85%',
      end: 'bottom top',
      onEnter: run,
      onToggle: (self) => {
        visible = self.isActive;
      },
    });
    window.setInterval(() => {
      if (visible && !document.hidden) run();
    }, 11000);
  });
}

/** Working-hours overlap chart: recomputed in the browser (DST-correct) and kept live. */
function initTimezones(motion: boolean) {
  const tz = document.querySelector<HTMLElement>('[data-tz]');
  if (!tz) return;

  let zones: Zone[] = [];
  try {
    zones = JSON.parse(tz.dataset.zones ?? '[]') as Zone[];
  } catch {
    return;
  }
  if (!zones.length) return;

  const pos = (h: number) => (h / 24).toFixed(4);
  let signature = '';

  const update = () => {
    const now = new Date();
    const rows = zoneSegments(zones, now);
    const home = rows.find((r) => r.home) ?? rows[0];
    // only rebuild the bars when offsets actually changed (e.g. a DST switch since the build)
    const nextSignature = JSON.stringify(rows.map((r) => r.segments));
    const rebuild = signature ? nextSignature !== signature : needsRebuild(rows);
    signature = nextSignature;

    rows.forEach((row) => {
      const track = tz.querySelector<HTMLElement>(`[data-tz-track="${row.tz}"]`);
      if (track && rebuild) {
        const bars = row.segments.map(([s, e]) => `<span class="tz-bar" style="--s:${pos(s)};--e:${pos(e)}"></span>`);
        if (!row.home) {
          row.segments.forEach(([s, e]) =>
            home.segments.forEach(([hs, he]) => {
              const a = Math.max(s, hs);
              const b = Math.min(e, he);
              if (b > a) bars.push(`<span class="tz-bar tz-bar--overlap" style="--s:${pos(a)};--e:${pos(b)}"></span>`);
            }),
          );
        }
        // keep Astro's scoped-style attribute on the generated bars
        const scope = Array.from(track.attributes).find((a) => a.name.startsWith('data-astro-cid'));
        track.innerHTML = bars.join('');
        if (scope) track.querySelectorAll('span').forEach((s) => s.setAttribute(scope.name, scope.value));
      }
      const overlap = tz.querySelector<HTMLElement>(`[data-tz-overlap="${row.tz}"]`);
      if (overlap) overlap.textContent = `${overlapHours(row.segments, home.segments)}h`;
    });

    tz.querySelectorAll<HTMLElement>('[data-tz-clock]').forEach((el) => {
      el.textContent = formatClock(el.dataset.tzClock ?? home.tz, now);
    });
    tz.querySelector<HTMLElement>('[data-tz-now]')?.style.setProperty('--x', pos(hoursNow(home.tz, now)));
  };

  // compare the server-rendered bars with what the browser computes right now
  function needsRebuild(rows: ReturnType<typeof zoneSegments>) {
    return rows.some((row) => {
      const track = tz?.querySelector<HTMLElement>(`[data-tz-track="${row.tz}"]`);
      const first = track?.querySelector<HTMLElement>('.tz-bar');
      return !first || first.style.getPropertyValue('--s') !== pos(row.segments[0][0]);
    });
  }

  update();
  window.setInterval(update, 30_000);

  if (motion) {
    const bars = tz.querySelectorAll('.tz-bar');
    gsap.set(bars, { scaleX: 0 });
    ScrollTrigger.create({
      trigger: tz,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(tz.querySelectorAll('.tz-bar'), { scaleX: 1, duration: 1.2, ease: 'expo.out', stagger: 0.05 }),
    });
  }
}
