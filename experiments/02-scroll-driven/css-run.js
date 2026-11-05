import { mountBench, bench, bindRange } from '../shared/bench.js';
import { lean } from './lean.js';

mountBench();
const supported = CSS.supports('animation-timeline: view()');
bench.set('animation-timeline', supported ? 'oui' : 'non : page statique');
bench.set('reduced-motion', matchMedia('(prefers-reduced-motion: reduce)').matches ? 'oui : statique' : 'non');
bench.set('JS de la variante', 'réglages + inclinaison');

bindRange(document.querySelector('#rise'), { prop: '--rise', unit: 'vh' });
bindRange(document.querySelector('#tilt'), { prop: '--tilt', unit: 'deg' });
bindRange(document.querySelector('#lean'), { prop: '--lean-max', unit: 'deg' });
// ?lean=0 coupe l'inclinaison, pour mesurer le coût des animations seules
if (new URLSearchParams(location.search).get('lean') !== '0') lean(document.querySelectorAll('.plates li'));
