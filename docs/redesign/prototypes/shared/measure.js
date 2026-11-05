// Mesures réelles de la page, prises dans le navigateur du visiteur.
// Aucune valeur n'est inventée : si une API n'est pas disponible, la valeur affichée est "n/d".
//
// Usage : observeMeasures((m) => render(m))
// m = { transferKB, decodedKB, requests, jsKB, lcp, cls, inp, domNodes, cached, fromCache }

export function observeMeasures(onUpdate) {
  const m = { transferKB: null, decodedKB: null, requests: null, jsKB: null, lcp: null, cls: 0, inp: null, domNodes: null, fromCache: false };
  const emit = () => onUpdate({ ...m });

  const collectResources = () => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    let transfer = nav ? nav.transferSize : 0;
    let decoded = nav ? nav.decodedBodySize : 0;
    let js = 0;
    for (const r of res) {
      transfer += r.transferSize || 0;
      decoded += r.decodedBodySize || 0;
      if (r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name)) js += r.decodedBodySize || 0;
    }
    m.requests = res.length + 1;
    m.transferKB = +(transfer / 1024).toFixed(1);
    m.decodedKB = +(decoded / 1024).toFixed(1);
    m.jsKB = +(js / 1024).toFixed(1);
    // transferSize vaut 0 quand la ressource vient du cache
    m.fromCache = !!nav && nav.transferSize === 0;
    m.domNodes = document.getElementsByTagName('*').length;
  };

  const obs = (type, cb, extra = {}) => {
    try { new PerformanceObserver((l) => { l.getEntries().forEach(cb); emit(); }).observe({ type, buffered: true, ...extra }); }
    catch (e) { /* API indisponible : la valeur reste n/d */ }
  };
  obs('largest-contentful-paint', (e) => { m.lcp = Math.round(e.startTime); });
  obs('layout-shift', (e) => { if (!e.hadRecentInput) m.cls = +(m.cls + e.value).toFixed(3); });
  // approximation de l'INP : la plus longue interaction observée
  obs('event', (e) => { if (e.interactionId) m.inp = Math.max(m.inp || 0, Math.round(e.duration)); }, { durationThreshold: 16 });
  obs('resource', () => collectResources());

  const ready = () => { collectResources(); emit(); };
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true });
  return m;
}

export const fmt = (v, unit = '') => (v === null || v === undefined ? 'n/d' : `${v.toLocaleString('fr-FR')}${unit}`);
