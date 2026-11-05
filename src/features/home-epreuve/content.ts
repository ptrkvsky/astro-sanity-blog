// Contenu de l'accueil Épreuve / Calage (en dur, sans Sanity).
// Sources : parcours de docs/redesign/experience-signature.md (§ 4) et projets saisis par Johan dans Sanity.
// Un champ absent n'est pas rendu : rien n'est affiché tant que l'information n'a pas été fournie.

export const email = 'johan@developpeur-web.tech';

export const links = {
  linkedin: 'https://www.linkedin.com/in/johanpetrikovsky',
  github: 'https://github.com/ptrkvsky',
};

export const site = {
  author: 'Johan Petrikovsky',
  role: 'Développeur frontend',
  city: 'Toulouse',
  since: 2012,
  availability: 'Disponible',
};

export const hero = {
  kicker: 'Développeur frontend senior · Toulouse, depuis 2012',
  titleBefore: 'Des interfaces ',
  titleEmphasis: 'rapides,',
  titleAfter: ' lisibles, trouvables.',
  lede: "Sites à fort trafic, outils métier, expériences interactives : je construis des interfaces qui se chargent vite, se lisent sans effort et se trouvent. Cette page en est l'épreuve.",
  slug: 'developpeur-web.tech · épreuve 1/5 · Instrument Serif, PolySans, Plex Mono · 2 plaques',
};

export const methode = {
  title: 'Du balisage au pixel',
  note: "Un navigateur compose une page comme un imprimeur tire une épreuve : en passes successives, chacune contrôlée.",
  steps: [
    {
      browser: 'Balisage',
      print: 'Composition',
      title: 'Le contenu existe avant le script.',
      text: "Tout le texte, les liens et le contact sont dans le HTML servi. Un robot, un lecteur d'écran ou un navigateur sans JavaScript lisent la même page.",
    },
    {
      browser: 'Style',
      print: 'Imposition',
      title: 'La mise en page tient seule.',
      text: "Grille, typographie et focus sont en CSS. Les animations s'ajoutent par-dessus : elles ne cachent jamais un contenu en attendant un script.",
    },
    {
      browser: 'Mise en page',
      print: 'Calage',
      title: "Rien ne bouge à l'arrivée.",
      text: 'Chaque boîte connaît sa taille avant les images et les polices : le texte ne saute pas sous le doigt. Décalage visé : 0,02 au plus.',
    },
    {
      browser: 'Peinture',
      print: 'Encrage',
      title: 'Ce qui s’affiche coûte ce qu’il doit.',
      text: 'Images en AVIF à dimensions déclarées, polices réduites aux caractères utiles, aucune vidéo d’arrière-plan.',
    },
    {
      browser: 'Composition des calques',
      print: 'Tirage',
      title: 'Les effets arrivent en dernier.',
      text: "Les effets graphiques de cette page se chargent après le contenu, ne dessinent que ce qui est visible et s'arrêtent hors de l'écran. Sans eux, rien ne manque.",
    },
  ],
};

export type Essai = {
  n: string;
  slug: string;
  title: string;
  role: string;
  year: string;
  stack: string;
  url?: string;
};

export const essais = {
  title: 'Essais',
  note: 'Six projets livrés : le problème, les contraintes, les décisions. Survolez une ligne : elle se cale.',
  list: [
    { n: '01', slug: 'safti', title: 'SAFTI.fr', role: "Refonte d'architecture, SEO", year: '2022', stack: 'Next.js · TypeScript · Tailwind · Jest', url: 'https://www.safti.fr/' },
    { n: '02', slug: 'omega', title: 'Omega', role: 'Lead frontend, outil métier', year: '2024', stack: 'React · TypeScript · Storybook · Leaflet', url: 'https://omega.safti.fr/' },
    { n: '03', slug: 'draw-me-a-sheep', title: 'Draw me a Sheep', role: 'Développement complet, WebGL et GSAP', year: '2024', stack: 'Astro · React · Sanity · WebGL · GSAP', url: 'https://drawmeasheep.fr/' },
    { n: '04', slug: 'bien-estimer', title: 'Bien Estimer', role: 'SEO, plan de marquage GA4', year: '2024', stack: 'Next.js · SEO · GA4', url: 'https://bien-estimer-safti.fr/' },
    { n: '05', slug: 'als', title: 'ALS Action Canada', role: 'Refonte de templates', year: '2024', stack: 'Gatsby · React · WordPress headless', url: 'https://www.alsactioncanada.org/' },
    { n: '06', slug: 'join-safti', title: 'Join SAFTI', role: 'Full-stack, multilingue', year: '2023', stack: 'Sulu CMS · PHP · TypeScript · Tailwind', url: 'https://www.join-safti.com/fr' },
  ] satisfies Essai[],
  feature: {
    n: '01',
    year: '2022',
    stack: 'Next.js · TypeScript · Jest',
    title: 'Refondre un site d’annonces sans perdre son trafic',
    spec: [
      { dt: 'Problème', dd: "Un site d'annonces immobilières dont le trafic dépend du référencement naturel, à faire évoluer vers une architecture plus moderne." },
      { dt: 'Décisions', dd: "Montée de version de Next.js vers l'App Router, optimisation technique du SEO, tests unitaires avec objectifs de couverture atteints, suppression des code smells remontés par SonarQube." },
      { dt: 'Résultat', dd: "Une fonctionnalité proposée et développée a fait passer la note Trustpilot de 2,1 à 4,8." },
    ],
    figure: { alt: "Illustration de l'essai SAFTI.fr : maisons et repères de carte en trame, un repère rouge, une barre de recherche vide", caption: 'Fig. 01 · illustration générée, pas une capture du site', hint: 'Épreuve en trame à 45° et 15°' },
  },
};

export const controle = {
  title: 'Contrôle, en direct',
  note: "Au bas de chaque feuille, l'imprimeur mesure une gamme de contrôle. Ici, ce sont les mesures de cette page, prises par votre navigateur.",
  measures: [
    { n: '01', label: 'Poids transféré', key: 'transferKB' },
    { n: '02', label: 'Requêtes', key: 'requests' },
    { n: '03', label: 'JavaScript', key: 'jsKB' },
    { n: '04', label: 'Plus grand affichage', key: 'lcp' },
    { n: '05', label: 'Décalage visuel', key: 'cls' },
    { n: '06', label: 'Interaction la plus lente', key: 'inp' },
  ],
  weights: [
    { label: 'HTML', key: 'html' },
    { label: 'CSS', key: 'css' },
    { label: 'JavaScript', key: 'js' },
    { label: 'Polices', key: 'fonts' },
    { label: 'Images', key: 'images' },
  ],
  strip: 'Valeurs de cette page, maintenant. "n/d" : mesure indisponible (API absente ou JavaScript désactivé).',
  checks: [
    { title: 'Performance', text: 'Temps de réponse serveur, poids des pages, rendu, suivi en production.', proof: 'Comment réduire le TTFB', href: '/posts/comment-reduire-ttfb' },
    { title: 'SEO technique', text: 'Rendu serveur, données structurées, maillage, migrations sans perte de trafic.', proof: 'Le rôle des développeurs dans le SEO', href: '/posts/quel-impact-un-developpeur-peut-il-avoir-sur-le-seo-d-un-site' },
    { title: 'Accessibilité', text: 'Clavier, focus visible, mouvement réduit, composants qui disent ce qu’ils font.', proof: 'Les composants Tooltip ne devraient pas exister', href: '/posts/les-composants-tooltip-ne-devraient-pas-exister' },
    { title: 'Architecture', text: 'Applications React typées et testées, cache et rendu Next.js maîtrisés.', proof: 'Cache handler personnalisé pour Next.js 16', href: '/posts/comment-creer-un-cache-handler-personnalise-pour-next-js-16' },
  ],
};

export const apropos = {
  title: 'À propos',
  note: "D'abord l'agence, maintenant le produit : quatorze ans de frontend.",
  bio: [
    "Développeur depuis 2012, j'ai commencé en agence sur PHP et WordPress avant de me spécialiser dans l'écosystème JavaScript.",
    "Je travaille aujourd'hui sur des sites à fort trafic et des outils métier, en alliant performance, SEO et expérience utilisateur. J'écris aussi sur ce que j'apprends.",
  ],
  quotes: [
    { text: 'Chaque projet m’a permis d’apprécier sa réactivité, son engagement professionnel et ses compétences.', author: 'Perrine Sini-Berthonneau, fondatrice du studio Les Cerises' },
    { text: 'Toujours au fait des nouvelles techniques d’intégration, je le conseille à 100 %.', author: 'Florent Pasquet, fondateur de l’agence web Spinat' },
  ],
  notesTitle: 'Dernières notes',
};

export const contact = {
  title: 'Un projet, une refonte, un audit de performance\u00a0?',
  emphasis: 'Signons le bon à tirer.',
};
