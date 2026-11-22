// Couche d'expérience partagée (D12) : texte découpé, scramble, Lenis, curseur, boutons magnétiques.
// Chaque page fournit ses sélecteurs ; la couche garde un seul registre de nettoyage.

import { gsap, ScrollTrigger } from './gsap-core.js';

const EASE = 'cubic-bezier(.2,.7,.2,1)';
const SCRAMBLE_CHARS = '01·/—+';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const INTERACTIVE = 'a, button, summary';
const ROOT_CLASS = 'xp-layer';
const CURSOR_CLASS = 'xp-cursor-on';

export async function createXpLayer(caps, { removeButton = true } = {}) {
  const [{ SplitText }, { ScrambleTextPlugin }, { default: Lenis }] = await Promise.all([
    import('gsap/SplitText'),
    import('gsap/ScrambleTextPlugin'),
    import('lenis'),
  ]);
  gsap.registerPlugin(SplitText, ScrambleTextPlugin);

  const root = document.documentElement;
  const full = caps.tier === 'full';
  const abort = new AbortController();
  const { signal } = abort;
  const cleanups = [];
  const splits = [];
  let context;
  let removed = false;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const palette = () => {
    const css = getComputedStyle(root);
    return { muted: css.getPropertyValue('--muted').trim(), red: css.getPropertyValue('--red').trim() };
  };

  const scramble = (el, trigger) => {
    if (!el || el.children.length) return;
    const text = el.textContent;
    const play = () => gsap.to(el, { duration: 0.9, ease: 'none', scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6 } });
    trigger ? ScrollTrigger.create({ trigger, start: 'top 88%', once: true, onEnter: play }) : play();
  };

  // Le texte reste lu en entier : SplitText pose l'aria-label d'origine, les fragments sont masqués aux lecteurs d'écran.
  const reveal = (el, { type = full ? 'lines,chars' : 'lines', stagger = 0.02, trigger = el, start = 'top 88%', delay = 0 } = {}) => {
    if (!el) return;
    let played = false;
    splits.push(SplitText.create(el, {
      type,
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        self.masks?.forEach((m) => m.classList.add('xp-mask'));
        if (played) return undefined;
        const parts = type.includes('chars') ? self.chars : self.lines;
        gsap.set(parts, { yPercent: 110 });
        return gsap.to(parts, {
          yPercent: 0,
          duration: 0.9,
          ease: EASE,
          stagger,
          delay,
          onComplete: () => { played = true; },
          scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
        });
      },
    }));
  };

  const enter = (els, { y = 18, stagger = 0.08, start = 'top 88%', trigger } = {}) => {
    const targets = gsap.utils.toArray(els);
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0, y });
    ScrollTrigger.create({
      trigger: trigger ?? targets[0],
      start,
      once: true,
      onEnter: () => gsap.to(targets, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger, clearProps: 'transform,opacity' }),
    });
  };

  // Numéro (gris → rouge, scramble), titre découpé, filet qui se trace.
  const sectionHead = (head, { titleType } = {}) => {
    const { muted, red } = palette();
    const num = $('.sec-num', head);
    if (num) {
      gsap.set(num, { color: muted });
      ScrollTrigger.create({ trigger: head, start: 'top 85%', once: true, onEnter: () => gsap.to(num, { color: red, duration: 0.6, ease: 'none', clearProps: 'color' }) });
      scramble(num, head);
    }
    reveal($('h2', head), { trigger: head, stagger: 0.03, ...(titleType && { type: titleType }) });
    gsap.fromTo(head, { '--rule': 0 }, { '--rule': 1, duration: 1.1, ease: EASE, scrollTrigger: { trigger: head, start: 'top 88%', once: true } });
  };

  const startLenis = () => {
    if (!full) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    const tick = (t) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    });
  };

  const startPointer = (magnetSelector) => {
    if (!full || !matchMedia(FINE_POINTER).matches) return;
    const cursor = document.createElement('div');
    cursor.className = 'xp-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    const moveX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    const moveY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
    const scaleTo = (scale) => gsap.to(cursor, { scale, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
    const magnets = $$(magnetSelector).map((el) => ({
      el,
      x: gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, .6)' }),
      y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, .6)' }),
    }));
    const REACH = 60;
    const PULL = 0.3;
    let shown = false;

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) {
        shown = true;
        root.classList.add(CURSOR_CLASS);
        gsap.to(cursor, { opacity: 1, duration: 0.2 });
      }
      moveX(e.clientX);
      moveY(e.clientY);
      for (const m of magnets) {
        const r = m.el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + REACH && Math.abs(dy) < r.height / 2 + REACH;
        m.x(near ? dx * PULL : 0);
        m.y(near ? dy * PULL : 0);
      }
    }, { signal, passive: true });
    document.addEventListener('pointerover', (e) => scaleTo(e.target.closest?.(INTERACTIVE) ? 3.2 : 1), { signal });
    root.addEventListener('pointerleave', () => gsap.to(cursor, { opacity: 0, duration: 0.2 }), { signal });
    root.addEventListener('pointerenter', () => shown && gsap.to(cursor, { opacity: 1, duration: 0.2 }), { signal });
    cleanups.push(() => {
      root.classList.remove(CURSOR_CLASS);
      cursor.remove();
      for (const m of magnets) gsap.set(m.el, { clearProps: 'transform' });
    });
  };

  const onRemove = (fn) => cleanups.push(fn);

  const remove = () => {
    if (removed) return;
    removed = true;
    abort.abort();
    for (const c of cleanups) c();
    for (const s of splits) s.revert();
    context?.revert();
    root.classList.remove(ROOT_CLASS, CURSOR_CLASS);
    const btn = $('[data-remove-layer]');
    if (btn) btn.hidden = true;
    const status = $('[data-layer-status]');
    if (status) status.textContent = 'Couche créative retirée : plus aucune animation, la page reste complète.';
  };

  const run = (fn) => {
    context = gsap.context(fn);
    root.classList.add(ROOT_CLASS);
    ScrollTrigger.refresh();
  };

  const btn = $('[data-remove-layer]');
  if (btn && removeButton) {
    btn.hidden = false;
    btn.addEventListener('click', remove, { once: true });
  }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', () => { if (motion.matches) remove(); }, { signal });
  addEventListener('pagehide', (e) => { if (!e.persisted) remove(); });

  return { gsap, ScrollTrigger, full, $, $$, EASE, reveal, scramble, enter, sectionHead, startLenis, startPointer, onRemove, remove, run };
}
