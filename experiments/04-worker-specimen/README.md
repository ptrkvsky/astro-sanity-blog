# 04 - Spécimen WebGL rendu dans un worker

**Effet étudié.** Le champ de lignes de niveau de la direction B est présenté comme un spécimen de la direction C. Il n'est chargé qu'au clic, le pointeur soulève le terrain, et le rendu tourne hors du fil principal pour que la page reste réactive.

**Référence.** david-estrada.dev : Three.js r170 tourne dans `feature3d.worker.bundle.js` (OffscreenCanvas), avec détection de `Worker`, `OffscreenCanvas` et `createImageBitmap`, et repli sur un rendu local. Voir `docs/redesign/technical-research.md` § 3.3.

**Technologie.**
- **Rendu** : WebGL2 brut. Le shader vient de `docs/redesign/prototypes/shared/relief.js`, simplifié (sans pics ni masque de texte).
- **Fichiers** : `relief-core.js` ne dépend pas du DOM et accepte un canvas ou un OffscreenCanvas. `relief-worker.js` relaie les messages. `specimen.js` gère la page, la détection et les replis.
- **Choix du fil** : `?thread=worker` (défaut si `transferControlToOffscreen` existe) ou `?thread=main`.
- **Tests de repli** : `?simulate=nogl` simule l'absence de WebGL2, `?simulate=lost` provoque une perte de contexte après 0,8 s.

## Paramètres modifiables

- **Coût de scène simulé** : de 0 à 14 ms d'attente active par image, sur le fil du rendu. Il représente le JavaScript d'une scène plus lourde (Three.js, physique) que ce shader.
- **Bouton "Tester la réactivité"** : sert de cible aux mesures Event Timing.

## Mesures (Chrome 156 headless, 1 440 px, 15 clics pendant le rendu)

| Fil | Coût de scène | CPU | Images/s de la page | Images/s du rendu | Interaction max |
|---|---|---|---|---|---|
| worker | 0 ms | x1 | 60 | 41 | 24 ms |
| worker | 8 ms | x4 | 60 | 22 | 24 ms |
| main | 0 ms | x1 | 29 | 29 | 80 ms |
| main | 8 ms | x4 | 22 | 22 | 104 ms |

**Lecture.** Dans le worker, la page reste à 60 images/s et la pire interaction ne bouge pas : seul le rendu ralentit. Sur le fil principal, tout ralentit ensemble.

**Réserve importante.** Ici, le WebGL est rendu par SwiftShader, sur le CPU. Le coût du fil principal à 0 ms de scène (29 images/s, 80 ms) est donc très surestimé par rapport à un vrai GPU. Ce qui reste valable, c'est l'écart entre les deux fils quand le JavaScript de la scène s'alourdit.

**Poids et chargement.**
- **Code** : relief-core 2,3 Ko, worker 0,6 Ko et page 2,6 Ko, en gzip.
- **Avant le clic** : aucun script du spécimen n'est téléchargé (vérifié avec la Resource Timing API).
- **Image fixe de repli** : 25 Ko en AVIF (1 280 px), 40 Ko en WebP (960 px).
- **Compilation du shader** : 5 à 8 ms dans le worker, 5 à 16 ms sur le fil principal.

## Résultat du test visuel et des replis

| Cas | Résultat |
|---|---|
| 1 440 px, worker | Lignes de niveau animées, état "en cours" |
| Mobile 390 px | Rendu en worker à 60 images/s, scène en 4/5 (307 x 384 px). Le code plafonne le DPR à 1 sur écran tactile (`pointer: coarse`), mais le test n'a émulé que la largeur : ce plafond n'a pas été exercé |
| `prefers-reduced-motion: reduce` | Une seule image, aucune boucle ; le pointeur redessine à la demande |
| JavaScript désactivé | L'image fixe et le texte restent affichés, le bouton est inerte |
| Sans WebGL, fil principal (`--disable-3d-apis`) | Repli : image fixe conservée, message dans `aria-live`, bouton désactivé |
| Sans WebGL, worker | **Non testable avec ce drapeau** : il ne couvre pas WebGL dans les workers, qui obtiennent un contexte. Testé par `?simulate=nogl` : repli correct |
| Perte de contexte (`?simulate=lost`), worker et fil principal | Repli correct, aucune erreur |
| Pause | Arrêt hors de l'écran (`IntersectionObserver`) et onglet masqué (`visibilitychange`) |

## Limites connues

- Une boucle `requestAnimationFrame` dans un worker dédié existe dans Chrome et Firefox. Le repli `setTimeout` (16 ms) n'a pas été testé dans un navigateur réel qui ne l'aurait pas.
- Le bouton "Tester la réactivité" et le panneau d'instruments sont des outils de laboratoire, à retirer de la version finale.
- Sur mobile, le panneau d'instruments recouvre une partie du contenu.
