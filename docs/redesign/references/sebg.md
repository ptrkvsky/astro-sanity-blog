# Sebastien Graf - https://www.sebg.ch/

## Type et positionnement
Portfolio personnel d'un développeur frontend salarié (Liip, Lausanne). Accroche "I build websites that move.", meta description qui cite Jaeger-LeCoultre, IWC, Piaget, TL. Positionnement : développeur (pas designer) qui revendique "fast, accessible websites" et surtout "thoughtful motion and interaction design". Le ton est ludique et incarné par une mascotte 3D de l'auteur qui commente la visite.

## Structure de la page d'accueil (sections dans l'ordre)
1. Hero : nom + rôle en haut à gauche, bouton "Get in touch" en haut à droite, titre géant en bas à gauche, mascotte à droite avec bulle ("Hi, I'm Seb. Scroll down and I'll show you around." puis "Psst. You can grab me.").
2. Paragraphe de présentation (Lausanne, Liip, 4 ans, motion et interaction).
3. Trois études de cas mises en scène, chacune sur un fond de couleur dédié : Jaeger-LeCoultre (bleu nuit, maquette navigateur + téléphone), Respawwwn (lilas, jeu quotidien, carte à gratter "Scratch me" jouable), Sierre Anniviers (jaune, trois sites touristiques partageant un styleguide). La mascotte commente chaque projet dans une bulle.
4. "All work - 18 projects" : grille de cartes (3 colonnes puis 2 colonnes larges), visuels de mockups 3D photoréalistes, nom + année.
5. Footer noir "Got a project?" avec e-mail (copie au clic d'après les textes du DOM), LinkedIn, GitHub, "Dress me up", "Do a trick".

## Typographie
- JSON : "Space Grotesk Variable" (police du body) et "Funnel Display Variable".
- Rôle observé : Funnel Display pour le display (titre hero, titres de projets "Jaeger-LeCoultre", "All work"), très gros corps (environ 120 px sur desktop), interlignage serré, alternance graisse forte / graisse fine dans la même phrase ("websites that" gras, "move." maigre). Space Grotesk pour le texte des bulles, boutons et légendes.
- Pas de mono observée. Échelle très contrastée : display géant contre texte de bulle environ 24 px et légendes environ 14 px.

## Palette et direction artistique
Fond qui change par section : bleu électrique (rgb(34,97,233), couleur du body), bleu nuit, lilas, jaune, blanc cassé, noir. Texte blanc ou noir selon le fond. Bulles blanc cassé avec ombre portée tramée (motif de points), mot-clé coloré dans la couleur de la section. Effet de trame/dithering 1-bit sur la mascotte et sur certaines vignettes au survol ou à l'entrée (visible en s70/s95 : vignettes partiellement "pixelisées"). Lignes verticales fines de grille visibles en fond sur toute la page. DA cohérente : tramage rétro + couleurs franches + mockups photoréalistes.

## Composition, grille et rythme
Grille à 12 colonnes matérialisée par des filets verticaux (visibles dans toutes les captures, y compris sans JS). Hero en composition asymétrique (texte bas-gauche, personnage droite). Les cas d'étude alternent l'emplacement texte/visuel (JLC : titre à droite, bulle à gauche ; Respawwwn : titre à gauche, bulle à droite). Rythme : une section plein écran par projet, puis grille dense, puis footer. Marges latérales généreuses (environ 40 px).

## Comportement du défilement
- Défilement vertical long (scrollH 13 644 px desktop, 11 380 px mobile), pas horizontal.
- Lenis détecté (lissage). ScrollTrigger présent dans les scripts : déclenchements au scroll.
- Captures s0 à s95 : la mascotte reste à l'écran et change de position selon la section (droite dans le hero, gauche pour JLC, droite pour Respawwwn), puis se réduit en pastille ronde en bas à gauche dans "All work" et le footer. C'est un élément fixe/épinglé qui accompagne toute la page. Les changements de couleur de fond semblent liés à la section courante.
- Bouton son (muet) fixe en bas à droite.

## Transitions et micro-interactions
Observé dans le DOM et les captures : bulles de dialogue contextuelles (textes différents selon le moment : "Oh hi, you're back. Want the tour again?" pour un visiteur qui revient, "Ooh, mobile mode." au redimensionnement), mascotte saisissable ("grab me", "Hold me to pick me up" sur mobile), menu de tours (Dance, Punching bag, Panic, Fly, Vanish, Hiccup, Peekaboo, Selfie, Dizzy, Sneeze, Sulk), "Dress me up", carte à gratter qui fait deviner un jeu (Respawwwn), copie d'e-mail au clic avec retour "Copied!". Texte en révélation progressive dans les bulles (mots grisés en cours d'apparition en s20 et s45). Je n'ai pas déclenché moi-même ces interactions : je les déduis des textes présents et des états capturés.

## Technologies
**Confirmé**
- Astro v5.18.2 (meta generator dans le JSON) ; ClientRouter Astro (nom de script `ClientRouter.astro...js`) donc transitions de page Astro.
- Three.js r186 (window.__THREE__) ; un contexte WebGL2 créé ; 2 canvas.
- Lenis (détecté par la sonde).
- GSAP bundlé : scripts `ScrollTrigger.*.js` et `SplitText.*.js` (noms de fichiers, la sonde `gsap` global renvoie false car bundlé).
- Scripts nommés `dither.*.js`, `Mascot.astro...js`, `Guess.astro...js`, `textAnimations.*.js` : shader de tramage, mascotte, jeu de devinette, animations de texte.
- 3 vidéos, 43 images, 23 SVG dans le DOM desktop.
**Hypothèse**
- La mascotte est un modèle 3D rendu par Three.js avec un post-traitement de dithering (cohérent avec `dither.js` et l'aspect 1-bit).
- Le son est de l'audio interactif lié à la mascotte (bouton muet observé, fichiers non vérifiés).

## Mobile
Capture 390x844 : titre remonté en haut ("I build websites that move." sur 2 lignes), bulle "Psst. Hold me to pick me up." (texte adapté au tactile), mascotte en bas. Mi-page : maquette navigateur Respawwwn réduite, mascotte qui déborde en bas à droite, bande jaune de la section suivante. L'adaptation est réelle (copy et placement), pas un simple rétrécissement. LCP mobile nettement plus lent (4,9 s contre 1,3 s desktop).

## Accessibilité et robustesse
- Focus : après 3 Tab, focus sur la carte "Respawwwn 2025" de la grille "All work" avec `outline: auto 1px` ; la capture montre un rectangle fin noir visible mais discret. L'ordre de tabulation saute donc le hero et les études de cas (ou les liens "View project" ne sont pas dans les trois premiers) : à vérifier, mais c'est un signal.
- Pas de lien d'évitement.
- Sans JS : le DOM contient 1 796 caractères de texte et le h1, mais la capture sans JS est un fond bleu vide avec les filets de grille : le contenu est masqué visuellement (opacité initiale probablement) tant que le JS ne tourne pas. Bon pour le SEO, mauvais pour la robustesse.
- Reduced motion : la capture reduced est identique en mise en page au rendu normal (seul le texte de la bulle diffère, ce qui correspond au déroulé temporel du dialogue). Aucune différence observable ; la chaîne `prefers-reduced-motion` n'apparaît pas dans le HTML (elle peut exister dans le CSS/JS externes, non vérifié).

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 3,39 Mo transférés, JS 780 Ko, images 1,23 Mo, médias (vidéo) 1,20 Mo, polices 40 Ko, 45 requêtes, 1 hôte. LCP 1 272 ms, CLS 0.
- Mobile : 3,10 Mo, 49 requêtes, LCP 4 908 ms, CLS 0.
- Polices variables très légères (40 Ko pour deux familles). Tout est auto-hébergé (1 seul hôte).

## Points forts UX
- Un fil narratif réel : la mascotte "fait la visite" et donne une raison de scroller, avec un ton personnel et drôle.
- Les études de cas montrent le travail en contexte (maquettes navigateur + téléphone) avec une phrase de valeur par projet (multilingue/RTL, styleguide partagé, React livré en HTML/JS).
- Interactions jouables liées au projet présenté (carte à gratter pour un jeu de devinette) : la démo prouve la compétence.
- Couleur par projet qui structure la page sans navigation.
- Stack sobre et légère (Astro + îlots, polices variables auto-hébergées).

## Points faibles ou risques
- Contenu invisible sans JS malgré un HTML riche.
- Pas de différence observée en reduced-motion alors que le site est très animé.
- LCP mobile élevé (4,9 s sans bridage).
- Focus visible mais très fin ; pas de lien d'évitement.
- La mascotte permanente peut masquer du contenu (en s95 elle recouvre "Got a project?").

## Idées transférables au portfolio de Johan sans copier
1. Un "guide" narratif qui commente la page, mais en version sobre : des annotations techniques en marge (par exemple "LCP de cette section : x ms", "ce bloc est servi sans JS") qui jouent le même rôle de fil conducteur et prouvent l'expertise perf/SEO.
2. Une démo interactive par étude de cas, directement liée au problème résolu (pour un projet perf : un curseur avant/après sur le poids ou le LCP), plutôt qu'un effet décoratif.
3. Couleur ou ambiance propre à chaque projet, pilotée par variables CSS et scroll-driven animations natives, pour structurer la page sans menu.
4. Prévoir l'état initial visible sans JS (classes ajoutées par JS pour masquer avant animation, pas l'inverse).

## Niveau d'inspection
Home seule. Captures data (desktop, desktop-mid, mobile, mobile-mid, nojs) et probe (s0, s20, s45, s70, s95, focus, reduced) consultées. Texte du HTML lu via curl. Pas de page projet ouverte, interactions de la mascotte non déclenchées manuellement.
