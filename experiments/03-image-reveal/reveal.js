// Révélation tramée d'une image à son entrée dans l'écran (principe observé sur sebg.ch,
// tramage ordonné par matrice de Bayer 4x4), en deux modes comparables :
// - "2d"    : Canvas 2D, luminance calculée une fois sur une grille basse résolution ;
// - "webgl" : WebGL2, tramage calculé par pixel dans un shader, un contexte par image,
//             libéré à la fin de l'animation.
// L'<img> reste la source de vérité : sans JS, sans support ou en mouvement réduit, elle
// s'affiche normalement. Elle n'est masquée que hors de l'écran, juste avant la révélation.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16);
const INK = [17, 17, 17], PAPER = [250, 250, 247];
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const settings = { mode: '2d', pixel: 3, duration: 1300 };
export const stats = { prepared: 0, revealed: 0, prepMs: [], frameMs: [], liveContexts: 0, fallbacks: 0 };

// Image recadrée comme object-fit: cover, réduite à cols x rows.
function sampleCover(img, cols, rows) {
  const c = document.createElement('canvas');
  c.width = cols; c.height = rows;
  const g = c.getContext('2d', { willReadFrequently: true });
  const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  g.drawImage(img, (cols - img.naturalWidth * s) / 2, (rows - img.naturalHeight * s) / 2, img.naturalWidth * s, img.naturalHeight * s);
  return g.getImageData(0, 0, cols, rows).data;
}

function make2d(fig, img) {
  const P = settings.pixel;
  const cols = Math.ceil(img.clientWidth / P), rows = Math.ceil(img.clientHeight / P);
  const canvas = document.createElement('canvas');
  canvas.width = cols; canvas.height = rows;
  const g = canvas.getContext('2d');
  const rgba = sampleCover(img, cols, rows);
  const lum = new Float32Array(cols * rows);
  for (let i = 0; i < lum.length; i++) lum[i] = (rgba[i * 4] * 0.2126 + rgba[i * 4 + 1] * 0.7152 + rgba[i * 4 + 2] * 0.0722) / 255;
  const noise = Float32Array.from({ length: cols * rows }, Math.random);
  const frame = g.createImageData(cols, rows);
  const px = new Uint32Array(frame.data.buffer);
  const ink = 0xff000000 | (INK[2] << 16) | (INK[1] << 8) | INK[0];
  const paper = 0xff000000 | (PAPER[2] << 16) | (PAPER[1] << 8) | PAPER[0];
  // develop : les points tramés apparaissent ; resolve : ils s'effacent sur l'image réelle
  const draw = (develop, resolve) => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const front = (noise[i] + y / rows) / 2;
        px[i] = front < resolve ? 0 : front < develop ? (lum[i] > BAYER[(y % 4) * 4 + (x % 4)] ? paper : ink) : 0;
      }
    }
    g.putImageData(frame, 0, 0);
  };
  return { canvas, draw, dispose() {} };
}

const VERT = `#version 300 es
in vec2 p; out vec2 uv;
void main() { uv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = `#version 300 es
precision highp float;
in vec2 uv; out vec4 color;
uniform sampler2D img; uniform vec2 res; uniform vec2 cover; uniform float P, develop, resolve;
float bayer(vec2 c) {
  int i = int(mod(c.y, 4.)) * 4 + int(mod(c.x, 4.));
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return float(m[i]) / 16.;
}
float hash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 cell = floor(gl_FragCoord.xy / P);
  vec2 cells = ceil(res / P);
  float row = (cells.y - 1. - cell.y) / cells.y;
  float front = (hash(cell) + row) / 2.;
  if (front < resolve || front >= develop) { color = vec4(0.); return; }
  vec2 suv = (cell + .5) / cells;
  suv = (suv - .5) * cover + .5;
  vec3 c = texture(img, vec2(suv.x, 1. - suv.y)).rgb;
  float l = dot(c, vec3(.2126, .7152, .0722));
  color = l > bayer(cell) ? vec4(${PAPER.map((v) => (v / 255).toFixed(3)).join(', ')}, 1.) : vec4(${INK.map((v) => (v / 255).toFixed(3)).join(', ')}, 1.);
}`;

function makeGl(fig, img) {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(img.clientWidth * dpr); canvas.height = Math.round(img.clientHeight * dpr);
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  const u = (n) => gl.getUniformLocation(prog, n);
  const boxR = canvas.width / canvas.height, imgR = img.naturalWidth / img.naturalHeight;
  gl.uniform2f(u('res'), canvas.width, canvas.height);
  gl.uniform2f(u('cover'), boxR < imgR ? boxR / imgR : 1, boxR < imgR ? 1 : imgR / boxR);
  gl.uniform1f(u('P'), settings.pixel * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
  const uDev = u('develop'), uRes = u('resolve');
  stats.liveContexts++;
  const draw = (develop, resolve) => { gl.uniform1f(uDev, develop); gl.uniform1f(uRes, resolve); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  draw(0, 0);
  gl.finish();
  return { canvas, draw, dispose() { gl.getExtension('WEBGL_lose_context')?.loseContext(); stats.liveContexts--; } };
}

async function prepare(fig, { force = false } = {}) {
  const img = fig.querySelector('img');
  if (fig._reveal || !img) return;
  fig._reveal = 'pending';
  const t0 = performance.now();
  try {
    await img.decode();
    // Préparé hors de l'écran ? Sinon on ne masque rien : l'image reste telle quelle
    // (sauf demande explicite du visiteur, bouton "Rejouer").
    if (!force && fig.getBoundingClientRect().top < innerHeight) { fig._reveal = 'skipped'; return; }
    const fx = settings.mode === 'webgl' ? makeGl(fig, img) : make2d(fig, img);
    if (!fx) { stats.fallbacks++; fig._reveal = 'skipped'; return; }
    fx.canvas.className = 'reveal-canvas';
    fx.canvas.setAttribute('aria-hidden', 'true');
    fx.draw(0, 0);
    fig.append(fx.canvas);
    img.style.opacity = '0';
    fig._fx = fx; fig._reveal = 'ready';
    stats.prepared++; stats.prepMs.push(performance.now() - t0);
  } catch (e) {
    stats.fallbacks++; fig._reveal = 'skipped';
    img.style.removeProperty('opacity');
  }
}

function play(fig) {
  if (fig._reveal !== 'ready') return;
  fig._reveal = 'playing';
  const { draw, canvas, dispose } = fig._fx;
  const img = fig.querySelector('img');
  const half = settings.duration / 2;
  let start = 0, shown = false;
  const tick = (now) => {
    start ||= now;
    const t = now - start;
    const develop = ease(Math.min(t / half, 1)) * 1.02;
    const resolve = t > half ? ease(Math.min((t - half) / half, 1)) * 1.02 : 0;
    if (t > half && !shown) { img.style.removeProperty('opacity'); shown = true; }
    const f0 = performance.now();
    draw(develop, resolve);
    stats.frameMs.push(performance.now() - f0);
    if (t < settings.duration) requestAnimationFrame(tick);
    else { canvas.remove(); dispose(); fig._reveal = 'done'; stats.revealed++; }
  };
  requestAnimationFrame(tick);
}

export function initReveal(figures) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Préparation 25 % de hauteur d'écran avant l'entrée ; lecture à 12 % au-dessus du bas.
  const prep = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && prepare(e.target)), { rootMargin: '0px 0px 25% 0px' });
  const go = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    if (e.target._reveal === 'ready') play(e.target);
    else if (e.target._reveal === 'pending') {
      const wait = setInterval(() => { if (e.target._reveal !== 'pending') { clearInterval(wait); play(e.target); } }, 30);
    }
  }), { rootMargin: '0px 0px -12% 0px' });
  figures.forEach((f) => { prep.observe(f); go.observe(f); });
}

// Rejoue l'effet sur une figure visible, à la demande du visiteur (panneau de réglages).
export async function replay(fig) {
  fig.querySelector('.reveal-canvas')?.remove();
  if (fig._fx && fig._reveal !== 'done') fig._fx.dispose();
  fig._reveal = null; fig._fx = null;
  fig.querySelector('img').style.removeProperty('opacity');
  await prepare(fig, { force: true });
  play(fig);
}
