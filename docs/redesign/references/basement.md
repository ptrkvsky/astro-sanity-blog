# basement.studio - https://basement.studio/

## Type et positionnement
Studio digital et branding argentin (Mar del Plata, fondé en 2020 selon leur llms.txt), très lié à l'écosystème Vercel/Next.js (co-auteurs de la police Geist selon llms.txt). Ton volontairement provocateur : "A digital studio & branding powerhouse making cool shit that performs" (h1). Positionnement : la qualité d'exécution et la performance pour des clients tech (SpaceX, Vercel, Linear, Cursor... mur de logos).

## Structure de la page d'accueil (sections dans l'ordre)
Observé (captures desktop, s20, s45, s70, s95, mobile) :
1. En-tête fixe fin : logo, Home / Services / Showcase (26) / People / Blog (29) / Lab, bouton musique, "Contact Us". Compteurs en exposant à côté des rubriques.
2. Héros : scène 3D de leur propre local (escalier, mezzanine, borne d'arcade, panier de basket, écrans CRT, chien, personnage assis). Au chargement elle apparaît en fil de fer blanc sur noir avec un tramage pixelisé, puis texturée (capture focus, plus tardive).
3. Bloc texte h1 + accroche (visible sous la scène en mobile).
4. "Trusted by Visionaries" : grille 6 x 5 de logos clients en cartes noires bordées.
5. "Featured Projects" : liste de projets en lignes (visuel à gauche ~57 %, texte de résultat au centre, nom du client en gros à droite, catégorie "Websites & Features").
6. "Capabilities" : manifeste en très grand corps, puis quatre colonnes de services.
7. Appel au contact avec "hello@basement.studio" en très grand.
8. Mot-signature géant "BSMNT.26" en police étendue, puis pied de page.
En permanence : une pastille flottante en bas au centre "HUMAN | MACHINE".

## Typographie
- JSON : `Geist` (texte et titres), `Geist Mono` (pastille HUMAN/MACHINE, libellés), `flauta` (hypothèse : la police étendue de "BSMNT.26").
- Rôles observés : Geist en display serré (interlignage très faible sur le manifeste "We're here to create the extraordinary"), Geist en texte (descriptions de projets), mono en majuscules pour les métadonnées. Échelle très contrastée : environ 12-14 px pour la navigation, plus de 80 px pour les titres de section (le h1 desktop est déclaré en `lg:text-[5.4375rem]`, soit 87 px, HTML).

## Palette et direction artistique
Noir pur (#000) et blanc/gris clair, un seul accent orange-rouge (le mot "HUMAN" actif). Visuels de projets en couleurs pleines qui ressortent sur le noir. DA "underground tech", trame pixel, wireframe, humour (MrBeast, "cool shit").

## Composition, grille et rythme
Gouttières fines (~16 px), cartes bordées de 1 px gris foncé, grille à 6 colonnes pour les logos, lignes de projets en 3 colonnes asymétriques séparées par des filets horizontaux. Rythme : alternance blocs denses (logos, projets) et grandes respirations noires avec texte géant.

## Comportement du défilement
Natif : `body overflow visible`, scrollHeight 6714 px, la probe atteint scrollY 5523 (JSON + log). Pas de Lenis détecté. Captures s20 à s95 cohérentes avec un défilement document classique ; certains titres apparaissent pendant le défilement (texte partiellement superposé à l'en-tête en s20 et s95, signe d'animations d'entrée en cours au moment de la capture).

## Transitions et micro-interactions
Observé : chargement progressif du héros (wireframe tramé puis textures), animations d'entrée des textes au défilement, trame de points sur l'en-tête en s70. Un bouton "Turn music on" (log de navigation). Le reste (survols, transitions de page) n'a pas été observé.

## Technologies
**Confirmé**
- Next.js (JSON, chunks `_next/static/immutable` + `turbopack-*.js`) ; dépôt public du site : https://github.com/basementstudio/website-2k25, `package.json` : `next` 16.3.0, `react` 19.2.7, `three` ^0.180.0 (JSON : `__THREE__` = 180), `@react-three/fiber` 9 rc, `@react-three/drei` 10 rc, `@react-three/offscreen`, `@react-three/rapier` (physique), `@react-three/uikit`, `motion`, `zustand`, `sanity` / `next-sanity` (CMS, images servies par cdn.sanity.io dans le HTML), `@vercel/analytics` et `@vercel/speed-insights`. Scripts de build `assets:hash` / `assets:verify` pour les assets 3D.
- 2 contextes WebGL2 (JSON), 3 canvas desktop.
- Analytics Ahrefs (JSON).
- Vue "Machine" : `/ai/home`, miroir texte brut du site "for AI agents, crawlers, and humans who prefer it raw", et `/llms.txt` (HTTP 200, lu). La pastille HUMAN/MACHINE est un `<nav aria-label="Site mode">` avec un vrai lien (HTML).

**Hypothèse**
- `@react-three/offscreen` laisse penser qu'une partie du rendu peut tourner dans un worker via OffscreenCanvas ; le collecteur a pourtant vu 2 contextes sur le thread principal, donc au moins une partie reste classique.
- La scène du héros est la même que leur "Lab" (borne d'arcade, panier de basket interactifs).

## Mobile
Capture mobile : menu hamburger "Menu", scène 3D en wireframe recadrée en portrait sur ~80 % de la hauteur, h1 en dessous (très grand, 4 lignes), pastille HUMAN/MACHINE qui recouvre le texte. Mobile-mid : liste de projets en une colonne (visuel, nom, description), propre et lisible. Poids mobile quasi identique au desktop (30,8 Mo contre 33,5 Mo).

## Accessibilité et robustesse
- Focus : après 3 Tab, un `DIV` avec `outline: solid 2px` ; la capture montre un petit cadre en pointillés en haut à gauche, près du logo, peu lisible sur fond noir. Les liens ont `focus-visible:ring-1` (HTML).
- Lien d'évitement : non trouvé (ni dans la probe ni dans le HTML).
- Sans JavaScript : en-tête et pastille visibles, zone héros noire ; le JSON noJs compte quand même 2626 caractères, h1 présent et 75 liens : le contenu est rendu côté serveur mais une partie est masquée visuellement sans JS (hypothèse : opacité initiale des animations d'entrée).
- Reduced motion : capture reduced = héros entièrement noir à 5 s, en-tête présent. Pas de version statique visible ; impossible de dire si la scène est désactivée volontairement ou simplement pas encore chargée.
- Robustesse : la vue Machine est un vrai plan B textuel, accessible par un lien.

## Performance
Chiffres JSON (non bridé) : 33,5 Mo desktop / 30,8 Mo mobile ; JS 7,7 Mo desktop (7,4 Mo mobile) ; "other" 22 Mo (modèles, textures) ; images 2,8 Mo ; 306 requêtes, 6 hôtes ; LCP 424 ms desktop / 608 ms mobile ; CLS 0. Le LCP est bon parce que le h1 est servi en HTML ; le coût réel (JS et 3D) arrive après.

## Points forts UX
- Contenu commercial réel (logos, projets avec résultat chiffré, services, contact) disponible en HTML, la 3D étant une couche par-dessus.
- Défilement natif, page longue classique : prévisible.
- Vue "Machine" + llms.txt : idée forte et peu coûteuse pour le SEO et les agents IA.
- Code source public, ce qui sert aussi de preuve d'expertise.

## Points faibles ou risques
- Poids extrême (plus de 30 Mo, 7 Mo de JS) pour une page d'accueil, mobile compris.
- Dépendances en release candidate (R3F 9 rc, drei 10 rc) : maintenance exigeante.
- Pastille flottante qui masque du contenu en mobile.
- Indicateur de focus faible sur fond noir.

## Idées transférables au portfolio de Johan sans copier
1. Une vue "texte brut" du portfolio (page `/machine` ou `/index.txt` générée au build par Astro) + `llms.txt` : démonstration directe de sa compétence SEO technique, coût de maintenance nul si générée depuis les mêmes contenus.
2. Afficher d'abord la scène en wireframe léger puis charger les textures : la page est "vivante" immédiatement, le gros des octets arrive ensuite (et peut être différé ou omis sur mobile, contrairement à Basement).
3. Lignes de projets avec un résultat mesurable dans la description ("sold out inventory in hours") : pour Johan, des chiffres de performance (LCP avant/après, poids gagné) jouent le même rôle.

## Niveau d'inspection
Consulté : JSON ; captures desktop, mobile, mobile-mid, nojs (desktop-mid absente du dossier data) ; probe complet (s20, s45, s70, s95, focus, reduced ouverts ; s0 non ouvert) ; HTML source (curl) ; `package.json` du dépôt public GitHub ; `/llms.txt` et `/ai/home` (curl). Non vu : pages internes (Lab, Showcase), survols, son.
