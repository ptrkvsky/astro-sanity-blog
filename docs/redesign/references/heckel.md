# The Blog of Maxime Heckel - https://blog.maximeheckel.com/

## Type et positionnement
Blog technique personnel d'un ingénieur frontend (basé à New York, "Designed & Built in NYC" en pied de page), spécialisé shaders, rendu temps réel, Three.js/R3F, et historiquement React. Promesse explicite (meta description et accueil) : rendre des sujets complexes accessibles "through interactive playgrounds, visualization, and well detailed walkthroughs". Le blog est le portfolio : l'expertise se prouve par les articles.

## Structure de la page d'accueil (sections dans l'ordre)
1. Barre de navigation flottante centrée en forme de pilule : logo, Index, Articles, Cmd, Ask.
2. Héros : scène WebGL d'un symbole infini en particules blanches, sur un fond bleu électrique à grille fine qui se dégrade en noir vers la droite et le bas, avec une partie des particules en gros pixels (effet de tramage/pixellisation).
3. Deux colonnes de présentation : h1 "Experiments and essays on the modern web." + paragraphe "Hi I'm Maxime...", et un second paragraphe sur la démarche.
4. Index chronologique complet des articles groupés par année (2026 à 2018), une ligne par article : titre à gauche, date en mono à droite, filets séparateurs. 60 liens `/posts/` dans le HTML.
5. Pied de page : Links (Home, Glossary, Work, Support me!, Bluesky, Twitter, RSS), copyright.

## Typographie
- JSON : `inter` (texte et titres) et `DepartureMono` (police mono pixel : années, dates, glyphes de l'effet de brouillage).
- Rôles : Inter en texte (~16 px, gris clair) et en titre modéré (h1 ~22 px, aucun titre géant) ; mono pour toutes les métadonnées. Échelle sobre et resserrée ; la place de la "voix" est laissée à la scène WebGL.

## Palette et direction artistique
Fond très sombre bleuté (`oklch(0.1468 0.01 262)`), texte `oklch(0.9366 0.027 262)` : couleurs déclarées en OKLCH (JSON). Accent unique bleu électrique saturé dans le héros. DA "laboratoire graphique" : grille, particules, tramage, police pixel. Cohérente avec les sujets des articles (dithering, halftone, post-processing).

## Composition, grille et rythme
Colonne centrale étroite (~660 px) pour tout le texte ; le héros occupe la pleine largeur. Dans les articles, les démonstrations sortent de la colonne de texte et s'élargissent (~1000 px) : la largeur signale "ceci est interactif". Rythme de liste très régulier sur l'index.

## Comportement du défilement
Natif (pas de Lenis, `overflow visible`, scrollHeight 5717 px, scrollY final 4577). Captures s20 à s95 : défilement document classique. Particularité : les titres d'articles se révèlent à l'entrée dans le viewport avec un brouillage de caractères (s20 : "On Rendering the Sky8 jP=%9", "Field Guide to TSL a[= BN&f") ; desktop-mid et mobile-mid montrent même des lignes encore vides au moment de la capture.

## Transitions et micro-interactions
Observé : révélation des titres par "scramble" de caractères en police mono ; particules animées du héros. Dans un article : pilule de navigation qui affiche le titre de l'article et une icône de progression circulaire ("Shades of Halftone" avec un chevron, probablement un sommaire déroulant), widgets avec curseurs. Survols non observés.

## Technologies
**Confirmé**
- Next.js (JSON ; chunks `_next/static/immutable` et `turbopack-*.js`, `_clientMiddlewareManifest`), hébergé chez Vercel (Vercel Analytics et Speed Insights, JSON).
- Three.js r182 (JSON `__THREE__`), 1 contexte WebGL2 sur l'accueil (JSON).
- Polices auto-hébergées, 1 seul hôte pour toutes les requêtes (JSON).
- Flux RSS (`<link rel="alternate" type="application/rss+xml" href="/rss.xml">`) et un bloc JSON-LD (HTML).
- Article "Shades of Halftone" (curl + capture Playwright) : 11 `<canvas>`, 20 `input type="range"` avec `<label>` associés (sliders Base UI, ids `base-ui-...`, `aria-valuenow`), 13 blocs `<pre>` avec boutons "Copy", 9 `<figure>` avec légendes, 4 h2 / 9 h3, ~37 000 caractères de texte servis en HTML.

**Hypothèse**
- Démos en React Three Fiber (l'auteur publie des articles R3F, ex. `/posts/the-study-of-shaders-with-react-three-fiber/`), non vérifié dans le bundle.
- Classes CSS `c-xxxx` caractéristiques de Stitches (CSS-in-JS).
- "Ask" est une recherche sémantique assistée par IA (il a écrit `/posts/building-magical-ai-powered-semantic-search/`) ; "Cmd" une palette de commandes.

## Mobile
Capture mobile : pilule de navigation pleine largeur, héros recadré (l'infini déborde de l'écran), texte en une colonne lisible. Mobile-mid : lignes de l'index vides au moment de la capture (révélation pas encore déclenchée), seule l'année "2021" est visible : un instantané montre une page qui paraît vide.

## Accessibilité et robustesse
- Focus : après 3 Tab, bouton "Cmd" avec `outline: none 3px` ; la capture focus ne montre pas d'indicateur distinct sur "Cmd" (peut-être un anneau trop subtil pour être visible en JPEG). Focus visible douteux.
- Lien d'évitement : non.
- Sans JavaScript : capture nojs : navigation, h1 et textes présents, zone héros vide (pas de canvas) ; JSON noJs : 6787 caractères, 69 liens, h1 présent. Tout l'index est en HTML.
- Reduced motion : la capture reduced montre le héros animé comme en version normale ; pas de différence observable.
- Dans les articles, les curseurs des démos sont de vrais `input range` étiquetés : les démos sont pilotables au clavier (déduit du balisage, non testé).

## Performance
Chiffres JSON (non bridé) : 4,1 Mo desktop / 3,9 Mo mobile ; JS 1,8 Mo desktop / 2,0 Mo mobile ; polices 740 Ko (lourd pour deux familles) ; 0 image ; 55 requêtes, 1 hôte ; LCP 564 ms desktop / 672 ms mobile ; CLS 0,002 desktop / 0 mobile. Très bon pour un site avec WebGL dès l'accueil, mais polices surdimensionnées.

## Points forts UX
- L'expertise est démontrée là où on la cherche : chaque concept d'article est accompagné d'une démo manipulable (paramètres "Uniforms" étiquetés + rendu en direct), d'un schéma légendé et du code copiable.
- Index exhaustif, sobre et chronologique : 9 ans de publications lisibles d'un coup d'oeil.
- Le héros WebGL illustre exactement le sujet du blog (particules, tramage), il n'est pas décoratif.
- Contenu intégral en HTML, RSS, JSON-LD : référencement solide.

## Points faibles ou risques
- Titres révélés au défilement : une capture, un aperçu ou un visiteur qui fait défiler vite voit des lignes vides ou des caractères parasites.
- 740 Ko de polices.
- Indicateur de focus peu ou pas visible sur la navigation.
- Pas de version différente en reduced-motion observée.

## Idées transférables au portfolio de Johan sans copier
1. Composant "démo d'article" réutilisable pour son blog de 69 articles : panneau de paramètres en `input range` natifs étiquetés + canvas (ou simple rendu DOM) + code copiable, inséré dans le MDX d'Astro comme île hydratée uniquement à l'entrée dans le viewport (`client:visible`). Particulièrement adapté à ses sujets perf/SEO (ex. curseur "poids du JS" et LCP simulé).
2. Laisser les démos sortir de la colonne de lecture (largeur supérieure au texte) : signal visuel fort, aucun coût.
3. Un héros WebGL qui illustre la spécialité (pour Johan : quelque chose qui évoque vitesse/mesure plutôt qu'un objet décoratif), sur une page dont tout le reste est HTML léger.
4. Ne pas reprendre la révélation par brouillage sur des contenus essentiels (titres) ; la réserver aux éléments décoratifs.

## Niveau d'inspection
Consulté : JSON ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe (s20, s70, s95, focus, reduced ouverts ; s0 et s45 non ouverts) ; HTML de l'accueil (curl : liste des articles, RSS, JSON-LD) ; article "Shades of Halftone" (curl : structure, widgets, sliders ; et 2 captures Playwright d'une démo "Uniforms" et d'un rendu halftone sur vidéo). Non vu : contenu de "Cmd" et "Ask", articles plus anciens, code des démos.
