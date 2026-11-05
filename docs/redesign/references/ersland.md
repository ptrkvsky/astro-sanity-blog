# Jonas Ersland (Jonas Sprattland) - https://jonasersland.net/

## Type et positionnement
Site d'artiste et réalisateur berlinois "working with lens-based media" (texte de la page), qui figure dans la galerie Brutalist Websites. Une seule page : une bio en très gros caractères, une liste de clients (Balenciaga, Nike, Y-3, PUMA, MSCHF, American Express...) et deux liens de contact. Le dispositif du site est participatif : un bouton "Submit background image" permet aux visiteurs de prendre une photo qui devient l'arrière-plan.

## Structure de la page d'accueil (sections dans l'ordre)
1. Bouton en pilule "Submit background image" en haut à droite (fixe).
2. Bio en deux paragraphes en très grand corps gras ("Jonas Sprattland (formerly Ersland) is a Berlin-based artist and director...").
3. Deux colonnes en bas : "Selected clients" (liste d'une vingtaine de marques) et "Contact" (Instagram, Email).
Clic sur "Submit background image" (testé) : écran blanc avec "Back" et "Take photo" (capture par webcam, hypothèse confirmée par le libellé et la présence de `getContext` dans le bundle).

## Typographie
- JSON : `forma-djr-text` (Forma DJR, via Adobe Fonts / Typekit, `use.typekit.net` dans le HTML).
- Une seule famille, une seule graisse visible (gras/black) ; deux tailles : ~44 px pour la bio, ~20 px pour les listes, italique pour les intitulés "Selected clients" et "Contact". Pas de hiérarchie par la taille au-delà de ces deux niveaux.

## Palette et direction artistique
Texte blanc (JSON `bodyColor` blanc) posé sur une image d'arrière-plan plein écran fournie par un visiteur, censée changer (le fichier `HOME/filenames.json` renvoie une image et une date, ex. `"date": "14.10"`). Dans nos captures, l'image n'a pas chargé : fond gris uni (~#ccc), d'où un contraste blanc sur gris très faible. DA brutaliste : aucune décoration, la photo du jour fait l'identité.

## Composition, grille et rythme
Marge unique de ~10 px, texte calé en haut à gauche sur environ la moitié de la largeur, listes en deux colonnes étroites. Pas de grille, pas de section, pas de navigation.

## Comportement du défilement
Natif ; la page dépasse à peine l'écran (scrollHeight 1177 px desktop, scrollY final 264). Captures sans changement autre que le décalage vertical.

## Transitions et micro-interactions
Aucune animation observée. Seule interaction : le parcours de soumission de photo (Back / Take photo).

## Technologies
**Confirmé**
- Application React monopage créée avec Create React App : HTML de 737 octets avec `<div id="root">`, `<noscript>You need to enable JavaScript to run this app.</noscript>`, bundle unique `static/js/main.<hash>.js` (curl).
- Bundle de 1,51 Mo décodé, 424 Ko en gzip (curl avec en-têtes) ; il référence `cdn.sanity.io` et `stream.mux.com` / `image.mux.com` (Sanity et Mux, CMS et vidéo).
- Serveur Apache derrière Varnish (en-têtes HTTP), en-tête `vary: x-is-ai-bot`.
- Pas de WebGL (0 contexte, JSON), pas de framework d'animation.
- Cause du fond gris : la page servie sur `jonasersland.net` appelle `https://www.jonasersland.net/HOME/filenames.json`, requête en échec (`net::ERR_FAILED` dans Playwright) ; la réponse de ce fichier ne contient pas d'en-tête `Access-Control-Allow-Origin` (curl), donc l'appel inter-origine apex vers www est bloqué par CORS.

**Hypothèse**
- Sur `www.jonasersland.net` (même origine), l'image du jour s'afficherait normalement ; le défaut toucherait seulement les visiteurs arrivant par le domaine nu.
- Le `vary: x-is-ai-bot` suggère un traitement différencié des robots IA côté Varnish.

## Mobile
Capture mobile : bouton en haut à gauche, grand vide gris, puis la bio en bas de l'écran en ~22 px. Lisible quand l'image est absente, mais la mise en page pousse le contenu sous la ligne de flottaison. Mobile-mid : suite de la bio et listes.

## Accessibilité et robustesse
- Focus : après 3 Tab, lien "Email" avec `outline: auto 1px` ; la capture focus montre un cadre noir net. Focus visible natif.
- Lien d'évitement : non (inutile sur une page aussi courte).
- Sans JavaScript : page blanche (capture nojs), 46 caractères (le message noscript), 0 lien, pas de h1. Aucun nom, aucun client, aucun contact sans JS.
- Aucun h1 même avec JS (JSON `h1: []`).
- Reduced motion : identique (pas d'animation).
- Contraste : blanc sur gris ~#ccc dans l'état observé, très insuffisant ; avec une photo variable fournie par des inconnus, le contraste n'est jamais garanti.

## Performance
Chiffres JSON (non bridé) : desktop 1,53 Mo dont 1,47 Mo de JS ; mobile 0,47 Mo dont 0,41 Mo de JS ; 7 requêtes, 3 hôtes ; LCP 1276 ms desktop / 908 ms mobile ; CLS 0. L'écart desktop/mobile correspond exactement à taille décodée contre taille gzip du même bundle (vérifié par curl : 1 510 139 octets décodés, 423 730 transférés) : le collecteur a mélangé les deux mesures. Pour un texte de 562 caractères, 424 Ko de JS compressé est disproportionné.

## Points forts UX
- Idée participative mémorable : le site change chaque jour grâce aux visiteurs, sans aucun travail de l'auteur.
- Message immédiat : qui, quoi, pour qui, comment le contacter, en un écran.
- Liste de clients prestigieux en texte brut : la preuve sociale sans logos ni mise en scène.

## Points faibles ou risques
- Contenu entièrement dépendant de JavaScript alors qu'il tiendrait en 2 Ko de HTML : invisible sans JS, pas de h1, SEO minimal.
- Bug CORS apex/www qui casse la fonctionnalité centrale (le fond) dans notre test.
- Contraste non maîtrisé par construction (photo arbitraire derrière du texte blanc), pas de voile ni d'ombre.
- Modération des images soumises par des inconnus : risque éditorial.

## Idées transférables au portfolio de Johan sans copier
1. Une page de présentation qui tient en un écran et en HTML pur (bio, spécialités, clients/employeurs en texte, contact) comme socle, sur laquelle la couche WebGL s'ajoute : exactement l'inverse de ce site, et c'est la leçon principale.
2. Un élément "vivant" alimenté sans effort de maintenance (ex. dernier article du blog, dernier score Lighthouse mesuré en CI, dernier commit) plutôt qu'un contenu utilisateur à modérer.
3. Toujours un voile ou une ombre sous le texte posé sur une image variable, et un test de contraste sur l'état "image absente".

## Niveau d'inspection
Consulté : JSON ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; probe (focus, reduced ouverts ; s0 à s95 non ouverts, page quasi statique) ; HTML et bundle JS téléchargés (curl, recherche de Sanity/Mux/WebGL) ; passage Playwright avec journal réseau (échec de `filenames.json`) et clic sur "Submit background image" ; en-têtes HTTP de `filenames.json` (curl). Non vu : le site avec son image d'arrière-plan réelle.
