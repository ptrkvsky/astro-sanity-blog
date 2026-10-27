# Bruno Simon - https://bruno-simon.com/

## Type et positionnement
Référence historique du portfolio WebGL : un monde 3D où l'on conduit une petite voiture pour découvrir l'auteur ("Please drive around to learn more about me and discover the many secrets of this world. And don't break anything!"). Bruno Simon, "creative developer (mostly for the web)", est aussi l'auteur du cours Three.js Journey, que le site promeut. Positionnement : le portfolio est lui-même l'oeuvre et la démonstration, avec une dimension communautaire (Discord, messages publics des visiteurs, classement).

## Structure de la page d'accueil (sections dans l'ordre)
Pas de page au sens classique : une scène 3D plein écran et des panneaux d'interface.
- Ce que j'ai vu : écran de chargement (sol en perspective avec grille de croix violettes, grands axes, cercle lumineux qui se referme comme jauge de progression, dégradé de couleur qui évolue du bleu nuit au brun-rose). La scène 3D elle-même n'est pas apparue dans mes captures (rendu logiciel headless, voir niveau d'inspection).
- Ce que contient le DOM (lu dans le HTML) : bouton "Interact" et "Unstuck", panneau d'accueil ("Welcome! My name is Bruno Simon..."), Options (Audio, Quality Low, Respawn, Reset, Renderer "Best for performance / WebGPU", Server "Pending"), écran des contrôles pour clavier/souris, mobile/tablette et manette (WASD, Shift boost, Space jump, M map, T whisper, H honk...), Achievements avec temps de jeu et récompenses, Circuit (course chronométrée, top 10 quotidien), Whispers (messages publics des visiteurs, 30 max, un par utilisateur, drapeau, 30 caractères), "Behind the scene" (stack et crédits), Discord et contact.

## Typographie
- JSON : "Amatic SC", "Nunito" (body), "Pally-Medium".
- Rôle observé : non observé à l'écran (aucun texte dans les captures du chargeur). D'après les crédits du site ("Fonts: Amatic SC & Nunito") : Amatic SC (manuscrite condensée) pour les titres ludiques, Nunito (arrondie) pour l'interface ; Pally probablement pour des titres dans la scène.

## Palette et direction artistique
Observé sur le chargeur : fonds sombres en dégradé qui varie (bleu nuit, violet, brun-rose), croix et lignes violettes en perspective, cercle blanc lumineux avec halo. Le monde 3D lui-même (connu pour ses couleurs vives et son style jouet) n'a pas été vu dans cette session.

## Composition, grille et rythme
Plein écran, centré sur le cercle de chargement. Interface en panneaux superposés (modales d'options, de contrôles, de succès) d'après le DOM. Pas de grille éditoriale.

## Comportement du défilement
Aucun défilement : body `overflow: hidden`, scrollH = hauteur de la fenêtre. La navigation se fait en conduisant (clavier, souris, tactile, manette). Les captures de la sonde de défilement n'ont pas été produites (sonde bloquée sur la capture d'écran WebGL).

## Transitions et micro-interactions
- Observé : jauge circulaire de chargement qui se referme, couleur de fond qui change pendant le chargement.
- Documenté par le site (non testé) : conduite avec physique, saut, boost, klaxon, hydrauliques, carte, respawn, chronomètre de circuit, succès, messages "whispers" visibles par tous, musique originale.

## Technologies
**Confirmé**
- Three.js r183 (window.__THREE__) ; un contexte WebGL2 dans mon environnement. Le site documente l'usage de TSL (Three Shading Language), "enabling the use of both WebGL and WebGPU" : le DOM propose un choix de renderer ("Best for performance" / "WebGPU").
- Moteur physique Rapier (script `rapier-*.js` et crédits "Physics library: Rapier"), exécuté en partie via des blobs (workers ou WASM).
- Audio : Howler.js (crédits) ; musiques originales de Kounine sous licence CC0.
- Code source publié sur GitHub sous licence MIT, fichiers Blender inclus ; serveur (whispers, scores) non publié, "the portfolio works without it" (texte du site).
- Devlogs sur YouTube (texte du site).
- Bundle Vite probable (`assets/index-<hash>.js`), Google Analytics.
- Polices : Amatic SC, Nunito, Pally.
**Hypothèse**
- Le serveur temps réel (état "Pending", "Server currently offline") gère whispers et classement par WebSocket.

## Mobile
Capture 390x844 : même chargeur (cercle lumineux recadré, grille en perspective). Le DOM prévoit des contrôles tactiles dédiés ("One finger: move the car", "Two fingers: move camera / zoom", "Tap on the car: jump"). Expérience mobile non vue.

## Accessibilité et robustesse
- Focus : après 3 Tab (test complémentaire), un `BUTTON` sans texte visible reçoit le focus avec `outline: none` et 3px de largeur déclarée ; rien de visible sur la capture (chargeur à l'écran). Focus non perceptible.
- Pas de lien d'évitement, pas de h1 (0 h1 dans le JSON), title minimal ("Bruno's"), meta description générique ("Bruno Simon's creative portfolio").
- Sans JS : 3 203 caractères dans le DOM (panneaux d'interface) mais capture vide (dégradé sombre) ; aucun contenu lisible.
- Reduced motion : capture non produite par la sonde ; aucune mention de `prefers-reduced-motion` dans le HTML. Une option "Quality: Low" existe pour réduire les effets.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 12,45 Mo transférés, JS 5,77 Mo (le plus gros JS du groupe), "other" 6,54 Mo (modèles, textures, WASM, audio probablement), 146 requêtes, 6 hôtes. LCP non mesuré (0), CLS 0.
- Mobile : 12,52 Mo, 148 requêtes : aucun allègement mobile.

## Points forts UX
- Expérience mémorable et virale : on se souvient du portfolio et de l'auteur.
- Contrôles multiples (clavier, souris, tactile, manette) et option de qualité basse : l'auteur pense aux différents terminaux.
- Transparence exemplaire : section "Behind the scene" qui documente stack, crédits, licences, code source ouvert. Le portfolio sert aussi de produit d'appel pour sa formation.
- Couche sociale légère (whispers, classement) qui donne une raison de revenir.

## Points faibles ou risques
- Aucun contenu accessible sans JS ni sans GPU performant ; pas de h1, SEO minimal.
- 12,5 Mo et 146 requêtes, identiques sur mobile.
- Le "qui je suis / ce que j'ai fait" est à découvrir en jouant : coûteux pour un recruteur pressé.
- Le format "monde 3D à explorer" est désormais très imité ; le reproduire sans la même maîtrise donne un résultat générique.

## Idées transférables au portfolio de Johan sans copier
1. Une page "Coulisses" / colophon aussi complète : stack, choix de perf, budgets, crédits, licences, lien vers le code. Pour Johan, c'est l'endroit idéal pour démontrer Astro, WebGL, GSAP, les Core Web Vitals obtenus et le SEO technique.
2. Une option de qualité explicite (basse / haute) pour la couche WebGL, mémorisée, et réglée par défaut selon `prefers-reduced-motion`, `navigator.connection.saveData` et `deviceMemory`.
3. Publier le code source (ou une partie) du portfolio : preuve de qualité de code, et contenu éditorial (devlog) qui nourrit le SEO.
4. Prévoir un panneau texte complet en parallèle de l'expérience (ce que Bruno n'a pas) : à l'inverse de ce modèle, garder un parcours HTML direct vers les projets.

## Niveau d'inspection
Home seule, chargement uniquement. Captures data (desktop, desktop-mid, mobile, nojs) consultées : elles montrent le chargeur. Sonde de défilement bloquée (aucune capture produite dans le délai), test complémentaire de 30 s + conduite : capture du chargeur complet et du focus, scène 3D jamais affichée en rendu logiciel. Texte du DOM lu via curl (dont la section "Behind the scene"). Je n'ai donc pas vu le monde 3D lui-même dans cette session.
