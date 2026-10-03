/**
 * The Nightloom ghost. One source of truth for the logo, the favicon and the
 * pattern woven by the loom.
 */

/** Silhouette without eyes (used for the "closed eyes" frame of the loom). */
export const GHOST_BODY =
  'M11 29C11 16.3 20.4 6 32 6S53 16.3 53 29V57.5C53 61 50.6 63.6 47.8 63.6C45 63.6 43.4 61.2 42.5 59.6C41.6 61.2 40 63.6 37.2 63.6S32.8 61.2 32 59.6C31.2 61.2 29.6 63.6 26.8 63.6S22.4 61.2 21.5 59.6C20.6 61.2 19 63.6 16.2 63.6C13.4 63.6 11 61 11 57.5Z';

export const GHOST_EYES =
  'M23.5 30a2.6 3.8 0 1 0 5.2 0a2.6 3.8 0 1 0 -5.2 0Z M35.3 30a2.6 3.8 0 1 0 5.2 0a2.6 3.8 0 1 0 -5.2 0Z';

/** Full mark, drawn with `fill-rule="evenodd"` so the eyes are cut out. */
export const GHOST_PATH = `${GHOST_BODY} ${GHOST_EYES}`;

/** Tight bounding box of the silhouette in path units. */
export const GHOST_BOX = { x: 11, y: 6, w: 42, h: 57.6 } as const;

/** Eye centres and radii in path units (for the blink frame). */
export const GHOST_EYE_SPOTS = [
  { cx: 26.1, cy: 30, rx: 2.6, ry: 3.8 },
  { cx: 37.9, cy: 30, rx: 2.6, ry: 3.8 },
] as const;

/** viewBox with a little air around the silhouette. */
export const GHOST_VIEWBOX = '8 3 48 64';
