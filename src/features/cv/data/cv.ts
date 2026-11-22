import type {
  Achievement,
  Award,
  Experience,
  SelectedProject,
  SkillGroup,
} from './types';

export const cvSeo = {
  title: 'CV de Johan Petrikovsky, Lead Frontend React et Next.js',
  description:
    'Lead Frontend chez SAFTI : architecture Next.js, performance, SEO et qualité logicielle. Développeur de Draw Me A Sheep, Special Kudos CSSDA 2024.',
};

export const headline = {
  title: 'Lead Frontend Engineer',
  stack: 'React · Next.js · TypeScript',
  pdf: 'Lead Frontend chez SAFTI, je conçois et fais évoluer l’architecture frontend de plateformes immobilières à fort trafic, en React, Next.js et TypeScript.',
  web: 'De l’exigence du détail visuel à l’architecture des produits.',
};

export const keyFacts = [
  { value: '2012', label: 'Développeur web' },
  { value: '2024', label: 'Lead Frontend chez SAFTI' },
  { value: '12 → 16', label: 'Versions de Next.js portées en production' },
  { value: 'Special Kudos', label: 'CSS Design Awards 2024' },
];

export const pdfProfile = [
  'Chez SAFTI depuis 2021, lead depuis 2024 : architecture Next.js, performance, SEO technique et qualité logicielle de plateformes dont le trafic conditionne l’activité.',
  'Parcours commencé en 2012 par l’intégration et le PHP en freelance, puis React en équipe produit. Une double exigence : une interface juste au pixel près, un code qui tient dans la durée. Développeur de Draw Me A Sheep, site distingué par CSS Design Awards.',
];

export const summary = [
  'Lead Frontend chez SAFTI depuis 2024, après trois ans comme développeur frontend sur ses plateformes publiques. Je travaille sur l’architecture Next.js, la performance, le SEO technique et la qualité logicielle de sites dont le trafic conditionne l’activité.',
  'J’ai commencé en 2012 par l’intégration et le développement PHP en freelance, puis je suis passé par React en équipe produit avant de m’installer dans les architectures modernes. Je garde de ce parcours une double exigence : une interface juste au pixel près, et un code qui tient dans la durée.',
  'Mon travail créatif inclut le site du studio Draw Me A Sheep, distingué par CSS Design Awards (Special Kudos, 2024).',
];

export const passes = {
  craft: {
    label: 'Craft',
    text: 'Le trait : intégration, précision visuelle, développement créatif.',
  },
  engineering: {
    label: 'Engineering',
    text: 'La trame : architecture, React et Next.js, performance, tests.',
  },
  leadership: {
    label: 'Leadership',
    text: 'Le calage : décisions techniques, modernisation, transmission.',
  },
} as const;

export const experiences: Experience[] = [
  {
    status: 'declared',
    employer: 'SAFTI',
    role: 'Lead Frontend',
    contract: 'CDI',
    place: 'Toulouse',
    start: '2024',
    summary:
      'Architecture et modernisation des plateformes web du réseau immobilier : safti.fr, SAFTI Prestige, Join SAFTI, Bien Estimer, et un outil métier interne.',
    stack: 'React · Next.js · TypeScript · Tailwind · Vitest · Playwright',
  },
  {
    status: 'verified',
    source: 'Ancien CV, juillet 2021',
    employer: 'SAFTI',
    role: 'Développeur Frontend',
    contract: 'CDI',
    place: 'Toulouse',
    start: 'juillet 2021',
    end: '2024',
    summary:
      'Développement et maintenance des sites publics de SAFTI, premier réseau français de mandataires immobiliers.',
    stack: 'TypeScript · React · Redux · Tailwind',
  },
  {
    status: 'to-confirm',
    source: 'Ancien CV : « avril 2021 - aujourd’hui », fin non précisée',
    employer: 'ADS',
    role: 'Développeur Frontend',
    contract: 'CDI',
    place: 'Toulouse',
    start: 'avril 2021',
    summary:
      'Équipe agile : deux applications pour les professionnels de santé et un design system.',
    stack: 'TypeScript · React · Redux · Styled Components · Storybook',
  },
  {
    status: 'verified',
    source: 'Ancien CV',
    employer: 'Sigfox',
    role: 'Développeur Frontend',
    contract: 'Alternance',
    place: 'Toulouse',
    start: 'juillet 2020',
    end: 'mars 2021',
    summary:
      'Équipe agile : application de géolocalisation et de suivi d’assets pour de grands comptes.',
    stack: 'React · Redux · Styled Components',
  },
  {
    status: 'verified',
    source: 'Ancien CV',
    employer: 'Indépendant',
    role: 'Développeur web',
    contract: 'Freelance',
    place: 'Nice',
    start: 'septembre 2012',
    end: 'juillet 2020',
    summary:
      'Chiffrage, cahier des charges, développement, optimisation de la vitesse de chargement, formation des clients à leur back-office, pour des agences et des studios.',
    stack: 'PHP · MySQL · WordPress · PrestaShop · Magento',
  },
];

export const achievements: Achievement[] = [
  {
    status: 'verified',
    source: 'safti-public : historique git, montées Next 12.3 → 14 → 15',
    pass: 'engineering',
    title: 'Faire évoluer safti.fr sans rupture',
    context:
      'Une plateforme d’annonces dont l’activité dépend du référencement, en production depuis des années.',
    contribution:
      'Montées de version successives de Next.js et de React 19, migration progressive vers l’App Router, passage à ESLint 10.',
    impact: 'Une stack à jour, sans réécriture complète.',
  },
  {
    status: 'verified',
    source: 'safti-prestige : migration Next 16, cache handler, Lighthouse CI',
    pass: 'engineering',
    title: 'SAFTI Prestige : Next.js 16 et cache sur mesure',
    context:
      'Une plateforme bilingue d’immobilier d’exception, distincte de safti.fr.',
    contribution:
      'Migration vers Next.js 16, cache handler personnalisé et documenté, Lighthouse en intégration continue, stories Storybook et tests E2E Playwright.',
  },
  {
    status: 'verified',
    source: 'safti-public : Vitest, Danger, SonarQube, Stryker',
    pass: 'engineering',
    title: 'Industrialiser la qualité frontend',
    context: 'Des applications maintenues par plusieurs développeurs.',
    contribution:
      'Tests unitaires Vitest, seuils de couverture contrôlés en revue de code, analyse SonarQube des merge requests, mutation testing Stryker en cours d’adoption.',
  },
  {
    status: 'verified',
    source: 'ADR SSR → SSG, LCP accueil, JSON-LD annonces, sitemaps Join SAFTI',
    pass: 'engineering',
    title: 'La performance et le SEO comme décisions d’architecture',
    context:
      'Des sites à fort volume de pages où le rendu et l’indexation conditionnent le trafic.',
    contribution:
      'Décision documentée du passage SSR vers SSG, optimisation du LCP de l’accueil, stratégie d’images, données structurées sur les listes d’annonces, sitemaps et robots.txt par langue et par domaine.',
  },
  {
    status: 'verified',
    source: 'ADR et guides rédigés dans les dépôts, nig-ui',
    pass: 'leadership',
    title: 'Décider et transmettre',
    context: 'Une équipe qui doit partager des choix et des pratiques.',
    contribution:
      'Une dizaine de décisions d’architecture rédigées (ADR), des guides d’équipe sur les tests, le lint et le code mort, et la contribution principale à la bibliothèque de composants partagée.',
  },
];

export const award: Award = {
  status: 'verified',
  source: 'https://www.cssdesignawards.com/sites/draw-me-a-sheep/45991/',
  name: 'Special Kudos — CSS Design Awards, 2024',
  year: 2024,
  project: 'Draw Me A Sheep',
  role: 'Développeur (collaborateur crédité)',
  url: 'https://www.cssdesignawards.com/sites/draw-me-a-sheep/45991/',
};

export const selectedProjects: SelectedProject[] = [
  {
    status: 'verified',
    source: 'safti-public',
    slug: 'safti-public',
    title: 'SAFTI Public',
    role: 'Modernisation Next.js, SEO, qualité',
    summary:
      'Le site principal du réseau, minisites conseillers inclus : montées de version, App Router, tests, SEO technique.',
    url: 'https://www.safti.fr/',
  },
  {
    status: 'verified',
    source: 'safti-prestige',
    slug: 'safti-prestige',
    title: 'SAFTI Prestige',
    role: 'Next.js 16, cache, qualité',
    summary:
      'Plateforme d’immobilier d’exception, bilingue, avec une stratégie de cache dédiée.',
    url: 'https://www.safti-prestige.com/fr',
  },
  {
    status: 'declared',
    source: 'Portfolio actuel ; technologies exactes à confirmer',
    slug: 'draw-me-a-sheep',
    title: 'Draw Me A Sheep',
    role: 'Développeur',
    summary:
      'Site d’un studio de design graphique et de branding à Nice. Direction artistique de Melody Gautier ; fiche officielle taguée SVG et WebGL.',
    url: 'https://www.drawmeasheep.fr/',
  },
  {
    status: 'declared',
    source: 'Portfolio actuel',
    slug: 'omega',
    title: 'Omega',
    role: 'Lead frontend, outil métier',
    summary: 'Application métier interne en React et TypeScript.',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    domain: 'Frontend',
    skills: [
      { status: 'verified', label: 'React', level: 'expertise' },
      { status: 'verified', label: 'Next.js', level: 'expertise' },
      { status: 'verified', label: 'TypeScript', level: 'expertise' },
      { status: 'verified', label: 'Tailwind CSS', level: 'expertise' },
      { status: 'verified', label: 'Astro', level: 'pratique' },
      { status: 'verified', label: 'Gatsby', level: 'pratique' },
    ],
  },
  {
    domain: 'Architecture',
    skills: [
      { status: 'verified', label: 'SSR', level: 'expertise' },
      { status: 'verified', label: 'SSG', level: 'expertise' },
      { status: 'verified', label: 'ISR', level: 'expertise' },
      { status: 'verified', label: 'Cache Next.js', level: 'expertise' },
      { status: 'verified', label: 'ADR', level: 'expertise' },
      { status: 'verified', label: 'Design system', level: 'pratique' },
      { status: 'to-confirm', label: 'Server Actions', level: 'explore' },
    ],
  },
  {
    domain: 'Qualité',
    skills: [
      { status: 'verified', label: 'Vitest', level: 'expertise' },
      { status: 'verified', label: 'SonarQube', level: 'expertise' },
      { status: 'verified', label: 'ESLint', level: 'expertise' },
      { status: 'verified', label: 'Playwright', level: 'pratique' },
      { status: 'verified', label: 'Storybook', level: 'pratique' },
      { status: 'verified', label: 'Stryker', level: 'explore' },
    ],
  },
  {
    domain: 'Performance et SEO',
    skills: [
      { status: 'verified', label: 'Core Web Vitals', level: 'expertise' },
      { status: 'verified', label: 'Lighthouse CI', level: 'expertise' },
      { status: 'verified', label: 'Données structurées', level: 'expertise' },
      { status: 'verified', label: 'GA4', level: 'pratique' },
      { status: 'verified', label: 'GTM', level: 'pratique' },
      { status: 'to-confirm', label: 'Cloudflare', level: 'explore' },
    ],
  },
  {
    domain: 'Back-end et CMS',
    skills: [
      { status: 'verified', label: 'PHP', level: 'expertise' },
      { status: 'verified', label: 'WordPress', level: 'expertise' },
      { status: 'verified', label: 'Sanity', level: 'pratique' },
      { status: 'verified', label: 'Sulu', level: 'pratique' },
      { status: 'declared', label: 'Node.js', level: 'pratique' },
      { status: 'verified', label: 'PrestaShop', level: 'pratique' },
      { status: 'verified', label: 'Magento', level: 'pratique' },
      { status: 'to-confirm', label: 'Drupal', level: 'pratique' },
    ],
  },
  {
    domain: 'Développement créatif',
    skills: [
      { status: 'verified', label: 'SVG animé', level: 'expertise' },
      { status: 'verified', label: 'Animations CSS', level: 'expertise' },
      { status: 'declared', label: 'GSAP', level: 'pratique' },
      { status: 'declared', label: 'ScrollTrigger', level: 'pratique' },
      { status: 'declared', label: 'WebGL', level: 'pratique' },
    ],
  },
];

export const education = [
  {
    status: 'verified',
    source: 'Ancien CV',
    title: 'Titre concepteur développeur d’applications',
    school: 'AFPA, alternance',
    period: 'décembre 2019 - mars 2021',
    place: 'Toulouse',
  },
  {
    status: 'verified',
    source: 'Ancien CV',
    title: 'BTS Informatique de gestion',
    school: 'UFIP, alternance',
    period: 'septembre 2010 - juin 2012',
    place: 'Nice',
  },
] as const;
