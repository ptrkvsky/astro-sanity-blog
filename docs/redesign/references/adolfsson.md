# Mathias Adolfsson - https://mathiasadolfsson.dev/

## Type et positionnement
Portfolio de freelance suédois, "Independent Creative Engineer". Positionnement senior et indépendant : la page About liste capacités (UI & interaction design, frontend, backend, creative development, WebGL & Three.js, e-commerce, accessibilité, SEO, optimisation de performance), récompenses (D&AD, Eurobest, Lovies, One Show, Webby) et l'appartenance à la communauté OkayDev. Message d'expérience longue ("the rise and fall of Flash, applied clearfix"). Appel à l'action : "Schedule a call".

## Structure de la page d'accueil (sections dans l'ordre)
Pas de sections verticales : une seule vue plein écran.
1. En-tête : nom + titre en haut à gauche, lien "About" en haut à droite.
2. Carrousel de projets en arc (cylindre vu de l'intérieur) : la carte centrale montre une vidéo du site livré (Tentipi au chargement), cartes voisines tronquées à gauche (Bonza) et à droite (Mikuta).
3. En bas au centre : indicateur en arc + étiquette du projet courant ("Tentipi").
4. Panneau About en surcouche (texte présent dans le DOM : présentation, capacités, récompenses, "Have a project in mind? Let's talk.", Schedule a call, LinkedIn, OkayDev, copie d'e-mail).
Trois projets seulement dans le carrousel (Tentipi, Mikuta, Bonza).

## Typographie
- JSON : une seule famille, "inter".
- Rôle observé : Inter en petit corps (environ 15 px) pour le nom, le titre, "About" et l'étiquette de projet. Aucune typographie display propre au portfolio : les grands titres visibles ("The Nordic tipi pioneer...") appartiennent aux vidéos des sites clients.
- Échelle minimaliste : tout le texte du portfolio est au même niveau, le contenu visuel fait la hiérarchie.

## Palette et direction artistique
Fond quasi noir (rgb(8,8,8)), texte blanc cassé (rgb(247,247,247)). Aucune couleur d'accent propre : les couleurs viennent des vidéos de projets. DA "galerie sombre / showreel" où le portfolio s'efface derrière le travail. Effet d'aberration chromatique (séparation RVB) et de flou de mouvement pendant la rotation du carrousel (observé après molette).

## Composition, grille et rythme
Composition centrée et symétrique : carte principale environ 55 % de la largeur, cartes voisines coupées par les bords, courbure qui suggère la profondeur. Coins d'écran réservés à la navigation (nom, About), bas centré pour l'indicateur. Pas de grille éditoriale ; rythme entièrement temporel (un projet à la fois).

## Comportement du défilement
- Défilement de page désactivé : body `overflow: hidden`, scrollH = hauteur de la fenêtre (900). Les captures s0 à s95 de la sonde sont donc identiques (même carte Tentipi).
- La molette est détournée : un test manuel (4 crans de molette) fait tourner le carrousel horizontalement vers Mikuta, avec aberration chromatique pendant le mouvement et l'étiquette qui défile ("Tentipi" vers "Mikuta").
- C'est donc un défilement détourné vers une navigation horizontale circulaire.

## Transitions et micro-interactions
- Observé : rotation du carrousel à la molette avec séparation RVB et légère distorsion ; étiquette de projet qui défile verticalement ; écran de chargement avec compteur de pourcentage ("000", "018") et filet horizontal.
- Texte du DOM : "Copy email" / "Email copied" (copie au clic), boutons "View" sur les projets, "Close" pour le panneau About.
- Le clic sur "About" via Playwright a expiré (élément probablement recouvert par le canvas ou animé) : panneau About non vu à l'écran, seulement lu dans le DOM.

## Technologies
**Confirmé**
- Nuxt (scripts servis depuis `/_nuxt/`, alors que le détecteur `nuxt` du JSON renvoie false).
- Three.js r185 (window.__THREE__), un contexte WebGL2, un canvas.
- Transcodeur Basis (`basis_transcoder.*.js`) : textures compressées KTX2/Basis.
- Cloudflare Web Analytics (`static.cloudflareinsights.com/beacon.min.js`).
- Police Inter seule.
**Hypothèse**
- Les cartes sont des plans courbés rendus en WebGL avec des textures vidéo (18,6 Mo de "media" transférés, aucun élément `<video>` compté dans le DOM, ce qui est cohérent avec des vidéos consommées comme textures).
- L'aberration chromatique est un shader de post-traitement indexé sur la vélocité de la molette.

## Mobile
Captures 390x844 : même carrousel, carte centrale en format portrait, titre de la vidéo client coupé à gauche ("ordic tipi pioneer"), étiquette "Tentipi" en bas. Le titre "Independent Creative Engineer" disparaît (seul le nom reste). Mi-page identique au haut (pas de scroll). Le cadrage des vidéos clients en portrait coupe leur texte : le contenu n'est pas recadré pour mobile.

## Accessibilité et robustesse
- Focus : après 3 Tab, focus sur "Schedule a call" avec `outline: auto 1px`, mais la capture focus ne montre rien de visible : le lien focalisé appartient au panneau About masqué. Focus sur un élément invisible, problème réel.
- Pas de lien d'évitement.
- Sans JS : 65 caractères de texte, 0 lien ; capture = écran noir avec "000" (compteur de chargement figé). Aucun contenu, aucun projet, aucun lien sans JS ; le HTML curl ne contient que le nom, le titre et "About/Close".
- Reduced motion : la capture reduced (5 s après chargement) montre encore le chargeur à 018 % : le site ne propose pas de chemin allégé, et le chargement de plus de 25 Mo bloque l'accès.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 27,9 Mo transférés, dont médias 18,6 Mo et "other" 7,5 Mo (textures probablement), JS 687 Ko, images 1,0 Mo, 58 requêtes, 7 hôtes. LCP 4 224 ms, CLS 0.
- Mobile : 25,3 Mo, 62 requêtes, LCP 4 224 ms, CLS 0.
- Le plus lourd du groupe après urbik ; aucun allègement mobile notable.

## Points forts UX
- Le travail est montré en mouvement, en grand, immédiatement (vidéo du site livré au centre).
- Interface d'une grande sobriété : 3 éléments de navigation, aucune distraction typographique.
- Un geste unique (molette/glisser) pour tout parcourir, avec un retour visuel fort (aberration RVB).
- About riche et orienté conversion (capacités, récompenses, "Schedule a call").

## Points faibles ou risques
- Poids extrême (environ 28 Mo) et chargeur bloquant : coûteux sur mobile et données limitées.
- Aucun contenu indexable ou lisible sans JS ; SEO limité au title et à la meta description, pourtant SEO et performance sont listés comme capacités.
- Focus clavier qui atterrit dans un panneau caché.
- Trois projets seulement, sans texte de contexte visible sur la home (rôle, problème, résultat).
- Molette détournée : pas de scroll natif.

## Idées transférables au portfolio de Johan sans copier
1. Montrer les sites livrés en vidéo courte, mais en `<video>` natif avec poster, `preload="none"` et lecture au survol/à l'entrée dans le viewport, plutôt qu'en texture WebGL de 18 Mo.
2. Un retour visuel lié à la vélocité du scroll (léger décalage RVB ou flou) appliqué à une seule zone, piloté par le scroll natif, ce qui garde l'effet "matière" sans détourner la molette.
3. Une page About qui fonctionne comme une fiche de capacités + récompenses + CTA unique, transposée chez Johan en "capacités + preuves chiffrées (Core Web Vitals) + prise de rendez-vous".
4. Contre-exemple à exploiter : afficher la sobriété de chargement comme argument ("cette page pèse x Ko") face aux portfolios à chargeur.

## Niveau d'inspection
Home seule. Captures data (desktop, desktop-mid, mobile, mobile-mid, nojs) et probe (s0, s20, s70, focus, reduced) consultées ; test complémentaire Playwright de molette (capture après rotation). Texte du DOM lu après rendu. Panneau About non affiché à l'écran (clic expiré), pas de page projet.
