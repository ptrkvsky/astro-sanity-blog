# Budget de performance et stratégies de repli

Ce document fixe les limites que la future implémentation ne doit pas dépasser, et ce que fait chaque effet quand l'appareil, le réseau ou les préférences du visiteur ne s'y prêtent pas. Les chiffres viennent de mesures réelles prises le 27/10/2026 ; leur méthode et leurs limites sont décrites en fin de document.

## 1. Points de repère mesurés

| Mesure (desktop, sans bridage) | Site actuel | Médiane des 26 références | Références avec WebGL (15) | Références sans WebGL (11) |
|---|---|---|---|---|
| Poids total transféré | **301 Ko** | 4 043 Ko | 12 158 Ko | 1 622 Ko |
| JavaScript | 97 Ko | 806 Ko | 815 Ko | 721 Ko |
| Requêtes | 13 | 43 | - | - |
| LCP (non bridé) | 260 ms | 1 070 ms | - | - |

Lecture : le site actuel est déjà **13 fois plus léger que la médiane** des portfolios étudiés. C'est un avantage à conserver, pas à sacrifier pour un effet. Les références avec WebGL pèsent en médiane 7,5 fois plus que celles sans WebGL, surtout à cause de vidéos et de textures (jusqu'à 142 Mo de média pour un site), rarement à cause du code 3D lui-même : une scène WebGL écrite sans bibliothèque tient en 69 Ko chez Aristide Benoist (voir `research.md`).

Prototypes de cette mission, mesurés avec le même outil (non optimisés, polices Google et captures pleine taille) :

| Prototype | Total | JS | Polices | Images | Requêtes |
|---|---|---|---|---|---|
| A - Marges | 833 Ko | 0 Ko | 301 Ko | 505 Ko | 12 |
| B - Relief | 257 Ko | 7 Ko | 126 Ko | 103 Ko | 7 |
| C - Banc d'essai | 561 Ko | 2 Ko | 30 Ko | 505 Ko | 9 |

Les écarts viennent de deux causes corrigeables : des captures de projets servies en 1 440 px sans variantes, et des familles de polices complètes (Newsreader avec tous ses axes). Le code propre aux directions est négligeable : 0 à 7 Ko.

## 2. Budget cible (page d'accueil, mobile, 4G lente simulée)

| Poste | Budget | Justification |
|---|---|---|
| HTML (compressé) | ≤ 30 Ko | contenu complet rendu au build |
| CSS critique | ≤ 20 Ko, en ligne ou en une feuille | pas de framework CSS complet en production |
| Polices | ≤ 2 fichiers, ≤ 90 Ko au total, `font-display: swap`, sous-ensemble latin | A et B devront réduire leurs familles (axes et graisses utiles seulement) |
| JS nécessaire au premier écran | **0 Ko** | la navigation, le contenu et le contact sont du HTML |
| JS d'amélioration (îlots, mesures) | ≤ 15 Ko compressés, chargé `client:idle` ou `client:visible` | |
| Couche créative (shader) | ≤ 10 Ko compressés, chargée après le LCP | `relief.js` mesure 2,9 Ko compressés |
| Images au-dessus de la ligne de flottaison | ≤ 1 image, ≤ 60 Ko en AVIF ou WebP | le hero des trois directions n'en a pas besoin |
| Poids total au premier chargement | **≤ 350 Ko** | proche du site actuel (301 Ko), 10 fois sous la médiane des références |
| Requêtes au premier chargement | ≤ 15 | |

Seuils Core Web Vitals visés (75e centile, données réelles une fois le site en ligne) :

| Indicateur | Cible | Bon selon Google |
|---|---|---|
| LCP | ≤ 1,8 s | ≤ 2,5 s |
| INP | ≤ 100 ms | ≤ 200 ms |
| CLS | ≤ 0,02 | ≤ 0,1 |
| TTFB | ≤ 400 ms (pages prérendues servies par le CDN) | ≤ 800 ms |

Le budget est vérifié en CI (Lighthouse CI ou `size-limit` sur les bundles, à choisir pendant l'implémentation) : un dépassement fait échouer la MR au lieu d'être découvert en production.

## 3. Effets envisagés, un par un

Légende de l'impact : LCP, INP, CLS ; "aucun" signifie que l'effet ne peut pas, par construction, dégrader l'indicateur.

### 3.1 Champ de lignes de niveau (shader, direction B ; spécimen dans C)

| Critère | Évaluation |
|---|---|
| Fonction dans le concept | B : c'est l'identité (la carte des projets). C : démonstration de savoir-faire, à la demande |
| Valeur pour le visiteur | Repérer les projets d'un coup d'œil (B) ; voir une compétence plutôt que la lire (C) |
| Coût de téléchargement | 7,0 Ko bruts, 2,9 Ko compressés, aucune dépendance |
| Coût de calcul | 1 triangle plein écran, 4 octaves de bruit par pixel ; DPR plafonné à 1,5 (1 sur mobile) ; rendu suspendu hors écran (`IntersectionObserver`) et onglet masqué (`visibilitychange`) |
| LCP | Aucun si chargé après le premier rendu (`requestIdleCallback`) : le LCP est le titre en texte |
| INP | Faible : les mouvements du pointeur ne font que mettre à jour des uniformes ; aucun travail synchrone lourd sur le fil principal |
| CLS | Aucun : le canvas occupe une boîte de taille fixe définie en CSS |
| Mobile | Pas de reliefs ni de marqueurs, dérive lente ; à mesurer sur un appareil Android d'entrée de gamme avant validation (non fait ici) |
| `prefers-reduced-motion` | Une seule image fixe, redessinée seulement au survol ou au défilement, aucune boucle d'animation |
| `saveData` | Le shader n'est pas chargé |
| Sans WebGL | Classe `no-webgl`, fond CSS statique ; testé avec WebGL désactivé : aucune erreur, contenu intact |
| Perte de contexte | `webglcontextlost` bascule sur le repli |
| Maintenance | Un fichier, aucune bibliothèque à mettre à jour ; GLSL à documenter |

### 3.2 Fiche de mesure en direct (direction C)

| Critère | Évaluation |
|---|---|
| Fonction | Preuve vérifiable de la performance, à la place de chiffres déclaratifs |
| Coût | 2,3 Ko bruts, 1,1 Ko compressés |
| LCP, CLS | Aucun : les valeurs remplacent du texte de même gabarit (`tabular-nums`) |
| INP | Négligeable : des `PerformanceObserver`, pas de boucle |
| Repli | "n/d" quand l'API manque (Safari ne fournit pas toutes les mesures) |
| Risque | **Rend publique toute régression** : c'est voulu, mais le budget du §2 devient une obligation visible |

### 3.3 Spécimen interactif (dessin de zone, direction C)

| Critère | Évaluation |
|---|---|
| Fonction | Montrer une compétence réelle (interfaces cartographiques d'Omega) sans exposer de code interne |
| Coût | 1,3 Ko compressés, SVG, sans bibliothèque |
| Accessibilité | Utilisable au clavier (flèches, Espace, Entrée, Échap), annonces `aria-live` ; à faire valider avec un lecteur d'écran |
| Repli sans JS | Un polygone statique dessiné côté serveur et le texte explicatif |

### 3.4 Transitions de page

| Critère | Évaluation |
|---|---|
| Technique | View Transitions natives entre documents (`@view-transition { navigation: auto }`), sans JS |
| Coût | 0 Ko |
| Navigateurs sans support | Navigation classique, sans dégradation |
| `prefers-reduced-motion` | Désactivées |

### 3.5 Effets écartés

| Effet | Raison |
|---|---|
| Défilement lissé ou détourné (Lenis, Locomotive) | Lenis détecté sur 5 références sur 26, Locomotive Scroll sur une autre ; sur deux références, le défilement programmé (`scrollTo`, celui qu'utilisent ancres et outils d'assistance) reste bloqué à 0 et seule la molette fonctionne ; la référence sous Locomotive a un CLS de 0,39. Ces bibliothèques compliquent les ancres, la recherche dans la page et la navigation clavier |
| Three.js dans le bundle initial | Three 0.186.1 : 188 Ko compressés pour ses modules minifiés complets (`three.module` + `three.core`, mesuré sur jsDelivr), soit environ 65 fois le shader de 3.1. Le tree-shaking réduit ce chiffre, à mesurer sur la scène réelle. À reconsidérer uniquement pour une étude de cas qui en a besoin, en import dynamique |
| Vidéo d'arrière-plan | Principale cause des poids de 13 à 142 Mo observés |
| Écran de chargement (preloader) | Retarde volontairement le contenu ; plusieurs références restent sur ce écran en navigation automatisée |
| Curseur personnalisé, boutons magnétiques | Aucun rôle pour la compréhension, déjà associés à un gabarit très copié |

## 4. Règles de chargement progressif

1. Le HTML prérendu contient tout le contenu, tous les liens et l'adresse de contact.
2. Le CSS suffit à la mise en page finale : aucun élément n'est servi en `opacity: 0` en attendant un script (défaut constaté sur 6 des 9 portfolios de développeurs du groupe 2 de la recherche).
3. Les îlots s'hydratent `client:visible` ou `client:idle`, jamais `client:load` sans justification écrite.
4. La couche créative se charge après le LCP, après détection de capacités (`WebGL2`, `saveData`, `prefers-reduced-motion`, `deviceMemory` quand il existe), avec repli statique.
5. Un effet qui dépasse son budget est retiré, pas "optimisé plus tard".

## 5. Méthode et limites des mesures

- Outil : Playwright 1.61 (Chromium) depuis un poste sur fibre, **sans bridage réseau ni CPU**. Les valeurs servent à comparer, pas à prédire les Core Web Vitals réels.
- Poids : somme des réponses observées pendant 6 s après l'événement `load`. Les ressources chargées plus tard (défilement, interaction) ne sont pas comptées.
- WebGL : détecté en interceptant `getContext` ; les canvas rendus dans un Web Worker (`OffscreenCanvas`) ne sont pas vus. Active Theory affiche ainsi 0 contexte malgré son moteur WebGL.
- LCP à 0 : l'élément le plus grand est un canvas, que l'API LCP ignore.
- Aucune mesure sur appareil mobile réel : à faire pendant l'implémentation (un Android d'entrée de gamme, Chrome, via WebPageTest ou un appareil physique).
