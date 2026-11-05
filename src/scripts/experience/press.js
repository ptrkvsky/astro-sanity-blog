// "La presse" : deux rendus WebGL2 bruts du prototype E, chacun dans la boîte de son élément (D6).
//  - createTitlePress : le titre du hero réimprimé en deux plaques tramées, hors repère puis calées.
//  - createLoupe : la capture d'un essai imprimée en trame ; un compte-fils montre le tirage net.
// Rendu à la demande : une image n'est dessinée que lorsqu'un paramètre change.

import { createGL, program, texture, upload, hexToVec3, HALFTONE_GLSL } from './gl.js';
import { rasterize } from './text-raster.js';

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name);

const TITLE_FS = `#version 300 es
precision highp float;
uniform sampler2D uText;
uniform vec2 uRes;
uniform vec4 uRect;
uniform vec2 uOffset;
uniform vec2 uGuide;
uniform float uCell, uTone, uUnder, uDust, uSeed;
uniform vec3 uPaper, uRed, uHair;
out vec4 o;
${HALFTONE_GLSL}
// r : plaque papier (texte courant) ; g : plaque rouge seule (accent)
// lod > 0 : couverture moyenne sur la cellule (mipmaps), comme la mesure d'un point de trame réel
vec2 cov(vec2 p, float lod) {
  vec2 uv = (p - uRect.xy) / uRect.zw;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return vec2(0.);
  return textureLod(uText, uv, lod).rg;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  // Plaque papier, trame à 45°, fondue vers le ton continu quand l'épreuve est calée
  float lod = max(0., log2(uCell) - .6);
  vec2 cp = cellCenter(p, uCell, .785398);
  float paper = mix(halftoneDot(p, cp, uCell, cov(cp, lod).r), cov(p, 0.).r, uTone);
  // Plaque rouge, trame à 15°, décalée : l'accent, plus un aplat de soutien sous le texte
  vec2 q = p - uOffset;
  vec2 cr = cellCenter(q, uCell, .261799);
  vec2 k = cov(cr, lod);
  vec2 kq = cov(q, 0.);
  float red = mix(halftoneDot(q, cr, uCell, k.g + k.r * uUnder), kq.g + kq.r * uUnder, uTone);
  float a = paper + red * (1. - paper);
  vec3 col = uPaper * paper + uRed * red * (1. - paper);
  // Lignes de repère, imprimées sous l'encre
  float g = max(1. - smoothstep(.0, 1., abs(p.x - uGuide.x)), 1. - smoothstep(.0, 1., abs(p.y - uGuide.y))) * step(0., uGuide.x) * (1. - a);
  // Poussières d'épreuve, qui disparaissent au calage
  float dust = step(.9985, hash(floor(p / 2.) + uSeed)) * uDust * (1. - a);
  o = vec4(col + uHair * g + uPaper * dust * .5, a + g + dust * .5);
}`;

export function createTitlePress({ sheet, title, guide, dpr, onLost }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'press';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = createGL(canvas, { onLost: () => { canvas.remove(); onLost?.(); } });
  if (!gl) return null;
  let prog;
  try { prog = program(gl, TITLE_FS); } catch (e) { console.warn(e); return null; }
  const t0 = performance.now();
  sheet.prepend(canvas);
  const tex = texture(gl);
  const state = { offset: [0, 0], cell: 8, tone: 0, under: 1, dust: 1 };
  let rect = [0, 0, 1, 1];
  let guidePx = [-1, -1];
  let fontPx = 100;
  let frame = 0;

  function layout() {
    const s = sheet.getBoundingClientRect();
    canvas.width = Math.round(s.width * dpr);
    canvas.height = Math.round(s.height * dpr);
    fontPx = parseFloat(getComputedStyle(title).fontSize);
    const pad = fontPx * .3;
    const r = rasterize(title, { dpr, pad });
    upload(gl, tex, r.canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    const t = title.getBoundingClientRect();
    rect = [(t.left - s.left - pad) * dpr, (t.top - s.top - pad) * dpr, r.width * dpr, r.height * dpr];
    if (guide) { const g = guide.getBoundingClientRect(); guidePx = [(g.left + g.width / 2 - s.left) * dpr, (g.top + g.height / 2 - s.top) * dpr]; }
    render();
  }

  function draw() {
    frame = 0;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog.p);
    const L = prog.loc;
    gl.uniform1i(L.uText, 0);
    gl.uniform2f(L.uRes, canvas.width, canvas.height);
    gl.uniform4f(L.uRect, ...rect);
    gl.uniform2f(L.uOffset, state.offset[0] * fontPx * dpr, state.offset[1] * fontPx * dpr);
    gl.uniform1f(L.uCell, Math.max(1.5, state.cell * fontPx * dpr));
    gl.uniform1f(L.uTone, state.tone);
    gl.uniform1f(L.uUnder, state.under);
    gl.uniform1f(L.uDust, state.dust);
    gl.uniform1f(L.uSeed, 7);
    gl.uniform3f(L.uPaper, ...hexToVec3(css('--ink')));
    gl.uniform3f(L.uRed, ...hexToVec3(css('--red')));
    gl.uniform3f(L.uHair, ...hexToVec3(css('--hair')));
    gl.uniform2f(L.uGuide, ...guidePx);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function render() { if (!frame) frame = requestAnimationFrame(draw); }

  layout();
  const compileMs = performance.now() - t0;
  const ro = new ResizeObserver(() => layout());
  ro.observe(sheet);

  return {
    canvas,
    compileMs,
    // offset et cell sont exprimés en em du titre : le rendu suit la taille du texte
    set(next) { Object.assign(state, next); render(); },
    layout,
    lose() { gl.getExtension('WEBGL_lose_context')?.loseContext(); },
    destroy() { ro.disconnect(); gl.getExtension('WEBGL_lose_context')?.loseContext(); canvas.remove(); },
  };
}

const LOUPE_FS = `#version 300 es
precision highp float;
uniform sampler2D uImg;
uniform vec2 uRes, uLoupe, uOffset;
uniform float uR, uCell, uZoom;
uniform vec3 uPaper, uRed, uBg;
out vec4 o;
${HALFTONE_GLSL}
float lum(vec3 c) { return dot(c, vec3(.299, .587, .114)); }
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  // Épreuve : la capture tirée en deux plaques sur feuille noire
  vec2 cp = cellCenter(p, uCell, .785398);
  float paper = halftoneDot(p, cp, uCell, lum(texture(uImg, cp / uRes).rgb) * .9);
  vec2 q = p - uOffset;
  vec2 cr = cellCenter(q, uCell, .261799);
  vec3 cq = texture(uImg, cr / uRes).rgb;
  float sat = max(cq.r, max(cq.g, cq.b)) - min(cq.r, min(cq.g, cq.b));
  float red = halftoneDot(q, cr, uCell, clamp(sat * 1.4 + (1. - lum(cq)) * .4, 0., 1.));
  vec3 proof = mix(mix(uBg, uRed, red), uPaper, paper);
  // Compte-fils : le tirage net, légèrement grossi, avec l'ombre du verre
  float d = length(p - uLoupe);
  vec3 sharp = texture(uImg, (uLoupe + (p - uLoupe) / uZoom) / uRes).rgb;
  sharp *= 1. - smoothstep(uR * .78, uR, d) * .22;
  float inside = 1. - smoothstep(uR - 1., uR + 1., d);
  float shade = smoothstep(uR + uCell * 3., uR, d) * (1. - inside) * .55;
  o = vec4(mix(proof * (1. - shade), sharp, inside), 1.);
}`;

export async function createLoupe({ frame, img, dpr, onLost }) {
  if (!img.complete || !img.naturalWidth) await new Promise((r) => img.addEventListener('load', r, { once: true }));
  await img.decode().catch(() => {});
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const gl = createGL(canvas, { onLost: () => { canvas.remove(); onLost?.(); } });
  if (!gl) return null;
  let prog;
  try { prog = program(gl, LOUPE_FS); } catch (e) { console.warn(e); return null; }
  frame.prepend(canvas);
  texture(gl, img);
  const state = { x: .3, y: .35, offset: 4 };
  let w = 1, h = 1, raf = 0;

  function layout() {
    const r = frame.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    render();
  }
  const radius = () => Math.min(w, h) * (w < 500 ? .3 : .24);

  function draw() {
    raf = 0;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(prog.p);
    const L = prog.loc;
    gl.uniform1i(L.uImg, 0);
    gl.uniform2f(L.uRes, canvas.width, canvas.height);
    gl.uniform2f(L.uLoupe, state.x * canvas.width, state.y * canvas.height);
    gl.uniform2f(L.uOffset, state.offset * dpr, state.offset * .6 * dpr);
    gl.uniform1f(L.uR, radius() * dpr);
    gl.uniform1f(L.uCell, Math.max(3, (w < 500 ? 4 : 5.5) * dpr));
    gl.uniform1f(L.uZoom, 1.35);
    gl.uniform3f(L.uPaper, ...hexToVec3(css('--ink')));
    gl.uniform3f(L.uRed, ...hexToVec3(css('--red')));
    gl.uniform3f(L.uBg, ...hexToVec3(css('--sheet')));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function render() { if (!raf) raf = requestAnimationFrame(draw); }

  layout();
  const ro = new ResizeObserver(() => layout());
  ro.observe(frame);
  return {
    canvas,
    set(next) { Object.assign(state, next); render(); },
    // Position et rayon du verre, en pixels CSS dans le cadre : le repère SVG s'y aligne
    lens() { return { x: state.x * w, y: state.y * h, r: radius() }; },
    lose() { gl.getExtension('WEBGL_lose_context')?.loseContext(); },
    destroy() { ro.disconnect(); gl.getExtension('WEBGL_lose_context')?.loseContext(); canvas.remove(); },
  };
}
