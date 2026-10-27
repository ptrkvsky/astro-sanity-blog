# Active Theory - https://activetheory.net/

## Type et positionnement
Studio de production interactive fondé en 2012, réputé pour ses expériences WebGL temps réel. La meta description (lue dans le HTML via curl) : "Founded in 2012. We blend story, art & technology [...] Our industry-leading web toolset consistently delivers award-winning work through quality & performance". Le site vitrine est lui-même une démonstration de leur moteur maison.

## Structure de la page d'accueil (sections dans l'ordre)
Non observable dans cette inspection. Dans Chromium headless, le site affiche uniquement un écran "YOUR BROWSER IS NOT SUPPORTED" (titre de document "Not Supported", h1 "Your browser is not supported", 0 lien) posé sur une image de fond pré-rendue (`unsupported-bg.jpg`, ~190 Ko) : logo "a" chromé dans un anneau, méduse, particules bleues et dorées. Aucune section, navigation ni projet n'a pu être vu.

Explication vérifiée (lecture du bundle `app.1780406240914.js`, 1,8 Mo) : le framework maison contient un module `GPUBlocklist` qui compare le nom du GPU (`WEBGL_debug_renderer_info` / `UNMASKED_RENDERER_WEBGL`) à une liste noire incluant `"swiftshader"`, `"basic render driver"`, `"generic renderer"`, de vieux Radeon/GeForce/Mali. Notre Chromium headless rend via SwiftShader (rendu logiciel, renderer constaté : "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device ...))"). Le site refuse donc de démarrer et sert son écran de repli. Un second essai avec un user-agent Chrome standard (sans "HeadlessChrome") donne le même résultat : c'est bien le GPU qui est filtré, pas l'UA.

## Typographie
- Détectée (JSON) : `nbarchitekt` (NB Architekt, police géométrique "techno", chargée en `@font-face` inline dans le `<style>` du HTML), repli Helvetica/Arial.
- Rôle observé : uniquement le message d'erreur en capitales espacées, style display/mono. Échelle non observable.

## Palette et direction artistique
Sur l'écran de repli : fond bleu nuit quasi noir, matières chromées irisées, particules bleues et dorées, ambiance "abysses". `theme-color` #000000, `background:#000` sur html/body/#Stage (CSS inline). C'est tout ce qui est observable.

## Composition, grille et rythme
Composition centrée sur un objet 3D unique (dans l'image de repli). Le CSS inline fixe `html, body, #Stage { width:100%; height:100%; overflow:hidden; touch-action:none }` : la page entière est une scène plein écran, pas une page HTML à grille.

## Comportement du défilement
Détourné par conception : `overflow:hidden` et `touch-action:none` sur html/body (CSS inline, constaté). Les captures s0 à s95 sont identiques (écran de repli, scrollHeight = 900). Aucun défilement natif ; la navigation réelle est gérée par le moteur (hypothèse : molette/drag captés par la scène).

## Transitions et micro-interactions
Non observables (application non démarrée).

## Technologies
**Confirmé**
- Framework maison "Hydra" : présent dans le bundle (`Class((function Hydra(){...`, 178 occurrences) ; documenté publiquement par le studio : "The Story of Technology Built at Active Theory" (Medium, https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4) décrit Hydra comme framework JS développé depuis 2012, avec un moteur 3D maison ("Hydra 3D Engine [...] optimized for maximum graphics throughput with reduced CPU usage"), un éditeur de scènes (Hydra GUI) et un outil de particules.
- Pool de Web Workers : 8 chargements de `assets/js/hydra/hydra-thread.js` (JSON, liste des scripts), classe `Thread` créant `new Worker(Thread.PATH + "/hydra-thread.js")` (bundle).
- OffscreenCanvas utilisé (bundle : `new OffscreenCanvas(...).getContext("webgl")` pour des traitements de textures et la détection de capacités).
- Liste noire de GPU incluant SwiftShader (bundle, module `GPUBlocklist`) et détection fine des GPU Apple par mesure de temps ou hash (bundle : `Device.graphics.webgl.gpu = "apple a15"`, etc.).
- Google Analytics (gtag) (JSON).
- Pourquoi le JSON affiche 0 contexte WebGL : (1) l'application n'a jamais démarré son rendu, à cause de la liste noire ; (2) même en fonctionnement normal, le patch `HTMLCanvasElement.prototype.getContext` ne voit pas les contextes créés via `new OffscreenCanvas()` ni ceux d'un worker : la détection de capacités d'Active Theory passe précisément par OffscreenCanvas. Le "0" n'indique donc pas l'absence de WebGL.

**Hypothèse**
- Le rendu principal utilise le moteur Hydra plutôt que Three.js : le code teste `window.THREE ? new THREE.PerspectiveCamera(...) : new PerspectiveCamera(...)`, ce qui suggère une API compatible Three.js mais une implémentation propre.
- Une partie du travail (chargement, parsing, peut-être physique) est déportée dans les workers Hydra.

## Mobile
Capture mobile 390x844 : même écran "not supported" recadré en portrait, image de repli adaptée. Le viewport impose `maximum-scale=1.0, user-scalable=no` (HTML) : zoom désactivé, mauvais point d'accessibilité.

## Accessibilité et robustesse
- Focus : après 3 Tab, aucun élément focalisé (`aucun`), 0 lien dans la page de repli.
- Lien d'évitement : non.
- Sans JavaScript : "Please enable javascript" en texte brut sur fond noir (capture nojs) ; 24 caractères, aucun h1, aucun lien.
- Reduced motion : capture identique à la version normale (écran de repli), donc non évaluable.
- Robustesse : la stratégie "liste noire GPU + écran de refus" garantit que personne ne voit une version saccadée, mais exclut entièrement les machines sans accélération (VM, postes d'entreprise, certains navigateurs headless donc aussi certains robots d'indexation qui exécutent le JS). Le HTML contient tout de même title, description, canonical et Open Graph complets : le partage social et l'extrait SERP fonctionnent.

## Performance
Chiffres du JSON (Chromium non bridé, fibre ; valeurs relatives et ici non représentatives puisque seule la page de repli a été servie) : 949 Ko transférés, dont 721 Ko de JS, 187 Ko d'image, 19 Ko de police ; 20 requêtes, 3 hôtes ; LCP 2276 ms desktop / 2216 ms mobile ; CLS 0. Le poids réel de l'expérience (modèles, textures) n'a pas été mesuré.

## Points forts UX
- Écran de repli soigné et cohérent avec la marque plutôt qu'une page cassée.
- Métadonnées SEO/sociales complètes dans le HTML statique malgré une application 100 % canvas.
- Outillage interne mûr (détection GPU par modèle, threads) : la performance est traitée comme une contrainte d'ingénierie, pas comme un réglage.

## Points faibles ou risques
- Exclusion totale des configurations sans GPU accepté, sans version dégradée ni contenu HTML (projets, contact) consultable.
- Aucun contenu sans JS, aucun lien crawlable, zoom bloqué.
- Dépendance à un framework propriétaire maintenu par une équipe entière : modèle impossible à reproduire seul.

## Idées transférables au portfolio de Johan sans copier
1. Prévoir explicitement un "mode sans WebGL" : détecter l'absence d'accélération (renderer SwiftShader / `failIfMajorPerformanceCaveat: true` à la création du contexte) et servir une image ou une vidéo pré-rendue de la scène à la place du canvas, mais en gardant le contenu HTML complet autour (ce qu'Active Theory ne fait pas).
2. Garder toutes les métadonnées (title, description, canonical, OG) dans le HTML statique quel que soit le rendu : Astro le fait nativement.
3. Déporter le décodage d'assets lourds dans un worker (ou utiliser les loaders Three.js qui le font déjà, comme KTX2/Draco/Meshopt) plutôt que de bâtir un pool de threads maison : même bénéfice, coût de maintenance faible.

## Niveau d'inspection
Consulté : JSON de mesure ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe complet (s0 à s95, focus, reduced : tous identiques à l'écran de repli) ; second passage Playwright avec user-agent standard et lecture du renderer WebGL ; HTML source et bundle `app.*.js` téléchargés et analysés (recherche de `swiftshader`, `Hydra`, `OffscreenCanvas`, `Worker`) ; article Medium du studio repéré via recherche web (résumé du moteur de recherche, page non ouverte). Non vu : le site réel tel qu'un visiteur avec GPU le voit.
