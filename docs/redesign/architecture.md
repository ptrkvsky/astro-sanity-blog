# Architecture UX, technique et SEO - refonte developpeur-web.tech

Document de travail de la mission 2 (conception). Il ne modifie rien en production : il fixe les règles que la mission d'implémentation devra respecter. Les parties qui dépendent de la direction artistique sont signalées ; le reste vaut quelle que soit la direction retenue.

Date de l'état des lieux : 27/10/2026, sur la base de la branche `chore/astro-7` (Astro 7.4.2).

## 1. Sources et limites

| Source | Utilisée | Remarque |
|---|---|---|
| Build local (`.vercel/output/static`) | oui | titres, descriptions, H1, volume de texte de chaque page générée |
| HTML de production (curl, 27/10) | oui | home, articles, sitemap, robots, redirections, JSON-LD |
| Google Search Console | **non disponible** | aucun accès depuis cet environnement |
| Mesure d'audience | **inexistante** | aucun script d'analytics sur le site, aucune propriété GA4 associée au compte |
| Backlinks | **non disponible** | aucun outil (Ahrefs, Majestic, GSC "Liens") consulté |

Conséquence : **aucune décision de suppression, de fusion ou de `noindex` d'un contenu ne doit être prise sans l'export GSC** (rapport "Pages" et "Performances" sur 16 mois, rapport "Liens"). Les recommandations ci-dessous qui en dépendent sont marquées "à confirmer avec GSC".

## 2. État des lieux SEO

### 2.1 Pages existantes

| Type | URL | Nombre | Rendu actuel | Constat |
|---|---|---|---|---|
| Accueil | `/` | 1 | SSR + ISR | Contenu riche, contact par `mailto:` uniquement |
| Liste des articles | `/posts` | 1 | SSR + ISR | Liste par catégorie |
| Articles | `/posts/[slug]` | 69 | prérendu | Cœur du capital SEO |
| Catégories | `/categorie/[slug]` | 12 | prérendu depuis la mission 1 (500 en prod avant) | Pages minces : 72 à 570 mots, pas de texte d'introduction |
| Plan du site | `/plan-site` | 1 | SSR + ISR | Utile au maillage |
| Mentions légales | `/mentions-legales` | 1 | SSR + ISR | Cite Netlify comme hébergeur (faux depuis Vercel) |
| Ancienne home | `/old` | 1 | SSR + ISR | Hors layout, présente dans le sitemap, texte proche de la home : risque de cannibalisation |

Redirections existantes (`vercel.json`, à conserver telles quelles) : `/blog/postgresql/installer-mac/` -> `/posts/installer-postgresql-mac`, `/blog/javascript/package-json/` -> `/posts/package-json`, `/blog/` -> `/posts`.

### 2.2 Défauts mesurés

| Défaut | Ampleur | Gravité |
|---|---|---|
| `AggregateRating` 4,6 / 31 avis codé en dur sur un `CreativeWorkSeries` de la home | 1 nœud JSON-LD | **Élevée** : note auto-attribuée sans avis visibles, contraire aux règles Google sur les données structurées (risque d'action manuelle "balisage abusif") |
| `FAQPage` sur la home dont les questions ne sont pas affichées | 1 | Élevée : balisage d'un contenu invisible ; Google n'affiche plus les FAQ enrichies hors sites gouvernementaux et santé depuis 2023 |
| JSON-LD cassé par une balise `</script>` dans une réponse de FAQ | 1 article (`syntaxerror-cannot-use-import-statement-outside-a-module`) | Moyenne |
| Aucune entité `Person` | tout le site | Moyenne : l'auteur et l'expertise (E-E-A-T) ne sont pas décrits |
| `<title>` vide | 2 articles (`comment-resoudre-les-erreurs-du-type-never`, `comment-trier-un-map-en-javascript`) | Élevée pour ces pages |
| Meta description vide | 5 articles | Moyenne |
| Titres > 65 caractères | 35 pages | Faible (troncature) |
| Descriptions > 160 caractères | 24 pages | Faible |
| URL avec et sans slash final toutes deux en 200 ; sitemap avec slash, canonical sans | tout le site | Moyenne : signaux contradictoires |
| Header rendu deux fois, slot hors `<body>` | tout le site | Faible pour le SEO, réel pour l'accessibilité |
| Articles éloignés du positionnement (marketing WeChat, réseaux sociaux chinois, guides d'agences à Lyon et Nantes, tendances marketing 2023) | ~8 articles | À arbitrer avec GSC : ils diluent la thématique mais peuvent apporter du trafic ou des liens |

### 2.3 Affirmations du site à sourcer avant réutilisation

Le site actuel affiche des chiffres que ce travail ne peut pas vérifier. Ils ne seront **pas** repris dans la nouvelle version sans justificatif :

- "150+ clients satisfaits", "35+ audits techniques", "12 ans" et "14 ans" (les deux valeurs coexistent sur la home).
- "Note Trustpilot passée de 2,1 à 4,8" (SAFTI.fr) : à conserver uniquement avec la période et la part attribuable à la fonctionnalité.
- "Récompensé sur CSS Design Awards" (Draw me a Sheep) : à appuyer d'un lien vers la fiche CSSDA.
- La note 4,6 / 31 du JSON-LD : à supprimer.

## 3. Arborescence cible

```
/                         Accueil (conservée)
/projets                  Index des études de cas (nouvelle)
/projets/[slug]           Étude de cas (nouvelle, 3 à 6 pages)
/a-propos                 Parcours, méthode, stack, entité Person (nouvelle)
/contact                  Coordonnées et disponibilité (nouvelle, légère)
/posts                    Articles (conservée, libellé possible "Journal")
/posts/[slug]             69 articles (toutes conservées)
/categorie/[slug]         12 catégories (conservées, enrichies)
/plan-site                (conservée)
/mentions-legales         (conservée, corrigée)
/old                      -> à rediriger, voir 3.2
```

### 3.1 Pages à conserver, améliorer ou créer

| Page | Décision | Intention de recherche | Justification |
|---|---|---|---|
| `/` | Conserver l'URL, refondre | Navigationnelle ("Johan Petrikovsky") et commerciale locale ("développeur React freelance Toulouse") | Page qui porte la marque ; doit répondre en un écran à qui, quoi, niveau, contact |
| `/projets` | Créer | Commerciale ("références développeur React", noms de projets) | Les 6 références sont aujourd'hui enfouies dans la home, sans page propre ni URL partageable |
| `/projets/[slug]` | Créer | Informationnelle de preuve (recruteurs, clients, studios) | Format étude de cas demandé : problème, contraintes, décisions, réalisation, résultats vérifiables |
| `/a-propos` | Créer | Navigationnelle, E-E-A-T | Porte l'entité `Person`, le parcours et la méthode ; libère la home |
| `/contact` | Créer | Transactionnelle | Le lien "Contact" actuel pointe vers une ancre absolue de la home ; une URL dédiée fonctionne depuis toutes les pages et peut être mesurée |
| `/posts`, `/posts/[slug]` | Conserver toutes les URL | Informationnelle technique | Capital SEO principal (69 articles, 241 à 4 841 mots) |
| `/categorie/[slug]` | Conserver, enrichir | Informationnelle thématique | Ajouter un texte d'introduction de 80 à 150 mots écrit à la main et un lien vers les études de cas liées ; sinon `noindex` des plus minces après lecture de GSC |
| `/plan-site`, `/mentions-legales` | Conserver | - | Corriger l'hébergeur dans les mentions |

### 3.2 Redirections, URL par URL

| Source | Cible | Code | Justification | Préalable |
|---|---|---|---|---|
| `/old` | `/` | 301 | Ancienne home sans layout ni canonical propre, texte voisin de la home : cannibalisation | Vérifier dans GSC qu'elle n'a ni impressions propres ni liens entrants ; si elle en a, reprendre son contenu utile dans `/a-propos` avant de rediriger |
| `/xxx/` (toute URL avec slash final) | `/xxx` | 308 | Supprimer le doublon slash / sans slash, aligner sitemap et canonical | Choix "sans slash" car c'est déjà la forme des canonical, donc celle que Google a probablement retenue |
| Redirections `vercel.json` existantes | inchangées | 308 | Toujours utiles pour d'anciens liens | - |

Aucune autre redirection n'est prévue : tous les articles et catégories gardent leur URL.

## 4. Titres, descriptions et hiérarchie

Règles : un seul `<h1>` par page, titres de 50 à 62 caractères, descriptions de 120 à 155 caractères, écrits à la main, sans bourrage de mots-clés.

| Page | `<title>` proposé | Meta description proposée |
|---|---|---|
| `/` | `Johan Petrikovsky - Développeur frontend React à Toulouse` | `Développeur frontend senior : applications React et Next.js rapides, accessibles et bien référencées. Études de cas, articles techniques et contact.` |
| `/projets` | `Projets et études de cas - Johan Petrikovsky` | `Refontes Next.js, outils métier React, sites Astro et WebGL : le problème, les contraintes, les décisions techniques et ce qui a été livré.` |
| `/projets/[slug]` | `{Projet} : {décision technique clé} - Étude de cas` | Rédigée par projet : contexte en une phrase, rôle, résultat vérifiable s'il existe |
| `/a-propos` | `À propos - Johan Petrikovsky, développeur frontend` | `Parcours, méthode et stack d'un développeur frontend basé à Toulouse : React, TypeScript, Next.js, Astro, performance web et SEO technique.` |
| `/contact` | `Contact - Johan Petrikovsky, développeur frontend` | `Un projet React, une refonte ou un audit de performance ? Écrivez-moi, je réponds sous 48 h.` (délai à confirmer) |
| `/posts` | conserver, raccourcir : `Articles React, TypeScript et performance web` | conserver le sens actuel |
| Articles sans titre ou description | à compléter dans Sanity (liste en 2.2) | |

## 5. Maillage interne

- **Études de cas <-> articles** : chaque étude de cas renvoie vers 2 à 4 articles qui approfondissent une décision, et les articles concernés renvoient vers l'étude de cas. Exemples tirés du contenu existant :
  - SAFTI.fr (migration App Router, SEO, performance) <-> `core-web-vitals-introduction`, `comment-reduire-ttfb`, `comment-creer-un-cache-handler-personnalise-pour-next-js-16`, `quel-impact-un-developpeur-peut-il-avoir-sur-le-seo-d-un-site`.
  - Omega (React, TypeScript, tests, Leaflet) <-> `react-typescript`, `types-generiques-typescript`, `arreter-d-utiliser-des-barel-files`.
  - Draw me a Sheep (Astro, Sanity, WebGL) <-> futur article de fond sur la scène WebGL du nouveau portfolio.
- **Articles -> conversion** : bloc de fin d'article sobre ("Besoin de ce niveau d'exigence sur votre projet ?" + lien `/contact` + lien vers l'étude de cas la plus proche), en HTML, sans popup.
- **Navigation principale** : Projets, Articles, À propos, Contact. Quatre entrées, liens HTML standards, visibles sans JavaScript.
- **Fil d'Ariane** visible sur articles, catégories et études de cas, doublé d'un `BreadcrumbList`.
- **Pied de page** : contact, LinkedIn, GitHub (à fournir), plan du site, mentions légales.

## 6. Données structurées

Graphe unique par page (`@graph`), généré côté serveur, échappé correctement (remplacer `<` par `<` dans le JSON sérialisé pour éviter toute fermeture prématurée de `<script>`).

| Type | Pages | Contenu |
|---|---|---|
| `Person` (`@id: /#person`) | toutes, référencé | nom, `jobTitle`, `url`, `image`, `sameAs` (LinkedIn, GitHub, Malt si pertinent), `knowsAbout`, `address` limitée à la ville |
| `WebSite` (`@id: /#website`) | toutes | `publisher` -> `/#person` |
| `ProfilePage` | `/a-propos` | `mainEntity` -> `/#person` |
| `CollectionPage` + `ItemList` | `/projets`, `/posts`, catégories | liste ordonnée des éléments |
| `CreativeWork` | `/projets/[slug]` | `author`, `dateCreated`, `about`, lien vers le site livré si public |
| `BlogPosting` | `/posts/[slug]` | existant, à rattacher à `/#person` comme auteur |
| `BreadcrumbList` | toutes sauf la home | existant, à conserver |

À **supprimer** : `CreativeWorkSeries` + `AggregateRating` (note non vérifiable), `FAQPage` de la home (contenu invisible). Les `FAQPage` d'articles peuvent rester s'ils correspondent à une FAQ visible. Pas de `Review` ni `AggregateRating` à partir des témoignages : Google n'accepte pas les avis publiés par la personne évaluée sur elle-même. `Place` avec adresse postale complète : à remplacer par la ville seule dans `Person`, sauf raison légale de publier l'adresse (déjà présente dans les mentions légales).

## 7. Canonicalisation, sitemap, robots

- Canonical absolu, sans slash final, construit depuis `site` d'`astro.config.ts` plutôt que depuis `PUBLIC_URL` (aujourd'hui le build local produit `https://localhost:4321/...`).
- `trailingSlash: 'never'` dans Astro + redirection 308 côté Vercel des URL avec slash.
- Sitemap généré par `@astrojs/sitemap`, sans slash, excluant `/old` et toute page `noindex`, avec `lastmod` réel issu de Sanity (`_updatedAt`).
- `robots.txt` : inchangé dans l'esprit (tout autorisé, lien vers `sitemap-index.xml`). Ne pas bloquer `/_astro/` (CSS et JS nécessaires au rendu).
- `llms.txt` et une vue texte du site (`/index.txt` ou équivalent) générés au build depuis les mêmes contenus : coût de maintenance nul, et démonstration directe de la compétence SEO (idée observée chez basement.studio, voir `research.md`).
- Pages de prototypes (`docs/redesign/prototypes`) : hors build, jamais publiées.

## 8. Rendu et accessibilité du contenu sans effets

Principe non négociable, valable pour les trois directions : **tout le contenu et tous les liens existent dans le HTML servi**, avant tout JavaScript.

- Pages prérendues au build (`prerender = true`) pour tout ce qui ne dépend pas de la requête : home, projets, à propos, contact, articles, catégories. La revalidation se fait au redéploiement déclenché par un webhook Sanity. Seule la route de commentaires reste en fonction serveur. Gain attendu : TTFB servi depuis le CDN, plus de dépendance à l'ISR.
- Les effets (WebGL, animations de défilement, transitions) sont des **améliorations** posées sur un document complet : un visiteur sans JavaScript, un lecteur d'écran ou un robot obtient le même texte, les mêmes titres et les mêmes liens.
- Aucune information n'est portée uniquement par une scène 3D, une animation ou un survol : chaque projet affiché dans une scène existe aussi en liste HTML.
- Pas de défilement détourné qui empêcherait le lien d'ancre, la recherche dans la page ou le retour arrière.

## 9. Architecture technique cible

### 9.1 Sources de contenu

| Contenu | Source recommandée | Raison |
|---|---|---|
| Articles, catégories | Sanity (inchangé) | Flux éditorial existant, 69 articles |
| Études de cas | Collections de contenu Astro (MDX versionné dans le dépôt) | Elles embarquent des démonstrations interactives écrites en code ; elles évoluent avec le code et se relisent en revue |
| Témoignages, références courtes | Sanity ou JSON du dépôt (déjà `references.json`) | Faible volume |
| Données personnelles (`Person`) | un seul module de configuration | une source pour le JSON-LD, le pied de page et `/a-propos` |

### 9.2 Couches de rendu

1. **HTML + CSS** (Astro, zéro JS par défaut) : typographie, grille, contenu, navigation, états de focus, transitions de page natives (`@view-transition`) quand le navigateur les supporte.
2. **Îlots interactifs** (Astro islands, hydratés `client:visible` ou `client:idle`) : formulaire de commentaire, démonstrations des études de cas, menu mobile si nécessaire.
3. **Couche créative** (selon la direction) : chargée après le contenu principal, derrière une détection de capacités (`WebGL2`, mémoire, `prefers-reduced-motion`, `saveData`), avec repli statique. Détail et budgets : `performance-budget.md`.

### 9.3 Dépendances

- Pas de framework d'animation global par défaut. GSAP est déjà présent (menu mobile actuel) : il ne sera gardé que si une interaction le justifie et chargé seulement sur la page qui en a besoin.
- Pas de bibliothèque de défilement doux (Lenis ou équivalent) : le défilement natif reste la norme. Les constats mesurés qui motivent ce choix sont dans `performance-budget.md` (§ 3.5).
- Three.js uniquement si la direction retenue l'exige, importé dynamiquement, jamais dans le bundle initial (voir `performance-budget.md`).
- React : conservé pour les îlots existants (fil d'Ariane, formulaire, pied de page) ; le fil d'Ariane et le pied de page peuvent devenir des composants `.astro` sans JS.

## 10. Points dépendant de la direction retenue

| Sujet | Éditoriale (A) | WebGL (B) | Atelier (C) |
|---|---|---|---|
| Structure de la home | index typographique long | champ plein écran + panneaux | suite de planches avec spécimens |
| Projets | table index + pages longues | marqueurs sur le champ + liste HTML équivalente | planches avec démonstration intégrée |
| Couche créative | aucune (CSS uniquement) | shader plein écran sur toutes les pages | spécimens locaux chargés à la demande |
| Risque SEO | très faible | moyen (discipline du HTML parallèle) | faible |

Le détail de chaque direction est dans `directions.md`.

## 11. À fournir par Johan avant l'implémentation

1. Export Google Search Console (pages, requêtes, liens) sur 16 mois.
2. Liens LinkedIn, GitHub et éventuels autres profils pour `sameAs`.
3. Justificatifs des chiffres listés en 2.3, ou accord pour les retirer.
4. Pour chaque étude de cas : rôle exact, période, ce qui peut être montré (captures, code, URL publique), et un résultat vérifiable s'il existe.
5. Photo récente si la direction en utilise une.
