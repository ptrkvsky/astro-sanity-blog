# Anthony Fu - https://antfu.me/

## Type et positionnement
Site personnel d'un développeur open source très connu (core team Vue, Nuxt, Vite ; créateur de Vitest, Slidev, VueUse, UnoCSS...). "Hey! I'm Anthony Fu, a fanatical open sourceror and design engineer." Le site est un hub : présentation, blog, projets, talks, photos, sponsors. La réputation vient des projets, le site les met en liste plutôt qu'en vitrine.

## Structure de la page d'accueil (sections dans l'ordre)
1. En-tête : signature manuscrite "af" animée (tracé qui se dessine) à gauche ; Blog, Projects, Talks, Sponsors, puis icônes (podcast, photos, démos, Bluesky, GitHub, RSS, thème clair/sombre).
2. h1 "Anthony Fu" + phrase de présentation.
3. Bloc "Working at / Creator of / Recent work / Core team of / Maintaining" : chaque projet en pastille avec son logo.
4. Trois paragraphes : passions, talks et blog, podcast, streams, art génératif (100.antfu.me), photo.
5. Séparateur court, "Find me on" (GitHub, Bluesky, Discord, Twitter x3 langues), e-mail en mono.
6. Séparateur, appel au sponsoring (boutons), licence CC BY-NC-SA, bouton retour en haut.

## Typographie
- JSON : `Inter` (texte, h1), `DM Mono` (e-mail, éléments code), `Roboto Condensed` (pastilles de projets, texte condensé gris).
- Échelle très resserrée : h1 ~36 px gras, texte ~17 px, pastilles ~15 px. Aucune typographie display. Un italique à empattement pour le nom du podcast.

## Palette et direction artistique
Fond blanc (transparent sur canvas, JSON `rgba(0,0,0,0)`), texte gris foncé (rgb 55,65,81), liens noirs soulignés en pointillés fins. Arrière-plan : champ de points gris clair animé (canvas). Logos colorés des projets comme seule couleur. Thème sombre disponible (bouton). DA minimaliste "document".

## Composition, grille et rythme
Colonne unique centrée d'environ 650 px, alignée à gauche ; aucune grille. Rythme de texte courant avec séparateurs courts centrés entre blocs. Très dense en liens.

## Comportement du défilement
Natif. Page courte (scrollHeight 1289 px desktop, la probe plafonne à 371 px). L'en-tête disparaît au défilement (s20, s70 : seule la signature reste, la navigation n'est plus visible) ; bouton flèche "retour en haut" en bas à droite.

## Transitions et micro-interactions
Observé : signature "af" qui se trace (capture focus : seulement un trait à 1 s ; capture desktop : signature complète) ; apparition en fondu échelonné des paragraphes (capture nojs : paragraphes inférieurs encore translucides, l'animation est donc en CSS et joue même sans JS) ; champ de points en arrière-plan (art génératif). Survols non observés.

## Technologies
**Confirmé**
- Vue (JSON `vue: true`), générateur statique `vite-ssg`, Vite, UnoCSS, markdown-it + `unplugin-vue-markdown`, Shiki (+ `@shikijs/twoslash`, `@shikijs/magic-move`), `feed` (RSS), `sharp` : `package.json` du dépôt public https://github.com/antfu/antfu.me.
- PixiJS pour l'arrière-plan : `pixi.js` dans le `package.json`, et le JSON liste des chunks `ArtDots-*.js`, `WebGLRenderer-*.js`, `getTextureBatchBindGroup-*.js`, `CanvasPool-*.js` (nomenclature PixiJS v8) ; 3 contextes WebGL/WebGL2 créés (JSON), pas de Three.js.
- Hébergement Netlify (`netlify.toml` du dépôt ; script `/.netlify/scripts/rum` dans le JSON) ; assets `/assets/*` en `Cache-Control: immutable` (netlify.toml).
- Widget Twitter `platform.twitter.com/widgets.js` chargé sur l'accueil (JSON).
- Article "Async, Sync, in Between" (curl) : prérendu complet en HTML (~12 600 caractères), 8 blocs de code Shiki colorés au build, 6 h2 / 4 h3 avec ancres "#", date et temps de lecture ("Mar 3, 2025 · 18min"), aucune démo interactive ni iframe.

**Hypothèse**
- Les animations d'entrée sont des classes CSS (type `slide-enter`) appliquées par le layout, d'où leur exécution sans JS.

## Mobile
Capture mobile : en-tête réduit aux icônes (Blog, Projects, Talks, Sponsors, Photos, Démos, thème), signature à gauche ; même colonne, pastilles de projets qui passent à la ligne proprement. Mobile-mid : liens sociaux et sponsoring lisibles. Excellent rendu, rien de spécifique à faire.

## Accessibilité et robustesse
- Focus : après 3 Tab, lien "Blog" avec `outline: none 3px` ; la capture focus ne montre pas d'indicateur visible sur "Blog". Focus visible absent ou imperceptible.
- Lien d'évitement : non (page courte, impact limité).
- Sans JavaScript : contenu complet (h1, 1345 caractères, 52 liens dans le JSON) ; la capture nojs montre les paragraphes en cours de fondu, le canvas de points absent.
- Reduced motion : capture reduced identique à la normale (signature complète, points présents) ; pas de traitement spécifique observable.
- Contraste : texte gris (rgb 55,65,81) sur blanc correct ; pastilles gris clair sur fond gris très clair plus faibles.

## Performance
Chiffres JSON (non bridé) : 1,7 Mo desktop / 0,88 Mo mobile ; JS 796 Ko desktop / 261 Ko mobile ; CSS 411 / 84 Ko ; images 380 Ko ; 55 requêtes, 9 hôtes ; LCP 948 ms desktop / 580 ms mobile ; CLS 0. L'écart desktop/mobile sur le JS et le CSS, à nombre de requêtes identique, suggère que le collecteur a mesuré une fois la taille décodée et une fois la taille transférée (compressée) : à interpréter avec prudence. Le widget Twitter et PixiJS pèsent plus que le contenu.

## Points forts UX
- Preuve d'expertise par les noms de projets eux-mêmes, en une phrase chacun : aucune mise en scène nécessaire.
- Rapide, lisible, entièrement statique, pages de blog prérendues avec coloration syntaxique au build (zéro JS pour lire un article).
- Le seul élément "créatif" (champ de points PixiJS) est discret, en arrière-plan, et renvoie à sa pratique d'art génératif (100.antfu.me).
- Code source public.

## Points faibles ou risques
- Focus clavier invisible sur la navigation.
- Script tiers Twitter sur l'accueil (poids, vie privée).
- Modèle non transposable tel quel : il repose sur une notoriété open source que la page n'a pas besoin de démontrer.

## Idées transférables au portfolio de Johan sans copier
1. Un bloc "pastilles" factuel (Travaille sur / A créé / Maintient / Écrit sur) avec logos : très efficace pour un recruteur, maintenance quasi nulle si alimenté par un fichier de données.
2. Un arrière-plan génératif léger (canvas 2D ou petite boucle WebGL) plutôt qu'une scène 3D lourde, désactivé en reduced-motion et en économie d'énergie.
3. Coloration syntaxique et ancres de titres au build (Shiki est natif dans Astro) : articles sans JS, ce qui sert à la fois la performance et le SEO.
4. Masquer l'en-tête au défilement et un bouton retour en haut : utile pour les longs articles de Johan.

## Niveau d'inspection
Consulté : JSON ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe (s20, s70, focus, reduced ouverts ; s0, s45, s95 non ouverts) ; `package.json` et `netlify.toml` du dépôt GitHub (curl) ; liste des articles et un article complet ("Async, Sync, in Between", curl). Non vu : pages Projects, Talks, Photos, thème sombre.
