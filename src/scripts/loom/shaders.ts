/**
 * The loom is a single full-screen fragment shader.
 *
 * Grid space: one cell = one crossing of a warp (vertical, silver) and a weft (horizontal, ink)
 * thread. Rows are counted from the bottom, the way cloth grows on a tapestry loom.
 * Below `uWoven` rows the cloth is woven as a damask: the ghost is a warp-faced satin
 * (silver floats), the ground a weft-faced sateen (ink floats). Above the fell the warp
 * hangs loose — in the hero it sways freely, in the manifesto it is pulled taut.
 */

export const VERT = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAG = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform vec2 uGrid;
uniform vec2 uOrigin;
uniform sampler2D uMask;
uniform sampler2D uGlow;
uniform float uWoven;
uniform float uTension;
uniform vec3 uPointer;
uniform vec2 uLight;
uniform vec3 uMoon;
uniform float uFinish;
uniform float uFade;
uniform float uHeroDim;

#define PI 3.14159265

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float ghostBit(vec2 cell) {
  vec2 uv = (cell + 0.5) / uGrid;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  return step(0.5, texture2D(uMask, uv).r);
}

// 5-end satin, move 2: one binding point per thread every five picks
float satin(vec2 cell) {
  return step(mod(cell.x * 2.0 + cell.y, 5.0), 0.5);
}

// Kajiya-Kay: anisotropic highlight of a thread with tangent T
float kk(vec3 T, vec3 L, vec3 V, float p) {
  vec3 H = normalize(L + V);
  float th = dot(T, H);
  return pow(sqrt(max(1.0 - th * th, 0.0)), p);
}

vec3 shade(vec3 P, vec3 N, vec3 T, vec3 albedo, float spec, float gloss) {
  vec3 V = vec3(0.0, 0.0, 1.0);
  T = normalize(T - N * dot(N, T));
  vec3 c = albedo * 0.05;

  // the moon: a large, warm, static light
  vec3 Lm = uMoon - P;
  float dm = length(Lm);
  Lm /= dm;
  float am = 1.0 / (1.0 + pow(dm / (uRes.y * 1.1), 2.0));
  float ndm = max(dot(N, Lm), 0.0);
  c += albedo * ndm * am * vec3(1.0, 0.965, 0.91) * 0.85;
  c += kk(T, Lm, V, gloss) * spec * am * smoothstep(0.0, 0.25, ndm) * vec3(1.0, 0.95, 0.86);

  // a cool roaming light that follows the cursor
  vec3 Lp = vec3(uLight, uRes.y * 0.28) - P;
  float dl = length(Lp);
  Lp /= dl;
  float al = 1.0 / (1.0 + pow(dl / (uRes.y * 0.42), 2.0));
  float ndl = max(dot(N, Lp), 0.0);
  c += albedo * ndl * al * vec3(0.86, 0.9, 1.0) * 0.55;
  c += kk(T, Lp, V, gloss * 0.8) * spec * al * smoothstep(0.0, 0.25, ndl) * vec3(0.9, 0.94, 1.0) * 0.9;
  return c;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 q = frag / uRes;
  vec2 g = (frag - uOrigin) / uCell;
  float aa = 1.0 / uCell;
  vec3 P = vec3(frag, 0.0);

  // night sky behind the loom
  vec3 col = mix(vec3(0.016, 0.018, 0.024), vec3(0.030, 0.033, 0.043), q.y);
  float mg = length((frag - uMoon.xy) / uRes.y);
  col += vec3(0.075, 0.074, 0.08) * exp(-mg * 2.4);

  // slow folds of the cloth
  vec2 fq = frag / uRes.y;
  float t = uTime * 0.16;
  vec2 fold = vec2(
    sin(fq.x * 3.1 + t) * 0.55 + sin(fq.x * 6.7 - fq.y * 2.3 + t * 1.6) * 0.25,
    cos(fq.y * 2.4 - t * 0.8) * 0.4 + sin(fq.x * 1.9 + fq.y * 3.7 + t) * 0.2
  ) * mix(0.1, 0.2, uFinish);

  vec3 silver = vec3(0.64, 0.615, 0.57);
  vec3 ink = vec3(0.034, 0.037, 0.05);

  float row = floor(uWoven);
  float rowT = fract(uWoven);
  float ltr = 1.0 - mod(row, 2.0);
  float shuttle = mix((1.0 - rowT) * uGrid.x, rowT * uGrid.x, ltr);
  bool woven = g.y < row || (g.y < row + 1.0 && (ltr > 0.5 ? g.x < shuttle : g.x > shuttle));

  if (woven) {
    vec2 cell = floor(g);
    vec2 f = fract(g);
    float gb = ghostBit(cell);
    bool isWarp = gb > 0.5;
    float s = satin(cell);
    float across = isWarp ? f.x : f.y;
    float along = isWarp ? f.y : f.x;
    float hw = 0.48;
    float u = (across - 0.5) / hw;
    float edge = aa / hw * 1.4;
    float cov = 1.0 - smoothstep(1.0 - edge, 1.0 + edge, abs(u));
    float uc = clamp(u, -1.0, 1.0);

    // at a binding point the float dips under the crossing thread
    float bell = exp(-pow((along - 0.5) / 0.22, 2.0));
    float dip = s * bell * (isWarp ? 1.0 : 0.7);
    float slope = s * (along - 0.5) * bell * 6.0;
    vec3 Nl = normalize(vec3(uc * 0.9, slope * 0.55, sqrt(max(1.0 - uc * uc, 0.0)) + 0.4));
    vec3 N = isWarp ? Nl : vec3(Nl.y, Nl.x, Nl.z);
    N = normalize(N + vec3(fold, 0.0));
    vec3 T = isWarp ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);

    float tid = isWarp ? cell.x : cell.y + 913.0;
    float tv = 0.9 + 0.2 * hash11(tid * 1.37 + 3.1);
    float fib = 0.94 + 0.06 * sin(uc * 9.0 + along * 2.0 + hash11(tid) * 6.28);
    float irr = 0.95 + 0.05 * hash21(cell + 17.0);
    vec3 alb = (isWarp ? silver : ink) * tv * fib * irr;
    float spec = isWarp ? 0.42 : 0.2;
    float gloss = isWarp ? 26.0 : 50.0;
    vec3 top = shade(P, N, T, alb, spec, gloss) * (1.0 - 0.38 * dip);
    vec3 under = isWarp ? silver * 0.22 : ink * 0.45;
    vec3 fabric = mix(under, top, cov);

    // the crossing thread surfacing at the binding point
    if (s > 0.5) {
      float bAcross = isWarp ? f.y : f.x;
      float bAlong = isWarp ? f.x : f.y;
      float bw = isWarp ? 0.12 : 0.11;
      float bm = (1.0 - smoothstep(bw - aa, bw + aa, abs(bAcross - 0.5)))
               * (1.0 - smoothstep(0.3 - aa, 0.3 + aa, abs(bAlong - 0.5)));
      vec3 bN = normalize(isWarp
        ? vec3(0.0, (bAcross - 0.5) / bw * 0.8, 0.6)
        : vec3((bAcross - 0.5) / bw * 0.8, 0.0, 0.6));
      vec3 bT = isWarp ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
      vec3 bc = shade(P, bN, bT, isWarp ? ink * 1.4 : silver * 0.32, isWarp ? 0.15 : 0.25, 30.0);
      float bvar = 0.6 + 0.4 * hash21(cell * 0.37);
      fabric = mix(fabric, bc, bm * (isWarp ? 0.55 : 0.42) * bvar);
    }

    // a faint halo around the woven ghost
    fabric += vec3(0.8, 0.78, 0.72) * texture2D(uGlow, g / uGrid).r * 0.045 * (1.0 - gb);

    // freshly beaten picks keep a little warmth
    float fresh = exp(-(row + 1.0 - g.y) * 0.55) * (1.0 - step(uGrid.y, uWoven));
    fabric += vec3(0.9, 0.75, 0.5) * fresh * 0.05;

    // one shimmer across the cloth once it is finished
    float sweep = exp(-pow((q.x * 0.8 + q.y * 0.45 - (uFinish * 2.2 - 0.6)) / 0.1, 2.0)) * uFinish * (1.0 - uFinish) * 4.0;
    fabric += alb * sweep * 0.6;

    col = fabric;
  } else {
    // loose warp above the fell
    float above = max(g.y - uWoven, 0.0);
    float span = max(uGrid.y - uWoven, 1.0);
    float tt = clamp(above / span, 0.0, 1.0);
    float hang = pow(clamp(1.0 - g.y / uGrid.y, 0.0, 1.0), 1.15);
    float taut = sin(PI * tt);
    float amp = mix(hang * 1.4, taut * 0.3, uTension) * smoothstep(0.0, 4.0, above);
    float sway = amp * (sin(uTime * 0.6 + g.y * 0.03 + g.x * 0.05) * 0.6 + sin(uTime * 0.37 - g.y * 0.019 + g.x * 0.11) * 0.4);

    // the cursor parts the threads like a hand through a curtain
    vec2 pp = (uPointer.xy - uOrigin) / uCell;
    vec2 dp = (g - pp) * vec2(1.0, 0.55);
    float push = uPointer.z * 2.4 * sign(g.x - pp.x) * exp(-dot(dp, dp) / 49.0) * smoothstep(0.0, 4.0, above);
    float xw = g.x - sway - push;

    float ci = floor(xw);
    float cu = fract(xw) - 0.5;
    float hw = mix(0.12, 0.15, uTension);
    float cov = 1.0 - smoothstep(hw - aa, hw + aa, abs(cu));
    float u = clamp(cu / hw, -1.0, 1.0);
    vec3 N = normalize(vec3(u, 0.0, sqrt(max(1.0 - u * u, 0.0)) + 0.2));
    float r1 = hash11(ci * 1.37 + 3.1);
    vec3 c = shade(P, N, vec3(0.0, 1.0, 0.0), silver * (0.45 + 0.55 * r1), 0.6, 40.0);

    // hanging threads fade into the dark towards the bottom of the hero
    float low = mix(0.18, -1.0, uTension);
    float vis = smoothstep(low, low + 0.55, q.y) * mix(0.42 * uHeroDim, 0.62, uTension);
    float r2 = hash11(ci * 7.13);
    vis *= mix(0.35 + 0.65 * r2, 0.75 + 0.25 * r2, uTension);
    // the shed just above the fell sits in shadow
    vis *= mix(1.0, smoothstep(0.0, 10.0, above) * 0.7 + 0.3, uTension);
    col = mix(col, c, cov * vis);
  }

  // the shuttle: a small warm light running along the fell
  if (uWoven > 0.0 && uWoven < uGrid.y) {
    vec2 sp = uOrigin + vec2(shuttle, row + 0.5) * uCell;
    vec2 d = frag - sp;
    float glow = exp(-dot(d, d) / pow(uCell * 1.8, 2.0));
    float behind = ltr > 0.5 ? -d.x : d.x;
    float streak = exp(-pow(d.y / (uCell * 0.45), 2.0)) * exp(-max(behind, 0.0) / (uCell * 22.0)) * step(0.0, behind);
    col += vec3(1.0, 0.85, 0.6) * (glow * 0.8 + streak * 0.22);
  }

  // vignette and a touch of dither against banding
  vec2 vq = (q - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  col *= mix(0.62, 1.0, smoothstep(1.15, 0.25, length(vq)));
  col += (hash21(frag + fract(uTime) * 61.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col * uFade, 1.0);
}
`;
