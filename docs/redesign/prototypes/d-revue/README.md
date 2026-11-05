# Prototype D - Revue d'essais (mission 2.2)

Prototype haute fidélité de la page d'accueil et d'une étude de cas, pour arbitrer la direction artistique. Il est hors de `src/` et de `public/` : Astro ne le construit pas et il n'est jamais publié.

## Ouvrir

Depuis la racine du dépôt (le prototype charge PolySans depuis `public/`, les images et les modules depuis `experiments/`) :

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

| Page | URL |
|---|---|
| Accueil, direction principale | http://127.0.0.1:8767/docs/redesign/prototypes/d-revue/ |
| Accueil, alternative "Épreuve" | http://127.0.0.1:8767/docs/redesign/prototypes/d-revue/?direction=epreuve |
| Étude de cas (SAFTI.fr) | http://127.0.0.1:8767/docs/redesign/prototypes/d-revue/etude-de-cas.html |
| Comparaison de fontes | http://127.0.0.1:8767/docs/redesign/prototypes/d-revue/fontes.html |

La direction choisie est mémorisée pour la session (`sessionStorage`) : on peut passer de l'accueil à l'étude de cas sans perdre l'alternative. `?direction=revue` revient à la direction principale.

Outils de test : `?simulate=nogl` (WebGL2 absent) et `?simulate=lost` (perte de contexte après 0,8 s) testent les replis du spécimen. Le drapeau `--disable-3d-apis` ne couvre pas les workers.

La barre sombre en haut de chaque page est un outil de prototype : elle ne fait pas partie du design.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero, essais (index + essai à la une), expertise et spécimen, à propos et notes, contact |
| `etude-de-cas.html` | Étude de cas avec marge annotée, transition de page et révélation tramée |
| `fontes.html` | Cinq associations de fontes sur le même texte, avec le poids réel des fichiers |
| `style.css` | Jetons, grille, composants, responsive, mouvement ; alternative sous `[data-direction="epreuve"]` |
| `fonts.css`, `fonts/` | Fontes candidates (OFL 1.1, sous-ensemble latin de Fontsource) |
| `revue.js` | Fiche de mesure en direct, spécimen chargé au clic, révélation tramée sur l'étude de cas |

Modules réutilisés sans copie : `../shared/measure.js` (phase 2), `experiments/03-image-reveal/reveal.js` et `experiments/04-worker-specimen/` (mission 2.1).

## Contenu

Les projets, la biographie, les deux témoignages et les titres d'articles viennent des prototypes A et C, eux-mêmes repris du site actuel. Tout ce qui manque est marqué par une étiquette jaune visible :

- **démo** : texte ou image de démonstration (paragraphes de l'étude de cas, délai de réponse, figure 3 générée par IA) ;
- **à sourcer** : chiffre repris du site actuel sans justificatif (note Trustpilot) ;
- **à fournir** : information absente (disponibilité, LinkedIn, GitHub, visuel d'Omega, mesures avant/après) ;
- **à valider** : liste reconstituée à partir du code actuel du site SAFTI, à confirmer.

Aucun client, résultat chiffré ni témoignage n'a été ajouté.

## Vérification

Voir `docs/redesign/directions.md`, section "Vérification visuelle du prototype D".
