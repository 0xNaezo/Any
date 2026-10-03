const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes text and turns *fragments* into dimmed spans. */
export function emphasize(text: string, className = 'dim'): string {
  return escapeHtml(text).replace(/\*(.+?)\*/g, `<span class="${className}">$1</span>`);
}

/** Two-digit section/item index: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0');
