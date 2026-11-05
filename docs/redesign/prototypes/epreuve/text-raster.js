// Texte en texture (D11) : redessine un titre HTML dans un canvas 2D, mot par mot, aux positions
// exactes que lui donne le navigateur (Range.getClientRects). Le titre reste le contenu réel :
// la texture n'en est qu'une copie, régénérée au redimensionnement.
// Canal rouge : texte courant (plaque papier) ; canal vert : texte des éléments `accent` (plaque rouge seule).
// Avec `palette` ({ base, accent }), le texte est dessiné dans ses vraies couleurs.

export function rasterize(el, { dpr = 1, pad = 0, accent = 'em', palette = null } = {}) {
  const box = el.getBoundingClientRect();
  const w = box.width + pad * 2;
  const h = box.height + pad * 2;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * dpr);
  canvas.height = Math.ceil(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.globalCompositeOperation = palette ? 'source-over' : 'lighter';
  ctx.textBaseline = 'alphabetic';

  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    const cs = getComputedStyle(parent);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    const isAccent = !!parent.closest(accent);
    ctx.fillStyle = palette ? (isAccent ? palette.accent : palette.base) : isAccent ? '#00ff00' : '#ff0000';
    // La boîte d'une plage de texte couvre la zone de contenu de la fonte : la ligne de base est à `ascent` sous son haut
    const ascent = ctx.measureText('Hg').fontBoundingBoxAscent;

    const re = /\S+/g;
    for (let m = re.exec(node.data); m; m = re.exec(node.data)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const rects = range.getClientRects();
      if (rects.length === 1) {
        ctx.fillText(m[0], rects[0].left - box.left + pad, rects[0].top - box.top + pad + ascent);
        continue;
      }
      // Mot coupé sur deux lignes : on retombe sur un dessin lettre par lettre
      for (let i = 0; i < m[0].length; i++) {
        range.setStart(node, m.index + i);
        range.setEnd(node, m.index + i + 1);
        const r = range.getClientRects()[0];
        if (r) ctx.fillText(m[0][i], r.left - box.left + pad, r.top - box.top + pad + ascent);
      }
    }
  }
  return { canvas, width: w, height: h, pad };
}
