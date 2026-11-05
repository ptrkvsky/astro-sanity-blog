// Inclinaison selon la vitesse de défilement (principe observé sur david-estrada.dev) :
// la vitesse en écrans par seconde tire l'inclinaison, un ressort la ramène à 0.
// La boucle ne tourne que pendant le mouvement, puis s'arrête d'elle-même.
// Elle n'écrit qu'une variable CSS par élément (non héritée, voir scroll.css) :
// aucune lecture de mise en page, et pas de recalcul de style des descendants.
export function lean(targets, { gain = 0.55, stiffness = 60, damping = 12 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  let raf = 0, lastY = scrollY, lastT = 0, value = 0, speed = 0;
  const frame = (t) => {
    const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 1 / 60;
    lastT = t;
    const v = (scrollY - lastY) / dt / innerHeight;
    lastY = scrollY;
    const goal = Math.max(-1, Math.min(1, v * gain));
    speed += ((goal - value) * stiffness - speed * damping) * dt;
    value += speed * dt;
    for (const t of targets) t.style.setProperty('--v', value.toFixed(4));
    if (Math.abs(value) < 0.0005 && Math.abs(speed) < 0.0005 && goal === 0) {
      for (const t of targets) t.style.setProperty('--v', '0');
      raf = 0; lastT = 0; return;
    }
    raf = requestAnimationFrame(frame);
  };
  // lastY n'est pas remis à jour ici : il garde la position de la dernière image,
  // sinon le premier déplacement serait perdu et la vitesse resterait nulle.
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
  addEventListener('scroll', wake, { passive: true });
  return (next) => { gain = next; };
}
