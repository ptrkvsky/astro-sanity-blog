import type { Graph } from 'schema-dts';
import { seoConfig } from 'src/config';
import getGraphWebsite from './getGraphWebsite';
interface ListingOptions {
  title: string;
  description: string;
  path: string;
  posts: { title: string; slug: { current: string }; _updatedAt?: string }[];
}
export default function getSchemaBlogListing({
  title,
  description,
  path,
  posts,
}: ListingOptions): Graph {
  const url = `${seoConfig.productionURL}${path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      getGraphWebsite(seoConfig.productionURL),
      {
        '@type': 'CollectionPage',
        '@id': `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': `${seoConfig.productionURL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: post.title,
            url: `${seoConfig.productionURL}/posts/${post.slug.current}`,
          })),
        },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Accueil',
            item: `${seoConfig.productionURL}/`,
          },
          ...(path !== '/posts'
            ? [
                {
                  '@type': 'ListItem' as const,
                  position: 2,
                  name: 'Articles',
                  item: `${seoConfig.productionURL}/posts`,
                },
              ]
            : []),
          {
            '@type': 'ListItem',
            position: path === '/posts' ? 2 : 3,
            name: title,
            item: url,
          },
        ],
      },
    ],
  };
}
