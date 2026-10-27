# Trois directions artistiques

Les trois directions partent du même constat de recherche (`research.md`) et du même contenu réel (6 projets, 2 témoignages, 69 articles, contact par e-mail). Chacune a un prototype visualisable dans `prototypes/` ; les trois ont été rendues et vérifiées en 1 440 px et 390 px, sans JavaScript, et (pour B) sans WebGL.

Ouvrir : `python3 -m http.server 8765` à la racine du dépôt, puis http://127.0.0.1:8765/docs/redesign/prototypes/

## Constat de départ

Ce que la recherche montre, et que les trois directions prennent en compte :

1. **Le portfolio de développeur moyen est lourd et fragile.** Médiane de 2,1 Mo transférés et 403 Ko de JavaScript sur 26 références ; 6 portfolios de développeurs sur 9 du groupe "développeurs reconnus" affichent un écran vide sans JavaScript, souvent alors que le texte est dans le HTML (servi en `opacity: 0`). Le site actuel de Johan pèse 105 Ko.
2. **Les gabarits se reconnaissent plus vite que les techniques.** Photo détourée et nom en défilement, colonne gauche épinglée sur fond ardoise, curseur magnétique : ces formes évoquent aujourd'hui un template. Ce qui reste singulier, c'est une idée unique poussée jusqu'au bout.
3. **La crédibilité vient d'une preuve vérifiable.** Bibliothèques utilisées par d'autres, articles qui expliquent comment le site est construit, chiffres publics. Johan a cette matière (69 articles, projets à fort trafic) mais le site actuel la noie dans des chiffres invérifiables (150+ clients, note 4,6 en JSON-LD).
4. **Le WebGL impressionne quand il est léger et qu'il sert le propos.** Le même type de scène peut coûter 69 Ko (Benoist, sans bibliothèque) ou plusieurs mégaoctets.

Le positionnement à exprimer : **un développeur frontend senior dont la spécialité est que ce qu'il livre est rapide, accessible et trouvable**, capable aussi de création interactive. Le site doit le prouver par sa propre construction.

## A - Marges

**Prototype** : `prototypes/a-editorial/`

| | |
|---|---|
| Concept | Le portfolio comme une revue technique imprimée. Une colonne de marge porte les annotations (le "pourquoi"), la colonne principale le texte. Les projets forment un index numéroté, comme une table des matières. |
| Perception recherchée | Sérieux, culture, précision. "Quelqu'un qui pense avant de coder." |
| Hero | Une phrase en grand corps serif ("Des interfaces *rapides*, lisibles et faites pour durer."), une note de marge, une fiche de 4 faits (rôle, depuis, stack, disponibilité), un lien e-mail. Aucune image : le LCP est du texte. |
| Typographie | Newsreader (serif à axe optique, de 300 à 700, italique pour l'accent) pour le texte et les titres ; IBM Plex Mono pour annotations, métadonnées et numéros. Échelle fluide de 5 pas avec `clamp()`. |
| Palette | Papier #F1EDE4, encre #161513 (15,6:1), rouge de correction #B8301C (5,2:1) réservé aux numéros, à l'italique d'accent et aux états. Aucun dégradé. |
| Interactions | Lignes de l'index qui s'inversent au survol, avec un aperçu du projet qui apparaît dans la marge ; transitions de page natives ; sélection de texte en rouge. Tout en CSS. |
| 3D | Aucune. |
| Navigation | Bandeau à filet : nom à gauche, 4 liens à droite ; ligne d'édition ("Édition d'octobre 2026") qui date le contenu. |
| Avantages | Lecture excellente ; robustesse totale (0 Ko de JS) ; prolonge naturellement les 69 articles ; vieillit bien ; maintenance quasi nulle. |
| Inconvénients | Ne **montre** pas le savoir-faire frontend, il le décrit. Le registre éditorial serif est très utilisé en 2025-2026 : risque de "beau mais déjà vu". Un studio créatif peut le juger sage. |
| SEO, a11y, perf, responsive | Optimal sur les quatre axes. Le prototype pèse 814 Ko à cause des polices Google complètes (environ 300 Ko) et des aperçus non redimensionnés : réductible sous 200 Ko. |
| Technologies et maintenance | Astro + CSS. Aucune dépendance d'interface. |

## B - Relief

**Prototype** : `prototypes/b-relief/`

| | |
|---|---|
| Concept | Une carte topographique vivante. Le hero est un champ de lignes de niveau calculé sur la carte graphique ; chaque projet y forme un relief, marqué par un vrai lien. Le motif vient du travail réel de Johan sur les interfaces cartographiques (dessin de zones dans Omega, recherche géographique sur SAFTI.fr). |
| Perception recherchée | Maîtrise technique, profondeur, curiosité. "Quelqu'un qui sait faire ce que les studios font, sans le poids." |
| Hero | Plein écran sombre ; titre en Archivo très large ; marqueurs de projets posés sur les reliefs ; coordonnées de Toulouse en légende. Le terrain s'efface sous le bloc de texte (calculé dans le shader) pour préserver la lecture. |
| Typographie | Archivo (axe de chasse 62 à 125 : très large pour l'affichage, normale pour le texte) ; Martian Mono pour la légende et les libellés de carte. |
| Palette | Nuit #0D0F11, os #E9E4D8 (15,1:1), gris #8C9095 (6,0:1), ambre #F2A33A (9,2:1), couleur traditionnelle des courbes de niveau, réservée aux reliefs actifs et à l'action principale. |
| Interactions | Le pointeur soulève le terrain ; survoler un marqueur colore son relief ; les compétences sont présentées comme une légende de carte (un style de trait par domaine). |
| 3D | Un shader de fragment WebGL2 écrit à la main (pas de Three.js) : 7,0 Ko bruts, 2,9 Ko compressés, chargé après le premier rendu. |
| Navigation | Libellés de carte en haut (nom, 4 liens) ; liste HTML complète des projets juste sous le hero. |
| Avantages | Impact immédiat ; démontre une vraie compétence graphique à un coût mesuré ; concept motivé par le parcours de Johan, pas décoratif ; matière pour un article technique ("une carte WebGL en 3 Ko"). |
| Inconvénients | Le registre "fond sombre + WebGL" est celui de 15 références sur 26 : la différence tient au propos et à la légèreté, pas au genre. Les marqueurs sont masqués sur mobile (trop serrés) : la carte y devient décorative. Coût GPU continu pendant que le hero est visible, à valider sur un Android d'entrée de gamme. Risque de lecture "créatif" plutôt que "senior produit". |
| SEO, a11y, perf, responsive | Bon si la discipline est tenue : tout est en HTML, le canvas est `aria-hidden`, repli CSS testé sans WebGL. Prototype à 241 Ko. Contraste du texte sur les lignes : traité par le masque du shader, à vérifier sur chaque taille d'écran. |
| Technologies et maintenance | Astro + un module GLSL. Faible en dépendances, mais le GLSL doit être documenté pour rester modifiable. |

## C - Banc d'essai

**Prototype** : `prototypes/c-atelier/`

| | |
|---|---|
| Concept | Le portfolio comme un banc d'essai : chaque affirmation est accompagnée d'une mesure ou d'une démonstration. La page affiche ses propres mesures, prises en direct dans le navigateur du visiteur ; les projets sont des "essais" ; les compétences sont des spécimens qu'on peut manipuler. |
| Perception recherchée | Rigueur vérifiable, transparence, sens du produit. "Il ne dit pas qu'il est rapide, il le montre." |
| Hero | À gauche, la déclaration ("Développeur frontend. Je mesure avant d'affirmer.") et deux actions ; à droite, une fiche de mesure en direct (poids transféré, requêtes, JS, LCP, CLS, interaction la plus lente, nœuds DOM) avec l'explication de la méthode. Une pastille d'en-tête rappelle le poids de la page sur toutes les pages. |
| Typographie | PolySans Neutral (la police actuelle du site, conservée pour la continuité) et la police à chasse fixe du système : un seul fichier de police au total. |
| Palette | Banc #E7E7E1, planche #FAFAF7, encre #111 (15,2:1), gris #55554F (6,0:1), jaune d'étiquette #FFD43B (13,3:1 avec l'encre), utilisé comme du ruban adhésif de laboratoire pour numéroter et signaler ("à sourcer"). |
| Interactions | Spécimen de dessin de zone (reconstitution simplifiée d'Omega, au pointeur et au clavier) ; spécimen WebGL chargé seulement sur clic, avec son temps de compilation affiché ; planches à repères de coupe plutôt que cartes arrondies. |
| 3D | Optionnelle et à la demande : le même shader que B, présenté comme un spécimen, jamais chargé sans action du visiteur. |
| Navigation | En-tête simple + pastille de mesure ; planches numérotées (Pl. 00 à Pl. 05) qui servent de repères. |
| Avantages | Idée la plus alignée sur la spécialité de Johan. Une seule référence sur 26 affiche des mesures en direct (carterogunsola.com : FPS et LCP dans une micro-barre de télémétrie, comme signal d'ambiance) ; ici la mesure devient le principe d'organisation du site, expliquée et complète. Aligne le design sur la vraie spécialité (performance, SEO, rigueur). Chaque étude de cas peut embarquer son spécimen. Les statuts "vérifié / à sourcer" deviennent un élément de design honnête. |
| Inconvénients | Densité : plus de choses à lire que A. Rend publique toute régression de performance, ce qui oblige à tenir le budget. Le registre "laboratoire" peut paraître froid si les planches se multiplient. Les spécimens demandent du temps de conception par projet. |
| SEO, a11y, perf, responsive | Très bon : contenu en HTML, spécimens avec repli statique, mesures en `aria-live`. Prototype à 548 Ko, dont environ 505 Ko de captures non redimensionnées : le code de la direction pèse 3,6 Ko. |
| Technologies et maintenance | Astro + 2 petits modules (mesures, spécimens) + le shader optionnel. Les spécimens sont des îlots isolés : on peut en ajouter ou en retirer sans toucher au reste. |

## Notation

Notes de 1 à 5, argumentées. Elles portent sur la direction mise en œuvre correctement, pas sur l'état du prototype.

| Critère | A - Marges | B - Relief | C - Banc d'essai |
|---|---|---|---|
| Différenciation | 3 : registre éditorial serif répandu ; l'index et les marges lui donnent du caractère | 4 : genre WebGL sombre courant, mais motif justifié par le parcours et poids sans équivalent | 4 : la télémétrie en direct existe déjà (1 référence sur 26, en micro-barre) ; en faire le principe du site, avec spécimens et statuts de vérification, reste rare |
| UX | **5** : lecture, hiérarchie, accès immédiat au contact | 3 : hero spectaculaire mais informations au survol, carte réduite sur mobile | 4 : tout est accessible, mais plus dense |
| Crédibilité professionnelle | 4 : très crédible pour un client ou un recruteur produit, moins pour un studio créatif | 4 : impressionne un studio, risque de brouiller le profil "senior produit" | **5** : parle à la fois au recruteur technique (mesures, rigueur) et au studio (spécimens, shader) |
| Performance | **5** : 0 Ko de JS | 4 : 3 Ko de code, mais calcul GPU continu dans le hero | **5** : moins de 4 Ko de code, effets lourds sur demande uniquement |
| Potentiel SEO | **5** | 4 : demande de la discipline pour garder le HTML et la carte équivalents | **5** : contenu riche, études de cas longues, maillage naturel vers les articles |
| **Total** | 22 | 19 | **23** |

## Ce qu'il faut retenir de chaque direction, quelle que soit la décision

- De A : la colonne de marge pour expliquer les décisions, l'index des projets en table, l'absence d'image dans le hero.
- De B : le shader de lignes de niveau comme démonstration technique légère, et l'idée de relier l'identité visuelle au travail réel (cartographie).
- De C : les mesures en direct, les statuts "vérifié / à sourcer", les spécimens dans les études de cas, le chargement à la demande des effets lourds.

La recommandation finale est dans le compte rendu de la mission et en conclusion de `research.md`.
