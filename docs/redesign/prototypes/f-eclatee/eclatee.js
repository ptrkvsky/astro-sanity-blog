// Prototype F - "Vue éclatée". Amélioration progressive : sans ce script, le modèle de boîte est dessiné
// en CSS et chaque section garde son illustration fixe.
//  1. Cotes et mesures réelles (toujours).  2. GSAP + ScrollTrigger après le premier rendu (sauf mouvement réduit).
//  3. Scène Three.js sur grand écran avec WebGL2 : la page se démonte en calques.

import { detect } from '../epreuve/capabilities.js';
import { whenIdleAfterLoad, loadScripts, gsapFiles, report } from '../epreuve/boot.js';
import { observeMeasures, fmt } from '../shared/measure.js';

const caps = detect();
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const title = $('.hero-title');
const out = (sel, v) => { for (const o of $$(sel)) o.value = v; };

// ---------- 1. Cotes du titre, mesurées en direct ----------
function cotes() {
  const r = title.getBoundingClientRect();
  out('[data-cote="w"]', `${nf.format(Math.round(r.width))} px`);
  out('[data-cote="h"]', `${nf.format(Math.round(r.height))} px`);
  out('[data-cote="fs"]', `${nf.format(Math.round(parseFloat(getComputedStyle(title).fontSize)))} px`);
  out('[data-bm="margin"]', nf.format(parseFloat(getComputedStyle($('.bm-margin')).paddingTop)));
  out('[data-bm="border"]', nf.format(parseFloat(getComputedStyle($('.bm-border')).borderTopWidth)));
  out('[data-bm="padding"]', nf.format(parseFloat(getComputedStyle($('.bm-padding')).paddingTop)));
  out('[data-viewport]', `${innerWidth} × ${innerHeight} px`);
}
new ResizeObserver(cotes).observe(title);
addEventListener('resize', cotes);
document.fonts.ready.then(cotes);

// ---------- 2. Mesures : signaux vitaux et poids par poste ----------
const units = { lcp: ' ms', inp: ' ms', cls: '' };
observeMeasures((m) => {
  for (const o of $$('output[data-m]')) {
    const k = o.dataset.m;
    o.value = k === 'inp' && m.inp === null ? 'aucune' : fmt(m[k], units[k]);
  }
});

const KINDS = ['html', 'css', 'font', 'img', 'app', 'gsap', 'three'];
const LABEL = { html: 'HTML', css: 'CSS', font: 'Polices', img: 'Images', app: 'Code du prototype', gsap: 'GSAP', three: 'Three.js' };
function weights() {
  const kb = Object.fromEntries(KINDS.map((k) => [k, 0]));
  // En cache, transferSize vaut 0 : on retient alors la taille encodée, pour peser ce que la page contient
  const size = (e) => e.transferSize || e.encodedBodySize || 0;
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) kb.html += size(nav);
  for (const r of performance.getEntriesByType('resource')) {
    const u = r.name;
    const k = /vendor\/three/.test(u) ? 'three' : /vendor\/gsap/.test(u) ? 'gsap' : /\.css(\?|$)/.test(u) ? 'css'
      : /\.woff2?(\?|$)/.test(u) ? 'font' : /\.(avif|webp|jpe?g|png)(\?|$)/.test(u) ? 'img' : /\.m?js(\?|$)/.test(u) ? 'app' : null;
    if (k) kb[k] += size(r);
  }
  for (const k of KINDS) kb[k] = +(kb[k] / 1024).toFixed(1);
  return kb;
}
let kb = weights();
function renderWeights() {
  kb = weights();
  for (const k of KINDS) out(`tr[data-kind="${k}"] output`, `${nf.format(kb[k])} Ko`);
  out('[data-kind-total]', `${nf.format(KINDS.reduce((s, k) => s + kb[k], 0))} Ko`);
  const max = Math.max(...KINDS.map((k) => kb[k]), 1);
  $('[data-bars]').innerHTML = KINDS.map((k) => `<div class="bar${k === 'gsap' || k === 'three' ? ' xp-layer' : ''}" style="--v:${(kb[k] / max).toFixed(3)}"><span>${LABEL[k]}</span><i></i><b>${nf.format(kb[k])} Ko</b></div>`).join('');
}
addEventListener('load', renderWeights);
try { new PerformanceObserver(() => renderWeights()).observe({ type: 'resource' }); } catch { /* API absente : le tableau reste à n/d */ }

// ---------- 3. Couche d'expérience ----------
report(caps);
const wide = matchMedia('(min-width: 64.01rem)').matches;
if (caps.tier !== 'static') {
  await whenIdleAfterLoad();
  const t0 = performance.now();
  try {
    await loadScripts(gsapFiles('ScrollTrigger'));
    window.gsap.registerPlugin(window.ScrollTrigger);
    root.classList.add('xp');
    const three = caps.tier === 'full' && caps.webgl && wide;
    if (three) await start3D(); else lite();
    // Créés après l'épinglage du hero, pour que leurs positions tiennent compte de son espacement
    common();
    window.ScrollTrigger.refresh();
    report(caps, `${three ? ' + Three.js' : ''} · couche prête en ${Math.round(performance.now() - t0)} ms`);
  } catch (e) {
    console.warn("Couche d'expérience indisponible : la page reste dans son état fixe.", e);
    root.classList.remove('xp', 'xp-3d', 'exploded');
  }
}

// Comportements communs aux niveaux lite et full : étape active, essai actif
function common() {
  const { ScrollTrigger } = window;
  for (const step of $$('.layer-step')) ScrollTrigger.create({ trigger: step, start: 'top 60%', end: 'bottom 60%', toggleClass: 'on' });
  const rows = $$('[data-plate]');
  const setActive = (i) => { rows.forEach((r, j) => r.classList.toggle('on', i === j)); document.dispatchEvent(new CustomEvent('plate', { detail: i })); };
  rows.forEach((row, i) => {
    ScrollTrigger.create({ trigger: row, start: 'top 58%', end: 'bottom 58%', onToggle: (s) => s.isActive && setActive(i) });
    row.addEventListener('pointerenter', () => setActive(i));
    row.addEventListener('focus', () => setActive(i));
  });
}

// Niveau lite : les illustrations fixes s'animent au défilement, sans WebGL
function lite() {
  const { gsap } = window;
  gsap.fromTo('.iso-layer', { y: (i) => [93, 31, -31, -93][i] }, { y: 0, ease: 'none', scrollTrigger: { trigger: '.iso', start: 'top 85%', end: 'center 45%', scrub: .5 } });
}

// ---------- Textures dessinées pour les calques de la section 01 ----------
function paint(kind) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 614;
  const g = c.getContext('2d');
  const ink = 'rgba(241,238,230,', red = '#FF5A36';
  g.font = '22px "Plex Mono", monospace';
  if (kind === 0) { // HTML et CSS : un document, ses titres et ses lignes
    g.fillStyle = ink + '.9)'; g.fillRect(64, 70, 520, 46);
    for (let i = 0; i < 9; i++) { g.fillStyle = ink + (i % 4 === 3 ? '.0)' : '.38)'); g.fillRect(64, 160 + i * 38, i % 4 === 2 ? 560 : 860, 12); }
    g.fillStyle = red; g.fillRect(64, 520, 230, 4);
    g.fillStyle = ink + '.5)'; g.fillText('<main> · <h1> · <a href>', 64, 580);
  } else if (kind === 1) { // îlots : des zones qui réagissent
    g.strokeStyle = ink + '.7)'; g.lineWidth = 3;
    g.strokeRect(64, 90, 420, 70); g.strokeRect(64, 190, 420, 70); g.strokeRect(64, 290, 420, 160);
    g.fillStyle = red; g.fillRect(64, 480, 220, 66);
    g.fillStyle = ink + '.5)'; g.fillText('client:visible', 560, 140); g.fillText('client:idle', 560, 240);
    g.beginPath(); g.arc(760, 380, 74, 0, Math.PI * 2); g.stroke(); g.fillStyle = red; g.beginPath(); g.arc(760, 380, 14, 0, Math.PI * 2); g.fill();
  } else if (kind === 2) { // améliorations : mesures, transitions
    g.strokeStyle = ink + '.6)'; g.lineWidth = 3;
    g.beginPath(); for (let x = 0; x <= 880; x += 20) g.lineTo(64 + x, 330 - Math.sin(x / 70) * 60 - x / 9); g.stroke();
    g.fillStyle = red; for (let i = 0; i < 6; i++) g.fillRect(64 + i * 150, 470, 110, 46 + (i % 2) * 18);
    g.fillStyle = ink + '.5)'; g.fillText('LCP · CLS · INP · @view-transition', 64, 110);
  } else { // couche créative : une trame, comme une épreuve
    for (let y = 30; y < 600; y += 22) for (let x = 30; x < 1000; x += 22) {
      const k = Math.max(0, Math.sin(x / 140 + y / 210) * .5 + .5 - (y / 614) * .4);
      g.fillStyle = (x + y) % 44 ? red : ink + '.9)';
      g.beginPath(); g.arc(x, y, 9.5 * Math.sqrt(k), 0, Math.PI * 2); g.fill();
    }
  }
  return c;
}

function hatch(w, h, dpr) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
  const g = c.getContext('2d');
  g.strokeStyle = 'rgba(166,162,150,.55)'; g.lineWidth = dpr;
  for (let x = -c.height; x < c.width; x += 8 * dpr) { g.beginPath(); g.moveTo(x, c.height); g.lineTo(x + c.height, 0); g.stroke(); }
  return c;
}

function placeholder() {
  const c = document.createElement('canvas');
  c.width = 800; c.height = 500;
  const g = c.getContext('2d');
  g.fillStyle = '#1A1916'; g.fillRect(0, 0, 800, 500);
  g.strokeStyle = '#2A2925'; g.lineWidth = 1;
  for (let x = -500; x < 800; x += 11) { g.beginPath(); g.moveTo(x, 500); g.lineTo(x + 500, 0); g.stroke(); }
  g.fillStyle = '#A6A296'; g.font = '22px "Plex Mono", monospace'; g.textAlign = 'center';
  g.fillText('Omega · capture interne non publiable', 400, 240); g.fillText('visuel à fournir', 400, 276);
  return c;
}

// ---------- Scène 3D ----------
async function start3D() {
  const { gsap, ScrollTrigger } = window;
  const { createEngine, layer, bar, canvasTexture, setOpacity } = await import('./gl/stack.js');
  const { rasterize } = await import('../epreuve/text-raster.js');
  const { Group, Color } = await import('three');
  await Promise.all([document.fonts.load(`400 80px "Instrument Serif"`), document.fonts.load(`italic 400 80px "Instrument Serif"`), document.fonts.load('22px "Plex Mono"')]);

  let canvas = $('.scene-canvas');
  const removeLayer = (why) => {
    engine.dispose();
    root.classList.remove('xp-3d', 'exploded');
    btnStatus(`Couche créative retirée (${why}) : la scène WebGL est libérée, les illustrations fixes ont pris sa place.`);
    btn.textContent = 'Remettre la couche créative';
  };
  const engine = createEngine({ canvas, dpr: caps.dpr, onLost: () => removeLayer('contexte WebGL perdu') });
  root.classList.add('xp-3d');
  if (caps.simulate === 'lost') setTimeout(() => engine.lose(), 2500);

  const INK = 0xF1EEE6, RED = 0xFF5A36, MUTED = 0xA6A296;
  const stack = new Group();
  stack.rotation.order = 'YXZ';
  engine.tilt.add(stack);

  // Calques du modèle de boîte : contenu (titre), marge interne (hachures), bordure, marge
  const boxEls = [title, $('.bm-padding'), $('.bm-border'), $('.bm-margin')];
  const titleTex = canvasTexture(rasterize(title, { dpr: 2, palette: { base: '#F1EEE6', accent: '#FF5A36' } }).canvas);
  const pr = boxEls[1].getBoundingClientRect();
  const box = [
    layer({ color: 0xffffff, opacity: 1, map: titleTex, edge: MUTED, edgeOpacity: .45 }),
    layer({ color: 0xffffff, opacity: .9, map: canvasTexture(hatch(pr.width, pr.height, 2)), edge: MUTED, edgeOpacity: .7 }),
    layer({ opacity: 0, edge: INK }),
    layer({ opacity: .03, edge: MUTED, dashed: true }),
  ];
  // Calques de rendu de la page (section 01)
  const pages = [0, 1, 2, 3].map((i) => layer({ color: 0xffffff, opacity: .95, map: canvasTexture(paint(i)), edge: i === 3 ? RED : INK, edgeOpacity: .9 }));
  // Planches des essais (section 02)
  const plates = $$('[data-plate-src]').map((el) => {
    const g = layer({ color: 0xffffff, opacity: 1, edge: INK, edgeOpacity: .8 });
    if (el.tagName === 'IMG') {
      const img = new Image();
      img.src = el.currentSrc || el.src;
      img.decode().then(() => { g.userData.fill.material.map = canvasTexture(img); g.userData.fill.material.needsUpdate = true; }).catch(() => {});
    } else {
      g.userData.fill.material.map = canvasTexture(placeholder());
    }
    return g;
  });
  // Barres du poids réel (section 03)
  const bars = KINDS.map((k) => bar({ color: k === 'gsap' || k === 'three' ? RED : INK, edge: 0x121210 }));
  for (const o of [...box, ...pages, ...plates, ...bars]) stack.add(o);
  for (const p of [...pages, ...plates, ...bars]) p.visible = false;

  // Libellés HTML projetés sur la scène (décoratifs : l'information est dans le texte des sections)
  const labelsBox = $('.scene-labels');
  const label = (cls = '') => { const s = document.createElement('span'); s.className = cls; labelsBox.append(s); return s; };
  const boxLabels = box.map(() => label());
  const pageLabels = pages.map((_, i) => label(i === 3 ? 'red' : ''));
  const plateLabel = label('red');
  const barLabels = bars.map((_, i) => label(KINDS[i] === 'gsap' || KINDS[i] === 'three' ? 'red' : ''));
  const PAGE_NAMES = ['01 · HTML et CSS · 0 Ko de script', '02 · Îlots interactifs', '03 · Améliorations légères', '04 · Couche créative · WebGL'];
  const PLATE_NAMES = $$('[data-plate] .t').map((t) => t.textContent);
  pageLabels.forEach((s, i) => { s.textContent = PAGE_NAMES[i]; });

  // ---------- Géométrie, recalculée à chaque rafraîchissement de ScrollTrigger ----------
  const geo = { pivot: { x: 0, y: 0 }, rects: [], slot: { x: 0, y: 0 }, s: 1, SW: 600, SH: 360 };
  function measure() {
    engine.resize();
    const heroTop = $('.hero').getBoundingClientRect().top; // au moment de l'épinglage, le hero est en haut de l'écran
    const shifted = (el) => { const r = el.getBoundingClientRect(); return engine.fromRect({ left: r.left, top: r.top - heroTop, width: r.width, height: r.height }); };
    geo.rects = boxEls.map(shifted);
    geo.pivot = geo.rects[3];
    const slot = engine.fromRect($('[data-slot="couches"]').getBoundingClientRect());
    geo.slot = { x: slot.x, y: 0 };
    geo.SW = geo.pivot.w;
    geo.SH = geo.SW * .6;
    geo.s = Math.min(slot.w * .62 / geo.SW, innerHeight * .42 / geo.SH);
  }

  // ---------- Progression de chaque chapitre, lissée image par image ----------
  const target = { hero: 0, couches: 0, essais: 0, poids: 0, fin: 0 };
  const cur = { ...target };
  const track = (key, vars) => ScrollTrigger.create({ ...vars, onUpdate: (s) => { target[key] = s.progress; }, onRefresh: (s) => { target[key] = s.progress; } });
  ScrollTrigger.addEventListener('refresh', measure);
  track('hero', { trigger: '.hero', start: 'top top', end: '+=120%', pin: true });
  track('couches', { trigger: '#couches', start: 'top bottom', end: 'top 15%' });
  track('essais', { trigger: '#essais', start: 'top 75%', end: 'top 10%' });
  track('poids', { trigger: '#poids', start: 'top 75%', end: 'top 10%' });
  track('fin', { trigger: '#a-propos', start: 'top bottom', end: 'top 35%' });
  measure();

  // Mises en avant discrètes (étape lue, essai survolé) : tweens GSAP sur de simples nombres
  const hl = { a0: 0, a1: 0, a2: 0, a3: 0 };
  for (const [i, step] of $$('.layer-step').entries()) {
    ScrollTrigger.create({ trigger: step, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => s.isActive && gsap.to(hl, { a0: +(i === 0), a1: +(i === 1), a2: +(i === 2), a3: +(i === 3), duration: .6, ease: 'power3.out', overwrite: true }) });
  }
  const lift = Object.fromEntries(plates.map((_, i) => [`p${i}`, i === 0 ? 1 : 0]));
  let activePlate = 0;
  document.addEventListener('plate', (e) => {
    activePlate = e.detail;
    gsap.to(lift, { ...Object.fromEntries(plates.map((_, i) => [`p${i}`, +(i === activePlate)])), duration: .55, ease: 'power3.out', overwrite: true });
  });

  // Inclinaison au pointeur : la pile « se ressent », sans jamais bouger le contenu
  const tiltTo = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => { tiltTo.y = (e.clientX / innerWidth - .5) * .08; tiltTo.x = (e.clientY / innerHeight - .5) * .05; }, { passive: true });

  const ease = gsap.parseEase('power2.inOut');
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const lerp = (a, b, t) => a + (b - a) * t;
  const red = new Color(RED);
  const ink = new Color(INK);

  function compute() {
    const explode = ease(seg(cur.hero, .1, .5));
    const travel = ease(seg(cur.hero, .5, 1));
    const c = ease(cur.couches);
    const q = ease(cur.essais);
    const b = ease(cur.poids);
    const f = ease(cur.fin);
    const on = cur.hero > .1 && f < .999;
    root.classList.toggle('exploded', cur.hero > .1);
    stack.visible = on;
    if (!on) return false;

    const { pivot, rects, slot, SW, SH } = geo;
    stack.position.set(lerp(pivot.x, slot.x, travel), lerp(pivot.y, slot.y, travel), 0);
    stack.scale.setScalar(lerp(1, geo.s, travel));
    stack.rotation.set(lerp(0, -.58, explode) + c * -.06, lerp(0, .66, explode) + c * .06, 0);

    // Modèle de boîte -> calques de page
    box.forEach((L, i) => {
      const r = rects[i];
      L.position.set(lerp(r.x - pivot.x, 0, c), lerp(r.y - pivot.y, 0, c), lerp(i * .5, i * 120, explode) + c * i * 15);
      L.scale.set(lerp(r.w, SW, c), lerp(r.h, SH, c), 1);
      setOpacity(L, 1 - seg(c, .3, .8));
    });
    const hls = [hl.a0, hl.a1, hl.a2, hl.a3];
    const hmax = Math.max(...hls);
    pages.forEach((P, i) => {
      P.position.set(0, 0, i * 135 + hls[i] * 60 - q * i * 100);
      P.scale.set(SW, SH, 1);
      P.userData.edges.material.color.copy(i === 3 ? red : ink).lerp(red, hls[i]);
      setOpacity(P, seg(c, .35, 1) * (1 - q) * (1 - .6 * (hmax - hls[i])));
    });
    // Calques -> planches des essais
    plates.forEach((P, i) => {
      const k = lift[`p${i}`];
      const w = SW * .9;
      // La planche active sort de la pile : elle monte et passe devant les autres
      P.position.set((i - 2.5) * -SW * .05 + k * SW * .08, (i - 2.5) * -SH * .03 + k * SH * .32, i * 70 + k * (plates.length * 70 + 40) - (1 - q) * 160);
      P.scale.set(w, w * .625, 1);
      P.userData.edges.material.color.copy(ink).lerp(red, k);
      setOpacity(P, q * (1 - b) * (.45 + .55 * k));
    });
    // Planches -> barres du poids réel
    const max = Math.max(...KINDS.map((key) => kb[key]), 1);
    bars.forEach((B, i) => {
      const hgt = Math.max(.5, (kb[KINDS[i]] / max) * SH * 1.3 * b * (1 - f));
      B.position.set(lerp((i - 3) * SW * .13, 0, f), -SH * .45, 0);
      B.scale.set(SW * .075, hgt, SW * .075);
      setOpacity(B, Math.min(1, b * 1.5) * (1 - f));
    });
    return true;
  }

  function labels() {
    const explode = ease(seg(cur.hero, .1, .5)) * (1 - seg(cur.couches, .1, .4));
    const BOX_NAMES = [`contenu · ${$('[data-cote="w"]').value} × ${$('[data-cote="h"]').value}`, `marge interne · ${$('[data-bm="padding"]').value} px`, `bordure · ${$('[data-bm="border"]').value} px`, `marge · ${$('[data-bm="margin"]').value} px`];
    const place = (s, obj, x, y, z, k) => {
      if (k < .02 || !stack.visible) { s.style.opacity = 0; return; }
      const p = engine.project(obj, x, y, z);
      s.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
      s.style.opacity = k.toFixed(2);
    };
    boxLabels.forEach((s, i) => { s.textContent = BOX_NAMES[i]; place(s, box[i], -.5, .5, 0, explode); });
    const pk = seg(cur.couches, .5, 1) * (1 - seg(cur.essais, 0, .4));
    pageLabels.forEach((s, i) => place(s, pages[i], .5, .5, 0, pk));
    plateLabel.textContent = `Fig. 0${activePlate + 1} · ${PLATE_NAMES[activePlate]}`;
    place(plateLabel, plates[activePlate], .5, -.5, 0, seg(cur.essais, .5, 1) * (1 - seg(cur.poids, 0, .4)));
    const bk = seg(cur.poids, .6, 1) * (1 - seg(cur.fin, 0, .3));
    barLabels.forEach((s, i) => { s.innerHTML = `${LABEL[KINDS[i]]}<br><b>${nf.format(kb[KINDS[i]])} Ko</b>`; place(s, bars[i], 0, 1, 0, bk); s.style.translate = `-50% calc(-100% - ${8 + (i % 2) * 26}px)`; });
  }

  let last = performance.now();
  let idle = 0;
  gsap.ticker.add(() => {
    if (!engine.alive || document.hidden) return;
    const now = performance.now();
    const k = 1 - Math.exp(-(now - last) / 110);
    last = now;
    let moving = false;
    for (const key in target) { const d = target[key] - cur[key]; if (Math.abs(d) > 1e-4) moving = true; cur[key] += d * k; }
    const tx = engine.tilt.rotation.x, ty = engine.tilt.rotation.y;
    engine.tilt.rotation.x += (tiltTo.x - tx) * .08;
    engine.tilt.rotation.y += (tiltTo.y - ty) * .08;
    if (Math.abs(tiltTo.x - tx) + Math.abs(tiltTo.y - ty) > 1e-4) moving = true;
    // Au repos complet, on ne redessine plus : aucune image calculée pour rien
    idle = moving || gsap.isTweening(hl) || gsap.isTweening(lift) ? 0 : idle + 1;
    if (idle > 3) return;
    const visible = compute();
    labels();
    if (visible || idle < 2) engine.render();
  });

  // Retirer ou remettre la couche créative : preuve que la page tient sans elle
  const btn = $('[data-toggle-layer]');
  const btnStatus = (t) => { $('#toggle-status').textContent = t; };
  btn.addEventListener('click', () => {
    if (engine.alive) { removeLayer('à votre demande'); return; }
    const fresh = canvas.cloneNode();
    canvas.replaceWith(fresh);
    canvas = fresh;
    engine.restore(fresh);
    root.classList.add('xp-3d');
    idle = 0;
    btn.textContent = 'Retirer la couche créative';
    btnStatus('Couche créative remise : la scène est recréée sur un nouveau contexte WebGL.');
  });
  root.classList.add('has-3d');
  const tFirst = performance.now();
  stack.visible = true;
  engine.render();
  stack.visible = false;
  btnStatus(`Scène prête : ${stack.children.length} objets, premier rendu (compilation des shaders comprise) en ${(performance.now() - tFirst).toFixed(1)} ms.`);
  ScrollTrigger.refresh();
}
