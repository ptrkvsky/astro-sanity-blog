# Cyd Stumpel - https://cydstumpel.nl/

## Type et positionnement
Portfolio de développeuse créative indépendante d'Amsterdam, aussi enseignante (Amsterdam University of Applied Sciences) et conférencière. Meta description : "parttime teacher and award winning independent creative developer, with over eight years experience". Le hero empile les rôles (Freelance Developer, Creative Engineer, Conference Speaker, Parttime Lecturer, Front end Consultant) et met en avant l'accessibilité par une pastille "Accessibility". C'est le profil le plus proche de Johan par l'équilibre "créatif + pédagogique + blog technique".

## Structure de la page d'accueil (sections dans l'ordre)
1. Bandeau géant "CYD STUMPEL CYD S..." en rouge brique, avec une boîte en carton illustrée d'où sortent des icônes (curseur, ampoule, trophée, yeux, planète).
2. Barre d'en-tête : logo "CYD", e-mail avec bouton copier, "Available November 2026", About, Archive, Speaking, Blogs, Contact.
3. Hero : portrait détouré sur demi-disque rouge, "Creative Engineer" (serif italique + romain), pastilles autocollantes ("Award winning developer", "Motion web design", "Accessibility"), deux paragraphes de présentation, encart "Next speaking event : 13 November 2026, FFConf".
4. Sélection de projets : grandes vignettes photo très arrondies (Rotgans Media House, Club Nar, Broed, The Kotaverse...) avec phrase "From small studio's and freelancers to campaigns and large international companies, I create websites for all of them." et bouton "All work".
5. "Latest blogs" : cartes colorées par article (date, étiquettes CSS / New features / Scroll-driven animations..., titre en condensée capitales, compteur de webmentions).
6. Trois cartes de services inclinées : Web development, Consultancy, Speaking.
7. Pied de page (non capturé en détail).

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Bueno / Bueno-VF (variable) : display condensée capitales (nom géant, logo, titres de blog, services). Le CSS anime `font-variation-settings` sur le titre de page.
- InstrumentSerif et InstrumentSerif italic : titres éditoriaux ("Creative Engineer", "Latest blogs") et navigation.
- Geist : texte courant (paragraphes du hero, petits textes).
- Pas de mono visible sur l'accueil.
- Échelle très large : nom à ~220 px, titres à ~90 px, texte à ~13 px (petit en desktop).

## Palette et direction artistique
Fond crème rosé, rouge brique dominant, accents violet, bleu ciel, vert anis (pastilles), et une couleur différente par carte de blog (vert, jaune, violet, bleu, rouge). Esthétique "scrapbook" éditoriale : autocollants, cartes inclinées, coins pliés, photos détourées. Chaleureux et très personnel.

## Composition, grille et rythme
Grille à 3 colonnes égales pour les projets et les blogs, marges latérales ~24 px (pleine largeur). Le hero casse la grille (portrait à gauche débordant, texte décalé à droite). Rythme alterné : bloc dense, grand vide, bloc dense.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Défilement lissé par Lenis (JSON : lenis = true) sur un scroll natif (scrollY final 3724 sur 4819, la sonde peut défiler normalement). En-tête collant : le bandeau géant disparaît, la barre se réduit avec une version miniature de la boîte (s20, s70). Pas de défilement horizontal ni de section épinglée observée.

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : la boîte et ses icônes changent d'échelle entre l'en-tête complet et l'en-tête collant ; le bouton "Copy" apparaît au focus de l'e-mail.
- Confirmé dans le CSS (non vu en mouvement) : animations pilotées par le défilement en CSS natif (`animation-timeline: view()` / `scroll()`, `view-timeline-name`) sur le titre de page, le logo du pied de page, les icônes de l'en-tête, les webmentions ; View Transitions entre pages (`view-transition-name` sur header, main, vignettes de projets) ; transitions de page via Swup.

## Technologies
**Confirmé**
- WordPress 7.1.3 (JSON : meta generator), thème sur mesure `portfolio-2026` avec blocs ACF (feuilles `acf-blocks/homepage-header`, `selected-work`, etc.).
- Lenis (JSON).
- GSAP bundlé dans `main.js` (65 occurrences de "gsap" dans le fichier téléchargé ; le JSON ne le voit pas car non global).
- Swup (91 occurrences) et `document.startViewTransition` dans main.js ; `view-transitions.css` dédié.
- CSS scroll-driven animations et `@supports(animation-timeline: view(y))` : main.css (212 Ko non compressé).
- `prefers-reduced-motion` : 28 blocs `no-preference` et 6 blocs `reduce` dans main.css, plus un `matchMedia("(prefers-reduced-motion: reduce)")` dans le JS ; 56 règles `:focus-visible`.
- Webmentions affichées sur les articles ; analytics Umami et Google (gtag, Site Kit), beacon Cloudflare (JSON, scripts).
**Hypothèse**
- Le JS principal (646 Ko transférés selon le JSON) regroupe Swup, Lenis et GSAP en un seul bundle ; découpage non vérifié.

## Mobile
Capture 390 px : nom sur une ligne, logo et menu en grille de points, encart "Next speaking event" en haut, portrait sur demi-disque, "Creative Engineer" avec pastilles réparties autour. À mi-page, vignettes de projets pleine largeur empilées. Fidèle à la desktop, densité correcte, texte courant petit.

## Accessibilité et robustesse
- Focus visible : partiel. Après 3 Tab, le focus est sur "Copy email" avec `outline: none` mais une étiquette "COPY" et une icône apparaissent (capture focus). 56 règles `:focus-visible` dans le CSS suggèrent un traitement global.
- Lien d'évitement : présent (sonde : true ; "Skip to content" aussi lu dans le HTML d'un article).
- Sans JS : écran crème vide (capture nojs) alors que 3259 caractères et 59 liens sont dans le DOM. Cause exacte non identifiée dans le temps imparti (un style inline `opacity: 0` est présent dans le HTML).
- Reduced-motion : différence visible. Dans la capture reduced, la boîte et ses icônes ne sont pas affichées dans l'en-tête complet, le bandeau est seul ; le CSS réduit l'échelle des icônes (`scale(0.25)`) en mode reduce. Preuve d'une vraie prise en charge.
- Plusieurs h1 sur l'accueil (10 selon le JSON, y compris les cartes de services) : structure de titres discutable.

## Performance
Sans bridage, valeurs relatives :
- Desktop : 5,07 Mo transférés, JS 646 Ko, CSS 36 Ko, images 3,43 Mo (68 %), polices 175 Ko ; 113 requêtes, 8 hôtes.
- Mobile : 4,70 Mo, mêmes JS et images (pas d'allègement mobile des images mesuré).
- LCP 1204 ms desktop, 1860 ms mobile ; CLS 0,008 / 0,002.
Les photos de projets pèsent l'essentiel ; 8 hôtes tiers (analytics multiples).

## Points forts UX
- Disponibilité et prochaine conférence visibles d'emblée : très concret pour un client.
- Blog intégré à l'accueil avec étiquettes et webmentions : preuve d'activité et de reconnaissance.
- Démonstration par l'exemple des techniques qu'elle enseigne (scroll-driven animations, View Transitions) avec repli et reduced-motion.
- Identité forte sans WebGL.

## Points faibles ou risques
- Page blanche sans JS malgré un contenu serveur complet (WordPress).
- 3,4 Mo d'images et 8 hôtes sur l'accueil ; mobile non allégé.
- Trop de h1.
- Densité de signaux (autocollants, couleurs, polices) qui peut fatiguer.

## Idées transférables au portfolio de Johan sans copier
1. Afficher en haut une information datée et vérifiable : disponibilité, prochain talk ou dernier article, plutôt qu'un slogan.
2. Cartes d'articles avec étiquettes techniques et un signal de réception (commentaires, partages, webmentions) pour transformer les 69 articles en preuve sociale.
3. Utiliser les animations CSS pilotées par le défilement et les View Transitions natives (sans Lenis ni Swup) dans un site Astro, avec `@supports` et `prefers-reduced-motion`, et l'écrire dans un article.
4. Trois cartes de services explicites (développement, audit performance/SEO, accompagnement) en bas d'accueil.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s20, s70, focus, reduced. HTML de l'accueil par curl ; main.css, view-transitions.css et main.js téléchargés et cherchés par mots-clés ; un article de blog ("A deep dive into how I set up view transitions") lu en partie, qui porte sur un site de conférence et non sur le portfolio.
