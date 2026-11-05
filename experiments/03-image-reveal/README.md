# 03 - Révélation tramée des images

**Effet étudié.** Quand une image entre dans l'écran, des points tramés apparaissent de haut en bas, avec un front irrégulier. Ils forment l'image en noir et blanc (phase "develop"), puis s'effacent sur l'image réelle (phase "resolve").

**Référence.** sebg.ch, dont le module `dither.*.js` a été exporté par REA puis lu. Il s'agit de Canvas 2D et non de WebGL, avec une matrice de Bayer 4x4 et des points de 2 px CSS. Une timeline GSAP joue les deux phases (0,6 s puis 0,7 s), le déclencheur est ScrollTrigger `top 88%` une seule fois, et le canvas est retiré à la fin. L'effet est entièrement désactivé en mouvement réduit. Voir `docs/redesign/technical-research.md` § 3.4.

**Ce que ce prototype corrige par rapport à la référence.**
- **Image visible par défaut** : sebg met `opacity: 0` sur l'image dès l'exécution du script, avant le déclencheur. Ici, l'image n'est masquée que si elle est **hors de l'écran** au moment de la préparation (25 % de hauteur d'écran avant son entrée). Une image déjà visible au chargement n'est jamais animée.
- **Pas de GSAP** : l'animation est une boucle `requestAnimationFrame` avec une courbe ease-in-out, et l'observation passe par deux `IntersectionObserver` (préparation, puis lecture à 12 % au-dessus du bas de l'écran).

**Technologie.**
- `?mode=2d` (défaut) : Canvas 2D. La luminance est calculée une fois sur une grille basse résolution, puis `putImageData` dessine chaque image d'animation, agrandie par `image-rendering: pixelated`.
- `?mode=webgl` : WebGL2. Le tramage est calculé par pixel dans un shader, avec un contexte par image libéré à la fin (`WEBGL_lose_context`).

## Paramètres modifiables

| Paramètre | Plage |
|---|---|
| Taille du point | 1 à 8 px |
| Durée totale | 300 à 3 000 ms |
| Mode | 2D ou WebGL |

Le bouton "Rejouer" agit sur l'image la plus visible.

## Mesures (Chrome 156 headless, 1 440 px, 5 images de 500 à 1 300 px de large)

| Mode | Préparation (moy. / max) | Image d'animation (moy. / max) | LoAF |
|---|---|---|---|
| Canvas 2D, CPU x1 | 25 / 74 ms | 0,38 / 1,3 ms | 0 |
| Canvas 2D, CPU x4 | 42 / 89 ms | 1,33 / 5,8 ms | 1 (51 ms) |
| WebGL2, CPU x1 | 36 / 59 ms | 0,02 / 0,1 ms (côté CPU) | 0 |
| WebGL2, CPU x4 | 64 / 85 ms | 0,06 / 1,0 ms (côté CPU) | 2 (max 60 ms) |

La préparation comprend le décodage, l'échantillonnage ou la texture, et la compilation du shader. En WebGL, le coût GPU n'est pas mesuré (rendu logiciel).

**Poids gzip.** Logique commune 2,0 Ko, plus 0,7 Ko pour le mode 2D ou 1,5 Ko pour le mode WebGL.

## Résultat du test visuel

| Cas | Résultat |
|---|---|
| 1 440 px, 2D et WebGL | Rendu identique : points épars (270 ms), trame complète (700 ms), puis image réelle qui se résout (1 800 à 2 100 ms pour 2 400 ms réglées) |
| Fin de séquence | 5 images révélées, 0 canvas restant, 0 image masquée |
| Mobile 390 px | 5 images révélées, pas de débordement |
| `prefers-reduced-motion: reduce` | Rien n'est préparé, images normales |
| JavaScript désactivé | Galerie complète |
| Sans WebGL (`--disable-3d-apis`, mode WebGL) | 5 replis, 0 image masquée, aucune erreur |

## Comportement responsive

La grille de 12 colonnes passe à 1 colonne en dessous de 40 rem. Le canvas prend la taille affichée de l'image au moment de la préparation : un redimensionnement pendant l'animation, qui dure 1,3 s, n'est pas géré.

## Limites connues

- Pendant 50 à 100 ms au début, le cadre est vide (couleur papier) avant les premiers points : c'est le départ de l'effet, mais il faut le savoir.
- Le tramage est en deux tons (encre et papier). Une variante en couleur d'accent est possible, mais n'a pas été testée.
- En WebGL, un contexte par image dépasserait la limite des navigateurs (environ 16) si beaucoup d'images se révélaient en même temps. Ici, au plus 2 sont actifs.
