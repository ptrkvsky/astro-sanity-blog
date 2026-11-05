// Couche d'expérience de l'accueil (concept Calage). Amélioration progressive : sans ce script, la page est complète et calée.
//  1. Mesures réelles (toujours, 1 Ko).
//  2. Couche d'expérience (GSAP + ScrollTrigger + MorphSVG + DrawSVG), chargée après le premier rendu,
//     sauf en mouvement réduit. 3. WebGL (titre et compte-fils) si WebGL2 est disponible.

import { detect } from './capabilities.js';
import { whenIdleAfterLoad, loadScripts, gsapFiles } from './boot.js';
import { observeMeasures, fmt } from './measure.js';

const caps = detect();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;

// ---------- 1. Mesures réelles ----------
const units = { transferKB: ' Ko', jsKB: ' Ko', lcp: ' ms', inp: ' ms', cls: '', requests: '' };
const outputs = $$('output[data-m]');
observeMeasures((m) => {
  for (const o of outputs) {
    const k = o.dataset.m;
    o.value = k === 'transferKB' && m.fromCache ? 'en cache' : k === 'inp' && m.inp === null ? 'aucune' : fmt(m[k], units[k]);
  }
});

// Poids transféré par poste (Resource Timing) : "n/d" si le navigateur ne le donne pas
const weightOutputs = $$('output[data-w]');
function updateWeights() {
  const sums = { html: 0, css: 0, js: 0, fonts: 0, images: 0 };
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) sums.html = nav.transferSize || 0;
  for (const r of performance.getEntriesByType('resource')) {
    const n = r.transferSize || 0;
    if (/\.(woff2?|ttf|otf)(\?|$)/.test(r.name)) sums.fonts += n;
    else if (r.initiatorType === 'img' || /\.(avif|webp|png|jpe?g|svg|gif)(\?|$)|\/_image/.test(r.name)) sums.images += n;
    else if (r.initiatorType === 'css' || /\.css(\?|$)/.test(r.name)) sums.css += n;
    else if (r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name)) sums.js += n;
  }
  for (const o of weightOutputs) o.value = fmt(+(sums[o.dataset.w] / 1024).toFixed(1), ' Ko');
}
if (weightOutputs.length) {
  const run = () => setTimeout(updateWeights, 400);
  if (document.readyState === 'complete') run(); else addEventListener('load', run, { once: true });
  try { new PerformanceObserver(() => updateWeights()).observe({ type: 'resource', buffered: false }); } catch { /* API indisponible */ }
}

if (caps.tier !== 'static') {
  await whenIdleAfterLoad();
  try {
    await loadScripts(gsapFiles('ScrollTrigger', 'MorphSVGPlugin', 'DrawSVGPlugin'));
    await start();
  } catch (e) {
    console.warn("Couche d'expérience indisponible : la page reste dans son état final.", e);
    root.classList.remove('xp', 'xp-gl');
  }
}

// ---------- Géométrie ----------
// Secteur d'anneau (angles en degrés, 0 en haut, sens horaire), en coordonnées SVG
function sector(cx, cy, R, r, a0, a1) {
  const pt = (rad, a) => [cx + rad * Math.sin(a * Math.PI / 180), cy - rad * Math.cos(a * Math.PI / 180)].map((v) => +v.toFixed(2));
  const [p0, p1, p2, p3] = [pt(R, a0), pt(R, a1), pt(r, a1), pt(r, a0)];
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${p0}A${R} ${R} 0 ${large} 1 ${p1}L${p2}A${r} ${r} 0 ${large} 0 ${p3}Z`.replaceAll(',', ' ');
}

// Plaque rouge d'un repère : décalage en unités du viewBox (100), k = 1 hors repère, 0 calé
function setK(svg, k, jx = 0, jy = 0) {
  svg.querySelector('.plate-red')?.setAttribute('transform', `translate(${(k * 6 + jx).toFixed(2)} ${(k * 4 + jy).toFixed(2)})`);
}

async function start() {
  const { gsap, ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin } = window;
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin);
  const full = caps.tier === 'full';
  const clamp01 = gsap.utils.clamp(0, 1);
  root.classList.add('xp');

  // ---------- Hero : le titre se cale ----------
  const sheet = $('.sheet');
  const title = $('.hero-title');
  const heroMark = $('.hero-mark .mark');
  const hint = $('.hero-hint');
  const hero = { h: 0, intro: 0, px: 0, py: 0 };
  const kHero = () => 1 - .55 * hero.h;
  let removed = false;
  let press = null;

  if (caps.webgl) {
    const size = getComputedStyle(title).fontSize;
    await Promise.all([document.fonts.load(`400 ${size} "Instrument Serif"`), document.fonts.load(`italic 400 ${size} "Instrument Serif"`)]);
    const { createTitlePress } = await import('./press.js');
    press = createTitlePress({
      sheet, title, guide: heroMark, dpr: caps.dpr,
      onLost: () => { press = null; root.classList.remove('xp-gl'); applyHero(); },
    });
    if (press) root.classList.add('xp-gl');
    if (press && caps.simulate === 'lost') setTimeout(() => press?.lose(), 1800);
  }

  function applyHero() {
    if (removed) return;
    const left = 1 - hero.h;
    const amp = (.11 - .05 * hero.intro) * left;
    const ox = amp + hero.px * .025 * left;
    const oy = amp * .55 + hero.py * .025 * left;
    if (press) {
      press.set({
        offset: [ox, oy],
        cell: (.085 - .055 * hero.intro) * (1 - clamp01(hero.h / .75)) + .012,
        tone: clamp01((hero.h - .7) / .3),
        under: .8 * (1 - clamp01((hero.h - .6) / .4)),
        dust: left,
      });
    } else {
      title.style.textShadow = `${ox.toFixed(3)}em ${oy.toFixed(3)}em 0 var(--red)`;
    }
    setK(heroMark, kHero(), hero.px * 2.5, hero.py * 2.5);
    if (hint) hint.textContent = hero.h < .02 ? "Faites défiler : l'épreuve se cale ↓" : hero.h < .99 ? `Calage du titre : ${Math.round(hero.h * 100)} %` : 'Titre calé · suite ↓';
  }

  gsap.to(hero, { intro: 1, duration: 1.4, ease: 'power3.out', onUpdate: applyHero });
  gsap.to(hero, {
    h: 1, ease: 'none', onUpdate: applyHero,
    scrollTrigger: full
      ? { trigger: '.hero', start: 'top top', end: '+=65%', pin: true, scrub: .6 }
      : { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: .4 },
  });
  if (full) {
    const toX = gsap.quickTo(hero, 'px', { duration: .9, ease: 'power3.out', onUpdate: applyHero });
    const toY = gsap.quickTo(hero, 'py', { duration: .9, ease: 'power3.out' });
    sheet.addEventListener('pointermove', (e) => {
      const r = sheet.getBoundingClientRect();
      toX(((e.clientX - r.left) / r.width - .5) * 2);
      toY(((e.clientY - r.top) / r.height - .5) * 2);
    }, { passive: true });
    sheet.addEventListener('pointerleave', () => { toX(0); toY(0); });
  }

  // ---------- Calage global : progression de lecture de l'épreuve ----------
  const calageOuts = $$('output[data-calage]');
  const meter = $('.calage-meter');
  const setCalage = (p) => {
    const v = Math.round(p * 100);
    for (const o of calageOuts) o.value = v;
    meter?.style.setProperty('--calage', p.toFixed(3));
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => setCalage(self.progress) });
  ScrollTrigger.create({ trigger: '#methode', start: 'top bottom', onToggle: (self) => root.classList.toggle('past-hero', self.isActive || self.progress === 1) });
  setCalage(0);

  // ---------- 01 Méthode : la tête de lecture parcourt l'axe, chaque passe se cale ----------
  const wrap = $('.steps-wrap');
  const axisHead = $('.axis-head');
  const steps = $$('.step');
  const counter = $('.pipeline-counter');
  gsap.fromTo(wrap, { '--axis': 0 }, { '--axis': 1, ease: 'none', scrollTrigger: { trigger: wrap, start: () => `top+=${axisHead.offsetHeight / 2} center`, end: 'bottom center', scrub: true } });
  const setCounter = (i) => {
    if (!counter) return;
    const pair = steps[Math.max(0, i)].querySelector('.step-pair');
    counter.querySelector('b').textContent = String(Math.max(0, i) + 1).padStart(2, '0');
    counter.querySelector('span').textContent = pair.querySelector('span').textContent;
    counter.querySelector('i').textContent = pair.lastChild.textContent.replace('·', '').trim();
    gsap.fromTo(counter.querySelector('b'), { y: '.12em', opacity: .4 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out', overwrite: true });
  };
  steps.forEach((step, i) => {
    const m = step.querySelector('.step-mark');
    const p = { k: 1 };
    const draw = () => setK(m, p.k * 2.2);
    draw();
    ScrollTrigger.create({
      trigger: step, start: 'top center',
      onEnter: () => { step.classList.add('on'); gsap.to(p, { k: 0, duration: .6, ease: 'back.out(2.2)', onUpdate: draw, overwrite: true }); setCounter(i); },
      onLeaveBack: () => { step.classList.remove('on'); gsap.to(p, { k: 1, duration: .4, onUpdate: draw, overwrite: true }); setCounter(i - 1); },
    });
  });

  // ---------- 02 Essais : le repère devient compte-fils ----------
  const frame = $('[data-loupe]');
  const loupeEl = frame.querySelector('.loupe');
  const img = frame.querySelector('img');
  const lens = { s: 0, x: .22, y: .3, mode: 'path' };
  const path = (t) => ({ x: .2 + .6 * t, y: .3 + .32 * Math.sin(t * Math.PI) });
  let loupe = null;

  function placeLoupe() {
    if (!loupe) return;
    if (lens.mode === 'path') Object.assign(lens, path(lens.s));
    loupe.set({ x: lens.x, y: lens.y });
    const { x, y, r } = loupe.lens();
    const d = (2 * r) / .62; // le cercle du repère (r = 31 sur 100) épouse le bord du verre
    loupeEl.style.width = `${d}px`;
    loupeEl.style.transform = `translate(${x - d / 2}px, ${y - d / 2}px)`;
  }

  if (caps.webgl) {
    new IntersectionObserver(async ([e], io) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const { createLoupe } = await import('./press.js');
      loupe = await createLoupe({ frame, img, dpr: caps.dpr, onLost: () => { loupe = null; frame.classList.remove('is-gl'); } });
      if (!loupe) return;
      frame.classList.add('is-gl');
      placeLoupe();
      if (caps.simulate === 'lost') setTimeout(() => loupe?.lose(), 1500);
    }, { rootMargin: '60% 0px' }).observe(frame);

    gsap.to(lens, { s: 1, ease: 'none', onUpdate: placeLoupe, scrollTrigger: { trigger: frame, start: 'top 80%', end: 'bottom 30%', scrub: .5 } });
    if (full) {
      frame.addEventListener('pointermove', (e) => {
        const r = frame.getBoundingClientRect();
        lens.mode = 'pointer';
        gsap.to(lens, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, duration: .35, ease: 'power3.out', overwrite: 'auto', onUpdate: placeLoupe });
      }, { passive: true });
      frame.addEventListener('pointerleave', () => {
        gsap.to(lens, { ...path(lens.s), duration: .5, ease: 'power3.inOut', overwrite: 'auto', onUpdate: placeLoupe, onComplete: () => { lens.mode = 'path'; } });
      });
    }
  }

  // ---------- 03 Contrôle : l'anneau se déroule en gamme de contrôle ----------
  const patches = $$('.strip .patch');
  gsap.timeline({ scrollTrigger: { trigger: '.strip-figure', start: 'top 70%', end: 'top 15%', scrub: .6 } })
    .to('.strip-mark', { scale: 1.35, opacity: 0, duration: .3, ease: 'power1.in' }, 0)
    .from(patches, { morphSVG: (i) => sector(600, 80, 75, 50, i * 60 + 3, (i + 1) * 60 - 3), duration: 1, stagger: .05, ease: 'power2.inOut' }, .15)
    .from('.strip-rule', { drawSVG: '50% 50%', duration: .7, ease: 'power2.out' }, .45)
    .from('.patch-n', { opacity: 0, duration: .3 }, .85);
  setK($('.strip-mark .mark'), .25);
  setK($('.folio .mark'), .12);

  // ---------- 05 Bon à tirer : les cases se réenroulent en tampon ----------
  const stampMark = $('.stamp-mark .mark');
  const bat = { k: 1 };
  const rowRect = (i) => { const x = -150 + i * 51.2; return `M${x} -14H${x + 44}V14H${x}Z`; };
  gsap.timeline({ scrollTrigger: { trigger: '.stamp-wrap', start: 'top 85%', end: 'center 45%', scrub: .6 } })
    .from('.stamp .seg', { morphSVG: (i) => rowRect(i), duration: 1, stagger: .05, ease: 'power2.inOut' }, 0)
    .from('.stamp .inner', { drawSVG: '0%', duration: .45 }, .55)
    .from('.stamp-mask-c', { drawSVG: '0%', duration: .6, ease: 'none' }, .65)
    .to(bat, { k: 0, duration: .9, ease: 'power2.out', onUpdate: () => setK(stampMark, bat.k) }, .3)
    .fromTo('.stamp', { scale: 1.08, rotation: 9 }, { scale: 1, rotation: 0, duration: .3, ease: 'power4.in' }, 1);
  setK(stampMark, 1);

  // ---------- Le courrier : un seul repère voyage d'une section à l'autre ----------
  // Hors trajet, chaque repère vit dans le flux de sa section (aucun décalage avec le défilement natif).
  const courier = $('.courier');
  const cMark = courier.querySelector('.mark');
  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; };
  const axisPoint = (y) => { const r = box(axisHead); return { x: r.x, y, w: r.w }; };
  const loupeBox = () => (frame.classList.contains('is-gl') ? box(loupeEl.querySelector('.mark')) : (() => { const r = box(frame); return { ...r, w: r.w * .3 }; })());
  const legs = [];
  const leg = (def) => { def.st = ScrollTrigger.create({ trigger: def.trigger, start: def.start, end: def.end }); legs.push(def); return def; };

  leg({ trigger: axisHead, start: 'top bottom', end: 'center center', from: () => box(heroMark), to: () => box(axisHead), k: () => [.45, .45], spin: 90, hide: [heroMark, axisHead] });
  const ride = leg({ trigger: wrap, start: () => `top+=${axisHead.offsetHeight / 2} center`, end: 'bottom center', from: () => axisPoint(innerHeight / 2), to: () => axisPoint(innerHeight / 2), k: () => [.45, 0], spin: 0, hide: [axisHead] });
  const ink = getComputedStyle(root).getPropertyValue('--ink').trim();
  const paperC = getComputedStyle(root).getPropertyValue('--paper').trim();
  leg({ trigger: frame, start: () => ride.st.end, end: 'center center', from: () => axisPoint(wrap.getBoundingClientRect().bottom), to: loupeBox, k: () => [0, 0], spin: 90, hide: [loupeEl], tint: [ink, paperC] });
  const lensEnd = ScrollTrigger.create({ trigger: frame, start: 'bottom 30%' });
  leg({ trigger: '.strip-figure', start: () => lensEnd.start, end: 'top 70%', from: loupeBox, to: () => box($('.strip-mark')), k: () => [0, .25], spin: 90, hide: [loupeEl, $('.strip-mark')], tint: [paperC, ink] });

  const ease = gsap.parseEase('power2.inOut');
  function fly() {
    if (removed) return;
    const y = scrollY;
    setK(axisHead.querySelector('.mark'), y >= ride.st.end ? 0 : .45);
    const active = legs.find((l) => y > l.st.start && y < l.st.end);
    for (const l of legs) if (l !== active) for (const el of l.hide) el.style.visibility = '';
    if (!active) { courier.style.visibility = 'hidden'; return; }
    const p = (y - active.st.start) / (active.st.end - active.st.start);
    const e = ease(p);
    const a = active.from();
    const b = active.to();
    const [ka, kb] = active.k();
    const lift = Math.sin(Math.PI * e) * Math.min(120, Math.abs(b.y - a.y) * .12);
    const x = a.x + (b.x - a.x) * e - lift;
    const yy = a.y + (b.y - a.y) * e;
    const s = (a.w + (b.w - a.w) * e) / 100;
    courier.style.transform = `translate(${x}px, ${yy}px) rotate(${active.spin * e}deg) scale(${s}) translate(-50px, -50px)`;
    setK(cMark, ka + (kb - ka) * (active === ride ? p : e));
    const tint = active.tint ? gsap.utils.interpolate(active.tint[0], active.tint[1], e) : '';
    cMark.querySelector('.plate-paper').style.color = tint;
    cMark.style.setProperty('--knock', active.tint ? gsap.utils.interpolate(active.tint[1], active.tint[0], e) : '');
    for (const el of active.hide) el.style.visibility = 'hidden';
    courier.style.visibility = 'visible';
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: fly, onRefresh: fly });
  setK(loupeEl.querySelector('.mark'), 0);
  applyHero();
  ScrollTrigger.refresh();

  // ---------- « Retirer la couche créative » : la page garde tout son contenu ----------
  const removeBtn = $('[data-remove-layer]');
  const layerStatus = $('[data-layer-status]');
  if (removeBtn) {
    removeBtn.hidden = false;
    removeBtn.addEventListener('click', () => {
      removed = true;
      press?.destroy(); press = null;
      loupe?.destroy(); loupe = null;
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
      gsap.killTweensOf(hero);
      root.classList.remove('xp', 'xp-gl', 'past-hero');
      title.style.textShadow = '';
      courier.style.visibility = 'hidden';
      for (const l of legs) for (const el of l.hide) el.style.visibility = '';
      $$('.plate-red').forEach((p) => p.removeAttribute('transform'));
      frame.classList.remove('is-gl');
      removeBtn.hidden = true;
      if (layerStatus) layerStatus.textContent = 'Couche créative retirée : plus aucun WebGL ni animation, la page reste complète.';
    }, { once: true });
  }
}
