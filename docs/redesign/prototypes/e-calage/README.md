# Prototype E - "Calage" (mission 2.3)

La page est une épreuve d'imprimerie qu'on cale jusqu'au "Bon à tirer". Le motif central, un repère de calage imprimé en deux plaques (papier et rouge), parcourt la page : il se cale avec le titre, devient tête de lecture sur l'axe du pipeline de rendu, puis compte-fils sur un essai, se déroule en gamme de contrôle (les mesures réelles de la page) et se réenroule en tampon final. Concept, narration et évaluation : `docs/redesign/experience-signature.md`.

## Ouvrir

Depuis la racine du dépôt :

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

| Page | URL |
|---|---|
| Expérience complète (niveau choisi selon l'appareil) | http://127.0.0.1:8767/docs/redesign/prototypes/e-calage/ |
| Niveau forcé : complet, allégé (mobile), statique | `?tier=full`, `?tier=lite`, `?tier=static` |
| Sans WebGL (repli CSS du titre) | `?simulate=nogl` |
| Perte du contexte WebGL après 1,5 s | `?simulate=lost` |

La barre sombre en haut est un outil de prototype : elle affiche le niveau retenu et le temps de démarrage de la couche animée.

## Ce qui est réellement implémenté

| Moment | Technique |
|---|---|
| Titre du hero imprimé hors repère, tramé, puis calé au défilement (épinglé sur 65 % d'écran en niveau complet) | WebGL2 brut (`gl/press.js`) : texture du titre dessinée depuis les positions du DOM (`epreuve/text-raster.js`), trame à 45° et 15°, couverture moyenne par mipmaps, poussières, lignes de repère sous l'encre. Rendu à la demande. Repli : `text-shadow` décalé, piloté par le même défilement |
| Repère qui voyage entre les sections | Un repère en ligne par section ; un seul repère fixe (le "courrier") prend le relais pendant les trajets, entre deux rectangles mesurés à chaque image |
| 01 : axe dessiné par la tête de lecture, cinq passes qui se calent, compteur collant | ScrollTrigger (scrub), propriété `--axis`, plaques des repères animées |
| 02 : lignes de l'index qui se calent au survol ; compte-fils sur la capture de SAFTI.fr | CSS (`text-shadow`) ; second contexte WebGL2 créé à l'approche (IntersectionObserver), loupe guidée par le défilement ou le pointeur |
| 03 : anneau découpé en six arcs, déroulé en gamme de contrôle ; mesures réelles en dessous | MorphSVG (secteurs d'anneau et rectangles de même structure), DrawSVG, `shared/measure.js` |
| 05 : six cases réenroulées en anneau, texte du tampon, repère calé | MorphSVG, DrawSVG sur un masque, filtre SVG d'encre (`feTurbulence`) |

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page complète, contenu réel ; nouveaux textes marqués "texte provisoire" |
| `calage.css` | Composition, motif, états `.xp` (couche animée) et `.xp-gl` (titre en WebGL) |
| `calage.js` | Mesures, chargement différé, timelines ScrollTrigger, courrier |
| `gl/press.js` | Les deux rendus WebGL2 (titre, compte-fils) |
| `../epreuve/` | Socle commun à E et F : jetons, fontes, mise en page, détection des niveaux, chargement, texte en texture |
| `../vendor/` | GSAP 3.13.0 et Three.js 0.186.1 figés (voir son README) |
