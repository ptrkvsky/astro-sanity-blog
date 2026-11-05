import { mountBench, bench, bindRange } from '../shared/bench.js';
import { initReveal, replay, settings, stats } from './reveal.js';

const params = new URLSearchParams(location.search);
settings.mode = params.get('mode') === 'webgl' ? 'webgl' : '2d';
document.querySelector(`.modes a[href="?mode=${settings.mode}"]`)?.setAttribute('aria-current', 'page');

mountBench();
window.__reveal = stats;
const avg = (a) => (a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : 'n/d');
const max = (a) => (a.length ? Math.max(...a).toFixed(2) : 'n/d');
const show = () => {
  bench.set('mode', settings.mode);
  bench.set('révélées / préparées', `${stats.revealed} / ${stats.prepared}`);
  bench.set('préparation moy.', avg(stats.prepMs) + ' ms');
  bench.set('image moy. / max', `${avg(stats.frameMs)} / ${max(stats.frameMs)} ms`);
  bench.set('contextes WebGL actifs', stats.liveContexts);
  bench.set('replis', stats.fallbacks);
};
show();
setInterval(show, 500);

bindRange(document.querySelector('#pixel'), { unit: 'px', onChange: (v) => { settings.pixel = v; } });
bindRange(document.querySelector('#duration'), { unit: 'ms', onChange: (v) => { settings.duration = v; } });
const figures = [...document.querySelectorAll('[data-reveal]')];
document.querySelector('#replay').addEventListener('click', () => {
  const visible = figures.map((f) => { const r = f.getBoundingClientRect(); return [f, Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0))]; }).sort((a, b) => b[1] - a[1])[0];
  if (visible && visible[1] > 0) replay(visible[0]);
});
initReveal(figures);
