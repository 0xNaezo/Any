import { FRAG, VERT } from './shaders';
import { buildPattern, type Pattern } from './pattern';

type GL = WebGLRenderingContext | WebGL2RenderingContext;

const UNIFORMS = [
  'uRes',
  'uTime',
  'uCell',
  'uGrid',
  'uOrigin',
  'uMask',
  'uGlow',
  'uWoven',
  'uTension',
  'uPointer',
  'uLight',
  'uMoon',
  'uFinish',
  'uFade',
  'uHeroDim',
] as const;

export interface LoomTargets {
  /** 0..1 — share of rows woven. */
  progress: number;
  /** 0 = warp hangs free (hero), 1 = pulled taut (manifesto). */
  tension: number;
  /** 0..1 — shimmer once the cloth is finished. */
  finish: number;
}

export interface LoomOptions {
  reduced: boolean;
  /** Called whenever the current pick (row) changes. */
  onPick?: (info: { row: number; rows: number; cols: number; holes: boolean[]; done: boolean }) => void;
}

const HOLES = 32;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export class Loom {
  private gl!: GL;
  private u = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  private maskTex!: WebGLTexture;
  private glowTex!: WebGLTexture;
  private pattern!: Pattern;

  private dpr = 1;
  private scale = 1;
  private width = 0;
  private height = 0;
  private cell = 8;
  private originX = 0;

  private raf = 0;
  private running = false;
  private visible = true;
  private start = performance.now();
  private last = 0;
  private slowFrames = 0;
  private sampled = 0;

  private target: LoomTargets = { progress: 0, tension: 0, finish: 0 };
  private current: LoomTargets = { progress: 0, tension: 0, finish: 0 };
  private fade = 0;

  private pointer = { x: -9999, y: -9999, s: 0, ts: 0, last: 0 };
  private light = { x: 0, y: 0, tx: 0, ty: 0 };
  private lastPick = -1;
  private blinkUntil = 0;
  private nextBlink = 0;
  private eyesClosed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private opts: LoomOptions,
  ) {}

  /** Returns false when WebGL is not available. */
  init(): boolean {
    const attrs: WebGLContextAttributes = { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' };
    const gl = (this.canvas.getContext('webgl2', attrs) || this.canvas.getContext('webgl', attrs)) as GL | null;
    if (!gl) return false;
    this.gl = gl;

    const program = this.link(VERT, FRAG);
    if (!program) return false;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of UNIFORMS) this.u[name] = gl.getUniformLocation(program, name);
    this.maskTex = this.texture(gl.NEAREST);
    this.glowTex = this.texture(gl.LINEAR);
    gl.uniform1i(this.u.uMask, 0);
    gl.uniform1i(this.u.uGlow, 1);
    gl.uniform1f(this.u.uHeroDim, 1);

    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
    });

    this.resize();
    this.bindPointer();
    return true;
  }

  private link(vs: string, fs: string) {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[loom]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const v = compile(gl.VERTEX_SHADER, vs);
    const f = compile(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram()!;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.warn('[loom]', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  private texture(filter: number) {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  private upload(tex: WebGLTexture, unit: number, source: HTMLCanvasElement) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    const mobile = w < 760;
    this.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.75 : 2) * this.scale;
    this.width = Math.round(w * this.dpr);
    this.height = Math.round(h * this.dpr);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.gl.viewport(0, 0, this.width, this.height);

    // ~one thread every 8–9 CSS px, finer on phones
    const rowsTarget = w / h < 0.8 ? 148 : 104;
    const cellCss = Math.min(11, Math.max(5, h / rowsTarget));
    this.cell = cellCss * this.dpr;
    const cols = Math.ceil(this.width / this.cell - 0.01) + 1;
    const rows = Math.ceil(this.height / this.cell - 0.01);
    this.originX = (this.width - cols * this.cell) / 2;

    const portrait = w / h < 1.05;
    const aspect = 42 / 57.6;
    const layout = portrait
      ? (() => {
          const height = Math.min(rows * 0.36, (cols * 0.58) / aspect);
          return { cx: cols * 0.5, top: rows * 0.17, height };
        })()
      : { cx: cols * (w > 1500 ? 0.7 : 0.69), top: rows * 0.2, height: rows * 0.6 };
    // hanging threads stay quieter behind the hero text on narrow screens
    this.gl.uniform1f(this.u.uHeroDim, portrait ? 0.72 : 1);
    this.pattern = buildPattern(cols, rows, layout);
    this.upload(this.maskTex, 0, this.eyesClosed ? this.pattern.closed : this.pattern.open);
    this.upload(this.glowTex, 1, this.pattern.glow);
    this.gl.activeTexture(this.gl.TEXTURE0);

    this.light.x = this.light.tx = this.width * 0.42;
    this.light.y = this.light.ty = this.height * 0.55;
    this.lastPick = -1;
    this.draw(performance.now());
  }

  private bindPointer() {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        const r = this.canvas.getBoundingClientRect();
        this.pointer.x = (e.clientX - r.left) * this.dpr;
        this.pointer.y = (r.bottom - e.clientY) * this.dpr;
        this.pointer.ts = 1;
        this.pointer.last = performance.now();
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', () => (this.pointer.ts = 0));
  }

  set(targets: Partial<LoomTargets>) {
    Object.assign(this.target, targets);
    if (this.opts.reduced) {
      Object.assign(this.current, this.target);
      this.draw(performance.now());
    } else if (!this.running && this.visible) {
      this.draw(performance.now());
    }
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.play();
    else this.stop();
  }

  play() {
    if (this.running || this.opts.reduced) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.tick(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Render a single frame (used for reduced motion and while paused). */
  renderStatic() {
    this.fade = 1;
    Object.assign(this.current, this.target);
    this.draw(performance.now());
  }

  private tick(now: number) {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;

    // adaptive quality: drop resolution if the GPU struggles
    if (this.sampled < 90) {
      this.sampled++;
      if (dt > 1 / 38) this.slowFrames++;
      if (this.sampled === 90 && this.slowFrames > 45 && this.scale > 0.6) {
        this.scale = this.scale > 0.8 ? 0.75 : 0.6;
        this.sampled = 0;
        this.slowFrames = 0;
        this.resize();
      }
    }

    const k = 1 - Math.exp(-dt * 7);
    this.current.progress = lerp(this.current.progress, this.target.progress, k);
    this.current.tension = lerp(this.current.tension, this.target.tension, 1 - Math.exp(-dt * 4));
    this.current.finish = lerp(this.current.finish, this.target.finish, 1 - Math.exp(-dt * 3));
    this.fade = Math.min(1, this.fade + dt * 0.55);

    // pointer influence fades after a moment of stillness
    if (now - this.pointer.last > 1400) this.pointer.ts = 0;
    this.pointer.s = lerp(this.pointer.s, this.pointer.ts, 1 - Math.exp(-dt * 5));

    // roaming light: follows the cursor, otherwise drifts like a slow lantern
    const t = (now - this.start) / 1000;
    if (this.pointer.ts > 0) {
      this.light.tx = this.pointer.x;
      this.light.ty = this.pointer.y;
    } else {
      this.light.tx = this.width * (0.5 + Math.sin(t * 0.13) * 0.28);
      this.light.ty = this.height * (0.5 + Math.sin(t * 0.09 + 1.3) * 0.22);
    }
    const kl = 1 - Math.exp(-dt * 2.2);
    this.light.x = lerp(this.light.x, this.light.tx, kl);
    this.light.y = lerp(this.light.y, this.light.ty, kl);

    this.blinks(now);
    this.draw(now);
  }

  private blinks(now: number) {
    const done = this.current.progress > 0.995;
    if (!done) {
      this.nextBlink = 0;
      if (this.eyesClosed) this.setEyes(false);
      return;
    }
    if (!this.nextBlink) this.nextBlink = now + 900;
    if (!this.eyesClosed && now > this.nextBlink) {
      this.setEyes(true);
      this.blinkUntil = now + 150;
    } else if (this.eyesClosed && now > this.blinkUntil) {
      this.setEyes(false);
      // sometimes a double blink, then a long calm pause
      this.nextBlink = now + (Math.random() < 0.25 ? 220 : 3800 + Math.random() * 5200);
    }
  }

  private setEyes(closed: boolean) {
    this.eyesClosed = closed;
    this.upload(this.maskTex, 0, closed ? this.pattern.closed : this.pattern.open);
    this.gl.activeTexture(this.gl.TEXTURE0);
  }

  private draw(now: number) {
    const gl = this.gl;
    const p = this.pattern;
    if (!gl || !p) return;
    const woven = this.current.progress * p.rows;

    gl.uniform2f(this.u.uRes, this.width, this.height);
    gl.uniform1f(this.u.uTime, this.opts.reduced ? 12 : (now - this.start) / 1000);
    gl.uniform1f(this.u.uCell, this.cell);
    gl.uniform2f(this.u.uGrid, p.cols, p.rows);
    gl.uniform2f(this.u.uOrigin, this.originX, 0);
    gl.uniform1f(this.u.uWoven, woven);
    gl.uniform1f(this.u.uTension, this.current.tension);
    gl.uniform3f(this.u.uPointer, this.pointer.x, this.pointer.y, this.opts.reduced ? 0 : this.pointer.s);
    gl.uniform2f(this.u.uLight, this.light.x, this.light.y);
    gl.uniform3f(this.u.uMoon, this.width * 0.8, this.height * 0.95, this.height * 0.6);
    gl.uniform1f(this.u.uFinish, this.current.finish);
    gl.uniform1f(this.u.uFade, this.opts.reduced ? 1 : this.fade);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.reportPick(woven);
  }

  private reportPick(woven: number) {
    const p = this.pattern;
    const row = Math.min(p.rows - 1, Math.floor(woven));
    const done = woven >= p.rows - 0.01;
    const key = done ? -2 : row;
    if (key === this.lastPick || !this.opts.onPick) return;
    this.lastPick = key;
    const holes: boolean[] = [];
    const span = Math.max(1, p.x1 - p.x0 + 1);
    for (let i = 0; i < HOLES; i++) {
      const x = p.x0 + Math.floor(((i + 0.5) / HOLES) * span);
      holes.push(!done && row >= 0 && p.bits[row * p.cols + x] === 1);
    }
    this.opts.onPick({ row: Math.max(0, row), rows: p.rows, cols: p.cols, holes, done });
  }
}
