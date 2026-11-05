# Recherche : références pour la refonte de developpeur-web.tech

Recherche menée le 27/10/2026. Objectif : comprendre ce que font les meilleurs portfolios de développeurs et les studios WebGL, ce qui est déjà générique, et ce qui peut différencier un développeur frontend senior spécialisé en performance et SEO.

## 1. Méthode

### Sources explorées

| Galerie | Accès | Ce qui en a été tiré |
|---|---|---|
| Awwwards, catégories Portfolio et WebGL | pages chargées dans un navigateur, liens résolus fiche par fiche | 8 portfolios individuels listés en octobre 2026 |
| CSS Design Awards, galerie Portfolio | chargée ; la recherche par nom ne filtre pas (résultats génériques) | aucune fiche exploitable ; la récompense de Draw me a Sheep n'a pas pu être retrouvée |
| Godly | **redirige désormais vers recent.design**, devenu un fil de publications X/Twitter | aucune référence retenue |
| SiteInspire, catégorie Portfolio | chargée, 35 fiches listées | majorité de designers et d'architectes, hors cible ; aucune retenue |
| Brutalist Websites | chargée, plus de 2 500 liens | 1 site retenu (jonasersland.net) |
| Références connues du métier | visite directe | développeurs reconnus, studios WebGL, blogs techniques |

### Échantillon : 26 sites, en 3 groupes

| Groupe | Sites | Pourquoi |
|---|---|---|
| 1. Portfolios individuels récents (galeries 2026) + une référence historique | ntch.design, sebg.ch, mathiasadolfsson.dev, fabiantjoeaon.com, david-estrada.dev, urbik.eu, levigav.com, carterogunsola.com, bruno-simon.com | Ce que les jurys récompensent aujourd'hui |
| 2. Développeurs et designers-développeurs reconnus | lynnandtonic.com, joshwcomeau.com, rauno.me, cydstumpel.nl, aristidebenoist.com, robin-noguier.com, dennissnellenberg.com, emilkowal.ski, brittanychiang.com | Ce qui fonde la crédibilité d'un développeur sur la durée |
| 3. Studios WebGL, éditoriaux techniques, brutaliste | lusion.co, activetheory.net, igloo.inc, basement.studio, 14islands.com, blog.maximeheckel.com, antfu.me, jonasersland.net | Le plafond technique, et comment l'expertise se démontre dans le contenu |

### Ce qui a été réellement inspecté

Pour chaque site :

1. **Mesures automatisées** (Playwright 1.61, Chromium, desktop 1 440 px et mobile 390 px) : octets transférés par type, requêtes, scripts, contextes WebGL réellement créés (interception de `getContext`), Three.js exposé, Lenis, framework, polices chargées, LCP, CLS, titres, et rendu **avec JavaScript désactivé**.
2. **Captures** : haut de page et milieu en desktop et mobile, sans JS, défilement progressif à 0, 20, 45, 70 et 95 %, focus après 3 Tab, rendu avec `prefers-reduced-motion: reduce`.
3. **Lecture** des captures et, quand c'était utile, du HTML, des bundles JS, d'une page projet, d'un article ou d'un colophon de l'auteur.

Chaque fiche (`references/<site>.md`) sépare les **faits observés**, les **technologies confirmées** (mesurées ou documentées, avec la source) et les **hypothèses**, et précise son niveau d'inspection.

### Limites

- Mesures **sans bridage réseau ni CPU**, depuis la fibre : utiles pour comparer, pas pour prédire les Core Web Vitals réels.
- Le navigateur automatisé rend le WebGL en logiciel : plusieurs sites lourds restent sur leur écran de chargement ou s'affichent partiellement. Les fiches le signalent.
- Les canvas rendus dans un Web Worker (`OffscreenCanvas`) échappent à la détection WebGL (cas d'Active Theory et de David Estrada, confirmés par lecture du code).
- GSAP n'est détecté que s'il est exposé globalement ; bundlé, il échappe à la mesure.
- Plusieurs rendus 3D n'ont pas pu être vus en navigation automatisée : bruno-simon.com (seul le chargeur s'affiche), fabiantjoeaon.com (pas d'adaptateur WebGPU, seul le repli s'affiche), activetheory.net (son moteur refuse explicitement le rendu logiciel SwiftShader et affiche "Your browser is not supported"), igloo.inc (seule l'introduction est vue). Les fiches le précisent.
- Fenêtre de 6 s après `load` : les sites qui chargent leurs ressources plus tard (bruno-simon.com, dont l'agent a observé 12,5 Mo sur une session plus longue) sont sous-estimés.
- Une première version de ce document additionnait parfois des tailles décompressées ; les poids ont été remesurés avec les octets réellement transférés (voir § 2).

## 2. Mesures

Desktop, sans bridage. Poids = octets réellement transférés (corps compressés et en-têtes, mesurés par le navigateur) pour les requêtes terminées dans les 6 s suivant `load`, plus les médias en streaming comptés par leur `Content-Length`. "Texte sans JS" = nombre de caractères lisibles quand JavaScript est désactivé.

| Site | Total Ko | JS Ko | Média Ko | Req. | LCP desk/mob (ms) | CLS | WebGL | Three.js | Lenis | Texte sans JS |
|---|---|---|---|---|---|---|---|---|---|---|
| developpeur-web.tech (actuel) | 105 | 29 | 0 | 12 | 260/144 | 0,003 | - | - | - | 8 682 |
| 14islands.com | 24 357 | 1 080 | 22 304 | 77 | 3 224/752 | 0 | oui | r156 | oui | 1 387 |
| activetheory.net | 746 | 517 | 0 | 17 | 2 276/2 216 | 0 | worker | - | - | 24 |
| mathiasadolfsson.dev | 19 864 | 392 | 18 159 | 26 | 4 224/4 224 | 0 | oui | r185 | - | 65 |
| antfu.me | 888 | 264 | 0 | 55 | 948/580 | 0 | oui | - | - | 1 345 |
| basement.studio | 14 907 | 1 938 | 705 | 276 | 424/608 | 0 | oui | r180 | - | 2 626 |
| aristidebenoist.com | 3 850 | 22 | 0 | 36 | 2 732/2 256 | 0,034 | oui | - | - | 52 |
| bruno-simon.com | 2 141 | 1 167 | 0 | 24 | n/m | 0 | oui | r183 | - | 3 203 |
| brittanychiang.com | 2 912 | 308 | 0 | 39 | 1 192/1 316 | 0 | - | - | - | 4 322 |
| joshwcomeau.com | 937 | 295 | 0 | 96 | 912/532 | 0 | - | - | - | 6 046 |
| jonasersland.net | 475 | 414 | 0 | 7 | 1 276/908 | 0 | - | - | - | 46 |
| david-estrada.dev | 839 | 19 | 0 | 25 | 6 852/832 | 0,013 | worker | - | - | 5 510 |
| blog.maximeheckel.com | 1 457 | 587 | 0 | 38 | 564/672 | 0,002 | oui | r182 | - | 6 787 |
| igloo.inc | 12 366 | 421 | 0 | 82 | 580/536 | 0 | oui | r165 | - | 0 |
| emilkowal.ski | 2 030 | 917 | 0 | 50 | 252/264 | 0 | - | - | - | 996 |
| levigav.com | 3 122 | 667 | 0 | 50 | 3 548/1 996 | 0,016 | oui | r186 | oui | 13 909 |
| lusion.co | 25 274 | 522 | 13 727 | 112 | 432/6 504 | 0 | oui | r158 | - | 2 253 |
| lynnandtonic.com | 390 | 5 | 0 | 10 | 560/580 | 0 | - | - | - | 82 * |
| robin-noguier.com | 6 409 | 728 | 5 177 | 39 | 2 396/4 340 | 0 | oui | bundlé | - | 73 |
| ntch.design | 716 | 241 | 0 | 25 | n/m | 0 | oui | - | - | 2 625 |
| carterogunsola.com | 953 | 522 | 0 | 20 | 916/712 | 0,001 | oui | r185 | oui | 2 157 |
| rauno.me | 635 | 178 | 0 | 32 | 756/680 | 0 | - | - | - | 331 |
| sebg.ch | 1 973 | 231 | 1 172 | 30 | 1 272/4 908 | 0 | oui | r186 | oui | 1 796 |
| dennissnellenberg.com | 657 | 265 | 0 | 22 | 816/640 | **0,391** | - | - | - | 1 197 |
| cydstumpel.nl | 4 066 | 344 | 0 | 110 | 1 204/1 860 | 0,008 | - | - | oui | 3 259 |
| fabiantjoeaon.com | 2 288 | 560 | 0 | 15 | 1 316/2 172 | 0 | WebGPU | r186 | - | 0 |
| urbik.eu | **143 893** | 280 | 142 361 | 11 | 5 832/548 | 0 | oui | r186 | - | 2 200 |

\* lynnandtonic.com : l'accueil est un sommaire d'un écran, tout le contenu est bien dans le HTML (vérifié). n/m : non mesurable (l'élément principal est un canvas, ignoré par l'API LCP).

**Médianes des 26 références** : 2,1 Mo transférés, 403 Ko de JS, 34 requêtes, LCP desktop 1,07 s. **Avec WebGL détecté** (15 sites) : 3,9 Mo en médiane ; **sans** (11) : 0,8 Mo. Le site actuel de Johan (105 Ko, 29 Ko de JS) est 20 fois plus léger que la médiane.

## 3. Fiches résumées

Une ligne par référence ; le détail complet (structure, typographie, palette, grille, défilement, interactions, technologies, mobile, accessibilité, performance, idées) est dans `references/<site>.md`.

| Site | Positionnement | Technique clé confirmée | Idée transférable la plus forte | Défaut principal |
|---|---|---|---|---|
| ntch.design | Designer produit senior, identité rétro "dessin animé" | WebGL, contenu complet dans le HTML | Disponibilité affichée en permanence comme premier message | Rien de visible sans JS ; 40 projets à parcourir un par un |
| sebg.ch | Développeur salarié, "websites that move", mascotte guide | Astro + Three.js + Lenis | Un fil narratif qui commente la page ; une démo par étude de cas | Contenu invisible sans JS ; LCP mobile 4,9 s ; pas de mode réduit |
| mathiasadolfsson.dev | Ingénieur créatif indépendant, primé | Three.js, vidéos en textures (18 Mo) | Montrer les sites livrés en courte vidéo, mais en `<video>` natif à la demande | 27 Mo ; rien d'indexable ; SEO revendiqué mais absent |
| fabiantjoeaon.com | Directeur créatif et technique, WebGPU | WebGPU + Three.js r186, repli explicite | Le repli comme expérience de base (inversé : HTML d'abord) | Repli sans liens vers les projets ; 2 Mo de JS ; HTML vide |
| david-estrada.dev | Freelance web design orienté conversion | 3D dans un Web Worker (`OffscreenCanvas`), repli, mode réduit | Rendu 3D hors du fil principal pour préserver l'INP | Hero masqué jusqu'au chargement 3D : LCP desktop 6,9 s |
| urbik.eu | Développeur senior et DJ, motif génératif | WebGL sans framework | Onglets par audience (général, développeur, DJ) | 145 Mo de médias pour un développeur qui revendique la performance |
| levigav.com | Jeune designer-développeur, "éditions" du site | Next.js, 4 contextes WebGL, contenu traduit côté serveur | Choisir une "édition" du site ; raccourcis clavier affichés | Deux choix obligatoires avant de voir un projet ; 7 familles de polices |
| carterogunsola.com | Développeur créatif, juré Awwwards 2026 | Astro + Three.js ; **télémétrie FPS et LCP affichée en direct** | La page comme produit vivant : mesures, changelog, Lab daté | 1,3 Mo de JS pour une liste ; présence temps réel distrayante |
| bruno-simon.com | Référence historique : monde 3D à conduire | Three.js r183 + TSL (WebGL/WebGPU), Rapier, Howler, code MIT (documenté par l'auteur) | Page "Coulisses" exhaustive (stack, crédits, licences, code) et option de qualité basse | Aucun contenu sans JS ni GPU, pas de h1 |
| lynnandtonic.com | Designer CSS, site refait chaque année | 10 Ko de JS, `ResizeObserver` documenté | Archiver chaque version avec son étude de cas | Travail invisible depuis l'accueil |
| joshwcomeau.com | Blog pédagogique interactif | Next.js, MDX, Sandpack (documenté par l'auteur) | Article "comment est construit ce site" avec chiffres et compromis | 106 requêtes, préchargement massif |
| rauno.me | Design engineer, index typographique | Next.js + Framer Motion | Un h1 qui est une phrase complète de positionnement | Page blanche sans JS ; focus invisible |
| cydstumpel.nl | Créative, enseignante, accessibilité revendiquée | Animations CSS liées au défilement, View Transitions, vrai mode réduit | Informations datées en tête (disponibilité, prochaine conférence) | Page blanche sans JS malgré un HTML complet ; 10 h1 |
| aristidebenoist.com | Développeur motion très primé | WebGL brut sans bibliothèque en 69 Ko | Afficher le poids de la scène comme preuve de maîtrise | Rien sans JS ; défilement intercepté ; mobile sans projets |
| robin-noguier.com | Designer produit, slider WebGL drôle | Next.js 9 + Three.js + Web Workers | Couleur d'accent qui change selon le projet | LCP mobile 4,3 s ; écran noir sans JS |
| dennissnellenberg.com | Freelance, gabarit studio premium | jQuery + GSAP + Locomotive + Barba | Projets en lignes (nom, mission, année) plutôt qu'en grille | CLS 0,39 ; gabarit très copié ; aucun mode réduit |
| emilkowal.ski | Design engineer, bibliothèques open source | Next.js, page texte (LCP 252 ms) | Outils réutilisables présentés comme des projets | 5 Mo pour une page de texte ; pas de h1 |
| brittanychiang.com | Ingénieure frontend, CV interactif | Next.js + Tailwind (colophon) | Une preuve chiffrée par ligne d'expérience | Écran vide sans JS ; gabarit le plus cloné |
| lusion.co | Studio 3D, storytelling de marque premium | Astro + Three.js r158, un seul script ; 13,7 Mo de vidéo | Scène 3D contenue dans une carte de la grille, contenu en HTML statique | Défilement détourné, préchargeur bloquant, LCP mobile 6,5 s, focus invisible |
| activetheory.net | Studio interactif fondé en 2012 | Moteur propriétaire, rendu en worker, détection GPU | Un mode "sans WebGL" explicite, mais avec le contenu HTML autour | Exclusion totale sans GPU ; aucun lien crawlable |
| igloo.inc | Site de l'année Awwwards 2024 (studio Abeto) | Three.js, workers, compression et compilation de shaders en amont | Compiler shaders et textures avant le premier affichage | Aucun contenu sans WebGL, pas de h1 ; 17 Mo |
| basement.studio | Studio argentin, écosystème Next.js | Next.js + R3F, vue "Machine" + `llms.txt` | Une vue texte du portfolio générée au build + `llms.txt` | 33 Mo et 7,7 Mo de JS |
| 14islands.com | Agence design et technologie | Next.js + `r3f-scroll-rig` (leur bibliothèque) | WebGL posé sur un site HTML complet (fond réactif au pointeur ; les images restent des `<img>`, voir correction dans `technical-research.md` § 3.3) | 22 Mo de vidéo sur l'accueil |
| blog.maximeheckel.com | Blog technique shaders et rendu | Next.js + Three.js, démos dans les articles | Démos manipulables dans les articles (paramètres + rendu + code) | Titres révélés au défilement : lignes vides en aperçu |
| antfu.me | Développeur open source très connu | Statique, champ de points discret | Bloc factuel "Travaille sur / A créé / Écrit sur" | Focus invisible ; modèle fondé sur une notoriété préexistante |
| jonasersland.net | Artiste, galerie Brutalist Websites | Fond participatif (photos des visiteurs) | Tout dire en un écran de HTML (qui, quoi, clients, contact) | Dépend entièrement de JS alors qu'il tiendrait en 2 Ko de HTML |

## 4. Synthèse des tendances

### 4.1 Tendances visuelles récurrentes

- **Fond sombre et WebGL plein écran** : 15 sites sur 26 créent un contexte WebGL détecté, et au moins 3 autres rendent en worker ou en WebGPU (activetheory, estrada, tjoeaon) ; Three.js est exposé globalement sur 12 sites et embarqué dans le bundle d'au moins un autre (noguier).
- **Typographie de très grand corps** comme élément graphique principal, souvent en grotesque large ou condensée (Archivo, PP Neue Montreal, Oracle, "jws").
- **Écrans de chargement** à compteur (adolfsson, benoist, ogunsola, igloo) et **défilement lissé** (Lenis sur 5 sites, Locomotive sur 1).
- **Vocabulaire d'application** sur des sites vitrines : palette de commandes ⌘K, notifications, changelog, présence en temps réel (ogunsola, levigav).
- **Projets en liste typographique** plutôt qu'en grille de vignettes (snellenberg, ogunsola, rauno, heckel).

### 4.2 Ce qui paraît déjà générique ou surexploité

- La "photo détourée + nom en défilement + boutons magnétiques + curseur personnalisé" (gabarit type snellenberg).
- La "colonne gauche épinglée sur fond ardoise" (gabarit type chiang), très clonée.
- Le préchargeur à compteur, qui retarde délibérément le contenu.
- Le hero 3D abstrait (blob, sphère déformée) sans lien avec le propos.
- Le défilement lissé imposé.
- Les chiffres ronds non sourcés ("150+ clients"), que le site actuel de Johan utilise aussi.

### 4.3 Ce qui différencie réellement

- **Une idée unique poussée jusqu'au bout** : le site refait chaque année (lynnfisher), les éditions (levigav), le site participatif (ersland), le slider drôle (noguier).
- **Une preuve externe vérifiable** : bibliothèques utilisées par d'autres (kowalski, antfu), étoiles et installations (chiang), article qui documente la construction du site avec ses défauts (comeau, lynnfisher).
- **La légèreté assumée face à la norme** : 69 Ko de WebGL brut chez benoist ; 10 Ko de JS chez lynnfisher. Dans un échantillon où la médiane est de 2,1 Mo, un portfolio riche sous 250 Ko est en soi un signal.
- **La robustesse** : seuls 3 portfolios de développeurs sur 9 du groupe 2 restent lisibles sans JavaScript. Les sites qui mettent leur WebGL sur un HTML complet (14islands, basement, heckel) sont l'exception parmi les sites ambitieux.
- **La transparence technique** : seuls bruno-simon.com (page "Coulisses", code sous licence MIT) et david-estrada.dev (code du thème commenté) exposent leurs choix ; **aucune référence n'a de colophon chiffré sur la performance ou le SEO**.
- **L'accessibilité de base** : aucun site du groupe 3 ne propose de variante `prefers-reduced-motion` observable ni de lien d'évitement ; dans le groupe 1, un seul lien d'évitement existe, injecté par JavaScript (urbik.eu). Un focus visible, un lien d'évitement et un vrai mode réduit suffisent à se distinguer.
- **Le SEO comme démonstration** : basement.studio publie une vue texte de son site ("Machine") et un `llms.txt`. Générés au build depuis les mêmes contenus, ils coûtent presque rien et montrent directement la spécialité de Johan.

### 4.4 Patterns UX qui fonctionnent indépendamment des effets

1. Un **h1 qui dit qui, quoi et où** dès le premier écran (rauno, ersland, snellenberg).
2. Une **disponibilité datée** visible (ntch, stumpel, benoist, ogunsola).
3. Les **projets en lignes denses** : nom, contexte, rôle, année, lisibles en trois secondes et parfaits sur mobile.
4. Les **études de cas qui disent le problème et la décision**, pas seulement le résultat visuel (sebg, estrada).
5. Un **contact direct** (e-mail en clair) plutôt qu'une plateforme intermédiaire (estrada dépend d'Upwork).
6. Les **démos dans le contenu** là où le lecteur se pose la question (heckel, comeau).

### 4.5 Techniques créatives qui restent performantes sur mobile

- **Un shader de fragment plein écran sans bibliothèque** (benoist ; le prototype B en mesure 2,9 Ko compressés).
- **Le rendu dans un Web Worker** avec `OffscreenCanvas`, qui libère le fil principal (estrada, activetheory).
- **Les animations CSS liées au défilement et les View Transitions natives** (stumpel) : zéro JS, désactivables en mode réduit.
- **Le canvas unique partagé** qui redessine des images HTML existantes (principe de 14islands, sans leur bibliothèque).
- **La compilation des shaders et le décodage des textures avant affichage** (igloo) pour éviter les saccades.

### 4.6 Ce qui s'adapte à un portfolio de développeur plutôt qu'à un site d'agence

- Les sites d'agence (igloo, lusion, activetheory) reposent sur des équipes, des pipelines 3D et des dizaines de mégaoctets : **non transposables par un développeur seul**, et contraires au positionnement performance.
- Ce qui se transpose : la **discipline de chargement** des studios (workers, compilation en amont, détection de capacités), la **démonstration dans le contenu** des blogs techniques, et la **preuve vérifiable** des développeurs open source.
- Pour Johan, la matière existe : 69 articles, des projets à fort trafic, une compétence cartographique réelle (Omega) et une réalisation WebGL livrée (Draw me a Sheep). Le site doit la mettre en scène par la mesure et la démonstration.

## 5. Conclusions pour le projet

1. **Le différenciateur le plus solide est la cohérence entre le discours et la construction.** Un portfolio de spécialiste performance et SEO qui pèse quelques centaines de kilo-octets, se lit sans JavaScript et documente ses choix se distingue d'un échantillon où la médiane est de 2,1 Mo et où les deux tiers des portfolios de développeurs reconnus sont vides sans JS.
2. **Le WebGL a sa place s'il est léger, motivé et optionnel.** Un shader de quelques kilo-octets, lié au travail réel (cartographie), chargé après le contenu, avec un repli testé.
3. **La mesure en direct est une piste rare mais pas inédite** (carterogunsola.com l'utilise comme signal d'ambiance). Elle devient différenciante si elle est le principe d'organisation, expliquée et assortie de statuts "vérifié / à sourcer".
4. **Les études de cas doivent embarquer une démonstration** quand c'est possible (spécimen de dessin de zone pour Omega, scène pour Draw me a Sheep, mesures avant/après pour SAFTI.fr si les chiffres sont disponibles).
5. **À éviter** : préchargeur, défilement détourné, curseur personnalisé, contenu servi en `opacity: 0`, chiffres non sourcés.

Ces conclusions sont traduites en trois directions dans `directions.md`, en architecture dans `architecture.md` et en budget dans `performance-budget.md`.
