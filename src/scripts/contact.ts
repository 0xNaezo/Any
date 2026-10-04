import { gsap, reduced } from './core';

type Rule = { test: (v: string) => boolean; msg: string };

const RULES: Record<string, Rule> = {
  name: { test: (v) => v.trim().length >= 2, msg: 'Please tell us your name.' },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    msg: 'That email address doesn’t look right.',
  },
  message: { test: (v) => v.trim().length >= 10, msg: 'A sentence or two about the project, please.' },
};

function typeOut(el: HTMLElement, text: string) {
  if (reduced) {
    el.textContent = text;
    return;
  }
  const proxy = { n: 0 };
  el.textContent = '';
  gsap.to(proxy, {
    n: text.length,
    duration: Math.min(1.4, text.length * 0.012),
    ease: `steps(${Math.min(text.length, 60)})`,
    onUpdate: () => {
      el.textContent = text.slice(0, Math.round(proxy.n));
    },
  });
}

export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const endpoint = (form.dataset.endpoint ?? '').trim();
  const inbox = form.dataset.email ?? '';
  let attempted = false;

  const control = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const validateField = (name: string): boolean => {
    const input = control(name);
    const rule = RULES[name];
    if (!input || !rule) return true;
    const ok = rule.test(input.value);
    const field = input.closest('.field');
    const err = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    field?.classList.toggle('has-error', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    if (err) {
      err.id = `err-${name}`;
      err.textContent = ok ? '' : rule.msg;
      if (ok) input.removeAttribute('aria-describedby');
      else input.setAttribute('aria-describedby', err.id);
    }
    return ok;
  };

  Object.keys(RULES).forEach((name) => {
    const input = control(name);
    input?.addEventListener('blur', () => attempted && validateField(name));
    input?.addEventListener('input', () => attempted && validateField(name));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    attempted = true;
    const invalid = Object.keys(RULES).filter((n) => !validateField(n));
    if (invalid.length) {
      control(invalid[0])?.focus();
      return;
    }

    const data = new FormData(form);
    // honeypot: bots fill every field
    if (String(data.get('website') ?? '').length > 0) {
      status.className = 'form__status is-ok';
      typeOut(status, '> message sent ✓');
      form.reset();
      return;
    }

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const needs = data.getAll('needs').map(String).join(', ');
    const budget = String(data.get('budget') ?? '');
    const message = String(data.get('message') ?? '').trim();

    if (!endpoint) {
      const subject = `Project inquiry — ${name}${company ? ` (${company})` : ''}`;
      const details = [`Name: ${name}`, `Email: ${email}`];
      if (company) details.push(`Company: ${company}`);
      if (needs) details.push(`Needs: ${needs}`);
      if (budget) details.push(`Budget: ${budget}`);
      const body = `${details.join('\n')}\n\n${message}`;
      status.className = 'form__status';
      typeOut(status, `> opening your email app…\n  if nothing happens, write to ${inbox}`);
      window.location.href = `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    submit.disabled = true;
    const original = submitLabel.textContent;
    submitLabel.textContent = 'Sending…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      const ticket = `NL-${Math.floor(1000 + Math.random() * 9000)}`;
      status.className = 'form__status is-ok';
      typeOut(
        status,
        `> message sent ✓\n  ticket ...... ${ticket}\n  reply ....... within one business day\n  next ........ we read it, then send questions or a call slot`,
      );
      form.reset();
      attempted = false;
    } catch {
      status.className = 'form__status is-error';
      typeOut(status, `> could not send the form.\n  please email us directly: ${inbox}`);
    } finally {
      submit.disabled = false;
      submitLabel.textContent = original;
    }
  });
}
