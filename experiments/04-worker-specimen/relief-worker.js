// Worker de rendu : reçoit un OffscreenCanvas transféré par la page, puis des
// messages (pointeur, visibilité, taille). Le fil principal ne fait plus que relayer.
import { createRelief } from './relief-core.js';

let relief = null;
let lastReport = 0;
self.onmessage = ({ data }) => {
  if (data.type === 'init') {
    // ?simulate=nogl : teste le repli (le drapeau --disable-3d-apis ne couvre pas les workers)
    if (data.simulate === 'nogl') { self.postMessage({ type: 'failed', reason: 'webgl2 indisponible (simulé)' }); return; }
    relief = createRelief(data.canvas, {
      ...data,
      onFrame: (n) => { const now = performance.now(); if (now - lastReport > 500) { lastReport = now; self.postMessage({ type: 'frames', n }); } },
      onLost: () => self.postMessage({ type: 'lost' }),
    });
    self.postMessage(relief.ok ? { type: 'ready', compileMs: relief.compileMs } : { type: 'failed', reason: relief.reason });
    return;
  }
  if (!relief?.ok) return;
  if (data.type === 'pointer') relief.pointer(data.x, data.y, data.amp);
  else if (data.type === 'play') relief.play();
  else if (data.type === 'pause') relief.pause();
  else if (data.type === 'scene') relief.scene(data.ms);
  else if (data.type === 'lose') relief.lose();
  else if (data.type === 'resize') relief.resize(data.width, data.height, data.dpr);
};
