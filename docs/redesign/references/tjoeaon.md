# Fabian Tjoe-A-On - https://fabiantjoeaon.com/

## Type et positionnement
Portfolio d'un "Creative technologist" (direction créative et technique). Accroche : "Creative and technical direction, analog heart with exceptional digitalism." Le JSON-LD Person liste `knowsAbout` : creative development, technical direction, WebGPU, WebGL, Three.js, real-time 3D, shaders, audio. Références clients de premier plan dans la liste de projets : The Wall Street Journal, Spotify (Wrapped 2022, Made To Be Found, Album Ranker), Dior, Google, Marriott, Audemars Piguet. Le site s'annonce lui-même comme "a real-time WebGPU experience" avec son ("Every visit sounds a little different.").

## Structure de la page d'accueil (sections dans l'ordre)
Ce que j'ai réellement vu :
- Chemin de repli (Chromium headless sans adaptateur WebGPU, captures data et probe) : nom + "CREATIVE TECHNOLOGIST" en haut à gauche ; étiquette "WEBGPU REQUIRED" ; h1 "This portfolio is a real-time WebGPU experience." ; accroche ; explication technique ("WebGPU is available, but no compatible graphics adapter was found...") ; liste de 12 projets (nom + client en mono + année) ; lien About ; e-mail en bas à gauche.
- Chemin WebGPU (test complémentaire avec adaptateur logiciel SwiftShader) : grille de croix et coins en fond, compteur de chargement géant centré ("069" puis "100"), statut "[ ALMOST THERE... ]" puis "[ READY ]" en bas à gauche avec barre de progression ; puis écran d'entrée "Every visit sounds a little different." avec deux choix "[ ENTER WITH SOUND ]" / "[ ENTER WITHOUT SOUND ]".
- Je n'ai pas pu entrer dans l'expérience elle-même (clic sur "Enter without sound" expiré en rendu logiciel). Le contenu 3D réel n'a donc pas été vu.

## Typographie
- JSON : "Suisse Intl" (body) et "Space Mono". Le HTML précharge `/assets/fonts/msdf/SuisseIntl/...otf` et `/assets/fonts/msdf/SpaceMono/...ttf` : ce sont des polices destinées à un rendu MSDF (texte dessiné dans le GPU).
- Rôle observé : Suisse Intl en texte et titres (h1 environ 30 px, compteur de chargement géant environ 200 px), Space Mono en petites capitales espacées pour les métadonnées (client, année, statuts entre crochets "[ READY ]"). Duo grotesque + mono très "interface technique".
- Échelle : peu de niveaux (méta environ 10 px, texte 17 px, h1 30 px), sauf le compteur.

## Palette et direction artistique
Noir pur (#000) et blanc cassé (rgb(243,243,239)), gris pour le texte secondaire. Aucune couleur d'accent observée. DA "terminal / instrument de mesure" : crochets, statuts en capitales mono, filet horizontal, grille de croix de repérage en fond pendant le chargement. `color-scheme: dark` déclaré.

## Composition, grille et rythme
Repli : colonne unique alignée à gauche (marge environ 43 px), large vide à droite, e-mail ancré en bas. Chargeur et écran d'entrée : composition centrée, coins réservés à l'identité (haut gauche) et au statut (bas gauche). Pas de défilement.

## Comportement du défilement
Aucun défilement de page (scrollH = 900, body `overflow-y: hidden`). Les captures s0 à s95 sont identiques (page de repli). Le comportement dans l'expérience WebGPU n'a pas été observé.

## Transitions et micro-interactions
Observé : compteur de chargement qui monte en chiffres (rouleaux de chiffres 0-9 dans le DOM, donc probablement un compteur à tambours), disparition de la grille de croix à 100 %, écran de choix du son. Le reste (transitions entre projets, audio) n'a pas été observé.

## Technologies
**Confirmé**
- Three.js r186 (window.__THREE__) chargé même sans adaptateur.
- WebGPU : le site le déclare (h1, message d'erreur d'adaptateur, JSON-LD `knowsAbout`) ; avec un adaptateur logiciel, `navigator.gpu.requestAdapter()` renvoie un adaptateur et l'expérience passe le chargement.
- Aucun contexte WebGL créé sur la page principale (`webgl: []`, 0 canvas), et le HTML précharge `offscreen-*.js` dans un `<template id="worker-prefetch">` : rendu dans un Web Worker via OffscreenCanvas (invisible pour la sonde getContext).
- Loaders Three préchargés : GLTFLoader, DRACOLoader, KTX2Loader, EXRLoader, décodeur meshopt.
- Polices MSDF (chemins `/assets/fonts/msdf/`).
- Build Vite probable (bundle unique `assets/index-<hash>.js`, convention Vite) : à classer en hypothèse forte plutôt qu'en confirmé.
- Google Analytics (gtag).
- SEO soigné dans le `<head>` : canonical, robots, Open Graph complet, Twitter card, JSON-LD WebSite + Person + WebPage.
**Hypothèse**
- Audio génératif ("Every visit sounds a little different") synthétisé côté client.
- Le texte du site est rendu en MSDF dans la scène WebGPU, d'où la nécessité d'une couche DOM de repli séparée.

## Mobile
Capture 390x844 (sans adaptateur) : même page de repli, bien adaptée (h1 sur 2 lignes, liste de projets lisible, e-mail en bas). Le message recommande explicitement "a desktop" : l'expérience principale semble pensée pour desktop.

## Accessibilité et robustesse
- Focus : après 3 Tab, focus sur l'e-mail avec `outline: solid 1px`, cadre blanc bien visible (capture focus). Seuls 3 liens dans le DOM : les noms de projets de la liste de repli ne sont pas des liens.
- Pas de lien d'évitement.
- Sans JS : HTML vide (`<div id="app">`), 0 caractère, capture noire. Le JSON-LD et les meta restent présents pour les robots.
- Reduced motion : capture identique à la page de repli (pas d'adaptateur), donc non concluant.
- Point positif rare : un vrai repli explicite et honnête quand la technologie manque, avec le contenu essentiel (liste de projets, contact).

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop et mobile (repli) : 2,40 Mo, dont JS 1,99 Mo (bundle unique très lourd), polices 359 Ko (fichiers OTF/TTF bruts pour MSDF), CSS 49 Ko, 0 image, 17 requêtes, 3 hôtes. LCP 1 316 ms desktop, 2 172 ms mobile, CLS 0.
- Ces chiffres ne mesurent que le repli : les assets 3D (glTF, KTX2, EXR) de l'expérience WebGPU ne sont pas comptés.

## Points forts UX
- Positionnement technique assumé et cohérent (WebGPU, son, MSDF), appuyé par des clients majeurs.
- Écran d'entrée qui donne le choix du son : respect de l'utilisateur.
- Repli lisible, typographiquement soigné, avec la liste des références.
- Métadonnées SEO et données structurées complètes malgré une SPA vide.

## Points faibles ou risques
- Sans WebGPU (navigateurs anciens, machines sans accélération, robots), on n'a qu'une liste sans liens vers les projets.
- 2 Mo de JS avant même l'expérience ; contenu HTML vide sans JS.
- Projets non cliquables dans le repli : impasse pour un recruteur sur un poste non compatible.
- Expérience présentée comme "desktop" : le mobile est de seconde classe.

## Idées transférables au portfolio de Johan sans copier
1. Le principe du repli explicite, mais inversé : un HTML statique complet (Astro) qui est l'expérience de base, et une couche WebGL/WebGPU qui s'ajoute seulement si `navigator.gpu`/WebGL et `prefers-reduced-motion: no-preference` sont présents, avec une phrase qui dit au visiteur ce qu'il voit et pourquoi.
2. Statuts en mono entre crochets ("[ READY ]", "[ LCP 0.9 s ]") comme langage graphique : transposable pour afficher des métriques réelles de la page.
3. Rendu dans un Worker via OffscreenCanvas pour garder le thread principal libre, argument perf démontrable (INP).
4. JSON-LD Person avec `knowsAbout` précis : utile pour le SEO de Johan (React, Next.js, Astro, Core Web Vitals, SEO technique).

## Niveau d'inspection
Home uniquement. Captures data (desktop, mobile, nojs ; desktop-mid et mobile-mid identiques au haut car pas de scroll) et probe (s20, focus, reduced) consultées : toutes montrent le repli sans WebGPU. Test complémentaire avec Chromium + WebGPU logiciel (SwiftShader) : chargeur et écran d'entrée vus, expérience 3D non atteinte. HTML lu via curl. Pas de page projet ni About.
