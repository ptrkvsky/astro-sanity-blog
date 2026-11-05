# Décisions techniques d'implémentation

Issues de la mission 2.1 (27/10/2026). Chaque décision renvoie à l'observation qui la fonde (`technical-research.md`) et au prototype qui l'a vérifiée (`experiments/`).

> **Révisions 2.3 (28/10/2026)** : D2, D6 et D7 sont assouplies ou précisées, et D9 à D11 sont ajoutées pour l'expérience signature d'Épreuve (section "Révisions 2.3", en fin de document). Les décisions de 2.1 restent valables pour les pages hors accueil.

**Statut : D1 à D11 validées par Johan le 05/11/2026**, avec la direction Épreuve et le concept Calage. Les décisions de 2.1 ont été écrites pour la direction C ; celles qui dépendent de la direction sont signalées, et les révisions 2.3 priment pour la page d'accueil.

## D1 - Transitions entre pages : View Transitions natives entre documents

| | |
|---|---|
| Référence étudiée | cydstumpel.nl (Swup + `startViewTransition`), sebg.ch (`ClientRouter` d'Astro) |
| Observation | Stumpel : transition de 1 737 ms, pilotée par une bibliothèque de routage. Sebg : nouvelle page visible 778 ms après le clic, View Transition active, routeur client (13 Ko non compressés) + Lenis + GSAP |
| Solution | `@view-transition { navigation: auto; }` dans la feuille globale, avec `view-transition-name` construits à partir du slug (`shot-<slug>`, `title-<slug>`) dans l'index et dans l'étude de cas. La règle est annulée en `prefers-reduced-motion: reduce`. Les règles de spéculation (`prerender` au survol, `eagerness: moderate`) chargent la page d'arrivée à l'avance |
| Vérifié | Prototype 01 : 440 ms mesurées pour 420 ms réglées, retour arrière compris, mobile compris, 0 Ko de JS nécessaire, navigation intacte sans JS |
| Compromis | Pas de chorégraphie scriptée, comme le tramage de la nouvelle image chez sebg. Pas de transition dans les navigateurs sans support (navigation classique). Le prérendu n'a pas été vérifié en navigation pilotée |
| Repli | Navigation normale |
| Ne pas faire | Ajouter `<ClientRouter />` par défaut. Il ne se justifierait que si une transition doit conserver un état (lecteur, scène 3D) d'une page à l'autre |

## D2 - Animations au défilement : CSS `animation-timeline`, sans GSAP

| | |
|---|---|
| Référence étudiée | cydstumpel.nl (25 `animation-timeline`, dont un axe de police variable), sebg.ch (GSAP ScrollTrigger + Lenis) |
| Observation | Les effets de Stumpel tiennent en CSS, avec un vrai mode réduit (33 gardes `no-preference`). Le prototype 02 donne les mêmes valeurs en CSS et en GSAP, à ±0,01 |
| Solution | `animation-timeline: view()` ou `scroll(root)`, toujours sous `@supports (animation-timeline: view())` **et** `@media (prefers-reduced-motion: no-preference)`. Propriétés animées limitées à `translate`, `scale`, `rotate`, `opacity` et à des couleurs ponctuelles |
| Vérifié | Prototype 02 : 7 ms de script contre 28 ms pour GSAP (45 crans, CPU x4) ; 1,2 Ko de CSS contre 45,9 Ko gzip de GSAP + ScrollTrigger |
| Compromis | Firefox ne les active pas par défaut à la date du test : la page y est statique. Il n'y a pas d'équivalent CSS au `scrub` lissé ni aux callbacks |
| Repli | État final statique : chaque élément est à sa place, sans animation |
| Conséquence | **GSAP sort du bundle global.** Il n'est aujourd'hui utilisé que par le menu mobile, qui devra passer en CSS (`<details>` ou popover). On ne le réintroduira que pour un spécimen qui en a besoin, sur cette seule page |

## D3 - Effets dépendant de la vitesse : un micro-module JS, sous conditions

| | |
|---|---|
| Référence étudiée | david-estrada.dev (inclinaison des affiches) |
| Observation | Inclinaison culminant à 0,26, retour à 0 en environ 450 ms ; boucle limitée à la section visible ; lectures groupées avant les écritures |
| Solution | `lean.js` (0,8 Ko gzip). Le ressort reprend les constantes d'Estrada (gain 0,55, raideur 60, amortissement 12), la boucle s'arrête d'elle-même, et la variable `--v` est déclarée par `@property ... inherits: false` puis écrite sur le parent de l'élément animé |
| Vérifié | Prototype 02 : recalcul de style ramené de 191 à 65 ms (45 crans, CPU x4) par les deux règles ci-dessus ; 0 LoAF |
| Compromis | C'est du JS sur le fil principal pendant le défilement : à réserver à une ou deux sections. Désactivé en mouvement réduit |
| Repli | Aucun effet, contenu identique |
| Statut | **Facultatif.** Sa valeur dans la direction C est à arbitrer : c'est une touche "physique", pas une information |

## D4 - Révélation tramée des images : Canvas 2D, jamais sur une image visible au chargement

| | |
|---|---|
| Référence étudiée | sebg.ch (`dither.*.js`, lu intégralement) ; 14islands.com (vérification de l'hypothèse WebGL) |
| Observation | Sebg : Canvas 2D, Bayer 4x4, point de 2 px, deux phases GSAP (0,6 s et 0,7 s), désactivé en mouvement réduit, mais images mises en `opacity: 0` dès l'initialisation. 14islands : les `<img>` ne sont pas redessinées par WebGL sur l'accueil (hypothèse de phase 2 corrigée) |
| Solution | `reveal.js` en mode 2D : préparation à 25 % de hauteur d'écran avant l'entrée, lecture à 12 % au-dessus du bas, un canvas par image dans sa boîte, retiré à la fin. Pas de GSAP. L'image n'est masquée que si elle est hors de l'écran. Les images au-dessus de la ligne de flottaison ne sont jamais animées |
| Vérifié | Prototype 03 : 0,38 ms par image d'animation (1,33 ms à CPU x4), 25 ms de préparation, 5 images révélées puis 0 canvas restant et 0 image masquée. Mouvement réduit, sans JS et sans WebGL vérifiés |
| Compromis | 50 à 100 ms de cadre vide au début de l'effet. L'effet ne s'applique qu'aux images qui entrent par le défilement |
| Repli | L'`<img>` normale |
| Pourquoi pas WebGL | Même rendu, préparation plus longue (36 contre 25 ms), contextes limités, 1 Ko de plus. Le mode WebGL du prototype reste une référence de mesure |
| Statut | **Dépend de la direction.** Signature visuelle forte en C (planches, relevés) et en A ; inutile en B, où le shader porte déjà l'identité |

## D5 - Spécimen WebGL : WebGL2 brut, chargé au clic, rendu dans un worker

| | |
|---|---|
| Référence étudiée | david-estrada.dev (Three.js dans `feature3d.worker.bundle.js`) |
| Observation | L'architecture en worker est la bonne, mais la page d'Estrada fait encore 29 LoAF pendant le défilement (max 1 985 ms, cause non établie) |
| Solution | `relief-core.js`, indépendant du DOM, exécuté dans un worker via `transferControlToOffscreen()`. Le fil principal ne relaie que le pointeur (un message par image), la visibilité et la taille. Aucun script n'est téléchargé avant le clic. DPR plafonné à 1,5 (1 sur écran tactile). Pause hors de l'écran et onglet masqué |
| Vérifié | Prototype 04 : la page reste à 60 images/s et la pire interaction à 24 ms, même avec 8 ms de scène simulée et le CPU à x4. Sur le fil principal, la page tombe à 22-29 images/s et les interactions durent 80 à 104 ms (chiffres surestimés par le rendu logiciel). 4 replis vérifiés : absence de WebGL et perte de contexte, dans le worker et sur le fil principal |
| Compromis | Code en deux parties (page et worker) et communication par messages. Pas de lecture du DOM depuis le worker |
| Repli | Fil principal si `OffscreenCanvas` manque ; image fixe (AVIF 25 Ko) si WebGL2 manque ou si le contexte est perdu ; une seule image sans boucle en mouvement réduit |
| Statut | En C : spécimen à la demande. En B : la même architecture rend le hero, mais il faut alors mesurer sur appareil réel, car le rendu devient continu et non sollicité |

## D6 - Pas de défilement lissé, pas de canvas plein écran synchronisé au DOM

| | |
|---|---|
| Référence étudiée | 14islands.com (`r3f-scroll-rig` + Lenis), sebg.ch (Lenis + GSAP ticker) |
| Observation | Un canvas plein écran qui redessine des éléments du DOM doit connaître leur position à chaque image. Le défilement lissé en JS sert aussi à cette synchronisation (déduit du README du scroll-rig et de l'architecture de 14islands) |
| Solution | Défilement natif partout (décision de phase 2 confirmée). Tout effet graphique sur un élément se dessine **dans la boîte de l'élément** (prototypes 03 et 04), pas dans un calque global |
| Compromis | Pas d'effets qui traversent plusieurs éléments (une image qui "coule" vers la suivante) |

## D7 - Typographie : animations CSS seulement, jamais de texte masqué ou brouillé

| | |
|---|---|
| Référence étudiée | cydstumpel.nl (axe variable), 14islands.com (mots révélés), blog.maximeheckel.com (scramble), sebg.ch (SplitText) |
| Observation | Axe variable : propre, en CSS, avec un mode réduit. Mots révélés : contenu vide tant que le déclencheur n'est pas atteint. Scramble : texte resté illisible plus de 2,6 s en headless |
| Solution | Effets typographiques limités à l'échelle, à la couleur et, si la police le permet, à un axe variable, liés au défilement en CSS. Aucun découpage en lettres, aucun brouillage, aucun texte en `opacity: 0` en attente |
| À arbitrer | PolySans Neutral (police actuelle, retenue en C) n'est pas variable. Un axe animé imposerait de changer de police |

## D8 - Accessibilité des expériences

Règles appliquées et vérifiées dans les 4 prototypes, à reprendre telles quelles :

1. Chaque animation est sous `@media (prefers-reduced-motion: no-preference)` en CSS, ou derrière un `matchMedia(...).matches` en JS.
2. Canvas décoratifs en `aria-hidden="true"`. L'information reste dans le HTML (`alt`, légendes, texte).
3. Commandes avec `<label for>` et `<output>` ; état annoncé dans une zone `aria-live="polite"` (prototype 04).
4. Un bouton qui change de libellé n'utilise pas en plus `aria-pressed`. Le prototype 04 a été corrigé dans ce sens.
5. Focus visible commun : filet de 3 px et halo jaune (`shared/base.css`).

## Techniques retenues

| Technique | Usage | Coût vérifié |
|---|---|---|
| View Transitions entre documents | Index -> étude de cas, retour | 0 Ko JS, 1,2 Ko CSS |
| Règles de spéculation (`prerender` au survol) | Liens de l'index et des études de cas | 0 Ko JS (à vérifier hors automatisation) |
| CSS `animation-timeline` | Entrées de planches, titre de section, progression de lecture | 1,2 Ko CSS |
| Révélation tramée en Canvas 2D | Images des études de cas qui entrent par le défilement | 2,6 Ko gzip |
| WebGL2 brut en worker | Spécimens à la demande (relief), hero de B | 2,9 Ko gzip, chargé au clic |
| Image fixe générée depuis le shader | Repli des spécimens | 25 Ko AVIF |

## Techniques écartées

| Technique | Raison |
|---|---|
| GSAP + ScrollTrigger pour les effets courants | Même rendu que le CSS, 45,9 Ko gzip, 4 fois plus de script |
| `ClientRouter` d'Astro par défaut | Routeur client sans bénéfice pour des pages statiques ; gardé en réserve |
| Swup, Barba | Remplacés par le natif |
| Lenis, défilement lissé ou détourné | Décision de phase 2 confirmée ; seul intérêt technique : synchroniser un canvas global (D6) |
| Canvas WebGL plein écran qui redessine le DOM | Désynchronisé au défilement natif (D6) |
| Three.js pour le relief ou le tramage | 188 Ko gzip pour un shader de 2 Ko |
| Brouillage ("scramble") et découpage en lettres | Lisibilité et accessibilité (D7) |
| Masquage initial des images ou du texte par script | Contenu perdu si le script échoue (D4, D7) |
| Curseur personnalisé, boutons magnétiques | Décision de phase 2 confirmée |

## Arbitrages à faire

1. **Direction artistique**, A, B ou C, et donc le rôle du shader : hero continu (B) ou spécimen à la demande (C).
2. **Révélation tramée** : signature à adopter (C, A) ou non.
3. **Inclinaison selon la vitesse** (D3) : à garder ou non.
4. **Police** : garder PolySans (non variable) ou choisir une police variable pour un effet typographique au défilement (D7).
5. **Firefox** : accepter une version statique des animations au défilement et des transitions, ce qui est recommandé, ou ajouter un polyfill (non recommandé).
6. **Mesure sur appareil réel** : choisir l'appareil Android de référence et le service (WebPageTest, appareil physique) avant de figer le budget GPU.


## Révisions 2.3

Issues des prototypes E (Calage) et F (Vue éclatée), décrits et mesurés dans `experience-signature.md`. Elles ne s'appliquent qu'à la couche d'expérience (`performance-budget.md`, § 6) ; la couche de lecture garde les décisions de 2.1.

### D2 révisée - GSAP pour les séquences narratives, CSS pour les micro-effets

| | |
|---|---|
| Changement | GSAP et ScrollTrigger reviennent, **chargés après le LCP**, pour les séquences synchronisées : épinglage, scrub d'un motif, morphings, déclencheurs d'étapes. Les greffons se limitent à ce que la séquence utilise (E : MorphSVG, DrawSVG ; F : aucun) |
| Ce qui reste en CSS | Survols, états de focus, curseur, transitions de page (D1), et les animations au défilement des pages hors accueil |
| Vérifié | E et F à 59 à 60 images/s pendant le défilement, CPU x4, GPU intégré ; GSAP absent du chemin critique (LCP de 56 à 140 ms) |
| Règle apprise | Créer les épinglages **avant** les autres déclencheurs : dans F, ceux créés avant étaient décalés de toute la hauteur de l'épinglage |

### D6 précisée - Un calque fixe n'est synchronisé au DOM que pendant un mouvement

| | |
|---|---|
| Changement | Un canvas ou un SVG fixe est autorisé s'il ne prétend coïncider avec un élément qui défile que lorsque cet élément est immobile (épinglage, élément collant) ou pendant un trajet. Toujours pas de défilement lissé |
| Mise en œuvre | E : le repère vit dans le flux de chaque section, et un seul repère fixe prend le relais pendant les trajets, entre deux rectangles mesurés à chaque image. F : la scène se cale sur une colonne collante (`position: sticky`) |
| Reste à vérifier | Le décalage éventuel d'une image au moment du relais, sur un vrai défilement tactile |

### D7 précisée - Texte en WebGL au-dessus d'un h1 réel

| | |
|---|---|
| Changement | Un titre peut être rendu en WebGL si le h1 reste dans le DOM, visible tant que la texture n'est pas prête, puis en `color: transparent` (sélectionnable, lu, indexé) |
| Vérifié | E : LCP = le h1 (56 à 116 ms), alignement de la texture sur le texte HTML vérifié visuellement à 1 440 et 390 px, repli CSS en cas de perte de contexte |

### D9 - Le motif central est un composant à trois états

Chaque motif existe en trois versions qui racontent la même chose :
- **SVG en ligne à l'état final**, sans JavaScript et en mouvement réduit ;
- **SVG animé par GSAP**, au niveau allégé ;
- **SVG et WebGL**, au niveau complet.

Les états intermédiaires ne sont jamais nécessaires pour comprendre la page.

### D10 - Niveaux de capacité `full`, `lite`, `static`

Détection à la première exécution (`prototypes/epreuve/capabilities.js`) : mouvement réduit, pointeur grossier, écran étroit, `saveData`, `deviceMemory`, présence de WebGL2. Le niveau choisit ce qui est **chargé**, jamais ce qui est lisible. Détail dans `performance-budget.md`, § 6.4.

### D11 - Texte en texture aligné sur le DOM

`prototypes/epreuve/text-raster.js` redessine chaque mot aux positions renvoyées par `Range.getClientRects()`, avec la police calculée et `fontBoundingBoxAscent` pour la ligne de base, et lettre par lettre si un mot est coupé. La texture est régénérée au redimensionnement. Il reste à vérifier dans Safari (métriques de fonte) et avec les ligatures, absentes du titre actuel.

### Techniques reconsidérées

| Technique | Statut 2.3 |
|---|---|
| Three.js | Accepté pour une scène 3D réelle (F) : 134 Ko compressés après élagage, chargé après le LCP, réservé au niveau `full` sur grand écran. Non retenu dans la recommandation (concept Calage, WebGL brut) |
| GSAP + ScrollTrigger | Accepté pour les séquences narratives (D2 révisée) |
| Lenis, défilement détourné, préchargeur, curseur personnalisé | Toujours écartés |
