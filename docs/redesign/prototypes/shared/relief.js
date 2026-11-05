// Champ de lignes de niveau en WebGL brut (sans Three.js).
// Amélioration progressive : le contenu existe sans ce script ; en cas d'échec,
// la classe "no-webgl" laisse le fond de repli CSS en place.
//
// Usage : initRelief(canvas, { peaks: [{ x, y, h }], accent: [r, g, b] })
// x, y en coordonnées normalisées du canvas (0..1), h hauteur relative.

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerAmp;
uniform float uScroll;
uniform vec3 uPeaks[8];
uniform int uPeakCount;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform vec3 uBg;
uniform vec2 uTextMask;
out vec4 color;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 q = vec2(uv.x * uRes.x / uRes.y, uv.y);
  vec2 drift = vec2(uTime * 0.012, uScroll * 0.9);
  float h = fbm(q * 2.2 + drift) * 1.4;

  // reliefs des projets : une bosse gaussienne par projet
  float peak = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uPeakCount) break;
    vec2 c = vec2(uPeaks[i].x * uRes.x / uRes.y, 1.0 - uPeaks[i].y);
    float d = distance(q, c);
    peak += uPeaks[i].z * exp(-d * d * 18.0);
  }
  h += peak;

  // le pointeur soulève le terrain localement
  vec2 pc = vec2(uPointer.x * uRes.x / uRes.y, 1.0 - uPointer.y);
  float dp = distance(q, pc);
  h += uPointerAmp * 0.55 * exp(-dp * dp * 30.0);

  float bands = 22.0;
  float v = h * bands;
  float w = fwidth(v);
  float line = 1.0 - smoothstep(0.0, w * 1.2, abs(fract(v - 0.5) - 0.5));
  // une ligne sur cinq est une courbe maîtresse, plus marquée
  float major = 1.0 - smoothstep(0.0, w * 1.6, abs(fract(v / 5.0 - 0.5) - 0.5) * 5.0);

  float nearPeak = smoothstep(0.15, 0.6, peak + uPointerAmp * 0.55 * exp(-dp * dp * 30.0));
  vec3 lineCol = mix(uLine, uAccent, nearPeak);
  // le terrain s'efface sous le bloc de texte (bas gauche) pour garder la lecture
  float textZone = (1.0 - smoothstep(uTextMask.x - 0.15, uTextMask.x + 0.1, uv.x)) * (1.0 - smoothstep(uTextMask.y - 0.1, uTextMask.y + 0.15, uv.y));
  float fade = 1.0 - textZone * 0.78;
  vec3 col = uBg;
  col = mix(col, lineCol, line * 0.55 * fade);
  col = mix(col, lineCol, major * 0.85 * fade);
  color = vec4(col, 1.0);
}`;

export function initRelief(canvas, opts = {}) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) { document.documentElement.classList.add('no-webgl'); return null; }

  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    document.documentElement.classList.add('no-webgl');
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (n) => gl.getUniformLocation(prog, n);
  const U = { res: u('uRes'), time: u('uTime'), pointer: u('uPointer'), amp: u('uPointerAmp'), scroll: u('uScroll'), peaks: u('uPeaks'), count: u('uPeakCount'), line: u('uLine'), accent: u('uAccent'), bg: u('uBg'), mask: u('uTextMask') };

  const peaks = (opts.peaks || []).slice(0, 8);
  const flat = new Float32Array(24);
  peaks.forEach((pk, i) => flat.set([pk.x, pk.y, pk.h ?? 0.35], i * 3));
  gl.uniform3fv(U.peaks, flat);
  gl.uniform1i(U.count, peaks.length);
  gl.uniform3fv(U.line, opts.line || [0.36, 0.38, 0.40]);
  gl.uniform3fv(U.accent, opts.accent || [0.95, 0.65, 0.25]);
  gl.uniform3fv(U.bg, opts.bg || [0.055, 0.063, 0.071]);
  // zone de texte en coordonnées normalisées (x max, y max depuis le bas)
  gl.uniform2fv(U.mask, opts.textMask || [0.0, 0.0]);

  // DPR plafonné : le shader coûte par pixel
  const maxDpr = opts.maxDpr || 1.5;
  let w = 0, h = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, maxDpr);
    w = Math.round(canvas.clientWidth * dpr); h = Math.round(canvas.clientHeight * dpr);
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    gl.uniform2f(U.res, w, h);
    draw();
  };

  const state = { px: 0.5, py: 0.5, amp: 0, targetAmp: 0, scroll: 0, t: 0 };
  let frames = 0;
  const draw = () => {
    gl.uniform1f(U.time, state.t);
    gl.uniform2f(U.pointer, state.px, state.py);
    gl.uniform1f(U.amp, state.amp);
    gl.uniform1f(U.scroll, state.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    frames++;
  };

  let visible = true, raf = 0, last = performance.now();
  const loop = (now) => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min(now - last, 50); last = now;
    state.t += dt / 1000;
    state.amp += (state.targetAmp - state.amp) * 0.08;
    draw();
    raf = requestAnimationFrame(loop);
  };
  const start = () => { if (!reduced && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };

  canvas.parentElement.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    state.px = (e.clientX - r.left) / r.width; state.py = (e.clientY - r.top) / r.height;
    state.targetAmp = e.pointerType === 'mouse' ? 1 : 0.6;
    if (reduced) { state.amp = state.targetAmp; draw(); }
  }, { passive: true });
  canvas.parentElement.addEventListener('pointerleave', () => { state.targetAmp = 0; if (reduced) { state.amp = 0; draw(); } });
  addEventListener('scroll', () => {
    state.scroll = scrollY / innerHeight * 0.15;
    if (reduced) draw();
  }, { passive: true });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); document.documentElement.classList.add('no-webgl'); });

  resize();
  start();
  document.documentElement.classList.add('has-webgl');
  return { stats: () => ({ frames, w, h }) };
}
