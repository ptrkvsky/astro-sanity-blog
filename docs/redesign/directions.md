# Trois directions artistiques

> **Mission 2.3 (28/10/2026)** : Johan a retenu **Épreuve**, avec l'association typographique Instrument Serif + PolySans + IBM Plex Mono. Trois concepts d'expérience signature, deux prototypes (E - Calage, F - Vue éclatée) et la recommandation sont dans `experience-signature.md`.
>
> **Mission 2.2 (27/10/2026)** : la direction C, avec l'identité éditoriale de A, est détaillée en fin de document ("Mission 2.2"), avec une alternative plus audacieuse et le prototype `prototypes/d-revue/`. Les sections A, B et C ci-dessous sont conservées telles qu'en phase 2.

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

---

# Mission 2.2 - Direction principale et alternative

Johan privilégie C, avec l'identité éditoriale de A. Cette partie la concrétise en une direction principale, **Revue d'essais**, et une alternative plus audacieuse, **Épreuve**. Les deux sont prototypées dans `prototypes/d-revue/` (la seconde via `?direction=epreuve`). Rien n'est implémenté dans `src/`.

## 1. Ce qui est acquis et ce qui ne l'est pas (relecture de la 2.1)

Relecture des README, des scripts de mesure et des décisions D1 à D8, et nouvelle exécution des mécanismes dans le prototype D. "Mesuré" signifie : chiffre obtenu par instrumentation, dans les conditions indiquées. Toutes les mesures de la 2.1 ont été prises dans Chrome 156 headless, sur un poste de bureau, avec le WebGL rendu en logiciel (SwiftShader).

| Décision | Mesuré | Hypothèse ou déduction | Incomplet |
|---|---|---|---|
| D1 Transitions natives | 440 ms pour 420 ms réglées, retour compris, mobile compris (2.1). **Revérifié en 2.2** sur le prototype D : 436 ms à l'aller, 434 ms au retour, aucune transition en mouvement réduit | - | Prérendu par règles de spéculation jamais activé en navigation pilotée. Firefox et Safari non testés. État intermédiaire non capturé (la capture CDP arrive après la fin) |
| D2 Défilement en CSS | 7 ms de script contre 28 ms pour GSAP (45 crans, CPU x4, médiane de 3) ; mêmes valeurs à ±0,01 | Gain "animation sur le compositeur" quand le fil principal est occupé : documenté par Chrome, **non mesuré** | Support Firefox à revérifier au moment de l'implémentation |
| D3 Inclinaison selon la vitesse | 191 puis 65 ms de recalcul de style | - | **Sortie de la proposition principale** (consigne 2.2) |
| D4 Révélation tramée 2D | 0,38 ms par image d'animation, 25 ms de préparation. **Revérifié en 2.2** : 2 images révélées au défilement progressif, puis 0 canvas et 0 image masquée | Les "50 à 100 ms de cadre vide" au départ sont une observation sur rafale de captures, pas une mesure. Le chiffre de 2,6 Ko gzip est une estimation de la part 2D : le fichier complet (2D + WebGL) fait 3,7 Ko gzip | Couleurs encre et papier codées en dur dans `reveal.js` (palette de C), à paramétrer. Redimensionnement pendant l'effet non géré |
| D5 Spécimen en worker | Page à 60 images/s et interaction max 24 ms dans le worker, contre 22-29 images/s et 80-104 ms sur le fil principal. **Revérifié en 2.2** : chargement au clic, rendu en worker, replis `nogl` et `lost` corrects | Les valeurs absolues sont faussées par le rendu logiciel ; seul l'écart entre les deux fils est fiable. La compilation varie de 5-8 ms (2.1) à 23,5 ms (2.2, 4 navigateurs en parallèle) | Plafond de DPR sur écran tactile jamais exercé. Aucune mesure GPU réelle. Aucun appareil Android |
| D6 Pas de canvas global | - | Rôle de Lenis dans la synchronisation du canvas chez 14islands : déduit du README du scroll-rig, pas observé | - |
| D7 Typographie | Brouillage illisible plus de 2,6 s (Heckel, headless). **Nouveau en 2.2** : axe de chasse animé au défilement dans l'alternative, CLS de 0,000 au défilement sur 6 chargements | - | Coût de mise en page par image de `font-stretch` non mesuré |
| D8 Accessibilité | Règles appliquées et vérifiées sur 5 prototypes (4 + D) | - | Aucun test avec un lecteur d'écran |

Les mesures qui ne bloquent pas la recherche artistique, mais dont chaque effet garde un repli : Firefox (animations et transitions), Safari, Android d'entrée de gamme et lecteur d'écran.

## 2. Direction principale : Revue d'essais

### Concept et positionnement

Le portfolio comme **une revue technique imprimée dont chaque affirmation est accompagnée de sa preuve**. Il prend à A le registre de la revue : titre en serif, numéros de section, marge annotée et index en table des matières. Il prend à C la preuve : mesures en direct, spécimens à manipuler et statuts "à sourcer".

Pourquoi ce choix sert un frontend senior :

- **Il montre au lieu de décrire.** Le reproche fait à A ("il décrit le savoir-faire") est levé par la fiche de mesure et le spécimen. Le reproche fait à C ("froid, dense") est levé par la composition éditoriale.
- **Il parle aux deux publics.** Un recruteur produit y lit de la rigueur (structure, sources, accessibilité) ; un studio y voit une maîtrise graphique (typographie, spécimen WebGL, transitions).
- **Il est cohérent avec sa propre construction.** 0 Ko de JS nécessaire, environ 103 Ko compressés pour l'accueil (§ 5) : le site applique ce qu'il affirme.
- **Il vieillit bien.** Le registre "revue" ne dépend d'aucun effet à la mode : on peut retirer chaque effet sans casser l'identité.

### Typographie

Le prototype utilise l'association 1 : **Newsreader** pour les titres et le texte, **IBM Plex Mono** pour les métadonnées, les numéros et les mesures. Les cinq associations sont comparées dans `prototypes/d-revue/fontes.html`, avec le poids réel des fichiers WOFF2 (sous-ensemble latin).

| Association | Fichiers | Poids | Lecture |
|---|---|---|---|
| 1. Newsreader + Plex Mono | 2 | 71 Ko | Serif de revue, très lisible en texte comme en titre. Le choix le plus sûr. Pas d'italique dans le budget (+63 Ko) : l'accent passe par la couleur |
| 2. Fraunces + Plex Mono | 2 | 50 Ko | Plus chaleureuse, presque "artisanale" en grand corps. La plus légère, mais moins neutre pour un discours technique |
| 3. Instrument Serif + PolySans + Plex Mono | 4 | 87 Ko | La plus expressive : serif condensée pour les titres, avec un vrai italique, et PolySans conservée pour le texte. Très utilisée en 2025-2026 ; dépasse la règle des 2 fichiers |
| 4. PolySans + JetBrains Mono (référence C) | 2 | 70 Ko | Continuité avec le site actuel, mais aucune voix éditoriale |
| 5. Bricolage Grotesque (wdth) + Plex Mono | 2 | 91 Ko | Réservée à l'alternative : axes de graisse et de chasse. Juste au-dessus du budget de 90 Ko |

Fontes payantes à considérer seulement si un budget de licence existe : Signifier ou GT Sectra (serif de titre plus singulière), Söhne Mono. Elles n'ont pas été intégrées : leur licence web n'est pas acquise.

Hiérarchie (échelle fluide `clamp()`) : titre du hero de 42 à 106 px ; titres de section de 37 à 74 px ; titres d'essai de 28 à 46 px ; texte de 17 à 19 px ; mono de 12,5 à 13,5 px en capitales espacées pour les libellés.

### Palette et contrastes

| Jeton | Valeur | Usage | Contraste |
|---|---|---|---|
| `--paper` | #F3F0E8 | fond | - |
| `--plate` | #FBFAF6 | planches, cadres d'image | - |
| `--ink` | #16150F | texte, filets forts | 16,1:1 sur papier |
| `--muted` | #5B5850 | texte secondaire, mono | 6,2:1 sur papier, 6,8:1 sur planche |
| `--red` | #B42318 | rouge de correction : numéros, accent du titre, survol | 5,8:1 sur papier |
| `--tape` | #FFD43B | ruban jaune : uniquement statuts et halo de focus | 12,8:1 avec l'encre |
| `--hair` | #CFC9BC | filets fins | 1,45:1, décoratif uniquement |

Aucun dégradé. Le rouge n'est jamais la seule marque d'un état : il double toujours un soulignement, une inversion ou un texte.

### Grille et composition

- 12 colonnes, largeur maximale de 92 rem, gouttière de 16 à 40 px.
- Colonne principale sur 8 colonnes ; **marge** sur les colonnes 10 à 12, qui porte les notes numérotées, la fiche de mesure et l'aperçu des projets.
- Chaque section s'ouvre par un en-tête de revue : numéro rouge (`01`), titre et note de marge, puis un filet d'encre.
- Les visuels sont posés en **planches** : cadre fin, repères de coupe aux coins, légende en mono ("Fig. 01 · safti.fr, oct. 2026").

### Hero

- Pas d'image : le LCP est le titre (mesuré entre 80 et 370 ms en local selon les passages).
- À 1 440 px, le titre occupe 9 colonnes sur 4 lignes (corps de 97 px), puis viennent le chapô et les deux actions sur 7 colonnes. La fiche de mesure est alignée en bas sur les colonnes 10 à 12. À 1 440 x 900, les actions se terminent à 894 px, barre du prototype comprise : le hero tient dans le premier écran. Une première version (corps de 118 px) les coupait ; elle a été resserrée pendant la vérification.
- Au-dessus, une ligne de rubrique en mono : rôle et technologies.

### Navigation

- Bandeau : nom et rôle à gauche ; 4 liens numérotés à droite (01 Essais, 02 Expertise, 03 À propos, 04 Contact).
- Ligne d'édition en dessous : "Édition d'octobre 2026 · Toulouse" à gauche, poids de la page mesuré à droite.
- Mobile : `<details>` avec un bouton "Menu" et une liste en surimpression. 0 Ko de JS.
- Lien d'évitement "Aller au contenu" ; `aria-current` sur la rubrique de la page.

### Projets et images

- **Index en table des matières** : numéro, titre en serif, rôle, période, technologies. Au survol ou au focus, la ligne s'inverse (encre et papier) et la marge montre l'aperçu du projet. Le tout est piloté par `:has()`, sans JS. L'aperçu de SAFTI.fr est montré par défaut.
- **Essai à la une** : une planche large avec la fiche problème, décisions et résultat, et un lien vers l'étude de cas.
- **Étude de cas** : chapô, fiche (période, rôle, stack, lien), image d'ouverture, puis texte sur 7 colonnes avec notes en marge. Les figures sont posées en planches de largeurs variées : téléphone sur 4 colonnes, paysage sur 8.
- Toutes les images sont en AVIF et WebP, à dimensions déclarées. Celles sous la ligne de flottaison sont en `loading="lazy"`.

### Rôle de la révélation tramée

Signature **rare et explicite** : elle ne s'applique qu'aux figures des études de cas qui entrent par le défilement. Elle ne touche ni l'accueil, ni l'index, ni une image visible au chargement. Le tramage évoque l'épreuve d'imprimerie, ce qui prolonge le registre de la revue. Une page en compte 2 ou 3 au plus : au-delà, c'est un effet de style ; en dessous, c'est un repère.

### Spécimen WebGL

- Planche "Spécimen 01" dans la section Expertise, et dans les études de cas qui en ont un.
- Avant le clic : l'image fixe produite par le shader (AVIF 25 Ko). Le bouton annonce son coût ("Charger le spécimen", 2,9 Ko compressés).
- Après le clic : rendu dans le worker. La fiche indique le fil de rendu et le temps de compilation mesuré, et l'état est annoncé dans `aria-live`. Le bouton devient "Arrêter" puis "Relancer".
- Repli : image fixe et message si WebGL2 manque ou si le contexte est perdu. Une seule image, sans boucle, en mouvement réduit.

### Interactions, transitions et états

| Élément | Repos | Survol | Focus clavier | Actif ou chargement | Repli |
|---|---|---|---|---|---|
| Lien de navigation | mono capitales | soulignement rouge 2 px | filet 3 px + halo jaune | `aria-current` souligné | - |
| Ligne d'index | texte sur papier | inversion encre et papier, aperçu en marge | inversion + halo jaune intérieur | - | sans `:has()` : pas d'aperçu, ligne inversée quand même |
| Bouton principal | encre pleine | rouge | filet + halo | `disabled` à 55 % pendant le chargement | - |
| Spécimen | image fixe | - | bouton | "Chargement du spécimen…", puis "Arrêter" | image fixe et message |
| Fiche de mesure | "n/d" | - | - | valeurs réelles, "en cache" si la page vient du cache | "n/d" sans JS ou sans API |

Mouvement, uniquement sous `prefers-reduced-motion: no-preference` et `@supports` :

- Transition entre l'index et l'étude de cas : le titre et l'image d'ouverture se déplacent (420 ms, `cubic-bezier(.2,.7,.2,1)`).
- Planches qui montent de 2,5 rem à leur entrée ; numéro de section qui passe du gris au rouge ; barre de lecture rouge sur l'étude de cas.
- Aucun texte masqué en attente d'un script, aucune inclinaison selon la vitesse.

### Comportement responsive

| Largeur | Changements |
|---|---|
| > 64 rem | Grille complète, marge active, aperçu de l'index |
| 48 à 64 rem | La marge passe sous le texte ; l'index occupe toute la largeur, sans aperçu ; les compétences et les technologies sont empilées |
| < 48 rem | Menu `<details>` ; hero empilé (titre, chapô, actions, fiche) ; index sur deux lignes (titre et année, puis rôle et technologies) ; capture mobile de l'essai à la une plafonnée à 70 % de la hauteur d'écran |

### Principes d'accessibilité

Ceux de D8, plus : ordre du DOM identique à l'ordre visuel ; cibles d'au moins 44 px (boutons de 46 px) ; titres hiérarchisés (h1 unique, h2 par section) ; numéros décoratifs en `aria-hidden` ; aperçus d'index en `aria-hidden` (l'information est dans la ligne) ; `font-synthesis: none` pour ne jamais simuler un gras ou un italique illisible.

## 3. Alternative : Épreuve

### Concept

La même revue, mais **mise en affiche** : fond encre, titres géants en grotesque étroite et en capitales, et un rouge-orangé de signalisation. Le hero devient un manifeste typographique, et le spécimen WebGL y est proposé dès le premier écran (toujours au clic).

| Sujet | Épreuve |
|---|---|
| Typographie | Bricolage Grotesque (axes graisse et chasse) en capitales à 75 % de chasse pour les titres, dans le même fichier pour le texte ; Plex Mono |
| Palette | encre #121210, papier #F1EEE6 (16,2:1), gris #A6A296 (7,4:1), rouge-orangé #FF5A36 (6,0:1 sur l'encre) ; le jaune reste réservé aux statuts |
| Hero | titre sur 12 colonnes, de 50 à 216 px ; fiche de mesure et vignette du relief côte à côte sous le titre |
| Projets | titres d'index en capitales de 32 à 67 px, dont la chasse passe de 75 % à 90 % pendant l'entrée dans l'écran (D7) ; survol en aplat rouge-orangé |
| Révélation tramée | même règle que la direction principale ; sur fond sombre, l'image se forme en points clairs |
| Spécimen | dans le hero et dans Expertise, chargé au clic |

### Ce qu'elle apporte et ce qu'elle coûte

- **Plus mémorable** : l'accueil se reconnaît en une seconde, et l'axe de chasse animé est une démonstration typographique qu'on voit rarement.
- **Les actions passent sous la ligne de flottaison** : à 1 440 x 900, le bas des boutons est à 1 360 px. Le titre-affiche prend tout le premier écran ; seul le lien du bandeau reste visible pour écrire.
- **Moins dense et moins "revue"** : les capitales étroites se lisent moins bien en titres longs ("Expertise, et où la vérifier"), et le fond sombre est le registre de 15 références sur 26.
- **Coûts techniques** : la fonte pèse 76 Ko à elle seule (budget de police à 91 Ko, juste au-dessus des 90 Ko) ; `font-stretch` provoque une mise en page à chaque image, ce qui limite l'effet à quelques titres courts, sans retour à la ligne, et au desktop ; sans précharge de la fonte, un CLS de 0,077 a été observé au chargement une fois sur trois (0,000 sur 6 chargements avec la précharge).

## 4. Comparaison

| Critère | Revue d'essais | Épreuve |
|---|---|---|
| Lecture des contenus longs | excellente (serif de texte) | correcte (grotesque en texte) |
| Impact du premier écran | sobre, éditorial | fort, affiche |
| Crédibilité "senior produit" | très bonne | bonne, plus "créatif" |
| Crédibilité "studio" | bonne, grâce au spécimen | très bonne |
| Budget de police | 71 Ko, 2 fichiers | 91 Ko, 2 fichiers |
| Effets propres | aucun hors D1, D2, D4, D5 | axe de chasse au défilement |
| Risque de "déjà vu" | serif éditoriale répandue, compensée par la preuve | fond sombre et capitales géantes, répandus |

Recommandation : **Revue d'essais** comme base. L'alternative sert surtout à juger jusqu'où pousser l'expression : on peut en reprendre un seul élément (par exemple le titre du hero en capitales étroites) sans changer de direction.

## 5. Vérification visuelle du prototype D

Chrome 156 headless (Playwright 1.61, captures CDP) ; Firefox 158 headless (captures du premier écran seulement). Toutes les captures ont été regardées.

| Vérifié | Résultat |
|---|---|
| Accueil, direction principale : 1 440, 1 024, 768, 390, 360 px | Rendu regardé ; aucun débordement horizontal (contrôle `scrollWidth` + liste des éléments qui dépassent) |
| Accueil, alternative : 1 440 et 390 px | Rendu regardé, aucun débordement. Corrigé pendant la vérification : accent du "É" qui touchait la ligne précédente (interlignage de 0,86 à 0,96) et texte des statuts invisible (encre claire sur jaune) |
| Étude de cas : 1 440 et 390 px | Rendu regardé. Corrigé : capture mobile en demi-largeur (1 470 px de haut) et figure voisine étirée à vide |
| Focus clavier | Halo visible sur la barre et le bandeau ; ligne d'index inversée avec halo intérieur, et aperçu de la marge qui suit le focus |
| Menu mobile | `<details>` ouvert, liste lisible en surimpression |
| Spécimen | Chargé au clic, rendu en worker, compilation affichée ; replis `?simulate=nogl` et `?simulate=lost` : image fixe et message |
| Révélation tramée | Jouée au défilement progressif, puis 0 canvas et 0 image masquée. Non jouée quand l'image est déjà visible (saut d'ancre), comme prévu |
| Transition de page | Active à l'aller et au retour (436 et 434 ms), absente en mouvement réduit |
| Sans JavaScript | Accueil et étude de cas complets ; la fiche affiche "n/d" |
| Mouvement réduit | Pages complètes, aucun état intermédiaire |
| CLS | 0,000 au chargement et au défilement, sur 6 chargements par direction (Chrome, 1 440 px) |
| Poids de l'accueil | 175 Ko transférés depuis le serveur local, qui ne compresse pas. Estimation compressée : HTML 5,1 + CSS 6,6 + JS 3,5 + polices 71,1 + aperçu 17 = **environ 103 Ko** (budget : 200 Ko) |
| Firefox 158, 1 440 et 390 px | Premier écran correct ; LCP en "n/d" (repli prévu). Corrigé : la fiche affichait "0 Ko" pour une page servie depuis le cache |

| Non vu ou non vérifié | Pourquoi |
|---|---|
| État intermédiaire de la transition de page | La capture CDP arrive après la fin de la transition |
| Animations au défilement et transitions dans Firefox | Seules des captures statiques ont été possibles (pas de Playwright Firefox installé) |
| Safari, iOS, Android | Aucun appareil ni navigateur disponible |
| Lecteur d'écran | Non testé |
| Rendu sur écran à haute densité (DPR 2) | Captures en DPR 1 |

## 6. Arbitrages demandés à Johan

1. **Direction** : Revue d'essais (recommandée), Épreuve, ou Revue avec un élément d'Épreuve.
2. **Police** : Newsreader (recommandée, 71 Ko), Fraunces (50 Ko), ou Instrument Serif + PolySans (87 Ko, 4 fichiers, ce qui oblige à assouplir la règle des 2 fichiers). Faut-il prévoir un budget de licence pour une serif payante ?
3. **Fiche de mesure** : dans la marge du hero (prototype) ou seulement en pastille dans le bandeau. Elle rend toute régression publique : c'est voulu, mais c'est un engagement.
4. **Révélation tramée** : la garder comme signature des études de cas, avec 2 ou 3 figures par page au plus, ou y renoncer.
5. **Mode sombre** : les jetons le permettent ; le faire dès la première version ou plus tard.
6. **Firefox** : accepter une version statique (sans transitions ni animations au défilement) si le support manque encore à l'implémentation. C'est recommandé.
7. **Appareil Android de référence** et service de mesure (WebPageTest ou appareil physique), avant de figer le budget GPU du spécimen.
8. **Contenus à fournir** : disponibilité, LinkedIn, GitHub, visuel d'Omega, textes des études de cas, justificatif de la note Trustpilot, mesures avant/après de SAFTI.fr.
