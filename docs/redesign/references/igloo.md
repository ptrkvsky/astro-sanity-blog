# Igloo Inc. - https://www.igloo.inc/

## Type et positionnement
Landing page corporate de Igloo Inc. (maison mère de Pudgy Penguins, univers crypto/"onchain"), réalisée par le studio Abeto avec l'agence Bureaux. Ce n'est pas le site d'un studio mais une pièce de démonstration : Site of the Year et Developer Site of the Year Awwwards 2024 (https://www.awwwards.com/annual-awards-2024/site-of-the-year). La meta description vise la mission ("create the largest onchain community"), le site lui-même est une expérience 3D immersive.

## Structure de la page d'accueil (sections dans l'ordre)
Observé : une intro temps réel (étoile de glace qui se forme sur fond gris bleuté, capture s0/s20), puis un igloo en fil de fer entouré d'un treillis de lignes numérotées (s70, mobile), puis l'igloo texturé posé sur un sol en damier noir et blanc déformé couvert de lettres/chiffres, sur fond de banquise (capture focus, prise ~10 s plus tard). Ces étapes sont une progression dans le temps (intro animée), pas un défilement : `scrollTo` n'a aucun effet (scrollY final 0, scrollHeight 900).
Documenté (étude de cas Awwwards, https://www.awwwards.com/igloo-inc-case-study.html) : la page n'a que trois sections, avec une navigation au défilement entre les projets du portefeuille. Je n'ai pas vu ces sections suivantes (la molette n'a pas été simulée sur ce site).

## Typographie
- JSON : aucune police web chargée (`fonts: []`), `bodyFont` = "Times New Roman" (police par défaut, signe qu'aucun texte HTML n'est stylé).
- Observé : de petits chiffres flottants dans le treillis 3D, des glyphes dans le damier. Documenté : l'interface et le texte sont rendus en WebGL via une texture SDF ("we can change letters by simply adjusting the offset of the SDF texture"), et le JSON montre un `msdfworker-*.js`. La typographie existe donc uniquement dans le canvas.

## Palette et direction artistique
Monochrome froid : gris bleuté (`bodyBg` rgb(160,165,177)), blancs glacés, noir du damier ; accent bleu pâle sous l'igloo. Esthétique "glace + données" : objets procéduraux, wireframe, grille de points numérotés, vignettage en bords arrondis. Très cohérente et sobre, sans couleur de marque criarde.

## Composition, grille et rythme
Plein cadre, un objet central (l'igloo) en vue plongeante 3/4, aucun élément HTML de mise en page (0 lien, 0 h1, `textLen` 0). Le rythme est dicté par la mise en scène caméra, pas par une grille.

## Comportement du défilement
Détourné : `body overflow: hidden` (JSON), hauteur de document = hauteur de fenêtre. Le défilement est virtuel (hypothèse : écoute de la molette/du toucher pilotant une timeline caméra). Les captures s0 à s95 ne montrent que l'avancée temporelle de l'intro.

## Transitions et micro-interactions
Observé : formation progressive des cristaux et du fil de fer, passage du wireframe au rendu texturé. Documenté (Awwwards) : transitions entre scènes combinant aberration chromatique, "tech displacement" et effet de givre ; glitch de l'UI via "a simple WebGL shader" ; texte qui se brouille (scramble) en décalant la texture SDF ; sons synchronisés aux particules.

## Technologies
**Confirmé**
- Three.js r165 (`window.__THREE__`, JSON), 2 contextes WebGL2 créés (JSON).
- Bundles Vite (noms `assets/index-<hash>.js`, `App3D-<hash>.js`) et workers dédiés : `bitmapworker`, `exrworker` (images HDR EXR), `msdfworker` (texte MSDF), `audioworker` (JSON, liste des scripts).
- Stack publiée dans l'étude de cas Awwwards : "Three.js, three-mesh-bhv [sic, three-mesh-bvh], Svelte, GSAP, Vite, and vanilla javascript" ; 3D et textures dans Houdini et Blender ; volumes VDB convertis dans un format compressé maison ; exporteurs de géométrie et stratégie de compilation des shaders au chargement et en arrière-plan ; mesures de performance continues pour "low-end devices" ; UI rendue en WebGL pour éviter les recalculs de style.
- GSAP non détecté en global (JSON `gsap: false`) : il est bundlé, ce que le collecteur ne voit pas.

**Hypothèse**
- Svelte ne sert qu'à amorcer l'application ; l'essentiel est du Three.js/GLSL écrit à la main (avis d'un commentateur Reddit relayé par la recherche, non officiel).

## Mobile
Capture mobile : l'igloo wireframe et son treillis sont recadrés au centre ; mobile-mid montre l'igloo sur la banquise en plongée. La scène est réellement recomposée pour le portrait (cadrage différent), pas simplement rétrécie. Poids identique au desktop (17,1 Mo) : pas de version allégée détectée.

## Accessibilité et robustesse
- Focus : après 3 Tab, aucun élément focalisé ; 0 lien ; aucun indicateur.
- Lien d'évitement : non.
- Sans JavaScript : page blanche totale (capture nojs), 0 caractère, 0 lien.
- Reduced motion : la capture reduced montre le fond gris vide à 5 s, comme la version normale au même instant ; aucune différence de traitement observable.
- Aucun h1 ni texte HTML : pour un lecteur d'écran ou un robot, la page se réduit au title "Igloo Inc." et à la meta description.

## Performance
Chiffres JSON (non bridé, valeurs relatives) : 17,1 Mo transférés desktop et mobile, dont 1,8 Mo de JS et 15,3 Mo "other" (géométries, textures, volumes binaires) ; 101 requêtes, 2 hôtes ; LCP 580 ms desktop / 536 ms mobile (LCP peu significatif : aucun élément de contenu, probablement un élément vide) ; CLS 0 ; `loadMs` 30 188 ms desktop, 18 395 ms mobile (temps jusqu'à l'événement load, très long même sur fibre).

## Points forts UX
- Direction artistique d'une cohérence rare, entièrement procédurale ; aucun contenu "décoratif" importé.
- Effort documenté sur le chargement (workers, compression maison, compilation de shaders en arrière-plan) et sur les appareils modestes.
- Intro temps réel plutôt que vidéo : poids maîtrisé pour la qualité visuelle obtenue (selon l'étude de cas).

## Points faibles ou risques
- Zéro contenu sans JS ni sans WebGL, zéro lien, pas de h1 : invisible pour la recherche et l'accessibilité.
- 17 Mo et 30 s avant `load` même sur fibre.
- Navigation entièrement détournée ; aucune alternative clavier observée.
- Production d'équipe (Houdini, exporteurs VDB, son) hors de portée d'un développeur seul.

## Idées transférables au portfolio de Johan sans copier
1. Texte d'interface en MSDF dans la scène uniquement pour les éléments décoratifs (compteurs, étiquettes 3D), en gardant le vrai contenu en HTML au-dessus du canvas.
2. Compiler les shaders et décoder les textures avant le premier affichage de la scène (`renderer.compile`, `compileAsync` dans Three.js récent, KTX2 + worker) pour éviter les saccades au premier mouvement : gain visible, peu de code.
3. Une palette volontairement réduite (deux gris, un noir, un accent) et un seul objet héros : c'est ce qui rend la scène lisible, et c'est reproductible sans pipeline Houdini.

## Niveau d'inspection
Consulté : JSON ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe complet (s0, s20, s45 non ouvert, s70, s95 non ouvert, focus, reduced) ; étude de cas Awwwards lue via WebFetch ; résultats de recherche sur les prix Awwwards 2024 et un fil Reddit (non officiel). Non vu : les trois sections de projets et la navigation au défilement, faute de simulation de molette sur ce site.
