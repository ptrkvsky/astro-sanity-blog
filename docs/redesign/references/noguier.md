# Robin Noguier - https://robin-noguier.com/

## Type et positionnement
Portfolio d'un "interactive designer" français basé au Portugal (page About), passé par Ueno, qui conçoit des produits et sites pour startups et marques (Airbnb, Google, Uber, Lonely Planet, Oculus cités sur About). Site de 2020 (dépôt Prismic nommé `robin-noguier-portfolio-2020`), toujours en ligne, devenu une référence de portfolio "slider WebGL". Le ton est humoristique et autodérisoire (messages de chargement, About plein de blagues), ce qui est son vrai différenciateur.

## Structure de la page d'accueil (sections dans l'ordre)
1. Écran de chargement : "Robin Noguier" en serif contour, "Interactive designer", bulle de message tournant ("The kind of designer you'd like to introduce to your parents", "Other people are watching this portfolio, reach out now! #darkpatterns").
2. Puis (vu seulement après 15 s d'attente avec rendu GPU logiciel) un slider plein écran de 9 projets : nom en haut à gauche, About à droite ; titre du projet en serif très gras ("Fun", "SnickSnack"...), une phrase de contexte, "Open case study →" ; vignette vidéo en bas à gauche ; image principale déformée en perspective courbe à droite (WebGL) avec l'image suivante en dessous ; pagination à points verticale à droite.
Il n'y a pas d'autre section : l'accueil est le slider.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Le JSON desktop ne liste aucune police (le chargement n'était pas terminé à la mesure) ; en mobile : `eksell_rm_large`, `eksell_rm_small` et `silka_rm`.
- Eksell (serif display très contrastée, gras) : titres de projets à ~110 px, nom en contour sur l'écran de chargement.
- Silka (grotesque géométrique) : texte de description ~20 px et libellés en capitales espacées ("OPEN CASE STUDY", "ABOUT").
- Pas de mono. Échelle : un titre énorme, un paragraphe, des micro-libellés.

## Palette et direction artistique
Une couleur de fond par projet (bleu ardoise pour "Fun", rose avec titre vert menthe pour "SnickSnack") ; l'interface entière (titre, flèche, liseré de vignette, point actif) prend la couleur d'accent du projet. Écran de chargement quasi noir (#0d0d0d). Esthétique produit/startup, colorée, photographique.

## Composition, grille et rythme
Composition en deux moitiés : texte à gauche aligné sur une marge de ~90 px, visuel WebGL à droite qui déborde vers le bas. Pagination verticale au bord droit. Un projet = un écran.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Détourné : `overflow: hidden` sur html et body (JSON), hauteur de document 900 px, scrollY toujours 0. Les captures de la sonde s0 à s95 montrent toutes l'écran de chargement (le site n'avait pas fini de charger en 5 s dans Chromium headless). Dans une session séparée (attente 15 s, rendu WebGL logiciel SwiftShader), 6 crans de molette font passer du projet 1 ("Fun") au projet 7 ("SnickSnack") : la molette pilote le slider. Mobile : plein écran sans défilement vertical (scrollH 844), points de pagination en haut, glissement horizontal (hypothèse sur le geste, non testé).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : messages de chargement qui changent, changement global de couleur d'accent entre projets, image en perspective courbe. Pendant la transition capturée, le titre et la couleur avaient changé mais l'image WebGL montrait encore l'ancien projet (transition en cours ou désynchronisation, non tranché).
- Son : la page About annonce "This website is not better with headphones but you can still put them on" et le bundle contient `AudioContext` ; non écouté.

## Technologies
**Confirmé**
- Next.js ancienne génération (JSON : next = true ; structure `_next/static/runtime/main-*.js`, `pages/index.js` sous l'identifiant de build, typique de Next.js 9).
- Three.js bundlé : chaînes `THREE` (534 occurrences) et `WebGLRenderer` dans `commons.js` (1,5 Mo non compressé). `window.__THREE__` absent donc non vu par le JSON, mais un contexte `webgl` est bien créé (JSON).
- Web Workers multiples (`*.worker.js` dans la liste des scripts), `createImageBitmap` et références à `OffscreenCanvas` dans le bundle : décodage d'images hors thread principal.
- CMS Prismic (vidéos et images servies depuis `robin-noguier-portfolio-2020.cdn.prismic.io`).
- Google Analytics (gtag).
**Hypothèse**
- Les 5,3 Mo de "media" desktop sont les aperçus MP4 des projets (fichiers `*-preview-compressed.mp4` référencés dans le HTML), chargés dès l'accueil.

## Mobile
Capture 390 px : version DOM sans WebGL (0 canvas), image en bandeau, vignette d'écrans d'app en surimpression, titre "Fun", description, "Open case study →", points de pagination horizontaux en haut. Propre et lisible ; la moitié basse de l'écran est vide. 49 images chargées.

## Accessibilité et robustesse
- Focus visible : non mesurable (la sonde testait pendant l'écran de chargement : aucun élément focalisé).
- Lien d'évitement : absent.
- Sans JS : écran noir (capture nojs) ; 73 caractères dans le HTML ("The designer you didn't know you needed.. until today", nom, About), aucun projet.
- Reduced-motion : capture identique (écran de chargement), non concluant.
- h1 : en desktop la liste contient "Fun" deux fois puis des h1 vides ; en mobile un h1 par projet (9 h1). Hiérarchie faible pour le SEO.
- Robustesse : en headless sans GPU, plus de 5 s sur l'écran de chargement ; un visiteur sur machine modeste risque la même attente.

## Performance
Sans bridage, valeurs relatives :
- Desktop : 6,59 Mo transférés (le plus lourd du groupe), dont media 5,29 Mo, JS 789 Ko, images 497 Ko ; 40 requêtes, 5 hôtes.
- Mobile : 1,85 Mo, JS 856 Ko, images 883 Ko, polices 93 Ko ; 71 requêtes.
- LCP 2396 ms desktop, 4340 ms mobile (le pire LCP mobile du groupe) ; CLS 0 / 0,006.

## Points forts UX
- Personnalité : l'humour des messages de chargement et de l'About rend l'attente et la lecture mémorables.
- Un projet = un écran avec une phrase de contexte claire (client, rôle, enjeu) et un appel "Open case study".
- Couleur d'accent par projet qui structure la navigation.
- Calcul lourd déporté en Web Workers.

## Points faibles ou risques
- Attente longue avant tout contenu, rien sans JS, LCP mobile > 4 s.
- 5 Mo de vidéos d'aperçu chargées d'emblée.
- Pile vieillissante (Next.js 9) : coût de maintenance d'un site "objet d'art".
- Molette détournée en desktop.

## Idées transférables au portfolio de Johan sans copier
1. Couleur d'accent pilotée par le projet affiché (variable CSS changée par projet) : effet fort pour un coût quasi nul, compatible Astro.
2. Une phrase de contexte par projet sur le modèle "client + rôle + résultat" avant le lien d'étude de cas ; Johan peut y mettre un chiffre de performance ou de SEO.
3. Du ton dans les micro-textes (chargement, 404, états vides) pour humaniser un profil technique, sans écran de chargement bloquant.
4. Charger les vidéos d'aperçu au survol ou à l'entrée dans le viewport (`preload="none"`, poster) au lieu d'un chargement massif initial ; à présenter comme un gain mesuré.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s0, s70, focus, reduced (toutes sur l'écran de chargement) ; session supplémentaire avec attente 15 s et molette (2 captures). HTML de l'accueil et de /about par curl ; bundles JS téléchargés et cherchés par mots-clés. Aucune page d'étude de cas ouverte.
