# 02 - Planches sur titre épinglé

**Effet étudié.** Un grand titre reste épinglé pendant que 4 planches passent dessus. Chaque planche monte et se redresse à son entrée dans l'écran, le titre recule et s'éclaircit, et une barre suit la lecture. Pendant un défilement rapide, les planches s'inclinent un peu, puis reviennent droites.

**Références.**
- cydstumpel.nl : 25 `animation-timeline` dans le CSS, dont l'axe `ytuc` d'une police variable, qui passe de 80 à 0 sur 450 px.
- david-estrada.dev : inclinaison selon la vitesse, avec un ressort de raideur 60 et un amortissement de 12.

Voir `docs/redesign/technical-research.md` § 3.1 et 3.2.

**Technologie.**
- `index.html` : CSS natif (`animation-timeline: view()`, `scroll(root)`, `view-timeline`), sous `@supports` et `prefers-reduced-motion: no-preference`.
- `gsap.html` : même balisage et mêmes effets, pilotés par GSAP 3.13 ScrollTrigger (`scrub`).
- `lean.js` : inclinaison selon la vitesse, commune aux deux variantes, 0,8 Ko gzip.

## Paramètres modifiables

| Paramètre | Variable | Plage |
|---|---|---|
| Montée à l'entrée | `--rise` | 0 à 40 vh |
| Rotation à l'entrée | `--tilt` | 0 à 12° |
| Inclinaison maximale | `--lean-max` | 0 à 12° |

`?lean=0` coupe l'inclinaison.

## Mesures (Chrome 156 headless, 1 440 px, 45 crans de molette, CPU bridé x4, médiane de 3 essais)

| Variante | Script | Recalcul de style | Tâches | LoAF |
|---|---|---|---|---|
| CSS, sans inclinaison | 7 ms | 11 ms | 114 ms | 0 |
| GSAP, sans inclinaison | 28 ms | 7 ms | 120 ms | 1 (chargement) |
| CSS + inclinaison | 30 ms | 65 ms | 289 ms | 0 |
| GSAP + inclinaison | 53 ms | 58 ms | 297 ms | 1 (chargement) |

Poids : variante CSS, 1,2 Ko de CSS et 0,8 Ko de JS facultatif. Variante GSAP, **45,9 Ko gzip** de bibliothèque en plus (gsap.min.js 28,1 Ko, ScrollTrigger.min.js 17,8 Ko).

**Fidélité.** Aux mêmes positions de défilement, les deux variantes donnent les mêmes valeurs à ±0,01 : translation, échelle, rotation, échelle et couleur du titre.

## Ce que la mesure a appris (voir technical-research.md § 4.2)

L'inclinaison a d'abord coûté 191 ms de recalcul de style. Deux erreurs l'expliquaient :

1. `--v` était une variable **héritée**, écrite sur la liste : chaque écriture recalculait le style de tous les descendants. Déclarée avec `@property` sans héritage et écrite sur chaque élément, elle ne coûte plus que 111 ms.
2. Elle était écrite sur l'élément qui porte l'animation CSS : chaque écriture forçait à réévaluer l'animation. Placée sur le `li` parent, elle ne coûte plus que 65 ms.

Le premier essai contenait aussi un bug, corrigé : la vitesse était toujours nulle parce que `lastY` était réinitialisé au réveil de la boucle.

## Résultat du test visuel

| Cas | Résultat |
|---|---|
| 1 440 px | Planches qui passent sur le titre, titre qui recule et s'éclaircit, barre de progression |
| Mobile 390 px | Planches de 320 px, pas de débordement horizontal |
| `prefers-reduced-motion: reduce` | Aucune animation, barre masquée, page statique complète |
| JavaScript désactivé | Variante CSS : animations actives, page complète |
| Inclinaison | Pic à 0,21 (environ 1,2° pour 6° maximum) pendant une molette rapide, retour à 0 en environ 0,8 s, puis la boucle s'arrête |

## Limites connues

- `animation-timeline` : Chrome et Edge 115 et plus, Safari 26 et plus. Firefox ne l'active pas par défaut à la date du test (à revérifier au moment de l'implémentation). Sans support, la page est statique.
- Le titre à 15 rem est un choix de prototype. Sur mobile, il occupe tout l'écran derrière les planches.
- Le gain "animation sur le compositeur" de la variante CSS, quand le fil principal est occupé, est documenté par Chrome pour `transform` et `opacity`. Il **n'a pas été mesuré** ici : on ne peut pas observer le fil du compositeur depuis la page.
