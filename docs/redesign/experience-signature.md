# Expérience signature "Épreuve" (mission 2.3)

**Statut : concept Calage validé par Johan le 05/11/2026 (proposition du 28/10/2026). L'implémentation est décrite dans `implementation-plan.md`.**

Johan a retenu la direction **Épreuve** (affiche, fond encre, rouge-orangé) et demande d'aller beaucoup plus loin que le prototype de 2.2 : un **motif graphique central qui évolue au défilement** et raconte son profil, avec GSAP, WebGL et Three.js autorisés, et un budget de performance à réviser en conséquence. Ce document compare trois concepts, en évalue deux à partir de prototypes interactifs, recommande l'un d'eux, et fait le bilan technique et budgétaire.

Prototypes : `prototypes/e-calage/` (E, recommandé) et `prototypes/f-eclatee/` (F). Ouvrir : `python3 -m http.server 8767 --bind 127.0.0.1` à la racine du dépôt, puis http://127.0.0.1:8767/docs/redesign/prototypes/

## 1. Typographie retenue

La combinaison "avec PolySans" de `prototypes/d-revue/fontes.html` est l'**association 3 : Instrument Serif (romain et italique) + PolySans Neutral + IBM Plex Mono**. C'est la seule que les arbitrages de 2.2 (`directions.md`, partie 2.2, § 6.2) désignent par "PolySans". L'association 4 (PolySans + JetBrains Mono) était la référence de la direction C, notée "sans voix éditoriale".

| Rôle | Fonte | Fichier | Poids |
|---|---|---|---|
| Affiche, titres, chiffres | Instrument Serif 400 | `instrument-serif-latin-400-normal.woff2` | 21,0 Ko |
| Accent (mot en rouge, citations, compteur) | Instrument Serif 400 italique | `instrument-serif-latin-400-italic.woff2` | 22,1 Ko |
| Texte courant | PolySans Neutral (police actuelle du site) | `public/assets/fonts/PolySans-Neutral.woff2` | 30,9 Ko |
| Libellés, mesures, métadonnées | IBM Plex Mono 400 | `ibm-plex-mono-latin-400-normal.woff2` | 14,7 Ko |
| **Total** | 4 fichiers | | **88,7 Ko** |

Elle est exploitable techniquement et visuellement :
- Instrument Serif est étroite : à 180 px, le titre tient en deux lignes à 1 440 px, et son italique donne l'accent que Bricolage Grotesque (la fonte d'Épreuve en 2.2) ne donnait pas.
- PolySans garde la continuité avec le site actuel, et l'association tient sous le plafond de 90 Ko.
- Elle impose d'assouplir la règle des 2 fichiers (4 fichiers). Les deux fichiers de titre sont préchargés, ce qui donne un CLS mesuré entre 0,003 et 0,007 (§ 7).
- Elle ne permet pas d'animer un axe de chasse, puisque PolySans n'est pas variable. Les deux concepts n'en ont pas besoin.

## 2. Ce que le parcours doit raconter (contenu réel)

Même ossature pour les trois concepts, construite uniquement sur le contenu existant (6 projets, 2 témoignages, 69 articles dont 6 titres connus, Toulouse, depuis 2012, e-mail). Les nouveaux textes, écrits avec la voix de Johan, portent l'étiquette jaune "texte provisoire" ; les données absentes gardent "à fournir" ou "à sourcer".

| Étape | Ce que le visiteur doit comprendre |
|---|---|
| Hero | Qui (Johan Petrikovsky, frontend senior, Toulouse, depuis 2012), ce qu'il fait (interfaces rapides, lisibles, trouvables), comment le joindre |
| 01 Méthode | Sa manière de concevoir : le contenu d'abord, les effets en dernier, chaque couche retirable |
| 02 Essais | Six projets livrés, dont un détaillé (SAFTI.fr) et un créatif (Draw me a Sheep : WebGL et GSAP) |
| 03 Contrôle | La qualité vérifiable : performance, SEO, accessibilité, architecture, avec les mesures réelles de la page et les articles qui les prouvent |
| 04 À propos | Le parcours et les témoignages, au calme |
| 05 Contact | Une conclusion qui résout le motif du hero et donne l'adresse |

## 3. Trois concepts

### Concept 1 - Calage (prototypé : E)

| | |
|---|---|
| Idée directrice | La page est une **épreuve d'imprimerie qu'on cale jusqu'au "Bon à tirer"**. La chaîne d'impression (composer, imposer, caler, encrer, tirer) répond, étape par étape, au pipeline de rendu du navigateur (balisage, style, mise en page, peinture, composition des calques). Message : la précision est un processus, pas un effet |
| Identité visuelle | Feuille noire, encre papier, rouge-orangé ; deux plaques décalées (franges rouges) ; trame à 45° et 15° ; traits de coupe, ligne de pied d'épreuve, gamme de contrôle, tampon. Le vocabulaire est celui de l'atelier, pas celui de la risographie décorative : chaque élément a un rôle dans la chaîne |
| Motif central | Le **repère de calage** (cercle, croix, disque central), imprimé en deux plaques. Silhouette reconnaissable, déjà présente dans le monde réel, et liée au nom "Épreuve" |
| Hero | Titre géant en Instrument Serif, réimprimé en WebGL en deux plaques tramées hors repère, avec poussières et lignes de repère sous l'encre. Le repère est posé sur la ligne de base du titre ; le défilement (hero épinglé sur 65 % d'écran) cale les plaques et affine la trame jusqu'au ton continu. Le pointeur bouge légèrement la plaque rouge |
| Transformations | 01 : le repère devient **tête de lecture** ; il descend l'axe des cinq passes et le dessine, chaque passe se cale à son passage. 02 : il devient **compte-fils**, qui parcourt la capture de SAFTI.fr imprimée en trame et montre dans le verre le tirage net. 03 : l'anneau se découpe en six arcs qui se déroulent en **gamme de contrôle** ; chaque case porte une mesure réelle. 04 : le repère se range en folio. 05 : les six cases se réenroulent en anneau, qui devient le **tampon "Bon à tirer"** ; le repère central est enfin calé |
| GSAP et WebGL | ScrollTrigger (épinglage, scrub, déclencheurs d'étapes), MorphSVG (arcs et cases), DrawSVG (axe, règles, masque du tampon) ; deux rendus WebGL2 bruts (titre, compte-fils), à la demande |
| Intérêt pour le profil | Il fait de la spécialité de Johan (le rendu, la performance, la rigueur) la matière même du récit, et il le démontre : le hero est un vrai rendu WebGL aligné au pixel sur un texte HTML, et la gamme de contrôle mesure la page elle-même |
| Risques | Créatif : l'esthétique risographie est à la mode, et la trame deviendrait un cliché si elle était gratuite. Technique : l'alignement de la texture du titre dépend des métriques de fonte (`fontBoundingBoxAscent`), à vérifier dans Safari. Lisibilité : le titre est tramé au premier écran (lisible, mais moins net que le HTML), et les titres d'index hors repère sont un peu chargés |

### Concept 2 - Vue éclatée (prototypé : F)

| | |
|---|---|
| Idée directrice | **La page se démonte sous les yeux du visiteur.** Message : "je sais ce qu'il y a sous chaque pixel" |
| Identité visuelle | Dessin technique : cotes fléchées en rouge, hachures, axonométrie, libellés en mono avec des valeurs mesurées |
| Motif central | Le **bloc coté** : le modèle de boîte du titre (marge, bordure, marge interne, contenu) |
| Hero | Le titre dans son modèle de boîte dessiné en CSS, avec ses cotes mesurées en direct (largeur, hauteur, corps, marges). Le défilement (épinglage sur 120 % d'écran) fait basculer le dessin plat en 3D : les quatre boîtes pivotent et se séparent |
| Transformations | 01 : les quatre calques deviennent les **quatre couches de rendu** réelles (`architecture.md` § 9.2), et l'étape lue sort de la pile ; un bouton retire réellement la couche WebGL. 02 : les calques deviennent **six planches** de projets, et la planche de la ligne lue ou survolée sort de la pile. 03 : les planches s'écrasent en **histogramme 3D du poids réel** de la page, poste par poste. 05 : la conclusion est un curseur de saisie après l'adresse e-mail |
| GSAP et WebGL | Three.js (caméra orthographique, plans, barres, textures), ScrollTrigger (épinglage, progression de chaque chapitre), tweens GSAP de mise en avant |
| Intérêt pour le profil | Très parlant pour un public technique ; c'est la proposition qui montre le mieux la maîtrise 3D et l'architecture en couches |
| Risques | Créatif : l'esthétique "blueprint", l'axonométrie et la vue 3D des calques sont déjà vues (vue 3D des outils de développement, sites "wireframe"). Technique : poids de Three.js et des textures, une tâche longue à l'apparition des planches. Lisibilité : le titre devient une texture inclinée pendant l'explosion. Responsive : la 3D disparaît sous 1 025 px |

### Concept 3 - Isohypses (documenté, non prototypé)

| | |
|---|---|
| Idée directrice | **La typographie comme relief.** Le titre émet des lignes de niveau : son champ de distance est calculé sur la carte graphique par Jump Flooding, et l'interpolation entre deux champs donne un morphing naturel, sans déformation arbitraire |
| Identité visuelle | Courbes de niveau claires sur encre, courbe maîtresse rouge, cotes d'altitude et coordonnées en mono |
| Motif central | Un "îlot" de lignes de niveau dont la forme change |
| Hero | Le titre HTML, dont les lettres émettent des anneaux topographiques ; le pointeur soulève le terrain |
| Transformations | 01 : le relief se reforme autour de la méthode. 02 : six sommets numérotés, un par essai, et un polygone de zone éditable en SVG (le travail Leaflet d'Omega). 03 : le profil d'altitude devient le profil de performance. 05 : tout s'aplanit en une ligne d'horizon |
| GSAP et WebGL | Shader plein cadre (JFA en plusieurs passes), ScrollTrigger pour piloter le champ |
| Intérêt pour le profil | Il prolonge la compétence cartographique réelle de Johan |
| Risques | C'est le plus proche de la direction B, déjà prototypée et mesurée (`prototypes/b-relief/`), et du motif topographique très répandu. Il utilise aussi la même famille de technique que Calage (un shader 2D) : la comparaison avec E aurait moins appris que celle avec F, d'où le choix de ne pas le prototyper |

## 4. Proposition narrative détaillée (concept recommandé : Calage)

| Section | Ce que le visiteur comprend | Ce que fait le motif | Pourquoi à cet endroit |
|---|---|---|---|
| Hero | Johan conçoit des interfaces rapides, lisibles, trouvables ; la page est elle-même une épreuve | Le titre et le repère sont hors repère et tramés ; le défilement les cale. Ligne de pied : "épreuve 1/5" | Le premier geste du visiteur (défiler) produit le premier réglage : le site se présente comme un travail en cours de précision. Le titre reste du texte HTML sélectionnable |
| 01 Du balisage au pixel | Sa méthode en cinq passes, chacune nommée deux fois (navigateur et imprimerie) | Le repère quitte le titre et devient tête de lecture ; il dessine l'axe en descendant, chaque passe se cale à son passage ; un compteur collant indique la passe en cours | La métaphore n'est expliquée qu'une fois, là où elle sert : ordonner la méthode. Le mouvement suit exactement la lecture |
| 02 Essais | Les six projets, et le détail de SAFTI.fr | Les titres d'index sont hors repère et se calent au survol ; le repère devient compte-fils et montre le tirage net sous la trame | On inspecte un projet comme un imprimeur inspecte une épreuve : de près, avec un instrument |
| 03 Contrôle, en direct | Les engagements de qualité, et la preuve : les mesures de la page | L'anneau se découpe et se déroule en gamme de contrôle ; chaque case porte une valeur réelle (poids, requêtes, JS, LCP, CLS, interaction) | C'est la montée en puissance : le motif cesse d'être décoratif et devient l'instrument de mesure |
| 04 À propos | Le parcours et les témoignages | Le repère se range en folio dans l'en-tête | Une respiration : rien ne bouge pendant la lecture longue |
| 05 Bon à tirer | Écrire à Johan | Les six cases se réenroulent en tampon "Bon à tirer · épreuve n° 1" ; le repère central est enfin calé ; l'indicateur de calage atteint 100 % | Le motif introduit dans le hero est résolu : l'épreuve est validée, et la décision revient au visiteur |

Moments mémorables, par ordre de montée : la trame qui se cale sous le doigt, la tête de lecture qui dessine l'axe, le verre du compte-fils, l'anneau qui se déroule en mesures, le tampon.

## 5. Évaluation des prototypes

Notes de 1 à 5, sur les prototypes tels qu'ils fonctionnent (vérifiés au § 7), pas sur leur potentiel.

| Critère | E - Calage | F - Vue éclatée |
|---|---|---|
| Impact du hero | **5** : matière (trame, poussières), transformation immédiate au premier défilement, titre géant ; sans attente | 4 : les cotes vivantes intriguent et l'explosion 3D est forte, mais au repos le hero reste un schéma ; l'effet n'arrive qu'après le premier défilement |
| Singularité | **5** : repère, deux plaques, gamme de contrôle et tampon forment un langage complet, reconnaissable sans le nom, et lié au nom "Épreuve" | 3 : axonométrie et calques 3D sont déjà vus ; c'est la valeur mesurée qui singularise, pas l'image |
| Cohérence narrative | **5** : chaque transformation correspond à une étape de la méthode, et la fin résout le hero | 4 : la chaîne boîte, couches, planches, poids est logique et la section 03 est très forte, mais les sections 04 et 05 sont sans motif et le curseur final est faible |
| Qualité du mouvement | 4 : morphings arcs et cases sans déformation arbitraire ; le repère passe brièvement au-dessus du texte entre 01 et 02 | 4 : interpolation continue et lissée, explosion convaincante ; l'épinglage du hero est long (120 %) |
| Maîtrise technique | 4 : WebGL brut (trame, séparation, mipmaps, rendu à la demande), texte en texture aligné sur le DOM, repère synchronisé au défilement natif | **5** : Three.js, scène comme fonction pure de la progression, projection des libellés, retrait et restauration du contexte à chaud, histogramme du poids réel |
| Lisibilité | 4 : titre tramé lisible et calé après 65 % d'écran ; titres d'index hors repère un peu chargés | 4 : texte en colonne claire ; le titre n'est qu'une texture inclinée pendant l'explosion |
| Responsive | **4** : la même histoire sur mobile (titre tramé, axe, compte-fils, tampon), sans épinglage | 3 : pas de 3D sous 1 025 px ; les illustrations fixes portent moins l'idée |
| Performance ressentie | **5** : 61 Ko compressés d'expérience, 60 images/s même avec le CPU bridé x4, couche prête en environ 75 ms | 3 : 183 à 238 Ko compressés plus les textures, une tâche longue de 146 ms (CPU x4) à l'apparition des planches, 28 images/s en rendu logiciel |
| **Total** | **36 / 40** | **30 / 40** |

## 6. Recommandation

**Retenir le concept Calage (E)** comme expérience signature d'Épreuve. Ce n'est pas le plus simple à implémenter : son hero WebGL aligné sur le texte, le repère qui voyage entre les sections et les morphings sont plus délicats que la scène de F. Il est recommandé parce que :

1. **C'est le seul des deux qui soit singulier par l'image et par l'idée.** Le repère de calage, les deux plaques et le tampon forment un langage reconnaissable sans le nom du site, et ce langage *est* le nom du site.
2. **La narration est la plus juste.** Chaque transformation correspond à une étape de la méthode de Johan, et la conclusion résout le hero.
3. **Il garde l'avantage du positionnement.** 61 Ko d'expérience et 60 images/s sur un GPU intégré, même avec le CPU bridé : la page applique ce qu'elle affirme.
4. **Il tient sur mobile.** L'histoire est la même, et seul l'épinglage disparaît.

À reprendre de F dans Calage :
- **Le bouton "retirer la couche créative"**, qui libère réellement le WebGL : c'est la meilleure preuve d'amélioration progressive des deux prototypes. Il trouverait sa place à la passe 05 de la méthode ("Les effets arrivent en dernier").
- **Le poids réel par poste** (Resource Timing), en complément de la gamme de contrôle.

À corriger avant l'implémentation :
- Réduire l'ombre rouge des titres d'index hors repère (ou la réserver aux grands écrans).
- Faire contourner le texte au repère pendant le trajet de 01 à 02.
- Tester l'alignement du titre en WebGL dans Safari et sur Android.

## 7. Vérifications et limites

Conditions : Chrome 156 en headless (Playwright-core 1.61, captures CDP), **GPU réel Intel Iris Xe** via Vulkan (`--use-angle=vulkan`), et SwiftShader (rendu logiciel) pour comparer. Serveur local sans compression. Toutes les captures ont été regardées.

### Mouvement (défilement scripté de toute la page, 120 px toutes les 50 ms)

| Page | Écran | CPU | Images/s | p95 image | Images > 33 ms | LoAF > 50 ms (max) |
|---|---|---|---|---|---|---|
| E - Calage | 1 440 × 900 | x1 | 59,6 | 16,8 ms | 1 | 1 (52 ms) |
| E - Calage | 1 440 × 900 | x4 | 59,5 | 16,8 ms | 1 | 1 (71 ms) |
| F - Vue éclatée | 1 440 × 900 | x1 | 59,7 | 16,7 ms | 1 | 0 |
| F - Vue éclatée | 1 440 × 900 | x4 | 59,0 | 16,7 ms | 1 | 1 (146 ms) |
| D - Épreuve 2.2 (référence) | 1 440 × 900 | x4 | 59,5 | 16,7 ms | 0 | 0 |
| E - Calage (niveau allégé) | 390 × 844 | x4 | 59,8 | 16,8 ms | 0 | 0 |
| F - Vue éclatée (niveau allégé) | 390 × 844 | x4 | 60,0 | 16,8 ms | 0 | 0 |
| E, rendu logiciel | 1 440 × 900 | x4 | 47,3 | 50 ms | 29 | 1 (72 ms) |
| F, rendu logiciel | 1 440 × 900 | x4 | 28,4 | 66,6 ms | 78 | 2 (152 ms) |

Le rendu logiciel figure l'appareil sans GPU utile. F y tombe à 28 images/s : c'est ce qui justifie les niveaux de capacité (§ 8). La tâche longue de E (52 à 71 ms) a lieu au démarrage d'un rendu WebGL (compilation et texture). Celle de F (146 ms) a lieu à l'apparition des planches ; l'envoi des six textures d'images est l'hypothèse la plus probable, à confirmer au profileur, et à corriger en préparant les textures pendant l'inactivité (`renderer.initTexture`).

### Chargement (3 passages par page)

| Page | LCP (élément) | CLS au chargement | CLS après défilement complet | Couche prête après l'inactivité |
|---|---|---|---|---|
| E, 1 440 | 72 à 112 ms (h1) | 0,0034 | 0,0036 | 66 à 111 ms |
| F, 1 440 | 60 à 140 ms (h1) | 0,0071 à 0,0073 | 0,0071 à 0,0073 | 117 à 221 ms |
| E, 390 | 56 à 116 ms (h1) | 0,0047 à 0,0053 | idem | 48 à 58 ms |
| F, 390 | 56 à 120 ms (chapô) | 0,0039 à 0,0047 | idem | 17 à 24 ms |

Corrigé pendant la vérification : F en 390 px avait un **CLS de 0,26**. La ligne d'édition passait sur deux lignes quand la taille mesurée remplaçait "n/d", et l'indication "Faites défiler" apparaissait avec la couche JS. Les deux places sont maintenant réservées.

### Autres vérifications

| Vérifié | Résultat |
|---|---|
| Largeurs 1 440, 1 024, 768, 390, 360 px | Aucun débordement horizontal. À 1 024 × 768, les boutons du hero passent sous la ligne de flottaison dans les deux prototypes (à 1 440 × 900 et 390 × 844, ils sont visibles) |
| Mouvement réduit | Niveau statique : aucune animation, aucun script d'expérience chargé, états finaux (titre calé, gamme déroulée, tampon) |
| Sans JavaScript | Pages complètes ; mesures en "n/d" |
| Sans WebGL (`?simulate=nogl`) | E : titre en HTML, plaques décalées en `text-shadow`, même calage au défilement ; F : illustrations fixes |
| Perte de contexte (`?simulate=lost`) | E : bascule sur le repli CSS ; F : scène retirée, illustrations fixes, message dans la zone d'état |
| Clavier | Parcours complet à la touche Tab (34 arrêts pour E, 31 pour F, y compris pendant l'épinglage) : focus toujours visible et dans l'écran, aucun piège |
| Firefox 158 | Capture du premier écran seulement (headless) : composition correcte, avant le démarrage de la couche animée |

### Non vérifié

| Point | Pourquoi |
|---|---|
| Safari, iOS (métriques de fonte du titre en texture, épinglage et barre d'adresse) | Aucun appareil ni navigateur disponible |
| Android réel, écran à 120 Hz | Aucun appareil ; le mobile est simulé (390 px, tactile, CPU x4) sur un GPU de portable |
| Lecteur d'écran | Non testé ; les canvas et motifs sont `aria-hidden`, les mesures en `output` et `aria-live` |
| Animations dans Firefox | Pas de Playwright Firefox : seules des captures statiques |
| Rendu en DPR 2 réel | Captures en DPR 1 |
| Décalage d'une image entre le repère fixe et les repères en ligne au moment du relais | Invisible sur les captures ; à observer sur un vrai défilement tactile |

## 8. Bilan technique

| Sujet | Choix | Pourquoi |
|---|---|---|
| SVG du motif | Repère défini comme `<g>` réutilisé par `<use>`, une copie par plaque ; décalage par `transform` | Un `<symbol>` avec un viewBox centré se décale d'une demi-taille sous `<use>` (piège rencontré et corrigé) |
| Morphing | MorphSVG entre secteurs d'anneau et rectangles de même structure (quatre côtés) | Le côté extérieur de l'arc devient le haut de la case : la forme se déroule, elle ne se déforme pas arbitrairement |
| Tracés | DrawSVG pour les règles et le masque du texte du tampon ; propriété CSS `--axis` pour l'axe | Le masque permet d'écrire le texte sur le cercle sans découper les lettres |
| GSAP et ScrollTrigger | Épinglage du hero (niveau complet seulement), scrub de 0,4 à 0,6 pour le motif, déclencheurs par étape, `quickTo` pour le pointeur | Séquences synchronisées et réversibles ; le défilement reste natif (pas de Lenis) |
| Ordre des déclencheurs | Épinglages créés avant les autres déclencheurs | Dans F, les déclencheurs créés avant l'épinglage étaient décalés de toute sa hauteur (bug rencontré et corrigé) |
| CSS natif | Micro-interactions : calage des lignes au survol (`text-shadow`), curseur, survols | GSAP n'apporte rien à un état de survol |
| WebGL brut (E) | Deux contextes au plus, chacun dans la boîte de son élément ; rendu à la demande ; mipmaps pour mesurer la couverture d'un point de trame | 3,2 Ko de code pour le rendu, aucune image calculée à l'arrêt |
| Texte en texture | Chaque mot est redessiné aux positions que donne `Range.getClientRects()`, le h1 reste dans le DOM en `color: transparent` | Le titre reste sélectionnable, lu, indexé ; la texture n'est qu'une copie |
| Three.js (F) | Un canvas fixe, caméra orthographique en pixels CSS ; scène calculée comme une fonction pure de la progression de chaque chapitre ; plus aucun dessin au repos | Robuste au défilement arrière et au redimensionnement ; 134 Ko compressés après élagage (189 Ko sans) |
| Repère qui voyage (E) | Le repère vit dans le flux de chaque section ; un seul repère fixe prend le relais pendant les trajets, entre deux rectangles mesurés à chaque image | Lève la réserve de D6 : rien n'est collé à un élément qui défile, sauf pendant un mouvement |
| Chargement | Détection du niveau, puis attente du `load`, des fontes et d'un moment d'inactivité ; scripts GSAP téléchargés en parallèle et exécutés dans l'ordre ; modules WebGL en import dynamique ; second contexte créé à l'approche (IntersectionObserver, marge de 60 %) | Aucun octet d'expérience dans le chemin critique : le LCP est le titre en texte |
| Niveaux de capacité | `full` (épinglage, pointeur, DPR 1,5 au plus), `lite` (écran tactile ou étroit, données économisées, moins de 4 Go : pas d'épinglage, DPR 1, pas de 3D), `static` (mouvement réduit) | Voir `implementation-decisions.md`, D10 |

Le budget révisé est dans `performance-budget.md`, section "Révision 2.3", et les décisions modifiées dans `implementation-decisions.md`, section "Révisions 2.3".

## 9. Fichiers créés ou modifiés

Créés :
- `docs/redesign/experience-signature.md` (ce document)
- `docs/redesign/prototypes/epreuve/` : `tokens.css`, `base.css`, `capabilities.js`, `boot.js`, `text-raster.js`, `gl.js`
- `docs/redesign/prototypes/e-calage/` : `index.html`, `calage.css`, `calage.js`, `gl/press.js`, `README.md`
- `docs/redesign/prototypes/f-eclatee/` : `index.html`, `eclatee.css`, `eclatee.js`, `gl/stack.js`, `README.md`
- `docs/redesign/prototypes/vendor/` : GSAP 3.13.0 (6 fichiers copiés de `node_modules`), Three.js 0.186.1 (un module minifié et sa licence), `README.md`

Modifiés :
- `docs/redesign/prototypes/index.html` (cartes E et F)
- `performance-budget.md`, `implementation-decisions.md`, `design-system.md`, `directions.md`, `implementation-plan.md` (sections ou notes 2.3)

Rien n'a été modifié dans `src/`, `public/` ni dans la configuration Astro.

Liens locaux (serveur lancé à la racine du dépôt) :
- Index : http://127.0.0.1:8767/docs/redesign/prototypes/
- E - Calage : http://127.0.0.1:8767/docs/redesign/prototypes/e-calage/ (`?tier=lite`, `?tier=static`, `?simulate=nogl`, `?simulate=lost`)
- F - Vue éclatée : http://127.0.0.1:8767/docs/redesign/prototypes/f-eclatee/ (mêmes paramètres)

## 10. Arbitrages demandés à Johan

1. **Concept** : Calage (recommandé), Vue éclatée, ou Calage avec les deux éléments repris de F (§ 6).
2. **Polices** : accepter 4 fichiers (88,7 Ko) au lieu de 2.
3. **Budget** : valider le budget par couche (`performance-budget.md`, révision 2.3), dont 80 Ko compressés de JS d'expérience pour Calage.
4. **Titre du hero en WebGL** : l'accepter tramé au premier écran (lisible, calé après 65 % d'écran), ou démarrer plus calé.
5. **Appareils de référence** : un iPhone et un Android d'entrée de gamme pour les vérifications du § 7 non faites.
6. **Textes** : valider ou réécrire les textes marqués "texte provisoire" (chapô, méthode, contrôle, conclusion).
