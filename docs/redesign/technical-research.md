# Investigation technique des références (mission 2.1)

Travail mené le 27/10/2026, sur la branche `docs/redesign`. Objectif : comprendre **comment** fonctionnent les interactions les plus intéressantes des références, et vérifier par des micro-prototypes (`experiments/`) ce qu'elles coûteraient sur ce portfolio, avant toute implémentation.

Ce document distingue partout trois niveaux de preuve :

- **observé** : vu dans une capture, mesuré dans le navigateur ou lu dans un fichier exporté (source citée) ;
- **lu dans le code** : extrait du JavaScript ou du CSS servi par le site, donc fiable sur l'intention, mais pas forcément sur le comportement réel ;
- **hypothèse** : déduction non vérifiée, signalée comme telle.

## 1. Point de départ

### 1.1 Ce qui est acquis de la phase 2

- **Direction** : trois directions ont été proposées dans `directions.md` (A Marges 22 points, B Relief 19, C Banc d'essai 23). **Aucune n'est validée.** Ce travail privilégie C, comme convenu, et choisit des mécanismes qui restent utilisables en A ou B.
- **Principes non négociables** (`architecture.md` § 8 et `performance-budget.md` § 4) :
  - tout le contenu est dans le HTML ;
  - aucun élément n'est servi en `opacity: 0` ;
  - le défilement reste natif ;
  - les effets sont chargés après le contenu, avec un repli.
- **Budget** (`performance-budget.md` § 2) :
  - 0 Ko de JS nécessaire au premier écran ;
  - au plus 15 Ko compressés de JS d'amélioration ;
  - au plus 10 Ko pour la couche créative ;
  - au plus 200 Ko au total.

### 1.2 Questions techniques restées ouvertes

1. Les transitions entre pages demandent-elles un routeur JavaScript (comme `ClientRouter` d'Astro), ou le natif suffit-il ?
2. Les animations au défilement doivent-elles passer par GSAP (déjà dans `package.json`), ou le CSS natif suffit-il ?
3. Peut-on avoir un effet d'image "WebGL" sans dégrader le contenu ni le LCP ?
4. Le shader de relief coûte-t-il trop sur le fil principal, en particulier sur mobile ? Faut-il un worker ?
5. Comment réussir un vrai mode `prefers-reduced-motion` et un vrai repli sans WebGL ?

## 2. Méthode et outils

### 2.1 Ce que REA permet réellement

REA ("Reverse Engineer Anything", https://github.com/morluto/rea, CLI `rea-agents` 6.8.0) a été utilisé en mode ponctuel (`npx rea ...`), sans modifier la configuration de Claude Code. Documentation lue : `browser-observation.md`, `browser-scenario-contract.md` et `website-script-export.md`.

| Capacité REA pour un site web | Utilisée | Ce qu'elle a apporté |
|---|---|---|
| `list-browser-targets` | oui | Liste des onglets d'un Chrome lancé avec `--remote-debugging-port` |
| `inspect-web-page --include-script-sources --include-accessibility-text` | oui, 5 sites | Inventaire passif : nombre de nœuds DOM et d'accessibilité, scripts avec source et empreinte SHA-256, ressources par type, workers, console |
| `observe-web-session` (pendant le défilement) | essayée | Échec sur cydstumpel.nl : `Performance.enable` a dépassé le délai de 20 s pendant que la page défilait. Relancée avec `--command-timeout-ms 60000` |
| `export-web-scripts` | oui, 5 sites | Écrit les scripts capturés sur disque : c'est ce qui a permis de **lire** les shaders, le tramage de sebg et le code d'inclinaison d'Estrada |
| `analyze-javascript-application` | essayée sur sebg | Graphe statique de 150 Mo orienté applications Electron (IPC, preload). Peu utile pour comprendre des animations |

**Ce que REA ne fait pas, et comment on l'a compensé.**

- **Pas de pilotage.** REA s'attache à un onglet existant, sans naviguer, défiler, survoler ni émuler. Les interactions ont donc été pilotées par Playwright 1.61, connecté au même Chrome par CDP, avec des scripts dans le scratchpad de la session.
- **Pas d'observation du chargement.** REA ne liste pas `about:blank`, il faut donc s'attacher après la navigation : la phase de chargement lui échappe (`prior_activity_available: false`). Les poids de chargement viennent de la phase 2.
- **Pas de source des workers.** Ils sont inventoriés (1 worker vu sur david-estrada.dev), mais leur source n'est pas exportée : le code 3D d'Estrada n'a pas été lu.
- **Pas de CSS.** Il n'est pas exporté par REA : les feuilles de style ont été récupérées par Playwright (événement `response`).
- **Pas de shaders en tant que tels.** On ne les trouve que s'ils figurent en chaînes de caractères dans les scripts exportés.

**REA ne restitue jamais le code source original ni l'architecture interne complète** : on lit des bundles minifiés. Toutes les "lectures dans le code" ci-dessous portent sur ces bundles.

### 2.2 Protocole par site

1. Navigation à 1 440 x 900, attente de 6 s, inspection REA, export des scripts.
2. Défilement par paliers de 10 %, puis 8 crans de molette. Relevé de `document.getAnimations()` (type, nom, timeline, durée, courbe, plage, propriétés animées), des frames longues (LoAF) et du CLS.
3. Tab x 3 pour relever le style de focus, rechargement avec `reducedMotion: 'reduce'`, rechargement à 390 x 844.
4. Seconde sonde ciblée par site : séquences d'images prises pendant une interaction (navigation, révélation, molette), valeurs CSS échantillonnées dans le temps.

### 2.3 Limites de cette investigation

- **Captures** : `page.screenshot` de Playwright attend les polices et a expiré sur toutes les pages dans ce Chrome attaché. Les captures ont été faites par `Page.captureScreenshot` (CDP), qui prend 150 à 200 ms à 1 440 px : les séquences montrent quelques états intermédiaires, pas toutes les images.
- **WebGL** : le rendu est logiciel (SwiftShader). Les temps GPU ne sont pas représentatifs et le coût de WebGL sur le fil principal est surestimé.
- **Appareil** : aucune mesure sur appareil réel, ni sous bridage réseau.
- **Headless** : certaines animations s'y comportent mal (titres brouillés figés sur blog.maximeheckel.com, voir § 3.5). Ces cas sont signalés.

## 3. Les cinq références étudiées

Choisies parmi les 26 de la phase 2 pour les **mécanismes** qu'elles permettent de comprendre. Écartées de l'approfondissement :

- lusion.co, robin-noguier.com, aristidebenoist.com : défilement détourné ou site mobile séparé, que nous n'adopterons pas ;
- igloo.inc, activetheory.net : refusent le rendu logiciel, donc inobservables ici.

| Site | Mécanisme étudié | Intérêt pour le portfolio |
|---|---|---|
| cydstumpel.nl | Animations CSS pilotées par le défilement, typographie variable animée, View Transitions, mode réduit | Socle sans JS pour A et C |
| david-estrada.dev | Titre épinglé, inclinaison selon la vitesse, 3D dans un worker | Effet de section léger ; rendu hors du fil principal pour le spécimen |
| 14islands.com | WebGL posé sur un site HTML complet | Vérifier l'hypothèse de phase 2 "images redessinées par shader" |
| sebg.ch | Astro + `ClientRouter`, tramage des images, GSAP + Lenis | Cas Astro direct, et effet d'image signature |
| blog.maximeheckel.com | Démos manipulables dans les articles, titres révélés en "scramble" | Modèle des spécimens de C, et contre-exemple |

### 3.1 cydstumpel.nl - le CSS natif poussé loin

**Inventaire (REA, observé).**
- 2 400 nœuds DOM, 881 nœuds d'accessibilité.
- 5 scripts (433 Ko non compressés), dans lesquels on trouve Swup 101 fois, GSAP 65 fois, Lenis 27 fois et `startViewTransition` 3 fois.
- 43 ressources : 17 images, 16 feuilles de style, 6 polices.
- CSS récupéré : `main.css` (212 Ko) et `view-transitions.css` (9 Ko).

**Interaction 1 : titre en police variable piloté par le défilement.**

| Grille | Constat |
|---|---|
| État initial | Axe `ytuc` (hauteur des capitales) à 80 (**observé**, `getComputedStyle`) |
| Déclencheur | Défilement natif. Animation `vf-size-title`, `animation-timeline: --page-title`, `animation-range: entry 100lvh entry 115lvh` (**lu dans le CSS**) |
| Intermédiaire et final | Axe à 0 dès 450 px de défilement, puis stable (**observé** à 0, 450, 900 et 1 350 px) |
| Paramètres | Linéaire, sur une plage de 15 % de la hauteur d'écran, `fill-mode: both` |
| Viewport | Même mécanisme en mobile (70 animations relevées à 390 px) |
| Dépendances | Aucune : CSS seul, sous `@supports` (25 occurrences) |
| Clavier, mouvement réduit | En `reduce`, l'animation devient `vf-size` avec l'axe figé à 100 (**observé**). 33 blocs `no-preference` encadrent les animations (**lu**) |
| Mobile | Rien de bloquant observé |

**Interaction 2 : navigation entre pages.**

| Grille | Constat |
|---|---|
| Déclencheur | Clic sur "Blogs". Swup intercepte la navigation et appelle `document.startViewTransition` (**lu** et **observé** : la transition est interceptée et mesurée) |
| États | À 458 ms, ancienne page estompée et nouvelle page en transparence ; à 758 ms, titre et cartes en place ; l'icône "boîte" de l'en-tête suit (`view-transition-name: header-box`) (**observé**, séquence d'images) |
| Durée | `finished` atteint en **1 737 ms**, chargement de la page compris (**observé**) |
| Mécanique | 45 règles `::view-transition-*` dans le CSS, avec des noms par élément (`page-title`, `header-box`, `footer`, vignettes de projets) (**lu**) |
| Clavier | Focus après 3 Tab sur le bouton "Copy email" : `outline: none` (**observé**). Le focus est peut-être stylé autrement (hypothèse) ; il n'a pas été vérifié visuellement |

**Défauts relevés.**
- 10 `h1` sur l'accueil (**observé**).
- 4 LoAF pendant le défilement (max 185 ms, sans bridage), CLS de 0,038 (**observé**).
- Lenis est actif, mais la molette déplace bien le document (scrollY 3 199 après 8 crans) : le lissage n'empêche pas le défilement programmé ici.

**À retenir.** L'animation pilotée par le défilement et la typographie variable animée tiennent en CSS, avec un vrai mode réduit. La transition de page passe par une bibliothèque (Swup), alors que la version native entre documents existe désormais : nous l'avons testée (prototype 01).

### 3.2 david-estrada.dev - inclinaison selon la vitesse et 3D en worker

**Inventaire (REA, observé).**
- 1 908 nœuds DOM, 1 423 nœuds d'accessibilité.
- 6 scripts (63 Ko non compressés), **1 worker** inventorié (`feature3d.worker.bundle.js`, chargé 156 ms après la navigation selon la Resource Timing API).
- 14 canvas sur la page, aucun contexte WebGL sur le fil principal.

**Interaction : affiches qui passent sur le titre "Selected work".**

| Grille | Constat |
|---|---|
| État initial | Titre "Selected work" épinglé, affiches de projets en colonne (**observé**) |
| Déclencheur | Défilement. Une boucle `requestAnimationFrame` ne tourne que si la section est visible (`IntersectionObserver`) et l'onglet affiché (**lu** dans `main.js`) |
| Calcul | `speed = Δscroll / dt / hauteur d'écran`, cible = `clamp(speed x 0,55, -1, 1)`, puis un ressort : `leanV += ((cible - lean) x 60 - leanV x 12) x dt`. Résultat écrit dans `--v` (**lu**). Toutes les mesures (`getBoundingClientRect`) sont lues avant toute écriture, pour éviter les recalculs de mise en page en cascade (commentaire de l'auteur) |
| Intermédiaire et final | Pendant 8 crans rapides, `--v` monte jusqu'à **0,26**, puis revient à 0 environ **450 ms** après l'arrêt. `--p` (dérive verticale par affiche) varie de -48 à +82 px (**observé**, 30 échantillons) |
| Viewport | Mobile : mêmes canvas (14), titre et affiches empilés |
| Clavier, mouvement réduit | Focus visible (`outline: 2px solid`) (**observé**). En `reduce`, une seule animation subsiste (`fade-up`), contre 14 normalement (**observé**). `prefers-reduced-motion` est lu dans 6 branches au moins (phase 2, **lu**) |
| Mobile | Non mesuré sur appareil |

**Coût observé.** 29 LoAF pendant le défilement, pour un total de 6 s et un **maximum de 1 985 ms** (sans bridage CPU). La cause n'est pas établie. Deux pistes, toutes deux des hypothèses :
- le rendu logiciel du worker 3D ;
- les 14 canvas 2D redessinés sur le fil principal à partir d'`ImageBitmap`.

Ce coût montre qu'un worker ne suffit pas si le fil principal redessine quand même.

**À retenir.** L'inclinaison selon la vitesse est un effet discret, à fort caractère, qui ne demande que quelques lignes de JS et une variable CSS. Le rendu en worker est la bonne architecture pour une scène 3D, à condition que le fil principal ne fasse rien d'autre que relayer.

### 3.3 14islands.com - correction d'une hypothèse de phase 2

**Inventaire (REA, observé).**
- 1 172 nœuds DOM.
- 25 scripts (3,3 Mo non compressés) : Three.js r156, Lenis, `r3f-scroll-rig`.
- 1 canvas de 1 425 x 900.

**Ce qui a été vérifié.**
- Les `<img>` des projets restent **visibles** (`opacity: 1`, `visibility: visible`) pendant tout le défilement (**observé**, 8 images). Le WebGL ne les remplace donc pas.
- Le shader trouvé dans `400-*.js` est un **dégradé d'accueil réactif au pointeur** : uniformes `uMouse`, `uVelocity`, `uCursorRadius` et `uCursorStrength`, palette en cosinus (**lu**). Les 37 occurrences de "dither" viennent du `#include <dithering_pars_fragment>` de Three.js.
- Le titre "Intelligent Products from vision to launch" apparaît mot par mot, par des transitions d'opacité de 1 200 ms (**observé**, séquence d'images). Les relevés montrent des délais échelonnés : 1 550, 1 600, ... 1 850 ms, soit 50 ms d'écart.
- À 80 % du défilement, la capture est vide : le contenu attend son déclencheur (**observé**).

**Correction.** La phase 2 (`references/14islands.md`) supposait que le tramage vu sur une image mobile venait d'un shader appliqué aux `<img>` par `r3f-scroll-rig`. Sur l'accueil inspecté le 27/10, ce n'est pas le cas : les images sont des `<img>` normales, et le WebGL est un fond d'accueil. Le scroll-rig peut servir sur d'autres pages ; ce n'est pas vérifié.

**Enseignement structurel (hypothèse étayée).** Le README de `r3f-scroll-rig` associe la bibliothèque à Lenis. Un canvas WebGL plein écran qui redessine des éléments du DOM doit connaître leur position **à chaque image**. Avec le défilement natif, qui tourne sur le fil du compositeur, le DOM bouge avant que le JavaScript ne redessine : le canvas a une image de retard. Le défilement lissé en JavaScript sert donc aussi à synchroniser WebGL et DOM. Comme nous refusons le défilement détourné, **tout effet WebGL sur image doit être dessiné dans la boîte de l'image** (un canvas par image, positionné dans le flux), pas dans un canvas plein écran partagé. C'est le choix du prototype 03.

### 3.4 sebg.ch - Astro, transition de page et tramage

**Inventaire (REA, observé).**
- Astro 5.18.2.
- 12 scripts, dont `ClientRouter.astro_*.js` (13 Ko), `dither.*.js` (24 Ko), `ScrollTrigger.*.js` (44 Ko), `SplitText.*.js` (7 Ko) et `Mascot.astro_*.js` (597 Ko avec Three.js r186).
- 2 canvas sur desktop, 26 sur mobile.

**Interaction 1 : révélation tramée des images (lue intégralement).**

| Grille | Constat (**lu** dans `dither.BN2G_tIV.js`, sauf mention contraire) |
|---|---|
| Technique | **Canvas 2D, pas WebGL.** Un canvas par image, `image-rendering: pixelated`, retiré à la fin |
| Paramètres | Point de 2 px CSS (sur mobile, 4/3 px physique arrondi). Matrice de Bayer 4x4 `[0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5] / 16`. Luminance Rec. 709 (0,2126 / 0,7152 / 0,0722) calculée une fois par `drawImage` + `getImageData` |
| Déclencheur | ScrollTrigger `start: "top 88%"`, `once: true`, après `img.decode()` |
| Phases | GSAP : `develop` 0 -> 1 en 0,6 s (`power1.in`), puis l'image réapparaît, puis `resolve` 0 -> 1 en 0,7 s (`power1.out`). Front de révélation : `(bruit + ligne / lignes) / 2`, d'où une apparition du haut vers le bas avec un bord irrégulier |
| Mouvement réduit | Toute la fonction est sautée si `prefers-reduced-motion: reduce` |
| Défaut | L'image reçoit `opacity: 0` **dès l'initialisation du script**, pour toutes les images `[data-dither]` de la page, avant que le déclencheur ne soit atteint. Si le script s'arrête entre les deux, les images restent invisibles (risque **déduit du code**, non provoqué) |
| Observé | 10 canvas restants après une révélation sur l'accueil (**observé**) : d'autres effets (couvertures de projets) gardent leur canvas en place |

**Interaction 2 : transition de page Astro.**

| Grille | Constat |
|---|---|
| Déclencheur | Clic sur la vignette "Jaeger-LeCoultre" |
| États | À 837 ms, l'ancienne page est découpée par une forme qui révèle la nouvelle. La nouvelle image arrive en tramage "develop", résolue vers 1 440 ms (**observé**, séquence) |
| Mesure | `astro:after-swap` à **778 ms** après le clic, View Transition active, noms `root` et `mascot` (**observé**) |
| Dépendances | `ClientRouter` (13 Ko non compressés) + Lenis 1.3.25 (`lerp: 0.1`, et `lerp: 1` en mouvement réduit) + GSAP ticker (**lu**) |
| Clavier | Focus par défaut (`outline: auto 1px`) (**observé**) |

**À retenir.**
- Le tramage le plus réussi de l'échantillon est du Canvas 2D de quelques centaines de lignes : il ne justifie pas WebGL.
- Le `ClientRouter` d'Astro permet de chorégraphier une transition avec JavaScript (ici, tramage plus mascotte persistante), au prix d'un routeur client et de la gestion de l'état entre pages.
- Pour un portfolio de pages statiques, la transition native entre documents donne l'essentiel (déplacement d'éléments nommés) sans routeur.

### 3.5 blog.maximeheckel.com - démos d'article et contre-exemple

**Inventaire (REA, observé).** 949 nœuds DOM, 25 scripts (1,8 Mo non compressés), Three.js r182, aucun Lenis.

**Interaction 1 : démo d'article ("Shading motion").**
- 8 curseurs `input type=range`, 8 canvas et 32 blocs de code dans l'article (**observé**).
- Le curseur "Threshold" se pilote au clavier : 10 flèches le font passer de 0,08 à 0,18, et le rendu change (**observé**, captures avant et après).
- Les curseurs ont pour nom accessible un identifiant généré (`base-ui-_R_35dd...`) au lieu d'un libellé (**observé**). Un lecteur d'écran n'annonce pas ce qu'ils règlent.

**Interaction 2 : titres de l'index en "scramble".**
- Le `textContent` contient deux copies : le vrai titre et la version brouillée ("On Shaping Light]$ zWo.") (**observé**). Le texte réel reste donc dans le DOM pour l'accessibilité et le SEO.
- En headless, la version brouillée est restée **figée plus de 2,6 s** (8 relevés) (**observé**). Cause non établie : peut-être une boucle ralentie en headless (hypothèse). Pour le visiteur concerné, les titres sont illisibles à l'écran.
- En mouvement réduit, aucune animation n'est relevée sur l'index (**observé**).

**À retenir.** Le format "démo manipulable + code + explication" est le bon modèle pour les spécimens de C, à condition d'étiqueter les commandes. Le brouillage de texte est un effet à éviter : quand il échoue, il rend le contenu illisible.

## 4. Décomposition des mécanismes et comparaison des approches

Légende : **++** très favorable, **+** favorable, **=** neutre, **-** défavorable, **--** très défavorable. Les cellules s'appuient sur les mesures des prototypes quand elles existent (renvoi entre crochets).

### 4.1 Transition entre une liste de projets et une étude de cas

Fonctionnement : le navigateur prend une capture de l'ancienne page et de chaque élément nommé, affiche la nouvelle page, puis anime chaque paire de même nom (position, taille). Le reste de la page passe en fondu.

| Critère | CSS natif (`@view-transition`) [01] | `ClientRouter` d'Astro | Swup ou Barba | GSAP + routeur maison |
|---|---|---|---|---|
| Fidélité au comportement observé | + : déplacement et fondu ; pas de chorégraphie scriptée | ++ : tout est possible (sebg) | ++ | ++ |
| Complexité | ++ : 1 règle et des noms | + | = | -- |
| Coût CPU et GPU | ++ : géré par le navigateur | + | + | = |
| Poids JS | ++ : 0 Ko [01] | = : routeur client (13 Ko non compressés chez sebg) | - | -- |
| Mobile | ++ : 439 ms mesurées à 390 px [01] | + | + | = |
| Accessibilité | ++ : désactivée en mouvement réduit par une règle ; vraie navigation | + : gestion du focus et des annonces à vérifier | = | - |
| Maintenance | ++ | + | = | -- |
| Compatibilité Astro | ++ : pages statiques prérendues | ++ : natif Astro | = | - |
| SEO et Core Web Vitals | ++ : vraies pages, aucun JS ajouté | + : vraies URL, mais JS d'hydratation | = | - |

**Recommandation : CSS natif entre documents.** Avec `prerender` par règles de spéculation au survol, et `ClientRouter` en réserve si une chorégraphie l'exige un jour. Sans support (Firefox à la date du test), la navigation est classique et sans perte.

### 4.2 Animations pilotées par le défilement (entrée de planches, titre épinglé, progression)

Fonctionnement : chaque animation a pour horloge la position de défilement (`scroll()`) ou la traversée de l'écran par un élément (`view()`), au lieu du temps. Le navigateur calcule la progression à chaque image.

| Critère | CSS `animation-timeline` [02] | GSAP ScrollTrigger [02] | JS natif (`IntersectionObserver` + `requestAnimationFrame`) |
|---|---|---|---|
| Fidélité | ++ : valeurs identiques à GSAP à ±0,01 aux mêmes positions [02] | ++ | + |
| Complexité | + : syntaxe récente (plages `entry`, `cover`, `contain`) | + : API connue | - |
| CPU (45 crans, CPU x4, sans inclinaison) | ++ : 7 ms de script, 114 ms de tâches [02] | + : 28 ms de script, 120 ms de tâches [02] | = (non mesuré) |
| Poids | ++ : 1,2 Ko de CSS | -- : **45,9 Ko gzip** de bibliothèque, soit 3 fois le budget de JS d'amélioration | + : quelques Ko |
| Mobile | + : mêmes animations | + | + |
| Accessibilité | ++ : `@media (prefers-reduced-motion: no-preference)` suffit [02] | + : `gsap.matchMedia()` [02] | + |
| Maintenance | ++ : déclaratif, à côté du style | + | - |
| Astro | ++ : aucun îlot | = : script à charger par page | + |
| Core Web Vitals | ++ : pas de JS au premier écran ; `transform` et `opacity` animables hors du fil principal selon Chrome (**non mesuré ici**) | = : scripts à charger et à exécuter ; le JS tourne sur le fil principal | = |
| Support | = : Chrome, Edge, Safari 26 ; Firefox non activé par défaut à la date du test (à revérifier) | ++ | ++ |

**Recommandation : CSS natif, avec état final statique quand il n'est pas supporté.** GSAP n'est pas justifié pour ces effets. Il peut rester une option pour un spécimen d'étude de cas qui en aurait besoin, chargé sur cette page seulement.

**Effet dépendant de la vitesse (inclinaison).** Le CSS ne connaît pas la vitesse de défilement : il faut un peu de JavaScript (0,8 Ko gzip [02]). Trois règles, apprises par la mesure (recalcul de style, 45 crans, CPU x4, médiane de 3 essais) :

| Version de `lean.js` | Recalcul de style |
|---|---|
| Variable héritée `--v` écrite sur la liste | 191 ms |
| `@property --v { inherits: false }`, écrite sur chaque planche | 111 ms |
| Écrite sur le `li` parent, pas sur l'élément qui porte l'animation CSS | **65 ms**, au niveau de GSAP (58 ms) |

1. Déclarer la variable avec `@property ... inherits: false` et l'écrire au plus près de l'élément qui la consomme.
2. Ne jamais l'écrire sur un élément qui porte une animation CSS dont les keyframes utilisent `var()` : chaque écriture force à réévaluer l'animation (hypothèse confirmée par l'écart de 111 à 65 ms).
3. Arrêter la boucle quand la valeur et la vitesse sont nulles (boucle à l'arrêt mesurée dès la fin du mouvement).

### 4.3 Effet sur les images (révélation tramée)

Fonctionnement : on calcule pour chaque point de la grille s'il est "encre" ou "papier" en comparant la luminance de l'image à un seuil qui varie selon la position dans un motif 4x4 (Bayer). Un front de révélation, qui mêle bruit et position verticale, décide quels points sont visibles à l'instant t.

| Critère | CSS (masque, `steps()`) | Filtre SVG | Canvas 2D [03] | WebGL2 [03] | Three.js |
|---|---|---|---|---|---|
| Fidélité au tramage observé | -- : pas de luminance par point | - : `feComponentTransfer` donne un seuil global, pas de front animé point par point | ++ : identique à sebg | ++ : rendu identique au 2D [03] | ++ |
| Complexité | + | = | + : environ 60 lignes | = : shader, texture, contexte | - |
| CPU par image d'animation | ++ | = : filtres recalculés à chaque image (hypothèse) | + : 0,38 ms (1,33 ms à CPU x4) [03] | ++ : 0,02 ms côté CPU [03] | + |
| Préparation | ++ | + | + : 25 ms en moyenne (42 ms à x4) [03] | = : 36 ms (64 ms à x4), compilation comprise [03] | - |
| Poids | ++ | ++ | ++ : environ 2,6 Ko gzip | + : environ 3,5 Ko gzip | -- : plus de 150 Ko |
| Mobile | ++ | = | + : 5 images révélées à 390 px [03] | + : limite d'environ 16 contextes | = |
| Accessibilité | + | + | ++ : l'`<img>` et son `alt` restent la source ; désactivé en mouvement réduit | ++ (idem) | ++ (idem) |
| Maintenance | ++ | = | + | = | - |
| SEO et LCP | ++ | ++ | ++ si l'image n'est jamais masquée quand elle est visible | ++ (idem) | = |

**Recommandation : Canvas 2D**, déclenché par `IntersectionObserver`, sans GSAP.
- Préparation hors de l'écran, et jamais sur une image visible au chargement : celle-ci peut être l'élément LCP.
- Canvas retiré à la fin, et désactivation complète en mouvement réduit.
- WebGL n'apporte rien de visible pour ce tramage, coûte plus à préparer et ajoute la gestion des contextes.

### 4.4 Scène WebGL interactive (spécimen "relief")

Fonctionnement : un seul triangle couvre le canvas. Le shader calcule, pour chaque pixel, une altitude (bruit fractal, plus une bosse sous le pointeur), puis trace une ligne quand l'altitude franchit un multiple d'un pas (lignes de niveau). Le pointeur et le temps sont envoyés comme uniformes.

| Critère | Canvas 2D | WebGL2 brut, fil principal [04] | WebGL2 brut dans un worker [04] | Three.js (dans un worker ou non) |
|---|---|---|---|---|
| Fidélité | -- : calcul par pixel trop lent en JS | ++ | ++ | ++ |
| Complexité | = | + : un fichier | = : messages et transfert du canvas | - |
| Réactivité de la page (15 clics pendant le rendu, interaction max) | - (non mesuré) | -- : 80 ms (104 ms à CPU x4 et 8 ms de scène) [04] | ++ : **24 ms dans tous les cas** [04] | dépend du fil |
| Images/s de la page | | 22 à 29 [04] | **60** [04] | |
| Poids | | 2,3 Ko gzip (cœur) | 2,9 Ko gzip (cœur et worker) | -- : 188 Ko gzip pour le module complet (phase 2) |
| Mobile | | = : à mesurer sur appareil | + : 60 images/s du rendu à 390 px [04] | - |
| Accessibilité | | + : canvas `aria-hidden`, image fixe de repli, état en `aria-live` | + (idem) | + (idem) |
| Maintenance | | + | = | = : mises à jour de Three.js |
| Astro et SEO | | ++ : chargé au clic, aucun impact sur le LCP ; aucun script avant le clic [04] | ++ (idem) | + |

**Réserve.** Ici, le WebGL du fil principal est rendu par SwiftShader, sur le CPU : les 80 ms d'interaction à 0 ms de scène sont très au-dessus de ce que donnerait un vrai GPU. Ce que la mesure établit sans ambiguïté, c'est l'écart entre les deux fils dès que le JavaScript de la scène s'alourdit.

**Recommandation : WebGL2 brut dans un worker**, chargé au clic.
- Repli sur le fil principal si `transferControlToOffscreen` manque, et sur l'image fixe si WebGL2 manque ou si le contexte est perdu (4 replis vérifiés [04]).
- Three.js n'est pas justifié pour ce shader. Il reste envisageable pour une scène 3D d'étude de cas, en import dynamique, de préférence dans le worker.

### 4.5 Typographie animée

| Option | Observé sur | Verdict |
|---|---|---|
| Axe de police variable lié au défilement (CSS) | cydstumpel.nl (`ytuc` 80 -> 0) | À retenir si la police choisie a des axes utiles. PolySans Neutral (police actuelle, utilisée par C) n'est pas variable : c'est à arbitrer avec le choix typographique |
| Échelle et couleur liées au défilement (CSS) | prototype 02 (titre qui recule) | Retenu : 0 Ko de JS |
| Révélation mot par mot (transitions d'opacité échelonnées) | 14islands.com | À éviter en l'état : contenu vide tant que le déclencheur n'est pas atteint (capture vide à 80 % du défilement) |
| Brouillage de caractères ("scramble") | blog.maximeheckel.com | Écarté : texte resté illisible plus de 2,6 s en headless |
| Découpage en lettres (SplitText de GSAP) | sebg.ch | Écarté pour le texte courant : ajoute du JS, multiplie les nœuds DOM, et peut dégrader la lecture par les lecteurs d'écran si les lettres sont mal regroupées (hypothèse non vérifiée sur sebg) |

### 4.6 Pointeur et profondeur

| Option | Verdict |
|---|---|
| Pointeur qui déforme une scène WebGL (14islands, prototype 04) | Retenu **dans le spécimen** seulement, comme enrichissement : sur écran tactile, le geste sert au défilement (`touch-action: pan-y`) |
| Curseur personnalisé, boutons magnétiques | Toujours écartés (`performance-budget.md` § 3.5) |
| Parallaxe de couches au défilement | Faisable en CSS (`view()` + `translate`) au même coût que le prototype 02 ; non prototypé, car peu de valeur pour C |

## 5. Risques et mesures de protection

| Risque | Où on l'a vu | Protection retenue |
|---|---|---|
| Contenu invisible si le script échoue | sebg (`opacity: 0` à l'initialisation), 14islands (titres en attente), Heckel (titres brouillés) | Jamais de masquage dans le HTML ou le CSS. Masquage par script uniquement hors de l'écran, au dernier moment [03] |
| LCP retardé par un effet | phase 2 (préchargeurs) | Images au-dessus de la ligne de flottaison jamais animées [03] ; spécimens chargés au clic [04] |
| INP dégradé par une scène | Estrada (LoAF jusqu'à 1 985 ms), prototype 04 sur le fil principal | Rendu en worker ; aucune boucle hors de l'écran ou onglet masqué |
| Recalcul de style coûteux | prototype 02 (191 ms) | `@property` non héritée, variables écrites au plus près, jamais sur un élément animé en CSS |
| Désynchronisation WebGL et DOM au défilement natif | déduit de 14islands et du scroll-rig | Un canvas par élément dans le flux, pas de canvas plein écran partagé |
| Mouvement non désiré | toutes les références sauf Stumpel et Estrada | `no-preference` en garde de chaque animation ; vérifié dans les 4 prototypes |
| Commandes non étiquetées | Heckel (curseurs sans libellé) | `<label for>` sur chaque commande des spécimens (prototypes 02 à 04) |
| Navigateur sans support | Firefox (animations au défilement, transitions entre documents) | Page statique complète, aucun polyfill |

## 6. Incertitudes restantes

1. **Appareil réel.** Le coût GPU du shader et du tramage sur un Android d'entrée de gamme n'a pas été mesuré. Il faut le faire avant validation (WebPageTest ou appareil physique).
2. **Prérendu.** Les règles de spéculation n'ont pas pu être vérifiées en navigation pilotée.
3. **Firefox.** Le support des animations au défilement et des transitions entre documents est à revérifier au moment de l'implémentation.
4. **Police.** Le choix d'une police variable conditionne l'effet typographique du § 4.5.
5. **Code non lu.** Le code du worker d'Estrada et le rendu de la mascotte de sebg n'ont pas été lus (source des workers non exportée par REA, et bundle de 597 Ko non analysé).
