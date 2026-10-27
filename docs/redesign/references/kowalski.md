# Emil Kowalski - https://emilkowal.ski/

## Type et positionnement
Site personnel d'un "Design Engineer" (passé par Linear et Vercel selon la page), auteur de librairies React open source très utilisées (Sonner pour les toasts, Vaul pour les tiroirs) et de cours (animations.dev, aiforui.dev). Positionnement : l'expertise est prouvée par des outils que d'autres développeurs utilisent et par des articles sur le "goût" et l'animation d'interface. Le site lui-même est volontairement nu.

## Structure de la page d'accueil (sections dans l'ordre)
1. Bandeau d'annonce fermable : "Enrollment for my new course aiforui.dev is open! 3 days left to join."
2. Nom "Emil Kowalski" et "Design Engineer".
3. "Today" : une phrase de situation ("Currently taking a break from work. In the past, I've worked at Linear and Vercel...").
4. "Projects" : aiforui.dev, Sonner, animations.dev, Vaul (nom + une ligne).
5. "Writing" : 7 articles (You Don't Need Animations, Agents with Taste, Building a Toast Component, Developing Taste, The Magic of Clip Path, 7 Practical Animation Tips, Building a Drawer Component), titre + une ligne.
6. "More" : liens Twitter et GitHub.

## Typographie (familles détectées dans le JSON + rôle observé : display, texte, mono ; échelle)
- Une famille nommée "Sans" (police Next.js `next/font`, 6 fichiers woff2 préchargés) : grotesque neutre type Inter.
- Rôle unique : texte. Pas de display, pas de mono sur l'accueil. Titres et texte quasi à la même taille (~16-17 px), hiérarchie par la couleur (noir pour les titres, gris pour les descriptions) et le poids.

## Palette et direction artistique
Fond blanc cassé (rgb 253,253,252), texte noir et gris moyen, aucun accent coloré. Direction "note de texte" : la retenue est le message, cohérente avec l'article "You Don't Need Animations".

## Composition, grille et rythme
Colonne unique étroite (~640 px) centrée-gauche. Grands blancs entre sections (~120 px), petits entre éléments (~25 px). Rythme régulier de liste.

## Comportement du défilement (natif, lissé, détourné, horizontal, épinglé ; ce que montrent les captures s0..s95)
Natif. Page courte (1854 px, scrollY final 907). Le bandeau d'annonce reste collé en haut (s95). Aucune animation de défilement observée.

## Transitions et micro-interactions (seulement ce qui est observable ; sinon le dire)
Aucune sur l'accueil d'après les captures. Les articles contiennent des démonstrations interactives (dans l'article lu : bouton qui se réduit à l'appui, composant de feedback qui se transforme, comparaison menu animé / non animé pilotable au clavier J et K), non manipulées ici.

## Technologies
**Confirmé**
- Next.js App Router (JSON : next = true ; chunks `app/layout`, `app/page`, `app/ui/.../page`).
- Vercel Web Analytics (`/_vercel/insights/script.js`).
- Polices via `next/font` (fichiers `/_next/static/media/*-s.p.woff2` préchargés ; l'un pèse 352 Ko, les cinq autres 24 à 70 Ko, en-têtes HTTP vérifiés).
- Aucun canvas, WebGL, GSAP ni Lenis (JSON).
- Les chunks `app/ui/agents-with-taste/page` et `app/ui/you-dont-need-animations/page` sont chargés depuis l'accueil (liste des scripts du JSON) : les pages d'articles et leurs démos sont préchargées.
**Hypothèse**
- Les démos d'articles utilisent probablement Motion (Framer Motion) vu le sujet, non vérifié dans le bundle.

## Mobile
Capture 390 px : même liste, colonne pleine largeur avec marges ~24 px, bandeau raccourci. Parfaitement lisible ; rien à adapter.

## Accessibilité et robustesse
- Focus visible : oui, contour fin net autour de "Emil Kowalski" après 3 Tab (outline auto 1 px).
- Lien d'évitement : absent (peu nécessaire vu la structure).
- Sans JS : contenu complet (996 caractères, 15 liens ; capture nojs identique sans le bandeau).
- Reduced-motion : capture identique (rien n'est animé).
- SEO : aucun h1 ni h2 sur l'accueil (JSON : h1 vide, 0 h2) ; meta description "Design engineer working at Linear." en décalage avec le texte affiché ("taking a break from work").

## Performance
Sans bridage, valeurs relatives :
- 5,05 Mo transférés pour une page de texte : JS 3,39 Mo (préchargement des pages d'articles), polices 1,08 Mo, CSS 153 Ko, "other" 432 Ko, 0 image ; 63 requêtes, 1 hôte. Identique en mobile.
- LCP 252 ms desktop, 264 ms mobile (les meilleurs du groupe) ; CLS 0.
Contraste frappant : premier affichage instantané, mais poids total énorme par rapport au contenu visible.

## Points forts UX
- Lecture en 10 secondes : qui, situation actuelle, projets, écrits.
- Les projets cités sont des outils réels et utilisés : la preuve est externe et vérifiable.
- Robuste : tout fonctionne sans JS, focus visible.
- Cohérence entre le discours (sobriété de l'animation) et le site.

## Points faibles ou risques
- Aucun h1, meta description périmée.
- 5 Mo dont 3,4 Mo de JS préchargé pour une page de liens : la sobriété n'est que visuelle.
- Ne fonctionne que si l'on a déjà une notoriété : sans Sonner ni Vaul, la même page paraîtrait vide.
- Bandeau commercial qui occupe le haut de page.

## Idées transférables au portfolio de Johan sans copier
1. Un bloc "Aujourd'hui" d'une phrase, daté, qui dit ce que Johan fait en ce moment (poste, sujet, disponibilité) : honnête et facile à tenir à jour.
2. Présenter des réalisations réutilisables (snippets, petits outils, packages, checklists perf/SEO) comme "projets", au même rang que les sites livrés.
3. Une page d'accueil sobre et ultra-rapide, mais réellement légère : désactiver le préchargement des articles et publier le poids total (ce que ce site ne fait pas).
4. Des démonstrations interactives dans les articles, chacune avec un intérêt pédagogique (comparaison avant/après manipulable).

## Niveau d'inspection
Consulté : JSON complet ; captures desktop, desktop-mid, mobile, nojs ; sonde : focus, s95, reduced. HTML de l'accueil par curl (liens, polices) ; tailles des fichiers de police par requêtes HEAD ; article "You Don't Need Animations" lu en partie. Pas de page About (il n'y en a pas de visible) ni de dépôt GitHub consulté.
