# Jakub 'Urbik' Urbanec - https://www.urbik.eu/

## Type et positionnement
Site personnel d'un développeur frontend senior basé à Prague (10+ ans, Vue, React, Next.js, Nuxt, TypeScript) qui est aussi DJ ("Urbik", drum and bass, halftime, jungle) et artiste audiovisuel. Titre : "Web Developer | DJ | AV artist". Positionnement "développeur qui aime l'architecture, la performance et l'interaction plutôt que l'intégration d'UI", avec un fort intérêt pour Canvas 2D, particules, rendu temps réel et WebGL. Site mi-CV mi-carte de visite d'artiste.

## Structure de la page d'accueil (sections dans l'ordre)
1. Hero plein écran : nom et sous-titre centrés en haut avec halo lumineux, grand motif génératif (treillis géométrique déformé en coussin, dégradé violet / vert anis) autour d'un emblème en étoile à quatre branches, liens secondaires en mono "MUSIC / VISUALS / BLOG".
2. Barre d'onglets en bas d'écran : "General / Developer / DJing" (bande violette), qui remonte et devient collante au défilement (s20).
3. Bande "LINKS" (e-mail, Facebook) propre à l'onglet.
4. "00 / ABOUT - Developer, DJ and explorer of digital things" : texte d'introduction + photo de l'auteur en concert.
5. Chiffres clés en 4 cases : Prague (Base), 10+ (Development years), FE (Primary field), Urbik (DJ name).
6. "01 / PROFILE - Three important parts of my life" : trois cartes numérotées (Web development, Music, Jupiter le chien).
7. "Offline mode", puis dans l'onglet Developer : "Basic developer info" (Vue/React, REST/WebSockets, build, perf, Canvas, WebGL), liens GIT repos, LinkedIn, Canvas game, Mobile game ; onglet DJing : sets, visuels, Instagram (contenu lu dans le HTML).
Bandeau de consentement analytics en bas à droite.

## Typographie
- JSON : une seule famille, "Oxanium" (display géométrique techno, pile de repli "Roboto Condensed").
- Rôle observé : Oxanium partout, en gras avec halo (text-shadow lumineux) pour le nom et les titres de section, en régulier pour le texte. Une mono (police système probablement) en capitales espacées pour les sur-titres "00 / ABOUT", "01 / PROFILE", "MUSIC / VISUALS / BLOG".
- Échelle : nom environ 40 px, titres de section 30 px, chiffres clés 45 px en vert anis, texte 16-24 px.

## Palette et direction artistique
Fond quasi noir (rgb(8,9,9)), violet électrique et vert anis/chartreuse en accents, texte blanc cassé à halo. DA "flyer de soirée drum and bass / interface de VJ" : motifs génératifs, lueurs, cadres fins. Cohérente avec l'identité DJ/AV de l'auteur.

## Composition, grille et rythme
Colonne centrale encadrée (conteneur environ 1 180 px avec filet), sections numérotées en cartes à bord fin, grilles 4 colonnes (chiffres) et 3 colonnes (profil). Rythme régulier de cartes, assez proche d'un CV en ligne. Le motif génératif reste en fond, atténué, derrière le contenu.

## Comportement du défilement
- Défilement natif (pas de Lenis), page de 4 120 px (desktop) et 5 671 px (mobile).
- s0 : hero plein écran. s20 : le motif se replie en bandeau, la barre d'onglets se colle sous le header, le contenu "About" apparaît. s70 : cartes "Three important parts of my life". s95 et focus : retour au haut.
- Header avec nom et sous-titre toujours visible (collant).

## Transitions et micro-interactions
- Observé : le motif du hero change entre les captures (treillis en losanges, cercles, étoiles) : génération procédurale qui évolue dans le temps. Le hero se compresse en bandeau au scroll.
- Bouton "Hide content" (détecté par la sonde dans la nav) : permet de masquer le contenu pour ne voir que le visuel (déduit du libellé).
- Dans le bundle : démos interactives (field demo sur canvas 2D, séquences, overlay), vidéos d'enregistrement de projets génératifs ("eraser-geomancy.mp4", "White Fountain") en `preload="none"`, AudioContext.

## Technologies
**Confirmé**
- Pas de framework détecté : un seul bundle `fe.js` (834 Ko) avec un mini-système de rendu DOM maison ; le HTML serveur contient le contenu (2 200 caractères et 16 liens sans JS).
- Three.js r186 (window.__THREE__), un contexte WebGL2, 2 canvas ; `ShaderMaterial` et `WebGLRenderer` dans le bundle.
- Canvas 2D pour des démos (`.ds-field-demo__canvas`), `OffscreenCanvas` et `AudioContext` présents dans le bundle.
- `prefers-reduced-motion: reduce` testé à au moins trois endroits du bundle (séquences, démo de champ, overlay).
- Balisage : `<h1 class="header__headline">`, `<main>`, plusieurs `<nav aria-label="...">` ("Content sections", "Links").
- Police unique Oxanium (18 Ko).
**Hypothèse**
- Les 145 Mo de "media" mesurés proviennent d'une ou deux vidéos lourdes chargées en entier (visuels VJ ou enregistrements), malgré le `preload="none"` vu pour certaines vidéos du blog.
- Le motif du hero est un shader procédural Three.js.

## Mobile
Capture 390x844 : hero recadré en portrait (motif plein écran, emblème centré, nom et sous-titre en haut), onglets en bas en partie cachés par le bandeau cookies qui occupe environ un quart de l'écran. LCP mobile 548 ms (texte rendu côté serveur). Hauteur de page plus grande qu'en desktop (empilement des cartes).

## Accessibilité et robustesse
- Focus : après 3 Tab, bouton "BLOG" avec `outline: solid 3px` vert anis, bien visible (capture focus).
- Lien d'évitement : détecté par la sonde (ancre interne `#...` dont le libellé contient "content"/"main"), absent du HTML statique, donc injecté par le JS ; non vu à l'écran.
- Sans JS : nom, sous-titre, liens MUSIC/VISUALS/BLOG et onglets visibles ; le motif est absent et le contenu des sections ne s'affiche pas dans la capture (fermé par défaut, classe `content--closed`), bien qu'une partie soit dans le DOM.
- Reduced motion : la capture reduced montre toujours le motif complet (motif différent, ce qui reflète la génération procédurale) ; aucune différence de mise en page observable sur une image fixe. Le code gère la préférence pour certaines animations.

## Performance (Chromium, réseau non bridé, valeurs relatives)
- Desktop et mobile : 148 Mo transférés, dont 145,8 Mo de médias. JS 834 Ko (un seul fichier), CSS 99 Ko, images 1,2 Mo, police 19 Ko, seulement 12 requêtes, 1 hôte. LCP 5 832 ms desktop, 548 ms mobile, CLS 0.
- Le poids média est de loin le pire du groupe et rend le site inutilisable en données mobiles si la vidéo se charge réellement chez l'utilisateur ; il faut relativiser selon le comportement réel de la vidéo (non identifiée).

## Points forts UX
- Identité forte et sincère (DJ/AV + dev), motif génératif qui sert de signature.
- Structure claire en onglets par audience (General / Developer / DJing) : chaque visiteur va à sa partie.
- Chiffres clés lisibles d'un coup d'oeil, focus visible, `aria-label` sur les nav, respect partiel de reduced-motion.
- Stack sans framework, une seule police légère.

## Points faibles ou risques
- 145 Mo de médias transférés : défaut majeur pour un développeur qui revendique la performance.
- LCP desktop de 5,8 s.
- Peu de projets montrés sur la home (texte de CV plutôt que démonstrations) ; le lien vers le code et les jeux est relégué à une bande de liens.
- Bandeau cookies envahissant sur mobile.
- Halo lumineux sur tout le texte : lisibilité moyenne sur les paragraphes longs.

## Idées transférables au portfolio de Johan sans copier
1. Onglets ou filtres par audience ("Recruteur / Client freelance / Développeur") qui réorganisent le même contenu : utile pour un profil à la fois salarié et freelance.
2. Bloc de chiffres clés (ville, années, spécialité, un chiffre perf mesuré) en tête de page, rendu côté serveur pour un LCP textuel rapide.
3. Un motif génératif personnel comme signature, mais rendu en canvas 2D ou SVG léger, mis en pause hors écran et figé sous reduced-motion.
4. Contre-exemple utile : vérifier systématiquement le poids des vidéos (poster + `preload="none"` + chargement au clic), car un seul média peut annuler tout le travail de perf.

## Niveau d'inspection
Home seule, défilement complet. Captures data (desktop, desktop-mid, mobile, nojs) et probe (s20, s70, focus, reduced) consultées ; s0, s45, s95 présentes (non toutes ouvertes). HTML et bundle `fe.js` inspectés par recherche ciblée. Onglets Developer et DJing non cliqués, blog et visuels non ouverts, vidéo lourde non identifiée.
