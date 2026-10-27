# Ilnaz Khasanshin (ntch) - https://ntch.design/

## Type et positionnement
Portfolio d'un "Senior Product Designer" (12+ ans, Yandex Browser, Avito Garage, TaxDome, startups), basé à Chiang Mai, "Open to work" (remote, relocation, full-time, contract, freelance). C'est un designer, pas un développeur, mais qui "vibe-code" ses apps et plugins. Ton décalé et rétro : identité "dessin animé des années 30" et téléviseur cathodique.

## Structure de la page d'accueil (sections dans l'ordre)
Pas de défilement vertical : une seule scène.
1. Écran cathodique plein cadre (coins arrondis, vignettage, lignes de balayage, aberration chromatique sur les bords).
2. Au centre, une carte : illustration noir et blanc façon cartoon rétro (crédit "art by @rarebiscuit") avec bulle-explosion "Hello my name is ILNAZ and I'm a Senior Product Designer".
3. Cartes voisines à gauche et à droite, réduites à des bandes floues et irisées : c'est un carrousel horizontal de 40+ projets (le DOM contient 45 `<section>` : 1520 Groceries Delivery, Kasseta Synthesizer, Car App, Cyrillic Design, Awillix, Avito Garage, TaxDome B2C App... dont 3 marqués "locked").
4. Éléments fixes : bouton d'aide jaune "?" en haut à gauche (en forme de citron), badge vert incliné "Open to work - Let's Talk" en bas à droite.
5. Dans le DOM : bio complète, e-mail, "Single-key shortcuts: on", "Help: keys and gestures", 10 liens sociaux (LinkedIn, Instagram, Dribbble, Behance, Telegram, Product Hunt, GitHub, CodePen, X, Threads).

## Typographie
- JSON : "condensed" (body) et "walsheim" (GT Walsheim probablement, nom de famille abrégé).
- Rôle observé : grotesque très grasse, arrondie et en relief (ombre portée décalée) pour "ILNAZ" en jaune et les textes de la bulle ("HELLO MY NAME IS", "SENIOR PRODUCT DESIGNER") ; petites capitales pour "AND I'M A". Le badge "Open to work" reprend la même grasse. La condensée sert de police de corps (non observée à l'écran).
- Échelle : très peu de texte à l'écran, tout est en titrage BD.

## Palette et direction artistique
Noir profond, gris de l'illustration monochrome, accents jaune citron (nom, bouton d'aide) et vert (badge). DA : dessin animé rétro "rubber hose" + écran CRT (lignes de balayage, grain, déformation des bords, irisation RVB). Très singulière dans le groupe.

## Composition, grille et rythme
Composition centrée, carte principale environ 50 % de la largeur, cartes voisines rognées sur les bords qui indiquent la suite horizontale. Coins réservés aux éléments utilitaires (aide en haut à gauche, contact en bas à droite). Rythme : un projet à la fois.

## Comportement du défilement
- Aucun défilement de page : scrollH = hauteur de fenêtre (900 desktop, 844 mobile). Les captures s20, s70 et s95 de la sonde sont identiques (même carte d'intro).
- Navigation horizontale par carrousel (déduite des cartes voisines et de la liste des 45 sections). Mon test de molette, flèche droite et "?" a produit des captures noires (rendu WebGL non stabilisé en environnement headless) : le mécanisme exact (molette, glisser, flèches) n'est pas observé. Le DOM annonce des "keys and gestures".

## Transitions et micro-interactions
- Observé entre la capture de chargement et les captures suivantes : l'illustration apparaît derrière la bulle après le chargement, le nom passe du blanc au jaune, le bouton d'aide et le badge apparaissent ensuite (desktop vs desktop-mid). Effets CRT animés (irisation qui varie d'une capture à l'autre).
- Raccourcis clavier "single-key" activables/désactivables et aide dédiée (texte du DOM), non testés avec succès.

## Technologies
**Confirmé**
- Next.js avec Turbopack (chunks `/_next/static/immutable/chunks/turbopack-*.js`), hébergé sur Vercel (`/_vercel/insights/script.js`, Vercel Web Analytics).
- Un contexte WebGL2, un canvas ; pas de Three.js global, pas de GSAP global, pas de Lenis.
- Tailwind CSS (classes utilitaires `focus-visible:outline-2`, `focus-visible:outline-offset-4`, variables `--tw-*` dans la CSS de 17 Ko).
- CSS qui utilise `@media (prefers-reduced-motion: no-preference)` (animations réservées aux utilisateurs qui ne demandent pas de réduction).
- HTML sémantique côté serveur : 1 `<main>`, 45 `<section>`, h1 explicite, `aria-label` sur les projets verrouillés ("Vault, Product Design, locked").
**Hypothèse**
- Effet CRT (courbure, scanlines, aberration) en shader WebGL2 maison appliqué à une texture de la scène DOM ou des images.
- Le rendu lourd explique le temps de chargement mesuré très long (loadMs 98 s desktop en headless).

## Mobile
Captures 390x844 : même écran CRT ; la carte devient un format portrait (proche d'un écran de téléphone) avec l'illustration recadrée sur le personnage, bulle-explosion par-dessus, irisation colorée dans les coins, badge "Open to work" plus grand en bas. Mi-page identique (pas de scroll). Mobile mieux composé que desktop pour ce concept.

## Accessibilité et robustesse
- Focus : après 3 Tab, aucun élément focalisé détecté (`document.activeElement` = body) et rien de visible sur la capture focus, alors que la CSS prévoit des styles `focus-visible` (outline 2px, offset 4px). Probablement des éléments non focalisables ou le focus capté ailleurs : à vérifier, mais résultat négatif ici.
- Pas de lien d'évitement.
- Sans JS : le HTML contient tout le contenu (2 625 caractères, 54 liens, h1, bio, liste des projets, contacts) mais la capture sans JS est entièrement noire : contenu masqué visuellement tant que le JS ne tourne pas.
- Reduced motion : capture reduced non produite par la sonde (échec de capture sur ce site) ; la CSS montre une intention de respecter la préférence, non vérifiée visuellement.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 1,81 Mo transférés, JS 764 Ko, images 576 Ko, polices 136 Ko, CSS 17 Ko, "other" 319 Ko, 36 requêtes, 1 hôte. LCP non mesuré (0 : aucun candidat LCP détecté, probablement parce que tout passe par le canvas), CLS 0.
- Mobile : 2,81 Mo (dont 610 Ko de médias et 1,2 Mo d'images en plus), 41 requêtes.
- Chargement très long en headless (98 s desktop, 48 s mobile avant l'événement load) : signal d'un rendu ou d'un préchargement lourd, à relativiser.

## Points forts UX
- Identité immédiatement mémorable et cohérente avec un profil créatif (illustration commandée, CRT, BD).
- Badge "Open to work" permanent : la disponibilité est le premier message après le nom.
- Contenu complet et structuré dans le HTML (bon pour le SEO et les lecteurs d'écran en théorie).
- Grand volume de projets (40+) catégorisés (Product Design, Branding, Industrial Design, AI Art).

## Points faibles ou risques
- Rien de visible sans JS, focus clavier non observable, pas de LCP mesurable.
- Le concept "un projet à la fois" rend le survol de 40+ projets long.
- Effets CRT et irisation fatigants sur la durée, potentiellement problématiques pour les personnes sensibles au mouvement si la préférence n'est pas effectivement respectée.
- Rendu fragile en environnement sans GPU (captures noires).

## Idées transférables au portfolio de Johan sans copier
1. Un indicateur de disponibilité permanent et explicite ("Disponible pour missions - Toulouse / remote"), en élément fixe discret plutôt qu'en badge envahissant.
2. HTML sémantique complet (`main`, `section` par projet, `aria-label` incluant le statut "confidentiel" pour les projets sous NDA) même quand la présentation est très visuelle : c'est le bon réflexe, à combiner avec un affichage sans JS.
3. Commander ou créer une illustration signature unique plutôt qu'un effet générique : la singularité vient de l'asset, pas du shader.
4. Une aide "raccourcis clavier" accessible depuis un bouton "?" pour un site interactif, avec possibilité de désactiver les raccourcis à une touche (bonne pratique WCAG 2.1.4).

## Niveau d'inspection
Home seule. Captures data (desktop, desktop-mid, mobile, mobile-mid, nojs) et probe (s20, s70, s95, focus) consultées ; s0, s45 et reduced non générées (sonde lancée deux fois, échecs de capture). Test complémentaire molette/flèche/aide : captures noires, non exploitables. HTML et CSS lus via curl. Pas de page projet.
