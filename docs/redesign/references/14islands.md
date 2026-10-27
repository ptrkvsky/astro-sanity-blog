# 14islands - https://14islands.com/

## Type et positionnement
Agence design et technologie (Stockholm et Reykjavík, selon la meta description et le pied de page), "Creative partner - We craft digital products and brands". Positionnement premium, sobre, orienté produit et marque plutôt que démonstration 3D. Auteurs de la bibliothèque open source `r3f-scroll-rig`.

## Structure de la page d'accueil (sections dans l'ordre)
Observé (captures + h2/h3 extraits du HTML) :
1. En-tête : logo "14islands", Work / Services / Culture / Journal / AI, Contact à droite.
2. Héros typographique : "Creative partner / We craft digital products and brands" en petit, puis "Design & Technology" en très grand corps sur deux lignes décalées, "&" en gris.
3. Grand bloc média pleine largeur aux coins arrondis (vidéo ; dans la capture reduced on y voit un projet "Neko Health - Your health... Book a Scan").
4. Section "Intelligent Products from vis..." (h2 en lettres espacées, contenu non lu en entier).
5. Grille de projets en 2 colonnes : Cartier, Cogent, Multiply, Xtend Health, Metanova, Sweeply, Breakthrough Energy, Tally, Lesa, GOALS Game, Neko, United Nations... (20 projets en h2, puis 15 en h3), chacun "Nom - Secteur".
6. Blocs de transition texte court + lien ("We work closely with our clients... SERVICES ->", "Our team fosters... CULTURE ->").
7. Phrase de présentation en grand ("... with offices in Stockholm and Reykjavík.").
8. "Let's make something great together" + adresse mail géante.
Bandeau cookies en bas à droite pendant toute la visite (non accepté).

## Typographie
- JSON : `AftenScreen` (titres display : "Design & Technology", noms de projets, "Let's make something great together") et `BentonSans` (texte courant, petits libellés en capitales).
- Échelle : très forte opposition entre libellés en capitales 12-13 px et titres display d'environ 150 px ; noms de projets ~24 px avec secteur en gris clair.

## Palette et direction artistique
Fond gris très clair (~#f2f2f2), texte quasi noir (rgb 7,7,7), gris moyen pour l'esperluette et les secteurs. Couleur apportée uniquement par les visuels de projets. DA éditoriale, calme, "suédoise".

## Composition, grille et rythme
Grille 12 colonnes implicite : les petits textes démarrent systématiquement à la moitié de la page (colonne 7), les titres en pleine largeur, la grille de projets en 2 colonnes égales avec gouttière ~10 px et coins arrondis légers. Beaucoup de blanc vertical entre sections. Rythme régulier et prévisible.

## Comportement du défilement
Lissé : Lenis détecté (JSON) ; défilement document réel (scrollHeight 10 304 px desktop, scrollY final 8935). Les captures s20 à s95 montrent un défilement vertical classique sans épinglage ni horizontal. Mobile-mid montre une image de projet dont le bas se recompose en points (tramage), signe d'un effet WebGL appliqué à l'image pendant le défilement.

## Transitions et micro-interactions
Observé : effet de révélation tramée/pixelisée sur une image de projet (mobile-mid) ; adresse mail en bas tronquée ("hello@14isl") au moment de la capture, signe d'une animation d'apparition ou d'un défilement horizontal du texte (non tranché). Survols et transitions de page non observés.

## Technologies
**Confirmé**
- Next.js en Pages Router (JSON : `_next/static/chunks/pages/index-*.js`, `pages/_app-*.js`).
- Three.js r156 (JSON `__THREE__`), contextes webgl2 et webgl créés (JSON).
- Lenis (JSON).
- Sanity comme CMS (HTML : `preconnect` vers cdn.sanity.io, 277 occurrences).
- GTM / gtag (JSON).
- `@14islands/r3f-scroll-rig` est leur bibliothèque publique ; son README liste "14islands.com by 14islands" dans "In the wild" et décrit le principe : "Progressively enhance a React website with WebGL using @react-three/fiber and smooth scrolling", suivi des éléments DOM et dessin d'objets Three.js à leur place, Lenis "for accessible smooth scrolling", images responsives chargées depuis le DOM (https://unpkg.com/@14islands/r3f-scroll-rig@8.15.0/files/README.md). Lecture complémentaire citée par le README : "Progressive Enhancement with WebGL and React" (Medium 14islands, non ouvert).

**Hypothèse**
- Le tramage observé sur les images est un shader appliqué par le scroll-rig sur des `<img>` du DOM (les images existent en HTML, comme le montre la version sans JS).

## Mobile
Capture mobile : logo + "MENU", textes de présentation décalés vers la droite, "Design & Technology" ramené sur deux lignes à ~50 px, puis un bloc vidéo noir avec un visuel de projet ("now form is abstract shape"). Mobile-mid : grille de projets passée en une colonne, très lisible. LCP mobile meilleur que desktop (752 ms contre 3224 ms).

## Accessibilité et robustesse
- Focus : après 3 Tab, lien "SERVICES" avec `outline: auto 1px` ; la capture focus montre un cadre noir net autour du lien. Focus visible, natif.
- Lien d'évitement : non.
- Sans JavaScript : la page s'affiche (capture nojs : logo, "Design & Technology", bloc média gris) mais délavée, comme couverte d'un voile semi-transparent ; JSON noJs : h1 présent, 1387 caractères, 57 liens. Le contenu est donc servi en HTML (SSG).
- Reduced motion : la capture reduced montre le bloc média avec une image fixe de projet (Neko Health) alors que la capture normale au même moment montre un rectangle noir ; probable chargement d'une image à la place de la vidéo, ou simple différence de timing (non tranché).
- Le h1 extrait est "Design Technology &" : l'ordre des mots dans le DOM ne suit pas l'ordre visuel, petit défaut pour les lecteurs d'écran et l'extrait SEO.

## Performance
Chiffres JSON (non bridé) : 27,3 Mo desktop / 23,9 Mo mobile, dont 22,3 Mo de vidéo (19,4 Mo mobile), JS 3,6 Mo, images 0,6 Mo desktop / 0,2 Mo mobile ; 89 requêtes, 5 hôtes ; LCP 3224 ms desktop / 752 ms mobile ; CLS 0. Le poids vient presque entièrement des vidéos de projets, pas de la 3D.

## Points forts UX
- Le WebGL est une couche d'amélioration sur un site HTML complet : navigable sans JS, référençable, focus natif.
- Hiérarchie typographique très claire avec seulement deux familles.
- Défilement lissé mais document réel (ancres, barre de défilement, restauration de position).
- Grille de projets dense en 2 colonnes : on voit beaucoup de travaux vite.

## Points faibles ou risques
- 22 Mo de vidéo chargés sur la page d'accueil, mobile compris.
- LCP desktop à 3,2 s même sans bridage.
- Bandeau cookies qui recouvre une partie des visuels en bas à droite.
- h1 dont l'ordre DOM diffère de l'ordre visuel.

## Idées transférables au portfolio de Johan sans copier
1. Le principe du scroll-rig sans la bibliothèque : des `<img>` normales dans le HTML Astro, et un seul canvas fixe qui redessine certaines images avec un shader (tramage, déformation) quand WebGL est disponible. Sans WebGL ou en reduced-motion, les images restent simplement affichées.
2. Un seul canvas global partagé par toute la page plutôt qu'un canvas par effet : moins de contextes, moins de mémoire, comportement plus prévisible.
3. Héros purement typographique (deux familles, un mot en gris) : coût de rendu nul, très bon LCP, et réutilisable comme signature.
4. Remplacer les vidéos de projets par des posters + lecture au survol ou à l'entrée dans le viewport pour éviter le défaut principal mesuré ici.

## Niveau d'inspection
Consulté : JSON ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe (s20, s45, s70, s95, focus, reduced ouverts ; s0 non ouvert) ; HTML source (curl, extraction des h1-h3) ; README de r3f-scroll-rig sur unpkg ; résultats de recherche (article Codrops "Progressively Enhanced WebGL Lens Refraction" repéré mais bloqué en 403, non lu). Non vu : pages internes, survols, comportement exact du héros vidéo.
