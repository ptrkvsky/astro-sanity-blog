// Couche d'expérience de /cv. Amélioration progressive : sans ce script, la page est complète.

import { detect } from './capabilities.js';
import { whenIdleAfterLoad } from './boot.js';
import { createXpLayer } from './xp-layer.js';

const caps = detect();

if (caps.tier !== 'static') {
  await whenIdleAfterLoad();
  try {
    await start();
  } catch (e) {
    console.warn("Couche d'expérience indisponible : la page reste dans son état final.", e);
    document.documentElement.classList.remove('xp-layer', 'xp-cursor-on');
    document.documentElement.classList.add('xp-settled');
  }
} else {
  document.documentElement.classList.add('xp-settled');
}

async function start() {
  const layer = await createXpLayer(caps);
  const { gsap, ScrollTrigger, $, $$, EASE, reveal, scramble, enter, sectionHead } = layer;

  layer.run(() => {
    // ---------- Hero ----------
    reveal($('.cv .hero h1'), { trigger: null, stagger: 0.025 });
    scramble($('.cv .hero > p.mono.muted'));
    const heroRest = $$('.cv > .hero .role, .cv > .hero .lede, .cv > .hero .actions, .cv > .hero .proof');
    gsap.set(heroRest, { opacity: 0, y: 14 });
    gsap.to(heroRest, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.09, delay: 0.35, clearProps: 'transform,opacity' });

    $$('.cv .sec-head').forEach((head) => sectionHead(head));

    // ---------- 01 Résumé ----------
    enter($$('.cv .prose p'), { stagger: 0.12 });

    // ---------- 02 Trois passes ----------
    $$('.cv .pass').forEach((pass) => {
      reveal($('.pass-label h3', pass), { type: 'lines,words', stagger: 0.06, trigger: pass, start: 'top 80%' });
      enter($$('.pass-label .note, .pass-body > *', pass), { trigger: pass, start: 'top 75%', stagger: 0.1, y: 22 });
      const stamp = $('.stamp', pass);
      if (stamp) {
        const text = stamp.textContent;
        gsap.set(stamp, { opacity: 0, scale: 1.7, rotate: -9 });
        ScrollTrigger.create({
          trigger: stamp,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(stamp, { opacity: 1, scale: 1, rotate: -2, duration: 0.55, ease: 'back.out(2.4)', clearProps: 'transform,opacity' });
            gsap.fromTo(stamp, { scrambleText: { text: '', chars: '01·/—+' } }, { duration: 0.7, scrambleText: { text, chars: '01·/—+', speed: 0.8 } });
          },
        });
      }
    });

    // ---------- 03 Expérience ----------
    const timeline = $('.cv .timeline');
    if (timeline) {
      gsap.fromTo(timeline, { '--tl': 0 }, { '--tl': 1, ease: 'none', scrollTrigger: { trigger: timeline, start: 'top 70%', end: 'bottom 70%', scrub: 0.5 } });
      $$('li', timeline).forEach((li, i) => {
        scramble($('.when', li), li);
        if (i === 0) reveal($('h3', li), { type: 'lines,words', stagger: 0.07, trigger: li });
        enter($$(i === 0 ? ':scope > :not(.when):not(h3)' : ':scope > :not(.when)', li), { trigger: li, stagger: 0.07, y: 16 });
      });
    }

    // ---------- 04 Réalisations, 07 Formation ----------
    $$('.cv .selected').forEach((list) => enter($$('li', list), { trigger: list, stagger: 0.1, y: 20 }));

    // ---------- 05 Distinctions ----------
    $$('.cv dl.spec').forEach((dl) => {
      if (dl.closest('.achievement')) return;
      enter($$(':scope > div', dl), { trigger: dl, stagger: 0.08, y: 14 });
    });

    // ---------- 06 Compétences ----------
    $$('.cv .skills dl').forEach((dl) => {
      const chips = $$('dd span', dl);
      gsap.set(chips, { opacity: 0, y: 8 });
      ScrollTrigger.create({
        trigger: dl,
        start: 'top 90%',
        once: true,
        onEnter: () => gsap.to(chips, { opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.04, clearProps: 'transform,opacity' }),
      });
    });

    // ---------- 08 Contact ----------
    enter($$('.cv .sec:last-of-type .btn'), { stagger: 0.09, y: 14 });

    // ---------- Progression de lecture ----------
    const bar = document.createElement('div');
    bar.className = 'xp-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.append(bar);
    layer.onRemove(() => bar.remove());
    gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  });

  layer.startLenis();
  layer.startPointer('.cv .btn');
}
