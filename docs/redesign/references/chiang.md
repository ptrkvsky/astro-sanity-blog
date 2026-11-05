# Brittany Chiang - https://brittanychiang.com/

## Type et positionnement
Portfolio-CV d'une "Frontend Engineer" (Senior Frontend Engineer, Accessibility chez Klaviyo, auparavant Lead Engineer chez Upstatement). Meta description : "builds accessible, inclusive products and digital experiences for the web". Le site fonctionne comme un CV interactif d'une page : About, Experience, Projects. Sa version précédente (v4, Gatsby) est open source et affichée sur la page avec 8 292 étoiles GitHub : c'est l'un des gabarits de portfolio développeur les plus clonés.

## Structure de la page d'accueil (sections dans l'ordre)
Deux colonnes en desktop :
- Colonne gauche fixe : nom (h1), "Frontend Engineer", accroche "I build accessible, pixel-perfect experiences for the web.", navigation de sections (About, Experience, Projects avec trait qui s'allonge sur l'élément actif), icônes sociales en bas (GitHub, LinkedIn, CodePen, Instagram, Goodreads).
- Colonne droite qui défile :
1. About : trois paragraphes (expertise, poste actuel, vie personnelle).
2. Experience : chronologie (période à gauche, poste · entreprise avec flèche externe, description, liens, pastilles de technos), puis "View Full Résumé".
3. Projects : vignette + titre + description + indicateur (étoiles, installations : "Halcyon Theme, 100k+ Installs", "Spotify Profile, 719 étoiles"), puis "View Full Project Archive".
4. Pied : écrits ("Building a Headless Mobile App CMS From Scratch"...), colophon ("Loosely designed in Figma and coded in Visual Studio Code by yours truly. Built with Next.js and Tailwind CSS, deployed with Vercel. All text is set in the Inter typeface."), "Click to time travel".

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Inter seule (JSON : `__inter_20b187`, police `next/font` ; colophon : "All text is set in the Inter typeface").
- Rôles : nom ~48 px gras (display modeste), titres de postes ~16 px medium, texte ~16 px, sur-titres en capitales espacées ~12 px, pastilles ~12 px.
- Pas de mono. Échelle compacte, hiérarchie portée par la couleur (blanc, slate-200, slate-400) plus que par la taille.

## Palette et direction artistique
Fond bleu nuit (rgb 15,23,42, slate-900 de Tailwind), texte gris-bleu (rgb 148,163,184), titres presque blancs, pastilles turquoise sur fond sombre. Halo radial bleu dans le coin haut gauche, qui suit le curseur selon le code (calque `pointer-events-none fixed inset-0 z-30`). Esthétique "dark mode développeur" sobre, très lisible, mais désormais familière.

## Composition, grille et rythme
Conteneur max ~1280 px, deux moitiés : gauche épinglée (`lg:sticky`), droite ~600 px de contenu. Lignes d'expérience en grille à 8 colonnes (2 pour la date, 6 pour le contenu). Grands espacements entre sections, rythme de liste homogène.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Natif (scrollY final 2832 sur 3881). La colonne gauche reste épinglée de s0 à s95. Dans les captures à 40 % et 70 % (défilement programmatique), l'indicateur de navigation reste sur "About" alors que la colonne droite montre Experience puis Projects : soit la mise à jour dépend d'un événement que la sonde ne déclenche pas, soit elle est en retard ; non concluant. En mobile, les titres de section deviennent des barres collantes floutées (capture mobile-mid : "EXPERIENCE" en haut avec `backdrop-blur`).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : halo radial en haut à gauche, trait de navigation actif plus long.
- Lu dans les classes du HTML, non vu en mouvement : au survol d'une ligne d'expérience ou de projet, les autres lignes passent à 50 % d'opacité et la ligne survolée reçoit un fond et une ombre (`group-hover/list:opacity-50`, `lg:group-hover:bg-slate-800/50`), avec `motion-reduce:transition-none` ; halo qui suit le curseur.

## Technologies
**Confirmé**
- Next.js Pages Router (JSON : next = true ; `pages/_app`, `pages/index`, `_ssgManifest` : génération statique), Tailwind CSS (classes utilitaires dans le HTML), Inter, Vercel : documentés dans le colophon du site.
- Google Analytics (gtag, JSON).
- Variantes `motion-reduce:` Tailwind présentes dans le HTML.
- Aucun canvas ni WebGL (JSON).
**Hypothèse**
- Le contenu (expériences, projets) est probablement en Markdown ou JSON local au build ; non vérifié.

## Mobile
Capture 390 px : une colonne ; nom, titre, accroche, icônes sociales en haut, puis "ABOUT" et les paragraphes. À mi-page, barre de section collante "EXPERIENCE" et chronologie empilée avec pastilles. Très propre et lisible.

## Accessibilité et robustesse
- Focus visible : oui, contour blanc net autour de "About" dans la navigation après 3 Tab.
- Lien d'évitement : présent ("Skip to Content", sonde : true).
- Sans JS : écran bleu vide (capture nojs) alors que 4322 caractères et 40 liens sont dans le HTML : le conteneur principal est servi avec `style="opacity:0"` et n'apparaît qu'après exécution du JS. Contradiction notable pour une ingénieure spécialisée en accessibilité.
- Reduced-motion : capture identique à la normale (le seul mouvement est au survol) ; prise en charge déclarée par `motion-reduce:transition-none`.
- SEO : un seul h1 (nom), 5 h2, meta description claire.

## Performance
Sans bridage, valeurs relatives :
- Desktop : 3,35 Mo transférés, JS 613 Ko, CSS 29 Ko, images 1,45 Mo (vignettes de projets), polices 1,18 Mo (surprenant pour une seule famille Inter) ; 40 requêtes, 5 hôtes.
- Mobile : 3,34 Mo, mêmes ordres de grandeur.
- LCP 1192 ms desktop, 1316 ms mobile ; CLS 0.

## Points forts UX
- Lecture recruteur optimale : rôle, entreprise, période, technos et liens au même endroit, sans clic.
- Navigation de section toujours visible en desktop.
- Preuves chiffrées sur les projets (étoiles, installations).
- Colophon honnête qui nomme la stack.
- Focus visible, lien d'évitement, h1 unique.

## Points faibles ou risques
- Gabarit si largement cloné que la mise en page évoque immédiatement "template", y compris pour d'autres développeurs.
- Page blanche sans JS malgré un HTML complet.
- 1,2 Mo de polices et 1,45 Mo d'images pour un CV texte.
- Peu de personnalité visuelle propre en dehors du halo.

## Idées transférables au portfolio de Johan sans copier
1. Une section "Expérience" à la structure stricte (période, rôle, entreprise, une phrase d'impact, technos) lisible en 30 secondes par un recruteur, mais avec un résultat mesuré par ligne (gain de LCP, trafic SEO, poids réduit).
2. Afficher sous chaque projet ou article un indicateur vérifiable (étoiles, installations, lecteurs, position Google) plutôt qu'un adjectif.
3. Un colophon en pied de page qui nomme la stack et donne le poids et le score de la page en cours, éventuellement calculé au build.
4. Rendre le contenu visible sans JS par défaut et réserver les effets (halo, estompage au survol) à l'amélioration progressive ; une différence facile à démontrer face à ce gabarit.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s70, focus, reduced. HTML de l'accueil par curl (colophon, classes Tailwind, style inline `opacity:0`, lien d'évitement). Pages "Full Résumé" et "Project Archive" non ouvertes.
