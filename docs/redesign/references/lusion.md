# Lusion - https://lusion.co/

## Type et positionnement
Studio 3D et web interactif basé à Bristol (adresse en pied de page dans le HTML : Suite 2, 9 Marsh Street), fondé en 2017 par Edan Kwan (résultats de recherche citant Codrops). h1 : "We create 3D visual storytelling and interactive web experiences that help brands stand out". Le site v3 a obtenu Site of the Year et Developer Site of the Year aux Awwwards 2023 (https://www.awwwards.com/annual-awards-2023/site-of-the-year). Positionnement : studio de référence pour la 3D temps réel au service de marques (Porsche, Meta, Devin AI dans la liste de projets).

## Structure de la page d'accueil (sections dans l'ordre)
Observé (captures s45/s70 du second passage de probe) : en-tête avec mot-symbole "LUSION", h1 en ligne au centre-gauche, bouton rond "-" (son ou mode, non identifié), pilule sombre "LET'S TALK", pilule "MENU" ; dessous, une grande carte aux coins arrondis contenant la scène WebGL (amas de pièces en croix tubulaires blanches, noires et bleues, matières brillantes) ; repères "+" aux quatre coins et "SCROLL TO EXPLORE" ; barre de défilement personnalisée à droite.
D'après le texte HTML (curl), la suite de la page est : "Bold Ideas, Brought to Life" + paragraphe d'approche + "Our Approach" ; "Play Reel" ; "Featured Work" avec 12 projets (Oryzo AI, Atlas Motion, Devin AI, Of The Oak, Everswap, Porsche: Dream Machine, Synthetic Human, Meta: Spatial Fusion, Spaace, DDD 2024, Choo Choo World, Soda Experience) chacun avec ses disciplines ("concept • web • design • development • 3d • animation") ; "See all projects" ; un manifeste ("We do not chase trends...") ; "Is Your Big Idea Ready to Go Wild? Let's work together!" ; "CONTINUE TO SCROLL" ; pied de page (adresse, réseaux, e-mails, newsletter, lien R&D labs.lusion.co) ; "Keep Scrolling to Learn More About Us / Next Page" (transition vers la page suivante par le défilement). Ces sections n'ont pas été vues en image.

## Typographie
- JSON : `Aeonik` (texte et titres), `IBMPlexMono` et `LusionMono` (mono, chargées sur desktop seulement d'après le JSON ; le compteur de chargement "068" utilise une grotesque fine).
- Observé : h1 en Aeonik regular ~36 px, interlignage serré, aucun titre géant sur le premier écran ; libellés de boutons en capitales ~13 px. Hiérarchie portée par la scène plutôt que par la taille du texte.

## Palette et direction artistique
Fond lavande très pâle (rgb 240,241,250, c'est la valeur `bodyColor` du JSON, visible comme fond de page), texte quasi noir, carte de scène gris anthracite ; objets blanc, noir et bleu outremer saturé. Préchargeur noir et blanc. DA "objets produits" : matières CAO lisses, éclairage studio, très peu de couleurs.

## Composition, grille et rythme
Marges latérales ~72 px, la scène dans une carte qui reprend la largeur de la grille, repères "+" qui matérialisent une grille à 4 colonnes en bas d'écran. En-tête en trois zones (logo / h1 / actions). Composition très architecturée, beaucoup d'air autour de la carte.

## Comportement du défilement
Détourné : `body overflow: hidden/hidden`, scrollHeight = 900 (JSON), scrollY final 0 (probe). Le défilement est virtuel et piloté par la scène ; la barre de droite est un indicateur personnalisé (sa position ne bouge pas entre s45 et s70, car `scrollTo` n'a aucun effet). Les libellés "CONTINUE TO SCROLL" / "Keep Scrolling to Learn More About Us / Next Page" (HTML) indiquent qu'on passe d'une page à l'autre en continuant à défiler.

## Transitions et micro-interactions
Observé : préchargeur avec barre et compteur 000 à 100 en bas à gauche (captures data et probe) ; transition d'entrée en forme de "L" géant découpant la scène (capture data desktop, compteur à 100) ; objets 3D animés. Documenté (résultats de recherche, Awwwards) : curseur réactif et animations au défilement. Le reste n'a pas pu être vu : le rendu logiciel de Chromium headless (SwiftShader) est trop lent, une session dédiée avec défilement à la molette a expiré sur la capture d'écran.

## Technologies
**Confirmé**
- Astro : assets servis sous `/_astro/` (`hoisted.CUO_IjfL.js`, `about.CNa9RfUh.css`, HTML et JSON) ; un seul script applicatif.
- Three.js r158 (`window.__THREE__`, JSON), 1 contexte WebGL2 (JSON ; un second passage a vu `webgl2`, trois `2d`, puis `webgl2`).
- Vidéo hébergée sur Vimeo (scripts `player.vimeo.com`, JSON) pour le reel ; Cloudflare Turnstile (anti-robot, sans doute pour la newsletter/le contact) ; Google Analytics.
- Sitemap (`/sitemap-index.xml`, HTML).
- Contenu textuel complet dans le HTML statique (noJs : h1 + 2253 caractères + 28 liens).

**Hypothèse**
- Le préchargeur attend le chargement des modèles et textures avant de révéler la scène ; c'est lui qui retarde le LCP mobile.
- Le moteur de rendu (post-traitement, simulation) est développé en interne au-dessus de Three.js ; aucune documentation publique consultée ne le détaille.

## Mobile
Captures mobile et mobile-mid : préchargeur noir avec barre et compteur (028 puis 085) ; la page chargée n'a pas été vue en mobile. LCP mobile 6504 ms (JSON), contre 432 ms en desktop.

## Accessibilité et robustesse
- Focus : après 3 Tab, un `BUTTON` sans nom accessible (texte vide, pas d'aria-label lu) avec `outline: none 0px` ; la capture focus montre encore le préchargeur. Focus non visible et bouton non étiqueté.
- Lien d'évitement : non.
- Sans JavaScript : écran noir avec "000" (capture nojs) ; le texte (2253 caractères) et 28 liens sont dans le DOM mais masqués visuellement. Bon pour les robots, inutile pour un humain sans JS.
- Reduced motion : la capture reduced montre le préchargeur à 005 ; aucune variante observable.
- Robustesse : sur machine sans GPU, la scène ne se termine pas dans des délais raisonnables (constaté lors de nos tentatives : préchargeur bloqué à 068 au premier passage, capture expirée dans la session à la molette) et rien n'est proposé à la place.

## Performance
Chiffres JSON (non bridé) : 26,8 Mo desktop / 14,4 Mo mobile ; dont médias (vidéo) 13,7 Mo desktop / 4,4 Mo mobile, images 6,2 / 6,0 Mo, "other" 6,1 / 3,1 Mo (modèles, binaires), JS seulement 605 Ko, polices 185 Ko ; 127 / 99 requêtes, 8 hôtes ; LCP 432 ms desktop (probablement le compteur du préchargeur) / 6504 ms mobile ; CLS 0 ; `loadMs` 12 s desktop. Le JS est raisonnable : le coût est dans les assets 3D et la vidéo.

## Points forts UX
- Socle Astro avec tout le contenu en HTML (titres, projets, contact, adresse) : SEO et partage corrects malgré une expérience 100 % pilotée par la scène.
- JS applicatif léger (605 Ko pour une expérience de ce niveau) : la complexité est dans les shaders et les assets, pas dans un framework.
- Préchargeur honnête (pourcentage réel), composition du premier écran très lisible : message, appel à l'action, démonstration.

## Points faibles ou risques
- Défilement détourné, focus invisible, bouton sans nom, aucune variante reduced-motion observée.
- Plusieurs secondes de préchargeur avant tout contenu visible, 6,5 s de LCP mobile même sur fibre.
- 27 Mo sur desktop.
- Production d'équipe spécialisée 3D, non reproductible seul à ce niveau de finition.

## Idées transférables au portfolio de Johan sans copier
1. Le modèle "Astro + un seul script hoisted + Three.js" : c'est déjà la stack de Johan ; Lusion montre qu'elle tient au plus haut niveau, à condition de garder le contenu en HTML statique et de traiter la scène comme une île.
2. Mettre la scène dans une carte bordée à l'intérieur de la grille plutôt qu'en plein écran : le h1 et l'appel à l'action restent visibles et cliquables pendant le chargement, sans préchargeur bloquant.
3. Si préchargeur il y a, le limiter à la carte 3D (affichage d'une image fixe de la scène en attendant) au lieu de masquer toute la page.
4. Matières simples (plastique brillant, 3 couleurs) sur une géométrie répétée par instanciation : rendu "studio" obtenu avec un seul modèle et `InstancedMesh`, donc peu d'octets.

## Niveau d'inspection
Consulté : JSON ; captures desktop, mobile, mobile-mid, nojs (desktop-mid absente du dossier data) ; probe lancé deux fois (en parallèle puis seul ; s0, s20, s45, s70, s95, focus, reduced ouverts : s45 et s70 montrent la page chargée, les autres le préchargeur) ; session Playwright dédiée (liste des contextes WebGL, renderer SwiftShader, texte du DOM) ; tentative de capture avec défilement à la molette (échec, délai dépassé) ; HTML source (curl) ; résultats de recherche (Awwwards 2023, Codrops 2026 non ouvert). Non vu : les sections sous le héros, le menu, les transitions de page, la version mobile chargée.
