# Dennis Snellenberg - https://www.dennissnellenberg.com/

## Type et positionnement
Portfolio de "Freelance Designer & Developer" néerlandais (title : "Dennis Snellenberg • Freelance Designer & Developer"). Promesse commerciale classique : "Helping brands thrive in the digital world... Delivering tailor-made digital designs and building interactive websites from scratch." Signature "© Code by Dennis". Site très largement imité dans la communauté (le style "photo détourée + nom en marquee + boutons magnétiques" est devenu un gabarit).

## Structure de la page d'accueil (sections dans l'ordre)
1. Hero plein écran sur fond gris : "© Code by Dennis", Work / About / Contact ; portrait détouré au centre ; pastille "Located in the Netherlands" avec globe à gauche ; flèche et "Freelance Designer & Developer" à droite ; nom "Dennis Snellenberg -" en marquee géant blanc qui défile horizontalement en bas.
2. Bloc de présentation sur fond blanc : "Helping brands to stand out in the digital era. Together we will set the new status quo. No nonsense, always on the cutting edge." + paragraphe court + bouton rond sombre "About me".
3. "Recent work" : liste de projets en lignes séparées par des filets (nom en grand, "Interaction & Development" à droite), par exemple "TWICE".
4. Suite non capturée en détail (la sonde ne défile pas, voir plus bas).

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Une seule famille : "Dennis Sans" (nom de police personnalisé ; grotesque néo-suisse). Rôle display (marquee ~200 px, noms de projets ~80 px), texte (~30 px pour l'accroche, ~17 px pour le paragraphe), libellés en petites capitales grises ("RECENT WORK").
- Pas de mono. Contraste d'échelle très fort, une seule graisse apparente.

## Palette et direction artistique
Gris photo (#999c9f environ) pour le hero, blanc pour le contenu, quasi-noir (rgb 28,29,32) pour les boutons ronds et la pastille. Monochrome, la seule couleur vient de la photo. Direction "studio suisse" épurée, confiance et sérieux.

## Composition, grille et rythme
Hero composé autour du portrait centré, éléments aux quatre zones. Contenu sur une grille à deux colonnes asymétriques (accroche ~610 px à gauche, paragraphe et bouton à droite), marges larges (~230 px). Liste de projets pleine largeur interne avec filets : rythme horizontal et aéré.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Détourné et lissé : `overflow: hidden` sur html et body en desktop (JSON), hauteur de document 900 px, scrollY toujours 0 : la sonde (scrollTo) n'a donc rien fait défiler et ses captures s0 à s95 sont identiques au hero. Dans une session séparée à la molette, la page défile par transformation (Locomotive Scroll) avec beaucoup d'inertie : environ 30 crans pour atteindre la liste des projets. Parallaxe visible : le portrait remonte moins vite que le contenu. L'en-tête est remplacé par un bouton rond de menu flottant en haut à droite après le hero. Mobile : défilement natif (overflow visible, scrollH 3690).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : marquee du nom en continu, bouton menu rond qui apparaît au défilement, parallaxe du portrait.
- Confirmé dans le code mais non vu en mouvement : boutons magnétiques (fonctions `magnetic` dans `index-new.js`), transitions de page Barba.js, animations ScrollTrigger.
- Survol de la liste de projets (aperçu d'image qui suit le curseur, motif connu de ce site) : non observé, hypothèse.

## Technologies
**Confirmé** (liste des scripts du JSON)
- jQuery 3.5.1, GSAP 3.9.1 + ScrollTrigger (cdnjs), Locomotive Scroll (fichier local + `locomotive-scroll.css`), Barba.js 2.10.3, vanilla-lazyload 17.6.1, js-cookie, Google Analytics.
- JSON : gsap global = true, aucun framework, aucun WebGL.
- Aucune règle `prefers-reduced-motion` ni `:focus-visible` dans les 4 feuilles CSS et le JS principal téléchargés (seulement 4 `:focus` dans styleguide.css).
**Hypothèse**
- Site statique HTML écrit à la main (pas de générateur détecté), hébergement non identifié.

## Mobile
Capture 390 px : "© Code by Dennis" et "Menu" ; portrait recadré plein écran ; nom en marquee coupé ("Sneller...") ; "Freelance Designer & Developer" et globe en bas. À mi-page : cartes de projets pleine largeur (capture d'écran du site dans un cadre gris, nom "TWICE", "Interaction & Development 2024"). Mobile bien adapté et lisible, défilement natif.

## Accessibilité et robustesse
- Focus visible : non. Après 3 Tab, focus sur "About" avec `outline: none` ; la capture focus montre la page décalée (Locomotive a déplacé le contenu) et aucun indicateur visible.
- Lien d'évitement : absent.
- Sans JS : écran quasi noir (capture nojs) alors que 1197 caractères et 29 liens sont dans le HTML : le contenu est masqué en attendant le script (probablement un écran de chargement).
- Reduced-motion : la capture reduced ne montre aucune différence de mise en page ; le marquee est à une autre position, ce qui suggère qu'il continue de défiler (une seule image, non certain). Aucune règle reduced-motion trouvée dans le code.
- Deux h1 identiques ("Dennis Snellenberg" suivi d'un tiret cadratin, dupliqué pour le marquee) et 29 h2.
- CLS mesuré 0,391 desktop et 0,564 mobile : très mauvais (seuil "bon" < 0,1), probablement dû aux transformations d'entrée et au marquee.

## Performance
Sans bridage, valeurs relatives :
- Desktop : 667 Ko transférés, JS 268 Ko, CSS 20 Ko, images 348 Ko, police 27 Ko ; 24 requêtes, 6 hôtes (CDN multiples).
- Mobile : 815 Ko, 21 requêtes.
- LCP 816 ms desktop, 640 ms mobile ; CLS 0,391 / 0,564.
Léger et rapide au premier affichage, mais stabilité visuelle mauvaise.

## Points forts UX
- Message commercial clair et localisation immédiatement visibles.
- Esthétique sobre et premium avec une seule photo et une seule police.
- Liste de projets lisible (nom, nature de la mission, année).
- Poids modéré pour un site aussi animé.

## Points faibles ou risques
- Gabarit devenu générique à force d'être copié : un portfolio qui y ressemble paraît "template".
- Défilement détourné à forte inertie, clavier inopérant visuellement, aucune prise en compte du reduced-motion.
- CLS très élevé, contenu masqué sans JS.
- Pile jQuery + Locomotive + Barba datée.

## Idées transférables au portfolio de Johan sans copier
1. Une liste de projets en lignes (nom, type de mission, année) plutôt qu'une grille de cartes : rapide à parcourir et très légère.
2. Afficher la localisation (Toulouse) et le statut freelance ou salarié dans le hero, en texte HTML : utile au SEO local et au recruteur.
3. Démontrer qu'on obtient la sensation "premium" sans défilement détourné : défilement natif, CLS à 0, et le dire avec les chiffres (contre-exemple direct de ce site).
4. Éviter explicitement le gabarit "photo détourée + nom en marquee + boutons magnétiques", trop reconnaissable.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : focus et reduced (s0 à s95 identiques au hero car scrollY bloqué à 0) ; session supplémentaire de 5 captures à la molette (w2 et w4 ouvertes). HTML par curl ; `index-new.js` et 4 feuilles CSS téléchargés et cherchés par mots-clés. Pages Work, About, Contact non consultées.
