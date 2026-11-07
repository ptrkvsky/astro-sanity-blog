# Plan de refonte du blog — Épreuve

Date : 07/11/2026. Statut : sous-lots B0 à B4 intégrés à `main` ; B5 vérifié sur le build de production et dans Chrome headless. Safari/iOS, Android réel et lecteur d'écran restent à vérifier. Voir [le compte rendu de recette](blog-validation.md).

L'identité Épreuve s'applique déjà au site ; ce plan définit sa déclinaison pour la lecture technique. Références : `implementation-plan.md`, `architecture.md`, `design-system.md` § 9 et les jetons réellement utilisés dans `src/assets/style/epreuve.css`. Les anciennes propositions typographiques de Revue d'essais ne sont pas la cible.

## 1. Résultat attendu

Un blog reconnaissable comme la suite du portfolio : fond encre, titres Instrument Serif, texte PolySans, métadonnées et code IBM Plex Mono, filets et annotations inspirés de l'imprimerie. L'article est une feuille de lecture technique ; les index en sont le catalogue.

La lecture reste calme : pas de titre tramé, de repère voyageur ou d'épinglage narratif de l'accueil. Les extraits de code, les schémas et les liens portent la démonstration. Les effets éventuels viennent après la livraison de cette couche de lecture, dans le lot 10.

Le périmètre couvre :

- `/posts` : index des articles et accès aux catégories ;
- `/categorie/[slug]` : page thématique et ses articles ;
- `/posts/[slug]` : en-tête, corps, sommaire, FAQ, articles liés et commentaires ;
- les composants, le rendu Portable Text et les métadonnées nécessaires à ces pages.

Sanity reste la source des articles et catégories. Toutes les URL existantes et les redirections historiques sont conservées. Les chiffres de 69 articles et 12 catégories figurant dans l'architecture sont un relevé du 27/10, à recompter avant la réalisation. Aucune suppression, fusion de contenu ou décision de `noindex` n'est prévue ici.

## 2. État du code et conséquences

| Constat vérifié dans le dépôt | Conséquence pour la refonte |
|---|---|
| `posts/index.astro` regroupe les articles par première catégorie et exclut le type `definition` | Conserver cette règle éditoriale au départ ; sécuriser les articles sans catégorie avant toute évolution |
| `PostCard` utilise des cartes arrondies et ombrées ; les catégories et articles liés ont des compositions différentes | Créer une présentation commune, avec variantes explicites selon le contexte |
| L'article mélange styles globaux de titres, classes héritées et sommaire en grille à deux colonnes égales | Isoler les styles du blog et établir une vraie colonne de lecture avec marge |
| `Breadcrumb` est monté avec `client:only="react"` | Le remplacer ici par un fil d'Ariane Astro présent dans le HTML |
| `portableTextComponents.tsx` rend h3 à h6 en h2 et ne reprend que le premier fragment des titres | Préserver le niveau et le texte complet des titres, puis partager leur traitement avec le sommaire |
| `getHeadings` dérive les identifiants du premier fragment sans dédoublonnage | Stabiliser les ancres existantes quand elles sont uniques et suffixer les collisions |
| Les images Portable Text n'ont ni dimensions HTML ni variantes de largeur | Réserver leur place et servir des sources adaptées sans perte de contenu |
| La coloration est calculée côté serveur, mais sa feuille est chargée depuis cdnjs | Conserver le calcul serveur et intégrer le thème au CSS local du blog |
| Le formulaire React est hydraté à sa visibilité ; son envoi dépend de JavaScript | Conserver l'îlot pour cette livraison, afficher une explication sans JS et vérifier ses états |
| Les articles et catégories sont prérendus ; `/posts` passe par le rendu serveur/ISR configuré | Documenter le mode de publication et vérifier la fraîcheur des données avant de changer le mode de l'index |
| Les articles liés utilisent `publishedAt` pour le tri, mais ce champ n'est pas demandé dans `queryAllPosts` | Définir un tri avec les dates réellement disponibles et tester les données incomplètes |

## 3. Composition proposée

### Index des articles

Un en-tête « Articles » en serif, une courte introduction éditoriale et une navigation de catégories sous forme de liens vers leurs URL existantes. Viennent ensuite les sections par catégorie, avec un titre cliquable et des entrées séparées par des filets : titre, résumé, date si fiable. La numérotation éventuelle est décorative ; elle n'est pas un identifiant d'article.

Pas d'image obligatoire sur chaque entrée. Les liens restent explicites et utilisables au clavier. Les articles restent tous accessibles par HTML ; aucun filtre client ne conditionne leur visibilité. Une recherche et une pagination ne sont pas nécessaires à la première livraison : leur ajout exige un besoin confirmé et une stratégie de navigation distincte.

### Catégorie

Fil d'Ariane, titre, introduction issue de `category.description` quand elle existe, nombre réel d'articles et liste réutilisant le composant de l'index. Prévoir l'absence de description et une catégorie vide sans texte inventé. Les introductions de 80 à 150 mots proposées dans l'architecture constituent un travail éditorial, pas un préalable bloquant au gabarit.

Le tri recommandé est décroissant sur une date disponible et définie explicitement ; ne pas confondre date de création Sanity et date de publication. L'exclusion actuelle des définitions sur l'index ne doit pas les faire disparaître des routes ou catégories où elles sont déjà accessibles.

### Article

Ordre du document : fil d'Ariane, catégorie(s), h1, résumé si utile et non redondant, auteur et dates disponibles, sommaire, corps, FAQ éventuelle, articles liés, contact discret et commentaires.

Sur grand écran, une marge reçoit le sommaire et la colonne principale reste limitée à environ 60–68 caractères. Sous 64 rem, une seule colonne ; sommaire dans un `<details>` avant le corps, navigable sans JS. Le DOM garde un ordre de lecture cohérent entre les deux présentations.

Le corps vise 17–19 px avec interligne de 1,65 à 1,75. Les h2 et h3 gardent la hiérarchie visuelle Épreuve avec une échelle adaptée à la lecture. Le code est en mono, avec défilement horizontal interne ; les tableaux ont eux aussi leur propre conteneur. Les liens sont soulignés. Les citations, légendes et encadrés utilisent filets et surfaces `--sheet`.

PolySans n'existe ici qu'en graisse 400 et le socle désactive la synthèse des fontes : prévoir une emphase visible pour `strong` et `em` sans supposer une graisse ou un italique absent. Vérifier aussi les caractères français et les symboles techniques dans la police mono existante.

Le sommaire pointe exactement vers les titres rendus. Son état actif est une amélioration facultative : observation limitée au corps, `aria-current="location"`, aucune dépendance pour cliquer les ancres. Les titres ont un `scroll-margin` adapté. Sans JS, le sommaire reste entièrement fonctionnel.

## 4. Découpage du lot 3 bis

Chaque sous-lot doit laisser le site lisible et compilable. Le premier article témoin est réalisé avant la généralisation aux index.

| Sous-lot | Travail et fichiers principaux | Critère de sortie |
|---|---|---|
| B0 — Relevé et témoins | Recompter les routes ; choisir des articles existants couvrant code, image, vidéo, FAQ, titres longs, article court et titres répétés ; capturer l'état initial et les métadonnées | Liste des URL témoins et référence avant/après consignées ; cas manquants couverts par des données de test locales |
| B1 — Socle de lecture et article témoin | Ajouter `src/assets/style/blog.css`, limiter les styles au blog ; composer l'en-tête et le corps de `posts/[slug].astro` ; réutiliser les jetons et le gabarit commun | Article témoin validé visuellement à 390 et 1 440 px, puis à 360 et 1 024 px ; accueil inchangée |
| B2 — Portable Text et navigation d'article | Corriger `portableTextComponents.tsx`, `getHeadings.ts`, le sommaire et son observer ; ajouter un fil d'Ariane Astro ; traiter images, tableaux, code, vidéos et liens | Niveaux corrects, texte des titres conservé, ancres uniques et stables, aucun contenu perdu ; lecture et navigation complètes sans JS |
| B3 — Index et catégories | Refaire `PostCard`, `ListingSection`, `posts/index.astro` et `categorie/[slug].astro` ; expliciter les niveaux h2/h3 du composant partagé et les règles de tri | Présentation commune ; aucune route perdue ; états sans image, sans catégorie, sans description et liste vide traités |
| B4 — Fin d'article et échanges | Harmoniser FAQ, `SectionPosts`, commentaires et `FormComment` ; bloc contact vers la destination existante (`/#contact`, ancre présente dans `BonATirer.astro`), sans créer une page manquante | Succès, erreur HTTP, erreur réseau et attente annoncés ; double soumission empêchée ; commentaires existants lisibles sans JS |
| B5 — Métadonnées et recette | Vérifier canonical, titres/descriptions, auteur, dates, fil d'Ariane et JSON-LD ; build et contrôles sur les pages témoins et l'inventaire des routes | Recette ci-dessous passée et limites documentées ; lot 3 bis clôturable |

Dépendances : `B0 → B1 → B2 → B3 → B4 → B5`. Les métadonnées et la collecte des introductions peuvent être préparées dès B0. Aucun de ces sous-lots n'attend la création des études de cas du lot 9.

### Détails à traiter dans B2

- Utiliser un même calcul des titres et des ancres pour le rendu et le sommaire. Conserver l'identifiant historique des titres simples et uniques ; ne pas renommer toutes les ancres pour les collisions.
- Préserver les fragments, emphases et liens des titres ; maintenir h2 à h6 et traiter les h1 éventuellement présents dans le corps pour conserver un seul h1 de page.
- Résoudre les liens internes vers `/posts/{slug}` avec un repli lisible si la référence manque. Vérifier le comportement asynchrone du renderer actuel.
- Échapper correctement textes et attributs construits dans les chaînes HTML ; contrôler les URL et les identifiants de médias utilisés dans ces chaînes.
- Conserver un bloc lisible si un langage de code est absent ou inconnu. Utiliser un thème local basé sur les jetons et vérifier le contraste de chaque couleur de syntaxe.
- Réserver les dimensions des images depuis les métadonnées Sanity ; fournir `srcset`/`sizes`, légendes disponibles et textes alternatifs éditoriaux. Différer les images hors du premier écran.
- Remplacer le gabarit YouTube actuel par une vignette et un lien accessibles, puis un lecteur chargé à la demande ; conserver un accès à la vidéo sans JS et éviter une lecture automatique à l'arrivée sur l'article.
- Préserver les types Portable Text réellement présents ; inventorier ceux que les témoins ne couvrent pas. Ne pas supprimer silencieusement un bloc inconnu.

### Limite du travail sur les commentaires

Conserver l'API, la modération et le stockage existants. Les contrôles portent sur les états du formulaire et la compatibilité avec son contrat JSON. Simuler les réponses pour les tests ; aucun commentaire réel ni e-mail de notification ne doit être créé pendant la recette automatisée. La soumission sans JavaScript nécessiterait une évolution explicite du contrat serveur ; elle n'est pas annoncée comme acquise ici.

## 5. Organisation proposée

Les noms suivants sont des cibles de travail, pas des composants déjà créés :

```text
src/assets/style/blog.css
src/features/blog/components/
  BlogHeader.astro
  PostCard/index.astro              # repris, variantes et niveau de titre explicites
  ArticleHeader.astro
  ArticleBreadcrumb.astro
  TableOfContent/                   # repris
  SectionPosts/                     # reprend le composant de liste commun
  ...                               # FAQ et commentaires conservés puis harmonisés
src/features/blog/functions/
  getHeadings.ts                    # partage sa logique avec le rendu
  ...
```

Les styles du contenu injecté sont globaux uniquement sous un préfixe de blog (`.blog .post-content`, par exemple). Pas de règle globale `h1` provenant d'une page d'article. Ne pas modifier les valeurs de `epreuve.css` pour résoudre un problème local au blog. Réutiliser les composants existants quand un simple changement de structure suffit.

## 6. Métadonnées, données et publication

- Conserver slugs, canonical et redirections ; comparer l'inventaire des URL avant et après. Le changement d'habillage n'entraîne aucune migration d'URL.
- Conserver les articles et catégories prérendus. Décider séparément du prérendu de `/posts` après vérification du déclenchement des builds depuis Sanity ; ne pas modifier globalement ISR ou le déploiement dans ce lot.
- Vérifier les champs de date disponibles dans les requêtes. N'afficher une « mise à jour » que si sa signification éditoriale est fiable ; `_updatedAt` peut aussi changer pour une retouche technique.
- Prévoir des valeurs de repli non vides pour les métadonnées absentes, issues du contenu réel. Les titres et descriptions déjà rédigés dans Sanity restent prioritaires.
- Préserver `BlogPosting` et le fil d'Ariane structuré ; vérifier que la FAQ structurée correspond à la FAQ visible et que les chaînes contenant `</script>` ne cassent pas le JSON-LD.
- Les catégories gardent leur description existante. Les liens vers les études de cas sont ajoutés seulement lorsque les pages cibles existent.

## 7. Performance et recette

La lecture, les liens, les catégories et les ancres nécessitent **0 Ko de JavaScript**. Le formulaire reste le seul îlot React prévu dans ce plan ; il conserve son hydratation différée. Ni GSAP, ni les modules WebGL de Calage ne doivent être téléchargés sur les pages du blog.

Réutiliser les quatre fontes existantes, sans fichier supplémentaire. Cible proposée pour le CSS commun et celui du blog : ≤ 30 Ko compressés par page ; JS ajouté pour le sommaire et les améliorations : ≤ 5 Ko gzip, hors runtime et formulaire existants qui doivent être mesurés séparément. Ces plafonds sont des objectifs à vérifier en B0/B5, pas des résultats mesurés. Le plafond de 30 Ko de HTML du budget général doit être réévalué sur les articles longs avec code coloré, sans retirer du contenu pour le tenir.

Cibles conservées pour la lecture : CLS ≤ 0,02 et LCP mobile ≤ 2 s. Les mesures locales servent à la recette ; elles ne démontrent pas un percentile terrain. Réserver l'espace des médias et comparer les transferts avant/après sur les mêmes pages, réseau et conditions de cache.

| Contrôle | Attendu |
|---|---|
| Build de production (`pnpm build`) | Réussite ; tout bloc Sanity présent est rendu ou signalé explicitement |
| Routes et liens | Ensemble des routes conservé ; aucun lien interne cassé ; retour arrière et liens avec fragment fonctionnels |
| HTML sans JS | Article, fil d'Ariane, catégories, sommaire, FAQ et commentaires publiés présents ; explication pour l'envoi de commentaire |
| Structure | Un seul h1 ; niveaux cohérents ; identifiants uniques ; chaque lien du sommaire a une cible |
| Responsive à 360, 390, 768, 1 024 et 1 440 px | Aucun débordement de page ; code et tableaux défilent à l'intérieur de leur bloc |
| Clavier et zoom 200 % | Focus visible, sommaire accessible, aucun piège, contenu lisible et commandes accessibles |
| Contrastes | Texte courant ≥ 4,5:1 ; liens et états identifiables autrement que par la couleur ; syntaxe lisible |
| Mouvement réduit | Aucun mouvement imposé ; mêmes informations et commandes |
| Médias et données incomplètes | Pas de saut de mise en page ; pas de plantage sans image, description ou catégorie ; code sans langage lisible |
| SEO | Canonical et métadonnées cohérents ; JSON-LD analysable, y compris avec une FAQ contenant du HTML |
| Formulaire | Validation, attente, succès, erreurs HTTP/réseau, conservation du texte en cas d'échec et annonce accessible |
| Navigateurs | Chrome, Firefox, Safari/iOS ; Android réel et lecture VoiceOver ou NVDA à consigner selon disponibilité |
| Non-régression | Accueil, bandeau, pied de page et liens vers le blog inchangés dans leur fonctionnement |

Tests automatisés ciblés : logique partagée des titres/ancres (titres fragmentés et dupliqués), rendu de blocs Portable Text atypiques, tri et données manquantes, états d'erreur du formulaire. Réutiliser Jest déjà déclaré dans le dépôt si sa configuration convient. Compléter par une recette navigateur sur le build ; ne pas multiplier les tests qui ne vérifieraient que des classes CSS.

## 8. Ordre de lancement et limites

Commencer par B0 puis présenter le même article en mobile et desktop à la fin de B1 : c'est le point de revue visuelle avant de décliner la composition sur toutes les pages. Cette revue porte sur un résultat concret et ne bloque pas la préparation des correctifs de rendu de B2.

Pas d'arbitrage bloquant pour préparer ce lot : l'identité, les polices et Sanity sont déjà fixés. À confirmer pendant la réalisation : introduction de l'index, sens éditorial des dates, textes des catégories et maintien du libellé « Articles » dans la navigation. Valeurs par défaut : « Articles », descriptions existantes et absence de date ambiguë.

À traiter séparément : moteur de recherche, migration du CMS, nouveaux contenus, changement de taxonomie, mode clair, suppression des commentaires, démonstrations WebGL et transitions natives entre pages (lot 10). Le contrôle automatique des budgets en CI reste le lot 11 ; B5 fournit les pages témoins et mesures utiles à ce contrôle.

## 9. Bilan de réalisation — 07/11/2026

- 72 routes d'articles et 13 routes de catégories conservées ; l'index affiche 59 articles hors définitions, selon la règle existante.
- Index, catégories, article, sommaire, fil d'Ariane, FAQ, articles liés et commentaires refondus avec les jetons Épreuve.
- Rendu Portable Text corrigé : niveaux et fragments des titres, ancres dédoublonnées, liens internes résolus avant rendu, images dimensionnées, code sans langage pris en charge et listes historiques normalisées.
- Le lecteur vidéo est créé après un clic ; sans JS, le lien YouTube reste disponible. Le formulaire garde son hydratation différée et annonce attente, erreur et succès.
- La largeur de lecture est finalement fixée à `44rem` au maximum : une largeur en `ch` provoquait un déplacement à l'arrivée de PolySans. Les autres styles restent limités au blog.
- Les canonical utilisent le domaine configuré dans Astro ; les graphes du blog utilisent le domaine de production et le chemin réel de chaque page.
- `pnpm build` et les 8 tests de `pnpm test --runInBand --coverage=false` passent. Recette responsive, clavier, zoom, contraste et sans JS passée sur les témoins ; détails et limites dans le compte rendu.
- Le contrôle global `astro check` reste en échec sur 7 erreurs préexistantes de déclarations de types hors du code modifié pour le blog. Il n'est pas présenté comme passé.

B5 reste ouvert pour les contrôles sur appareils réels et lecteur d'écran ; le lot 3 bis ne doit pas être considéré comme entièrement recetté sur ces environnements. Les textes d'introduction ajoutés à l'index restent à relire éditorialement.
