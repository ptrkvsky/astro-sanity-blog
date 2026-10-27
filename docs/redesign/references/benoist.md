# Aristide Benoist - https://aristidebenoist.com/

## Type et positionnement
Portfolio d'un développeur indépendant spécialisé "motion and interaction" (meta description), très primé : la version mobile affiche Awwwards (107), Behance (20), FWA (33) et une liste de clients (Netflix, Google, Instagram, Twitch, MGM Studios, Obama Foundation, Steve Jobs Archive...). Design signé par un studio tiers ("Design by JW.S (Jon Way Studio)"). Positionnement : développeur d'exécution haut de gamme pour agences et studios, qui laisse le travail parler sans texte.

## Structure de la page d'accueil (sections dans l'ordre)
Desktop (un seul écran, scrollH 900) :
1. Écran de chargement : compteur "0 0 1" (HTML initial).
2. En-tête : logo "ARISTIDE" en condensée, règle graduée centrale (traits verticaux, indicateur de position), "About" à droite.
3. Centre : bande horizontale de vignettes verticales en noir et blanc (portraits, architecture, paysages, objets), une par projet.
4. Bas gauche : "Independent developer, available Dec. 2026" ; bas droite : Email, Instagram, Twitter.
Mobile (site distinct) : nom, grand bloc typographique "ESY68 33098L", "(Visit on a desktop for a full portfolio)", paragraphe de présentation, Contact (7 liens), Client, Awards, crédit design.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- "jws" (graisse 700, préchargée inline) : condensée display, logo et bloc géant mobile.
- "TNY" : petite grotesque en capitales espacées pour tout le texte d'interface (~11 px en desktop).
- Pas de mono. Échelle extrême : logo et micro-texte, rien entre les deux en desktop.

## Palette et direction artistique
Fond quasi noir #141414, texte vert-gris clair #bac4b8 (valeurs dans `window._A.color` du HTML), images désaturées en noir et blanc. Ambiance galerie, éditoriale, silencieuse : l'image fait tout, l'interface est réduite à des micro-libellés.

## Composition, grille et rythme
Composition plein écran figée : en-tête et pied fixes aux quatre coins, bande d'images centrée verticalement qui déborde à droite. Vignettes ~75 × 280 px espacées de ~15 px. Grand vide à gauche au départ (la bande entre par la droite).

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Défilement natif inexistant en desktop (hauteur 900 px, scrollY 0 à toutes les étapes). La molette et les flèches sont interceptées : le bundle desktop écoute `wheel`, `keydown` (ArrowDown, ArrowRight) et `touchstart`. Sur les captures s0, s70, focus puis dans une seconde session avec molette, la bande se déplace progressivement vers la gauche (début à x≈682, puis 415, 349, 282) ; le lien exact entre molette et position n'est pas établi (cela peut être une animation d'entrée continue). Navigation horizontale détournée, non mesurable avec scrollY.

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : écran de chargement à compteur, glissement horizontal de la bande, règle graduée d'en-tête.
- Le survol des vignettes (passage en couleur, déformation) et les transitions vers les pages projet n'ont pas été observés : le survol à (300,300) n'a rien changé de visible.
- En reduced-motion, la capture à 5 s montre encore l'écran de chargement noir (le chargement était plus long dans cette session) : impossible de conclure.

## Technologies
**Confirmé**
- WebGL brut sans librairie : JSON (contexte `webgl` créé, pas de `__THREE__`), et bundle `d.js` (69 Ko) contenant `getContext("webgl")`, repli `experimental-webgl`, shaders (`gl_FragColor`, `precision highp float`) et un moteur d'animation maison (classes `R.M`, `R.Delay`, `R.Timer`).
- Deux sites distincts choisis par détection d'agent utilisateur : le script inline charge `/static/css/d.css` + `/static/js/d.js` (desktop) ou `m.css` + `m.js` (mobile, 14,7 Ko) selon une expression régulière sur `navigator.userAgent` et `maxTouchPoints`.
- Aucun framework (JSON), 1 seul script applicatif, 1 hôte.
- `<noscript>` : "Please enable JavaScript to view this website." (capture nojs).
**Hypothèse**
- Les 3,9 Mo d'images desktop sont les textures des vignettes chargées pour WebGL.

## Mobile
Site différent et explicitement réduit : bloc typographique géant, présentation, liens de contact, clients, prix, crédits. Lisible, léger, mais sans aucun projet visible ("Visit on a desktop for a full portfolio"). Le h1 mobile vaut "ESY68 33098L" (texte décoratif, sens non identifié), ce qui est un mauvais h1.

## Accessibilité et robustesse
- Focus visible : non mesurable, la sonde ne trouve aucun élément focalisé après 3 Tab ("aucun") : les liens visibles ne sont pas atteignables au clavier dans les premiers Tab (hypothèse : éléments non focalisables ou gérés en JS).
- Lien d'évitement : absent.
- Sans JS : page blanche avec un message demandant d'activer JavaScript ; aucun h1 en desktop, 0 lien sans JS.
- Reduced-motion : non concluant (voir plus haut).
- SEO : titre et meta description corrects (Open Graph complet, canonical), mais contenu indexable quasi nul en desktop.

## Performance
Sans bridage, valeurs relatives :
- Desktop : 4,07 Mo transférés dont 3,88 Mo d'images ; JS 69 Ko seulement ; CSS 9 Ko ; police 7 Ko ; 36 requêtes, 1 hôte.
- Mobile : 47 Ko transférés, 6 requêtes (site mobile minimal).
- LCP 2732 ms desktop (le plus lent du groupe, l'élément LCP arrive après l'intro), 2256 ms mobile ; CLS 0,034 / 0,008.
Code remarquablement léger, poids porté par les images.

## Points forts UX
- Démonstration de savoir-faire par l'objet lui-même : WebGL maison en 69 Ko sans Three.js.
- Preuve sociale chiffrée et concrète (prix, clients) en mobile.
- Disponibilité datée affichée en permanence.
- Cohérence esthétique totale.

## Points faibles ou risques
- Rien sans JS, rien d'indexable en desktop, pas de h1 utile.
- Mobile assumé comme version dégradée sans projets : risqué si le premier contact se fait sur téléphone.
- Navigation par molette détournée et clavier inopérant au Tab.
- Détection par agent utilisateur (fragile, mauvais choix pour une tablette avec clavier).

## Idées transférables au portfolio de Johan sans copier
1. Montrer qu'un rendu WebGL peut tenir dans un budget minuscule : documenter le poids du JS de la scène du site Astro actuel et viser un chiffre affiché ("scène WebGL : X Ko").
2. Un repli mobile volontaire mais complet : sur petit écran, remplacer la scène par une liste de projets HTML légère, sans supprimer les projets (servie par media query et non par user agent).
3. Afficher la disponibilité datée et un bloc "références" chiffré (clients, années, sites livrés, gains mesurés) en texte HTML indexable.
4. Contre-exemple à éviter : contenu entièrement dans le canvas ; garder un HTML sémantique complet derrière la scène.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s70, focus, reduced ; deux captures supplémentaires dans une session à molette et survol. HTML de l'accueil par curl ; bundles `d.js` et `m.js` téléchargés et cherchés par mots-clés. Page About desktop et pages projet non consultées (rendu entièrement JS).
