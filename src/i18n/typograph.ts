/**
 * Light typographic polish applied to every string in a dictionary:
 * – short words (1–2 letters, e.g. «в», «и», «не», "a", "to") stick to the next word;
 * – dashes never start a line;
 * – numbers stay together with their units («24 часа», «600 000 ₽», "12 km").
 */
const NBSP = ' ';

export function typographString(s: string): string {
  if (!s.includes(' ')) return s;
  let out = s;
  // Two passes so chains like «и в» are fully bound.
  for (let i = 0; i < 2; i++) {
    out = out.replace(/(^|[\s(«„"'“/])([\p{L}\d]{1,2}) /gu, `$1$2${NBSP}`);
  }
  out = out.replace(/ ([—–])/g, `${NBSP}$1`);
  out = out.replace(/(\d) (?=[\p{L}\d₽$€%×])/gu, `$1${NBSP}`);
  return out;
}

export function typograph<T>(value: T): T {
  if (typeof value === 'string') return typographString(value) as T;
  if (Array.isArray(value)) return value.map((v) => typograph(v)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = typeof v === 'function' ? v : typograph(v);
    return out as T;
  }
  return value;
}
