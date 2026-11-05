// Même effet que la variante CSS, piloté par GSAP ScrollTrigger (scrub).
// Les modules s'exécutent après les scripts `defer`, donc gsap est déjà chargé.
import { mountBench, bench, bindRange } from '../shared/bench.js';
import { lean } from './lean.js';

const { gsap, ScrollTrigger } = window;
gsap.registerPlugin(ScrollTrigger);
mountBench();
bench.set('GSAP', gsap.version);
bench.set('reduced-motion', matchMedia('(prefers-reduced-motion: reduce)').matches ? 'oui : statique' : 'non');

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
let ctx;
const build = () => {
  ctx?.revert();
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
      gsap.utils.toArray('.plates figure').forEach((el) => {
        gsap.fromTo(el, { y: () => innerHeight * parseFloat(css('--rise')) / 100, scale: 0.94, rotation: parseFloat(css('--tilt')) },
          { y: 0, scale: 1, rotation: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: () => `+=${innerHeight * 0.45 + el.offsetHeight * 0.45}`, scrub: true, invalidateOnRefresh: true } });
      });
      gsap.fromTo('.run-title h2', { scale: 1, color: css('--ink') }, { scale: 0.86, color: css('--muted'), ease: 'none', scrollTrigger: { trigger: '.run', start: 'top top', end: 'bottom bottom', scrub: true } });
    });
  });
};

bindRange(document.querySelector('#rise'), { prop: '--rise', unit: 'vh', onChange: () => ctx && build() });
bindRange(document.querySelector('#tilt'), { prop: '--tilt', unit: 'deg', onChange: () => ctx && build() });
bindRange(document.querySelector('#lean'), { prop: '--lean-max', unit: 'deg' });
build();
// ?lean=0 coupe l'inclinaison, pour mesurer le coût des animations seules
if (new URLSearchParams(location.search).get('lean') !== '0') lean(document.querySelectorAll('.plates li'));
