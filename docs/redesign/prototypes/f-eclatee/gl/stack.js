// Scène Three.js du prototype F : un seul canvas fixe, une caméra orthographique où 1 unité = 1 px CSS.
// Les objets sont des plans et des boîtes très simples ; GSAP anime leurs propriétés, ce module ne fait
// que les construire, les dessiner et projeter les points d'ancrage des libellés HTML.

import {
  WebGLRenderer, Scene, OrthographicCamera, Group, Mesh, PlaneGeometry, BoxGeometry, EdgesGeometry,
  LineSegments, LineBasicMaterial, LineDashedMaterial, MeshBasicMaterial, CanvasTexture, Texture,
  SRGBColorSpace, Vector3,
} from 'three';

const PLANE = new PlaneGeometry(1, 1);
const PLANE_EDGES = new EdgesGeometry(PLANE);
const BOX = new BoxGeometry(1, 1, 1);
BOX.translate(0, .5, 0); // une barre pousse vers le haut depuis sa base
const BOX_EDGES = new EdgesGeometry(BOX);

export function createEngine({ canvas, dpr, onLost }) {
  const scene = new Scene();
  const cam = new OrthographicCamera(-1, 1, 1, -1, -6000, 6000);
  cam.position.z = 3000;
  const tilt = new Group();
  scene.add(tilt);
  let renderer = null;
  let w = 0;
  let h = 0;

  function makeRenderer(target) {
    const r = new WebGLRenderer({ canvas: target, alpha: true, antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(dpr);
    r.setClearColor(0x000000, 0);
    target.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost?.(); }, { once: true });
    return r;
  }

  function resize() {
    w = innerWidth;
    h = innerHeight;
    renderer?.setSize(w, h, false);
    Object.assign(cam, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
    cam.updateProjectionMatrix();
  }

  renderer = makeRenderer(canvas);
  resize();

  const v = new Vector3();
  return {
    scene, cam, tilt,
    get alive() { return !!renderer; },
    resize,
    render() { renderer?.render(scene, cam); },
    // Coordonnées monde d'un rectangle du DOM (centre), à l'instant présent
    fromRect(r) { return { x: r.left + r.width / 2 - w / 2, y: h / 2 - (r.top + r.height / 2), w: r.width, h: r.height }; },
    // Position écran (px CSS) d'un point local d'un objet
    project(obj, x = 0, y = 0, z = 0) {
      v.set(x, y, z);
      obj.localToWorld(v);
      v.project(cam);
      return { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h };
    },
    // Retirer la couche : on libère le contexte, la scène reste en mémoire pour être redessinée plus tard
    dispose() { if (renderer && !renderer.getContext().isContextLost()) renderer.forceContextLoss(); renderer?.dispose(); renderer = null; },
    restore(newCanvas) { renderer = makeRenderer(newCanvas); resize(); },
    lose() { renderer?.forceContextLoss(); },
  };
}

// Calque : un aplat (éventuellement texturé) et son contour, plein ou pointillé
export function layer({ color = 0xF1EEE6, opacity = .05, edge = 0xF1EEE6, edgeOpacity = 1, dashed = false, map = null } = {}) {
  const g = new Group();
  const fill = new Mesh(PLANE, new MeshBasicMaterial({ color, map, transparent: true, opacity, depthWrite: false }));
  const mat = dashed
    ? new LineDashedMaterial({ color: edge, dashSize: .012, gapSize: .01, transparent: true, opacity: edgeOpacity, depthWrite: false })
    : new LineBasicMaterial({ color: edge, transparent: true, opacity: edgeOpacity, depthWrite: false });
  const edges = new LineSegments(PLANE_EDGES, mat);
  if (dashed) edges.computeLineDistances();
  g.add(fill, edges);
  g.userData = { fill, edges };
  return g;
}

// Barre de l'histogramme : un volume et ses arêtes
export function bar({ color, edge }) {
  const g = new Group();
  const solid = new Mesh(BOX, new MeshBasicMaterial({ color, transparent: true, opacity: .92, depthWrite: true }));
  const edges = new LineSegments(BOX_EDGES, new LineBasicMaterial({ color: edge, transparent: true }));
  g.add(solid, edges);
  g.userData = { solid, edges };
  return g;
}

export function canvasTexture(source) {
  const t = source instanceof HTMLCanvasElement ? new CanvasTexture(source) : new Texture(source);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

// Opacité d'un calque entier (aplat et contour gardent leur rapport)
export function setOpacity(g, k) {
  const { fill, edges, solid } = g.userData;
  if (fill) fill.material.opacity = (fill.userData.base ??= fill.material.opacity) * k;
  if (edges) edges.material.opacity = (edges.userData.base ??= edges.material.opacity) * k;
  if (solid) solid.material.opacity = (solid.userData.base ??= solid.material.opacity) * k;
  g.visible = k > .002;
}
