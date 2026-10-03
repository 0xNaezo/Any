/** Deterministic, build-stable ids for inline SVG defs (gradients, masks, patterns). */
let counter = 0;
export const nextId = (prefix: string) => `${prefix}-${(++counter).toString(36)}`;
