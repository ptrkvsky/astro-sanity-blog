# 01 - Transitions entre documents

**Effet étudié.** Depuis l'index des essais, un clic ouvre l'étude de cas. La capture du projet s'agrandit jusqu'à sa place dans la nouvelle page, et le titre se déplace. Le retour arrière joue la transition inverse.

**Références.** cydstumpel.nl (View Transitions dans le même document, pilotées par Swup, 1 737 ms mesurées) et sebg.ch (`ClientRouter` d'Astro, nouvelle page visible 778 ms après le clic). Voir `docs/redesign/technical-research.md` § 3.1 et 3.4.

**Technologie.** View Transitions **entre documents**, sans JavaScript :
- `@view-transition { navigation: auto; }` active la transition ;
- `view-transition-name: shot-<projet>` et `title-<projet>` sont posés sur les mêmes éléments dans les deux pages.

Le navigateur capture l'ancienne page, affiche la nouvelle et anime chaque paire de noms identiques.

## Fichiers

| Fichier | Rôle | Poids gzip |
|---|---|---|
| `vt.css` | Transition et mise en page | 1,2 Ko |
| `vt-head.js` | Facultatif : applique la durée réglée et mesure la transition (`pagereveal`) | 0,5 Ko |
| `vt-bench.js` | Instruments | - |

Les 5 pages HTML sont statiques.

## Paramètres modifiables

- **Durée du déplacement** (`--vt-dur`, de 0 à 1 200 ms) : réglée sur l'index, elle est conservée pendant la session.
- **Courbe** : `--vt-ease`, dans `vt.css`.

## Résultat du test visuel (Chrome 156, 27/10/2026)

| Cas | Résultat |
|---|---|
| Clic depuis l'index, 1 440 px | Transition jouée, **440 ms** mesurées pour 420 ms réglées. La capture est observée en cours d'agrandissement |
| Retour arrière | Transition inverse jouée, 453 ms (page restaurée depuis le bfcache) |
| Mobile 390 px | Transition jouée (439 ms), pas de débordement horizontal |
| `prefers-reduced-motion: reduce` | Aucune transition, navigation directe |
| JavaScript désactivé | Les pages et les liens fonctionnent, la transition CSS reste active |
| Clavier | Tab jusqu'au premier essai, focus visible (filet noir et halo jaune), Entrée ouvre la page |

## Comportement responsive

En dessous de 40 rem, l'index passe en 3 colonnes. Les captures mobiles (390 px) remplacent les captures desktop **dans les deux pages**, pour que les deux éléments de la paire aient le même rapport.

## Limites connues

- **Support** : la transition entre documents fonctionne dans Chrome et Edge 126 et plus, et dans Safari 18.2 et plus. Ailleurs, la navigation reste classique, sans dégradation. Le support de Firefox n'a pas été vérifié ici.
- **Prérendu** : les règles de spéculation (`prerender`, déclenché par le survol) sont en place mais ne s'activent pas en navigation pilotée (`activationStart` vaut 0). C'est à vérifier dans un Chrome normal, onglet Application > Speculative loads. Sans prérendu, la grande image de la page d'arrivée peut ne pas être chargée au moment de la transition sur un réseau lent. Ce cas n'a pas été observé ici, en local.
- **Noms uniques** : chaque `view-transition-name` doit être unique dans une page. Une liste générée devra construire les noms à partir du slug.
