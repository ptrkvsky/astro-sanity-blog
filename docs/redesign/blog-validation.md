# Recette du blog Épreuve — 07/11/2026

Code intégré à `main`, sans déploiement effectué dans cette session. Référence : [plan du lot 3 bis](blog-implementation-plan.md).

## Périmètre vérifié

Inventaire avant modification issu du build local existant : **72 articles et 13 catégories**. Le nouveau build conserve ces 85 routes. L'index affiche 59 articles hors définitions ; les 13 définitions conservent leurs pages et leur accès par catégorie.

Pages témoins :

- `/posts/comment-reduire-ttfb` : article long, images, FAQ et sommaire ;
- `/posts/async-await-javascript` : extraits de code et hiérarchie des titres ;
- `/posts/definition-react-jsx` : définition et vidéo ;
- `/categorie/javascript` : liste thématique ;
- `/posts` : index et navigation par catégories.

Les routes prérendues ont été contrôlées sur `.vercel/output/static`, servies localement. L'index demeure SSR/ISR : il a été vérifié sur le serveur Astro de développement déjà actif sur le port 4321. Son bundle serveur est construit avec succès, mais son exécution sur Vercel n'a pas été testée par cette recette. Aucun mode de publication ni webhook Sanity n'a été changé.

## Résultats

| Vérification | Résultat |
|---|---|
| `pnpm build` avec lecture de Sanity | Réussite ; 85 routes attendues présentes, aucun type ou style Portable Text non pris en charge signalé |
| `pnpm test --runInBand --coverage=false` | 8 tests passés : titres fragmentés et répétés, niveaux de titre, ancres, listes historiques, code sans langage, liens internes, dates et tri, catégorie absente, images, contrat et erreurs d'envoi |
| HTML des 85 routes | Un h1 par page ; aucun identifiant dupliqué ; toutes les cibles du sommaire présentes ; titres et descriptions non vides ; JSON-LD analysable |
| Liens internes des 85 pages du blog | Aucun lien vers une route locale absente du build ; index et pages globales rendues côté serveur traités séparément |
| Canonical | Domaine `https://developpeur-web.tech`, chemin conservé ; plus de canonical localhost sur le build local |
| Responsive | Témoins article, code, définition et catégorie à 360, 390, 768, 1 024 et 1 440 px : aucun débordement horizontal ; même contrôle passé sur l'index |
| Sans JS, article TTFB | Fil d'Ariane, 7 liens de sommaire et corps complet présents ; bouton d'envoi inactif, explication et lien de contact disponibles |
| Clavier, article TTFB | Parcours de 39 positions contrôlées ; focus visible, pas d'élément focalisé hors écran ni de piège observé |
| Zoom | Simulation à 200 % par doublement du corps racine et réduction de la zone de rendu : pas de débordement ; zoom natif et appareils réels non couverts |
| Contraste, article async/await | 370 éléments textuels rendus contrôlés, y compris les couleurs de code ; aucun contraste inférieur au seuil applicable détecté |
| Mouvement réduit | Pages témoins complètes, aucun module de Calage ou GSAP demandé ; aucun effet de défilement introduit dans le blog |
| Commentaires | Erreur HTTP et panne réseau simulées : texte conservé et nouvel essai possible ; succès simulé : confirmation de modération et champs vidés |
| Vidéo | Aucun iframe avant interaction ; iframe créé après clic ; lien YouTube conservé sans JS |
| Format et espaces | Prettier sur les fichiers modifiés et `git diff --check` passés |

Les requêtes d'envoi de commentaire ont toutes été interceptées : aucun commentaire réel, aucune notification par e-mail. Le lecteur vidéo a également été simulé pour tester son activation.

## Mesures locales et budgets

Sur l'article async/await, Chrome headless, 1 440 × 900, serveur local et cache de contexte neuf : **LCP 240 ms, CLS 0,00018** sur le dernier passage. Ce sont des mesures de laboratoire, pas des Core Web Vitals de terrain ni des garanties sur réseau mobile.

Un premier passage donnait un CLS de 0,02054 : la largeur de la colonne en `ch` passait de 713 à 800 px à l'arrivée de PolySans. Le plafond en `44rem` réserve désormais une largeur stable de 704 px au corps racine de 16 px. Le déplacement de colonne a disparu.

Sur les 85 pages : HTML compressé au maximum **22 600 octets** ; feuille CSS chargée sur les pages témoins **6 694 octets gzip**. Aucun fichier de police supplémentaire. La lecture ne dépend pas de JavaScript ; le script du sommaire et le chargeur de lecteur sont propres aux articles, et l'îlot React des commentaires reste différé. La mesure exhaustive du coût transféré du runtime et des polices en conditions de production reste à intégrer au lot 11.

## Captures du résultat

| Vue | Desktop | Mobile |
|---|---|---|
| Article témoin | [Article desktop](validation/blog/article-desktop.png) | [Article mobile](validation/blog/article-mobile.png) |
| Index | [Index desktop](validation/blog/index-desktop.png) | [Index mobile](validation/blog/index-mobile.png) |
| Code | [Extrait de code](validation/blog/code-desktop.png) | Vérifié dans le parcours responsive |

## Vérifications encore ouvertes

- Safari et iOS, Android réel, écran haute densité et lecteur d'écran : aucun appareil utilisé ici.
- Validation éditoriale des nouvelles phrases d'introduction ; enrichissement des descriptions de catégories quand nécessaire.
- Mesures mobiles bridées, budget transféré complet et contrôle automatique en CI (lot 11).
- Publication sur Vercel et contrôles après déploiement ; cette tâche ne publie pas le site.

`pnpm exec astro check` ne passe pas globalement : **7 erreurs préexistantes** dans `src/env.d.ts` (déclarations `content` et `MODE`), `src/interfaces/index.ts` (double export de `SanityImage`) et `src/types/block-content-to-react.d.ts` (ancien namespace `JSX`). Les deux erreurs apparues sur la FAQ pendant cette réalisation ont été corrigées ; aucune erreur du contrôle Astro final ne vise les fichiers modifiés pour le blog.

Le contrôle TypeScript brut rencontre aussi les déclarations `.astro` des anciens fichiers d'exports. Ces erreurs ne sont pas masquées et ne doivent pas être confondues avec le résultat positif du build.
