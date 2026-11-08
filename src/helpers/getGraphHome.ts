import type { Graph } from 'schema-dts';
import { seoConfig } from '../config';
import { homeSeo, links, site, email } from '../features/home-epreuve/content';

// Le graphe décrit uniquement le portfolio et son auteur, sans avis ni tarifs supposés.
export function getGraphHome(): Graph {
  const url = `${seoConfig.productionURL}/`;
  const personId = `${url}#person`;
  const websiteId = `${url}#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url,
        name: `${site.author} · developpeur-web.tech`,
        description: homeSeo.description,
        inLanguage: 'fr-FR',
        publisher: { '@id': personId },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: homeSeo.title,
        description: homeSeo.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.author,
        url,
        jobTitle: site.role,
        email,
        homeLocation: { '@type': 'Place', name: site.city },
        sameAs: [links.linkedin, links.github],
      },
    ],
  };
}
