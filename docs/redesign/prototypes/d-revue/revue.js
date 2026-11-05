// Amélioration progressive du prototype 2.2. Rien ici n'est nécessaire pour lire la page :
// les mesures remplacent des "n/d" de même gabarit, le spécimen remplace une image fixe.
import { observeMeasures, fmt } from '../shared/measure.js';

const SPECIMEN = '../../../../experiments/04-worker-specimen/';

// Outil de prototype : signale la direction affichée dans la barre
const dir = document.documentElement.dataset.direction === 'epreuve' ? 'epreuve' : 'revue';
document.querySelector(`.proto-bar [data-dir="${dir}"]`)?.setAttribute('aria-current', 'true');

// Fiche de mesure
const units = { transferKB: ' Ko', jsKB: ' Ko', lcp: ' ms', inp: ' ms', cls: '', requests: '' };
const outputs = document.querySelectorAll('output[data-m]');
if (outputs.length) {
  observeMeasures((m) => {
    for (const o of outputs) {
      const k = o.dataset.m;
      // transferSize vaut 0 pour une page servie depuis le cache : ne pas afficher "0 Ko"
      o.value = k === 'transferKB' && m.fromCache ? 'en cache' : k === 'inp' && m.inp === null ? 'aucune' : fmt(m[k], units[k]);
    }
  });
}

// Spécimen : chargé au clic, rendu dans un worker si possible (D5)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Outil de prototype : ?simulate=nogl ou ?simulate=lost teste les replis (--disable-3d-apis ne couvre pas les workers)
const simulate = new URLSearchParams(location.search).get('simulate');

async function start(stage, onFail) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  stage.append(canvas);
  const { width, height } = stage.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1 : 1.5);
  const canWorker = 'transferControlToOffscreen' in canvas && typeof Worker !== 'undefined';
  const fail = (reason) => { canvas.remove(); onFail(reason); };

  if (canWorker) {
    const worker = new Worker(new URL(SPECIMEN + 'relief-worker.js', import.meta.url), { type: 'module' });
    const off = canvas.transferControlToOffscreen();
    const ok = await new Promise((resolve) => {
      worker.onmessage = ({ data }) => {
        if (data.type === 'ready') resolve({ compileMs: data.compileMs });
        else if (data.type === 'failed') { fail(data.reason); resolve(null); }
        else if (data.type === 'lost') fail('contexte WebGL perdu');
      };
      worker.onerror = () => { fail('worker en erreur'); resolve(null); };
      worker.postMessage({ type: 'init', canvas: off, width, height, dpr, reduced, simulate }, [off]);
    });
    if (!ok) return null;
    const post = (m) => worker.postMessage(m);
    if (simulate === 'lost') setTimeout(() => post({ type: 'lose' }), 800);
    return { thread: 'worker', compileMs: ok.compileMs, pointer: (x, y, amp) => post({ type: 'pointer', x, y, amp }), play: () => post({ type: 'play' }), pause: () => post({ type: 'pause' }), resize: (w, h) => post({ type: 'resize', width: w, height: h, dpr }) };
  }
  if (simulate === 'nogl') { fail('webgl2 indisponible (simulé)'); return null; }
  const { createRelief } = await import(SPECIMEN + 'relief-core.js');
  const r = createRelief(canvas, { width, height, dpr, reduced, onFrame() {}, onLost: () => fail('contexte WebGL perdu') });
  if (!r.ok) { fail(r.reason); return null; }
  return { thread: 'fil principal', compileMs: r.compileMs, pointer: r.pointer, play: r.play, pause: r.pause, resize: (w, h) => r.resize(w, h, dpr) };
}

for (const plate of document.querySelectorAll('[data-specimen]')) {
  const stage = plate.querySelector('.stage');
  const button = plate.querySelector('[data-run]');
  const status = plate.querySelector('[role=status]');
  const label = button.textContent;
  let api = null, on = false, visible = true;
  const sync = () => (on && visible && !document.hidden ? api.play() : api.pause());

  button.addEventListener('click', async () => {
    if (api) {
      on = !on; sync();
      button.textContent = on ? 'Arrêter le spécimen' : 'Relancer le spécimen';
      status.textContent = on ? 'Spécimen en cours.' : 'Spécimen en pause.';
      return;
    }
    button.disabled = true;
    status.textContent = 'Chargement du spécimen…';
    api = await start(stage, (reason) => {
      api = null;
      button.disabled = true;
      button.textContent = label;
      status.textContent = `Spécimen indisponible (${reason}) : l'image fixe reste affichée.`;
    });
    if (!api) return;
    button.disabled = false;
    on = true; api.play();
    button.textContent = 'Arrêter le spécimen';
    status.textContent = reduced ? 'Spécimen chargé : image fixe (mouvement réduit), le pointeur la déforme.' : 'Spécimen en cours : déplacez le pointeur sur le relief.';
    plate.querySelector('[data-thread]')?.replaceChildren(api.thread);
    plate.querySelector('[data-compile]')?.replaceChildren(`${api.compileMs.toFixed(1)} ms`);

    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(stage);
    document.addEventListener('visibilitychange', sync);
    new ResizeObserver(([e]) => api?.resize(e.contentRect.width, e.contentRect.height)).observe(stage);
    let pending = null;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      if (!pending) requestAnimationFrame(() => { api?.pointer(...pending); pending = null; });
      pending = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height, e.pointerType === 'mouse' ? 1 : 0.6];
    }, { passive: true });
    stage.addEventListener('pointerleave', () => api?.pointer(0.5, 0.5, 0));
  });
}

// Révélation tramée : études de cas seulement, images qui entrent par le défilement (D4)
const reveal = document.querySelectorAll('[data-reveal]');
if (reveal.length) import('../../../../experiments/03-image-reveal/reveal.js').then(({ initReveal }) => initReveal([...reveal]));
