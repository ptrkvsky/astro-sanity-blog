// Adaptation des prototypes 02 (planches au scroll) et 03 (trame procédurale).
// Aucun texte n’est rasterisé. Un seul petit Canvas 2D, dessiné à la demande.
export function startEditorial({ gsap, ScrollTrigger, full }) {
  const abort = new AbortController();
  const q = (s) => document.querySelector(s);
  const art = q('.plate-art');
  const canvas = q('.plate-grain');
  const ctx = canvas?.getContext('2d');
  let visible = false;
  let dead = false;
  let size = 0;
  const ink = { phase: 0, x: 0, y: 0 };
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  function draw() {
    if (!ctx || !visible || dead || document.hidden) return;
    ctx.clearRect(0, 0, size, size);
    const step = full ? 10 : 16;
    for (let y = step; y < size; y += step) {
      for (let x = step; x < size; x += step) {
        const dx = x - size / 2 - ink.x * 26;
        const dy = y - size / 2 - ink.y * 26;
        const r = Math.hypot(dx, dy) / size;
        if (r > .43 || r < .12) continue;
        const wave = Math.sin(r * 65 - ink.phase * 12 + Math.atan2(dy, dx) * 3);
        const threshold = bayer[((y / step) % 4) * 4 + ((x / step) % 4)] / 16;
        const radius = Math.max(0, (wave + 1) * 1.2 - threshold);
        ctx.fillStyle = ink.phase < .5 ? '#FF5A36' : '#F1EEE6';
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function resize() {
    if (!canvas || dead) return;
    size = Math.min(600, Math.round(art.clientWidth));
    const dpr = Math.min(devicePixelRatio || 1, full ? 1.5 : 1);
    canvas.width = Math.round(size * dpr); canvas.height = Math.round(size * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) draw(); });
  if (art) io.observe(art);
  const ro = new ResizeObserver(resize);
  if (art) ro.observe(art);
  const labels = ['Interface', 'Architecture', 'Évolution'];
  const letters = ['R', 'N', '↗'];
  let active = -1;
  const context = gsap.context(() => {
    const plates = [...document.querySelectorAll('[data-service-plate]')];
    plates.forEach((plate, i) => {
      const select = () => {
        if (active === i || dead) return;
        active = i;
        q('[data-plate-name]').textContent = labels[i];
        q('[data-plate-count]').textContent = `0${i + 1} / 03`;
        q('.plate-letter').textContent = letters[i];
        gsap.fromTo('.plate-letter', { rotation: -7, scale: .88 }, { rotation: 0, scale: 1, duration: .7, ease: 'power3.out', overwrite: true });
      };
      ScrollTrigger.create({ trigger: plate, start: 'top 65%', end: 'bottom 65%', onEnter: select, onEnterBack: select });
      if (full) gsap.fromTo(plate.querySelector('h3'), { x: 20, rotation: 2 }, { x: 0, rotation: 0, ease: 'none', scrollTrigger: { trigger: plate, start: 'top 90%', end: 'top 35%', scrub: .6 } });
    });
    gsap.to(ink, { phase: 1, ease: 'none', onUpdate: draw, scrollTrigger: { trigger: '#expertise', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    gsap.fromTo('.plate-art .dial-plate-red', { x: 22, y: -18, rotation: -35, transformOrigin: '50% 50%' }, { x: 0, y: 0, rotation: 35, ease: 'none', scrollTrigger: { trigger: '#expertise', start: 'top bottom', end: 'bottom top', scrub: .8 } });
    gsap.to('.plate-art .dial-plate-ink', { rotation: -40, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '#expertise', start: 'top bottom', end: 'bottom top', scrub: .8 } });
    gsap.fromTo('.route-machine .dial-progress', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.brief-stages', start: 'top 65%', end: 'bottom 65%', scrub: .5 } });
    gsap.to('.route-machine .dial-ticks', { rotation: 270, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '.brief-stages', start: 'top 65%', end: 'bottom 65%', scrub: .5 } });
    gsap.fromTo('.route-machine .dial-plate-red', { rotation: -45, x: 12, transformOrigin: '50% 50%' }, { rotation: 0, x: 0, ease: 'none', scrollTrigger: { trigger: '.brief-stages', start: 'top 65%', end: 'bottom 65%', scrub: .5 } });
    document.querySelectorAll('[data-route-stage]').forEach((stage, i) => {
      const select = () => { q('.route-counter').textContent = `0${i + 1}`; };
      ScrollTrigger.create({ trigger: stage, start: 'top 65%', end: 'bottom 65%', onEnter: select, onEnterBack: select });
    });
    gsap.to('.question-seal .dial-ticks', { rotation: 90, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '#questions', start: 'top bottom', end: 'bottom top', scrub: .6 } });
  });
  const pointerTweens = [];
  if (full && art) {
    const tx = gsap.quickTo(ink, 'x', { duration: .6, onUpdate: draw });
    const ty = gsap.quickTo(ink, 'y', { duration: .6, onUpdate: draw });
    pointerTweens.push(tx.tween, ty.tween);
    art.addEventListener('pointermove', (e) => { const r = art.getBoundingClientRect(); tx((e.clientX - r.left) / r.width - .5); ty((e.clientY - r.top) / r.height - .5); }, { signal: abort.signal, passive: true });
    art.addEventListener('pointerleave', () => { tx(0); ty(0); }, { signal: abort.signal });
  }
  const extraTweens = new Set();
  document.querySelectorAll('.questions-sheet details').forEach((detail, i) => {
    detail.addEventListener('toggle', () => {
      if (dead) return;
      if (detail.open) {
        q('[data-question-count]').textContent = `0${i + 1} / 06`;
        // Le poinçon tourne ; le texte et la hauteur native restent immédiatement disponibles.
        extraTweens.forEach((t) => t.kill()); extraTweens.clear();
        const tween = gsap.to('.question-seal .dial-plate-red', { rotation: i * 30, transformOrigin: '50% 50%', duration: .65, ease: 'power3.out' });
        extraTweens.add(tween);
      }
      ScrollTrigger.refresh();
    }, { signal: abort.signal });
  });
  document.addEventListener('visibilitychange', draw, { signal: abort.signal });
  resize();
  return () => {
    if (dead) return;
    dead = true; abort.abort(); io.disconnect(); ro.disconnect();
    context.revert(); gsap.killTweensOf('.plate-letter');
    gsap.set('.plate-letter', { clearProps: 'transform,transformOrigin' });
    pointerTweens.forEach((t) => t.kill()); extraTweens.forEach((t) => t.kill());
    gsap.set('.question-seal .dial-plate-red', { clearProps: 'transform,transformOrigin' });
    if (canvas) { canvas.width = 0; canvas.height = 0; }
    q('.plate-letter').textContent = 'R'; q('[data-plate-name]').textContent = labels[0];
    q('[data-plate-count]').textContent = '01 / 03'; q('.route-counter').textContent = '01';
  };
}
