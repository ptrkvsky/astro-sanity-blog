# Plan d'implémentation : Épreuve + Calage

**Statut : validé par Johan le 05/11/2026 (direction Épreuve, concept Calage). Lots 0 à 3 faits et fusionnés dans `main` (local, non poussé) ; vérifications du lot 3 passées le 05/11/2026 (voir ci-dessous) ; lots 4 à 7 (couche d'expérience) faits sur la branche `feat/experience` le 05/11/2026 (non fusionnés).**

Couche d'expérience mesurée en développement (Chrome, DPR 1) : 60 images/s sur un défilement complet avec le CPU bridé x4, 0 tâche longue (LoAF), CLS de 0,024 après remplacement des polices de repli par des métriques mesurées (0,43 avant), 67,6 Ko compressés de code (GSAP 55,7 Ko, notre code 11,9 Ko) pour un budget de 80 Ko. Niveaux `static` (aucun script), `lite` sans WebGL (repli `text-shadow`) et perte de contexte (`?simulate=lost`) vérifiés ; le bouton « Retirer la couche créative » libère le WebGL et tous les déclencheurs. Pas encore vérifié : build de production, Safari/iOS, Android réel, mobile en conditions réelles.

Vérifié sur l'accueil et les 5 autres pages (`/posts`, un article, une catégorie, `/mentions-legales`, `/plan-site`) à 360 px, en mouvement réduit : aucun débordement horizontal, aucun texte courant sous 4,5:1 de contraste, un seul h1 par page, aucune animation active ; accueil complète dans le HTML servi, sans JavaScript client ; lien d'évitement au premier Tab avec focus visible. Pas encore fait : parcours Tab complet, Safari/iOS, Android réel, lecteur d'écran.

Décisions de validation :
- Calage est retenu tel que recommandé (§ 6 de `experience-signature.md`), avec les deux reprises de la Vue éclatée : le bouton « retirer la couche créative » et le poids réel par poste.
- Les 4 fichiers de police (88,7 Ko) et le budget par couche de `performance-budget.md` (§ 6) sont acceptés.
- Le contenu de la nouvelle accueil est **en dur dans le code**, sans Sanity. Les textes marqués « texte provisoire » restent à valider.
- **L'identité Épreuve s'applique à tout le site, blog compris.** L'ancienne direction artistique n'est pas conservée. Dans un premier temps, le blog hérite des jetons (palette Tailwind remappée) et doit seulement rester lisible ; sa refonte approfondie fera l'objet d'un lot ultérieur, après le lot 3.

Références : `architecture.md` (arborescence, SEO, couches de rendu), `implementation-decisions.md` (D1 à D11), `performance-budget.md` (budget, § 6 par couche), `design-system.md` (jetons et composants), `experience-signature.md` (parcours, bilan technique), `prototypes/e-calage/` et `prototypes/epreuve/` (rendu et code cibles).

## 0. Préalables (bloquants)

| Préalable | Qui | Pourquoi |
|---|---|---|
| Validation de Calage, des 4 polices et du budget par couche | Johan | conditionne tous les lots (`experience-signature.md`, § 10) |
| Textes « provisoires » validés ou réécrits | Johan | lot 3 |
| Contenus des études de cas (rôle, période, ce qui peut être montré, résultat vérifiable) | Johan | `architecture.md` § 11 ; sans eux, les pages restent marquées « à fournir » (lot 9) |
| Liens LinkedIn et GitHub, disponibilité | Johan | contact et `sameAs` |
| Justificatifs des chiffres (note Trustpilot, etc.) ou accord pour les retirer | Johan | aucune donnée non sourcée en production |
| Export Search Console sur 16 mois | Johan | redirections et priorités SEO (`architecture.md` § 3.2) |
| Un iPhone, un Android d'entrée de gamme et un service de mesure | Johan | vérifications non faites en 2.3 (§ 3 ci-dessous) |

## 1. Découpage en lots

Chaque lot est une merge request autonome, livrable seule. Le site reste fonctionnel entre deux lots.

| Lot | Contenu | Dépend de | Critères de sortie |
|---|---|---|---|
| 0. Historique | Commiter `docs/redesign/`, `docs/redesign/prototypes/` et `experiments/`, aujourd'hui hors historique | | branche `docs/redesign` propre |
| 1. Jetons et polices | `prototypes/epreuve/tokens.css` et `base.css` portés dans la feuille globale ; 4 fichiers woff2 auto-hébergés (Instrument Serif romain et italique, PolySans Neutral déjà dans `public/assets/fonts/`, IBM Plex Mono) ; préchargement de la fonte de titre ; métriques de repli (`size-adjust`, `ascent-override`) | arbitrage polices | CLS de 0 au chargement sur 5 passages ; polices ≤ 88,7 Ko |
| 2. Gabarit et navigation | Refonte de `src/layouts/BaseLayout.astro` : bandeau, ligne d'édition, menu mobile en `<details>` (**retrait de GSAP** du bundle global), pied de page en `.astro` (remplace `src/components/Footer.tsx`), lien d'évitement | 1 | 0 Ko de JS au premier écran ; navigation au clavier ; aucun débordement de 360 à 1 440 px |
| 3. Accueil, couche de lecture | `src/pages/index.astro` suit le parcours de 2.3 : hero, 01 méthode (5 passes), 02 essais, 03 contrôle, 04 à propos, 05 bon à tirer. Chaque motif en **SVG à l'état final** (D9), h1 réel, HTML complet sans JavaScript | 2, textes validés | rendu conforme au prototype (captures comparées) ; page complète sans JS et en mouvement réduit |
| 3 bis. Blog en Épreuve | Refonte approfondie du blog (liste, article, catégorie) dans l'identité Épreuve : typographie de lecture, blocs de code, images. Avant ce lot, le blog hérite des jetons du lot 1 (palette Tailwind remappée) et reste lisible | 3 | contrastes ≥ 4,5:1 ; plus aucune classe de couleur Tailwind héritée de l'ancienne DA |
| 4. Couche d'expérience, socle | `capabilities.js` (niveaux `full`, `lite`, `static`, D10) et `boot.js` (attente du `load`, des fontes et d'un moment d'inactivité ; GSAP téléchargé en parallèle, exécuté dans l'ordre) portés depuis `prototypes/epreuve/` ; GSAP, ScrollTrigger, MorphSVG, DrawSVG auto-hébergés (versions de `prototypes/vendor/`) | 3 | LCP inchangé (le h1 en texte) ; aucun octet d'expérience avant l'inactivité ; budget § 6.2 de `performance-budget.md` |
| 5. Hero Calage | `text-raster.js`, `gl.js` et `e-calage/gl/press.js` : titre en WebGL au-dessus du h1 (`color: transparent`, D11), deux plaques, trame, pointeur ; épinglage à 65 % d'écran (niveau `full`) ; repli en `text-shadow` sans WebGL ou après perte de contexte | 4 | 60 images/s au CPU x4 ; alignement du titre vérifié à 1 440 et 390 px |
| 6. Repère et transformations | Repère en SVG (`<g>` réutilisé par `<use>`), relais du repère fixe pendant les trajets (D6 précisée), tête de lecture (01), compte-fils (02, second contexte WebGL créé à l'approche), gamme de contrôle (03, MorphSVG), folio (04), tampon (05, DrawSVG). **Créer les épinglages avant les autres déclencheurs** | 5 | les cinq passes se calent ; la fin résout le hero (tampon, calage à 100 %) |
| 7. Mesures réelles | Gamme de contrôle alimentée par Resource Timing, LoAF et CLS (poids, requêtes, JS, LCP, CLS, interaction) ; poids réel par poste (repris de F) ; bouton « retirer la couche créative » à la passe 05, qui libère réellement le WebGL | 6 | valeurs réelles affichées, « n/d » sans JS ; le bouton retire bien le contexte |
| 8. Corrections avant mise en ligne | Réduire l'ombre rouge des titres d'index hors repère (ou la réserver aux grands écrans) ; faire contourner le texte au repère pendant le trajet de 01 à 02 | 6 | revue visuelle à 1 440, 1 024 et 390 px |
| 9. Études de cas | Collection de contenu (MDX versionné), gabarit avec marge annotée, figures en planches, étiquettes de statut, redirections depuis les anciennes URL | 3, contenus | une étude de cas complète publiée ; données structurées valides |
| 10. Transitions et défilement hors accueil | `@view-transition` (D1), noms construits à partir du slug, règles de spéculation, `animation-timeline` pour les pages de lecture (D2) | 3, 9 | transitions actives dans Chrome, absentes en mouvement réduit ; site complet dans un navigateur sans support |
| 11. Contrôle du budget | Vérification automatique du poids et des Core Web Vitals **par couche** (lecture, expérience) en CI (Lighthouse CI ou `size-limit`, à choisir) | 3 | une MR qui dépasse le budget échoue |

## 2. Ordre et parallélisme

0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Le lot 9 peut démarrer dès que les contenus arrivent (il ne dépend que du lot 3), et le lot 10 vient après lui. Le lot 11 peut commencer dès le lot 3 pour mesurer chaque lot suivant.

Le site est publiable après le lot 3 (couche de lecture complète) : la couche d'expérience (lots 4 à 8) s'ajoute sans rien casser, et le niveau `static` reste toujours disponible.

## 3. Ce qui reste à vérifier pendant l'implémentation

Points non vérifiés en 2.3 (`experience-signature.md`, § 7).

| Point | Méthode | Lot |
|---|---|---|
| Safari et iOS : métriques de fonte du titre en texture (`fontBoundingBoxAscent`), épinglage et barre d'adresse | appareil réel ou service de test | 5, 6 |
| Android réel et écran à 120 Hz | Android de référence | 5, 6 |
| Décalage d'une image entre le repère fixe et les repères en ligne au moment du relais | vrai défilement tactile | 6 |
| Firefox : animations réelles (seules des captures statiques ont été faites) | navigateur réel | 6, 10 |
| Prérendu par règles de spéculation | Chrome normal, Application > Speculative loads | 10 |
| Lecteur d'écran (canvas `aria-hidden`, mesures en `output` et `aria-live`, index) | NVDA ou VoiceOver | 3, 7 |
| Rendu en haute densité (DPR 2) | captures en DPR 2 | 3 |

## 4. Hors périmètre

- Refonte du blog au-delà du gabarit commun (lots 1 et 2) : à planifier après l'accueil.
- Mode sombre : jetons prévus, réalisation à arbitrer.
- Nouveaux spécimens (dessin de zone d'Omega, scène de Draw me a Sheep) : un par étude de cas, après le lot 7.
- Vue éclatée (F) et Isohypses : non retenues.
