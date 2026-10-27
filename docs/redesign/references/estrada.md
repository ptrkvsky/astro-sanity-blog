# David Estrada - https://david-estrada.dev/

## Type et positionnement
Portfolio commercial d'un freelance web designer / intégrateur WordPress + Elementor basé à Mijas (Espagne). Accroche "Web designer and developer for sites with personality." Orientation conversion très assumée : tout renvoie vers Upwork ("Hire me on Upwork", "100% Job Success", "Top Rated"), services avec prix et délais affichés ("A redesign that keeps what works - From $500 - 6 days"). Cible : petites entreprises et marques personnelles qui veulent un site éditable par elles-mêmes.

## Structure de la page d'accueil (sections dans l'ordre)
1. Header fixe : "©DavidEstrada", nav centrée Work(7) / Services / Reviews / About, bouton "Hire me on Upwork" à droite (sur mobile : bouton "Menu").
2. Hero sombre : titre deux tons, CTA orange avec photo de l'auteur + lien "See my work", ligne de preuve sociale, gros badge 3D Upwork à droite, puis le nom géant "David [affiche de projet tournante] Estrada" en bas.
3. "Selected work" (7 projets) : grandes affiches de projets qui défilent sur un titre épinglé ("work"), légende en bas (catégorie + "Read the case study").
4. "Kind words" sur fond noir : titre géant éclaté bord à bord, sous-titre deux tons, citations clients qui s'allument au passage, étoiles.
5. About sur fond clair : texte long + fiche (Based in, Languages, Tools, On Upwork).
6. "Working together" (titre géant avec badge 3D bulle) et offres de service en lignes (nom, description, prix, délai) + "See all three in detail".
7. Bloc final orange "Let's talk" avec badge 3D Upwork.
Bandeau de consentement cookies en bas à gauche, persistant.

## Typographie
- JSON : "neue-haas-grotesk-display" (Adobe Fonts) et "Satoshi" (body).
- Rôle observé : Neue Haas Grotesk Display en très gros corps et graisse forte pour les titres de section ("Kind words", "work", "Let's talk", "David Estrada", environ 200 px), et en graisse légère avec approche serrée pour les phrases d'accroche (hero, "What it's like to work with me,") avec la seconde ligne en gris. Satoshi pour le texte courant, les boutons, la nav et la fiche About.
- Échelle très contrastée : titres d'environ 200 px, accroches environ 70 px, texte 20-24 px, méta 14 px. Les commentaires du code confirment l'intention : "each section opens with two bold words fitted edge to edge".

## Palette et direction artistique
Alternance de sections sombres (rgb(10,8,6), brun-noir chaud) et claires (blanc), un accent orange brûlé (CTA, bloc "Let's talk", étoiles). Badges 3D "coussins" en plastique blanc brillant (Upwork, bulle, logos WordPress/Elementor/Figma). DA "studio suisse commercial" : grotesque géante, beaucoup de blanc, objets 3D doux qui apportent la touche ludique.

## Composition, grille et rythme
Marges latérales fines (environ 23 px) et titres bord à bord. Hero en deux colonnes (texte gauche, badge droite). Section travaux en composition asymétrique (affiche gauche environ 55 %, mot "work" à droite épinglé). Offres en tableau à trois colonnes séparées par des filets. Rythme alterné sombre / clair / sombre / clair / orange qui découpe la page en chapitres.

## Comportement du défilement
- Défilement natif (pas de Lenis, pas de body overflow détourné), page longue (15 258 px desktop).
- s20 : affiche WinWin Partners qui passe sur le titre "work" épinglé (le code décrit "the posters scroll over the pinned title with a little weight", variables `--p` dérive et `--v` inclinaison selon la vitesse).
- s45 : "Kind words" plein écran ; s70 : About puis début de "Working together" ; s95 : offres et bloc orange "Let's talk".
- Le header change de thème selon la section claire ou sombre (observé : header sombre sur sections sombres, clair sur sections claires ; confirmé par un commentaire du code).

## Transitions et micro-interactions
- Observé : affiche de projet qui change à l'intérieur du nom (WinWin, VisiBroad, Costa del Sol selon les captures) ; badges 3D qui apparaissent autour du nom (WordPress, Elementor visibles en focus) ; citations qui passent de grisées à pleines.
- Documenté dans les commentaires de `main.js` (non testé à la main) : badges 3D qui flottent, se tournent vers le pointeur, peuvent être attrapés et lâchés, roulent sur un chemin en huit au scroll ; mots de titre qui sortent d'un masque à la première apparition ; étiquette "View case" qui suit le pointeur sur les affiches ; bouton du header qui s'efface quand celui du hero est visible ; menu plein écran sur mobile.

## Technologies
**Confirmé**
- WordPress (thème sur mesure `wp-content/themes/davidestrada`, meta generator "Site Kit by Google 1.190.0"). L'auteur décrit son process : Figma puis WordPress/Elementor, widgets Elementor sur mesure.
- JavaScript vanilla sans framework (`main.js` 51 Ko, commenté en anglais).
- Three.js r170 dans un Web Worker (`feature3d.worker.bundle.js`, 575 Ko) rendant en OffscreenCanvas ; les images sont renvoyées en ImageBitmap et dessinées dans des canvas 2D (14 canvas, aucun contexte WebGL sur le thread principal, d'où `webgl: []` dans le JSON). Détection de support (`Worker`, `OffscreenCanvas`, `createImageBitmap`) avec repli sur un rendu local, et nettoyage complet (classe `is-3d` retirée) si l'échec persiste. Fichier généré par `tools/3d/build.mjs`.
- `prefers-reduced-motion: reduce` lu dans `main.js` et utilisé dans au moins 6 branches (rotation des affiches, citations, titres masqués, coussins, entrée).
- Chargement différé des images en arrière-plan après le hero (commentaire du code), attente explicite des polices Adobe avec délai maximum de 4 s.
- Google Analytics conditionné au consentement.
**Hypothèse**
- Les badges sont des modèles extrudés générés à partir des logos (paramètres `width`, `color`, `angles` par badge dans la config).

## Mobile
Captures 390x844 : titre en haut, badge Upwork 3D plus petit, nom géant "David / Estrada" sur deux lignes avec l'affiche à côté, menu condensé en bouton "Menu". Mi-page : citations clients en carrousel horizontal (la suivante déborde à droite), CTA "Hire me" visible dans le header. Bandeau cookies couvrant environ 20 % du bas d'écran. LCP mobile 832 ms, meilleur que desktop.

## Accessibilité et robustesse
- Focus : après 3 Tab, "Services" dans la nav avec `outline: solid 2px` orange arrondi, très visible (capture focus). Le meilleur indicateur de focus du groupe.
- Pas de lien d'évitement.
- Sans JS : le DOM contient 5 510 caractères et 31 liens, mais la capture sans JS n'affiche que le header sur un fond vide : le hero est masqué jusqu'à ce que le JS le libère ("the page stays hidden until the hero is really ready", commentaire du code, et le CSS le retient). Contenu indexable, mais invisible sans JS.
- Reduced motion : différence réelle. La capture reduced n'a pas le badge 3D Upwork du hero (le reste est identique) et l'affiche dans le nom est figée sur un autre projet ; le code saute plusieurs animations sous `reduce`.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop : 1,50 Mo transférés, JS 166 Ko (le worker 3D de 575 Ko non compressé n'est pas compté dans ce total, probablement chargé après la mesure ou compressé), images 1,20 Mo, polices 102 Ko, 33 requêtes, 3 hôtes. LCP 6 852 ms, CLS 0,013.
- Mobile : 1,11 Mo, LCP 832 ms, CLS 0.
- Le LCP desktop élevé est cohérent avec le choix documenté de retenir l'entrée du hero jusqu'au dessin du badge 3D.

## Points forts UX
- Clarté commerciale : qui, quoi, pour qui, preuve, prix, délai, un seul CTA répété.
- Études de cas résumées en une phrase de résultat ("Conversions have been going up since", "built without a single line of custom CSS").
- 3D décorative mais isolée dans un worker, avec repli et respect de reduced-motion : ambition visuelle sans compromettre la robustesse.
- Focus visible exemplaire, code commenté qui explique chaque intention.

## Points faibles ou risques
- Hero masqué tant que le JS et la 3D ne sont pas prêts : LCP desktop de 6,9 s et page blanche sans JS.
- Bandeau cookies imposant qui reste sur toutes les captures.
- Dépendance totale à Upwork comme canal de contact (pas d'e-mail visible).
- Titres bord à bord sensibles aux longueurs de traduction.

## Idées transférables au portfolio de Johan sans copier
1. Rendu 3D dans un Web Worker avec OffscreenCanvas et détection de support + repli, exactement le type d'architecture à montrer et à expliquer dans une étude de cas "perf" (thread principal libre, INP préservé).
2. Faire de `prefers-reduced-motion` un vrai mode alternatif (éléments 3D retirés, contenus figés) et le dire dans un colophon.
3. Offres ou formats d'intervention en lignes nettes (type de mission, durée, ce qui est livré), adapté au statut de Johan (mission freelance, audit perf/SEO), avec une seule action de contact.
4. Ne pas retenir le hero derrière l'effet : afficher le texte immédiatement et laisser l'objet 3D arriver ensuite, pour éviter le LCP de 6,9 s observé ici.

## Niveau d'inspection
Home seule, défilement complet. Captures data (desktop, desktop-mid, mobile, mobile-mid, nojs) et probe (s20, s45, s70, s95, focus, reduced) consultées. Lecture du HTML (curl) et des scripts du thème (`main.js`, `feature3d.bundle.js`, recherche ciblée dans `feature3d.worker.bundle.js`). Pas de page de cas d'étude ouverte.
