// Couche d'expérience de l'accueil (D12). Exclus volontairement :
//  - .hero-title (rendu WebGL, texture alignée sur le DOM) ;
//  - .step h3 et .index .t (text-shadow animé) ;
//  - les éléments réécrits par JS (output, compteurs) : le scramble les écraserait.

import { createXpLayer } from './xp-layer.js';

export async function startHomeFx(caps) {
  const layer = await createXpLayer(caps, { removeButton: false });
  const { $, $$, reveal, scramble, enter, sectionHead } = layer;

  layer.run(() => {
    scramble($('.hero-kicker'));

    $$('.sec-head').forEach((head) => sectionHead(head));

    $$('.press-label, .kicker, .step-pair, .service-no, .contact-meta').forEach((el) => scramble(el, el));

    $$('#t-feature, .checks h3, .service-sheet h3, .brief-stages h3').forEach((h) => reveal(h, { type: 'lines,words', stagger: 0.06 }));

    $$('.checks > div, .facts-list, .quotes blockquote, .notes-list li, .questions-sheet details, .brief-intro, .bio p')
      .forEach((el) => enter(el, { y: 18 }));

    const bat = $('.bat');
    if (bat) {
      scramble($('.sec-num', bat), bat);
      reveal($('h2', bat), { stagger: 0.03 });
    }
  });

  layer.startLenis();
  layer.startPointer('.hero .btn, [data-remove-layer], a.more, a.mail');
  return layer;
}
