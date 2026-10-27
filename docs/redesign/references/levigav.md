# Levi Gavrilut - https://levigav.com/

## Type et positionnement
Site personnel d'un jeune designer-développeur suisse ("Levi Gavrilut, 16. Designer and developer from Switzerland. Websites, web apps and small tools built with care.", meta description). Titre : "I build what I want to exist". Positionnement hybride : portfolio ("Builder", Work, After Hours) et récit personnel confessionnel (section "Gospel", parcours narratif biblique en chapitres numérotés). C'est autant une oeuvre d'auteur qu'une vitrine professionnelle. Trilingue EN / RO / DE.

## Structure de la page d'accueil (sections dans l'ordre)
Ce que j'ai vu à l'écran :
1. Porte 1, "Choose your edition" : écran scindé en deux. À gauche "Gold - the original" (gravure ancienne de paysage en sépia, serif élégant, bouton verre dépoli), à droite "Street - special edition" (graffiti rouge, ruban adhésif jaune, étiquette de vêtement "LVG Drop 001" avec code-barres, "Spray paint, stickers and Christian UK drill"). Raccourcis clavier G et S.
2. Porte 2, "Choose your language" : trois choix English / Română / Deutsch dans une barre en verre déformant (effet de réfraction animé), "Suggested" sur English, raccourcis 1/2/3, photo floue en fond et crédit "David Roberts, Jerusalem 1839".
3. Je n'ai pas pu franchir la seconde porte en navigation automatisée (rendu logiciel trop lent, navigateur fermé). Le reste vient du HTML et de la capture sans JS.
D'après le HTML (rendu serveur, toutes langues présentes) : header (Levi Gavrilut Builder, Home 01, Work 02, After Hours 03, Gospel 04, Contact 05, EN/RO/DE, son, édition, "Let's talk") ; "Prologue - best with sound", "Levi Gavrilut", "Faith. Code. A story.", "Play the intro or scroll at your own pace" ; chapitres numérotés : 02 Home (Suisse, Alpes bernoises en 3D, photo aérienne swisstopo), 03 Builder (entrepreneur, IA, "Late Night Build - Made with AI for this site, 2026"), puis 04 Code, 05 Sin, 06 Death, 07 Gethsemane, 08 The Cross... avec citations bibliques.

## Typographie
- JSON : Instrument Serif, Inter Variable (body), Geist Variable, JetBrains Mono Variable, et trois fontes propres "LVG Pick L", "LVG Pick Tag", "LVG Pick Stencil". Sept familles.
- Rôle observé : serif à contraste (Instrument Serif ou proche) en display pour "Gold" et les noms de langues ; graffiti (fontes LVG probablement) pour "Street" ; mono espacée en capitales pour les sur-titres ("ALEGE-ȚI EDIȚIA", "SUGGESTED", "DAVID ROBERTS - JERUSALEM 1839") ; sans grotesque (Inter/Geist) pour les boutons et la nav ; condensée type pochoir pour "EDIȚIE SPECIALĂ", "ALEGE STREET".
- Échelle : display environ 150 px pour "Gold"/"Street", 50 px pour les langues, mono 10-12 px.

## Palette et direction artistique
Deux directions artistiques complètes au choix, c'est le concept :
- Gold : sépia, brun, or, grain photographique, verre dépoli, lumière chaude.
- Street : noir charbon, rouge vif, jaune ruban, bleu du tag "LVG", textures papier et carton.
Grain/bruit global sur toute l'image. Effets de verre réfractif sur les boutons de langue. Très forte densité de détails (étiquette, code-barres, étincelles, coulures de peinture).

## Composition, grille et rythme
Porte 1 : diptyque vertical 50/50 avec bord de séparation granuleux, chaque moitié centrée sur son titre et son bouton. Porte 2 : composition centrée, barre horizontale à trois cases. Contenu (d'après la capture sans JS) : une colonne centrée d'environ 760 px avec grande image à coins arrondis, puis titre centré. Le contenu est découpé en chapitres numérotés (02 à 08 et plus).

## Comportement du défilement
- Lenis détecté (lissage). scrollH 2 156 px seulement en desktop : la hauteur de document est faible par rapport à la longueur du récit, ce qui suggère une narration pilotée (sections épinglées ou défilement virtuel). Hypothèse.
- Les captures s0 à s95 de la sonde montrent toutes la porte "Choose your edition" : l'écran de choix reste fixe au-dessus de la page qui défile dessous (scrollY final 1 193).
- "Play the intro or scroll at your own pace" : deux modes de lecture, automatique ou au scroll (texte du DOM).

## Transitions et micro-interactions
- Observé : textes de la porte 1 qui apparaissent et disparaissent (sur plusieurs captures les sous-titres et libellés de boutons sont vides, puis présents) ; étincelles dorées qui suivent la sélection ; barre de langues en verre avec distorsion animée (motif qui change entre captures) ; soulignement doré qui glisse sous la langue survolée.
- Déduit du DOM : bascule d'édition à tout moment (contrôle "Street edition" dans le header), bouton son, message "Welcome back" pour un visiteur qui revient.

## Technologies
**Confirmé**
- Next.js avec Turbopack (chunks `/_next/static/immutable/chunks/turbopack-*.js`).
- Three.js r186 ; quatre contextes WebGL créés (3 webgl2 + 1 webgl) ; 15 canvas.
- Lenis.
- Rendu serveur complet et trilingue : 13 909 caractères de texte et 33 liens sans JS, texte dans les trois langues présent dans le HTML.
- Sept familles de polices dont trois fontes propres "LVG Pick".
- Images générées par IA, déclarées comme telles ("Made with AI for this site, 2026") ; photo aérienne swisstopo pour la scène des Alpes en 3D.
**Hypothèse**
- Effet de verre réfractif et grain réalisés en shaders WebGL.
- Les 9 Mo "other" sur desktop correspondent à des modèles/textures 3D (scène des Alpes notamment).

## Mobile
Capture 390x844 : la porte d'édition passe en empilement vertical (Gold en haut, Street en bas), lisible, boutons pleine largeur. Poids mobile environ deux fois plus faible (6,8 Mo contre 13 Mo), ce qui indique un allègement volontaire des assets sur mobile. LCP mobile 2,0 s.

## Accessibilité et robustesse
- Focus : après 3 Tab, focus sur le bouton "Gold edition, the original..." (libellé accessible descriptif) ; `outline: none` mais un anneau blanc arrondi est clairement visible sur la capture (style de focus personnalisé). Raccourcis clavier documentés à l'écran (G/S, 1/2/3).
- Pas de lien d'évitement.
- Sans JS : la page s'affiche réellement (header complet, image du prologue, titre "Levi" en cours d'apparition, indicateur "000" en bas à droite) et les portes disparaissent : meilleure robustesse sans JS du groupe avec urbik.
- Reduced motion : la capture reduced montre la porte avec tous les textes affichés d'emblée (sous-titres et boutons libellés), alors que les captures normales les montrent en cours d'animation. Différence observable, mais l'expérience reste derrière deux portes.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 12,96 Mo transférés, JS 2,14 Mo, CSS 425 Ko (très élevé), polices 501 Ko, images 813 Ko, "other" 9,07 Mo, 62 requêtes, 2 hôtes. LCP 3 548 ms, CLS 0,016.
- Mobile : 6,77 Mo, LCP 1 996 ms, CLS 0,006.

## Points forts UX
- Idée forte et mémorable : choisir une "édition" du site (deux DA complètes), comme un produit en série limitée.
- Multilinguisme pensé : choix de langue explicite, suggestion, contenu traduit rendu côté serveur.
- Raccourcis clavier affichés et focus personnalisé visible.
- Contenu présent sans JS, allègement mobile.

## Points faibles ou risques
- Deux portes avant tout contenu : un recruteur pressé doit faire deux choix avant de voir un projet.
- Poids et complexité (7 familles de polices, 425 Ko de CSS, 4 contextes WebGL).
- Mélange portfolio et message confessionnel : très personnel, peut brouiller le message professionnel selon le public.
- Navigation automatisée très lente en rendu logiciel, signe d'une forte charge GPU.

## Idées transférables au portfolio de Johan sans copier
1. Un sélecteur d'"édition" ou de mode à faible coût, mais non bloquant : par exemple "version légère / version immersive" dans le header, la version légère étant la page par défaut, utile aussi comme démonstration de perf (poids affiché pour chaque mode).
2. Raccourcis clavier visibles à l'écran pour les actions principales, avec un focus personnalisé soigné.
3. Rendu serveur complet de toutes les langues (FR/EN pour Johan) et SEO multilingue propre (hreflang), en s'inspirant du fait que le contenu reste lisible sans JS.
4. Afficher les crédits des assets (photo, IA, données géographiques) dans un style mono discret, ce qui renforce la crédibilité d'un colophon.

## Niveau d'inspection
Home seule. Captures data (desktop, desktop-mid, mobile, nojs) et probe (s0, s20, s70, s95, focus, reduced) consultées ; test complémentaire Playwright : porte 1 franchie (choix Gold), porte 2 (langue) vue mais non franchie. Le contenu au-delà des portes n'a été vu que via le HTML et la capture sans JS. Pas de page Work ni projet.
