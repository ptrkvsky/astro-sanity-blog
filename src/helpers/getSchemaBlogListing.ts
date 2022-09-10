import type { Graph, WebSite } from 'schema-dts';
import { seoConfig } from 'src/config';
import getGraphWebsite from './getGraphWebsite';

const getSchemaBlogListing = (dateModified: string) => {
  const website = getGraphWebsite();
  const datePublishedISO = new Date('01 September 2022').toISOString();
  const dateModifiedISO = new Date(dateModified).toISOString();

  const schema: Graph = {
    '@context': 'https://schema.org',
    '@graph': [
      website,
      {
        '@type': 'WebPage',
        '@id': `${seoConfig.baseURL}/posts/#webpage`,
        url: `${seoConfig.baseURL}/posts/`,
        name: 'Blog de développeur spécialisé en React, Javascript, et SEO | Johan Petrikovsky',
        isPartOf: {
          '@id': `${seoConfig.baseURL}/#website`,
        },
        datePublished: datePublishedISO,
        dateModified: dateModifiedISO,
        description:
          'Le Blog de Johan Petrikovsky développeur React, vous donne chaque semaine des conseils pour avoir un code toujours plus performant',
        breadcrumb: {
          '@id': `${seoConfig.baseURL}/posts/#breadcrumb`,
        },
        inLanguage: 'fr-FR',
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: [`${seoConfig.baseURL}/posts/`],
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${seoConfig.baseURL}/posts/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: `${seoConfig.baseURL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog WebConversion',
          },
        ],
      },
    ],
  };

  return schema;
};

export default getSchemaBlogListing;
