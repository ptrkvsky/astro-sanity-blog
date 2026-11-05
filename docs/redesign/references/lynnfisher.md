# Lynn Fisher - https://lynnandtonic.com/

## Type et positionnement
Portfolio personnel d'une "web designer, CSS developer and artist" (meta description). Le site est refait chaque année depuis 2007 (page Archive : v. I à v. XIX, avec une étude de cas publiée pour la plupart des versions). Le positionnement est celui d'une créatrice qui expérimente avec le web comme médium : la crédibilité vient des projets annexes très médiatisés (Nestflix, Hollywood Age Gap, Airport Codes, A Single Div, cités dans la presse sur la page About) et de la démarche annuelle documentée, pas d'une liste de compétences.

## Structure de la page d'accueil (sections dans l'ordre)
La page d'accueil tient sur un seul écran (scrollH = 900 en desktop, 844 en mobile) :
1. Nom en très grand ("LYNN FISHER", h1) et sous-titre "Designer for the Web" (h2).
2. Sommaire façon livre de poche : About I, Work II, Thoughts III, Archive IV, RSS V, Gifs VI, avec points de conduite.
3. "v. XIX" (numéro de version du site) et bouton de bascule clair/sombre.
Rien d'autre : pas de projets, pas d'appel à l'action. La page Work (consultée en HTML) est une simple liste de 15 projets avec leur domaine.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Hubano-Rough (préchargée) : display, nom en capitales très grand, aspect imprimé/rugueux.
- SydoniaAtramentiqua Regular/Light/Bold : texte, sous-titre et entrées du sommaire en petites capitales.
- Pas de mono observée sur l'accueil.
- Échelle très contrastée : un niveau display énorme, puis tout le reste à taille de texte. L'autrice documente le choix (étude de cas 2025) : polices choisies pour "ajouter au style imprimé".

## Palette et direction artistique
Fond papier beige (rgb 228,226,215) avec texture de grain, texte noir. Mode sombre documenté comme "la version gothique du livre" avec "poussière claire". Direction artistique : livre de poche ancien, table des matières, numérotation romaine. Une seule idée, appliquée jusqu'au bout.

## Composition, grille et rythme
Colonne centrée étroite. L'étude de cas 2025 précise que le contenu fait 436 px de large fixe en desktop, et redevient fluide pleine largeur sous 500 px. Beaucoup de vide autour, rythme vertical régulier dans le sommaire.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Aucun défilement sur l'accueil (page d'un écran ; scrollY final = 0 dans la sonde). Les captures s0 à s95 sont donc identiques. Défilement natif sur les pages internes (non mesuré par la sonde).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Non observable sur les captures (statiques) : l'effet signature de la v. XIX se déclenche au redimensionnement de la fenêtre. Documenté par l'autrice et vérifié dans le JS servi (main.min.js, 1,6 Ko) : un ResizeObserver applique `transform: scale(x, 1)` au conteneur pendant le redimensionnement (le site "s'étire comme un élastique"), puis revient à 1 après 200 ms avec une transition rebondissante (`cubic-bezier(0.175, 0.885, 0.12, 1.775)`).
- Bascule clair/sombre mémorisée dans localStorage (script inline dans le head pour éviter le flash).
- Focus clavier très travaillé (voir accessibilité).

## Technologies
**Confirmé**
- Pas de framework détecté (JSON) ; 2 scripts : `/js/main.min.js` (9,9 Ko transférés) et GoatCounter (`gc.zgo.at/count.js`, analytics sans cookie).
- Effet ResizeObserver + scale : lu dans main.min.js et documenté dans "Case Study: lynnandtonic.com 2025 refresh".
- Polices Hubano Rough (SimpleBits) et Sydonia Atramentiqua : nommées dans l'étude de cas, chargées selon le JSON.
- CSS : 3 media queries `prefers-color-scheme: dark`, 11 règles `:focus-visible`, aucune règle `prefers-reduced-motion` (grep sur main.css).
**Hypothèse**
- Générateur de site statique (HTML propre, classe `no-js` retirée par JS, aucun marqueur de framework) ; le générateur exact n'est pas identifié.

## Mobile
Capture 390 px : même composition, nom sur deux lignes qui remplit la largeur, sommaire pleine largeur avec points de conduite, version et icône de thème en bas. Lisible et fidèle à la desktop. L'effet d'étirement est désactivé sous 500 px (documenté).

## Accessibilité et robustesse
- Focus visible : oui, très marqué. Après 3 Tab, "THOUGHTS" porte un contour plein de 4 px avec ombre portée décalée (capture focus). L'étude de cas 2025 détaille la technique (outline + outline-offset + double box-shadow pour masquer la fuite d'ombre).
- Lien d'évitement : absent sur l'accueil (sonde : false), mais les pages internes ont un "Jump to navigation" ; l'autrice explique qu'elle saute vers la navigation placée en bas de page.
- Sans JS : vérifié par curl. Le HTML servi contient tout le contenu de l'accueil (h1, h2, 6 liens, version). Le JSON indique 82 caractères parce que la page n'en contient réellement pas davantage, pas parce que le contenu dépend de JS. La capture nojs est identique à la version JS, moins le bouton de thème.
- Reduced-motion : capture identique (attendu, rien n'est animé au chargement). L'effet d'étirement au redimensionnement n'a pas de garde-fou `prefers-reduced-motion` dans le CSS ou le JS lus.

## Performance
Mesures sans bridage réseau (valeurs relatives) :
- Desktop : 403 Ko transférés, JS 10 Ko, CSS 4 Ko, images 229 Ko (texture papier), polices 158 Ko ; 10 requêtes, 3 hôtes.
- LCP 560 ms desktop, 580 ms mobile ; CLS 0.
- Le poste le plus lourd est la texture et les 4 fichiers de police, pas le code.

## Points forts UX
- Accès immédiat : tout le site est à un clic, sans chargement ni intro.
- Une idée graphique forte et cohérente (livre de poche) qui se lit en une seconde.
- Démarche publique : 19 versions archivées et commentées, ce qui prouve la constance et la curiosité technique mieux qu'un discours.
- Focus clavier et mode sombre traités comme des éléments de design.

## Points faibles ou risques
- Pour un recruteur pressé : aucune preuve de travail sur l'accueil, il faut cliquer sur Work, qui n'est qu'une liste de liens sans visuel ni contexte.
- L'effet signature est invisible sans redimensionner la fenêtre (desktop uniquement) : beaucoup de visiteurs ne le découvriront pas.
- Pas de garde-fou reduced-motion sur l'effet d'étirement.
- Polices fantaisie pour le texte courant : lisibilité correcte ici car les textes sont très courts.

## Idées transférables au portfolio de Johan sans copier
1. Versionner et archiver son propre site avec une note de conception par version ("v1 Astro + WebGL, v2 ...") : une preuve de démarche qui s'accorde avec un blog technique de 69 articles.
2. Publier l'étude de cas technique du portfolio lui-même (choix de rendu, budget de poids, mesures avant/après), au lieu d'annoncer "fort en performance".
3. Faire du focus clavier un élément de la charte graphique, documenté dans un article.
4. Une interaction signature unique, discrète et réversible, plutôt qu'une accumulation d'effets ; la garder désactivable en reduced-motion.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, mobile, nojs (data) ; sonde lancée, captures focus et reduced vues (s0 à s95 identiques car page d'un écran). HTML de l'accueil, /about, /work, /archive récupérés par curl ; main.css et main.min.js lus ; étude de cas 2025 lue en entier, études 2021-2023 récupérées pour chercher le générateur (non trouvé). Pas d'interaction réelle de redimensionnement testée.
