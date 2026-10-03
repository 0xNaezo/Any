import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type FieldName = 'name' | 'email' | 'message';

const validators: Record<FieldName, (value: string) => boolean> = {
  name: (v) => v.trim().length > 1,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  message: (v) => v.trim().length >= 10,
};

/**
 * Contact form: inline validation, then
 *  • POST to PUBLIC_FORM_ENDPOINT (Formspree, Web3Forms, Getform, your API…) when configured, or
 *  • fall back to the visitor's email client with everything pre-filled.
 */
export function initContactForm(motion: boolean) {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  // Native validation stays on for visitors without JS; with JS we render our own inline errors
  form.noValidate = true;

  const endpoint = form.dataset.endpoint ?? '';
  const accessKey = form.dataset.accessKey ?? '';
  const email = form.dataset.email ?? '';
  const fields = form.querySelector<HTMLElement>('[data-form-fields]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const submitLabel = submit?.querySelector<HTMLElement>('.btn-label');
  const defaultLabel = submitLabel?.textContent ?? 'Send message';
  let attempted = false;

  const control = (name: FieldName) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;

  const validate = (name: FieldName) => {
    const input = control(name);
    if (!input) return true;
    const ok = validators[name](input.value);
    input.closest('.field')?.classList.toggle('is-invalid', !ok);
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  };

  (Object.keys(validators) as FieldName[]).forEach((name) => {
    const input = control(name);
    const error = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (input && error) {
      error.id = `contact-error-${name}`;
      input.setAttribute('aria-describedby', error.id);
    }
    input?.addEventListener('input', () => {
      if (attempted) validate(name);
    });
    input?.addEventListener('blur', () => {
      if (attempted || input.value) validate(name);
    });
  });

  const setLoading = (loading: boolean) => {
    if (!submit) return;
    submit.disabled = loading;
    submit.setAttribute('aria-busy', String(loading));
    if (submitLabel) submitLabel.textContent = loading ? 'Sending…' : defaultLabel;
  };

  const showSuccess = () => {
    if (!fields || !success) return;
    const reveal = () => {
      fields.hidden = true;
      success.hidden = false;
      success.setAttribute('tabindex', '-1');
      success.focus({ preventScroll: true });
      if (motion) gsap.from(success.children, { y: 20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 });
      ScrollTrigger.refresh();
    };
    if (motion) gsap.to(fields, { opacity: 0, y: -10, duration: 0.35, ease: 'power2.in', onComplete: reveal });
    else reveal();
  };

  const toPlainText = (data: FormData) =>
    [
      `Name: ${data.get('name') ?? ''}`,
      `Email: ${data.get('email') ?? ''}`,
      `Company: ${data.get('company') || '—'}`,
      `Interested in: ${data.getAll('services').join(', ') || '—'}`,
      `Budget: ${data.get('budget') || '—'}`,
      '',
      String(data.get('message') ?? ''),
    ].join('\n');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    attempted = true;
    if (status) status.textContent = '';

    const results = (Object.keys(validators) as FieldName[]).map((name) => [name, validate(name)] as const);
    const firstInvalid = results.find(([, ok]) => !ok);
    if (firstInvalid) {
      control(firstInvalid[0])?.focus();
      return;
    }

    const data = new FormData(form);

    // Honeypot filled → silently pretend everything went fine
    if (data.get('_gotcha')) {
      showSuccess();
      return;
    }

    const services = data.getAll('services').join(', ');
    data.delete('services');
    data.set('services', services || '—');

    if (!endpoint) {
      const subject = `New project enquiry — ${data.get('name')}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(toPlainText(data))}`;
      showSuccess();
      return;
    }

    if (accessKey) data.set('access_key', accessKey);
    data.set('subject', `New project enquiry — ${data.get('name')}`);
    data.delete('_gotcha');

    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Request failed with ${response.status}`);
      showSuccess();
    } catch (error) {
      console.error('[nightloom] contact form', error);
      if (status) {
        const link = document.createElement('a');
        link.href = `mailto:${email}`;
        link.className = 'link';
        link.textContent = email;
        status.replaceChildren(`${form.dataset.errorText ?? 'Something went wrong.'} `, link);
      }
    } finally {
      setLoading(false);
    }
  });
}
