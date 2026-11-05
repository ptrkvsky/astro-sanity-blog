// Rendu du champ de lignes de niveau, indépendant du DOM : il reçoit un canvas
// (HTMLCanvasElement sur le fil principal, OffscreenCanvas dans un worker) et des
// messages d'état. Shader repris de docs/redesign/prototypes/shared/relief.js.

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerAmp;
uniform vec3 uLine;
uniform vec3 uAccent;
uniform vec3 uBg;
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
  float h = fbm(q * 2.2 + vec2(uTime * 0.012, 0.0)) * 1.4;
  vec2 pc = vec2(uPointer.x * uRes.x / uRes.y, 1.0 - uPointer.y);
  float dp = distance(q, pc);
  float lift = uPointerAmp * 0.55 * exp(-dp * dp * 30.0);
  h += lift;
  float v = h * 22.0;
  float w = fwidth(v);
  float line = 1.0 - smoothstep(0.0, w * 1.2, abs(fract(v - 0.5) - 0.5));
  float major = 1.0 - smoothstep(0.0, w * 1.6, abs(fract(v / 5.0 - 0.5) - 0.5) * 5.0);
  vec3 lineCol = mix(uLine, uAccent, smoothstep(0.1, 0.5, lift));
  vec3 col = mix(uBg, lineCol, line * 0.55);
  col = mix(col, lineCol, major * 0.85);
  color = vec4(col, 1.0);
}`;

// Attente active : simule le travail JavaScript d'une scène plus lourde
// (mise à jour d'un graphe de scène, physique), qui coûte sur le fil où tourne le rendu.
const busy = (ms) => { const end = performance.now() + ms; while (performance.now() < end); };

export function createRelief(canvas, { width, height, dpr, reduced, onFrame, onLost }) {
  const t0 = performance.now();
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return { ok: false, reason: 'webgl2 indisponible' };
  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { return { ok: false, reason: 'compilation : ' + e.message }; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = Object.fromEntries(['uRes', 'uTime', 'uPointer', 'uPointerAmp', 'uLine', 'uAccent', 'uBg'].map((n) => [n, gl.getUniformLocation(prog, n)]));
  gl.uniform3fv(U.uLine, [0.33, 0.33, 0.31]);
  gl.uniform3fv(U.uAccent, [0.07, 0.07, 0.07]);
  gl.uniform3fv(U.uBg, [0.98, 0.98, 0.97]);

  const st = { px: 0.5, py: 0.5, amp: 0, target: 0, t: 0, sceneMs: 0, running: false, raf: 0, frames: 0, last: 0 };
  const resize = (w, h, d) => {
    canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
  };
  const draw = () => {
    gl.uniform1f(U.uTime, st.t);
    gl.uniform2f(U.uPointer, st.px, st.py);
    gl.uniform1f(U.uPointerAmp, st.amp);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  // requestAnimationFrame existe dans les workers dédiés (Chrome, Firefox) ; repli sur setTimeout.
  const raf = self.requestAnimationFrame ? (f) => self.requestAnimationFrame(f) : (f) => setTimeout(() => f(performance.now()), 16);
  const loop = (now) => {
    st.raf = 0;
    if (!st.running) return;
    const dt = Math.min(now - (st.last || now), 50); st.last = now;
    st.t += dt / 1000;
    st.amp += (st.target - st.amp) * 0.08;
    if (st.sceneMs) busy(st.sceneMs);
    draw();
    st.frames++;
    onFrame?.(st.frames);
    st.raf = raf(loop);
  };
  canvas.addEventListener?.('webglcontextlost', (e) => { e.preventDefault(); st.running = false; onLost?.(); });

  resize(width, height, dpr);
  draw();
  gl.finish();
  const compileMs = performance.now() - t0;

  return {
    ok: true,
    compileMs,
    resize,
    pointer(x, y, amp) { st.px = x; st.py = y; st.target = amp; if (reduced) { st.amp = amp; draw(); } },
    scene(ms) { st.sceneMs = ms; },
    play() { if (reduced || st.running) return; st.running = true; st.last = 0; st.raf = raf(loop); },
    pause() { st.running = false; },
    frames: () => st.frames,
    // Perte de contexte provoquée, pour tester le repli (?simulate=lost)
    lose: () => gl.getExtension('WEBGL_lose_context')?.loseContext(),
  };
}
