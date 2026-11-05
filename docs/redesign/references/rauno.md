# Rauno Freiberg - https://rauno.me/

## Type et positionnement
Page d'accueil-index d'un "interaction designer" (design engineer) qui travaille chez Vercel et publie Devouring Details (cours/livre interactif sur les détails d'interface). Le h1 résume tout : "Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details". Le site est un objet d'interaction en soi : un carrousel de cartes qui renvoie vers ses productions (Devouring Details, Craft, History of Software Design, Projects, Field Notes, anciennes versions 2022 et 2023).

## Structure de la page d'accueil (sections dans l'ordre)
Une seule rangée horizontale de cartes blanches sur fond gris, avec un indicateur de progression en haut (traits verticaux, le trait courant devient un rectangle) :
1. Carte intro : h1 en grande taille sur plusieurs lignes en escalier, gros disque jaune.
2. Devouring Details : "D" géant et disque orange.
3. Craft : mot "Craft" en très grand, coupé par le bord.
4. History of Software Design : main-curseur pixelisée bleue.
5. Projects : mot géant coupé.
6. Field Notes : "Rauno's Field Notes" manuscrit en rouge.
7. Twitter, 2022, 2023 (anciennes versions du site), GitHub, Email (la sonde lit "Email Copied" : copie dans le presse-papiers).
Chaque carte a une légende discrète au-dessus à gauche.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Une seule famille chargée, nommée "X" dans le JSON (fichier `/dd.woff2` préchargé dans le HTML), grotesque neutre type Helvetica/Neue Haas.
- Rôle display : mots coupés par les bords des cartes, corps énorme (plus de 300 px sur "Craft", "Projects").
- Rôle texte : légendes de cartes ~14 px gris.
- Pas de mono. Échelle binaire : géant ou minuscule, rien entre les deux.

## Palette et direction artistique
Fond gris très clair (rgb 237,237,237), cartes blanches, texte noir. Une couleur pure par carte (jaune #FFFF00, orange, bleu électrique, rouge manuscrit). Esthétique Swiss / brutaliste maîtrisée : typographie, aplats géométriques, aucun visuel photographique. Curseur personnalisé en croix fine au centre de l'écran.

## Composition, grille et rythme
Cartes de largeur variable (~720 à 1060 px) espacées de ~24 px, alignées verticalement au centre de la fenêtre. Le rythme est horizontal : une carte domine, les voisines dépassent sur les bords pour inviter à continuer.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Défilement vertical natif converti en déplacement horizontal (desktop) : hauteur de document 6108 px, scrollY final 4949, et les captures s0, s20, s45, s70, s95 montrent la rangée de cartes qui avance vers la gauche (intro, puis Devouring Details/Craft, puis History of Software Design/Projects, puis Field Notes/Twitter). L'indicateur du haut suit la position. Technique type "section épinglée + translation horizontale". En mobile, la hauteur du document est 844 px : pas de défilement vertical, la rangée se parcourt au doigt (hypothèse sur le geste, non testé).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
- Observé : progression de l'indicateur, cartes qui défilent, curseur en croix.
- "Email Copied" dans la navigation lue par la sonde : clic qui copie l'adresse avec retour d'état (non testé visuellement).
- Les animations d'entrée, le comportement au survol et les transitions de cartes ne sont pas observables sur les captures fixes.

## Technologies
**Confirmé**
- Next.js Pages Router (JSON : next = true ; chunks `pages/_app`, `pages/index`, `_ssgManifest` : génération statique).
- Vercel Web Analytics (`/_vercel/insights/script.js`).
- Framer Motion : chaînes caractéristiques trouvées dans le bundle `_app` téléchargé (`motionValue`, `layoutId`, require optionnel de `@emotion/is-prop-valid`, lecture de `prefers-reduced-motion` par la librairie), et HTML serveur avec `style="opacity:0;transform:none"`, signature des états initiaux Framer Motion.
- Aucun canvas ni WebGL (JSON).
**Hypothèse**
- Gestion de la molette par @use-gesture (fonctions `wheelChange`, `timeoutStore` dans le chunk 540, typiques de cette librairie).
- Les chunks `pages/projects` et `pages/craft` chargés sur l'accueil viennent du préchargement des liens Next.js.

## Mobile
Capture 390 px : indicateur en haut, une carte intro réduite (~360 × 215 px) centrée verticalement, beaucoup de vide gris au-dessus et en dessous ; le h1 passe en ~22 px. La carte voisine dépasse à peine à droite. Lisible mais l'écran est sous-utilisé et rien n'indique le geste horizontal à part le bord de la carte suivante.

## Accessibilité et robustesse
- Focus visible : non. Après 3 Tab, le focus est sur le lien "History of Software Design" avec `outline: none`, et la capture focus est entièrement grise : la mise en page ne se remet pas en place quand le focus clavier déplace la rangée. Navigation clavier sérieusement dégradée.
- Lien d'évitement : absent.
- Sans JS : écran blanc (capture nojs) alors que 331 caractères existent dans le DOM : le contenu est servi avec `opacity:0` et n'apparaît qu'à l'hydratation.
- Reduced-motion : capture identique à la normale. Framer Motion lit la préférence, mais aucune différence de rendu n'est visible au chargement.
- SEO : pas de meta description (JSON : desc null), aucun h2.

## Performance
Sans bridage, valeurs relatives :
- 1,66 Mo transférés dont 1,56 Mo de JS (94 %), CSS 12 Ko, 0 image, police 52 Ko ; 32 requêtes, 1 hôte. Identique desktop et mobile.
- LCP 756 ms desktop, 680 ms mobile ; CLS 0.
Paradoxe : une page sans image dont presque tout le poids est du JavaScript.

## Points forts UX
- Positionnement compris en une phrase (le h1).
- Direction artistique immédiatement mémorable avec trois fois rien (typo, aplats, une couleur par carte).
- Les anciennes versions (2022, 2023) restent accessibles en sous-domaines : historique visible.
- La page est un sommaire : chaque carte mène à une production réelle (cours, essais, projets).

## Points faibles ou risques
- Clavier : focus invisible et affichage cassé au Tab.
- Écran blanc sans JS, alors que le contenu est dans le HTML.
- 1,5 Mo de JS pour une dizaine de liens.
- Pas de meta description.
- Le défilement converti en horizontal surprend et allonge l'accès au dernier lien (Email en fin de rangée).

## Idées transférables au portfolio de Johan sans copier
1. Un h1 qui est une phrase complète de positionnement ("Johan Petrikovsky, développeur frontend à Toulouse, spécialiste performance et SEO technique..."), utile pour l'humain et pour le référencement.
2. Une couleur d'accent différente par grande rubrique (articles, projets, à propos) pour se repérer sans ajouter d'images.
3. Garder les anciennes versions du site en ligne sur des sous-domaines datés, en particulier la version Astro + WebGL actuelle.
4. Contre-exemple utile : prouver qu'on peut obtenir le même impact visuel avec quasi zéro JS (Astro, CSS scroll-driven animations) et rendre le contenu visible sans hydratation.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s20, s70, focus, reduced (s0/s45/s95 non ouvertes individuellement, la progression est lisible sur s20 et s70). HTML de l'accueil par curl (liens, styles inline) ; chunks JS téléchargés et cherchés par mots-clés (Framer Motion, molette, reduced-motion). Pas de page interne ni d'article de l'auteur consulté sur la stack.
