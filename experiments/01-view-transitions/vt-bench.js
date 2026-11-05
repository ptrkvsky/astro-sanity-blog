import { mountBench, bench, bindRange } from '../shared/bench.js';

mountBench();
const api = window.__vt?.api;
bench.set('VT entre documents', api ? 'oui' : 'non (navigation classique)');
bench.set('reduced-motion', matchMedia('(prefers-reduced-motion: reduce)').matches ? 'oui : désactivée' : 'non');
const show = () => bench.set('dernière transition', window.__vt?.last != null ? window.__vt.last + ' ms' : 'aucune');
show();
document.addEventListener('vt:measured', show);

const range = document.querySelector('#vt-dur');
if (range) {
  try { range.value = sessionStorage.getItem('vtDur') || range.value; } catch {}
  bindRange(range, { prop: '--vt-dur', unit: 'ms', onChange: (v) => { try { sessionStorage.setItem('vtDur', v); } catch {} } });
}
