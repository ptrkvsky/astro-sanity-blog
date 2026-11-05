# Prototype F - "Vue éclatée" (mission 2.3)

La page se démonte sous les yeux du visiteur. Le motif central est le modèle de boîte du titre, coté en direct (marge, bordure, marge interne, contenu). Au défilement, il bascule en axonométrie 3D et se sépare en calques, qui deviennent les quatre couches de rendu de la page, puis six planches de projets, puis l'histogramme du poids réel de la page, avant de se refermer en curseur de saisie. Concept, narration et évaluation : `docs/redesign/experience-signature.md`.

## Ouvrir

Depuis la racine du dépôt :

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

| Page | URL |
|---|---|
| Expérience complète (3D au-delà de 1 024 px de large, avec WebGL2) | http://127.0.0.1:8767/docs/redesign/prototypes/f-eclatee/ |
| Niveau forcé : complet, allégé, statique | `?tier=full`, `?tier=lite`, `?tier=static` |
| Sans WebGL (illustrations fixes) | `?simulate=nogl` |
| Perte du contexte WebGL après 2,5 s | `?simulate=lost` |

Dans la section 01, le bouton "Retirer la couche créative" libère réellement le contexte WebGL ; "Remettre" la recrée sur un nouveau canvas.

## Ce qui est réellement implémenté

| Moment | Technique |
|---|---|
| Hero : modèle de boîte en CSS, cotes mesurées en direct | HTML et CSS (`outline`, bordure, hachures), `ResizeObserver` pour les valeurs |
| Explosion en 3D (hero épinglé sur 120 % d'écran) | Three.js, caméra orthographique (1 unité = 1 px CSS) : les quatre plans coïncident avec le dessin CSS au moment de la bascule, puis pivotent et se séparent |
| 01 : quatre couches de rendu, l'étape lue sort de la pile | Textures dessinées en canvas 2D ; mise en avant par tweens GSAP sur de simples nombres |
| 02 : six planches de projets ; la planche de la ligne lue ou survolée sort de la pile | Images des projets en textures ; ligne active par ScrollTrigger, survol ou focus clavier |
| 03 : histogramme 3D du poids réel de la page | Resource Timing, regroupé par poste ; le même tableau en HTML à gauche |
| Libellés de la scène | `<span>` HTML projetés depuis la 3D à chaque image (`aria-hidden`) |
| Toute la scène | Fonction pure de la progression de chaque chapitre, lissée image par image ; aucun dessin quand rien ne bouge |

Sous 1 025 px, en mouvement réduit, sans WebGL ou sans JavaScript : illustrations fixes (axonométrie SVG, vignettes, barres HTML), animées légèrement en niveau allégé.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page complète, contenu réel ; nouveaux textes marqués "texte provisoire" |
| `eclatee.css` | Modèle de boîte, sections à illustration collante, états `.xp`, `.xp-3d`, `.exploded` |
| `eclatee.js` | Cotes, mesures et poids, chargement différé, orchestration de la scène |
| `gl/stack.js` | Moteur Three.js : rendu, plans, barres, projection des libellés, retrait et restauration |
