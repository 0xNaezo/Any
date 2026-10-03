/**
 * Hero "loom", WebGL2 edition.
 *
 * Horizontal threads span the hero. Underneath them the Nightloom ghost rises
 * like a figure under a sheet: the threads lift over its shape and catch a
 * soft moonlight from the top left. The threads are real strings: the pointer
 * parts them like a finger, and they snap back and ring when it moves on.
 *
 * - Geometry: one feathered triangle strip per thread, crisp at any DPR.
 * - Physics: a 1-D wave equation per thread on the CPU. Displacements are
 *   streamed to the GPU as an R32F texture, and only while something moves.
 * - Intro: every thread is shot across like a shuttle, then the ghost rises.
 * - Pauses off-screen and in background tabs. Reduced motion gets one still
 *   frame. `Loom.create` returns null without WebGL2 (Canvas2D fallback).
 */

const clamp = (v: number, min = 0, max = 1) => (v < min ? min : v > max ? max : v);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const THREAD_VS = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;

layout(location = 0) in vec3 a_vert; // column, row, side (-1 | 1)

uniform vec2 u_size;      // canvas size, CSS px
uniform float u_dx;       // column spacing
uniform float u_gap;      // row spacing
uniform float u_offset;   // y of the first thread
uniform float u_cols;
uniform sampler2D u_disp; // string displacement per node
uniform vec4 u_ghost;     // centre x, top, half width, height
uniform float u_rise;     // 0 → 1 as the ghost lifts the fabric
uniform float u_lift;     // max lift, px
uniform float u_time;
uniform float u_half;     // quad half width, CSS px
uniform vec3 u_pointer;   // x, y, presence
uniform float u_fade;

out float v_alpha;
out float v_edge;
out float v_glow;
out vec2 v_rest;
flat out float v_row;

const float TAU = 6.28318530718;

// The ghost is a capsule under the cloth: a dome on a gently flaring body,
// cut off by a flowing hem. x: how far the fabric lifts (0…1),
// y: how much of the point is "ghost" (for brightness).
vec2 ghost(vec2 p) {
  float r = u_ghost.z;
  vec2 q = p - u_ghost.xy;
  float flare = 1.0 + 0.09 * smoothstep(r, u_ghost.w, q.y);
  vec2 s = vec2(q.x / flare, min(q.y - r, 0.0)) / r;
  float rho2 = dot(s, s);
  float x = 1.0 - rho2;
  const float k = 0.05;
  float height = sqrt(max(x, 0.0) + k * log(1.0 + exp(-abs(x) / k)));
  float amp = r * 0.1;
  float hem = u_ghost.w - amp + amp * cos(q.x / (r * 0.78) * TAU + u_time * 1.6);
  float fade = 1.0 - smoothstep(hem - r * 0.5, hem, q.y);
  float inside = 1.0 - smoothstep(0.86, 1.08, sqrt(rho2));
  return vec2(height * fade, inside * fade);
}

float shape(vec2 p) {
  return ghost(p).x;
}

float breeze(vec2 p) {
  return sin(p.x * 0.0042 + p.y * 0.037 + u_time * 0.6) * 0.7;
}

vec2 place(float col, float row, out float disp) {
  vec2 rest = vec2(col * u_dx, u_offset + row * u_gap);
  disp = texelFetch(u_disp, ivec2(int(col), int(row)), 0).r;
  return vec2(rest.x, rest.y - shape(rest) * u_lift * u_rise + disp + breeze(rest));
}

void main() {
  float col = a_vert.x;
  float row = a_vert.y;
  vec2 rest = vec2(col * u_dx, u_offset + row * u_gap);

  float d0, da, db;
  vec2 p = place(col, row, d0);
  vec2 pa = place(max(col - 1.0, 0.0), row, da);
  vec2 pb = place(min(col + 1.0, u_cols - 1.0), row, db);
  vec2 dir = pb - pa;
  dir = dot(dir, dir) > 1e-6 ? normalize(dir) : vec2(1.0, 0.0);
  vec2 pos = p + vec2(-dir.y, dir.x) * a_vert.z * u_half;

  // moonlight from the top left on the lifted fabric
  float e = 3.0;
  float hx = (shape(rest + vec2(e, 0.0)) - shape(rest - vec2(e, 0.0))) / (2.0 * e);
  float hy = (shape(rest + vec2(0.0, e)) - shape(rest - vec2(0.0, e))) / (2.0 * e);
  float k = u_lift * u_rise * 2.8;
  vec3 n = normalize(vec3(-hx * k, -hy * k, 1.0));
  vec3 l = normalize(vec3(-0.55, -0.75, 0.62));
  float diffuse = max(dot(n, l), 0.0) / l.z; // 1 on flat cloth
  float g = ghost(rest).y * u_rise;
  float lit = pow(diffuse, 2.2);

  // ringing threads glint, and the pointer carries a small lantern
  float ring = clamp(abs(db - da) / (2.0 * u_dx) * 1.4, 0.0, 1.0);
  vec2 dp = p - u_pointer.xy;
  float lantern = exp(-dot(dp, dp) / (2.0 * 70.0 * 70.0)) * u_pointer.z;

  float alpha = 0.075 + g * (0.1 + 0.44 * lit) + ring * 0.35 + lantern * 0.5;
  v_glow = clamp(g * clamp((lit - 1.1) * 0.45, 0.0, 0.55) + lantern * 0.7 + ring * 0.6, 0.0, 1.0);
  v_alpha = clamp(alpha, 0.0, 1.0) * u_fade;
  v_edge = a_vert.z * u_half;
  v_rest = rest;
  v_row = row;

  vec2 clip = pos / u_size * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

const THREAD_FS = /* glsl */ `#version 300 es
precision highp float;

in float v_alpha;
in float v_edge;
in float v_glow;
in vec2 v_rest;
flat in float v_row;

uniform float u_dpr;
uniform float u_core;    // line width, device px
uniform float u_intro;   // seconds since the weave started
uniform float u_rows;
uniform float u_width;   // canvas width, CSS px
uniform vec4 u_eyes;     // left eye (xy), right eye (zw), in fabric coordinates
uniform vec2 u_eyeSize;  // radii

out vec4 outColor;

void main() {
  // the shuttle: threads are shot across in turn, alternating sides
  float t = clamp((u_intro - v_row / u_rows * 0.62) / 0.8, 0.0, 1.0);
  float p = 1.0 - pow(1.0 - t, 3.0);
  bool ltr = mod(v_row, 2.0) < 0.5;
  float head = ltr ? p * u_width : (1.0 - p) * u_width;
  float ahead = ltr ? v_rest.x - head : head - v_rest.x;
  if (ahead > 0.0) discard;

  // the eyes are holes in the fabric
  vec2 a = (v_rest - u_eyes.xy) / u_eyeSize;
  vec2 b = (v_rest - u_eyes.zw) / u_eyeSize;
  if (min(dot(a, a), dot(b, b)) < 1.0) discard;

  float cover = clamp(u_core * 0.5 + 0.5 - abs(v_edge) * u_dpr, 0.0, 1.0);
  float spark = (1.0 - t) * smoothstep(-16.0, 0.0, ahead);
  float alpha = clamp(v_alpha + spark * 0.9, 0.0, 1.0) * cover;
  vec3 color = mix(vec3(0.929, 0.929, 0.941), vec3(0.659, 0.941, 0.8), clamp(v_glow + spark, 0.0, 1.0));
  outColor = vec4(color * alpha, alpha);
}
`;

const BG_VS = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`;

const BG_FS = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 u_size;
uniform float u_dpr;
uniform vec4 u_ghost;
uniform float u_rise;
uniform vec3 u_pointer;

out vec4 outColor;

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;
  vec3 color = vec3(0.039, 0.039, 0.047);

  // moonlight halo behind the ghost
  vec2 q = (p - vec2(u_ghost.x, u_ghost.y + u_ghost.w * 0.42)) / vec2(u_ghost.z * 2.7, u_ghost.w * 1.2);
  color += vec3(0.62, 0.7, 0.78) * exp(-dot(q, q) * 1.6) * 0.06 * u_rise;

  vec2 dp = p - u_pointer.xy;
  color += vec3(0.55, 0.85, 0.75) * exp(-dot(dp, dp) / (2.0 * 150.0 * 150.0)) * 0.018 * u_pointer.z;

  // dither so the gradients never band
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (n - 0.5) * (1.5 / 255.0);
  outColor = vec4(color, 1.0);
}
`;

type Uniforms = Record<string, WebGLUniformLocation | null>;

interface Program {
  program: WebGLProgram;
  u: Uniforms;
}

function compile(gl: WebGL2RenderingContext, vs: string, fs: string, names: string[]): Program {
  const program = gl.createProgram()!;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader');
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'link');
  const u: Uniforms = {};
  for (const name of names) u[name] = gl.getUniformLocation(program, name);
  return { program, u };
}

interface Options {
  reducedMotion: boolean;
}

export class Loom {
  /** WebGL2 renderer, or null when the browser can't run it. */
  static create(canvas: HTMLCanvasElement, options: Options): Loom | null {
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return null;
    try {
      return new Loom(canvas, gl, options);
    } catch (error) {
      console.warn('[loom] falling back to 2D:', error);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return null;
    }
  }

  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private host: HTMLElement;
  private anchor: HTMLElement | null;
  private reduced: boolean;
  private threads!: Program;
  private bg!: Program;
  private vao!: WebGLVertexArrayObject;
  private bgVao!: WebGLVertexArrayObject;
  private vbo!: WebGLBuffer;
  private ibo!: WebGLBuffer;
  private tex!: WebGLTexture;
  private indexCount = 0;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private cols = 0;
  private rows = 0;
  private dx = 8;
  private gap = 9;
  private offset = 0;
  private u = new Float32Array(0);
  private v = new Float32Array(0);
  private moving = false;

  private ghost = { x: 0, top: 0, r: 0, h: 0 };
  private pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, on: 0, target: 0, radius: 34, push: 16 };
  private look = { x: 0, y: 0 };
  private time = 0;
  private last = 0;
  private introAt = -1;
  private blinkAt = 3.2;
  private blink = 0;
  private scroll = 0;
  private raf = 0;
  private inView = true;
  private pageVisible = true;
  private lost = false;
  private hinted = false;
  private touched = false;

  private constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, options: Options) {
    this.canvas = canvas;
    this.gl = gl;
    this.host = canvas.parentElement as HTMLElement;
    this.anchor = this.host.querySelector<HTMLElement>('[data-ghost-anchor]');
    this.reduced = options.reducedMotion;
    this.setup();
    this.resize();
    this.bind();
    // paint the empty loom right away so the canvas never flashes black
    this.draw(0);
  }

  /** Starts the weave, then the rise. */
  start() {
    if (this.reduced) {
      this.introAt = -1e6;
      this.draw(99);
      return;
    }
    this.introAt = performance.now();
    this.last = this.introAt;
    this.loop();
  }

  /** Seconds since the weave started (0 before it does, "long ago" for reduced motion). */
  private elapsed() {
    if (this.reduced) return 99;
    return this.introAt < 0 ? 0 : (performance.now() - this.introAt) / 1000;
  }

  // ── setup ─────────────────────────────────────────────────────────────────
  private setup() {
    const gl = this.gl;
    this.threads = compile(gl, THREAD_VS, THREAD_FS, [
      'u_size', 'u_dx', 'u_gap', 'u_offset', 'u_cols', 'u_disp', 'u_ghost', 'u_rise', 'u_lift', 'u_time',
      'u_half', 'u_pointer', 'u_fade', 'u_dpr', 'u_core', 'u_intro', 'u_rows', 'u_width', 'u_eyes', 'u_eyeSize',
    ]);
    this.bg = compile(gl, BG_VS, BG_FS, ['u_size', 'u_dpr', 'u_ghost', 'u_rise', 'u_pointer']);

    this.vao = gl.createVertexArray()!;
    this.bgVao = gl.createVertexArray()!;
    this.vbo = gl.createBuffer()!;
    this.ibo = gl.createBuffer()!;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bindVertexArray(null);

    this.tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  }

  private bind() {
    // resizing clears the canvas, so repaint the current state straight away
    new ResizeObserver(() => {
      if (this.lost) return;
      this.resize();
      this.draw(this.elapsed());
    }).observe(this.host);

    new IntersectionObserver(([entry]) => {
      this.inView = entry.isIntersecting;
      if (this.inView) this.loop();
    }).observe(this.host);

    document.addEventListener('visibilitychange', () => {
      this.pageVisible = document.visibilityState === 'visible';
      if (this.pageVisible) {
        this.last = performance.now();
        this.loop();
      }
    });

    this.canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      this.lost = true;
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    });
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.lost = false;
      this.setup();
      this.resize();
      this.draw(this.elapsed());
      this.loop();
    });

    window.addEventListener(
      'scroll',
      () => {
        this.scroll = clamp(window.scrollY / Math.max(1, this.h));
      },
      { passive: true },
    );

    if (this.reduced) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType === 'touch') return;
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        this.pointer.tx = x;
        this.pointer.ty = y;
        this.pointer.target = y > 0 && y < rect.height && fine ? 1 : 0;
        if (this.pointer.target && this.hinted && !this.touched) {
          this.touched = true;
          window.setTimeout(() => this.host.classList.add('is-touched'), 1600);
        }
        if (this.pointer.x < -1e3) {
          this.pointer.x = x;
          this.pointer.y = y;
        }
      },
      { passive: true },
    );
    document.documentElement.addEventListener('pointerleave', () => (this.pointer.target = 0));

    // taps and clicks pluck the threads
    this.host.addEventListener(
      'pointerdown',
      (event) => {
        if ((event.target as Element).closest('a, button, input, textarea, select, label')) return;
        const rect = this.canvas.getBoundingClientRect();
        this.pluck(event.clientX - rect.left, event.clientY - rect.top, event.pointerType === 'touch' ? 1 : 0.8);
      },
      { passive: true },
    );
  }

  private resize() {
    const gl = this.gl;
    const rect = this.host.getBoundingClientRect();
    this.w = Math.max(1, Math.round(rect.width));
    this.h = Math.max(1, Math.round(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    const narrow = this.w < 640;
    this.gap = narrow ? 7.5 : 8.5;
    this.rows = Math.min(200, Math.ceil(this.h / this.gap) + 1);
    this.offset = (this.h - (this.rows - 1) * this.gap) / 2;
    this.cols = Math.min(280, Math.max(48, Math.ceil(this.w / (narrow ? 6 : 7)) + 1));
    this.dx = this.w / (this.cols - 1);
    this.pointer.radius = narrow ? 28 : 34;
    this.pointer.push = narrow ? 14 : 19;

    // geometry: two vertices per node, two triangles per segment
    const { rows, cols } = this;
    const verts = new Float32Array(rows * cols * 6);
    let o = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        verts[o++] = j;
        verts[o++] = i;
        verts[o++] = -1;
        verts[o++] = j;
        verts[o++] = i;
        verts[o++] = 1;
      }
    }
    const indices = new Uint32Array(rows * (cols - 1) * 6);
    o = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const a = (i * cols + j) * 2;
        indices[o++] = a;
        indices[o++] = a + 1;
        indices[o++] = a + 2;
        indices[o++] = a + 1;
        indices[o++] = a + 3;
        indices[o++] = a + 2;
      }
    }
    this.indexCount = indices.length;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    // strings
    this.u = new Float32Array(rows * cols);
    this.v = new Float32Array(rows * cols);
    this.moving = false;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, cols, rows, 0, gl.RED, gl.FLOAT, this.u);

    if (this.anchor) {
      const a = this.anchor.getBoundingClientRect();
      this.ghost = { x: a.left - rect.left + a.width / 2, top: a.top - rect.top, r: a.width / 2, h: a.height };
    } else {
      const r = Math.min(this.w * 0.12, 200);
      this.ghost = { x: this.w * 0.7, top: this.h * 0.16, r, h: r * 2.4 };
    }
  }

  // ── strings ───────────────────────────────────────────────────────────────
  /** A radial impulse: threads near (x, y) are flicked away from it. */
  pluck(x: number, y: number, strength = 1) {
    if (this.reduced || this.lost) return;
    const { cols, rows, dx, gap, offset, v } = this;
    const sigma = 70;
    const reach = sigma * 2.5;
    const i0 = Math.max(0, Math.floor((y - reach - offset) / gap));
    const i1 = Math.min(rows - 1, Math.ceil((y + reach - offset) / gap));
    const j0 = Math.max(1, Math.floor((x - reach) / dx));
    const j1 = Math.min(cols - 2, Math.ceil((x + reach) / dx));
    for (let i = i0; i <= i1; i++) {
      const ddy = offset + i * gap - y;
      for (let j = j0; j <= j1; j++) {
        const ddx = j * dx - x;
        const f = Math.exp(-(ddx * ddx + ddy * ddy) / (2 * sigma * sigma));
        v[i * cols + j] += Math.sign(ddy || 1) * f * 240 * strength;
      }
    }
    this.moving = true;
  }

  private simulate(dt: number) {
    const { cols, rows, dx, gap, offset, u, v, pointer: p } = this;
    const speed = 760; // px/s along a thread
    const steps = Math.min(8, Math.ceil(dt / ((0.7 * dx) / speed)));
    const h = dt / steps;
    const c2 = (speed * speed) / (dx * dx);
    const damp = Math.exp(-3.4 * h);
    const spring = 40;
    const stiff = 520;

    // the pointer is a soft lens: threads near it are eased apart, the ones
    // right under it stay put, so nothing ever snaps through
    const push = p.push * p.on;
    const sigma = p.radius;
    const reach = sigma * 3;
    let i0 = 1;
    let i1 = 0;
    let j0 = 1;
    let j1 = 0;
    if (push > 0.05) {
      i0 = Math.max(0, Math.floor((p.y - reach - offset) / gap));
      i1 = Math.min(rows - 1, Math.ceil((p.y + reach - offset) / gap));
      j0 = Math.max(1, Math.floor((p.x - reach) / dx));
      j1 = Math.min(cols - 2, Math.ceil((p.x + reach) / dx));
    }
    const inv2s2 = 1 / (2 * sigma * sigma);
    const inv2w2 = 1 / (2 * (sigma * 1.6) ** 2);

    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < rows; i++) {
        const row = i * cols;
        for (let j = 1; j < cols - 1; j++) {
          const k = row + j;
          const a = c2 * (u[k - 1] - 2 * u[k] + u[k + 1]) - spring * u[k];
          v[k] = (v[k] + a * h) * damp;
        }
      }
      for (let i = i0; i <= i1; i++) {
        const ddy = offset + i * gap - p.y;
        const lens = (ddy / sigma) * Math.exp(-ddy * ddy * inv2s2) * 1.6487; // peaks at ±σ
        const wy = Math.exp(-ddy * ddy * inv2w2);
        for (let j = j0; j <= j1; j++) {
          const ddx = j * dx - p.x;
          const fx = Math.exp(-ddx * ddx * inv2w2);
          const k = i * cols + j;
          v[k] += (push * lens * fx - u[k]) * stiff * fx * wy * h;
        }
      }
      for (let k = 0; k < u.length; k++) u[k] += v[k] * h;
    }

    let peak = 0;
    for (let k = 0; k < u.length; k++) {
      const m = Math.abs(u[k]) + Math.abs(v[k]) * 0.02;
      if (m > peak) peak = m;
    }
    if (peak < 0.02 && push <= 0.05) {
      u.fill(0);
      v.fill(0);
      this.moving = false;
    } else {
      this.moving = true;
    }
  }

  // ── frame loop ────────────────────────────────────────────────────────────
  private loop = () => {
    if (this.reduced || this.lost || this.raf || !this.inView || !this.pageVisible || this.introAt < 0) return;
    this.raf = requestAnimationFrame(this.frame);
  };

  private frame = (now: number) => {
    this.raf = 0;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.time += dt;

    const p = this.pointer;
    const follow = 1 - Math.exp(-dt * 16);
    p.x += (p.tx - p.x) * follow;
    p.y += (p.ty - p.y) * follow;
    p.on += (p.target - p.on) * (1 - Math.exp(-dt * 4));

    if (this.time > this.blinkAt) {
      const t = (this.time - this.blinkAt) / 0.24;
      this.blink = t < 0.4 ? t / 0.4 : t < 1 ? 1 - (t - 0.4) / 0.6 : 0;
      if (t >= 1) this.blinkAt = this.time + 2.6 + Math.random() * 4;
    }

    if (this.moving || p.on > 0.01) {
      this.simulate(dt);
      const gl = this.gl;
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.cols, this.rows, gl.RED, gl.FLOAT, this.u);
    }

    const elapsed = this.elapsed();
    if (!this.hinted && elapsed > 2.8) {
      this.hinted = true;
      this.host.classList.add('is-ready');
    }
    this.draw(elapsed);
    this.loop();
  };

  private draw(elapsed: number) {
    const { gl, w, h, dpr } = this;
    const reduced = this.reduced;
    const t = reduced ? 0 : this.time;
    const g = this.ghost;
    const R = g.r;

    const sink = reduced ? 0 : this.scroll;
    const rise = (reduced ? 1 : easeInOutCubic(clamp((elapsed - 0.5) / 1.7))) * (1 - sink * 0.7);
    const bob = Math.sin(t * 0.9) * R * 0.05;
    const gx = g.x + Math.sin(t * 0.55) * R * 0.03;
    const gTop = g.top + bob + sink * R * 0.35;

    // the eyes follow the pointer
    const p = this.pointer;
    const eyeY = gTop + R * 1.03;
    let lx = 0;
    let ly = 0;
    if (p.on > 0.01) {
      const ddx = p.x - gx;
      const ddy = p.y - eyeY;
      const len = Math.hypot(ddx, ddy) || 1;
      const k = Math.min(len / 420, 1) * R * 0.08;
      lx = (ddx / len) * k * p.on;
      ly = (ddy / len) * k * p.on;
    }
    this.look.x += (lx - this.look.x) * 0.1;
    this.look.y += (ly - this.look.y) * 0.1;
    const open = smooth(0.3, 0.75, rise);
    const erx = R * 0.15 * open;
    const ery = R * 0.24 * (1 - this.blink * 0.92) * open;

    gl.clearColor(0.039, 0.039, 0.047, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // background: halo and dithering
    gl.disable(gl.BLEND);
    gl.useProgram(this.bg.program);
    gl.uniform2f(this.bg.u.u_size, w, h);
    gl.uniform1f(this.bg.u.u_dpr, dpr);
    gl.uniform4f(this.bg.u.u_ghost, gx, gTop, R, g.h);
    gl.uniform1f(this.bg.u.u_rise, rise);
    gl.uniform3f(this.bg.u.u_pointer, p.x, p.y, reduced ? 0 : p.on);
    gl.bindVertexArray(this.bgVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // threads, additive
    const u = this.threads.u;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(this.threads.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(u.u_disp, 0);
    gl.uniform2f(u.u_size, w, h);
    gl.uniform1f(u.u_dx, this.dx);
    gl.uniform1f(u.u_gap, this.gap);
    gl.uniform1f(u.u_offset, this.offset);
    gl.uniform1f(u.u_cols, this.cols);
    gl.uniform1f(u.u_rows, this.rows);
    gl.uniform4f(u.u_ghost, gx, gTop, R, g.h);
    gl.uniform1f(u.u_rise, rise);
    gl.uniform1f(u.u_lift, R * 0.15);
    gl.uniform1f(u.u_time, t);
    const core = dpr >= 1.5 ? 1.7 : 1.15;
    gl.uniform1f(u.u_core, core);
    gl.uniform1f(u.u_half, (core * 0.5 + 1) / dpr);
    gl.uniform1f(u.u_dpr, dpr);
    gl.uniform3f(u.u_pointer, p.x, p.y, reduced ? 0 : p.on);
    gl.uniform1f(u.u_fade, 1 - sink * 0.35);
    gl.uniform1f(u.u_intro, reduced ? 99 : elapsed);
    gl.uniform1f(u.u_width, w);
    gl.uniform4f(
      u.u_eyes,
      gx - R * 0.36 + this.look.x,
      eyeY + this.look.y,
      gx + R * 0.36 + this.look.x,
      eyeY + this.look.y,
    );
    gl.uniform2f(u.u_eyeSize, Math.max(erx, 1e-3), Math.max(ery, 1e-3));
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_INT, 0);
    gl.bindVertexArray(null);
  }
}

function smooth(a: number, b: number, v: number) {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}
