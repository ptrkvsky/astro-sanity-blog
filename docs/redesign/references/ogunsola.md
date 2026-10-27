# Carter Ogunsola - https://carterogunsola.com/

## Type et positionnement
Portfolio d'un "Creative Developer & Brand Engineer" ("crafting web experiences with a taste for pure digital originality", né à Lagos, basé dans l'Utah). Profil senior et reconnu : membre du jury Awwwards 2026, étude de cas publiée sur Codrops (1820 Productions), travaille surtout avec des studios (Balky Studio, Off+Brand, Clay...). Le site est un "site-produit" vivant : Lab d'expériences, Writing, Studio, changelog "What's new", disponibilité "Booking Q1'27".

## Structure de la page d'accueil (sections dans l'ordre)
1. Barre de télémétrie en tout petit en haut : `UT::06:33MDT`, `FPS::59`, `ONLINE::87`, `LCP::1.6s`, `PRESENCE::ON`, `Booking::Q1'27`.
2. Header : monogramme "C|O" à gauche, nav centrée en pilule (About, Lab, Writing, Studio, Contact) + bouton "⌘K", à droite cloche de notifications ("What's new") et bascule thème clair/sombre.
3. Écran de chargement : compteur "100" en haut à droite, puis une forme 3D grise ondulée (une "presse", d'après le changelog "The press out front is what the shop makes") qui traverse l'écran au-dessus de la liste (capture desktop-mid).
4. "Selected work" : liste de 17 projets en lignes (nom à gauche, filet pointillé, étiquettes "W/STUDIO" et année à droite, flèche).
5. Toast en bas à gauche : "5 people joined - 80 online", "Someone left".
6. Curseurs des autres visiteurs en direct, avec des pseudonymes générés ("quiet fox", "soft otter", "lucid otter", "soft lynx").
Dans le DOM : palette de commandes (Pages, Tools, Record, Toggle live presence, Theme), changelog (Lab : Vocal Orb, Live Cursors, Dial, Heart, Polka Dots, Dynamic Scrollbar, Rotating Gallery, ThreeJs Scene ; Writing : "The personal starter" ; Award : jury Awwwards).

## Typographie
- JSON : "Oracle" (body, ABC Oracle probablement) et "PP Neue Montreal Mono".
- Rôle observé : Oracle en grotesque pour "Selected work" (display environ 50 px, graisse moyenne, approche serrée), noms de projets et nav (environ 15 px) ; PP Neue Montreal Mono en très petit pour la barre de télémétrie, les toasts ("80 online") et les pseudonymes des curseurs.
- Échelle sobre : un seul niveau display, le reste est en petit corps ; la hiérarchie vient de l'alignement et des étiquettes.

## Palette et direction artistique
Mode sombre par défaut (body rgb(30,30,30), texte rgb(247,247,247)), gris neutres, trame/grain discret en fond. Mode clair complet disponible (vu dans la capture sans JS : fond gris clair, texte noir). Accents : étiquettes colorées des curseurs (bleu, orange, jaune). DA "outil logiciel / console" plus que "showreel" : rigueur typographique, densité d'information, ambiance "studio d'impression" (presse 3D).

## Composition, grille et rythme
Marges latérales d'environ 30 px, liste pleine largeur avec filets pointillés qui relient le nom aux métadonnées, étiquettes alignées à droite. Nav centrée en pilule détachée. Une seule hauteur d'écran sur la home (scrollH 955 px) : tout tient presque dans le viewport. Rythme vertical serré et régulier (environ 37 px par ligne).

## Comportement du défilement
- Page courte (955 px desktop, 936 mobile), quasiment pas de scroll : les captures s0 à s95 de la sonde montrent toutes la liste, décalée de 25 px au plus (scrollY final 53).
- Lenis détecté (lissage), sans effet notable vu la hauteur.
- Pas de section épinglée ni horizontale.

## Transitions et micro-interactions
- Observé : compteur de chargement "100", forme 3D ondulée qui balaie la page pendant l'intro (desktop-mid), curseurs d'autres visiteurs qui bougent en temps réel avec pseudonymes, toasts d'arrivée/départ, FPS qui varie d'une capture à l'autre (3, 35, 59, 60), focus sur "Lab" qui fait apparaître un petit pictogramme de dossier au-dessus du lien.
- Déduit du DOM : palette ⌘K avec navigation clavier (flèches, Entrée, Échap), changelog avec "Mark all read", bascule de présence.
- Les flèches au bout des lignes de projets apparaissent dans la capture reduced (et sur mobile) mais pas dans les captures normales : elles semblent animées à l'entrée.

## Technologies
**Confirmé**
- Astro (chemins `/_astro/`, script `ClientRouter.astro...js` donc transitions de page Astro, `prefetch.*.js`).
- Three.js r185 (window.__THREE__ et `three.module.*.js`), `RoomEnvironment` ; scripts nommés `mesh`, `wheels`, `gl-warm` ; quatre contextes WebGL2, 5 canvas.
- Lenis.
- Présence temps réel (compteur "online", curseurs partagés, "Live Cursors - Everyone else on the page, in real time" dans le Lab).
- Mesure et affichage live du FPS et du LCP sur la page.
- Google Analytics (gtag) et Cloudflare Web Analytics.
- Thèmes clair/sombre/système (palette de commandes).
**Hypothèse**
- La "presse" 3D (rouleaux = `wheels`) est l'objet d'intro rendu en Three.js avec un éclairage `RoomEnvironment`.
- La présence passe par un service WebSocket tiers (6 hôtes contactés) ; non identifié.

## Mobile
Captures 390x844 : header compact (monogramme, cloche, recherche, thème, menu burger), "Selected work" et la liste complète lisible avec flèches, toast "Someone joined - 82 online" en bas, curseur d'un autre visiteur visible ("soft lynx"). Très bonne adaptation : la liste est le format idéal pour le mobile. LCP mobile 712 ms.

## Accessibilité et robustesse
- Focus : après 3 Tab, "Lab" avec `outline: auto 1px` ; la capture montre un cadre blanc arrondi bien visible autour du lien.
- Pas de lien d'évitement.
- Sans JS : contenu complet et lisible (thème clair par défaut, nav, "Selected work", toute la liste), seuls la télémétrie et la 3D manquent. 2 157 caractères, 49 liens. Excellente robustesse.
- Reduced motion : la capture reduced montre la liste avec les flèches déjà en place, sans forme 3D ni animation d'entrée visible ; le HTML contient 2 occurrences de `prefers-reduced-motion`. Différence réelle mais modeste.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop et mobile : 1,91 Mo transférés, JS 1,33 Mo, polices 412 Ko (lourd pour deux familles), CSS 59 Ko, 0 image, 22 requêtes, 6 hôtes. LCP 916 ms desktop, 712 ms mobile, CLS 0,001 / 0.
- Le site affiche lui-même "LCP::1.6s" (mesure terrain du visiteur, différente de la mesure de labo).

## Points forts UX
- Home ultra-efficace : la liste des projets est le contenu, lisible en 3 secondes, sur mobile comme sur desktop.
- Le site comme preuve vivante du savoir-faire : télémétrie (FPS, LCP), présence temps réel, Lab daté, changelog. Il donne une raison de revenir.
- ⌘K, thèmes, notifications : vocabulaire d'application que les développeurs reconnaissent.
- Robustesse sans JS et rendu serveur Astro.

## Points faibles ou risques
- Liste textuelle sans visuels : il faut cliquer pour voir le travail (pas de vignette, pas de survol observé).
- Présence en temps réel et curseurs étrangers : peuvent distraire, et implique un service temps réel et des considérations de vie privée.
- 1,3 Mo de JS pour une page dont le contenu principal est une liste.
- Barre de télémétrie illisible (environ 9 px, faible contraste).

## Idées transférables au portfolio de Johan sans copier
1. Afficher les métriques réelles de la page (LCP, CLS, INP du visiteur via `web-vitals`, poids transféré) dans une barre ou un colophon : c'est la preuve directe de l'expertise perf de Johan, plus parlante qu'un discours. Le faire lisible et expliqué, pas décoratif.
2. Home en liste dense de projets (nom, client ou contexte, année, stack), rendue côté serveur, avec un visuel qui n'arrive qu'au survol ou au focus.
3. Un changelog / "notes de labo" daté qui montre l'activité continue (articles perf, expériences WebGL), alimentant aussi le SEO.
4. Une palette ⌘K pour naviguer (pages, projets, bascule thème, bascule "mode léger"), accessible au clavier.

## Niveau d'inspection
Home seule. Captures data (desktop, desktop-mid, mobile, mobile-mid, nojs) et probe (s0, s45, focus, reduced) consultées ; page About lue via WebFetch (aucun colophon trouvé). HTML lu via curl. Pas de page projet, Lab non visité.
