// Instruments communs : images par seconde, frames d'animation longues (LoAF), CLS,
// plus des valeurs propres à chaque prototype (bench.set). Tout est aussi exposé
// dans window.__bench pour la vérification automatisée.
// Le compteur d'images par seconde tourne en continu : il coûte une callback
// requestAnimationFrame par image, à ne pas confondre avec le coût de l'effet mesuré.

const state = { fps: null, loafCount: 0, loafMax: 0, loafTotal: 0, cls: 0, extra: {} };
window.__bench = state;

let panel;
const render = () => {
  if (!panel) return;
  const rows = [
    ['images/s', state.fps ?? 'n/d'],
    ['LoAF > 50 ms', `${state.loafCount} (max ${state.loafMax} ms)`],
    ['CLS', state.cls.toFixed(3)],
    ...Object.entries(state.extra),
  ];
  panel.querySelector('dl').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
};

export const bench = {
  set(key, value) { state.extra[key] = value; render(); },
  // Remet les compteurs à zéro avant une mesure (ex. avant un défilement scripté).
  reset() { state.loafCount = 0; state.loafMax = 0; state.loafTotal = 0; render(); },
};

export function mountBench() {
  panel = document.createElement('aside');
  panel.className = 'bench';
  panel.setAttribute('aria-label', 'Instruments de mesure');
  panel.innerHTML = '<dl></dl>';
  document.body.append(panel);

  let frames = 0, since = performance.now();
  const tick = (now) => {
    frames++;
    if (now - since >= 1000) { state.fps = Math.round((frames * 1000) / (now - since)); frames = 0; since = now; render(); }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        state.loafCount++; state.loafTotal += e.duration;
        state.loafMax = Math.max(state.loafMax, Math.round(e.duration));
      }
      render();
    }).observe({ type: 'long-animation-frame', buffered: true });
  } catch { state.extra['LoAF'] = 'API absente'; }
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) state.cls += e.value;
      render();
    }).observe({ type: 'layout-shift', buffered: true });
  } catch {}
  render();
}

// Relie un <input type=range> à une propriété CSS personnalisée et à son <output>.
export function bindRange(input, { target = document.documentElement, prop, unit = '', onChange } = {}) {
  const out = input.parentElement.querySelector('output');
  const apply = () => {
    if (prop) target.style.setProperty(prop, input.value + unit);
    if (out) out.value = input.value + unit;
    onChange?.(+input.value);
  };
  input.addEventListener('input', apply);
  apply();
}
