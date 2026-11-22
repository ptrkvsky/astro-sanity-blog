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
