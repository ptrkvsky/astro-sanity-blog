# Expériences techniques (mission 2.1)

Micro-prototypes indépendants qui valident, dans un vrai navigateur, les mécanismes retenus après l'inspection des références (`docs/redesign/technical-research.md`). Ils ne font pas partie du site : ce dossier est hors de `src/` et de `public/`, Astro ne le construit pas et il n'est jamais publié.

## Ouvrir

Depuis la racine du dépôt (les prototypes chargent la police depuis `public/` et GSAP depuis `node_modules/`) :

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Puis http://127.0.0.1:8766/experiments/

Un serveur est nécessaire : les modules JavaScript et le worker ne se chargent pas en `file://`.

## Contenu

| Dossier | Mécanisme | Technologie | Code propre (gzip) |
|---|---|---|---|
| `01-view-transitions/` | Index -> étude de cas, la capture et le titre se déplacent | View Transitions entre documents, règles de spéculation | 1,2 Ko de CSS, 0 Ko de JS nécessaire |
| `02-scroll-driven/` | Planches qui passent sur un titre épinglé, barre de progression, inclinaison selon la vitesse | CSS `animation-timeline` (variante GSAP pour comparer) | 1,2 Ko de CSS + 0,8 Ko de JS facultatif |
| `03-image-reveal/` | Révélation tramée d'une image à l'entrée dans l'écran | Canvas 2D ou WebGL2, sans bibliothèque | 2,6 Ko (2D) ou 3,5 Ko (WebGL) |
| `04-worker-specimen/` | Spécimen WebGL chargé au clic, rendu hors du fil principal | WebGL2 + OffscreenCanvas dans un Web Worker | 5,6 Ko, chargés au clic seulement |

`shared/` contient la feuille de base (jetons de la direction C) et les instruments (`bench.js`). Ceux-ci ne font pas partie des effets : ils ne sont pas comptés dans les poids ci-dessus.

## Instruments

Le panneau noir en bas à droite affiche les images par seconde de la page, les frames d'animation longues (LoAF, plus de 50 ms), le CLS, et les valeurs propres à chaque prototype. Tout est aussi exposé dans `window.__bench` (et `window.__vt`, `window.__reveal`, `window.__specimen`) pour la vérification automatisée.

Le compteur d'images par seconde tourne en continu : il coûte une callback `requestAnimationFrame` par image. Ce coût ne doit pas être confondu avec celui de l'effet mesuré.

## Images

- `assets/projet-*` : captures des sites livrés (SAFTI.fr, Bien Estimer, Join SAFTI, ALS Action Canada) prises le 27/10/2026, en 1 440 et 390 px. Les panneaux de consentement ont été retirés du DOM avant la capture, sans rien accepter. Draw me a Sheep n'a pas pu être capturé : en navigateur automatisé (rendu WebGL logiciel), la page reste noire.
- `assets/planche-*`, `assets/atelier-portrait-*` : **images générées** (OpenAI `gpt-image-2`, qualité moyenne, 5 appels, 27/10/2026), utilisées comme visuels de test. Elles ne doivent jamais être présentées comme des captures de projets réels.
- Toutes les images sont en AVIF et WebP, en 390, 800 et 1 440 px de large.
- `04-worker-specimen/relief-poster.*` : rendu du shader lui-même, servant d'image de repli.

## Méthode de vérification et limites

Vérification avec Playwright 1.61, piloté sur Chrome 156 headless via CDP :

- **Viewports** : 1 440 x 900 et 390 x 844.
- **Conditions** : JavaScript désactivé, `prefers-reduced-motion: reduce`, Chrome lancé avec `--disable-3d-apis`, clavier.
- **CPU** : bridé à x4 via `Emulation.setCPUThrottlingRate`.
- **Mesures** : LoAF, Event Timing, `Performance.getMetrics`.

Limites :

- **WebGL** : il est rendu en logiciel (SwiftShader). Les temps GPU ne sont pas représentatifs, et le coût de WebGL sur le fil principal est surestimé.
- **Appareil** : aucun appareil réel n'a été utilisé. Un test sur un Android d'entrée de gamme reste à faire.
- **Captures** : une capture CDP en 1 440 px prend 150 à 200 ms. Les rafales d'images ne montrent donc que quelques états intermédiaires.
- **Prérendu** : les règles de spéculation ne s'activent pas en navigation pilotée. Le prérendu n'a donc pas été vérifié.
