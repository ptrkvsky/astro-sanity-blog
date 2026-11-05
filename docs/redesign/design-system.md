# Système de design - Revue d'essais

**Statut : proposition (mission 2.2, 27/10/2026), non validée.** Ce document décrit le système de la direction principale tel qu'il est mis en œuvre dans `prototypes/d-revue/style.css`. Les valeurs de l'alternative "Épreuve" sont données en dernière section. Il deviendra la référence de l'implémentation une fois la direction et la police arbitrées (`directions.md`, § 6 de la partie 2.2).

## 1. Principes

1. **Le contenu d'abord.** Tout se lit, se navigue et se contacte sans JavaScript. Un effet ne cache jamais un contenu en attendant un script.
2. **Une affirmation, une preuve.** Chaque chiffre est mesuré, sourcé ou marqué ("à sourcer", "à fournir", "démo").
3. **La revue avant l'effet.** L'identité tient à la typographie, à la grille et aux numéros. Chaque effet peut être retiré sans casser l'identité.
4. **Chaque effet a un repli** : mouvement réduit, absence de support, absence de WebGL, absence de JS.

## 2. Jetons

### 2.1 Couleurs

| Jeton | Valeur | Rôle | Contraste |
|---|---|---|---|
| `--paper` | #F3F0E8 | fond de page | - |
| `--plate` | #FBFAF6 | planches, cadres d'image, menu ouvert | - |
| `--ink` | #16150F | texte, filets forts, aplats | 16,1:1 sur `--paper` |
| `--muted` | #5B5850 | texte secondaire, métadonnées | 6,2:1 sur `--paper`, 6,8:1 sur `--plate` |
| `--red` | #B42318 | numéros, accent du titre, survol, barre de lecture | 5,8:1 sur `--paper` |
| `--tape` | #FFD43B | étiquettes de statut, halo de focus | 12,8:1 avec `--ink` |
| `--hair` | #CFC9BC | filets fins (décoratifs) | 1,45:1, jamais porteur d'information |

Règles :

- Le rouge ne porte jamais seul un état : il double un soulignement, une inversion ou un texte.
- Le jaune est réservé aux statuts et au focus. Il n'est jamais décoratif.
- Une ligne inversée (survol de l'index) utilise #CFCBC1 pour le texte secondaire (11,3:1 sur l'encre).
- Mode sombre : à prévoir en redéfinissant les mêmes jetons (voir l'alternative pour une base testée).

### 2.2 Typographie

| Jeton | Valeur proposée | Rôle |
|---|---|---|
| `--f-display` | Newsreader (variable, graisse 200 à 800), graisse 380 | titres |
| `--f-text` | Newsreader | texte courant |
| `--f-mono` | IBM Plex Mono 400 | métadonnées, numéros, mesures, libellés, boutons |
| `--w-display` | 380 | graisse des titres |

Budget : 2 fichiers WOFF2, sous-ensemble latin, 71 Ko au total. Pas d'italique (+63 Ko) : l'accent passe par la couleur. `font-synthesis: none` empêche le navigateur de simuler un gras ou un italique. La fonte de titre est préchargée.

Échelle fluide :

| Jeton | `clamp()` | 360 px | 1 440 px | Usage |
|---|---|---|---|---|
| `--step--1` | .78rem, .76rem + .1vw, .84rem | 12,5 px | 13,5 px | mono, légendes, libellés |
| `--step-0` | 1.06rem, 1rem + .25vw, 1.2rem | 17 px | 19 px | texte courant |
| `--step-1` | 1.3rem, 1.15rem + .6vw, 1.7rem | 21 px | 27 px | chapô, citations, compétences |
| `--step-2` | 1.75rem, 1.35rem + 1.6vw, 2.9rem | 28 px | 45 px | titres d'essai, titres de l'étude de cas |
| `--step-3` | 2.3rem, 1.5rem + 3.2vw, 4.6rem | 37 px | 70 px | titres de section, titre de l'étude de cas |
| `--step-hero` | 2.6rem, 1rem + 5.6vw, 6.6rem | 42 px | 97 px | titre du hero |

Interlignage : 1,55 pour le texte, 0,97 à 1,05 pour les titres. Approche de -0,015 à -0,028 em sur les titres. Libellés mono en capitales, approche de +0,06 em.

### 2.3 Espacements et grille

| Jeton | Valeur |
|---|---|
| `--space-1` à `--space-3` | .5rem, 1rem, 1.5rem |
| `--space-4` | clamp(2rem, 1.5rem + 2vw, 3rem) |
| `--space-5` | clamp(3rem, 2rem + 4vw, 6rem) |
| `--space-6` | clamp(4.5rem, 3rem + 6vw, 9rem) (entre les sections) |
| `--gutter` | clamp(1rem, .4rem + 2.4vw, 2.5rem) |
| `--measure` | 62ch (largeur maximale d'un paragraphe) |

Grille : 12 colonnes `minmax(0, 1fr)`, largeur maximale de 92 rem. Colonne principale : 1 à 8. Marge : 10 à 12. Pas de coins arrondis. Les filets font 1 px (`--hair` ou `--ink`), 2 px pour ouvrir un bloc (fiche de mesure, contact).

## 3. Composants

| Composant | Structure | Notes |
|---|---|---|
| Bandeau | `header.masthead` : marque (nom + rôle), `nav` de 4 liens numérotés, `details.menu` sous 48 rem, ligne d'édition | `aria-current` sur la rubrique ; menu mobile sans JS |
| En-tête de section | `header.sec-head` : numéro (`aria-hidden`), `h2`, note de marge | le numéro passe du gris au rouge en entrant (CSS) |
| Note de marge | `p.note` : numéro rouge en gras, texte mono | sous 64 rem, passe sous le paragraphe |
| Étiquette de statut | `span.status` : "à sourcer", "à fournir", "démo", "à valider" | jaune, capitales mono ; variante `.ok` en contour |
| Planche / figure | `figure.shot` > `div.frame` > `picture` + `figcaption` | légende "Fig. n · source, date" ; repères de coupe sur `.plate` |
| Index des essais | `ol.index` > `li` > `a` (numéro, titre, rôle, période, stack) + `div.preview` | aperçu en marge par `:has()`, `aria-hidden` |
| Fiche d'essai | `dl.spec` (Problème, Décisions, Résultat) | libellés mono en capitales |
| Fiche de mesure | `div.readout` > `h2` + `dl` d'`output` | valeurs remplacées en place (`tabular-nums`, pas de décalage) |
| Spécimen | `[data-specimen]` : `.stage` (image fixe), bouton, `[role=status]`, fiche (code, rendu, compilation) | rien n'est téléchargé avant le clic |
| Compétence | `dl.skills` : domaine, pratique, lien "Preuve ·" | chaque compétence pointe vers un texte ou un projet |
| Bouton | `.btn`, `.btn.primary` | mono capitales, hauteur de 46 px minimum |
| Contact | adresse en grand corps serif, `@` en rouge | `overflow-wrap: anywhere` pour les petits écrans |

## 4. États

| État | Traitement |
|---|---|
| Survol d'un lien | soulignement rouge |
| Survol d'une ligne d'index | inversion encre et papier, numéro en jaune |
| Focus clavier (tous les éléments) | filet de 3 px à l'encre, décalé de 3 px, et halo jaune de 6 px ; ligne d'index : halo intérieur |
| Rubrique courante | `aria-current` et soulignement rouge de 2 px |
| Chargement (spécimen) | bouton `disabled` (opacité 55 %), message "Chargement du spécimen…" dans `aria-live` |
| Erreur ou repli (spécimen) | image fixe conservée, message explicite, bouton désactivé |
| Donnée absente (mesure) | "n/d" ; "en cache" quand la page vient du cache ; "aucune" pour une interaction pas encore mesurée |
| Contenu manquant | étiquette de statut visible, jamais de contenu inventé |
| Sélection de texte | rouge, texte papier |

## 5. Mouvement

Toutes les règles sont sous `@media (prefers-reduced-motion: no-preference)`, et celles qui dépendent du défilement aussi sous `@supports (animation-timeline: view())`. Sans support, l'état final est l'état statique.

| Effet | Technique | Durée ou plage | Repli |
|---|---|---|---|
| Transition de page (titre et image d'ouverture) | `@view-transition { navigation: auto }` + `view-transition-name` par slug | 420 ms, `cubic-bezier(.2,.7,.2,1)` ; racine 200 ms | navigation classique |
| Entrée d'une planche | `animation-timeline: view()`, `translate` de 2,5 rem à 0 | `entry 0%` à `entry 70%` | planche à sa place |
| Numéro de section | couleur `--hair` vers `--red` | `entry 20%` à `cover 35%` | numéro rouge |
| Barre de lecture (étude de cas) | `scroll(root)`, `scale` de 0 à 1 | toute la page | barre masquée |
| Révélation tramée | Canvas 2D (`reveal.js`) | 1,3 s, préparation 25 % d'écran avant l'entrée | image normale |
| Survols | `transition` de couleur | 160 ms | - |

Propriétés animées : `translate`, `scale`, `opacity` et couleurs. Jamais de mise en page animée dans la direction principale. Pas d'inclinaison selon la vitesse, pas de défilement lissé, pas de curseur personnalisé.

## 6. Responsive

| Point de rupture | Règles |
|---|---|
| > 64 rem | grille complète, marge, aperçu de l'index |
| ≤ 64 rem | marge et notes sous le texte ; index pleine largeur sans aperçu ; fiche d'essai sous l'image ; technologies en 3 colonnes |
| ≤ 48 rem | menu `<details>` ; hero empilé ; index sur deux lignes ; tout sur une colonne ; gouttière de 12 px ; capture mobile plafonnée à 70svh ; adresse e-mail de 27 à 48 px |

Vérifié sans débordement horizontal à 1 440, 1 024, 768, 390 et 360 px.

## 7. Accessibilité

- Lien d'évitement, `lang="fr"`, un seul `h1`, un `h2` par section.
- Ordre du DOM identique à l'ordre visuel (les colonnes de la grille ne réordonnent pas le contenu).
- Cibles d'au moins 44 px ; boutons de 46 px.
- Numéros décoratifs, aperçus et canvas en `aria-hidden` ; l'information reste dans le HTML (`alt`, légendes, texte).
- Mesures et spécimen : `output` et `aria-live="polite"`.
- Contrastes du § 2.1 ; aucun texte sur image.
- À faire avant la mise en ligne : un passage au lecteur d'écran (NVDA ou VoiceOver).

## 8. Alternative "Épreuve" (`[data-direction="epreuve"]`)

> **Mise à jour 2.3** : Épreuve est la direction retenue. Sa typographie passe à l'association 3 (Instrument Serif, PolySans, IBM Plex Mono), et ses jetons sont dans `prototypes/epreuve/tokens.css` (§ 9). Le tableau ci-dessous décrit l'état de 2.2.

Mêmes composants et mêmes règles ; seuls les jetons et quelques compositions changent.

| Jeton | Valeur | Contraste |
|---|---|---|
| `--paper` | #121210 | - |
| `--ink` | #F1EEE6 | 16,2:1 |
| `--muted` | #A6A296 | 7,4:1 |
| `--red` | #FF5A36 | 6,0:1 ; texte encre sur aplat rouge : 6,0:1 |
| `--hair` | #3A3833 | 1,6:1, décoratif |
| `--f-display`, `--f-text` | Bricolage Grotesque (graisse 200 à 800, chasse 75 à 100 %) | 76 Ko |
| `--w-display` | 700 | - |
| `--step-hero` | clamp(3.1rem, .6rem + 10.4vw, 13.5rem) | 50 à 216 px |

Titres en capitales à 75 % de chasse, interlignage de 0,96 au hero (0,86 faisait toucher les accents). Les étiquettes de statut gardent un texte encre foncée sur jaune. Effet propre : la chasse des titres d'index passe de 75 % à 90 % pendant leur entrée, au-dessus de 48 rem seulement, sans retour à la ligne (`white-space: nowrap`), pour que la hauteur des lignes ne change pas.


## 9. Épreuve, version 2.3 (`prototypes/epreuve/tokens.css`)

Couleurs inchangées depuis le § 8 (`--paper` #121210, `--ink` #F1EEE6, `--muted` #A6A296, `--hair` #3A3833, `--red` #FF5A36, `--tape` #FFD43B), plus `--sheet` #1A1916 pour les cadres et les menus.

| Jeton | Valeur | Rôle |
|---|---|---|
| `--f-display` | Instrument Serif 400, romain et italique | titres, chiffres, citations ; l'italique porte l'accent rouge |
| `--f-text` | PolySans Neutral | texte courant |
| `--f-mono` | IBM Plex Mono 400 | libellés, mesures, métadonnées, boutons |
| `--step-hero` | clamp(3.6rem, 1.2rem + 11.2vw, 12.5rem) | titre du hero : 58 à 200 px (180 px à 1 440) ; interlignage de 0,86 |
| `--step-3` | clamp(2.8rem, 1.6rem + 4.6vw, 6.4rem) | titres de section |
| `--step-2` | clamp(2rem, 1.4rem + 2.2vw, 3.6rem) | titres d'étape, d'essai, valeurs mesurées |
| `--stroke`, `--stroke-bold` | 1,5 px, 2,5 px | traits du motif (`vector-effect: non-scaling-stroke`) |
| `--plate-offset` | 0,06 em | décalage maximal des plaques sur le texte, pour rester lisible |

Composants ajoutés par le concept Calage : repère de calage (`<g id="repere">`, deux `<use>` : plaque rouge dessous, plaque papier dessus), traits de coupe, ligne de pied d'épreuve, gamme de contrôle (six cases : aplats et trames SVG), tampon "Bon à tirer" (secteurs d'anneau, texte sur cercle masqué, filtre d'encre), indicateur de calage vertical dans la gouttière gauche (au-delà de 64 rem).

Règles du mouvement : voir `implementation-decisions.md` (révisions 2.3) et `experience-signature.md`, § 8.
