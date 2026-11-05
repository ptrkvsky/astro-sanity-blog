# Bibliothèques des prototypes 2.3

Copies figées, servies telles quelles par le serveur local : les prototypes n'ont pas d'étape de build.

| Dossier | Origine | Licence | Poids (min / gzip -9) |
|---|---|---|---|
| `gsap-3.13.0/` | `node_modules/gsap/dist/` du dépôt (gsap 3.13.0, déjà en dépendance) : `gsap`, `ScrollTrigger`, `MorphSVGPlugin`, `DrawSVGPlugin`, `Flip`, `CustomEase` | GreenSock "Standard no charge license" (https://gsap.com/standard-license) : gratuite, y compris pour un usage commercial, greffons compris depuis la 3.13. Ce n'est pas une licence open source | 72 / 28 Ko (cœur), 44 / 18 Ko (ScrollTrigger), 17 / 7,5 Ko (MorphSVG), 4 / 2,2 Ko (DrawSVG), 25 / 9,6 Ko (Flip), 7 / 3,6 Ko (CustomEase) |
| `three-0.186.1/` | `npm pack three@0.186.1`, `build/three.module.js` réempaqueté en un seul module minifié par esbuild 0.25.9 (sans élagage) | MIT (`LICENSE`) | 742 / 189 Ko |

Les fichiers GSAP sont des scripts UMD : chargés par `<script>`, ils exposent `window.gsap`, `window.ScrollTrigger`, etc. Three.js est un module ES, résolu par une import map (`"three"`).

Le poids de Three.js après élagage (ce que produirait le build Astro) est mesuré à part sur la scène du prototype F : voir `docs/redesign/experience-signature.md`.
