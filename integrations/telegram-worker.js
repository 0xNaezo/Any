/**
 * Nightloom — contact form → Telegram
 * ─────────────────────────────────────────────────────────────────────────────
 * A tiny Cloudflare Worker that receives the site's contact form and posts it
 * to a Telegram chat through the Bot API. The free plan is plenty.
 *
 * Setup (about five minutes):
 *   1. Create a bot with @BotFather and copy its token.
 *   2. Write any message to the bot (or add it to a group), then open
 *      https://api.telegram.org/bot<TOKEN>/getUpdates and copy "chat":{"id": …}.
 *   3. Deploy and add the secrets:
 *        npx wrangler deploy integrations/telegram-worker.js --name nightloom-form --compatibility-date 2026-01-01
 *        npx wrangler secret put TELEGRAM_BOT_TOKEN --name nightloom-form
 *        npx wrangler secret put TELEGRAM_CHAT_ID --name nightloom-form
 *        npx wrangler secret put ALLOWED_ORIGIN --name nightloom-form   # e.g. https://nightloom.dev
 *   4. Put the worker URL into `contact.form.endpoint` in src/data/site.ts.
 *
 * ALLOWED_ORIGIN may hold several origins separated by commas. Without it the
 * worker accepts requests from any site — fine for testing, not for production.
 *
 * The site sends JSON. Plain form posts (visitors without JavaScript) work too:
 * they get a short HTML confirmation page instead of a JSON response.
 */

const LIMITS = {
  name: 120,
  email: 200,
  company: 200,
  needs: 300,
  budget: 60,
  plan: 60,
  nda: 5,
  subject: 200,
  message: 3000,
};
const MAX_BODY = 20_000;
const TELEGRAM_MAX = 4096;

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Minimal confirmation page for form posts without JavaScript. */
const page = (title, text, back) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0c;color:#ededf0;font:17px/1.6 system-ui,sans-serif}
main{max-width:30rem;padding:24px}h1{font-size:28px;font-weight:500;letter-spacing:-.02em;margin:0 0 8px}p{color:#a1a1aa;margin:0 0 24px}a{color:#a8f0cc}</style>
</head><body><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p><a href="${escapeHtml(back)}">Back to the site</a></main></body></html>`;

/** Reads JSON or url-encoded bodies into a flat object. */
function parseBody(raw, contentType) {
  if (contentType.includes('application/json')) {
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const data = Object.fromEntries(params);
    data.needs = params.getAll('needs').join(', ');
    data.nda = params.has('nda') ? 'Yes' : 'No';
    return data;
  }
  return null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || '*').split(',').map((item) => item.trim()).filter(Boolean);
    const anyOrigin = allowed.includes('*');
    const contentType = request.headers.get('Content-Type') || '';
    const isFormPost = contentType.includes('application/x-www-form-urlencoded');
    const back = request.headers.get('Referer') || origin || '/';

    const cors = {
      'Access-Control-Allow-Origin': anyOrigin ? '*' : allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
    const reply = (status, ok, error = '') => {
      if (isFormPost) {
        const html = ok
          ? page('Thank you — it’s with us.', 'A real person will read your message and reply within one business day.', back)
          : page('That didn’t go through.', `${error}. Please go back and try again, or write to us by email.`, back);
        return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      return new Response(JSON.stringify(ok ? { ok } : { ok, error }), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return reply(405, false, 'Method not allowed');
    if (!anyOrigin && !allowed.includes(origin)) return reply(403, false, 'Forbidden');
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return reply(500, false, 'Not configured');

    const raw = await request.text();
    if (raw.length > MAX_BODY) return reply(413, false, 'Message is too long');

    let data;
    try {
      data = parseBody(raw, contentType);
    } catch {
      data = null;
    }
    if (!data) return reply(400, false, 'Invalid request');

    // Honeypot: bots fill hidden fields. Pretend everything went fine.
    if (data._gotcha) return reply(200, true);

    const form = {};
    for (const [key, limit] of Object.entries(LIMITS)) form[key] = String(data[key] ?? '').trim().slice(0, limit);

    const valid =
      form.name.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email) && form.message.length >= 20;
    if (!valid) return reply(422, false, 'Some fields are missing: name, a valid email and a short message');

    const rows = [
      ['Name', form.name],
      ['Email', form.email],
      ['Company', form.company],
      ['Needs', form.needs],
      ['Budget', form.budget],
      ['Plan', form.plan],
      ['NDA first', form.nda],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `<b>${label}:</b> ${escapeHtml(value)}`);

    const head = `<b>${escapeHtml(form.subject || 'New project request')}</b>\n\n${rows.join('\n')}\n\n`;
    let body = escapeHtml(form.message);
    const room = Math.max(0, TELEGRAM_MAX - head.length - 1);
    // Trim without cutting an HTML entity in half (Telegram rejects broken markup).
    if (body.length > room) body = `${body.slice(0, room).replace(/&[^;\s]*$/, '')}…`;

    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: head + body,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
    });

    if (!response.ok) return reply(502, false, 'Delivery failed');
    return reply(200, true);
  },
};
