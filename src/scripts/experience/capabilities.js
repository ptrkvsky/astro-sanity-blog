// Niveaux d'expérience (D10). Le niveau décide ce qui est chargé, jamais ce qui est lisible :
// le HTML complet est servi à tous.
//   full   : tout (épinglages, WebGL en DPR 1,5 au plus, pointeur)
//   lite   : écran tactile ou étroit, économie de données, peu de mémoire : pas d'épinglage, WebGL en DPR 1
//   static : mouvement réduit : état final de chaque motif, aucune animation
// Outils de test, actifs seulement en développement : ?tier=full|lite|static force un niveau ; ?simulate=nogl retire WebGL2, ?simulate=lost perd le contexte.

const TIERS = ['full', 'lite', 'static'];
let webgl2Cache;

function hasWebGL2() {
  if (webgl2Cache !== undefined) return webgl2Cache;
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    webgl2Cache = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webgl2Cache = false;
  }
  return webgl2Cache;
}

export function detect() {
  const q = new URLSearchParams(import.meta.env.DEV ? location.search : '');
  const mm = (s) => matchMedia(s).matches;
  const reduced = mm('(prefers-reduced-motion: reduce)');
  const coarse = mm('(pointer: coarse)');
  const narrow = mm('(max-width: 48rem)');
  const saveData = navigator.connection?.saveData === true;
  const memory = navigator.deviceMemory ?? null;
  const simulate = q.get('simulate');

  let tier = 'full';
  if (reduced) tier = 'static';
  else if (coarse || narrow || saveData || (memory !== null && memory < 4)) tier = 'lite';
  if (TIERS.includes(q.get('tier'))) tier = q.get('tier');

  const webgl = tier !== 'static' && !saveData && simulate !== 'nogl' && hasWebGL2();
  const dpr = Math.min(devicePixelRatio || 1, tier === 'full' ? 1.5 : 1);
  return { tier, webgl, reduced, coarse, narrow, saveData, memory, simulate, dpr };
}
