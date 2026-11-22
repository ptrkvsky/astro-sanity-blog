import type { Graph } from 'schema-dts';
import { seoConfig } from '../config';
import { person } from '../config/person';
import { award, cvSeo, headline } from '../features/cv/data/cv';

export function getGraphCv(): Graph {
  const home = `${seoConfig.productionURL}/`;
  const url = `${home}cv`;
  const personId = `${home}#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profilepage`,
        url,
        name: cvSeo.title,
        description: cvSeo.description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${home}#website` },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: person.name,
        url: home,
        jobTitle: headline.title,
        worksFor: { '@type': 'Organization', name: 'SAFTI', url: 'https://www.safti.fr/' },
        homeLocation: { '@type': 'Place', name: person.city },
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'Performance web', 'SEO technique'],
        sameAs: [person.links.linkedin, person.links.github],
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}#draw-me-a-sheep`,
        name: award.project,
        url: 'https://www.drawmeasheep.fr/',
        award: award.name,
        contributor: { '@id': personId },
        sameAs: award.url,
      },
    ],
  };
}
