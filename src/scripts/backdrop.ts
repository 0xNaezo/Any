/**
 * Backdrop — the dotted "night canvas" behind every page.
 *
 * One fragment shader draws three layers on a 2px pixel grid:
 *   1. a regular 32px dot grid that scrolls with the page (parallax 0.6)
 *   2. drifting ordered-dither "fog" that lives in the margins
 *   3. a lantern around the cursor that thickens the fog
 * The canvas renders at half resolution and is scaled up with
 * `image-rendering: pixelated`, so every dot is a crisp 2×2 px square.
 * Falls back to a CSS dot grid when WebGL is unavailable.
 */

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
precision mediump float;

uniform vec2 uRes;        // canvas size (canvas px)
uniform float uScale;     // canvas px per CSS px
uniform float uTime;
uniform float uScroll;    // CSS px
uniform vec2 uMouse;      // CSS px, top-left origin
uniform float uLantern;   // 0..1
uniform float uContent;   // half width of the content column (CSS px)
uniform vec3 uDot;
uniform vec3 uFog;
uniform vec3 uSolid;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 17.1;
    a *= 0.5;
  }
  return v;
}
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  float viewW = uRes.x / uScale;

  // --- 1. base dot grid ---------------------------------------------------
  vec2 g = mod(frag + vec2(0.0, uScroll * 0.6), 32.0);
  float gridA = step(g.x, 2.0) * step(g.y, 2.0) * 0.36;

  // --- 2. dither fog --------------------------------------------------------
  vec2 fp = frag + vec2(0.0, uScroll * 0.32);
  vec2 cell = floor(fp / 8.0);
  vec2 inCell = mod(fp, 8.0);

  float n = fbm(cell * 0.055 + vec2(uTime * 0.018, -uTime * 0.012));
  n = smoothstep(0.32, 0.86, n);

  float dx = abs(frag.x - viewW * 0.5);
  float edge = smoothstep(uContent - 24.0, uContent + 300.0, dx);

  float md = length(frag - uMouse);
  float lantern = (1.0 - smoothstep(40.0, 300.0, md)) * uLantern;

  float density = clamp(n * edge * 1.15 + lantern * (0.25 + n * 0.75), 0.0, 1.0);
  float th = bayer4(cell);

  float fogOn = step(th + 0.02, density);
  float dotMask = step(inCell.x, 4.0) * step(inCell.y, 4.0);
  float solid = step(0.9, density) * step(0.5, n);

  float fogA = fogOn * mix(dotMask * 0.62, 0.9, solid);
  vec3 fogC = mix(uFog, uSolid, solid);

  // premultiplied "fog over grid"
  float outA = fogA + gridA * (1.0 - fogA);
  vec3 outC = fogC * fogA + uDot * gridA * (1.0 - fogA);
  gl_FragColor = vec4(outC, outA);
}
`;

interface BackdropOptions {
  reduced: boolean;
  getScroll: () => number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function initBackdrop(canvas: HTMLCanvasElement, { reduced, getScroll }: BackdropOptions) {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) {
    canvas.parentElement?.classList.add('backdrop--fallback');
    return;
  }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[backdrop]', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) {
    canvas.parentElement?.classList.add('backdrop--fallback');
    return;
  }
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    canvas.parentElement?.classList.add('backdrop--fallback');
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const uRes = u('uRes');
  const uScale = u('uScale');
  const uTime = u('uTime');
  const uScroll = u('uScroll');
  const uMouse = u('uMouse');
  const uLantern = u('uLantern');
  const uContent = u('uContent');

  const css = getComputedStyle(document.documentElement);
  gl.uniform3fv(u('uDot'), hexToRgb(css.getPropertyValue('--accent') || '#8fb5ff'));
  gl.uniform3fv(u('uFog'), hexToRgb(css.getPropertyValue('--accent-mid') || '#5b86ff'));
  gl.uniform3fv(u('uSolid'), hexToRgb(css.getPropertyValue('--accent-deep') || '#2d5bff'));

  // One canvas pixel = 2 CSS px: the whole site is drawn on a 2px pixel grid.
  const SCALE = 0.5;
  let w = 0;
  let h = 0;
  const resize = () => {
    w = Math.ceil(window.innerWidth * SCALE);
    h = Math.ceil(window.innerHeight * SCALE);
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uScale, SCALE);
    const gutter = parseFloat(css.getPropertyValue('--gutter')) || 32;
    const container = parseFloat(css.getPropertyValue('--container')) || 1280;
    gl.uniform1f(uContent, Math.min(window.innerWidth / 2 - gutter, container / 2));
    dirty = true;
  };

  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, lantern: 0, target: 0 };
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !reduced) {
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.tx = e.clientX;
        mouse.ty = e.clientY;
        if (mouse.x < -999) {
          mouse.x = mouse.tx;
          mouse.y = mouse.ty;
        }
        mouse.target = 1;
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', () => (mouse.target = 0));
  }

  let dirty = true;
  let lastScroll = -1;
  let frame = 0;
  const start = performance.now();
  let raf = 0;

  const draw = (t: number) => {
    const scroll = reduced ? 0 : getScroll();
    // ease the lantern towards the pointer
    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    mouse.lantern += (mouse.target - mouse.lantern) * 0.06;

    const moving = scroll !== lastScroll || Math.abs(mouse.tx - mouse.x) > 0.5 || Math.abs(mouse.ty - mouse.y) > 0.5;
    frame++;
    // Full rate while something moves, ~20fps for the idle drift.
    if (!dirty && !moving && frame % 3 !== 0) {
      raf = requestAnimationFrame(draw);
      return;
    }
    lastScroll = scroll;
    dirty = false;

    gl.uniform1f(uTime, reduced ? 12 : (t - start) / 1000);
    gl.uniform1f(uScroll, scroll);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uLantern, mouse.lantern);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!reduced) raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', () => {
    resize();
    if (reduced) draw(performance.now());
  });
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    canvas.parentElement?.classList.add('backdrop--fallback');
  });

  canvas.parentElement?.classList.add('backdrop--ready');
  raf = requestAnimationFrame(draw);
}
