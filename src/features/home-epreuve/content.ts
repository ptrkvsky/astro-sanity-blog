// Contenu de l'accueil Épreuve / Calage (en dur, sans Sanity).
// Sources : parcours de docs/redesign/experience-signature.md (§ 4) et projets saisis par Johan dans Sanity.
// Un champ absent n'est pas rendu : rien n'est affiché tant que l'information n'a pas été fournie.

export const homeSeo = {
  title: 'Développeur React freelance à Toulouse | Johan Petrikovsky',
  description: 'Développeur React freelance à Toulouse. Création et refonte de sites et applications web avec Next.js et TypeScript : performance, SEO et accessibilité.',
};

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
  kicker: 'Développeur React freelance à Toulouse · Web depuis 2012',
  titleBefore: 'Des interfaces ',
  titleEmphasis: 'rapides,',
  titleAfter: ' lisibles, trouvables.',
  lede: "Sites à fort trafic, outils métier, expériences interactives : j'accompagne les entreprises et les agences dans la création et la refonte de sites internet et d'applications web avec React, Next.js et TypeScript. Cette page en est l'épreuve.",
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
  title: 'Projets React et développement web',
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
    figure: { alt: "Illustration de l'essai SAFTI.fr : trois volumes de béton clair, taillés en biseau, posés sur un plan gravé de courbes de niveau et de parcelles cadastrales ; un jalon rouge est planté sur le toit le plus bas", caption: 'Fig. 01 · maquette illustrée, pas une capture du site', hint: 'Volumes, courbes de niveau, parcellaire' },
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
  title: 'Votre développeur freelance à Toulouse',
  note: "D'abord l'agence, maintenant le produit : quatorze ans de frontend.",
  bio: [
    "Développeur web depuis 2012 et basé à Toulouse, j'ai commencé en agence sur PHP et WordPress avant de me spécialiser dans l'écosystème JavaScript, React et TypeScript.",
    "En freelance, j'interviens sur la création d'applications web, la refonte de sites internet et le développement frontend d'outils métier. Selon le projet, je prends en charge l'intégration HTML et CSS, les composants React, la connexion aux API ou l'architecture Next.js.",
    "Mes missions associent développement, tests et optimisation des performances, avec une attention au référencement naturel et à l'accessibilité. Les projets SAFTI, Omega et ALS Action Canada présentés plus haut illustrent ce travail avec les équipes produit et les développeurs backend.",
    "Je peux travailler avec votre équipe à Toulouse et en périphérie, ou à distance pour des clients dans toute la France. Pour préparer une mission, écrivez-moi avec le contexte du projet, les besoins techniques et le calendrier envisagé. J'écris aussi sur ce que j'apprends.",
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


// Intercalaires éditoriaux : compétences illustrées par les projets ci-dessus.
export const expertise = {
  title: 'React et TypeScript, côté projet',
  note: 'Feuille de prestations · partir de votre besoin, choisir les bons outils.',
  items: [
    {
      title: 'Créer une interface React',
      text: "Un espace de travail, une carte interactive, des formulaires : je développe le frontend de vos applications web, de l’intégration HTML et CSS aux composants TypeScript connectés à vos API. Les règles métier et les états de chargement font partie du travail, autant que l’écran final.",
      proof: 'Omega · outil métier en React',
      href: 'https://omega.safti.fr/',
    },
    {
      title: 'Structurer un site avec Next.js',
      text: "Pour un site dont le contenu doit être trouvé, l’architecture de rendu compte. J’interviens sur le rendu serveur, le cache, les parcours et le SEO technique. Sur SAFTI.fr, cette approche accompagne la refonte de l’architecture et la migration vers l’App Router.",
      proof: 'SAFTI.fr · Next.js et référencement',
      href: 'https://www.safti.fr/',
    },
    {
      title: 'Faire évoluer un frontend existant',
      text: "Une refonte ne demande pas toujours de tout réécrire. Je peux reprendre des templates, moderniser des composants et travailler sur les performances, les tests et l’accessibilité. Le projet ALS Action Canada illustre ce travail sur React et un CMS WordPress headless.",
      proof: 'ALS Action Canada · refonte de templates',
      href: 'https://www.alsactioncanada.org/',
    },
  ],
};

export const collaboration = {
  title: 'Du premier échange à la livraison',
  note: 'Fiche de préparation · cadrer le travail avant d’écrire le code.',
  intro: "Travailler avec un freelance, c’est échanger directement avec la personne qui développe. Je peux rejoindre votre équipe produit ou intervenir sur un périmètre frontend défini. Une agence garde son intérêt si votre projet demande plusieurs métiers à coordonner : le choix dépend du besoin, pas du statut.",
  steps: [
    { title: 'Comprendre le besoin', text: 'Décrivez les utilisateurs, le problème à résoudre et les contraintes. Une maquette, un site existant ou un accès au code permettent de rendre la discussion concrète.' },
    { title: 'Définir le périmètre', text: 'Les fonctionnalités, les dépendances avec le backend et les critères de validation servent de base à la proposition. Le budget, le calendrier et le mode de facturation se discutent à cette étape.' },
    { title: 'Développer et vérifier', text: 'Le travail avance par étapes à valider ensemble : interfaces, intégration des données et tests. Des retours réguliers permettent d’ajuster les priorités avant la livraison.' },
    { title: 'Préparer la suite', text: 'La livraison se prépare avec les vérifications et les éléments nécessaires à la reprise du code. Le déploiement et un éventuel accompagnement après livraison sont à préciser dans le périmètre de la mission.' },
  ],
};

export const questions = {
  title: 'Avant de lancer le projet',
  note: 'Questions de cadrage · budget, délais et collaboration.',
  items: [
    { question: 'Pourquoi faire appel à un développeur React freelance ?', answer: 'Pour renforcer une équipe ou confier une interface à un interlocuteur technique direct. Regardez surtout les réalisations, le rôle tenu sur chaque projet et la capacité à expliquer les choix. Mes projets ci-dessus permettent de situer mon expérience en développement frontend, SEO technique et outils métier.' },
    { question: 'Combien coûte un développeur React freelance à Toulouse ?', answer: 'Le coût dépend du périmètre, de l’état du code, des intégrations et du niveau d’accompagnement attendu. Un forfait correspond à un livrable bien défini ; une facturation au temps passé convient davantage à un périmètre évolutif. Le mode retenu et le tarif sont à convenir ensemble dans la proposition, après examen du besoin.' },
    { question: 'Quels projets développer avec React et Next.js ?', answer: 'React se prête aux interfaces interactives : tableaux de bord, espaces clients ou applications métier. Next.js ajoute notamment des possibilités de rendu serveur pour des sites riches en contenu. Une simple page de présentation ne justifie pas toujours cette stack : le contenu, les usages et les contraintes de maintenance guident le choix.' },
    { question: 'Combien de temps prend le développement d’une application React ?', answer: 'Le nombre d’écrans ne suffit pas à l’estimer. Les règles métier, la disponibilité des maquettes et des API, la migration de données et les validations influencent le délai. Un premier échange permet de repérer ces dépendances ; un calendrier réaliste demande ensuite un périmètre suffisamment précis.' },
    { question: 'Comment se déroule une collaboration avec un développeur freelance ?', answer: 'Nous commençons par le contexte et les besoins utilisateurs, puis le périmètre, les priorités et les critères de livraison. Le développement s’appuie sur des échanges et des validations intermédiaires. Pour une reprise de projet, partager la stack et les difficultés actuelles aide à préparer cette première discussion.' },
    { question: 'Peut-on travailler ensemble à distance ?', answer: 'Oui. Je suis basé à Toulouse et peux travailler avec des clients partout en France. Le partage des maquettes, du code et des retours permet de collaborer à distance. Les modalités d’échange et les éventuels rendez-vous sur place se définissent selon votre organisation et les besoins du projet.' },
  ],
};
