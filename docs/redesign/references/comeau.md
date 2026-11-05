# Josh W. Comeau - https://www.joshwcomeau.com/

## Type et positionnement
Blog pédagogique et vitrine de cours payants (CSS for JavaScript Developers, The Joy of React) d'un développeur frontend. Ce n'est pas un portfolio de projets : la crédibilité vient entièrement des articles interactifs ("An Interactive Guide to Flexbox", "CSS Grid", "SVG Paths"...). Meta description : "Friendly articles and tutorials for front-end web developers". C'est le modèle le plus proche du profil de Johan (blog technique comme preuve principale).

## Structure de la page d'accueil (sections dans l'ordre)
1. En-tête : logo "Josh W Comeau", Categories, Courses, Goodies, About ; à droite recherche, son, thème, RSS.
2. Hero illustré : ciel et nuages, arc-en-ciel génératif en tirets (canvas), avatar 3D de l'auteur assis sur un nuage.
3. Colonne principale "Articles and tutorials" : liste chronologique, titre + sous-titre + extrait + "Read more", puis bouton "Show more" (capture s95).
4. Colonne latérale : "Browse by category" (pastilles CSS, React, Animation, Career, JavaScript, SVG, Next.js, General) puis "Popular content" (10 liens).
5. Pied de page sur fond de nuages : avatar à l'envers, inscription à la newsletter, liens par catégorie, cours, général.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Wotfard : texte et titres (sans-serif arrondie), titres d'articles en gras ~22 px, extraits ~16 px.
- Cartograph CF : mono pour le code inline (visible dans "linear()", "@starting-style", "animation-timeline"). Choix documenté par l'auteur (police payante, italiques cursives).
- Sur-titres de section en capitales espacées magenta ("ARTICLES AND TUTORIALS").
- Échelle sobre : pas d'effet display, la hiérarchie vient du poids et de la couleur.

## Palette et direction artistique
Bleu ciel et blanc, accents magenta (sur-titres) et bleu-violet (logo), arc-en-ciel bleu-violet-rose. Ton chaleureux et ludique (avatar 3D, emoji dans les titres, "Cowabunga!" en pied de page). Mode sombre disponible (bouton).

## Composition, grille et rythme
Deux colonnes desktop (contenu ~630 px à gauche, barre latérale ~310 px à droite) dans un conteneur centré ~1030 px. Espacement vertical généreux et régulier entre les articles. La barre latérale "Popular content" reste collante pendant le défilement (visible de s20 à s70 au même endroit).

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Natif. scrollY final 3128 sur 4192 de hauteur (cohérent avec 95 %). En-tête collant qui perd le fond ciel (s20). Barre latérale épinglée. Les articles du bas s'estompent en dégradé au-dessus du bouton "Show more" (s95).

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
Observé : en-tête collant, dégradé de fin de liste, bouton "Show more". Non observable dans les captures mais documenté par l'auteur dans "How I Built My Blog (2024 App Router Edition)" : arc-en-ciel interactif dont les modifications sont diffusées en temps réel à tous les visiteurs (PartyKit, WebSockets), effets sonores (bouton "Disable sounds" présent dans la navigation selon la sonde), bouton "like" par article, View Transitions API entre les pages en amélioration progressive.

## Technologies
**Confirmé**
- Next.js App Router (JSON : next = true, chunks `app/(home)/page`, `app/layout`).
- Documenté par l'auteur (article "How I Built My Blog", mis à jour octobre 2026) : Next.js 15, React 19, MDX 3, Linaria (CSS-in-JS à l'extraction, après styled-components), Shiki (coloration côté serveur), Sandpack (bacs à sable de code), React Spring, Framer Motion, MongoDB (likes, compteurs), TypeScript, PartyKit, Algolia (recherche), hébergement Vercel.
- Un canvas en desktop, zéro en mobile (JSON) : l'arc-en-ciel n'est pas rendu sur mobile. Aucun contexte WebGL.
- Polices Wotfard et Cartograph CF (JSON + article).
**Hypothèse**
- Les 3,4 Mo classés "other" en desktop (1,3 Mo en mobile) sont probablement des préchargements RSC des ~66 liens de la page (comportement par défaut de `<Link>` Next.js) ; non vérifié requête par requête.
- L'auteur reconnaît lui-même que la nouvelle version est légèrement moins performante que l'ancienne au Lighthouse et que Next.js charge du CSS d'autres routes (245 Ko chargés, 47 Ko utilisés sur un article).

## Mobile
Capture 390 px : en-tête avec recherche, thème et menu burger ; nuages conservés mais arc-en-ciel et avatar supprimés ; une seule colonne d'articles, barre latérale reportée plus bas (scrollH 6126). Texte confortable, rien de coupé.

## Accessibilité et robustesse
- Focus visible : oui, contour bleu net autour de "Categories" après 3 Tab (outline auto 1 px, rendu visible sur la capture).
- Lien d'évitement : présent (sonde : true).
- Sans JS : 6046 caractères et 66 liens présents (JSON) ; la capture nojs montre en-tête, nuages et articles. L'arc-en-ciel et l'avatar disparaissent, le contenu reste entier.
- h1 = "Josh W Comeau homepage" (h1 de service, probablement visuellement masqué).
- Reduced-motion : capture identique à la normale (l'arc-en-ciel est statique sur une image fixe, impossible de conclure sur son animation).

## Performance
Sans bridage réseau, valeurs relatives :
- Desktop : 4,6 Mo transférés, JS 891 Ko, CSS 195 Ko, images 43 Ko, polices 94 Ko, "other" 3,4 Mo ; 106 requêtes, 2 hôtes.
- Mobile : 2,4 Mo, JS 857 Ko, 76 requêtes.
- LCP 912 ms desktop, 532 ms mobile ; CLS 0.
Lourd pour une page de liste d'articles, mais le premier affichage est rapide (SSR).

## Points forts UX
- La preuve d'expertise est le contenu lui-même : titres explicites, extraits utiles, "Popular content" comme porte d'entrée.
- Personnalité forte et reconnaissable (avatar, ton, sons) sans gêner la lecture.
- Robustesse : contenu complet sans JS, focus visible, lien d'évitement, mode sombre.
- Article de coulisses qui détaille la stack et ses compromis, y compris les mauvais chiffres.

## Points faibles ou risques
- Poids et nombre de requêtes élevés pour l'accueil d'un blog ; l'auteur l'assume en échange de l'interactivité des articles.
- Pas de "travail client" visible : c'est un site d'enseignant, pas de prestataire.
- Ton très personnel difficile à transposer sans paraître imité.

## Idées transférables au portfolio de Johan sans copier
1. Mettre les articles phares en avant comme "preuves" : un bloc "articles les plus utiles" choisi à la main, pas seulement chronologique.
2. Publier un article "Comment est construit ce site" avec stack, budget de poids, mesures Lighthouse/CrUX et compromis assumés ; c'est exactement le registre performance/SEO de Johan.
3. Démos interactives intégrées dans les articles (un composant qui montre l'effet d'un `content-visibility`, d'un preload, d'un découpage de bundle) plutôt que des captures.
4. Faire mieux que la référence sur le poids : désactiver le préchargement massif des liens et le montrer chiffres à l'appui.

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, mobile-mid, nojs ; sonde : s20, s70, s95, focus, reduced. HTML de l'accueil (curl). Article "How I Built My Blog (2024 App Router Edition)" lu par extraits ciblés (stack, performance, View Transitions, PartyKit, Algolia). Pas d'interaction réelle avec l'arc-en-ciel ni les sons.
