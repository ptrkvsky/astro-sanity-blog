// Chargement différé de la couche d'expérience : rien ne part avant le premier rendu,
// les fontes et un moment d'inactivité. Le contenu est déjà complet à ce stade.

export function whenIdleAfterLoad() {
  return new Promise((resolve) => {
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(() => resolve(), { timeout: 600 }) : setTimeout(resolve, 60));
    const ready = () => document.fonts.ready.then(idle);
    if (document.readyState === 'complete') ready();
    else addEventListener('load', ready, { once: true });
  });
}

// Scripts UMD (GSAP) : téléchargés en parallèle, exécutés dans l'ordre (async = false).
export function loadScripts(urls) {
  return Promise.all(urls.map((src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`script indisponible : ${src}`));
    document.head.append(s);
  })));
}

export const GSAP = '/vendor/gsap-3.13.0/';
export const gsapFiles = (...plugins) => ['gsap', ...plugins].map((n) => `${GSAP}${n}.min.js`);
