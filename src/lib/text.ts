const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes text and turns *fragments* into dimmed spans. */
export function emphasize(text: string, className = 'dim'): string {
  return escapeHtml(text).replace(/\*(.+?)\*/g, `<span class="${className}">$1</span>`);
}

// Glyphs the pixel face can draw (it has no Cyrillic and no ₽).
const PIXEL_SAFE = /[\u0020-\u007E\u00A0-\u00FF\u2010-\u205E\u2191\u2193\u2212]/u;

/**
 * Splits a metric such as "12 нед." or "600 000 ₽" into the part set in the pixel
 * face and a trailing unit that has to fall back to the regular font.
 */
export function splitUnit(value: string): { num: string; unit: string } {
  const chars = [...value];
  const i = chars.findIndex((ch) => !PIXEL_SAFE.test(ch));
  if (i <= 0) return { num: value, unit: '' };
  return { num: chars.slice(0, i).join('').trimEnd(), unit: chars.slice(i).join('') };
}

/** True when a string needs glyphs the pixel face lacks. */
export const needsFallback = (value: string) => [...value].some((ch) => !PIXEL_SAFE.test(ch));

/** Two-digit section/item index: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0');
