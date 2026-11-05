// Utilitaires WebGL2 minimaux : un triangle plein cadre, un programme, des textures.

export const FULLSCREEN_VS = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

export function createGL(canvas, { onLost } = {}) {
  const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: true, alpha: true, powerPreference: 'low-power' });
  if (!gl) return null;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost?.(); }, { once: true });
  return gl;
}

export function program(gl, fs, vs = FULLSCREEN_VS) {
  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const loc = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const { name } = gl.getActiveUniform(p, i);
    loc[name.replace('[0]', '')] = gl.getUniformLocation(p, name);
  }
  return { p, loc };
}

export function texture(gl, source, unit = 0) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  if (source) upload(gl, t, source, unit);
  return t;
}

export function upload(gl, t, source, unit = 0) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

export const hexToVec3 = (hex) => {
  const n = parseInt(hex.trim().replace('#', ''), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

// Trame d'imprimerie commune aux shaders du prototype E (GLSL)
export const HALFTONE_GLSL = `
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
// Centre de la cellule de trame qui contient p, pour une trame inclinée de a radians
vec2 cellCenter(vec2 p, float cell, float a) {
  vec2 q = rot(a) * p;
  vec2 c = (floor(q / cell) + .5) * cell;
  return rot(-a) * c;
}
// Point de trame : rayon proportionnel à la racine de la couverture ; engraissement irrégulier
float halftoneDot(vec2 p, vec2 c, float cell, float k) {
  float gain = 1. + (hash(floor(c)) - .5) * .2;
  float r = sqrt(clamp(k, 0., 1.)) * cell * .76 * gain;
  return 1. - smoothstep(r - .75, r + .75, length(p - c));
}
`;
