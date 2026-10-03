import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

const EASE = 'expo.out';
// Play once, never reverse. Deliberately not `once: true`: self-killing triggers
// corrupt ScrollTrigger's internal list when the page loads already scrolled
// (deep link, reload) while timeline-based triggers are still pending.
const PLAY_ONCE = { toggleActions: 'play none none none' } as const;
const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  [...root.querySelectorAll<T>(selector)];

/** Hero entrance. Resolves when the headline starts moving. */
export function heroIntro(onStart: () => void) {
  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  const items = $$('[data-hero-item]');
  const header = document.querySelector<HTMLElement>('[data-header]');

  onStart();
  const tl = gsap.timeline({ defaults: { ease: EASE } });

  // Animate the header's contents, not the header itself: it has a CSS transform
  // transition (auto-hide) that would fight GSAP.
  if (header) {
    const parts = header.querySelectorAll('.brand, .nav, .header__actions');
    tl.fromTo(parts, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08, clearProps: 'transform' }, 0.1);
  }

  if (title) {
    gsap.set(title, { opacity: 1 });
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
    tl.from(split.lines, { yPercent: 115, rotate: 2, duration: 1.5, stagger: 0.11, transformOrigin: '0% 100%' }, 0.15);
    tl.call(() => split.revert(), undefined, '+=0.1');
  }

  tl.fromTo(
    items,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 1.2, stagger: 0.07, ease: 'power3.out', clearProps: 'transform' },
    0.55,
  );
  return tl;
}

export function initScrollAnimations() {
  // ── section hairlines draw in ─────────────────────────────────────────
  $$('[data-line]').forEach((line) => {
    gsap.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: line, start: 'top 92%', ...PLAY_ONCE } },
    );
  });

  // ── mono labels decode ────────────────────────────────────────────────
  $$('[data-scramble]').forEach((el) => {
    const text = el.textContent?.trim() ?? '';
    gsap.to(el, {
      duration: 1.1,
      ease: 'none',
      scrambleText: { text, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', speed: 0.5, revealDelay: 0.2 },
      scrollTrigger: { trigger: el, start: 'top 92%', ...PLAY_ONCE },
    });
  });

  // ── headings rise line by line ────────────────────────────────────────
  $$('[data-split]').forEach((heading) => {
    gsap.set(heading, { opacity: 1 });
    SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 112,
          rotate: 1.5,
          transformOrigin: '0% 100%',
          duration: 1.4,
          stagger: 0.1,
          ease: EASE,
          scrollTrigger: { trigger: heading, start: 'top 88%', ...PLAY_ONCE },
        }),
    });
  });

  // ── generic reveals ───────────────────────────────────────────────────
  const revealed = new WeakSet<Element>();
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    onEnter: (batch) => {
      const fresh = batch.filter((el) => !revealed.has(el));
      if (!fresh.length) return;
      fresh.forEach((el) => revealed.add(el));
      gsap.fromTo(
        fresh,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' },
      );
    },
  });

  $$('[data-stagger]').forEach((group) => {
    const children = $$('[data-stagger-item]', group);
    gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: group, start: 'top 85%', ...PLAY_ONCE },
      },
    );
  });

  // ── counters ──────────────────────────────────────────────────────────
  $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const state = { value: 0 };
    el.textContent = (0).toFixed(decimals);
    gsap.to(state, {
      value: target,
      duration: 2.2,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = state.value.toFixed(decimals)),
      scrollTrigger: { trigger: el, start: 'top 90%', ...PLAY_ONCE },
    });
  });

  // ── case studies ──────────────────────────────────────────────────────
  $$('[data-case]').forEach((card) => {
    const media = card.querySelector<HTMLElement>('.case__media');
    const body = card.querySelector<HTMLElement>('.case__body');
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', ...PLAY_ONCE } });
    if (media)
      tl.fromTo(
        media,
        { clipPath: 'inset(18% 6% 0% 6% round 20px)', opacity: 0 },
        { clipPath: 'inset(0% 0% 0% 0% round 20px)', opacity: 1, duration: 1.6, ease: 'expo.out', clearProps: 'clipPath' },
      );
    if (body) tl.fromTo(body.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.06, ease: 'power3.out' }, 0.25);
  });

  $$('[data-parallax]').forEach((layer) => {
    gsap.fromTo(
      layer,
      { yPercent: 5 },
      {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: layer.closest('[data-case]') || layer, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // ── testimonial: words light up as you read ───────────────────────────
  $$('[data-scrub-words]').forEach((quote) => {
    SplitText.create(quote, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: { trigger: quote, start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
          },
        ),
    });
  });

  // ── process: thread fills, steps light up, counter follows ───────────
  const process = document.querySelector<HTMLElement>('[data-process]');
  if (process) {
    const fill = process.querySelector<HTMLElement>('[data-steps-fill]');
    const steps = $$('[data-step]', process);
    const num = process.querySelector<HTMLElement>('[data-step-num]');
    const name = process.querySelector<HTMLElement>('[data-step-name]');
    const bar = process.querySelector<HTMLElement>('[data-step-bar]');
    const list = process.querySelector<HTMLElement>('.steps');

    if (fill && list) {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } },
      );
    }

    const setCurrent = (index: number) => {
      const step = steps[index];
      if (!step) return;
      if (num) {
        const next = String(index + 1).padStart(2, '0');
        if (num.textContent !== next) {
          gsap.fromTo(num, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: EASE });
          num.textContent = next;
        }
      }
      if (name) name.textContent = step.dataset.stepTitle || '';
      if (bar) bar.style.transform = `scaleX(${(index + 1) / steps.length})`;
    };

    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        onEnter: () => {
          step.classList.add('is-active');
          setCurrent(index);
        },
        onLeaveBack: () => {
          step.classList.remove('is-active');
          setCurrent(Math.max(index - 1, 0));
        },
      });
    });
  }

  // ── footer wordmark rises ─────────────────────────────────────────────
  const wordmark = document.querySelector<HTMLElement>('[data-wordmark]');
  if (wordmark) {
    gsap.from(wordmark.children, {
      yPercent: 100,
      duration: 1.6,
      stagger: 0.045,
      ease: EASE,
      scrollTrigger: { trigger: wordmark, start: 'top 98%', ...PLAY_ONCE },
    });
  }
}

/** Reduced motion: no movement, but keep stateful UI (process steps) working. */
export function initStaticStates() {
  const steps = $$('[data-step]');
  steps.forEach((step) => step.classList.add('is-active'));
  const fill = document.querySelector<HTMLElement>('[data-steps-fill]');
  if (fill) fill.style.transform = 'scaleY(1)';
  const process = document.querySelector<HTMLElement>('[data-process]');
  if (process) {
    const num = process.querySelector<HTMLElement>('[data-step-num]');
    const name = process.querySelector<HTMLElement>('[data-step-name]');
    const bar = process.querySelector<HTMLElement>('[data-step-bar]');
    steps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 62%',
        end: 'bottom 62%',
        onToggle: (self) => {
          if (!self.isActive) return;
          if (num) num.textContent = String(index + 1).padStart(2, '0');
          if (name) name.textContent = step.dataset.stepTitle || '';
          if (bar) bar.style.transform = `scaleX(${(index + 1) / steps.length})`;
        },
      });
    });
  }
}
