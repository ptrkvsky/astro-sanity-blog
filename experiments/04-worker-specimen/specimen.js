// Spécimen à la demande : rien n'est téléchargé ni calculé avant le clic du visiteur.
// Rendu dans un worker (OffscreenCanvas) quand c'est possible, sinon sur le fil principal ;
// ?thread=main force le fil principal pour comparer.
import { mountBench, bench, bindRange } from '../shared/bench.js';

mountBench();
const plate = document.querySelector('.specimen');
const stage = plate.querySelector('.stage');
const button = plate.querySelector('#run');
const status = plate.querySelector('[role=status]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canWorker = 'transferControlToOffscreen' in HTMLCanvasElement.prototype && typeof Worker !== 'undefined';
const params = new URLSearchParams(location.search);
const thread = params.get('thread') === 'main' || !canWorker ? 'main' : 'worker';
const simulate = params.get('simulate');
const result = (window.__specimen = { thread, compileMs: null, fps: null, interactionMax: 0, interactions: 0, state: 'idle', reason: null });
document.querySelector(`.threads a[href="?thread=${thread}"]`)?.setAttribute('aria-current', 'page');

const show = () => {
  bench.set('fil de rendu', thread);
  bench.set('état', result.state);
  bench.set('compilation', result.compileMs != null ? result.compileMs.toFixed(1) + ' ms' : 'n/d');
  bench.set('images/s du rendu', result.fps ?? 'n/d');
  bench.set('interaction max', `${result.interactionMax} ms (${result.interactions})`);
};
show();

// Réactivité : durée des interactions mesurée par l'Event Timing API (base de l'INP)
try {
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (e.interactionId) { result.interactions++; result.interactionMax = Math.max(result.interactionMax, Math.round(e.duration)); }
    show();
  }).observe({ type: 'event', durationThreshold: 16, buffered: true });
} catch {}
let clicks = 0;
document.querySelector('#probe').addEventListener('click', (e) => { e.currentTarget.querySelector('output').value = ++clicks; });

let api = null;
let sceneMs = 0;
bindRange(document.querySelector('#scene'), { unit: 'ms', onChange: (v) => { sceneMs = v; api?.scene(v); } });

const fail = (reason) => {
  result.state = 'repli'; result.reason = reason;
  stage.querySelector('canvas')?.remove();
  status.textContent = `Spécimen indisponible (${reason}) : l'image fixe reste affichée.`;
  button.disabled = true;
  show();
};

async function start() {
  result.state = 'chargement'; show();
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  stage.append(canvas);
  const { width, height } = stage.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1 : 1.5);
  let lastFrames = 0, lastT = performance.now();
  const onFrames = (n) => { const now = performance.now(); result.fps = Math.round(((n - lastFrames) * 1000) / (now - lastT)); lastFrames = n; lastT = now; show(); };

  if (thread === 'worker') {
    const worker = new Worker(new URL('./relief-worker.js', import.meta.url), { type: 'module' });
    const off = canvas.transferControlToOffscreen();
    await new Promise((resolve) => {
      worker.onmessage = ({ data }) => {
        if (data.type === 'ready') { result.compileMs = data.compileMs; resolve(); }
        else if (data.type === 'failed') { fail(data.reason); resolve(); }
        else if (data.type === 'lost') fail('contexte WebGL perdu');
        else if (data.type === 'frames') onFrames(data.n);
      };
      worker.onerror = () => { fail('worker en erreur'); resolve(); };
      worker.postMessage({ type: 'init', canvas: off, width, height, dpr, reduced, simulate }, [off]);
    });
    if (result.state === 'repli') return null;
    const post = (m) => worker.postMessage(m);
    if (simulate === 'lost') setTimeout(() => post({ type: 'lose' }), 800);
    return { pointer: (x, y, amp) => post({ type: 'pointer', x, y, amp }), play: () => post({ type: 'play' }), pause: () => post({ type: 'pause' }), scene: (ms) => post({ type: 'scene', ms }), resize: (w, h) => post({ type: 'resize', width: w, height: h, dpr }) };
  }
  const { createRelief } = await import('./relief-core.js');
  let frames = 0, lastReport = 0;
  if (simulate === 'nogl') { fail('webgl2 indisponible (simulé)'); return null; }
  const r = createRelief(canvas, { width, height, dpr, reduced, onFrame: (n) => { frames = n; const now = performance.now(); if (now - lastReport > 500) { lastReport = now; onFrames(frames); } }, onLost: () => fail('contexte WebGL perdu') });
  if (!r.ok) { fail(r.reason); return null; }
  result.compileMs = r.compileMs;
  if (simulate === 'lost') setTimeout(() => r.lose(), 800);
  return { pointer: r.pointer, play: r.play, pause: r.pause, scene: r.scene, resize: (w, h) => r.resize(w, h, dpr) };
}

button.addEventListener('click', async () => {
  if (api) {
    const on = button.getAttribute('data-on') === 'true';
    on ? api.pause() : api.play();
    button.setAttribute('data-on', String(!on));
    button.textContent = on ? 'Relancer le spécimen' : 'Arrêter le spécimen';
    result.state = on ? 'en pause' : 'en cours'; show();
    return;
  }
  button.disabled = true;
  api = await start();
  button.disabled = !api;
  if (!api) return;
  api.scene(sceneMs);
  plate.classList.add('is-live');
  status.textContent = reduced ? 'Spécimen chargé : image fixe (mouvement réduit), le pointeur la déforme.' : 'Spécimen en cours : déplacez le pointeur sur la carte.';
  button.setAttribute('data-on', 'true');
  button.textContent = 'Arrêter le spécimen';
  result.state = reduced ? 'image fixe' : 'en cours';
  api.play();
  show();

  // Économie : pause hors écran et onglet masqué
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (button.getAttribute('data-on') === 'true') visible && !document.hidden ? api.play() : api.pause(); }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (button.getAttribute('data-on') === 'true') visible && !document.hidden ? api.play() : api.pause(); });
  new ResizeObserver(([e]) => api.resize(e.contentRect.width, e.contentRect.height)).observe(stage);
  // Pointeur regroupé à une mise à jour par image
  let pending = null;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    if (!pending) requestAnimationFrame(() => { api.pointer(...pending); pending = null; });
    pending = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, e.pointerType === 'mouse' ? 1 : 0.6];
  }, { passive: true });
  stage.addEventListener('pointerleave', () => api.pointer(0.5, 0.5, 0));
});
